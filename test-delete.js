import { deleteProperty } from "../src/lib/property-actions";

async function testDelete() {
  console.log("Testando função de exclusão...");

  // Teste com ID inexistente
  const result = await deleteProperty(99999);
  console.log("Resultado do teste:", result);
}

testDelete().catch(console.error);
