import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";

import { db } from "@/app/db";
import { ownersTable, propertiesTable } from "@/app/db/schema";

/**
 * Script para migrar IDs de proprietários de serial para nanoid
 * Este script deve ser executado APÓS a migração de schema
 */
async function migrateOwnerIds() {
  console.log("🔄 Iniciando migração de IDs de proprietários...");

  try {
    // 1. Buscar todos os proprietários existentes
    const owners = await db.select().from(ownersTable);
    console.log(`📊 Encontrados ${owners.length} proprietários para migrar`);

    if (owners.length === 0) {
      console.log("✅ Nenhum proprietário encontrado. Migração completa!");
      return;
    }

    // 2. Para cada proprietário, gerar novo ID e atualizar referências
    for (const owner of owners) {
      const oldId = owner.id;
      const newId = nanoid();

      console.log(`🔄 Migrando proprietário ${oldId} -> ${newId}`);

      // 2a. Atualizar propriedades que referenciam este proprietário
      const propertiesUpdated = await db
        .update(propertiesTable)
        .set({ ownerId: newId })
        .where(eq(propertiesTable.ownerId, oldId));

      console.log(
        `  📝 Propriedades atualizadas: ${propertiesUpdated.rowCount || 0}`,
      );

      // 2b. Atualizar o ID do proprietário
      await db
        .update(ownersTable)
        .set({ id: newId })
        .where(eq(ownersTable.id, oldId));

      console.log(`  ✅ Proprietário ${oldId} migrado para ${newId}`);
    }

    console.log("🎉 Migração de IDs de proprietários concluída com sucesso!");
  } catch (error) {
    console.error("❌ Erro durante a migração:", error);
    throw error;
  }
}

// Função para reverter a migração (em caso de problemas)
async function rollbackOwnerIds() {
  console.log("⚠️  ATENÇÃO: Esta função está apenas como referência");
  console.log(
    "   Para reverter, você precisará de um backup do banco original",
  );
  console.log("   Não execute este rollback sem ter certeza!");
}

// Executar migração
if (require.main === module) {
  migrateOwnerIds()
    .then(() => {
      console.log("✅ Script de migração finalizado");
      process.exit(0);
    })
    .catch((error) => {
      console.error("❌ Falha na migração:", error);
      process.exit(1);
    });
}

export { migrateOwnerIds, rollbackOwnerIds };
