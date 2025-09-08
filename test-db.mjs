import { db } from "./src/app/db/index.js";
import { propertyClassesTable } from "./src/app/db/schema.js";

async function testConnection() {
  try {
    console.log("Testando conexão com o banco...");
    const result = await db.select().from(propertyClassesTable).limit(1);
    console.log("Conexão bem-sucedida! Classes encontradas:", result.length);
    console.log("Dados:", result);
  } catch (error) {
    console.error("Erro na conexão:", error.message);
  }
}

testConnection();
