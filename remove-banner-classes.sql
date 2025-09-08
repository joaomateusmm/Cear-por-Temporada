-- Script para remover classes de banner e suas associações

-- Primeiro, remover as associações de propriedades com essas classes
DELETE FROM property_property_classes 
WHERE class_id IN (
  SELECT id FROM property_classes 
  WHERE name LIKE '%Banner%'
);

-- Depois, desativar as classes de banner (em vez de deletar para manter referências)
UPDATE property_classes 
SET is_active = false, updated_at = NOW()
WHERE name LIKE '%Banner%';

-- Verificar quais classes foram desativadas
SELECT id, name, description, is_active 
FROM property_classes 
WHERE name LIKE '%Banner%';
