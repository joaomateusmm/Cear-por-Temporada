import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";

import { db } from "@/app/db";
import { ownersTable } from "@/app/db/schema";

interface OwnerLoginData {
  email: string;
  password: string;
}

interface OwnerRegisterData {
  fullName: string;
  email: string;
  password: string;
  phone?: string;
}

interface OwnerResponse {
  id: number;
  fullName: string;
  email: string;
}

export async function loginOwner(data: OwnerLoginData): Promise<OwnerResponse> {
  try {
    // Buscar o proprietário pelo email
    const [owner] = await db
      .select({
        id: ownersTable.id,
        fullName: ownersTable.fullName,
        email: ownersTable.email,
        password: ownersTable.password,
        isActive: ownersTable.isActive,
      })
      .from(ownersTable)
      .where(eq(ownersTable.email, data.email))
      .limit(1);

    if (!owner) {
      throw new Error("Email ou senha incorretos");
    }

    if (!owner.isActive) {
      throw new Error("Conta desativada. Entre em contato com o suporte");
    }

    // Verificar a senha
    const isPasswordValid = await bcrypt.compare(data.password, owner.password);
    if (!isPasswordValid) {
      throw new Error("Email ou senha incorretos");
    }

    // Retornar dados do proprietário (sem a senha)
    return {
      id: owner.id,
      fullName: owner.fullName,
      email: owner.email,
    };
  } catch (error) {
    console.error("Erro no login do proprietário:", error);
    throw error;
  }
}

export async function registerOwner(
  data: OwnerRegisterData,
): Promise<OwnerResponse> {
  try {
    // Verificar se o email já existe
    const [existingOwner] = await db
      .select({ id: ownersTable.id })
      .from(ownersTable)
      .where(eq(ownersTable.email, data.email))
      .limit(1);

    if (existingOwner) {
      throw new Error("Email já está em uso");
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(data.password, 12);

    // Criar o proprietário
    const [newOwner] = await db
      .insert(ownersTable)
      .values({
        fullName: data.fullName,
        email: data.email,
        password: hashedPassword,
        phone: data.phone || null,
      })
      .returning({
        id: ownersTable.id,
        fullName: ownersTable.fullName,
        email: ownersTable.email,
      });

    return newOwner;
  } catch (error) {
    console.error("Erro no cadastro do proprietário:", error);
    throw error;
  }
}

export async function getOwnerById(id: number): Promise<OwnerResponse | null> {
  try {
    const [owner] = await db
      .select({
        id: ownersTable.id,
        fullName: ownersTable.fullName,
        email: ownersTable.email,
      })
      .from(ownersTable)
      .where(eq(ownersTable.id, id))
      .limit(1);

    return owner || null;
  } catch (error) {
    console.error("Erro ao buscar proprietário:", error);
    return null;
  }
}
