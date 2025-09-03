"use server";

import { db } from "@/app/db";
import { amenitiesTable } from "@/app/db/schema";

const amenitiesData = [
  // Área Comum
  {
    name: "Piscina",
    category: "comum",
    icon: "waves",
    description: "Piscina para relaxar e se refrescar",
  },
  {
    name: "Academia",
    category: "comum",
    icon: "dumbbell",
    description: "Academia completa para exercícios",
  },
  {
    name: "Salão de Festas",
    category: "comum",
    icon: "party-popper",
    description: "Espaço para eventos e celebrações",
  },
  {
    name: "Churrasqueira",
    category: "comum",
    icon: "flame",
    description: "Área de churrasqueira coletiva",
  },
  {
    name: "Playground",
    category: "comum",
    icon: "baby",
    description: "Área de recreação para crianças",
  },
  {
    name: "Quadra Esportiva",
    category: "comum",
    icon: "zap",
    description: "Quadra para praticar esportes",
  },
  {
    name: "Jardim",
    category: "comum",
    icon: "tree-pine",
    description: "Área verde e jardim",
  },
  {
    name: "Elevador",
    category: "comum",
    icon: "arrow-up",
    description: "Elevador no prédio",
  },

  // Apartamento
  {
    name: "Ar Condicionado",
    category: "apartamento",
    icon: "snowflake",
    description: "Sistema de ar condicionado",
  },
  {
    name: "Wi-Fi",
    category: "apartamento",
    icon: "wifi",
    description: "Internet sem fio gratuita",
  },
  {
    name: "TV",
    category: "apartamento",
    icon: "tv",
    description: "Televisão no imóvel",
  },
  {
    name: "Máquina de Lavar",
    category: "apartamento",
    icon: "washing-machine",
    description: "Máquina de lavar roupas",
  },
  {
    name: "Micro-ondas",
    category: "apartamento",
    icon: "microwave",
    description: "Forno micro-ondas",
  },
  {
    name: "Geladeira",
    category: "apartamento",
    icon: "refrigerator",
    description: "Geladeira/refrigerador",
  },
  {
    name: "Fogão",
    category: "apartamento",
    icon: "chef-hat",
    description: "Fogão para cozinhar",
  },
  {
    name: "Varanda",
    category: "apartamento",
    icon: "door-open",
    description: "Varanda ou sacada",
  },
  {
    name: "Mobiliado",
    category: "apartamento",
    icon: "sofa",
    description: "Imóvel totalmente mobiliado",
  },
  {
    name: "Cozinha Equipada",
    category: "apartamento",
    icon: "utensils",
    description: "Cozinha com utensílios completos",
  },

  // Edifício
  {
    name: "Portaria 24h",
    category: "edificio",
    icon: "shield",
    description: "Segurança 24 horas",
  },
  {
    name: "Garagem",
    category: "edificio",
    icon: "car",
    description: "Vaga de garagem disponível",
  },
  {
    name: "Interfone",
    category: "edificio",
    icon: "phone",
    description: "Sistema de interfone",
  },
  {
    name: "Câmeras de Segurança",
    category: "edificio",
    icon: "eye",
    description: "Sistema de monitoramento",
  },
  {
    name: "Controle de Acesso",
    category: "edificio",
    icon: "key",
    description: "Controle eletrônico de acesso",
  },
  {
    name: "Estacionamento Visitantes",
    category: "edificio",
    icon: "car-front",
    description: "Vagas para visitantes",
  },

  // Localização
  {
    name: "Próximo ao Mar",
    category: "localizacao",
    icon: "waves",
    description: "Localizado próximo à praia",
  },
  {
    name: "Centro da Cidade",
    category: "localizacao",
    icon: "building",
    description: "No centro urbano",
  },
  {
    name: "Transporte Público",
    category: "localizacao",
    icon: "bus",
    description: "Próximo ao transporte público",
  },
  {
    name: "Supermercado Próximo",
    category: "localizacao",
    icon: "shopping-cart",
    description: "Supermercado nas proximidades",
  },
  {
    name: "Restaurantes Próximos",
    category: "localizacao",
    icon: "utensils",
    description: "Restaurantes na região",
  },
  {
    name: "Farmácia Próxima",
    category: "localizacao",
    icon: "cross",
    description: "Farmácia nas proximidades",
  },
];

export async function seedAmenities() {
  try {
    // Verificar se já existem comodidades
    const existingAmenities = await db.select().from(amenitiesTable).limit(1);

    if (existingAmenities.length > 0) {
      return { success: true, message: "Comodidades já existem no banco" };
    }

    // Inserir comodidades
    await db.insert(amenitiesTable).values(amenitiesData);

    return {
      success: true,
      message: `${amenitiesData.length} comodidades inseridas com sucesso`,
    };
  } catch (error) {
    console.error("Erro ao inserir comodidades:", error);
    return { success: false, error: "Erro ao inserir comodidades" };
  }
}
