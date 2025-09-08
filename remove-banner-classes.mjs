import { eq, like } from "drizzle-orm";

import { db } from "./src/app/db/index.ts";
import {
  propertyClassesTable,
  propertyPropertyClassesTable,
} from "./src/app/db/schema.ts";

async function removeBannerClasses() {
  try {
    console.log("🔄 Removendo classes de banner...");

    // Primeiro, buscar as classes de banner
    const bannerClasses = await db
      .select({ id: propertyClassesTable.id, name: propertyClassesTable.name })
      .from(propertyClassesTable)
      .where(like(propertyClassesTable.name, "%Banner%"));

    console.log(
      `📋 Encontradas ${bannerClasses.length} classes de banner:`,
      bannerClasses.map((c) => c.name),
    );

    // Remover associações de propriedades com essas classes
    for (const bannerClass of bannerClasses) {
      await db
        .delete(propertyPropertyClassesTable)
        .where(eq(propertyPropertyClassesTable.classId, bannerClass.id));

      console.log(`🗑️  Removidas associações para classe: ${bannerClass.name}`);
    }

    // Desativar as classes de banner
    const updatedClasses = await db
      .update(propertyClassesTable)
      .set({
        isActive: false,
        updatedAt: new Date(),
      })
      .where(like(propertyClassesTable.name, "%Banner%"))
      .returning({
        id: propertyClassesTable.id,
        name: propertyClassesTable.name,
      });

    console.log(
      `✅ Classes de banner desativadas:`,
      updatedClasses.map((c) => c.name),
    );
    console.log("🎉 Limpeza concluída com sucesso!");
  } catch (error) {
    console.error("❌ Erro ao remover classes de banner:", error);
  } finally {
    process.exit(0);
  }
}

removeBannerClasses();

removeBannerClasses();
