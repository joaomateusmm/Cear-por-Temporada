-- Script para limpar completamente o banco de dados
-- Dropa todas as tabelas relacionadas a propriedades

DROP TABLE IF EXISTS reservations CASCADE;
DROP TABLE IF EXISTS property_availability CASCADE;
DROP TABLE IF EXISTS property_amenities CASCADE;
DROP TABLE IF EXISTS property_images CASCADE;
DROP TABLE IF EXISTS property_location CASCADE;
DROP TABLE IF EXISTS property_pricing CASCADE;
DROP TABLE IF EXISTS properties CASCADE;
DROP TABLE IF EXISTS amenities CASCADE;
DROP TABLE IF EXISTS admins CASCADE;

-- Dropa a tabela de migrações do Drizzle para reset completo
DROP TABLE IF EXISTS __drizzle_migrations CASCADE;
