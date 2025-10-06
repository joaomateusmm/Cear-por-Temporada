ALTER TABLE "property_location" ADD COLUMN "google_maps_url" text;--> statement-breakpoint
ALTER TABLE "property_location" ADD COLUMN "google_place_id" varchar(255);--> statement-breakpoint
ALTER TABLE "property_location" ADD COLUMN "google_maps_embed_url" text;