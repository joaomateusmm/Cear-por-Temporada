import { relations } from "drizzle-orm";
import {
  boolean,
  date,
  decimal,
  integer,
  pgTable,
  primaryKey,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

// Tabela de usuários
export const usersTable = pgTable("users", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  phone: varchar("phone", { length: 20 }),
  password: varchar("password", { length: 255 }).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Tabela principal de imóveis
export const propertiesTable = pgTable("properties", {
  id: varchar("id", { length: 21 }).primaryKey(), // nanoid generates 21 character IDs
  title: varchar("title", { length: 255 }).notNull(),
  shortDescription: text("short_description").notNull(),
  fullDescription: text("full_description"),
  maxGuests: integer("max_guests").notNull(),
  bedrooms: integer("bedrooms").notNull(),
  bathrooms: integer("bathrooms").notNull(),
  parkingSpaces: integer("parking_spaces").default(0).notNull(),
  areaM2: decimal("area_m2", { precision: 8, scale: 2 }),
  allowsPets: boolean("allows_pets").default(false).notNull(),
  propertyStyle: varchar("property_style", { length: 100 }),
  propertyClass: varchar("property_class", { length: 50 })
    .default("Normal")
    .notNull(),
  bedTypes: text("bed_types"), // JSON string ou texto livre
  minimumStay: integer("minimum_stay").notNull(), // em noites
  checkInTime: varchar("check_in_time", { length: 10 }), // ex: "15:00"
  checkOutTime: varchar("check_out_time", { length: 10 }), // ex: "11:00"
  petPolicy: text("pet_policy"),
  cancellationPolicy: text("cancellation_policy"),
  externalLink: varchar("external_link", { length: 500 }),
  status: varchar("status", { length: 20 }).default("active").notNull(), // active, inactive, maintenance
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Tabela de valores e taxas
export const propertyPricingTable = pgTable("property_pricing", {
  id: serial("id").primaryKey(),
  propertyId: varchar("property_id", { length: 21 })
    .notNull()
    .references(() => propertiesTable.id, { onDelete: "cascade" }),
  monthlyRent: decimal("monthly_rent", { precision: 10, scale: 2 }).notNull(),
  dailyRate: decimal("daily_rate", { precision: 10, scale: 2 }).notNull(),
  condominiumFee: decimal("condominium_fee", {
    precision: 10,
    scale: 2,
  }).default("0"),
  iptuFee: decimal("iptu_fee", { precision: 10, scale: 2 }).default("0"),
  monthlyCleaningFee: decimal("monthly_cleaning_fee", {
    precision: 10,
    scale: 2,
  }).default("0"),
  otherFees: decimal("other_fees", { precision: 10, scale: 2 }).default("0"),
  // Infraestrutura inclusa (boolean flags)
  includesKitchenUtensils: boolean("includes_kitchen_utensils").default(false),
  includesFurniture: boolean("includes_furniture").default(false),
  includesElectricity: boolean("includes_electricity").default(false),
  includesInternet: boolean("includes_internet").default(false),
  includesLinens: boolean("includes_linens").default(false),
  includesWater: boolean("includes_water").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Tabela de localização
export const propertyLocationTable = pgTable("property_location", {
  id: serial("id").primaryKey(),
  propertyId: varchar("property_id", { length: 21 })
    .notNull()
    .references(() => propertiesTable.id, { onDelete: "cascade" }),
  fullAddress: text("full_address").notNull(),
  neighborhood: varchar("neighborhood", { length: 100 }).notNull(),
  city: varchar("city", { length: 100 }).notNull(),
  state: varchar("state", { length: 50 }).notNull(),
  zipCode: varchar("zip_code", { length: 10 }).notNull(),
  latitude: decimal("latitude", { precision: 10, scale: 8 }),
  longitude: decimal("longitude", { precision: 11, scale: 8 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Tabela de comodidades (master)
export const amenitiesTable = pgTable("amenities", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull().unique(),
  category: varchar("category", { length: 50 }).notNull(), // ex: "common_area", "apartment", "building"
  icon: varchar("icon", { length: 50 }), // nome do ícone para frontend
  description: text("description"),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Tabela de relacionamento N:N entre imóveis e comodidades
export const propertyAmenitiesTable = pgTable(
  "property_amenities",
  {
    propertyId: varchar("property_id", { length: 21 })
      .notNull()
      .references(() => propertiesTable.id, { onDelete: "cascade" }),
    amenityId: integer("amenity_id")
      .notNull()
      .references(() => amenitiesTable.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.propertyId, table.amenityId] }),
  }),
);

// Tabela de imagens
export const propertyImagesTable = pgTable("property_images", {
  id: serial("id").primaryKey(),
  propertyId: varchar("property_id", { length: 21 })
    .notNull()
    .references(() => propertiesTable.id, { onDelete: "cascade" }),
  imageUrl: varchar("image_url", { length: 500 }).notNull(),
  altText: varchar("alt_text", { length: 255 }),
  displayOrder: integer("display_order").default(0).notNull(),
  isMain: boolean("is_main").default(false).notNull(), // imagem principal
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Tabela de disponibilidade/calendário
export const propertyAvailabilityTable = pgTable(
  "property_availability",
  {
    propertyId: varchar("property_id", { length: 21 })
      .notNull()
      .references(() => propertiesTable.id, { onDelete: "cascade" }),
    date: date("date").notNull(),
    isAvailable: boolean("is_available").default(true).notNull(),
    specialPrice: decimal("special_price", { precision: 10, scale: 2 }), // preço especial para data específica
    notes: text("notes"), // observações para a data
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.propertyId, table.date] }),
  }),
);

// Tabela de reservas
export const reservationsTable = pgTable("reservations", {
  id: serial("id").primaryKey(),
  propertyId: varchar("property_id", { length: 21 })
    .notNull()
    .references(() => propertiesTable.id, { onDelete: "cascade" }),
  userId: integer("user_id").references(() => usersTable.id, {
    onDelete: "set null",
  }),
  guestName: varchar("guest_name", { length: 255 }).notNull(),
  guestEmail: varchar("guest_email", { length: 255 }).notNull(),
  guestPhone: varchar("guest_phone", { length: 20 }),
  checkInDate: date("check_in_date").notNull(),
  checkOutDate: date("check_out_date").notNull(),
  numberOfGuests: integer("number_of_guests").notNull(),
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  status: varchar("status", { length: 20 }).default("pending").notNull(), // pending, confirmed, cancelled, completed
  paymentStatus: varchar("payment_status", { length: 20 })
    .default("pending")
    .notNull(), // pending, paid, refunded
  specialRequests: text("special_requests"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Definição das relações
export const propertiesRelations = relations(
  propertiesTable,
  ({ one, many }) => ({
    pricing: one(propertyPricingTable),
    location: one(propertyLocationTable),
    images: many(propertyImagesTable),
    amenities: many(propertyAmenitiesTable),
    availability: many(propertyAvailabilityTable),
    reservations: many(reservationsTable),
  }),
);

export const propertyPricingRelations = relations(
  propertyPricingTable,
  ({ one }) => ({
    property: one(propertiesTable, {
      fields: [propertyPricingTable.propertyId],
      references: [propertiesTable.id],
    }),
  }),
);

export const propertyLocationRelations = relations(
  propertyLocationTable,
  ({ one }) => ({
    property: one(propertiesTable, {
      fields: [propertyLocationTable.propertyId],
      references: [propertiesTable.id],
    }),
  }),
);

export const propertyImagesRelations = relations(
  propertyImagesTable,
  ({ one }) => ({
    property: one(propertiesTable, {
      fields: [propertyImagesTable.propertyId],
      references: [propertiesTable.id],
    }),
  }),
);

export const propertyAmenitiesRelations = relations(
  propertyAmenitiesTable,
  ({ one }) => ({
    property: one(propertiesTable, {
      fields: [propertyAmenitiesTable.propertyId],
      references: [propertiesTable.id],
    }),
    amenity: one(amenitiesTable, {
      fields: [propertyAmenitiesTable.amenityId],
      references: [amenitiesTable.id],
    }),
  }),
);

export const amenitiesRelations = relations(amenitiesTable, ({ many }) => ({
  properties: many(propertyAmenitiesTable),
}));

export const propertyAvailabilityRelations = relations(
  propertyAvailabilityTable,
  ({ one }) => ({
    property: one(propertiesTable, {
      fields: [propertyAvailabilityTable.propertyId],
      references: [propertiesTable.id],
    }),
  }),
);

export const reservationsRelations = relations(
  reservationsTable,
  ({ one }) => ({
    property: one(propertiesTable, {
      fields: [reservationsTable.propertyId],
      references: [propertiesTable.id],
    }),
    user: one(usersTable, {
      fields: [reservationsTable.userId],
      references: [usersTable.id],
    }),
  }),
);

export const usersRelations = relations(usersTable, ({ many }) => ({
  reservations: many(reservationsTable),
}));
