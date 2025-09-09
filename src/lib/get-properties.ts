"use server";

import { and, eq, ilike, lte } from "drizzle-orm";

import { db } from "@/app/db";
import {
  propertiesTable,
  propertyClassesTable,
  propertyImagesTable,
  propertyLocationTable,
  propertyPricingTable,
  propertyPropertyClassesTable,
} from "@/app/db/schema";

export interface PropertyWithDetails {
  id: string;
  title: string;
  shortDescription: string;
  maxGuests: number;
  bedrooms: number;
  bathrooms: number;
  allowsPets: boolean;
  propertyStyle: string;
  status: string;
  location: {
    fullAddress: string;
    neighborhood: string;
    municipality: string;
    city: string;
    state: string;
    popularDestination?: string;
  };
  pricing: {
    dailyRate: string;
    monthlyRent: string;
  };
  images: {
    imageUrl: string;
    altText: string | null;
    isMain: boolean;
  }[];
}

export async function getActiveProperties(): Promise<PropertyWithDetails[]> {
  try {
    const properties = await db
      .select({
        // Dados da propriedade
        id: propertiesTable.id,
        title: propertiesTable.title,
        shortDescription: propertiesTable.shortDescription,
        maxGuests: propertiesTable.maxGuests,
        bedrooms: propertiesTable.bedrooms,
        bathrooms: propertiesTable.bathrooms,
        allowsPets: propertiesTable.allowsPets,
        propertyStyle: propertiesTable.propertyStyle,
        status: propertiesTable.status,
        // Dados de localização
        fullAddress: propertyLocationTable.fullAddress,
        neighborhood: propertyLocationTable.neighborhood,
        municipality: propertyLocationTable.municipality,
        city: propertyLocationTable.city,
        state: propertyLocationTable.state,
        // Dados de preço
        dailyRate: propertyPricingTable.dailyRate,
        monthlyRent: propertyPricingTable.monthlyRent,
      })
      .from(propertiesTable)
      .leftJoin(
        propertyLocationTable,
        eq(propertiesTable.id, propertyLocationTable.propertyId),
      )
      .leftJoin(
        propertyPricingTable,
        eq(propertiesTable.id, propertyPricingTable.propertyId),
      )
      .where(eq(propertiesTable.status, "active"))
      .orderBy(propertiesTable.createdAt);

    // Buscar imagens para cada propriedade
    const propertiesWithImages: PropertyWithDetails[] = [];

    // Função para validar URL de imagem
    const isValidImageUrl = (url: string): boolean => {
      // Se for uma URL local (começando com /), é válida
      if (url.startsWith("/")) {
        return true;
      }

      try {
        const urlObj = new URL(url);
        // Lista de domínios permitidos
        const allowedDomains = [
          "images.unsplash.com",
          "www.viajenaviagem.com",
          "cdn.pixabay.com",
          "images.pexels.com",
          "picsum.photos",
          "raw.githubusercontent.com",
          "i.imgur.com",
          "res.cloudinary.com",
        ];

        return (
          allowedDomains.includes(urlObj.hostname) &&
          (url.endsWith(".jpg") ||
            url.endsWith(".jpeg") ||
            url.endsWith(".png") ||
            url.endsWith(".webp") ||
            url.includes("unsplash.com") ||
            url.includes("picsum.photos"))
        );
      } catch {
        return false;
      }
    };

    for (const property of properties) {
      const images = await db
        .select({
          imageUrl: propertyImagesTable.imageUrl,
          altText: propertyImagesTable.altText,
          isMain: propertyImagesTable.isMain,
        })
        .from(propertyImagesTable)
        .where(eq(propertyImagesTable.propertyId, property.id))
        .orderBy(propertyImagesTable.displayOrder);

      // Filtrar apenas imagens com URLs válidas
      const validImages = images.filter((img) => isValidImageUrl(img.imageUrl));

      propertiesWithImages.push({
        id: property.id,
        title: property.title,
        shortDescription: property.shortDescription,
        maxGuests: property.maxGuests,
        bedrooms: property.bedrooms,
        bathrooms: property.bathrooms,
        allowsPets: property.allowsPets,
        propertyStyle: property.propertyStyle || "Apartamento",
        status: property.status,
        location: {
          fullAddress: property.fullAddress || "",
          neighborhood: property.neighborhood || "",
          municipality: property.municipality || "",
          city: property.city || "",
          state: property.state || "",
        },
        pricing: {
          dailyRate: property.dailyRate || "0",
          monthlyRent: property.monthlyRent || "0",
        },
        images: validImages,
      });
    }

    return propertiesWithImages;
  } catch (error) {
    console.error("Erro ao buscar propriedades:", error);
    return [];
  }
}

