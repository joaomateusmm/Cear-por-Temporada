import { eq } from "drizzle-orm";

import { db } from "./src/app/db/index.js";
import { propertyClassesTable } from "./src/app/db/schema.js";

async function createClasses() {
  try {
    console.log("🔄 Criando classes de propriedades...");

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
        console.log(`✅ Classe "${classData.name}" criada!`);
      } else {
        console.log(`ℹ️ Classe "${classData.name}" já existe.`);
      }
    }

    // Listar todas as classes
    const allClasses = await db.select().from(propertyClassesTable);
    console.log("📋 Classes existentes:", allClasses);
  } catch (error) {
    console.error("❌ Erro:", error);
  }
}

createClasses();
