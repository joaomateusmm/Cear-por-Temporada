import * as fs from "fs";
import * as path from "path";
import postgres from "postgres";

// Read SQL file
const sqlContent = fs.readFileSync(
  path.join(process.cwd(), "drizzle", "0003_manual_recreate.sql"),
  "utf-8",
);

// Connect to database
const connectionString = process.env.DATABASE_URL!;
const client = postgres(connectionString);

async function runMigration() {
  try {
    console.log("Executando migração manual...");
    await client.unsafe(sqlContent);
    console.log("Migração executada com sucesso!");
  } catch (error) {
    console.error("Erro na migração:", error);
  } finally {
    await client.end();
  }
}

runMigration();
