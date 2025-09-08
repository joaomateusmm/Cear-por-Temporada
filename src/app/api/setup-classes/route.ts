import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

import { db } from "@/app/db";
import { propertyClassesTable } from "@/app/db/schema";

export async function GET() {
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

    const results = [];

    for (const classData of classes) {
      // Verificar se já existe
      const existing = await db
        .select()
        .from(propertyClassesTable)
        .where(eq(propertyClassesTable.name, classData.name));

      if (existing.length === 0) {
        await db.insert(propertyClassesTable).values(classData);
        results.push(`✅ Classe "${classData.name}" criada!`);
      } else {
        results.push(`ℹ️ Classe "${classData.name}" já existe.`);
      }
    }

    // Listar todas as classes
    const allClasses = await db.select().from(propertyClassesTable);

    return NextResponse.json({
      success: true,
      results,
      classes: allClasses,
    });
  } catch (error) {
    console.error("❌ Erro:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 500 },
    );
  }
}
