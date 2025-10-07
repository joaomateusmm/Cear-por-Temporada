"use server";

import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { sql } from "drizzle-orm";

import { db } from "@/app/db/index";
import { ownersTable, propertiesTable, usersTable } from "@/app/db/schema";
import type { NewUser } from "@/types/database";

interface CreateAdminUserData {
  name: string;
  email: string;
  phone?: string | null;
  password: string;
}

export async function loginAdmin(data: { email: string; password: string }) {
  try {
    // Buscar usuário pelo email
    const user = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, data.email))
      .limit(1);

    if (user.length === 0) {
      throw new Error("Email ou senha incorretos");
    }

    const foundUser = user[0];

    // Verificar se a conta está ativa
    if (!foundUser.isActive) {
      throw new Error(
        "Conta desativada. Entre em contato com o administrador.",
      );
    }

    // Verificar senha
    const isPasswordValid = await bcrypt.compare(
      data.password,
      foundUser.password,
    );

    if (!isPasswordValid) {
      throw new Error("Email ou senha incorretos");
    }

    // Retornar dados do usuário (sem senha)
    return {
      id: foundUser.id,
      name: foundUser.name,
      email: foundUser.email,
      phone: foundUser.phone,
      isActive: foundUser.isActive,
    };
  } catch (error) {
    console.error("Erro no login:", error);
    throw error;
  }
}

export async function createAdminUser(data: CreateAdminUserData) {
  try {
    // Verificar se o email já existe
    const existingUser = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, data.email))
      .limit(1);

    if (existingUser.length > 0) {
      throw new Error("Email já está em uso");
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(data.password, 12);

    // Criar o usuário
    const newUser: NewUser = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      password: hashedPassword,
      isActive: true,
    };

    const [createdUser] = await db
      .insert(usersTable)
      .values(newUser)
      .returning({
        id: usersTable.id,
        name: usersTable.name,
        email: usersTable.email,
        phone: usersTable.phone,
        isActive: usersTable.isActive,
        createdAt: usersTable.createdAt,
      });

    return createdUser;
  } catch (error) {
    console.error("Erro ao criar usuário admin:", error);
    throw error;
  }
}

export async function getAllAdminUsers() {
  try {
    const users = await db
      .select({
        id: usersTable.id,
        name: usersTable.name,
        email: usersTable.email,
        phone: usersTable.phone,
        isActive: usersTable.isActive,
        createdAt: usersTable.createdAt,
      })
      .from(usersTable)
      .orderBy(usersTable.createdAt);

    return users;
  } catch (error) {
    console.error("Erro ao buscar usuários:", error);
    throw error;
  }
}

export async function toggleUserStatus(userId: number, isActive: boolean) {
  try {
    const [updatedUser] = await db
      .update(usersTable)
      .set({
        isActive,
        updatedAt: new Date(),
      })
      .where(eq(usersTable.id, userId))
      .returning({
        id: usersTable.id,
        name: usersTable.name,
        email: usersTable.email,
        isActive: usersTable.isActive,
      });

    return updatedUser;
  } catch (error) {
    console.error("Erro ao atualizar status do usuário:", error);
    throw error;
  }
}

// Funções para gerenciar proprietários
export async function getAllOwners() {
  try {
    const owners = await db
      .select({
        id: ownersTable.id,
        fullName: ownersTable.fullName,
        email: ownersTable.email,
        phone: ownersTable.phone,
        instagram: ownersTable.instagram,
        website: ownersTable.website,
        profileImage: ownersTable.profileImage,
        isActive: ownersTable.isActive,
        createdAt: ownersTable.createdAt,
        updatedAt: ownersTable.updatedAt,
        properties: sql<number>`count(distinct ${propertiesTable.id})`.as(
          "properties",
        ),
      })
      .from(ownersTable)
      .leftJoin(propertiesTable, eq(ownersTable.id, propertiesTable.ownerId))
      .groupBy(
        ownersTable.id,
        ownersTable.fullName,
        ownersTable.email,
        ownersTable.phone,
        ownersTable.instagram,
        ownersTable.website,
        ownersTable.profileImage,
        ownersTable.isActive,
        ownersTable.createdAt,
        ownersTable.updatedAt,
      )
      .orderBy(ownersTable.createdAt);

    return owners.map((owner) => ({
      ...owner,
      _count: {
        properties: Number(owner.properties) || 0,
      },
    }));
  } catch (error) {
    console.error("Erro ao buscar proprietários:", error);
    throw error;
  }
}

