import { neon } from "@neondatabase/serverless";
import * as dotenv from "dotenv";

dotenv.config();

// Remove aspas da URL se existirem
const databaseUrl = process.env.DATABASE_URL?.replace(/^["']|["']$/g, "") || "";
const sql = neon(databaseUrl);

async function moveFrigobarToApartmentCategory() {
  try {
    console.log('🔧 Movendo Frigobar para categoria "apartment"...');

    // Atualizar a categoria do Frigobar
    const result = await sql`
      UPDATE amenities 
      SET category = 'apartment'
      WHERE name = 'Frigobar'
      RETURNING *;
    `;

    if (result.length > 0) {
      console.log("✅ Frigobar movido com sucesso!");
      console.log("📦 Dados atualizados:", result[0]);
    } else {
      console.log("⚠️ Frigobar não encontrado no banco de dados.");
    }
  } catch (error) {
    console.error("❌ Erro ao mover Frigobar:", error);
    throw error;
  }
}

moveFrigobarToApartmentCategory()
  .then(() => {
    console.log("🎉 Atualização concluída!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("💥 Erro na atualização:", error);
    process.exit(1);
  });