export async function getPropertiesByType(
  propertyType: string,
): Promise<PropertyWithDetails[]> {
  try {
    const properties = await db
      .select({
        // Dados da propriedade
        id: propertiesTable.id,
        title: propertiesTable.title,
        shortDescription: propertiesTable.shortDescription,
        maxGuests: propertiesTable.maxGuests,
        bedrooms: propertiesTable.bedrooms,
        bathrooms: propertiesTable.bathrooms,
        allowsPets: propertiesTable.allowsPets,
        propertyStyle: propertiesTable.propertyStyle,
        status: propertiesTable.status,
        // Dados de localização
        fullAddress: propertyLocationTable.fullAddress,
        neighborhood: propertyLocationTable.neighborhood,
        municipality: propertyLocationTable.municipality,
        city: propertyLocationTable.city,
        state: propertyLocationTable.state,
        // Dados de preço
        dailyRate: propertyPricingTable.dailyRate,
        monthlyRent: propertyPricingTable.monthlyRent,
      })
      .from(propertiesTable)
      .leftJoin(
        propertyLocationTable,
        eq(propertiesTable.id, propertyLocationTable.propertyId),
      )
      .leftJoin(
        propertyPricingTable,
        eq(propertiesTable.id, propertyPricingTable.propertyId),
      )
      .where(
        and(
          eq(propertiesTable.status, "active"),
          ilike(propertiesTable.propertyStyle, propertyType),
        ),
      )
      .orderBy(propertiesTable.createdAt);

    // Buscar imagens para cada propriedade
    const propertiesWithImages: PropertyWithDetails[] = [];

    // Função para validar URL de imagem
    const isValidImageUrl = (url: string): boolean => {
      // Se for uma URL local (começando com /), é válida
      if (url.startsWith("/")) {
        return true;
      }

      try {
        const urlObj = new URL(url);
        // Lista de domínios permitidos
        const allowedDomains = [
          "images.unsplash.com",
          "www.viajenaviagem.com",
          "cdn.pixabay.com",
          "images.pexels.com",
          "picsum.photos",
          "raw.githubusercontent.com",
          "i.imgur.com",
          "res.cloudinary.com",
        ];

        return (
          allowedDomains.includes(urlObj.hostname) &&
          (urlObj.pathname.endsWith(".jpg") ||
            urlObj.pathname.endsWith(".jpeg") ||
            urlObj.pathname.endsWith(".png") ||
            urlObj.pathname.endsWith(".webp") ||
            urlObj.pathname.includes("w=") || // Unsplash
            urlObj.pathname.includes("?")) // Outros parâmetros de imagem
        );
      } catch {
        return false;
      }
    };

    for (const property of properties) {
      // Buscar imagens da propriedade
      const images = await db
        .select({
          imageUrl: propertyImagesTable.imageUrl,
          altText: propertyImagesTable.altText,
          isMain: propertyImagesTable.isMain,
        })
        .from(propertyImagesTable)
        .where(eq(propertyImagesTable.propertyId, property.id));

      // Filtrar apenas imagens válidas
      const validImages = images.filter((img) => isValidImageUrl(img.imageUrl));

      propertiesWithImages.push({
        id: property.id,
        title: property.title,
        shortDescription: property.shortDescription,
        maxGuests: property.maxGuests,
        bedrooms: property.bedrooms,
        bathrooms: property.bathrooms,
        allowsPets: property.allowsPets,
        propertyStyle: property.propertyStyle || "",
        status: property.status,
        location: {
          fullAddress: property.fullAddress || "",
          neighborhood: property.neighborhood || "",
          municipality: property.municipality || "",
          city: property.city || "",
          state: property.state || "",
        },
        pricing: {
          dailyRate: property.dailyRate || "0",
          monthlyRent: property.monthlyRent || "0",
        },
        images: validImages,
      });
    }

    return propertiesWithImages;
  } catch (error) {
    console.error(
      `Erro ao buscar propriedades do tipo ${propertyType}:`,
      error,
    );
    return [];
  }
}

