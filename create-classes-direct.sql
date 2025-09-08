-- Criar classes se não existirem
INSERT INTO property_classes (name, description) VALUES 
('Imóvel em Destaque', 'Imóveis destacados na página principal'),
('Destaque em Casas', 'Casas em destaque na seção de casas'),
('Destaque em Apartamentos', 'Apartamentos em destaque na seção de apartamentos')
ON CONFLICT (name) DO NOTHING;

-- Verificar se foram criadas
SELECT * FROM property_classes;
