import { neon } from "@neondatabase/serverless";
import * as dotenv from "dotenv";

dotenv.config();

// Remove aspas da URL se existirem
const databaseUrl = process.env.DATABASE_URL?.replace(/^["']|["']$/g, "") || "";
const sql = neon(databaseUrl);

async function addFrigobarAmenity() {
  try {
    console.log("🔧 Adicionando comodidade Frigobar...");

    const result = await sql`
      INSERT INTO amenities (name, category, icon, description, is_active, created_at)
      VALUES (
        'Frigobar',
        'Cozinha e Eletrodomésticos',
        'refrigerator',
        'Mini geladeira para bebidas e pequenos alimentos',
        true,
        NOW()
      )
      ON CONFLICT (name) DO NOTHING
      RETURNING *;
    `;

    if (result.length > 0) {
      console.log("✅ Frigobar adicionado com sucesso!");
      console.log("📦 Dados:", result[0]);
    } else {
      console.log("ℹ️ Frigobar já existe no banco de dados.");
    }
  } catch (error) {
    console.error("❌ Erro ao adicionar Frigobar:", error);
    throw error;
  }
}

addFrigobarAmenity()
  .then(() => {
    console.log("🎉 Migration concluída!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("💥 Erro na migration:", error);
    process.exit(1);
  });
