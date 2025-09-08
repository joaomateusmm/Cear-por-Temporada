import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

import { db } from "@/app/db";
import {
  propertiesTable,
  propertyClassesTable,
  propertyPropertyClassesTable,
} from "@/app/db/schema";

export async function GET() {
  try {
    // Buscar todas as propriedades
    const properties = await db.select().from(propertiesTable);

    // Buscar todas as classes
    const classes = await db.select().from(propertyClassesTable);

    // Buscar todas as associações
    const associations = await db
      .select({
        propertyId: propertyPropertyClassesTable.propertyId,
        classId: propertyPropertyClassesTable.classId,
        className: propertyClassesTable.name,
      })
      .from(propertyPropertyClassesTable)
      .leftJoin(
        propertyClassesTable,
        eq(propertyPropertyClassesTable.classId, propertyClassesTable.id),
      );

    return NextResponse.json({
      success: true,
      data: {
        propertiesCount: properties.length,
        properties: properties.map((p) => ({ id: p.id, title: p.title })),
        classesCount: classes.length,
        classes,
        associationsCount: associations.length,
        associations,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 500 },
    );
  }
}
