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
  propertyClassesTable,
  propertyImagesTable,
  propertyLocationTable,
  propertyPricingTable,
  propertyPropertyClassesTable,
  reservationsTable,
  usersTable,
} from "@/app/db/schema";

// Definir tipos para os resultados das consultas
interface PropertyLocation {
  id: number;
  propertyId: string;
  fullAddress: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  latitude: string | null;
  longitude: string | null;
  createdAt: Date;
  updatedAt: Date;
}

interface PropertyPricing {
  id: number;
  propertyId: string;
  monthlyRent: string;
  dailyRate: string;
  condominiumFee: string | null;
  iptuFee: string | null;
  monthlyCleaningFee: string | null;
  otherFees: string | null;
  includesKitchenUtensils: boolean | null;
  includesFurniture: boolean | null;
  includesElectricity: boolean | null;
  includesInternet: boolean | null;
  includesLinens: boolean | null;
  includesWater: boolean | null;
  createdAt: Date;
  updatedAt: Date;
}

interface PropertyAmenity {
  amenityId: number;
  name?: string;
  icon?: string;
}

interface PropertyImage {
  imageUrl: string;
}

interface PropertyClass {
  classId: number;
}

interface FullProperty {
  id: string;
  title: string;
  shortDescription: string;
  fullDescription: string | null;
  maxGuests: number;
  bedrooms: number;
  bathrooms: number;
  parkingSpaces: number;
  areaM2: string | null;
  allowsPets: boolean;
  propertyStyle: string | null;
  propertyClass: string;
  bedTypes: string | null;
  minimumStay: number;
  checkInTime: string | null;
  checkOutTime: string | null;
  petPolicy: string | null;
  cancellationPolicy: string | null;
  externalLink: string | null;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  location: PropertyLocation | null;
  pricing: PropertyPricing | null;
  amenities: PropertyAmenity[];
  images: PropertyImage[];
  classes: PropertyClass[];
}

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
  propertyClasses: string[];
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

  // Novos campos para edição
  allowsSmoking?: boolean;
  allowsParties?: boolean;
  isInstantBook?: boolean;
  maximumStay?: number;
  advanceNotice?: number;
  propertyType?: string;
  listingType?: string;
  selfCheckIn?: boolean;
  cancellationPolicy?: string;
  status?: string;

  // Objetos aninhados para edição
  location?: {
    fullAddress: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
    latitude?: number;
    longitude?: number;
  };

  pricing?: {
    dailyRate: string;
    weeklyRate?: string;
    monthlyRate?: string;
    securityDeposit?: string;
    cleaningFee?: string;
  };

  // ID do admin
  adminId?: number;
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
        minimumStay: data.minimumStay,
        checkInTime: data.checkInTime,
        checkOutTime: data.checkOutTime,
        status: "active",
      })
      .returning({ id: propertiesTable.id });

    if (!property) {
      throw new Error("Falha ao criar imóvel");
    }

    // 2. Criar associações com classes de imóvel
    if (data.propertyClasses && data.propertyClasses.length > 0) {
      console.log("propertyClasses recebidas:", data.propertyClasses);

      const propertyClassValues = data.propertyClasses.map((classId) => {
        const parsedId = parseInt(classId);
        console.log(`Convertendo classId "${classId}" para ${parsedId}`);
        return {
          propertyId,
          classId: parsedId,
        };
      });

      console.log("Valores para inserção:", propertyClassValues);
      await db.insert(propertyPropertyClassesTable).values(propertyClassValues);
    } // 3. Criar informações de preços
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

