# Sistema de Imóveis por Temporada - Backend

## Visão Geral

Este sistema foi projetado para gerenciar um portal de busca de imóveis por temporada, similar ao Airbnb. O backend utiliza Next.js 15, TypeScript, Drizzle ORM e PostgreSQL.

## Estrutura do Banco de Dados

### Tabelas Principais

#### 1. `users` - Usuários do Sistema

- Armazena informações dos usuários que podem fazer reservas
- Campos: id, name, email, phone, password, isActive, createdAt, updatedAt

#### 2. `properties` - Imóveis

- Tabela principal com informações gerais dos imóveis
- Campos: id, title, shortDescription, fullDescription, maxGuests, bedrooms, bathrooms, parkingSpaces, areaM2, allowsPets, propertyStyle, bedTypes, minimumStay, checkInTime, checkOutTime, petPolicy, cancellationPolicy, externalLink, status, createdAt, updatedAt

#### 3. `property_pricing` - Preços e Taxas

- Valores de aluguel e taxas inclusas
- Campos: id, propertyId, monthlyRent, dailyRate, condominiumFee, iptuFee, monthlyCleaningFee, otherFees, includes\* (várias flags para itens inclusos)

#### 4. `property_location` - Localização

- Endereço completo e coordenadas geográficas
- Campos: id, propertyId, fullAddress, neighborhood, city, state, zipCode, latitude, longitude

#### 5. `amenities` - Comodidades Master

- Catálogo de todas as comodidades disponíveis
- Campos: id, name, category, icon, description, isActive
- Categorias: common_area, apartment, building

#### 6. `property_amenities` - Relacionamento N:N

- Liga imóveis às suas comodidades
- Campos: propertyId, amenityId

#### 7. `property_images` - Imagens dos Imóveis

- URLs das imagens com ordem de exibição
- Campos: id, propertyId, imageUrl, altText, displayOrder, isMain

#### 8. `property_availability` - Calendário de Disponibilidade

- Controla disponibilidade por data
- Campos: id, propertyId, date, isAvailable, specialPrice, notes

#### 9. `reservations` - Reservas

- Registro de todas as reservas
- Campos: id, propertyId, userId, guestName, guestEmail, guestPhone, checkInDate, checkOutDate, numberOfGuests, totalAmount, status, paymentStatus, specialRequests

## Como Usar

### 1. Configuração Inicial

```bash
# Instalar dependências
npm install

# Configurar variáveis de ambiente (copie .env.example para .env)
cp .env.example .env

# Configurar a URL do banco PostgreSQL no .env
DATABASE_URL="postgresql://username:password@localhost:5432/ceara_por_temporada"

# Gerar e executar migrações
npm run db:generate
npm run db:migrate

# Popular comodidades básicas
npm run db:seed
```

### 2. Criando um Imóvel Completo

```typescript
import { createPropertyWithDetails } from "@/lib/queries";

const newProperty = await createPropertyWithDetails({
  property: {
    title: "Apartamento Moderno na Praia",
    shortDescription: "Lindo apartamento com vista para o mar",
    fullDescription: "Apartamento completamente mobiliado...",
    maxGuests: 4,
    bedrooms: 2,
    bathrooms: 1,
    parkingSpaces: 1,
    areaM2: "75.5",
    allowsPets: false,
    propertyStyle: "moderno",
    bedTypes: "1 cama queen, 1 cama solteiro",
    minimumStay: 7,
    checkInTime: "15:00",
    checkOutTime: "11:00",
    status: "active",
  },
  pricing: {
    monthlyRent: "4500.00",
    dailyRate: "180.00",
    condominiumFee: "200.00",
    includesFurniture: true,
    includesInternet: true,
    includesWater: true,
    includesElectricity: true,
  },
  location: {
    fullAddress: "Rua da Praia, 123, Meireles, Fortaleza - CE",
    neighborhood: "Meireles",
    city: "Fortaleza",
    state: "Ceará",
    zipCode: "60165-081",
    latitude: "-3.7327",
    longitude: "-38.4967",
  },
  images: [
    {
      imageUrl: "https://exemplo.com/image1.jpg",
      altText: "Sala de estar",
      displayOrder: 1,
      isMain: true,
    },
    {
      imageUrl: "https://exemplo.com/image2.jpg",
      altText: "Quarto principal",
      displayOrder: 2,
      isMain: false,
    },
  ],
  amenityIds: [1, 2, 3, 5, 8], // IDs das comodidades
});
```

### 3. Buscando Imóveis

```typescript
import {
  getProperties,
  getPropertiesByCity,
  getPropertyWithDetails,
} from "@/lib/queries";

// Buscar todos os imóveis ativos
const properties = await getProperties(20, 0); // limit, offset

// Buscar por cidade
const propertiesInFortaleza = await getPropertiesByCity("Fortaleza");

// Buscar um imóvel com todos os detalhes
const propertyDetails = await getPropertyWithDetails(1);
```

### 4. Gerenciando Comodidades

```typescript
import { getAmenitiesByCategory } from "@/lib/queries";

// Listar comodidades agrupadas por categoria
const amenitiesByCategory = await getAmenitiesByCategory();
/*
Retorna:
{
  "common_area": [
    { id: 1, name: "Academia", category: "common_area", icon: "gym" },
    { id: 2, name: "Piscina", category: "common_area", icon: "pool" }
  ],
  "apartment": [
    { id: 3, name: "Ar-condicionado", category: "apartment", icon: "air-conditioning" }
  ],
  "building": [
    { id: 4, name: "Portaria 24h", category: "building", icon: "24h-security" }
  ]
}
*/
```

### 5. Verificando Disponibilidade

```typescript
import { checkPropertyAvailability } from "@/lib/queries";

const isAvailable = await checkPropertyAvailability(
  1, // propertyId
  "2025-09-01", // checkIn (YYYY-MM-DD)
  "2025-09-07", // checkOut (YYYY-MM-DD)
);
```

## Scripts Disponíveis

- `npm run db:generate` - Gera migrações a partir do schema
- `npm run db:migrate` - Executa migrações pendentes
- `npm run db:push` - Sincroniza schema diretamente (desenvolvimento)
- `npm run db:studio` - Abre Drizzle Studio para visualizar dados
- `npm run db:seed` - Popula comodidades básicas

## Tipos TypeScript

Todos os tipos estão definidos em `src/types/database.ts`:

- Tipos de SELECT: `User`, `Property`, `PropertyPricing`, etc.
- Tipos de INSERT: `NewUser`, `NewProperty`, `NewPropertyPricing`, etc.
- Tipos compostos: `PropertyWithDetails`, `PropertySummary`, etc.

## Relacionamentos

O sistema usa relações Drizzle que permitem queries eficientes:

```typescript
// Buscar imóvel com todas as relações
const property = await db.query.propertiesTable.findFirst({
  where: eq(propertiesTable.id, 1),
  with: {
    pricing: true,
    location: true,
    images: true,
    amenities: {
      with: {
        amenity: true,
      },
    },
  },
});
```

## Status dos Imóveis

- `active` - Ativo e disponível para reservas
- `inactive` - Inativo, não aparece nas buscas
- `maintenance` - Em manutenção, temporariamente indisponível

## Status das Reservas

- `pending` - Aguardando confirmação
- `confirmed` - Confirmada
- `cancelled` - Cancelada
- `completed` - Concluída

## Próximos Passos

1. Implementar autenticação com BetterAuth
2. Criar APIs REST ou GraphQL para o frontend
3. Implementar sistema de pagamentos
4. Adicionar notificações por email
5. Implementar avaliações e comentários
6. Sistema de favoritos para usuários
