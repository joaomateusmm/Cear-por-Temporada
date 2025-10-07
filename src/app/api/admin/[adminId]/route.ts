import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

import { db } from "@/app/db";
import { usersTable } from "@/app/db/schema";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ adminId: string }> },
) {
  try {
    const { adminId } = await params;
    const adminIdNum = parseInt(adminId);

    if (isNaN(adminIdNum)) {
      return NextResponse.json(
        { error: "ID de administrador inválido" },
        { status: 400 },
      );
    }

    const adminUser = await db
      .select({
        id: usersTable.id,
        name: usersTable.name,
        email: usersTable.email,
        isActive: usersTable.isActive,
      })
      .from(usersTable)
      .where(eq(usersTable.id, adminIdNum))
      .limit(1);

    if (adminUser.length === 0) {
      return NextResponse.json(
        { error: "Administrador não encontrado" },
        { status: 404 },
      );
    }

    if (!adminUser[0].isActive) {
      return NextResponse.json(
        { error: "Conta de administrador desativada" },
        { status: 403 },
      );
    }

    return NextResponse.json(adminUser[0]);
  } catch (error) {
    console.error("Erro ao buscar administrador:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 },
    );
  }
}
