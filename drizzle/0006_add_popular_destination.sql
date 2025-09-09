-- Migration: Add popular_destination field to property_location table
-- Created: 2025-01-09

ALTER TABLE "property_location" ADD COLUMN "popular_destination" varchar(100) NOT NULL DEFAULT 'Nenhum dos anteriores';

-- Add comment to describe the column
COMMENT ON COLUMN "property_location"."popular_destination" IS 'Indicates if the property is located in or near a popular destination in Ceará';
