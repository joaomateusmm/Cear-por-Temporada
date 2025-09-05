import "dotenv/config";

import { db } from "./src/app/db";
import { propertyClassesTable } from "./src/app/db/schema";

async function seedPropertyClasses() {
  try {
    console.log("Inserindo classes de imóveis...");

    const classes = [
      {
        name: "Imóvel em Destaque",
        description: "Imóveis principais em destaque na página inicial",
      },
      {
        name: "Destaque em Casas",
        description: "Casas em destaque na seção específica",
      },
      {
        name: "Destaque em Apartamentos",
        description: "Apartamentos em destaque na seção específica",
      },
      { name: "Normal", description: "Classificação padrão para imóveis" },
    ];

    for (const classData of classes) {
      try {
        await db
          .insert(propertyClassesTable)
          .values(classData)
          .onConflictDoNothing();
        console.log(`Classe "${classData.name}" inserida/atualizada`);
      } catch (error) {
        console.log(
          `Classe "${classData.name}" já existe ou erro:`,
          error instanceof Error ? error.message : String(error),
        );
      }
    }

    console.log("Verificando classes inseridas...");
    const allClasses = await db.select().from(propertyClassesTable);
    console.log("Classes disponíveis:", allClasses);

    console.log("Processo concluído!");
  } catch (error) {
    console.error("Erro:", error);
  }

  process.exit(0);
}

seedPropertyClasses();
