import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

import { db } from "@/app/db";
import { ownersTable } from "@/app/db/schema";

export async function POST(req: NextRequest) {
  try {
    const { fullName, email, password, phone } = await req.json();

    if (!fullName || !email || !password) {
      return NextResponse.json(
        { error: "Nome, email e senha são obrigatórios" },
        { status: 400 },
      );
    }

    // Verificar se o email já existe
    const [existingOwner] = await db
      .select({ id: ownersTable.id })
      .from(ownersTable)
      .where(eq(ownersTable.email, email))
      .limit(1);

    if (existingOwner) {
      return NextResponse.json(
        { error: "Email já está em uso" },
        { status: 409 },
      );
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 12);

    // Criar o proprietário
    const [newOwner] = await db
      .insert(ownersTable)
      .values({
        fullName,
        email,
        password: hashedPassword,
        phone: phone || null,
      })
      .returning({
        id: ownersTable.id,
        fullName: ownersTable.fullName,
        email: ownersTable.email,
        phone: ownersTable.phone,
      });

    return NextResponse.json(newOwner);
  } catch (error) {
    console.error("Erro no cadastro do proprietário:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 },
    );
  }
}
