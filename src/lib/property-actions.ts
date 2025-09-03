"use server";

import { desc, eq } from "drizzle-orm";
import fs from "fs/promises";
import { nanoid } from "nanoid";
import path from "path";

import { db } from "@/app/db";
import {
  amenitiesTable,
  propertiesTable,
  propertyAmenitiesTable,
  propertyAvailabilityTable,
  propertyImagesTable,
  propertyLocationTable,
  propertyPricingTable,
  reservationsTable,
  usersTable,
} from "@/app/db/schema";

export type PropertyFormData = {
  // Dados básicos do imóvel
  title: string;
  shortDescription: string;
  fullDescription?: string;
  maxGuests: number;
  bedrooms: number;
  bathrooms: number;
  parkingSpaces: number;
  areaM2?: number;
  allowsPets: boolean;
  propertyStyle: string;
  propertyClass: string;
  minimumStay: number;
  checkInTime?: string;
  checkOutTime?: string;

  // Preços
  monthlyRent: number;
  dailyRate: number;
  condominiumFee?: number;
  iptuFee?: number;
  monthlyCleaningFee?: number;
  otherFees?: number;

  // Serviços inclusos
  includesKitchenUtensils: boolean;
  includesFurniture: boolean;
  includesElectricity: boolean;
  includesInternet: boolean;
  includesLinens: boolean;
  includesWater: boolean;

  // Localização
  fullAddress: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  latitude?: number;
  longitude?: number;

  // Comodidades
  amenities: number[];

  // Imagens
  images: string[];
};

export async function createProperty(data: PropertyFormData) {
  try {
    // Gerar ID único com nanoid
    const propertyId = nanoid();

    // 1. Criar o imóvel principal
    const [property] = await db
      .insert(propertiesTable)
      .values({
        id: propertyId,
        title: data.title,
        shortDescription: data.shortDescription,
        fullDescription: data.fullDescription,
        maxGuests: data.maxGuests,
        bedrooms: data.bedrooms,
        bathrooms: data.bathrooms,
        parkingSpaces: data.parkingSpaces,
        areaM2: data.areaM2?.toString(),
        allowsPets: data.allowsPets,
        propertyStyle: data.propertyStyle,
        propertyClass: data.propertyClass,
        minimumStay: data.minimumStay,
        checkInTime: data.checkInTime,
        checkOutTime: data.checkOutTime,
        status: "active",
      })
      .returning({ id: propertiesTable.id });

    if (!property) {
      throw new Error("Falha ao criar imóvel");
    }

    // 2. Criar informações de preços
    await db.insert(propertyPricingTable).values({
      propertyId,
      monthlyRent: data.monthlyRent.toString(),
      dailyRate: data.dailyRate.toString(),
      condominiumFee: data.condominiumFee?.toString() || "0",
      iptuFee: data.iptuFee?.toString() || "0",
      monthlyCleaningFee: data.monthlyCleaningFee?.toString() || "0",
      otherFees: data.otherFees?.toString() || "0",
      includesKitchenUtensils: data.includesKitchenUtensils,
      includesFurniture: data.includesFurniture,
      includesElectricity: data.includesElectricity,
      includesInternet: data.includesInternet,
      includesLinens: data.includesLinens,
      includesWater: data.includesWater,
    });

    // 3. Criar informações de localização
    await db.insert(propertyLocationTable).values({
      propertyId,
      fullAddress: data.fullAddress,
      neighborhood: data.neighborhood,
      city: data.city,
      state: data.state,
      zipCode: data.zipCode,
      latitude: data.latitude?.toString(),
      longitude: data.longitude?.toString(),
    });

    // 4. Adicionar imagens
    if (data.images.length > 0) {
      const imageData = data.images.map((url, index) => ({
        propertyId,
        imageUrl: url,
        displayOrder: index,
        isMain: index === 0, // Primeira imagem é a principal
      }));

      await db.insert(propertyImagesTable).values(imageData);
    }

    // 5. Adicionar comodidades
    if (data.amenities.length > 0) {
      const amenityData = data.amenities.map((amenityId) => ({
        propertyId,
        amenityId,
      }));

      await db.insert(propertyAmenitiesTable).values(amenityData);
    }

    return { success: true, propertyId };
  } catch (error) {
    console.error("Erro ao criar imóvel:", error);
    return { success: false, error: "Erro interno do servidor" };
  }
}

