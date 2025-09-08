import "dotenv/config";

import { neon } from "@neondatabase/serverless";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/neon-http";

import { propertyClassesTable } from "./src/app/db/schema.ts";

// Configurar conexão com o banco
const sql = neon(process.env.DATABASE_URL);
const db = drizzle(sql);

async function createPropertyClasses() {
  try {
    console.log("Criando classes de propriedades...");

    const classes = [
      {
        name: "Imóvel em Destaque",
        description: "Imóveis destacados na página principal",
      },
      {
        name: "Destaque em Casas",
        description: "Casas em destaque na seção de casas",
      },
      {
        name: "Destaque em Apartamentos",
        description: "Apartamentos em destaque na seção de apartamentos",
      },
    ];

    for (const classData of classes) {
      // Verificar se já existe
      const existing = await db
        .select()
        .from(propertyClassesTable)
        .where(eq(propertyClassesTable.name, classData.name));

      if (existing.length === 0) {
        await db.insert(propertyClassesTable).values(classData);
        console.log(`Classe "${classData.name}" criada com sucesso!`);
      } else {
        console.log(`Classe "${classData.name}" já existe.`);
      }
    }

    console.log("Processo concluído!");
  } catch (error) {
    console.error("Erro ao criar classes:", error);
  }
}

createPropertyClasses();
