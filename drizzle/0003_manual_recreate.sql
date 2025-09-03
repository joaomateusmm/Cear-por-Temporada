-- Migração manual para recriar tabelas com IDs varchar

-- Drop todas as tabelas (ordem importante devido às foreign keys)
DROP TABLE IF EXISTS reservations CASCADE;
DROP TABLE IF EXISTS property_availability CASCADE;
DROP TABLE IF EXISTS property_amenities CASCADE;
DROP TABLE IF EXISTS property_images CASCADE;
DROP TABLE IF EXISTS property_location CASCADE;
DROP TABLE IF EXISTS property_pricing CASCADE;
DROP TABLE IF EXISTS properties CASCADE;

-- Drop também a tabela de migrações para forçar recriação
DROP TABLE IF EXISTS __drizzle_migrations CASCADE;

-- Recriar tabela properties com ID varchar
CREATE TABLE IF NOT EXISTS "properties" (
	"id" varchar(21) PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"short_description" text NOT NULL,
	"full_description" text DEFAULT 'Descrição completa não informada',
	"max_guests" integer NOT NULL,
	"bedrooms" integer NOT NULL,
	"bathrooms" integer NOT NULL,
	"parking_spaces" integer DEFAULT 0,
	"area_m2" integer,
	"allows_pets" boolean DEFAULT false,
	"property_style" varchar(50) NOT NULL,
	"bed_types" text DEFAULT 'Não especificado',
	"minimum_stay" integer DEFAULT 1,
	"check_in_time" varchar(5) NOT NULL,
	"check_out_time" varchar(5) NOT NULL,
	"pet_policy" text DEFAULT 'Política de pets não especificada',
	"cancellation_policy" text DEFAULT 'Política de cancelamento não especificada',
	"external_link" varchar(500),
	"status" varchar(20) DEFAULT 'active' NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);

-- Recriar outras tabelas com property_id varchar
CREATE TABLE IF NOT EXISTS "property_pricing" (
	"id" serial PRIMARY KEY NOT NULL,
	"property_id" varchar(21) NOT NULL,
	"base_price" numeric(10, 2) NOT NULL,
	"cleaning_fee" numeric(10, 2) DEFAULT '0',
	"service_fee" numeric(10, 2) DEFAULT '0',
	"extra_guest_fee" numeric(10, 2) DEFAULT '0',
	"weekend_multiplier" numeric(3, 2) DEFAULT '1.0',
	"holiday_multiplier" numeric(3, 2) DEFAULT '1.0',
	"monthly_discount" numeric(3, 2) DEFAULT '0.0',
	"weekly_discount" numeric(3, 2) DEFAULT '0.0',
	"currency" varchar(3) DEFAULT 'BRL',
	"price_per_guest" boolean DEFAULT false,
	"taxes_included" boolean DEFAULT true,
	"security_deposit" numeric(10, 2) DEFAULT '0',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "property_location" (
	"id" serial PRIMARY KEY NOT NULL,
	"property_id" varchar(21) NOT NULL,
	"address" varchar(500) NOT NULL,
	"city" varchar(100) NOT NULL,
	"state" varchar(50) NOT NULL,
	"zip_code" varchar(20),
	"country" varchar(50) DEFAULT 'Brasil',
	"latitude" numeric(10, 8),
	"longitude" numeric(11, 8),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "property_images" (
	"id" serial PRIMARY KEY NOT NULL,
	"property_id" varchar(21) NOT NULL,
	"image_url" varchar(500) NOT NULL,
	"alt_text" varchar(255),
	"is_main" boolean DEFAULT false,
	"display_order" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "property_amenities" (
	"id" serial PRIMARY KEY NOT NULL,
	"property_id" varchar(21) NOT NULL,
	"amenity_id" integer NOT NULL
);

CREATE TABLE IF NOT EXISTS "property_availability" (
	"id" serial PRIMARY KEY NOT NULL,
	"property_id" varchar(21) NOT NULL,
	"available_from" date NOT NULL,
	"available_to" date NOT NULL,
	"is_available" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "reservations" (
	"id" serial PRIMARY KEY NOT NULL,
	"property_id" varchar(21) NOT NULL,
	"user_id" integer NOT NULL,
	"check_in_date" date NOT NULL,
	"check_out_date" date NOT NULL,
	"guests" integer NOT NULL,
	"total_amount" numeric(10, 2) NOT NULL,
	"booking_status" varchar(20) DEFAULT 'pending',
	"guest_name" varchar(255) NOT NULL,
	"guest_email" varchar(255) NOT NULL,
	"guest_phone" varchar(20),
	"special_requests" text,
	"payment_status" varchar(20) DEFAULT 'pending',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);

-- Adicionar foreign keys
ALTER TABLE "property_pricing" ADD CONSTRAINT "property_pricing_property_id_properties_id_fk" FOREIGN KEY ("property_id") REFERENCES "properties"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "property_location" ADD CONSTRAINT "property_location_property_id_properties_id_fk" FOREIGN KEY ("property_id") REFERENCES "properties"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "property_images" ADD CONSTRAINT "property_images_property_id_properties_id_fk" FOREIGN KEY ("property_id") REFERENCES "properties"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "property_amenities" ADD CONSTRAINT "property_amenities_property_id_properties_id_fk" FOREIGN KEY ("property_id") REFERENCES "properties"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "property_availability" ADD CONSTRAINT "property_availability_property_id_properties_id_fk" FOREIGN KEY ("property_id") REFERENCES "properties"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "reservations" ADD CONSTRAINT "reservations_property_id_properties_id_fk" FOREIGN KEY ("property_id") REFERENCES "properties"("id") ON DELETE cascade ON UPDATE no action;