// Função para buscar um usuário admin
export async function getAdminUser(adminId: string) {
  try {
    const adminIdNum = parseInt(adminId);
    if (isNaN(adminIdNum)) {
      return null;
    }

    const adminUser = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, adminIdNum))
      .limit(1);

    if (adminUser.length === 0 || !adminUser[0].isActive) {
      return null;
    }

    return adminUser[0];
  } catch (error) {
    console.error("Erro ao buscar usuário admin:", error);
    return null;
  }
}

// Função para buscar propriedades de um admin
// NOTA: Atualmente retorna todas as propriedades pois não há campo createdBy na tabela
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function getPropertiesByAdmin(adminId: string) {
  try {
    const properties = await db
      .select({
        id: propertiesTable.id,
        title: propertiesTable.title,
        shortDescription: propertiesTable.shortDescription,
        maxGuests: propertiesTable.maxGuests,
        bedrooms: propertiesTable.bedrooms,
        bathrooms: propertiesTable.bathrooms,
        status: propertiesTable.status,
        createdAt: propertiesTable.createdAt,
        dailyRate: propertyPricingTable.dailyRate,
        monthlyRent: propertyPricingTable.monthlyRent,
        fullAddress: propertyLocationTable.fullAddress,
        neighborhood: propertyLocationTable.neighborhood,
        city: propertyLocationTable.city,
        state: propertyLocationTable.state,
      })
      .from(propertiesTable)
      .leftJoin(
        propertyPricingTable,
        eq(propertiesTable.id, propertyPricingTable.propertyId),
      )
      .leftJoin(
        propertyLocationTable,
        eq(propertiesTable.id, propertyLocationTable.propertyId),
      )
      .orderBy(desc(propertiesTable.createdAt));

    return properties;
  } catch (error) {
    console.error("Erro ao buscar propriedades:", error);
    return [];
  }
}
export async function getAmenities() {
  try {
    const amenities = await db
      .select({
        id: amenitiesTable.id,
        name: amenitiesTable.name,
        category: amenitiesTable.category,
      })
      .from(amenitiesTable)
      .where(eq(amenitiesTable.isActive, true))
      .orderBy(amenitiesTable.category, amenitiesTable.name);

    return amenities;
  } catch (error) {
    console.error("Erro ao buscar comodidades:", error);
    return [];
  }
}

// Função para excluir um imóvel completamente
export async function deleteProperty(propertyId: string) {
  try {
    // 1. Buscar todas as imagens do imóvel para deletá-las fisicamente
    const images = await db
      .select({
        imageUrl: propertyImagesTable.imageUrl,
      })
      .from(propertyImagesTable)
      .where(eq(propertyImagesTable.propertyId, propertyId));

    // 2. Deletar arquivos de imagem fisicamente do servidor
    for (const image of images) {
      try {
        // Se a imagem é local (começa com /uploads/)
        if (image.imageUrl.startsWith("/uploads/")) {
          const filePath = path.join(process.cwd(), "public", image.imageUrl);
          await fs.unlink(filePath);
        }
      } catch (fileError) {
        console.warn(`Erro ao deletar arquivo ${image.imageUrl}:`, fileError);
        // Continua mesmo se um arquivo não puder ser deletado
      }
    }

    // 3. Deletar registros do banco de dados (em ordem para respeitar foreign keys)

    // Deletar disponibilidade/calendário
    await db
      .delete(propertyAvailabilityTable)
      .where(eq(propertyAvailabilityTable.propertyId, propertyId));

    // Deletar reservas
    await db
      .delete(reservationsTable)
      .where(eq(reservationsTable.propertyId, propertyId));

    // Deletar relacionamentos com comodidades
    await db
      .delete(propertyAmenitiesTable)
      .where(eq(propertyAmenitiesTable.propertyId, propertyId));

    // Deletar imagens (registros do banco)
    await db
      .delete(propertyImagesTable)
      .where(eq(propertyImagesTable.propertyId, propertyId));

    // Deletar preços
    await db
      .delete(propertyPricingTable)
      .where(eq(propertyPricingTable.propertyId, propertyId));

    // Deletar localização
    await db
      .delete(propertyLocationTable)
      .where(eq(propertyLocationTable.propertyId, propertyId));

    // Deletar o imóvel principal
    await db.delete(propertiesTable).where(eq(propertiesTable.id, propertyId));

    return { success: true, message: "Imóvel excluído com sucesso!" };
  } catch (error) {
    console.error("Erro ao excluir imóvel:", error);
    return {
      success: false,
      error: "Erro interno do servidor ao excluir o imóvel",
    };
  }
}
