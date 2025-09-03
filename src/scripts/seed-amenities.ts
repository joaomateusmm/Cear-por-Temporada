import { db } from "../app/db/index";
import { amenitiesTable } from "../app/db/schema";

const defaultAmenities = [
  // Área comum
  { name: "Academia", category: "common_area", icon: "gym" },
  { name: "Piscina", category: "common_area", icon: "pool" },
  { name: "Churrasqueira", category: "common_area", icon: "barbecue" },
  { name: "Salão de festas", category: "common_area", icon: "party-room" },
  { name: "Playground", category: "common_area", icon: "playground" },
  { name: "Quadra esportiva", category: "common_area", icon: "sports-court" },

  // Apartamento
  { name: "Ar-condicionado", category: "apartment", icon: "air-conditioning" },
  {
    name: "Ar-condicionado controlado individualmente",
    category: "apartment",
    icon: "individual-ac",
  },
  { name: "Smart TV", category: "apartment", icon: "smart-tv" },
  { name: "Internet Wi-Fi", category: "apartment", icon: "wifi" },
  { name: "Máquina de lavar", category: "apartment", icon: "washing-machine" },
  { name: "Secador de cabelo", category: "apartment", icon: "hair-dryer" },
  { name: "Ferro de passar", category: "apartment", icon: "iron" },
  { name: "Geladeira", category: "apartment", icon: "fridge" },
  { name: "Microondas", category: "apartment", icon: "microwave" },
  { name: "Cooktop", category: "apartment", icon: "cooktop" },
  { name: "Cafeteira", category: "apartment", icon: "coffee-maker" },
  {
    name: "Utensílios de cozinha",
    category: "apartment",
    icon: "kitchen-utensils",
  },
  { name: "Varanda", category: "apartment", icon: "balcony" },
  { name: "Banheira", category: "apartment", icon: "bathtub" },
  { name: "Box blindex", category: "apartment", icon: "glass-shower" },

  // Prédio/Segurança
  { name: "Portaria 24h", category: "building", icon: "24h-security" },
  { name: "Elevador", category: "building", icon: "elevator" },
  { name: "Estacionamento", category: "building", icon: "parking" },
  { name: "Vaga coberta", category: "building", icon: "covered-parking" },
  { name: "Interfone", category: "building", icon: "intercom" },
  { name: "Circuito fechado de TV", category: "building", icon: "cctv" },
];

export async function seedAmenities() {
  try {
    console.log("🌱 Iniciando seed das comodidades...");

    for (const amenity of defaultAmenities) {
      await db.insert(amenitiesTable).values(amenity).onConflictDoNothing();
    }

    console.log("✅ Seed das comodidades concluído com sucesso!");
  } catch (error) {
    console.error("❌ Erro ao fazer seed das comodidades:", error);
    throw error;
  }
}

// Executar apenas se este arquivo for executado diretamente
if (require.main === module) {
  seedAmenities()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}
