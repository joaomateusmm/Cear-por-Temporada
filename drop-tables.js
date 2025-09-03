import { db } from "./src/app/db/index.js";

async function dropAllTables() {
  try {
    console.log("Fazendo drop de todas as tabelas...");

    // Drop em ordem específica para evitar problemas de foreign key
    await db.execute(`DROP TABLE IF EXISTS reservations CASCADE;`);
    await db.execute(`DROP TABLE IF EXISTS property_availability CASCADE;`);
    await db.execute(`DROP TABLE IF EXISTS property_amenities CASCADE;`);
    await db.execute(`DROP TABLE IF EXISTS property_images CASCADE;`);
    await db.execute(`DROP TABLE IF EXISTS property_location CASCADE;`);
    await db.execute(`DROP TABLE IF EXISTS property_pricing CASCADE;`);
    await db.execute(`DROP TABLE IF EXISTS properties CASCADE;`);
    await db.execute(`DROP TABLE IF EXISTS amenities CASCADE;`);
    await db.execute(`DROP TABLE IF EXISTS users CASCADE;`);

    // Drop da tabela de migrações
    await db.execute(`DROP TABLE IF EXISTS __drizzle_migrations CASCADE;`);

    console.log("Todas as tabelas foram removidas com sucesso!");
  } catch (error) {
    console.error("Erro ao remover tabelas:", error);
  }
}

dropAllTables();
