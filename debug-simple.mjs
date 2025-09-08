import { db } from "./src/app/db/index.js";
import {
  propertiesTable,
  propertyClassesTable,
  propertyPropertyClassesTable,
} from "./src/app/db/schema.js";

async function debugClasses() {
  try {
    console.log("=== DEBUG CLASSES ===");

    // 1. Verificar classes existentes
    const classes = await db.select().from(propertyClassesTable);
    console.log("\n📋 Classes no banco:", classes);

    // 2. Verificar propriedades
    const properties = await db
      .select({
        id: propertiesTable.id,
        title: propertiesTable.title,
        status: propertiesTable.status,
      })
      .from(propertiesTable);
    console.log("\n🏠 Propriedades no banco:", properties);

    // 3. Verificar associações
    const associations = await db.select().from(propertyPropertyClassesTable);
    console.log("\n🔗 Associações propriedade-classe:", associations);

    // 4. Verificar se há propriedades com classe "Imóvel em Destaque"
    const featured = await db
      .select({
        propertyId: propertyPropertyClassesTable.propertyId,
        className: propertyClassesTable.name,
      })
      .from(propertyPropertyClassesTable)
      .leftJoin(
        propertyClassesTable,
        eq(propertyPropertyClassesTable.classId, propertyClassesTable.id),
      )
      .where(eq(propertyClassesTable.name, "Imóvel em Destaque"));

    console.log('\n⭐ Propriedades com "Imóvel em Destaque":', featured);
  } catch (error) {
    console.error("❌ Erro:", error);
  }
}

debugClasses();