// Função para buscar um imóvel por ID com todos os dados relacionados
export async function getPropertyById(
  propertyId: string,
): Promise<FullProperty | null> {
  try {
    // Buscar o imóvel principal
    const property = await db
      .select()
      .from(propertiesTable)
      .where(eq(propertiesTable.id, propertyId))
      .limit(1);

    if (property.length === 0) {
      return null;
    }

    const propertyData = property[0];

    // Buscar localização
    const location = await db
      .select()
      .from(propertyLocationTable)
      .where(eq(propertyLocationTable.propertyId, propertyId))
      .limit(1);

    // Buscar preços
    const pricing = await db
      .select()
      .from(propertyPricingTable)
      .where(eq(propertyPricingTable.propertyId, propertyId))
      .limit(1);

    // Buscar imagens
    const images = await db
      .select()
      .from(propertyImagesTable)
      .where(eq(propertyImagesTable.propertyId, propertyId));

    // Buscar comodidades
    const amenities = await db
      .select({
        amenityId: propertyAmenitiesTable.amenityId,
        name: amenitiesTable.name,
        icon: amenitiesTable.icon,
      })
      .from(propertyAmenitiesTable)
      .leftJoin(
        amenitiesTable,
        eq(propertyAmenitiesTable.amenityId, amenitiesTable.id),
      )
      .where(eq(propertyAmenitiesTable.propertyId, propertyId));

    // Buscar classes
    const classes = await db
      .select({
        classId: propertyPropertyClassesTable.classId,
      })
      .from(propertyPropertyClassesTable)
      .where(eq(propertyPropertyClassesTable.propertyId, propertyId));

    return {
      ...propertyData,
      location: location[0] || null,
      pricing: pricing[0] || null,
      images: images.map((img) => ({ imageUrl: img.imageUrl })) || [],
      amenities: amenities.map((a) => ({ amenityId: a.amenityId })) || [],
      classes: classes || [],
    };
  } catch (error) {
    console.error("Erro ao buscar imóvel:", error);
    throw new Error("Erro ao buscar imóvel");
  }
}

// Função para atualizar um imóvel
export async function updateProperty(
  propertyId: string,
  data: PropertyFormData,
) {
  try {
    // Atualizar dados básicos do imóvel
    await db
      .update(propertiesTable)
      .set({
        title: data.title,
        shortDescription: data.shortDescription,
        fullDescription: data.fullDescription || "",
        maxGuests: data.maxGuests,
        bedrooms: data.bedrooms,
        bathrooms: data.bathrooms,
        parkingSpaces: data.parkingSpaces,
        areaM2: data.areaM2?.toString(),
        allowsPets: data.allowsPets,
        minimumStay: data.minimumStay,
        checkInTime: data.checkInTime,
        checkOutTime: data.checkOutTime,
        propertyStyle: data.propertyStyle,
        status: data.status || "active",
        updatedAt: new Date(),
      })
      .where(eq(propertiesTable.id, propertyId));

    // Atualizar localização
    if (data.location) {
      await db
        .update(propertyLocationTable)
        .set({
          fullAddress: data.location.fullAddress,
          neighborhood: data.location.neighborhood,
          city: data.location.city,
          state: data.location.state,
          zipCode: data.location.zipCode,
          latitude: data.location.latitude?.toString(),
          longitude: data.location.longitude?.toString(),
        })
        .where(eq(propertyLocationTable.propertyId, propertyId));
    }

    // Atualizar preços
    if (data.pricing) {
      await db
        .update(propertyPricingTable)
        .set({
          dailyRate: data.pricing.dailyRate,
          monthlyRent: data.pricing.monthlyRate,
        })
        .where(eq(propertyPricingTable.propertyId, propertyId));
    }

    // Atualizar comodidades
    if (data.amenities && data.amenities.length > 0) {
      // Deletar comodidades existentes
      await db
        .delete(propertyAmenitiesTable)
        .where(eq(propertyAmenitiesTable.propertyId, propertyId));

      // Inserir novas comodidades
      const amenityInserts = data.amenities.map((amenityId) => ({
        propertyId,
        amenityId,
      }));

      if (amenityInserts.length > 0) {
        await db.insert(propertyAmenitiesTable).values(amenityInserts);
      }
    }

    // Atualizar classes
    if (data.propertyClasses && data.propertyClasses.length > 0) {
      // Deletar classes existentes
      await db
        .delete(propertyPropertyClassesTable)
        .where(eq(propertyPropertyClassesTable.propertyId, propertyId));

      // Inserir novas classes
      const classInserts = data.propertyClasses
        .map((classIdStr) => {
          const classId = parseInt(classIdStr);
          if (isNaN(classId)) {
            console.error(`Invalid classId: ${classIdStr}`);
            return null;
          }
          return {
            propertyId,
            classId,
          };
        })
        .filter(
          (item): item is { propertyId: string; classId: number } =>
            item !== null,
        );

      if (classInserts.length > 0) {
        await db.insert(propertyPropertyClassesTable).values(classInserts);
      }
    }

    // Atualizar imagens
    if (data.images && data.images.length > 0) {
      // Deletar imagens existentes
      await db
        .delete(propertyImagesTable)
        .where(eq(propertyImagesTable.propertyId, propertyId));

      // Inserir novas imagens
      const imageInserts = data.images.map((imageUrl, index) => ({
        propertyId,
        imageUrl,
        altText: `Imagem ${index + 1} do imóvel`,
        isMain: index === 0, // Primeira imagem como principal
      }));

      if (imageInserts.length > 0) {
        await db.insert(propertyImagesTable).values(imageInserts);
      }
    }

    // Atualizar classes do imóvel
    if (data.propertyClasses && data.propertyClasses.length > 0) {
      // Primeiro remover todas as classes existentes
      await db
        .delete(propertyPropertyClassesTable)
        .where(eq(propertyPropertyClassesTable.propertyId, propertyId));

      // Depois adicionar as novas classes
      const propertyClassValues = data.propertyClasses.map((classId) => ({
        propertyId,
        classId: parseInt(classId),
      }));

      await db.insert(propertyPropertyClassesTable).values(propertyClassValues);
    }

    return { success: true, message: "Imóvel atualizado com sucesso!" };
  } catch (error) {
    console.error("Erro ao atualizar imóvel:", error);
    return {
      success: false,
      error: "Erro interno do servidor ao atualizar o imóvel",
    };
  }
}

