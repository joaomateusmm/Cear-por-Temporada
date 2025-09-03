"use server";

import { and, eq, ilike } from "drizzle-orm";

import { db } from "@/app/db";
import {
  propertiesTable,
  propertyImagesTable,
  propertyLocationTable,
  propertyPricingTable,
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
    city: string;
    state: string;
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
        propertyClass: propertiesTable.propertyClass,
        status: propertiesTable.status,
        // Dados de localização
        fullAddress: propertyLocationTable.fullAddress,
        neighborhood: propertyLocationTable.neighborhood,
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
      .where(
        and(
          eq(propertiesTable.status, "active"),
          ilike(propertiesTable.propertyClass, `%${propertyClass}%`),
        ),
      );

    const propertiesWithImages: PropertyWithDetails[] = [];

    for (const property of properties) {
      // Buscar imagens para cada propriedade
      const images = await db
        .select({
          id: propertyImagesTable.id,
          imageUrl: propertyImagesTable.imageUrl,
          altText: propertyImagesTable.altText,
          isMain: propertyImagesTable.isMain,
          displayOrder: propertyImagesTable.displayOrder,
        })
        .from(propertyImagesTable)
        .where(eq(propertyImagesTable.propertyId, property.id));

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
