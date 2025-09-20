ALTER TABLE "apartment_rooms" ADD COLUMN "large_beds" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "apartment_rooms" ADD COLUMN "extra_large_beds" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "apartment_rooms" ADD COLUMN "sofa_beds" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "property_house_rules" ADD COLUMN "pets_rule" text;