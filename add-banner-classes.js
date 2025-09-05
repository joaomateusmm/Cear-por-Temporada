import "dotenv/config";

import { drizzle } from "drizzle-orm/node-postgres";

import { propertyClassesTable } from "./src/app/db/schema";

const db = drizzle(process.env.DATABASE_URL!);

async function addBannerClasses() {
  try {
    await db.insert(propertyClassesTable).values([
      {
        name: 'Imovel Banner a Dois',
        description: 'Imóveis que aparecem no banner romântico para casais',
        isActive: true,
      },
      {
        name: 'Imovel Banner Beach Park',
        description: 'Imóveis que aparecem no banner do Beach Park',
        isActive: true,
      },
      {
        name: 'Imovel Banner Paracuru',
        description: 'Imóveis que aparecem no banner de Paracuru',
        isActive: true,
      },
    ]);
    
    console.log('✅ Novas classes de banner adicionadas com sucesso!');
  } catch (error) {
    console.error('❌ Erro ao adicionar classes:', error);
  }
  
  process.exit(0);
}

addBannerClasses();
