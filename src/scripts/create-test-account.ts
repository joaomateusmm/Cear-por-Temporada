import { createAdminUser } from "../lib/admin-actions";

async function createTestAccount() {
  try {
    console.log("🔐 Criando conta de teste...");

    const testUser = await createAdminUser({
      name: "Joao Mateus",
      email: "test1@gmail.com",
      password: "13IAmb13",
    });

    console.log("✅ Conta criada com sucesso!");
    console.log("📧 Email:", testUser.email);
    console.log("👤 Nome:", testUser.name);
    console.log("🆔 ID:", testUser.id);
  } catch (error) {
    console.error("❌ Erro ao criar conta:", error);
  }
}

createTestAccount();
