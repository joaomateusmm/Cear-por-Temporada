import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

import {
  properties,
  propertyClasses,
  propertyPropertyClasses,
} from "../../../../../drizzle/schema";
import { db } from "../../../db";

export async function GET() {
  try {
    console.log("🔍 Verificando classes de propriedades...");

    // Listar todas as classes existentes
    const allClasses = await db.select().from(propertyClasses);
    console.log("📋 Classes existentes no banco:");
    const classesInfo = allClasses.map((cls) => ({
      id: cls.id,
      name: cls.name,
    }));

    // Listar quantas propriedades cada classe tem
    console.log("\n📊 Propriedades por classe:");
    const classesWithCount = [];
    for (const cls of allClasses) {
      const count = await db
        .select()
        .from(propertyPropertyClasses)
        .innerJoin(
          properties,
          eq(propertyPropertyClasses.propertyId, properties.id),
        )
        .where(eq(propertyPropertyClasses.classId, cls.id))
        .then((result) => result.length);

      console.log(`  - "${cls.name}": ${count} propriedades`);
      classesWithCount.push({
        className: cls.name,
        count: count,
      });
    }

    // Listar propriedades ativas e suas classes
    console.log("\n🏠 Propriedades ativas e suas classes:");
    const activePropertiesWithClasses = await db
      .select({
        propertyId: properties.id,
        propertyTitle: properties.title,
        className: propertyClasses.name,
        propertyStatus: properties.status,
      })
      .from(properties)
      .leftJoin(
        propertyPropertyClasses,
        eq(properties.id, propertyPropertyClasses.propertyId),
      )
      .leftJoin(
        propertyClasses,
        eq(propertyPropertyClasses.classId, propertyClasses.id),
      )
      .where(eq(properties.status, "ativo"));

    const propertiesInfo = activePropertiesWithClasses.map((prop) => ({
      title: prop.propertyTitle,
      status: prop.propertyStatus,
      className: prop.className || "SEM CLASSE",
    }));

    activePropertiesWithClasses.forEach((prop) => {
      console.log(
        `  - ${prop.propertyTitle} (${prop.propertyStatus}) -> Classe: "${prop.className || "SEM CLASSE"}"`,
      );
    });

    return NextResponse.json({
      success: true,
      data: {
        allClasses: classesInfo,
        classesWithCount: classesWithCount,
        activeProperties: propertiesInfo,
      },
    });
  } catch (error) {
    console.error("❌ Erro ao verificar classes:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Erro interno do servidor",
      },
      { status: 500 },
    );
  }
}
