import { and, asc, desc, eq, gte, ilike, lte } from "drizzle-orm";

import { db } from "../app/db/index";
import {
  amenitiesTable,
  propertiesTable,
  propertyAmenitiesTable,
  propertyImagesTable,
  propertyLocationTable,
  propertyPricingTable,
  reservationsTable,
} from "../app/db/schema";
import type {
  NewProperty,
  NewPropertyImage,
  NewPropertyLocation,
  NewPropertyPricing,
  PropertyWithDetails,
} from "../types/database";

// Query para buscar um imóvel com todos os detalhes
export async function getPropertyWithDetails(
  propertyId: number,
): Promise<PropertyWithDetails | null> {
  const result = await db.query.propertiesTable.findFirst({
    where: eq(propertiesTable.id, propertyId.toString()),
    with: {
      pricing: true,
      location: true,
      images: {
        orderBy: [asc(propertyImagesTable.displayOrder)],
      },
      amenities: {
        with: {
          amenity: true,
        },
      },
      availability: {
        limit: 30, // próximos 30 dias
      },
    },
  });

  return result as PropertyWithDetails | null;
}

// Query para buscar imóveis básicos
export async function getProperties(limit = 20, offset = 0) {
  return await db
    .select({
      id: propertiesTable.id,
      title: propertiesTable.title,
      shortDescription: propertiesTable.shortDescription,
      maxGuests: propertiesTable.maxGuests,
      bedrooms: propertiesTable.bedrooms,
      bathrooms: propertiesTable.bathrooms,
      status: propertiesTable.status,
      dailyRate: propertyPricingTable.dailyRate,
      monthlyRent: propertyPricingTable.monthlyRent,
      neighborhood: propertyLocationTable.neighborhood,
      city: propertyLocationTable.city,
      state: propertyLocationTable.state,
    })
    .from(propertiesTable)
    .innerJoin(
      propertyPricingTable,
      eq(propertiesTable.id, propertyPricingTable.propertyId),
    )
    .innerJoin(
      propertyLocationTable,
      eq(propertiesTable.id, propertyLocationTable.propertyId),
    )
    .where(eq(propertiesTable.status, "active"))
    .orderBy(desc(propertiesTable.createdAt))
    .limit(limit)
    .offset(offset);
}

// Query para buscar imóveis por cidade
export async function getPropertiesByCity(city: string, limit = 20) {
  return await db
    .select({
      id: propertiesTable.id,
      title: propertiesTable.title,
      shortDescription: propertiesTable.shortDescription,
      maxGuests: propertiesTable.maxGuests,
      bedrooms: propertiesTable.bedrooms,
      bathrooms: propertiesTable.bathrooms,
      dailyRate: propertyPricingTable.dailyRate,
      city: propertyLocationTable.city,
      neighborhood: propertyLocationTable.neighborhood,
    })
    .from(propertiesTable)
    .innerJoin(
      propertyPricingTable,
      eq(propertiesTable.id, propertyPricingTable.propertyId),
    )
    .innerJoin(
      propertyLocationTable,
      eq(propertiesTable.id, propertyLocationTable.propertyId),
    )
    .where(
      and(
        eq(propertiesTable.status, "active"),
        ilike(propertyLocationTable.city, `%${city}%`),
      ),
    )
    .orderBy(desc(propertiesTable.createdAt))
    .limit(limit);
}

// Query para verificar disponibilidade básica
export async function checkPropertyAvailability(
  propertyId: number,
  startDate: string, // formato YYYY-MM-DD
  endDate: string, // formato YYYY-MM-DD
): Promise<boolean> {
  // Verificar se não há reservas confirmadas no período
  const existingReservations = await db
    .select()
    .from(reservationsTable)
    .where(
      and(
        eq(reservationsTable.propertyId, propertyId.toString()),
        eq(reservationsTable.status, "confirmed"),
        lte(reservationsTable.checkInDate, endDate),
        gte(reservationsTable.checkOutDate, startDate),
      ),
    );

  return existingReservations.length === 0;
}

// Função para criar um imóvel completo
export async function createPropertyWithDetails({
  property,
  pricing,
  location,
  images = [],
  amenityIds = [],
}: {
  property: NewProperty;
  pricing: Omit<NewPropertyPricing, "propertyId">;
  location: Omit<NewPropertyLocation, "propertyId">;
  images?: Omit<NewPropertyImage, "propertyId">[];
  amenityIds?: number[];
}) {
  return await db.transaction(async (tx) => {
    // Inserir o imóvel
    const [insertedProperty] = await tx
      .insert(propertiesTable)
      .values(property)
      .returning();

    // Inserir preços
    await tx.insert(propertyPricingTable).values({
      ...pricing,
      propertyId: insertedProperty.id,
    });

    // Inserir localização
    await tx.insert(propertyLocationTable).values({
      ...location,
      propertyId: insertedProperty.id,
    });

    // Inserir imagens se fornecidas
    if (images.length > 0) {
      await tx.insert(propertyImagesTable).values(
        images.map((img) => ({
          ...img,
          propertyId: insertedProperty.id,
        })),
      );
    }

    // Inserir comodidades se fornecidas
    if (amenityIds.length > 0) {
      await tx.insert(propertyAmenitiesTable).values(
        amenityIds.map((amenityId) => ({
          propertyId: insertedProperty.id,
          amenityId,
        })),
      );
    }

    return insertedProperty;
  });
}

// Query para listar todas as comodidades por categoria
export async function getAmenitiesByCategory() {
  const amenities = await db
    .select()
    .from(amenitiesTable)
    .where(eq(amenitiesTable.isActive, true))
    .orderBy(amenitiesTable.category, amenitiesTable.name);

  const grouped = amenities.reduce(
    (acc, amenity) => {
      if (!acc[amenity.category]) {
        acc[amenity.category] = [];
      }
      acc[amenity.category].push(amenity);
      return acc;
    },
    {} as Record<string, typeof amenities>,
  );

  return grouped;
}

// Query para obter imagens de um imóvel
export async function getPropertyImages(propertyId: number) {
  return await db
    .select()
    .from(propertyImagesTable)
    .where(eq(propertyImagesTable.propertyId, propertyId.toString()))
    .orderBy(asc(propertyImagesTable.displayOrder));
}

// Query para obter comodidades de um imóvel
export async function getPropertyAmenities(propertyId: number) {
  return await db
    .select({
      id: amenitiesTable.id,
      name: amenitiesTable.name,
      category: amenitiesTable.category,
      icon: amenitiesTable.icon,
      description: amenitiesTable.description,
    })
    .from(propertyAmenitiesTable)
    .innerJoin(
      amenitiesTable,
      eq(propertyAmenitiesTable.amenityId, amenitiesTable.id),
    )
    .where(eq(propertyAmenitiesTable.propertyId, propertyId.toString()))
    .orderBy(amenitiesTable.category, amenitiesTable.name);
}
