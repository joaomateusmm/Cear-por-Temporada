import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";

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
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  instagram?: string;
  website?: string;
  profileImage?: string;
}

interface OwnerProfileData {
  fullName: string;
  phone?: string;
  instagram?: string;
  website?: string;
  profileImage?: string;
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
        id: nanoid(),
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

export async function getOwnerById(id: string): Promise<OwnerResponse | null> {
  try {
    const [owner] = await db
      .select({
        id: ownersTable.id,
        fullName: ownersTable.fullName,
        email: ownersTable.email,
        phone: ownersTable.phone,
        instagram: ownersTable.instagram,
        website: ownersTable.website,
        profileImage: ownersTable.profileImage,
      })
      .from(ownersTable)
      .where(eq(ownersTable.id, id))
      .limit(1);

    if (!owner) return null;

    return {
      id: owner.id,
      fullName: owner.fullName,
      email: owner.email,
      phone: owner.phone || undefined,
      instagram: owner.instagram || undefined,
      website: owner.website || undefined,
      profileImage: owner.profileImage || undefined,
    };
  } catch (error) {
    console.error("Erro ao buscar proprietário:", error);
    return null;
  }
}

export async function updateOwnerProfile(
  ownerId: string,
  data: OwnerProfileData,
): Promise<{ success: boolean; error?: string }> {
  try {
    console.log("updateOwnerProfile chamada com:", { ownerId, data });

    const updateData = {
      fullName: data.fullName,
      phone: data.phone,
      instagram: data.instagram,
      website: data.website,
      profileImage: data.profileImage,
      updatedAt: new Date(),
    };

    console.log("Dados que serão atualizados:", updateData);

    await db
      .update(ownersTable)
      .set(updateData)
      .where(eq(ownersTable.id, ownerId));

    console.log("Atualização realizada com sucesso");
    return { success: true };
  } catch (error) {
    console.error("Erro ao atualizar perfil do proprietário:", error);
    return {
      success: false,
      error: "Erro interno do servidor",
    };
  }
}
