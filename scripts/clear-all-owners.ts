import { sql } from "drizzle-orm";

import { db } from "@/app/db";
import { ownersTable, propertiesTable } from "@/app/db/schema";

/**
 * Script para limpar todos os proprietários da plataforma
 * Remove todos os proprietários e propriedades relacionadas
 */
async function clearAllOwners() {
  console.log("🗑️ Iniciando limpeza de todos os proprietários...");

  try {
    // 1. Primeiro, deletar todas as propriedades (para evitar problemas de FK)
    console.log("🏠 Removendo todas as propriedades...");
    const deletedProperties = await db.delete(propertiesTable);
    console.log(`✅ ${deletedProperties.rowCount || 0} propriedades removidas`);

    // 2. Depois, deletar todos os proprietários
    console.log("👤 Removendo todos os proprietários...");
    const deletedOwners = await db.delete(ownersTable);
    console.log(`✅ ${deletedOwners.rowCount || 0} proprietários removidos`);

    // 3. Verificar se tudo foi removido
    const remainingOwners = await db.select().from(ownersTable);
    const remainingProperties = await db.select().from(propertiesTable);

    console.log(`📊 Proprietários restantes: ${remainingOwners.length}`);
    console.log(`📊 Propriedades restantes: ${remainingProperties.length}`);

    if (remainingOwners.length === 0 && remainingProperties.length === 0) {
      console.log("🎉 Limpeza completa realizada com sucesso!");
      console.log(
        "💡 Agora você pode criar novos proprietários com IDs nanoid",
      );
    } else {
      console.log("⚠️ Alguns registros podem não ter sido removidos");
    }
  } catch (error) {
    console.error("❌ Erro durante a limpeza:", error);
    throw error;
  }
}

// Função para resetar sequências (caso necessário)
async function resetSequences() {
  console.log("🔄 Resetando sequências...");

  try {
    // Reset da sequência de owners (se ainda existir)
    await db.execute(sql`
      SELECT setval(pg_get_serial_sequence('owners', 'id'), 1, false)
    `);
    console.log("✅ Sequência de owners resetada");
  } catch {
    console.log("ℹ️ Sequência de owners não existe ou já foi removida");
  }
}

// Executar limpeza
if (require.main === module) {
  clearAllOwners()
    .then(() => resetSequences())
    .then(() => {
      console.log("✅ Script de limpeza finalizado com sucesso");
      console.log(
        "💡 Agora você pode criar novos proprietários que usarão nanoid",
      );
      process.exit(0);
    })
    .catch((error) => {
      console.error("❌ Falha na limpeza:", error);
      process.exit(1);
    });
}

export { clearAllOwners, resetSequences };
