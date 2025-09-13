import { eq, sql } from "drizzle-orm";
import { nanoid } from "nanoid";

import { db } from "@/app/db";
import { ownersTable, propertiesTable } from "@/app/db/schema";

/**
 * Script para migrar IDs de proprietários de serial para nanoid
 * Versão segura que preserva dados
 */
async function safelyMigrateOwnerIds() {
  console.log("🔄 Iniciando migração segura de IDs de proprietários...");

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
      idMapping.set(owner.id, nanoid());
    });

    console.log("🔄 Iniciando transação para migração...");

    // 4. Executar migração em transação
    await db.transaction(async (tx) => {
      // 4a. Criar tabela temporária para mapeamento
      await tx.execute(sql`
        CREATE TEMPORARY TABLE temp_owner_id_mapping (
          old_id varchar(21),
          new_id varchar(21)
        )
      `);

      // 4b. Inserir mapeamentos
      for (const [oldId, newId] of idMapping.entries()) {
        await tx.execute(sql`
          INSERT INTO temp_owner_id_mapping (old_id, new_id) 
          VALUES (${oldId}, ${newId})
        `);
      }

      // 4c. Atualizar referências em properties
      console.log("🔄 Atualizando referências em properties...");
      await tx.execute(sql`
        UPDATE properties 
        SET owner_id = temp_owner_id_mapping.new_id
        FROM temp_owner_id_mapping 
        WHERE properties.owner_id = temp_owner_id_mapping.old_id
      `);

      // 4d. Atualizar IDs na tabela owners
      console.log("🔄 Atualizando IDs na tabela owners...");
      for (const [oldId, newId] of idMapping.entries()) {
        await tx
          .update(ownersTable)
          .set({ id: newId })
          .where(eq(ownersTable.id, oldId));
      }

      console.log("✅ Dados migrados com sucesso!");
    });

    // 5. Aplicar mudanças de schema (ALTER TABLE)
    await applySchemaChanges();

    console.log("🎉 Migração completa de IDs de proprietários concluída!");
  } catch (error) {
    console.error("❌ Erro durante a migração:", error);
    console.log("🔄 A transação foi revertida automaticamente");
    throw error;
  }
}

async function applySchemaChanges() {
  console.log("🔄 Aplicando mudanças de schema...");

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
    await db.execute(
      sql`ALTER TABLE owners ALTER COLUMN id SET DATA TYPE varchar(21)`,
    );
    await db.execute(
      sql`ALTER TABLE properties ALTER COLUMN owner_id SET DATA TYPE varchar(21)`,
    );

    console.log("✅ Schema atualizado para varchar(21)");
  } catch (error) {
    console.error("❌ Erro ao aplicar mudanças de schema:", error);
    throw error;
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
      `❌ ${invalidOwnerIds.length} proprietários com IDs inválidos`,
    );
    return false;
  }

  if (invalidPropertyOwnerIds.length > 0) {
    console.error(
      `❌ ${invalidPropertyOwnerIds.length} propriedades com owner_id inválidos`,
    );
    return false;
  }

  console.log("✅ Migração verificada com sucesso!");
  return true;
}

// Executar migração
if (require.main === module) {
  safelyMigrateOwnerIds()
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

export { safelyMigrateOwnerIds, verifyMigration };