export async function getPropertiesByClass(
  propertyClass: string,
): Promise<PropertyWithDetails[]> {
  try {
    // Função para validar URLs de imagem
    const isValidImageUrl = (url: string): boolean => {
      if (!url || typeof url !== "string") {
        return false;
      }

      // Se for uma URL local (começando com /), é válida
      if (url.startsWith("/")) {
        return true;
      }

      try {
        const urlObj = new URL(url);
        // Lista de domínios permitidos
        const allowedDomains = [
          "images.unsplash.com",
          "www.viajenaviagem.com",
          "cdn.pixabay.com",
          "images.pexels.com",
          "picsum.photos",
          "raw.githubusercontent.com",
          "i.imgur.com",
          "res.cloudinary.com",
        ];

        return (
          allowedDomains.includes(urlObj.hostname) &&
          (urlObj.protocol === "http:" || urlObj.protocol === "https:")
        );
      } catch {
        return false;
      }
    };

    // Buscar propriedades que tenham a classe especificada na nova estrutura
    const properties = await db
      .select({
        // Dados da propriedade
        id: propertiesTable.id,
        title: propertiesTable.title,
        shortDescription: propertiesTable.shortDescription,
        maxGuests: propertiesTable.maxGuests,
        bedrooms: propertiesTable.bedrooms,
        bathrooms: propertiesTable.bathrooms,
        allowsPets: propertiesTable.allowsPets,
        propertyStyle: propertiesTable.propertyStyle,
        status: propertiesTable.status,
        // Dados de localização
        fullAddress: propertyLocationTable.fullAddress,
        neighborhood: propertyLocationTable.neighborhood,
        municipality: propertyLocationTable.municipality,
        city: propertyLocationTable.city,
        state: propertyLocationTable.state,
        // Dados de preço
        dailyRate: propertyPricingTable.dailyRate,
        monthlyRent: propertyPricingTable.monthlyRent,
      })
      .from(propertiesTable)
      .innerJoin(
        propertyLocationTable,
        eq(propertiesTable.id, propertyLocationTable.propertyId),
      )
      .innerJoin(
        propertyPricingTable,
        eq(propertiesTable.id, propertyPricingTable.propertyId),
      )
      .innerJoin(
        propertyPropertyClassesTable,
        eq(propertiesTable.id, propertyPropertyClassesTable.propertyId),
      )
      .innerJoin(
        propertyClassesTable,
        eq(propertyPropertyClassesTable.classId, propertyClassesTable.id),
      )
      .where(
        and(
          eq(propertiesTable.status, "active"),
          eq(propertyClassesTable.name, propertyClass),
        ),
      )
      .orderBy(propertiesTable.createdAt);

    // Buscar imagens para cada propriedade
    const propertiesWithImages: PropertyWithDetails[] = [];

    for (const property of properties) {
      // Buscar imagens para cada propriedade
      const images = await db
        .select({
          imageUrl: propertyImagesTable.imageUrl,
          altText: propertyImagesTable.altText,
          isMain: propertyImagesTable.isMain,
        })
        .from(propertyImagesTable)
        .where(eq(propertyImagesTable.propertyId, property.id))
        .orderBy(propertyImagesTable.displayOrder);

      // Filtrar e validar imagens
      const validImages = images.filter((img) => isValidImageUrl(img.imageUrl));

      propertiesWithImages.push({
        id: property.id,
        title: property.title,
        shortDescription: property.shortDescription,
        maxGuests: property.maxGuests,
        bedrooms: property.bedrooms,
        bathrooms: property.bathrooms,
        allowsPets: property.allowsPets,
        propertyStyle: property.propertyStyle || "",
        status: property.status,
        location: {
          fullAddress: property.fullAddress || "",
          neighborhood: property.neighborhood || "",
          municipality: property.municipality || "",
          city: property.city || "",
          state: property.state || "",
        },
        pricing: {
          dailyRate: property.dailyRate || "0",
          monthlyRent: property.monthlyRent || "0",
        },
        images: validImages,
      });
    }

    return propertiesWithImages;
  } catch (error) {
    console.error(
      `Erro ao buscar propriedades da classe ${propertyClass}:`,
      error,
    );
    return [];
  }
}

