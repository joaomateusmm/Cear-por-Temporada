CREATE TABLE "property_nearby_airports" (
	"id" serial PRIMARY KEY NOT NULL,
	"property_id" varchar(21) NOT NULL,
	"name" varchar(255) NOT NULL,
	"distance" varchar(50) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "property_nearby_beaches" (
	"id" serial PRIMARY KEY NOT NULL,
	"property_id" varchar(21) NOT NULL,
	"name" varchar(255) NOT NULL,
	"distance" varchar(50) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "property_nearby_places" (
	"id" serial PRIMARY KEY NOT NULL,
	"property_id" varchar(21) NOT NULL,
	"name" varchar(255) NOT NULL,
	"distance" varchar(50) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "property_nearby_restaurants" (
	"id" serial PRIMARY KEY NOT NULL,
	"property_id" varchar(21) NOT NULL,
	"name" varchar(255) NOT NULL,
	"distance" varchar(50) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "property_nearby_airports" ADD CONSTRAINT "property_nearby_airports_property_id_properties_id_fk" FOREIGN KEY ("property_id") REFERENCES "public"."properties"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "property_nearby_beaches" ADD CONSTRAINT "property_nearby_beaches_property_id_properties_id_fk" FOREIGN KEY ("property_id") REFERENCES "public"."properties"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "property_nearby_places" ADD CONSTRAINT "property_nearby_places_property_id_properties_id_fk" FOREIGN KEY ("property_id") REFERENCES "public"."properties"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "property_nearby_restaurants" ADD CONSTRAINT "property_nearby_restaurants_property_id_properties_id_fk" FOREIGN KEY ("property_id") REFERENCES "public"."properties"("id") ON DELETE cascade ON UPDATE no action;