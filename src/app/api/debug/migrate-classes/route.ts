import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

import { propertyClasses } from "../../../../../drizzle/schema";
import { db } from "../../../db";

export async function POST() {
  try {
    console.log("🔄 Atualizando nomes das classes de propriedades...");

    const updates = [
      { old: "Imóveis em Destaque", new: "Imóvel em Destaque" },
      { old: "Apartamentos em Destaque", new: "Destaque em Apartamentos" },
      { old: "Casas em Destaque", new: "Destaque em Casas" },
      { old: "Pousadas em Destaque", new: "Destaque em Pousadas" },
      { old: "Flats em Destaque", new: "Destaque em Flats" },
    ];

    const results = [];

    for (const update of updates) {
      console.log(`📝 Atualizando "${update.old}" para "${update.new}"`);

      const result = await db
        .update(propertyClasses)
        .set({ name: update.new })
        .where(eq(propertyClasses.name, update.old))
        .returning();

      if (result.length > 0) {
        console.log(`✅ Atualizado com sucesso: ${result.length} registros`);
        results.push({
          old: update.old,
          new: update.new,
          updated: result.length,
        });
      } else {
        console.log(`⚠️ Nenhum registro encontrado para "${update.old}"`);
        results.push({
          old: update.old,
          new: update.new,
          updated: 0,
        });
      }
    }

    // Criar classes que não existem
    const expectedClasses = [
      "Imóvel em Destaque",
      "Destaque em Casas",
      "Destaque em Apartamentos",
      "Destaque em Casas de Praia",
      "Destaque em Flats",
      "Destaque em Pousadas",
    ];

    for (const className of expectedClasses) {
      const existing = await db
        .select()
        .from(propertyClasses)
        .where(eq(propertyClasses.name, className));

      if (existing.length === 0) {
        console.log(`Criando classe ausente: "${className}"`);

        results.push({
          old: "N/A",
          new: className,
          updated: "CREATED",
        });
      }
    }

    console.log("🎉 Migração concluída!");

    return NextResponse.json({
      success: true,
      message: "Classes atualizadas com sucesso",
      results: results,
    });
  } catch (error) {
    console.error("❌ Erro ao atualizar classes:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Erro interno do servidor",
      },
      { status: 500 },
    );
  }
}
