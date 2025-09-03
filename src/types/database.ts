import { InferInsertModel, InferSelectModel } from "drizzle-orm";

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
} from "../app/db/schema";

// Tipos para SELECT (dados que vêm do banco)
export type User = InferSelectModel<typeof usersTable>;
export type Property = InferSelectModel<typeof propertiesTable>;
export type PropertyPricing = InferSelectModel<typeof propertyPricingTable>;
export type PropertyLocation = InferSelectModel<typeof propertyLocationTable>;
export type Amenity = InferSelectModel<typeof amenitiesTable>;
export type PropertyAmenity = InferSelectModel<typeof propertyAmenitiesTable>;
export type PropertyImage = InferSelectModel<typeof propertyImagesTable>;
export type PropertyAvailability = InferSelectModel<
  typeof propertyAvailabilityTable
>;
export type Reservation = InferSelectModel<typeof reservationsTable>;

// Tipos para INSERT (dados para inserir no banco)
export type NewUser = InferInsertModel<typeof usersTable>;
export type NewProperty = InferInsertModel<typeof propertiesTable>;
export type NewPropertyPricing = InferInsertModel<typeof propertyPricingTable>;
export type NewPropertyLocation = InferInsertModel<
  typeof propertyLocationTable
>;
export type NewAmenity = InferInsertModel<typeof amenitiesTable>;
export type NewPropertyAmenity = InferInsertModel<
  typeof propertyAmenitiesTable
>;
export type NewPropertyImage = InferInsertModel<typeof propertyImagesTable>;
export type NewPropertyAvailability = InferInsertModel<
  typeof propertyAvailabilityTable
>;
export type NewReservation = InferInsertModel<typeof reservationsTable>;

// Tipos compostos para queries complexas
export type PropertyWithDetails = Property & {
  pricing: PropertyPricing;
  location: PropertyLocation;
  images: PropertyImage[];
  amenities: (PropertyAmenity & { amenity: Amenity })[];
  availability: PropertyAvailability[];
};

export type PropertySummary = Pick<
  Property,
  | "id"
  | "title"
  | "shortDescription"
  | "maxGuests"
  | "bedrooms"
  | "bathrooms"
  | "status"
> & {
  pricing: Pick<PropertyPricing, "dailyRate" | "monthlyRent">;
  location: Pick<PropertyLocation, "neighborhood" | "city" | "state">;
  mainImage: Pick<PropertyImage, "imageUrl" | "altText"> | null;
};

export type ReservationWithDetails = Reservation & {
  property: Pick<Property, "id" | "title">;
  user: Pick<User, "id" | "name" | "email"> | null;
};

// Enum-like types para garantir consistência
export type PropertyStatus = "active" | "inactive" | "maintenance";
export type ReservationStatus =
  | "pending"
  | "confirmed"
  | "cancelled"
  | "completed";
export type PaymentStatus = "pending" | "paid" | "refunded";
export type AmenityCategory = "common_area" | "apartment" | "building";
