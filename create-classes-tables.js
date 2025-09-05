const { neon } = require("@neondatabase/serverless");
require("dotenv").config();

const sql = neon(process.env.DATABASE_URL);

async function createTables() {
  try {
    console.log("Criando tabela property_classes...");
    await sql`CREATE TABLE IF NOT EXISTS "property_classes" (
      "id" serial PRIMARY KEY NOT NULL,
      "name" varchar(100) NOT NULL,
      "description" text,
      "is_active" boolean DEFAULT true NOT NULL,
      "created_at" timestamp DEFAULT now() NOT NULL,
      CONSTRAINT "property_classes_name_unique" UNIQUE("name")
    )`;

    console.log("Criando tabela property_property_classes...");
    await sql`CREATE TABLE IF NOT EXISTS "property_property_classes" (
      "property_id" varchar(21) NOT NULL,
      "class_id" integer NOT NULL,
      "created_at" timestamp DEFAULT now() NOT NULL,
      CONSTRAINT "property_property_classes_property_id_class_id_pk" PRIMARY KEY("property_id","class_id")
    )`;

    console.log("Adicionando foreign key constraints...");
    try {
      await sql`ALTER TABLE "property_property_classes" ADD CONSTRAINT "property_property_classes_property_id_properties_id_fk" FOREIGN KEY ("property_id") REFERENCES "public"."properties"("id") ON DELETE cascade ON UPDATE no action`;
    } catch (e) {
      console.log("FK constraint 1 já existe ou erro:", e.message);
    }

    try {
      await sql`ALTER TABLE "property_property_classes" ADD CONSTRAINT "property_property_classes_class_id_property_classes_id_fk" FOREIGN KEY ("class_id") REFERENCES "public"."property_classes"("id") ON DELETE cascade ON UPDATE no action`;
    } catch (e) {
      console.log("FK constraint 2 já existe ou erro:", e.message);
    }

    console.log("Inserindo classes padrão...");
    await sql`INSERT INTO "property_classes" ("name", "description") VALUES 
      ('Imóvel em Destaque', 'Imóveis principais em destaque na página inicial'),
      ('Destaque em Casas', 'Casas em destaque na seção específica'),
      ('Destaque em Apartamentos', 'Apartamentos em destaque na seção específica'),
      ('Normal', 'Classificação padrão para imóveis')
      ON CONFLICT (name) DO NOTHING`;

    console.log("Tabelas e dados iniciais criados com sucesso!");
  } catch (error) {
    console.error("Erro:", error.message);
  }
}

createTables();
