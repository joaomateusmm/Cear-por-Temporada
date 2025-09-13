import { db } from "@/app/db";
import { ownersTable } from "@/app/db/schema";
import { registerOwner } from "@/lib/owner-actions";

/**
 * Script de teste para verificar se o registro de proprietários
 * está funcionando com os novos IDs nanoid
 */
async function testOwnerRegistration() {
  console.log("🧪 Testando registro de proprietário com nanoid...");

  try {
    // 1. Testar diretamente com a função registerOwner
    const testOwnerData = {
      fullName: "João Teste da Silva",
      email: `teste${Date.now()}@email.com`,
      password: "senha123",
      phone: "(85) 9 9999-9999",
    };

    console.log("📝 Criando proprietário de teste...");
    const newOwner = await registerOwner(testOwnerData);

    console.log("✅ Proprietário criado com sucesso!");
    console.log(`📊 ID gerado: ${newOwner.id}`);
    console.log(`📊 Tamanho do ID: ${newOwner.id.length} caracteres`);
    console.log(`📊 Nome: ${newOwner.fullName}`);
    console.log(`📊 Email: ${newOwner.email}`);

    // Verificar se é um nanoid válido (21 caracteres alfanuméricos)
    const isValidNanoid = /^[A-Za-z0-9_-]{21}$/.test(newOwner.id);
    console.log(`📊 ID é nanoid válido: ${isValidNanoid ? "✅" : "❌"}`);

    return newOwner;
  } catch (error) {
    console.error("❌ Erro durante o teste:", error);
    return null;
  }
}

// Função para testar login também
async function testOwnerLogin(email: string, password: string) {
  console.log("🔐 Testando login do proprietário...");

  try {
    // Importar a função de login
    const { loginOwner } = await import("@/lib/owner-actions");

    const result = await loginOwner({ email, password });

    console.log("✅ Login realizado com sucesso!");
    console.log(`📊 ID do proprietário logado: ${result.id}`);
    return result;
  } catch (error) {
    console.error("❌ Erro durante o teste de login:", error);
    return null;
  }
}

// Função para listar todos os proprietários
async function listAllOwners() {
  console.log("📋 Listando todos os proprietários...");

  try {
    const owners = await db.select().from(ownersTable);
    console.log(`📊 Total de proprietários: ${owners.length}`);

    owners.forEach((owner, index) => {
      console.log(
        `  ${index + 1}. ID: ${owner.id} | Nome: ${owner.fullName} | Email: ${owner.email}`,
      );
    });

    return owners;
  } catch (error) {
    console.error("❌ Erro ao listar proprietários:", error);
    return [];
  }
}

// Executar testes
if (require.main === module) {
  async function runTests() {
    console.log("🚀 Iniciando testes de proprietários...\n");

    // Listar proprietários existentes
    await listAllOwners();
    console.log("");

    // Testar criação
    const newOwner = await testOwnerRegistration();
    console.log("");

    if (newOwner) {
      // Testar login
      await testOwnerLogin(newOwner.email, "senha123");
      console.log("");

      // Listar novamente para mostrar o novo proprietário
      await listAllOwners();
    }

    console.log("🎉 Testes concluídos!");
  }

  runTests()
    .then(() => {
      process.exit(0);
    })
    .catch((error) => {
      console.error("❌ Falha nos testes:", error);
      process.exit(1);
    });
}

export { listAllOwners, testOwnerLogin, testOwnerRegistration };
