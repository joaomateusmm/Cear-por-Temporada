import { sql } from "drizzle-orm";
import { nanoid } from "nanoid";

import { db } from "@/app/db";
import { ownersTable, propertiesTable } from "@/app/db/schema";

interface OwnerBackup {
  id: string;
  fullName: string;
  email: string;
  password: string;
  phone: string | null;
  instagram: string | null;
  website: string | null;
  profileImage: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Script completo para migrar IDs de proprietários
 * 1. Faz backup dos dados
 * 2. Altera schema
 * 3. Migra dados com novos IDs
 */
async function completeMigrateOwnerIds() {
  console.log("🔄 Iniciando migração completa de IDs de proprietários...");

  try {
    // 1. Verificar estado atual
    const currentOwners = await db.select().from(ownersTable);
    console.log(`📊 Encontrados ${currentOwners.length} proprietários`);

    if (currentOwners.length === 0) {
      console.log(
        "✅ Nenhum proprietário encontrado. Apenas atualizando schema...",
      );
      await updateSchema();
      return;
    }

    // Verificar se já está migrado
    if (currentOwners[0] && currentOwners[0].id.length === 21) {
      console.log(
        "✅ IDs já estão no formato nanoid. Migração não necessária.",
      );
      return;
    }

    // 2. Fazer backup dos dados dos proprietários
    console.log("💾 Fazendo backup dos dados...");
    const ownerBackups: OwnerBackup[] = currentOwners.map((owner) => ({
      ...owner,
    }));

    // 3. Fazer backup das propriedades relacionadas
    const relatedProperties = await db
      .select()
      .from(propertiesTable)
      .where(sql`owner_id IS NOT NULL`);
    console.log(
      `📊 Encontradas ${relatedProperties.length} propriedades com proprietários`,
    );

    // 4. Criar mapeamento old_id -> new_id
    const idMapping = new Map<string, string>();
    ownerBackups.forEach((owner) => {
      idMapping.set(owner.id, nanoid());
    });

    console.log("🔄 Mapeamento de IDs:");
    idMapping.forEach((newId, oldId) => {
      console.log(`  ${oldId} -> ${newId}`);
    });

    // 5. Deletar todos os dados existentes (em ordem correta para respeitar FK)
    console.log("🗑️ Removendo dados existentes...");
    await db.delete(propertiesTable).where(sql`owner_id IS NOT NULL`);
    await db.delete(ownersTable);

    // 6. Atualizar schema
    await updateSchema();

    // 7. Reinserir proprietários com novos IDs
    console.log("📥 Reinserindo proprietários com novos IDs...");
    for (const ownerBackup of ownerBackups) {
      const newId = idMapping.get(ownerBackup.id)!;

      await db.insert(ownersTable).values({
        ...ownerBackup,
        id: newId,
      });

      console.log(
        `  ✅ Proprietário ${ownerBackup.fullName} reinserido com ID ${newId}`,
      );
    }

    // 8. Reinserir propriedades com owner_id atualizados
    console.log("🏠 Reinserindo propriedades com owner_id atualizados...");
    for (const property of relatedProperties) {
      const newOwnerId = property.ownerId
        ? idMapping.get(property.ownerId)
        : null;

      await db.insert(propertiesTable).values({
        ...property,
        ownerId: newOwnerId,
      });

      console.log(
        `  ✅ Propriedade ${property.title} reinserida com owner_id ${newOwnerId}`,
      );
    }

    console.log("🎉 Migração completa de IDs de proprietários concluída!");
  } catch (error) {
    console.error("❌ Erro durante a migração:", error);
    console.log(
      "⚠️  ATENÇÃO: Dados podem ter sido perdidos. Restore do backup necessário!",
    );
    throw error;
  }
}

async function updateSchema() {
  console.log("🔄 Atualizando schema do banco...");

  try {
    // Alterar coluna owners.id
    await db.execute(sql`ALTER TABLE owners ALTER COLUMN id TYPE varchar(21)`);
    console.log("✅ owners.id alterado para varchar(21)");

    // Alterar coluna properties.owner_id
    await db.execute(
      sql`ALTER TABLE properties ALTER COLUMN owner_id TYPE varchar(21)`,
    );
    console.log("✅ properties.owner_id alterado para varchar(21)");
  } catch (error) {
    console.error("❌ Erro ao atualizar schema:", error);
    if (
      error instanceof Error &&
      error.toString().includes("cannot be cast automatically")
    ) {
      console.log("ℹ️  Isso é esperado - continuando com migração de dados...");
    } else {
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
  completeMigrateOwnerIds()
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

export { completeMigrateOwnerIds, verifyMigration };
