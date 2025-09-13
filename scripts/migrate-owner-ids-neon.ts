import { eq, sql } from "drizzle-orm";
import { nanoid } from "nanoid";

import { db } from "@/app/db";
import { ownersTable, propertiesTable } from "@/app/db/schema";

/**
 * Script para migrar IDs de proprietários de serial para nanoid
 * Versão para driver neon-http (sem suporte a transações)
 */
async function migrateOwnerIdsNeon() {
  console.log("🔄 Iniciando migração de IDs de proprietários (Neon)...");

  try {
    // 1. Verificar se já existem proprietários com IDs do tipo nanoid
    const sampleOwner = await db
      .select({ id: ownersTable.id })
      .from(ownersTable)
      .limit(1);
    if (sampleOwner.length > 0 && sampleOwner[0].id.length === 21) {
      console.log(
        "✅ IDs já estão no formato nanoid. Migração não necessária.",
      );
      return;
    }

    // 2. Buscar todos os proprietários existentes
    const owners = await db.select().from(ownersTable);
    console.log(`📊 Encontrados ${owners.length} proprietários para migrar`);

    if (owners.length === 0) {
      console.log(
        "✅ Nenhum proprietário encontrado. Aplicando apenas mudança de schema...",
      );
      await applySchemaChanges();
      return;
    }

    // 3. Criar mapeamento old_id -> new_id
    const idMapping = new Map<string, string>();
    owners.forEach((owner) => {
      const newId = nanoid();
      idMapping.set(owner.id, newId);
      console.log(`🔄 Mapeamento: ${owner.id} -> ${newId}`);
    });

    // 4. Primeiro, atualizar todas as propriedades
    console.log("🔄 Atualizando referências em properties...");
    for (const [oldId, newId] of idMapping.entries()) {
      const result = await db
        .update(propertiesTable)
        .set({ ownerId: newId })
        .where(eq(propertiesTable.ownerId, oldId));

      console.log(
        `  📝 Propriedades do owner ${oldId}: ${result.rowCount || 0} atualizadas`,
      );
    }

    // 5. Depois, atualizar os IDs dos proprietários
    console.log("🔄 Atualizando IDs na tabela owners...");
    for (const [oldId, newId] of idMapping.entries()) {
      // Como não podemos alterar a PK diretamente, vamos fazer um processo especial
      const owner = owners.find((o) => o.id === oldId);
      if (!owner) continue;

      // Deletar o registro antigo e inserir com novo ID
      await db.delete(ownersTable).where(eq(ownersTable.id, oldId));

      await db.insert(ownersTable).values({
        ...owner,
        id: newId,
      });

      console.log(`  ✅ Proprietário ${oldId} migrado para ${newId}`);
    }

    // 6. Aplicar mudanças de schema se necessário
    await applySchemaChanges();

    console.log("🎉 Migração de IDs de proprietários concluída!");
  } catch (error) {
    console.error("❌ Erro durante a migração:", error);
    throw error;
  }
}

async function applySchemaChanges() {
  console.log("🔄 Verificando schema...");

  try {
    // Verificar se as colunas já são varchar(21)
    const result = await db.execute(sql`
      SELECT data_type, character_maximum_length 
      FROM information_schema.columns 
      WHERE table_name = 'owners' AND column_name = 'id'
    `);

    if (result.rows.length > 0) {
      const columnInfo = result.rows[0] as {
        data_type: string;
        character_maximum_length: number;
      };
      if (
        columnInfo.data_type === "character varying" &&
        columnInfo.character_maximum_length === 21
      ) {
        console.log("✅ Schema já atualizado para varchar(21)");
        return;
      }
    }

    // Aplicar mudanças de schema
    console.log("🔄 Aplicando mudanças de schema...");
    await db.execute(
      sql`ALTER TABLE owners ALTER COLUMN id SET DATA TYPE varchar(21)`,
    );
    await db.execute(
      sql`ALTER TABLE properties ALTER COLUMN owner_id SET DATA TYPE varchar(21)`,
    );

    console.log("✅ Schema atualizado para varchar(21)");
  } catch (error) {
    console.error("❌ Erro ao aplicar mudanças de schema:", error);
    // Não falhar se já estiver aplicado
    if (
      !(
        error instanceof Error &&
        error.toString().includes("cannot be cast automatically")
      )
    ) {
      throw error;
    }
  }
}

// Função para verificar integridade após migração
async function verifyMigration() {
  console.log("🔍 Verificando integridade da migração...");

  const owners = await db.select().from(ownersTable);
  const properties = await db
    .select()
    .from(propertiesTable)
    .where(sql`owner_id IS NOT NULL`);

  console.log(`📊 Proprietários: ${owners.length}`);
  console.log(`📊 Propriedades com proprietário: ${properties.length}`);

  // Verificar se todos os IDs são nanoid (21 caracteres)
  const invalidOwnerIds = owners.filter((owner) => owner.id.length !== 21);
  const invalidPropertyOwnerIds = properties.filter(
    (prop) => prop.ownerId && prop.ownerId.length !== 21,
  );

  if (invalidOwnerIds.length > 0) {
    console.error(
      `❌ ${invalidOwnerIds.length} proprietários com IDs inválidos:`,
      invalidOwnerIds.map((o) => o.id),
    );
    return false;
  }

  if (invalidPropertyOwnerIds.length > 0) {
    console.error(
      `❌ ${invalidPropertyOwnerIds.length} propriedades com owner_id inválidos`,
    );
    return false;
  }

  // Verificar se todas as referências são válidas
  for (const property of properties) {
    if (property.ownerId) {
      const ownerExists = owners.some((owner) => owner.id === property.ownerId);
      if (!ownerExists) {
        console.error(
          `❌ Propriedade ${property.id} referencia owner inexistente: ${property.ownerId}`,
        );
        return false;
      }
    }
  }

  console.log("✅ Migração verificada com sucesso!");
  return true;
}

// Executar migração
if (require.main === module) {
  migrateOwnerIdsNeon()
    .then(() => verifyMigration())
    .then((success) => {
      if (success) {
        console.log("✅ Script de migração finalizado com sucesso");
      } else {
        console.log("❌ Migração completada mas com problemas de integridade");
      }
      process.exit(success ? 0 : 1);
    })
    .catch((error) => {
      console.error("❌ Falha na migração:", error);
      process.exit(1);
    });
}

export { migrateOwnerIdsNeon, verifyMigration };