// Função para buscar imóveis com filtros de busca
export async function searchProperties({
  checkIn,
  checkOut,
  maxGuests,
  municipality,
  city,
  neighborhood,
}: {
  checkIn?: Date;
  checkOut?: Date;
  maxGuests?: number;
  municipality?: string;
  city?: string;
  neighborhood?: string;
}): Promise<PropertyWithDetails[]> {
  try {
    // Construir condições de busca dinamicamente
    const conditions = [eq(propertiesTable.status, "active")];

    // Se é busca por data e hóspedes
    if (checkIn && checkOut && maxGuests) {
      const numberOfDays = Math.ceil(
        (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24),
      );
      conditions.push(
        eq(propertiesTable.maxGuests, maxGuests),
        lte(propertiesTable.minimumStay, numberOfDays),
      );
    }

    // Se é busca por localização
    if (municipality) {
      conditions.push(
        ilike(propertyLocationTable.municipality, `%${municipality}%`),
      );
    }
    if (city) {
      // Busca por cidade usando ilike (case-insensitive)
      conditions.push(ilike(propertyLocationTable.city, `%${city}%`));
    }
    if (neighborhood) {
      // Busca por bairro usando ilike (case-insensitive)
      conditions.push(
        ilike(propertyLocationTable.neighborhood, `%${neighborhood}%`),
      );
    }

    // Buscar imóveis que atendem aos critérios
    const properties = await db
      .select({
        id: propertiesTable.id,
        title: propertiesTable.title,
        shortDescription: propertiesTable.shortDescription,
        maxGuests: propertiesTable.maxGuests,
        bedrooms: propertiesTable.bedrooms,
        bathrooms: propertiesTable.bathrooms,
        allowsPets: propertiesTable.allowsPets,
        propertyStyle: propertiesTable.propertyStyle,
        status: propertiesTable.status,
        minimumStay: propertiesTable.minimumStay,
        // Dados de localização
        fullAddress: propertyLocationTable.fullAddress,
        neighborhood: propertyLocationTable.neighborhood,
        municipality: propertyLocationTable.municipality,
        city: propertyLocationTable.city,
        state: propertyLocationTable.state,
        // Dados de preço
        dailyRate: propertyPricingTable.dailyRate,
        monthlyRent: propertyPricingTable.monthlyRent,
      })
      .from(propertiesTable)
      .leftJoin(
        propertyLocationTable,
        eq(propertiesTable.id, propertyLocationTable.propertyId),
      )
      .leftJoin(
        propertyPricingTable,
        eq(propertiesTable.id, propertyPricingTable.propertyId),
      )
      .where(and(...conditions));

    // Buscar imagens para cada propriedade
    const propertiesWithImages: PropertyWithDetails[] = [];

    for (const property of properties) {
      const images = await db
        .select()
        .from(propertyImagesTable)
        .where(eq(propertyImagesTable.propertyId, property.id));

      const validImages = images.filter((img) => img.imageUrl);

      propertiesWithImages.push({
        id: property.id,
        title: property.title,
        shortDescription: property.shortDescription,
        maxGuests: property.maxGuests,
        bedrooms: property.bedrooms,
        bathrooms: property.bathrooms,
        allowsPets: property.allowsPets,
        propertyStyle: property.propertyStyle || "",
        status: property.status,
        location: {
          fullAddress: property.fullAddress || "",
          neighborhood: property.neighborhood || "",
          municipality: property.municipality || "",
          city: property.city || "",
          state: property.state || "",
        },
        pricing: {
          dailyRate: property.dailyRate || "0",
          monthlyRent: property.monthlyRent || "0",
        },
        images: validImages,
      });
    }

    return propertiesWithImages;
  } catch (error) {
    console.error("Erro ao buscar propriedades com filtros:", error);
    return [];
  }
}

// Função para buscar todas as propriedades sem filtros específicos
export async function getAllProperties(): Promise<PropertyWithDetails[]> {
  try {
    const properties = await db
      .select({
        // Dados da propriedade
        id: propertiesTable.id,
        title: propertiesTable.title,
        shortDescription: propertiesTable.shortDescription,
        maxGuests: propertiesTable.maxGuests,
        bedrooms: propertiesTable.bedrooms,
        bathrooms: propertiesTable.bathrooms,
        allowsPets: propertiesTable.allowsPets,
        propertyStyle: propertiesTable.propertyStyle,
        status: propertiesTable.status,

        // Dados de localização
        locationId: propertyLocationTable.id,
        fullAddress: propertyLocationTable.fullAddress,
        neighborhood: propertyLocationTable.neighborhood,
        municipality: propertyLocationTable.municipality,
        city: propertyLocationTable.city,
        state: propertyLocationTable.state,

        // Dados de preços
        pricingId: propertyPricingTable.id,
        dailyRate: propertyPricingTable.dailyRate,
        monthlyRent: propertyPricingTable.monthlyRent,

        // Primeira imagem
        imageUrl: propertyImagesTable.imageUrl,
        isMain: propertyImagesTable.isMain,
      })
      .from(propertiesTable)
      .leftJoin(
        propertyLocationTable,
        eq(propertiesTable.id, propertyLocationTable.propertyId),
      )
      .leftJoin(
        propertyPricingTable,
        eq(propertiesTable.id, propertyPricingTable.propertyId),
      )
      .leftJoin(
        propertyImagesTable,
        eq(propertiesTable.id, propertyImagesTable.propertyId),
      )
      .where(eq(propertiesTable.status, "active"));

    // Agrupar propriedades e suas imagens
    const propertiesMap = new Map<string, PropertyWithDetails>();

    for (const row of properties) {
      if (!propertiesMap.has(row.id)) {
        propertiesMap.set(row.id, {
          id: row.id,
          title: row.title,
          shortDescription: row.shortDescription,
          maxGuests: row.maxGuests,
          bedrooms: row.bedrooms,
          bathrooms: row.bathrooms,
          allowsPets: row.allowsPets || false,
          propertyStyle: row.propertyStyle || "",
          status: row.status || "active",
          location: {
            fullAddress: row.fullAddress || "",
            neighborhood: row.neighborhood || "",
            municipality: row.municipality || "",
            city: row.city || "",
            state: row.state || "",
          },
          pricing: {
            dailyRate: row.dailyRate || "0",
            monthlyRent: row.monthlyRent || "0",
          },
          images: [],
        });
      }

      const property = propertiesMap.get(row.id)!;
      if (
        row.imageUrl &&
        !property.images.some((img) => img.imageUrl === row.imageUrl)
      ) {
        property.images.push({
          imageUrl: row.imageUrl,
          altText: null,
          isMain: row.isMain || false,
        });
      }
    }

    return Array.from(propertiesMap.values());
  } catch (error) {
    console.error("Erro ao buscar todas as propriedades:", error);
    return [];
  }
}