export async function toggleOwnerStatus(ownerId: string, isActive: boolean) {
  try {
    const [updatedOwner] = await db
      .update(ownersTable)
      .set({
        isActive,
        updatedAt: new Date(),
      })
      .where(eq(ownersTable.id, ownerId))
      .returning({
        id: ownersTable.id,
        fullName: ownersTable.fullName,
        email: ownersTable.email,
        isActive: ownersTable.isActive,
      });

    return updatedOwner;
  } catch (error) {
    console.error("Erro ao atualizar status do proprietário:", error);
    throw error;
  }
}

export async function deleteOwner(ownerId: string) {
  try {
    // Primeiro, verificar se o proprietário tem imóveis
    const properties = await db
      .select({ id: propertiesTable.id })
      .from(propertiesTable)
      .where(eq(propertiesTable.ownerId, ownerId))
      .limit(1);

    if (properties.length > 0) {
      throw new Error(
        "Não é possível excluir proprietário que possui imóveis cadastrados",
      );
    }

    // Excluir o proprietário
    const [deletedOwner] = await db
      .delete(ownersTable)
      .where(eq(ownersTable.id, ownerId))
      .returning({
        id: ownersTable.id,
        fullName: ownersTable.fullName,
        email: ownersTable.email,
      });

    return deletedOwner;
  } catch (error) {
    console.error("Erro ao excluir proprietário:", error);
    throw error;
  }
}

export async function bulkDeleteOwners(ownerIds: string[]) {
  try {
    // Verificar se algum proprietário tem imóveis
    const properties = await db
      .select({ id: propertiesTable.id, ownerId: propertiesTable.ownerId })
      .from(propertiesTable)
      .where(
        sql`${propertiesTable.ownerId} IN (${sql.join(
          ownerIds.map((id) => sql`${id}`),
          sql`, `,
        )})`,
      )
      .limit(1);

    if (properties.length > 0) {
      throw new Error(
        "Não é possível excluir proprietários que possuem imóveis cadastrados",
      );
    }

    // Excluir os proprietários
    const deletedOwners = await db
      .delete(ownersTable)
      .where(
        sql`${ownersTable.id} IN (${sql.join(
          ownerIds.map((id) => sql`${id}`),
          sql`, `,
        )})`,
      )
      .returning({
        id: ownersTable.id,
        fullName: ownersTable.fullName,
        email: ownersTable.email,
      });

    return deletedOwners;
  } catch (error) {
    console.error("Erro ao excluir proprietários em massa:", error);
    throw error;
  }
}

export async function bulkToggleOwnerStatus(
  ownerIds: string[],
  isActive: boolean,
) {
  try {
    const updatedOwners = await db
      .update(ownersTable)
      .set({
        isActive,
        updatedAt: new Date(),
      })
      .where(
        sql`${ownersTable.id} IN (${sql.join(
          ownerIds.map((id) => sql`${id}`),
          sql`, `,
        )})`,
      )
      .returning({
        id: ownersTable.id,
        fullName: ownersTable.fullName,
        email: ownersTable.email,
        isActive: ownersTable.isActive,
      });

    return updatedOwners;
  } catch (error) {
    console.error(
      "Erro ao atualizar status dos proprietários em massa:",
      error,
    );
    throw error;
  }
}

// Função para excluir um administrador
export async function deleteAdminUser(userId: number) {
  try {
    const [deletedUser] = await db
      .delete(usersTable)
      .where(eq(usersTable.id, userId))
      .returning({
        id: usersTable.id,
        name: usersTable.name,
        email: usersTable.email,
      });

    if (!deletedUser) {
      throw new Error("Administrador não encontrado");
    }

    return deletedUser;
  } catch (error) {
    console.error("Erro ao excluir administrador:", error);
    throw error;
  }
}

// Função para exclusão em massa de administradores
export async function bulkDeleteAdminUsers(userIds: number[]) {
  if (!userIds || userIds.length === 0) {
    throw new Error("Nenhum administrador selecionado para exclusão");
  }

  try {
    const deletedUsers = await db
      .delete(usersTable)
      .where(
        sql`${usersTable.id} IN (${sql.join(
          userIds.map((id) => sql`${id}`),
          sql`, `,
        )})`,
      )
      .returning({
        id: usersTable.id,
        name: usersTable.name,
        email: usersTable.email,
      });

    return deletedUsers;
  } catch (error) {
    console.error("Erro ao excluir administradores em massa:", error);
    throw error;
  }
}
