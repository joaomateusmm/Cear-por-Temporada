"use server";

import { desc, eq } from "drizzle-orm";
import fs from "fs/promises";
import { nanoid } from "nanoid";
import { revalidatePath, revalidateTag } from "next/cache";
import path from "path";

import { db } from "@/app/db";
import {
  amenitiesTable,
  apartmentRoomsTable,
  ownersTable,
  propertiesTable,
  propertyAmenitiesTable,
  propertyApartmentsTable,
  propertyAvailabilityTable,
  propertyClassesTable,
  propertyHouseRulesTable,
  propertyImagesTable,
  propertyLocationTable,
  propertyNearbyAirportsTable,
  propertyNearbyBeachesTable,
  propertyNearbyPlacesTable,
  propertyNearbyRestaurantsTable,
  propertyPaymentMethodsTable,
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
  municipality: string;
  city: string;
  state: string;
  zipCode: string;
  latitude: string | null;
  longitude: string | null;
  popularDestination: string | null;
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
  ownerId: string | null;
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
  maximumStay: number | null;
  checkInTime: string | null;
  checkOutTime: string | null;
  petPolicy: string | null;
  cancellationPolicy: string | null;
  externalLink: string | null;
  status: string;
  aboutBuilding: string | null;
  createdAt: Date;
  updatedAt: Date;
  location: PropertyLocation | null;
  pricing: PropertyPricing | null;
  amenities: PropertyAmenity[];
  images: PropertyImage[];
  classes: PropertyClass[];
  nearbyPlaces?: Array<{ name: string; distance: string }>;
  nearbyBeaches?: Array<{ name: string; distance: string }>;
  nearbyAirports?: Array<{ name: string; distance: string }>;
  nearbyRestaurants?: Array<{ name: string; distance: string }>;
  houseRules?: {
    id: number;
    propertyId: string;
    checkInRule: string | null;
    checkOutRule: string | null;
    cancellationRule: string | null;
    childrenRule: string | null;
    petsRule: string | null;
    bedsRule: string | null;
    ageRestrictionRule: string | null;
    groupsRule: string | null;
    partyRule: string | null;
    restaurantRule: string | null;
    createdAt: Date;
    updatedAt: Date;
  } | null;
  paymentMethods?: {
    id: number;
    propertyId: string;
    acceptsVisa: boolean;
    acceptsAmericanExpress: boolean;
    acceptsMasterCard: boolean;
    acceptsMaestro: boolean;
    acceptsElo: boolean;
    acceptsDinersClub: boolean;
    acceptsPix: boolean;
    acceptsCash: boolean;
    createdAt: Date;
    updatedAt: Date;
  } | null;
  apartments?: Array<{
    id?: number;
    name: string;
    totalBathrooms: number;
    hasLivingRoom: boolean;
    livingRoomHasSofaBed: boolean;
    hasKitchen: boolean;
    kitchenHasStove: boolean;
    kitchenHasFridge: boolean;
    kitchenHasMinibar: boolean;
    hasBalcony: boolean;
    balconyHasSeaView: boolean;
    hasCrib: boolean;
    rooms: Array<{
      name: string;
      doubleBeds: number;
      largeBeds: number;
      extraLargeBeds: number;
      singleBeds: number;
      sofaBeds: number;
    }>;
  }>;
  owner?: {
    id: string;
    fullName: string;
    email: string;
    phone?: string;
    instagram?: string;
    website?: string;
    profileImage?: string;
  } | null;
}