// Função para buscar propriedades por destino popular
export async function getPropertiesByDestination(
  destination: string,
): Promise<PropertyWithDetails[]> {
  try {
    const properties = await db
      .select({
        // Dados da propriedade
        id: propertiesTable.id,
        title: propertiesTable.title,
        shortDescription: propertiesTable.shortDescription,
        maxGuests: propertiesTable.maxGuests,
        bedrooms: propertiesTable.bedrooms,
        bathrooms: propertiesTable.bathrooms,
        allowsPets: propertiesTable.allowsPets,
        propertyStyle: propertiesTable.propertyStyle,
        status: propertiesTable.status,

        // Dados de localização
        locationId: propertyLocationTable.id,
        fullAddress: propertyLocationTable.fullAddress,
        neighborhood: propertyLocationTable.neighborhood,
        municipality: propertyLocationTable.municipality,
        city: propertyLocationTable.city,
        state: propertyLocationTable.state,
        popularDestination: propertyLocationTable.popularDestination,

        // Dados de preços
        pricingId: propertyPricingTable.id,
        dailyRate: propertyPricingTable.dailyRate,
        monthlyRent: propertyPricingTable.monthlyRent,

        // Primeira imagem
        imageUrl: propertyImagesTable.imageUrl,
        isMain: propertyImagesTable.isMain,
      })
      .from(propertiesTable)
      .leftJoin(
        propertyLocationTable,
        eq(propertiesTable.id, propertyLocationTable.propertyId),
      )
      .leftJoin(
        propertyPricingTable,
        eq(propertiesTable.id, propertyPricingTable.propertyId),
      )
      .leftJoin(
        propertyImagesTable,
        eq(propertiesTable.id, propertyImagesTable.propertyId),
      )
      .where(
        and(
          eq(propertiesTable.status, "active"),
          eq(propertyLocationTable.popularDestination, destination),
        ),
      );

    // Agrupar propriedades e suas imagens
    const propertiesMap = new Map<string, PropertyWithDetails>();

    for (const row of properties) {
      if (!propertiesMap.has(row.id)) {
        propertiesMap.set(row.id, {
          id: row.id,
          title: row.title,
          shortDescription: row.shortDescription,
          maxGuests: row.maxGuests,
          bedrooms: row.bedrooms,
          bathrooms: row.bathrooms,
          allowsPets: row.allowsPets || false,
          propertyStyle: row.propertyStyle || "",
          status: row.status || "active",
          location: {
            fullAddress: row.fullAddress || "",
            neighborhood: row.neighborhood || "",
            municipality: row.municipality || "",
            city: row.city || "",
            state: row.state || "",
            popularDestination: row.popularDestination || "",
          },
          pricing: {
            dailyRate: row.dailyRate || "0",
            monthlyRent: row.monthlyRent || "0",
          },
          images: [],
        });
      }

      const property = propertiesMap.get(row.id)!;
      if (
        row.imageUrl &&
        !property.images.some((img) => img.imageUrl === row.imageUrl)
      ) {
        property.images.push({
          imageUrl: row.imageUrl,
          altText: null,
          isMain: row.isMain || false,
        });
      }
    }

    return Array.from(propertiesMap.values());
  } catch (error) {
    console.error("Erro ao buscar propriedades por destino:", error);
    return [];
  }
}
