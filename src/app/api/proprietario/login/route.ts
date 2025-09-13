import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

import { db } from "@/app/db";
import { ownersTable } from "@/app/db/schema";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email e senha são obrigatórios" },
        { status: 400 },
      );
    }

    // Buscar o proprietário pelo email
    const [owner] = await db
      .select({
        id: ownersTable.id,
        fullName: ownersTable.fullName,
        email: ownersTable.email,
        phone: ownersTable.phone,
        instagram: ownersTable.instagram,
        website: ownersTable.website,
        profileImage: ownersTable.profileImage,
        password: ownersTable.password,
        isActive: ownersTable.isActive,
      })
      .from(ownersTable)
      .where(eq(ownersTable.email, email))
      .limit(1);

    if (!owner) {
      return NextResponse.json(
        { error: "Email ou senha incorretos" },
        { status: 401 },
      );
    }

    if (!owner.isActive) {
      return NextResponse.json(
        { error: "Conta desativada. Entre em contato com o suporte" },
        { status: 401 },
      );
    }

    // Verificar a senha
    const isPasswordValid = await bcrypt.compare(password, owner.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Email ou senha incorretos" },
        { status: 401 },
      );
    }

    // Retornar dados do proprietário (sem a senha)
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
    console.error("Erro no login do proprietário:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 },
    );
  }
}