export type PropertyFormData = {
  // ID do proprietário
  ownerId?: string;

  // Dados do proprietário
  ownerName?: string;
  ownerPhone?: string;
  ownerEmail?: string;
  ownerInstagram?: string;
  ownerWebsite?: string;
  ownerProfileImage?: string;

  // Dados básicos do imóvel
  title: string;
  shortDescription: string;
  fullDescription?: string;
  aboutBuilding?: string;
  maxGuests: number;
  bedrooms: number;
  bathrooms: number;
  parkingSpaces: number;
  areaM2?: number;
  allowsPets: boolean;
  propertyStyle: string;
  propertyClasses: string[];
  minimumStay: number;
  maximumStay: number;
  checkInTime?: string;
  checkOutTime?: string;

  // Proximidades da região
  nearbyPlaces?: Array<{ name: string; distance: string }>;
  nearbyBeaches?: Array<{ name: string; distance: string }>;
  nearbyAirports?: Array<{ name: string; distance: string }>;
  nearbyRestaurants?: Array<{ name: string; distance: string }>;

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
  municipality: string;
  city: string;
  state: string;
  zipCode: string;
  latitude?: number;
  longitude?: number;
  popularDestination: string;

  // Comodidades
  amenities: number[];

  // Imagens
  images: string[];

  // Apartamentos
  apartments?: Array<{
    name: string;
    totalBathrooms: number;
    hasLivingRoom: boolean;
    livingRoomHasSofaBed: boolean;
    hasKitchen: boolean;
    kitchenHasStove: boolean;
    kitchenHasFridge: boolean;
    kitchenHasMinibar: boolean;
    hasBalcony: boolean;
    balconyHasSeaView: boolean;
    hasCrib: boolean;
    rooms: Array<{
      roomNumber: number;
      doubleBeds: number;
      largeBeds: number;
      extraLargeBeds: number;
      singleBeds: number;
      sofaBeds: number;
    }>;
  }>;

  // Regras da Casa
  checkInRule?: string;
  checkOutRule?: string;
  cancellationRule?: string;
  childrenRule?: string;
  petsRule?: string;
  bedsRule?: string;
  ageRestrictionRule?: string;
  groupsRule?: string;
  partyRule?: string;
  restaurantRule?: string;

  // Métodos de pagamento aceitos
  acceptsVisa?: boolean;
  acceptsAmericanExpress?: boolean;
  acceptsMasterCard?: boolean;
  acceptsMaestro?: boolean;
  acceptsElo?: boolean;
  acceptsDinersClub?: boolean;
  acceptsPix?: boolean;
  acceptsCash?: boolean;

  // Novos campos para edição
  allowsSmoking?: boolean;
  allowsParties?: boolean;
  isInstantBook?: boolean;
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
    municipality: string;
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
        ownerId: data.ownerId || null, // Adicionar o ownerId
        title: data.title,
        shortDescription: data.shortDescription,
        fullDescription: data.fullDescription,
        aboutBuilding: data.aboutBuilding,
        maxGuests: data.maxGuests,
        bedrooms: data.bedrooms,
        bathrooms: data.bathrooms,
        parkingSpaces: data.parkingSpaces,
        areaM2: data.areaM2?.toString(),
        allowsPets: data.allowsPets,
        propertyStyle: data.propertyStyle,
        minimumStay: data.minimumStay,
        maximumStay: data.maximumStay,
        checkInTime: data.checkInTime,
        checkOutTime: data.checkOutTime,
        status: "pendente",
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
    }

    // 3. Criar informações de proximidades
    if (data.nearbyPlaces && data.nearbyPlaces.length > 0) {
      const nearbyPlacesData = data.nearbyPlaces.map((place) => ({
        propertyId,
        name: place.name,
        distance: place.distance,
      }));
      await db.insert(propertyNearbyPlacesTable).values(nearbyPlacesData);
    }

    if (data.nearbyBeaches && data.nearbyBeaches.length > 0) {
      const nearbyBeachesData = data.nearbyBeaches.map((beach) => ({
        propertyId,
        name: beach.name,
        distance: beach.distance,
      }));
      await db.insert(propertyNearbyBeachesTable).values(nearbyBeachesData);
    }

    if (data.nearbyAirports && data.nearbyAirports.length > 0) {
      const nearbyAirportsData = data.nearbyAirports.map((airport) => ({
        propertyId,
        name: airport.name,
        distance: airport.distance,
      }));
      await db.insert(propertyNearbyAirportsTable).values(nearbyAirportsData);
    }

    if (data.nearbyRestaurants && data.nearbyRestaurants.length > 0) {
      const nearbyRestaurantsData = data.nearbyRestaurants.map(
        (restaurant) => ({
          propertyId,
          name: restaurant.name,
          distance: restaurant.distance,
        }),
      );
      await db
        .insert(propertyNearbyRestaurantsTable)
        .values(nearbyRestaurantsData);
    }

    // 4. Criar informações de preços e serviços inclusos
    await db.insert(propertyPricingTable).values({
      propertyId,
      monthlyRent: "0",
      dailyRate: "0",
      condominiumFee: "0",
      iptuFee: "0",
      monthlyCleaningFee: "0",
      otherFees: "0",
      includesKitchenUtensils: data.includesKitchenUtensils,
      includesFurniture: data.includesFurniture,
      includesElectricity: data.includesElectricity,
      includesInternet: data.includesInternet,
      includesLinens: data.includesLinens,
      includesWater: data.includesWater,
    });

    // 5. Criar informações de localização
    await db.insert(propertyLocationTable).values({
      propertyId,
      fullAddress: data.fullAddress,
      neighborhood: data.neighborhood,
      municipality: data.municipality,
      city: data.city,
      state: data.state,
      zipCode: data.zipCode,
      latitude: data.latitude?.toString(),
      longitude: data.longitude?.toString(),
      popularDestination: data.popularDestination,
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

    // 6. Atualizar dados do proprietário se fornecidos
    if (
      data.ownerId &&
      (data.ownerName ||
        data.ownerPhone ||
        data.ownerEmail ||
        data.ownerInstagram ||
        data.ownerWebsite ||
        data.ownerProfileImage)
    ) {
      const ownerUpdateData: {
        fullName?: string;
        phone?: string;
        email?: string;
        instagram?: string | null;
        website?: string | null;
        profileImage?: string | null;
        updatedAt?: Date;
      } = {};

      if (data.ownerName) ownerUpdateData.fullName = data.ownerName;
      if (data.ownerPhone) ownerUpdateData.phone = data.ownerPhone;
      if (data.ownerEmail) ownerUpdateData.email = data.ownerEmail;
      if (data.ownerInstagram !== undefined)
        ownerUpdateData.instagram = data.ownerInstagram || null;
      if (data.ownerWebsite !== undefined)
        ownerUpdateData.website = data.ownerWebsite || null;
      if (data.ownerProfileImage !== undefined)
        ownerUpdateData.profileImage = data.ownerProfileImage || null;

      if (Object.keys(ownerUpdateData).length > 0) {
        ownerUpdateData.updatedAt = new Date();

        await db
          .update(ownersTable)
          .set(ownerUpdateData)
          .where(eq(ownersTable.id, data.ownerId));
      }
    }

    // 7. Salvar regras da casa
    await db.insert(propertyHouseRulesTable).values({
      propertyId,
      checkInRule: data.checkInRule || null,
      checkOutRule: data.checkOutRule || null,
      cancellationRule: data.cancellationRule || null,
      childrenRule: data.childrenRule || null,
      petsRule: data.petsRule || null,
      bedsRule: data.bedsRule || null,
      ageRestrictionRule: data.ageRestrictionRule || null,
      groupsRule: data.groupsRule || null,
      partyRule: data.partyRule || null,
      restaurantRule: data.restaurantRule || null,
    });

    // 8. Salvar métodos de pagamento aceitos
    await db.insert(propertyPaymentMethodsTable).values({
      propertyId,
      acceptsVisa: data.acceptsVisa || false,
      acceptsAmericanExpress: data.acceptsAmericanExpress || false,
      acceptsMasterCard: data.acceptsMasterCard || false,
      acceptsMaestro: data.acceptsMaestro || false,
      acceptsElo: data.acceptsElo || false,
      acceptsDinersClub: data.acceptsDinersClub || false,
      acceptsPix: data.acceptsPix || false,
      acceptsCash: data.acceptsCash || false,
    });

    // 9. Salvar apartamentos
    if (data.apartments && data.apartments.length > 0) {
      for (const apartment of data.apartments) {
        // Inserir apartamento
        const [insertedApartment] = await db
          .insert(propertyApartmentsTable)
          .values({
            propertyId,
            name: apartment.name,
            totalBathrooms: apartment.totalBathrooms,
            hasLivingRoom: apartment.hasLivingRoom,
            livingRoomHasSofaBed: apartment.livingRoomHasSofaBed,
            hasKitchen: apartment.hasKitchen,
            kitchenHasStove: apartment.kitchenHasStove,
            kitchenHasFridge: apartment.kitchenHasFridge,
            kitchenHasMinibar: apartment.kitchenHasMinibar,
            hasBalcony: apartment.hasBalcony,
            balconyHasSeaView: apartment.balconyHasSeaView,
            hasCrib: apartment.hasCrib,
          })
          .returning({ id: propertyApartmentsTable.id });

        // Inserir quartos do apartamento
        if (apartment.rooms && apartment.rooms.length > 0) {
          const roomsData = apartment.rooms.map((room) => ({
            apartmentId: insertedApartment.id,
            roomNumber: room.roomNumber,
            doubleBeds: room.doubleBeds,
            largeBeds: room.largeBeds,
            extraLargeBeds: room.extraLargeBeds,
            singleBeds: room.singleBeds,
            sofaBeds: room.sofaBeds,
          }));

          await db.insert(apartmentRoomsTable).values(roomsData);
        }
      }
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
        municipality: propertyLocationTable.municipality,
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

// Função para buscar propriedades de um proprietário
export async function getPropertiesByOwner(ownerId: string) {
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
        municipality: propertyLocationTable.municipality,
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
      .where(eq(propertiesTable.ownerId, ownerId))
      .orderBy(desc(propertiesTable.createdAt));

    return properties;
  } catch (error) {
    console.error("Erro ao buscar propriedades do proprietário:", error);
    return [];
  }
}

// Função para alterar status do imóvel (para admins)
export async function updatePropertyStatus(
  propertyId: string,
  status: "ativo" | "pendente",
) {
  try {
    await db
      .update(propertiesTable)
      .set({
        status: status,
        updatedAt: new Date(),
      })
      .where(eq(propertiesTable.id, propertyId));

    // Invalidar cache quando aprovar imóveis
    if (status === "ativo") {
      revalidateTag("properties");
      revalidateTag("featured-properties");
      revalidateTag("apartments");
      revalidateTag("houses");
      revalidatePath("/");

      console.log(`✅ Cache invalidado após aprovação do imóvel ${propertyId}`);
    }

    return { success: true };
  } catch (error) {
    console.error("Erro ao atualizar status do imóvel:", error);
    return { success: false, error: "Erro ao atualizar status do imóvel" };
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
        category: amenitiesTable.category,
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

    // Buscar proximidades - Lugares próximos
    const nearbyPlaces = await db
      .select()
      .from(propertyNearbyPlacesTable)
      .where(eq(propertyNearbyPlacesTable.propertyId, propertyId));

    // Buscar proximidades - Praias próximas
    const nearbyBeaches = await db
      .select()
      .from(propertyNearbyBeachesTable)
      .where(eq(propertyNearbyBeachesTable.propertyId, propertyId));

    // Buscar proximidades - Aeroportos próximos
    const nearbyAirports = await db
      .select()
      .from(propertyNearbyAirportsTable)
      .where(eq(propertyNearbyAirportsTable.propertyId, propertyId));

    // Buscar proximidades - Restaurantes próximos
    const nearbyRestaurants = await db
      .select()
      .from(propertyNearbyRestaurantsTable)
      .where(eq(propertyNearbyRestaurantsTable.propertyId, propertyId));

    // Buscar apartamentos
    const apartments = await db
      .select()
      .from(propertyApartmentsTable)
      .where(eq(propertyApartmentsTable.propertyId, propertyId));

    // Buscar quartos de cada apartamento
    const apartmentsWithRooms = await Promise.all(
      apartments.map(async (apartment) => {
        const rooms = await db
          .select()
          .from(apartmentRoomsTable)
          .where(eq(apartmentRoomsTable.apartmentId, apartment.id));

        return {
          ...apartment,
          rooms: rooms.map((room) => ({
            name: `Quarto ${room.roomNumber}`,
            doubleBeds: room.doubleBeds,
            largeBeds: room.largeBeds,
            extraLargeBeds: room.extraLargeBeds,
            singleBeds: room.singleBeds,
            sofaBeds: room.sofaBeds,
          })),
        };
      }),
    );

    // Buscar regras da casa
    const houseRules = await db
      .select()
      .from(propertyHouseRulesTable)
      .where(eq(propertyHouseRulesTable.propertyId, propertyId))
      .limit(1);

    // Buscar métodos de pagamento aceitos
    const paymentMethods = await db
      .select()
      .from(propertyPaymentMethodsTable)
      .where(eq(propertyPaymentMethodsTable.propertyId, propertyId))
      .limit(1);

    // Buscar dados do proprietário
    let owner = null;
    if (propertyData.ownerId) {
      const ownerData = await db
        .select({
          id: ownersTable.id,
          fullName: ownersTable.fullName,
          email: ownersTable.email,
          phone: ownersTable.phone,
          instagram: ownersTable.instagram,
          website: ownersTable.website,
          profileImage: ownersTable.profileImage,
        })
        .from(ownersTable)
        .where(eq(ownersTable.id, propertyData.ownerId))
        .limit(1);

      if (ownerData.length > 0) {
        owner = {
          id: ownerData[0].id,
          fullName: ownerData[0].fullName,
          email: ownerData[0].email,
          phone: ownerData[0].phone || undefined,
          instagram: ownerData[0].instagram || undefined,
          website: ownerData[0].website || undefined,
          profileImage: ownerData[0].profileImage || undefined,
        };
      }
    }

    return {
      ...propertyData,
      location: location[0] || null,
      pricing: pricing[0] || null,
      images: images.map((img) => ({ imageUrl: img.imageUrl })) || [],
      amenities:
        amenities.map((a) => ({
          amenityId: a.amenityId,
          amenity: {
            id: a.amenityId,
            name: a.name,
            icon: a.icon,
            category: a.category,
          },
        })) || [],
      classes: classes || [],
      nearbyPlaces:
        nearbyPlaces.map((place) => ({
          name: place.name,
          distance: place.distance,
        })) || [],
      nearbyBeaches:
        nearbyBeaches.map((beach) => ({
          name: beach.name,
          distance: beach.distance,
        })) || [],
      nearbyAirports:
        nearbyAirports.map((airport) => ({
          name: airport.name,
          distance: airport.distance,
        })) || [],
      nearbyRestaurants:
        nearbyRestaurants.map((restaurant) => ({
          name: restaurant.name,
          distance: restaurant.distance,
        })) || [],
      apartments: apartmentsWithRooms || [],
      houseRules: houseRules[0] || null,
      paymentMethods: paymentMethods[0] || null,
      owner: owner,
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
        aboutBuilding: data.aboutBuilding,
        maxGuests: data.maxGuests,
        bedrooms: data.bedrooms,
        bathrooms: data.bathrooms,
        parkingSpaces: data.parkingSpaces,
        areaM2: data.areaM2?.toString(),
        allowsPets: data.allowsPets,
        minimumStay: data.minimumStay,
        maximumStay: data.maximumStay,
        checkInTime: data.checkInTime,
        checkOutTime: data.checkOutTime,
        propertyStyle: data.propertyStyle,
        status: data.status || "pendente",
        updatedAt: new Date(),
      })
      .where(eq(propertiesTable.id, propertyId));

    // Atualizar dados do proprietário se fornecidos
    if (
      data.ownerId &&
      (data.ownerName ||
        data.ownerPhone ||
        data.ownerEmail ||
        data.ownerInstagram ||
        data.ownerWebsite ||
        data.ownerProfileImage)
    ) {
      const ownerUpdateData: {
        fullName?: string;
        phone?: string;
        email?: string;
        instagram?: string | null;
        website?: string | null;
        profileImage?: string | null;
        updatedAt?: Date;
      } = {};

      if (data.ownerName) ownerUpdateData.fullName = data.ownerName;
      if (data.ownerPhone) ownerUpdateData.phone = data.ownerPhone;
      if (data.ownerEmail) ownerUpdateData.email = data.ownerEmail;
      if (data.ownerInstagram !== undefined)
        ownerUpdateData.instagram = data.ownerInstagram || null;
      if (data.ownerWebsite !== undefined)
        ownerUpdateData.website = data.ownerWebsite || null;
      if (data.ownerProfileImage !== undefined)
        ownerUpdateData.profileImage = data.ownerProfileImage || null;

      if (Object.keys(ownerUpdateData).length > 0) {
        ownerUpdateData.updatedAt = new Date();

        await db
          .update(ownersTable)
          .set(ownerUpdateData)
          .where(eq(ownersTable.id, data.ownerId));
      }
    }

    // Atualizar localização
    await db
      .update(propertyLocationTable)
      .set({
        fullAddress: data.fullAddress,
        neighborhood: data.neighborhood,
        municipality: data.municipality,
        city: data.city,
        state: data.state,
        zipCode: data.zipCode,
        latitude: data.latitude?.toString(),
        longitude: data.longitude?.toString(),
        popularDestination: data.popularDestination,
        updatedAt: new Date(),
      })
      .where(eq(propertyLocationTable.propertyId, propertyId));

    // Atualizar serviços inclusos
    await db
      .update(propertyPricingTable)
      .set({
        includesKitchenUtensils: data.includesKitchenUtensils,
        includesFurniture: data.includesFurniture,
        includesElectricity: data.includesElectricity,
        includesInternet: data.includesInternet,
        includesLinens: data.includesLinens,
        includesWater: data.includesWater,
        updatedAt: new Date(),
      })
      .where(eq(propertyPricingTable.propertyId, propertyId));

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

    // Atualizar regras da casa
    await db
      .update(propertyHouseRulesTable)
      .set({
        checkInRule: data.checkInRule || null,
        checkOutRule: data.checkOutRule || null,
        cancellationRule: data.cancellationRule || null,
        childrenRule: data.childrenRule || null,
        petsRule: data.petsRule || null,
        bedsRule: data.bedsRule || null,
        ageRestrictionRule: data.ageRestrictionRule || null,
        groupsRule: data.groupsRule || null,
        partyRule: data.partyRule || null,
        restaurantRule: data.restaurantRule || null,
        updatedAt: new Date(),
      })
      .where(eq(propertyHouseRulesTable.propertyId, propertyId));

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

    // Atualizar apartamentos
    if (data.apartments && data.apartments.length > 0) {
      // Deletar apartamentos existentes e seus quartos (cascade delete)
      await db
        .delete(propertyApartmentsTable)
        .where(eq(propertyApartmentsTable.propertyId, propertyId));

      // Inserir novos apartamentos
      for (const apartment of data.apartments) {
        const [insertedApartment] = await db
          .insert(propertyApartmentsTable)
          .values({
            propertyId,
            name: apartment.name,
            totalBathrooms: apartment.totalBathrooms,
            hasLivingRoom: apartment.hasLivingRoom,
            livingRoomHasSofaBed: apartment.livingRoomHasSofaBed,
            hasKitchen: apartment.hasKitchen,
            kitchenHasStove: apartment.kitchenHasStove,
            kitchenHasFridge: apartment.kitchenHasFridge,
            kitchenHasMinibar: apartment.kitchenHasMinibar,
            hasBalcony: apartment.hasBalcony,
            balconyHasSeaView: apartment.balconyHasSeaView,
            hasCrib: apartment.hasCrib,
          })
          .returning({ id: propertyApartmentsTable.id });

        // Inserir quartos do apartamento
        if (apartment.rooms && apartment.rooms.length > 0) {
          const roomsData = apartment.rooms.map((room) => ({
            apartmentId: insertedApartment.id,
            roomNumber: room.roomNumber,
            doubleBeds: room.doubleBeds,
            largeBeds: room.largeBeds,
            extraLargeBeds: room.extraLargeBeds,
            singleBeds: room.singleBeds,
            sofaBeds: room.sofaBeds,
          }));

          await db.insert(apartmentRoomsTable).values(roomsData);
        }
      }
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

    // Filtrar classes de banner
    const filteredClasses = classes.filter(
      (cls) => !cls.name.includes("Banner"),
    );

    return filteredClasses;
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
        municipality: propertyLocationTable.municipality,
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
