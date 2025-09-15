import { sql } from "drizzle-orm";

import { db } from "@/app/db";
import { propertiesTable } from "@/app/db/schema";

export async function GET() {
  try {
    // Buscar todas as propriedades com seus status
    const allProperties = await db
      .select({
        id: propertiesTable.id,
        title: propertiesTable.title,
        status: propertiesTable.status,
        propertyStyle: propertiesTable.propertyStyle,
        createdAt: propertiesTable.createdAt,
      })
      .from(propertiesTable);

    // Contar por status
    const statusCount = await db
      .select({
        status: propertiesTable.status,
        count: sql<number>`count(*)`.as("count"),
      })
      .from(propertiesTable)
      .groupBy(propertiesTable.status);

    // Contar por tipo
    const typeCount = await db
      .select({
        propertyStyle: propertiesTable.propertyStyle,
        count: sql<number>`count(*)`.as("count"),
      })
      .from(propertiesTable)
      .groupBy(propertiesTable.propertyStyle);

    return Response.json({
      environment: process.env.NODE_ENV,
      timestamp: new Date().toISOString(),
      total: allProperties.length,
      statusBreakdown: statusCount,
      typeBreakdown: typeCount,
      recentProperties: allProperties.slice(-10).map((p) => ({
        id: p.id,
        title: p.title,
        status: p.status,
        propertyStyle: p.propertyStyle,
        createdAt: p.createdAt,
      })),
      message: "Debug de propriedades executado com sucesso",
    });
  } catch (error) {
    console.error("Erro no debug:", error);
    return Response.json(
      {
        error: "Erro interno do servidor",
        details: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 500 },
    );
  }
}
