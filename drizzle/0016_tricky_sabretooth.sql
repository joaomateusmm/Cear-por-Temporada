CREATE TABLE "apartment_rooms" (
	"id" serial PRIMARY KEY NOT NULL,
	"apartment_id" integer NOT NULL,
	"room_number" integer NOT NULL,
	"double_beds" integer DEFAULT 0 NOT NULL,
	"single_beds" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "property_apartments" (
	"id" serial PRIMARY KEY NOT NULL,
	"property_id" varchar(21) NOT NULL,
	"name" varchar(255) NOT NULL,
	"total_bathrooms" integer DEFAULT 0 NOT NULL,
	"has_living_room" boolean DEFAULT false NOT NULL,
	"living_room_has_sofa_bed" boolean DEFAULT false NOT NULL,
	"has_kitchen" boolean DEFAULT false NOT NULL,
	"kitchen_has_stove" boolean DEFAULT false NOT NULL,
	"kitchen_has_fridge" boolean DEFAULT false NOT NULL,
	"kitchen_has_minibar" boolean DEFAULT false NOT NULL,
	"has_balcony" boolean DEFAULT false NOT NULL,
	"balcony_has_sea_view" boolean DEFAULT false NOT NULL,
	"has_crib" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "apartment_rooms" ADD CONSTRAINT "apartment_rooms_apartment_id_property_apartments_id_fk" FOREIGN KEY ("apartment_id") REFERENCES "public"."property_apartments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "property_apartments" ADD CONSTRAINT "property_apartments_property_id_properties_id_fk" FOREIGN KEY ("property_id") REFERENCES "public"."properties"("id") ON DELETE cascade ON UPDATE no action;