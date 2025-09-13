-- Migração manual para alterar owners.id de serial para varchar(21)
-- Este script deve ser executado com cuidado

-- 1. Primeiro, vamos criar uma tabela temporária para mapear os IDs antigos para os novos
CREATE TEMPORARY TABLE temp_owner_id_mapping (
    old_id integer,
    new_id varchar(21)
);

-- 2. Inserir mapeamentos dos IDs existentes para nanoid (será preenchido pelo script)
-- (Este será preenchido dinamicamente pelo script)

-- 3. Atualizar as referências em properties primeiro
UPDATE properties 
SET owner_id = (
    SELECT new_id 
    FROM temp_owner_id_mapping 
    WHERE old_id = properties.owner_id::integer
)
WHERE owner_id IN (SELECT old_id::varchar FROM temp_owner_id_mapping);

-- 4. Atualizar a tabela owners
UPDATE owners 
SET id = (
    SELECT new_id 
    FROM temp_owner_id_mapping 
    WHERE old_id = owners.id::integer
)
WHERE id IN (SELECT old_id::varchar FROM temp_owner_id_mapping);

-- 5. Alterar os tipos das colunas
ALTER TABLE owners ALTER COLUMN id SET DATA TYPE varchar(21);
ALTER TABLE properties ALTER COLUMN owner_id SET DATA TYPE varchar(21);