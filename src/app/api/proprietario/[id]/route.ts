import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

import { db } from "@/app/db";
import { ownersTable } from "@/app/db/schema";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const resolvedParams = await params;
    const ownerId = resolvedParams.id;

    if (!ownerId) {
      return NextResponse.json(
        { error: "ID do proprietário inválido" },
        { status: 400 },
      );
    }

    // Buscar o proprietário pelo ID
    const [owner] = await db
      .select({
        id: ownersTable.id,
        fullName: ownersTable.fullName,
        email: ownersTable.email,
        phone: ownersTable.phone,
        instagram: ownersTable.instagram,
        website: ownersTable.website,
        profileImage: ownersTable.profileImage,
        isActive: ownersTable.isActive,
      })
      .from(ownersTable)
      .where(eq(ownersTable.id, ownerId))
      .limit(1);

    if (!owner) {
      return NextResponse.json(
        { error: "Proprietário não encontrado" },
        { status: 404 },
      );
    }

    if (!owner.isActive) {
      return NextResponse.json({ error: "Conta desativada" }, { status: 401 });
    }

    // Retornar dados do proprietário
    return NextResponse.json({
      id: owner.id,
      fullName: owner.fullName,
      email: owner.email,
      phone: owner.phone,
      instagram: owner.instagram,
      website: owner.website,
      profileImage: owner.profileImage,
    });
  } catch (error) {
    console.error("Erro ao buscar proprietário:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 },
    );
  }
}
