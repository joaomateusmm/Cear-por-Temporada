"use server";

import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";

import { db } from "@/app/db/index";
import { usersTable } from "@/app/db/schema";
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
