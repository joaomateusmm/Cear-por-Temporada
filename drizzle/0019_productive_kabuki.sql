ALTER TABLE "property_apartments" ADD COLUMN "max_adults" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "property_apartments" ADD COLUMN "max_children" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "property_house_rules" ADD COLUMN "silence_rule" text;