// Função para buscar classes de imóveis
export async function getPropertyClasses() {
  try {
    const classes = await db
      .select({
        id: propertyClassesTable.id,
        name: propertyClassesTable.name,
        description: propertyClassesTable.description,
      })
      .from(propertyClassesTable)
      .where(eq(propertyClassesTable.isActive, true))
      .orderBy(propertyClassesTable.name);

    return classes;
  } catch (error) {
    console.error("Erro ao buscar classes de imóveis:", error);
    return [];
  }
}

// Função para buscar imóveis por classe específica (para os banners)
export async function getPropertiesByClass(className: string) {
  try {
    const properties = await db
      .select({
        id: propertiesTable.id,
        title: propertiesTable.title,
        shortDescription: propertiesTable.shortDescription,
        maxGuests: propertiesTable.maxGuests,
        bedrooms: propertiesTable.bedrooms,
        bathrooms: propertiesTable.bathrooms,
        // Dados de localização
        city: propertyLocationTable.city,
        state: propertyLocationTable.state,
        neighborhood: propertyLocationTable.neighborhood,
        // Dados de preço
        dailyRate: propertyPricingTable.dailyRate,
        // Primeira imagem
        imageUrl: propertyImagesTable.imageUrl,
      })
      .from(propertiesTable)
      .innerJoin(
        propertyPropertyClassesTable,
        eq(propertiesTable.id, propertyPropertyClassesTable.propertyId),
      )
      .innerJoin(
        propertyClassesTable,
        eq(propertyPropertyClassesTable.classId, propertyClassesTable.id),
      )
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
      .where(eq(propertyClassesTable.name, className))
      .orderBy(desc(propertiesTable.createdAt))
      .limit(1); // Pegamos apenas 1 imóvel por banner

    return properties[0] || null;
  } catch (error) {
    console.error(`Erro ao buscar imóveis da classe ${className}:`, error);
    return null;
  }
}
