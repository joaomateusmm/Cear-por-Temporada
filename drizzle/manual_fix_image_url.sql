-- Migração manual para expandir o campo image_url
-- Primeiro, vamos alterar o tipo da coluna para suportar URLs maiores

-- Expandir o campo image_url de varchar(500) para text
ALTER TABLE "property_images" ALTER COLUMN "image_url" TYPE text;

-- Também expandir o campo profile_image na tabela owners se necessário  
ALTER TABLE "owners" ALTER COLUMN "profile_image" TYPE text;