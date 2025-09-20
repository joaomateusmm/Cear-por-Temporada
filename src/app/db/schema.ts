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

// Tabela de proprietários
export const ownersTable = pgTable("owners", {
  id: varchar("id", { length: 21 }).primaryKey(), // nanoid generates 21 character IDs
  fullName: varchar("full_name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 20 }),
  instagram: varchar("instagram", { length: 255 }),
  website: varchar("website", { length: 255 }),
  profileImage: varchar("profile_image", { length: 500 }),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Tabela principal de imóveis
export const propertiesTable = pgTable("properties", {
  id: varchar("id", { length: 21 }).primaryKey(), // nanoid generates 21 character IDs
  ownerId: varchar("owner_id", { length: 21 }).references(
    () => ownersTable.id,
    {
      onDelete: "set null",
    },
  ),
  title: varchar("title", { length: 255 }).notNull(),
  shortDescription: text("short_description").notNull(),
  fullDescription: text("full_description"),
  aboutBuilding: text("about_building"),
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
  maximumStay: integer("maximum_stay"), // em dias (opcional)
  checkInTime: varchar("check_in_time", { length: 10 }), // ex: "15:00"
  checkOutTime: varchar("check_out_time", { length: 10 }), // ex: "11:00"
  petPolicy: text("pet_policy"),
  cancellationPolicy: text("cancellation_policy"),
  externalLink: varchar("external_link", { length: 500 }),
  status: varchar("status", { length: 20 }).default("pending").notNull(), // ativo, pendente
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
  municipality: varchar("municipality", { length: 100 }).notNull(),
  city: varchar("city", { length: 100 }).notNull(),
  state: varchar("state", { length: 50 }).notNull(),
  zipCode: varchar("zip_code", { length: 10 }).notNull(),
  latitude: decimal("latitude", { precision: 10, scale: 8 }),
  longitude: decimal("longitude", { precision: 11, scale: 8 }),
  popularDestination: varchar("popular_destination", { length: 100 })
    .notNull()
    .default("Nenhum dos anteriores"),
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

// Tabela de classes de imóveis (master)
export const propertyClassesTable = pgTable("property_classes", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull().unique(),
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

// Tabela de relacionamento N:N entre imóveis e classes
export const propertyPropertyClassesTable = pgTable(
  "property_property_classes",
  {
    propertyId: varchar("property_id", { length: 21 })
      .notNull()
      .references(() => propertiesTable.id, { onDelete: "cascade" }),
    classId: integer("class_id")
      .notNull()
      .references(() => propertyClassesTable.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.propertyId, table.classId] }),
  }),
);

// Tabela de imagens
export const propertyImagesTable = pgTable("property_images", {
  id: serial("id").primaryKey(),
  propertyId: varchar("property_id", { length: 21 })
    .notNull()
    .references(() => propertiesTable.id, { onDelete: "cascade" }),
  imageUrl: text("image_url").notNull(),
  altText: varchar("alt_text", { length: 255 }),
  displayOrder: integer("display_order").default(0).notNull(),
  isMain: boolean("is_main").default(false).notNull(), // imagem principal
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Tabela de proximidades - O que há por perto
export const propertyNearbyPlacesTable = pgTable("property_nearby_places", {
  id: serial("id").primaryKey(),
  propertyId: varchar("property_id", { length: 21 })
    .notNull()
    .references(() => propertiesTable.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 255 }).notNull(),
  distance: varchar("distance", { length: 50 }).notNull(), // ex: "2,5 km", "1.200 m"
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Tabela de proximidades - Praias na vizinhança
export const propertyNearbyBeachesTable = pgTable("property_nearby_beaches", {
  id: serial("id").primaryKey(),
  propertyId: varchar("property_id", { length: 21 })
    .notNull()
    .references(() => propertiesTable.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 255 }).notNull(),
  distance: varchar("distance", { length: 50 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Tabela de proximidades - Aeroportos mais próximos
export const propertyNearbyAirportsTable = pgTable("property_nearby_airports", {
  id: serial("id").primaryKey(),
  propertyId: varchar("property_id", { length: 21 })
    .notNull()
    .references(() => propertiesTable.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 255 }).notNull(),
  distance: varchar("distance", { length: 50 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Tabela de proximidades - Restaurantes e cafés
export const propertyNearbyRestaurantsTable = pgTable(
  "property_nearby_restaurants",
  {
    id: serial("id").primaryKey(),
    propertyId: varchar("property_id", { length: 21 })
      .notNull()
      .references(() => propertiesTable.id, { onDelete: "cascade" }),
    name: varchar("name", { length: 255 }).notNull(),
    distance: varchar("distance", { length: 50 }).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
);

// Tabela de apartamentos
export const propertyApartmentsTable = pgTable("property_apartments", {
  id: serial("id").primaryKey(),
  propertyId: varchar("property_id", { length: 21 })
    .notNull()
    .references(() => propertiesTable.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 255 }).notNull(),
  totalBathrooms: integer("total_bathrooms").default(0).notNull(),
  hasLivingRoom: boolean("has_living_room").default(false).notNull(),
  livingRoomHasSofaBed: boolean("living_room_has_sofa_bed")
    .default(false)
    .notNull(),
  hasKitchen: boolean("has_kitchen").default(false).notNull(),
  kitchenHasStove: boolean("kitchen_has_stove").default(false).notNull(),
  kitchenHasFridge: boolean("kitchen_has_fridge").default(false).notNull(),
  kitchenHasMinibar: boolean("kitchen_has_minibar").default(false).notNull(),
  hasBalcony: boolean("has_balcony").default(false).notNull(),
  balconyHasSeaView: boolean("balcony_has_sea_view").default(false).notNull(),
  hasCrib: boolean("has_crib").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Tabela de quartos dos apartamentos
export const apartmentRoomsTable = pgTable("apartment_rooms", {
  id: serial("id").primaryKey(),
  apartmentId: integer("apartment_id")
    .notNull()
    .references(() => propertyApartmentsTable.id, { onDelete: "cascade" }),
  roomNumber: integer("room_number").notNull(),
  doubleBeds: integer("double_beds").default(0).notNull(),
  largeBeds: integer("large_beds").default(0).notNull(),
  extraLargeBeds: integer("extra_large_beds").default(0).notNull(),
  singleBeds: integer("single_beds").default(0).notNull(),
  sofaBeds: integer("sofa_beds").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Tabela de regras da casa
export const propertyHouseRulesTable = pgTable("property_house_rules", {
  id: serial("id").primaryKey(),
  propertyId: varchar("property_id", { length: 21 })
    .notNull()
    .references(() => propertiesTable.id, { onDelete: "cascade" }),
  checkInRule: text("check_in_rule"), // Regra de entrada
  checkOutRule: text("check_out_rule"), // Regra de saída
  cancellationRule: text("cancellation_rule"), // Regra de cancelamento/pré-pagamento
  childrenRule: text("children_rule"), // Regra sobre crianças
  petsRule: text("pets_rule"), // Regra sobre pets
  bedsRule: text("beds_rule"), // Regra sobre camas
  ageRestrictionRule: text("age_restriction_rule"), // Restrições de idade
  groupsRule: text("groups_rule"), // Regra sobre grupos
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Tabela de métodos de pagamento aceitos
export const propertyPaymentMethodsTable = pgTable("property_payment_methods", {
  id: serial("id").primaryKey(),
  propertyId: varchar("property_id", { length: 21 })
    .notNull()
    .references(() => propertiesTable.id, { onDelete: "cascade" }),
  acceptsVisa: boolean("accepts_visa").default(false).notNull(),
  acceptsAmericanExpress: boolean("accepts_american_express")
    .default(false)
    .notNull(),
  acceptsMasterCard: boolean("accepts_master_card").default(false).notNull(),
  acceptsMaestro: boolean("accepts_maestro").default(false).notNull(),
  acceptsElo: boolean("accepts_elo").default(false).notNull(),
  acceptsDinersClub: boolean("accepts_diners_club").default(false).notNull(),
  acceptsPix: boolean("accepts_pix").default(false).notNull(),
  acceptsCash: boolean("accepts_cash").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
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
export const ownersRelations = relations(ownersTable, ({ many }) => ({
  properties: many(propertiesTable),
}));

export const propertiesRelations = relations(
  propertiesTable,
  ({ one, many }) => ({
    owner: one(ownersTable, {
      fields: [propertiesTable.ownerId],
      references: [ownersTable.id],
    }),
    pricing: one(propertyPricingTable),
    location: one(propertyLocationTable),
    images: many(propertyImagesTable),
    amenities: many(propertyAmenitiesTable),
    classes: many(propertyPropertyClassesTable),
    availability: many(propertyAvailabilityTable),
    reservations: many(reservationsTable),
    nearbyPlaces: many(propertyNearbyPlacesTable),
    nearbyBeaches: many(propertyNearbyBeachesTable),
    nearbyAirports: many(propertyNearbyAirportsTable),
    nearbyRestaurants: many(propertyNearbyRestaurantsTable),
    houseRules: one(propertyHouseRulesTable),
    paymentMethods: one(propertyPaymentMethodsTable),
    apartments: many(propertyApartmentsTable),
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

export const propertyClassesRelations = relations(
  propertyClassesTable,
  ({ many }) => ({
    properties: many(propertyPropertyClassesTable),
  }),
);

export const propertyPropertyClassesRelations = relations(
  propertyPropertyClassesTable,
  ({ one }) => ({
    property: one(propertiesTable, {
      fields: [propertyPropertyClassesTable.propertyId],
      references: [propertiesTable.id],
    }),
    class: one(propertyClassesTable, {
      fields: [propertyPropertyClassesTable.classId],
      references: [propertyClassesTable.id],
    }),
  }),
);

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

export const propertyNearbyPlacesRelations = relations(
  propertyNearbyPlacesTable,
  ({ one }) => ({
    property: one(propertiesTable, {
      fields: [propertyNearbyPlacesTable.propertyId],
      references: [propertiesTable.id],
    }),
  }),
);

export const propertyNearbyBeachesRelations = relations(
  propertyNearbyBeachesTable,
  ({ one }) => ({
    property: one(propertiesTable, {
      fields: [propertyNearbyBeachesTable.propertyId],
      references: [propertiesTable.id],
    }),
  }),
);

export const propertyNearbyAirportsRelations = relations(
  propertyNearbyAirportsTable,
  ({ one }) => ({
    property: one(propertiesTable, {
      fields: [propertyNearbyAirportsTable.propertyId],
      references: [propertiesTable.id],
    }),
  }),
);

export const propertyNearbyRestaurantsRelations = relations(
  propertyNearbyRestaurantsTable,
  ({ one }) => ({
    property: one(propertiesTable, {
      fields: [propertyNearbyRestaurantsTable.propertyId],
      references: [propertiesTable.id],
    }),
  }),
);

export const propertyHouseRulesRelations = relations(
  propertyHouseRulesTable,
  ({ one }) => ({
    property: one(propertiesTable, {
      fields: [propertyHouseRulesTable.propertyId],
      references: [propertiesTable.id],
    }),
  }),
);

export const propertyPaymentMethodsRelations = relations(
  propertyPaymentMethodsTable,
  ({ one }) => ({
    property: one(propertiesTable, {
      fields: [propertyPaymentMethodsTable.propertyId],
      references: [propertiesTable.id],
    }),
  }),
);

export const propertyApartmentsRelations = relations(
  propertyApartmentsTable,
  ({ one, many }) => ({
    property: one(propertiesTable, {
      fields: [propertyApartmentsTable.propertyId],
      references: [propertiesTable.id],
    }),
    rooms: many(apartmentRoomsTable),
  }),
);

export const apartmentRoomsRelations = relations(
  apartmentRoomsTable,
  ({ one }) => ({
    apartment: one(propertyApartmentsTable, {
      fields: [apartmentRoomsTable.apartmentId],
      references: [propertyApartmentsTable.id],
    }),
  }),
);
