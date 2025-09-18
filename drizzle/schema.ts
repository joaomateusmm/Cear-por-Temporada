import { pgTable, unique, serial, varchar, boolean, timestamp, text, foreignKey, integer, numeric, date, primaryKey } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const users = pgTable("users", {
	id: serial().primaryKey().notNull(),
	name: varchar({ length: 255 }).notNull(),
	email: varchar({ length: 255 }).notNull(),
	phone: varchar({ length: 20 }),
	password: varchar({ length: 255 }).notNull(),
	isActive: boolean("is_active").default(true).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	unique("users_email_unique").on(table.email),
]);

export const amenities = pgTable("amenities", {
	id: serial().primaryKey().notNull(),
	name: varchar({ length: 100 }).notNull(),
	category: varchar({ length: 50 }).notNull(),
	icon: varchar({ length: 50 }),
	description: text(),
	isActive: boolean("is_active").default(true).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	unique("amenities_name_unique").on(table.name),
]);

export const propertyImages = pgTable("property_images", {
	id: serial().primaryKey().notNull(),
	propertyId: varchar("property_id", { length: 21 }).notNull(),
	imageUrl: text("image_url").notNull(),
	altText: varchar("alt_text", { length: 255 }),
	displayOrder: integer("display_order").default(0).notNull(),
	isMain: boolean("is_main").default(false).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.propertyId],
			foreignColumns: [properties.id],
			name: "property_images_property_id_properties_id_fk"
		}).onDelete("cascade"),
]);

export const propertyPricing = pgTable("property_pricing", {
	id: serial().primaryKey().notNull(),
	propertyId: varchar("property_id", { length: 21 }).notNull(),
	monthlyRent: numeric("monthly_rent", { precision: 10, scale:  2 }).notNull(),
	dailyRate: numeric("daily_rate", { precision: 10, scale:  2 }).notNull(),
	condominiumFee: numeric("condominium_fee", { precision: 10, scale:  2 }).default('0'),
	iptuFee: numeric("iptu_fee", { precision: 10, scale:  2 }).default('0'),
	monthlyCleaningFee: numeric("monthly_cleaning_fee", { precision: 10, scale:  2 }).default('0'),
	otherFees: numeric("other_fees", { precision: 10, scale:  2 }).default('0'),
	includesKitchenUtensils: boolean("includes_kitchen_utensils").default(false),
	includesFurniture: boolean("includes_furniture").default(false),
	includesElectricity: boolean("includes_electricity").default(false),
	includesInternet: boolean("includes_internet").default(false),
	includesLinens: boolean("includes_linens").default(false),
	includesWater: boolean("includes_water").default(false),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.propertyId],
			foreignColumns: [properties.id],
			name: "property_pricing_property_id_properties_id_fk"
		}).onDelete("cascade"),
]);

export const properties = pgTable("properties", {
	id: varchar({ length: 21 }).primaryKey().notNull(),
	title: varchar({ length: 255 }).notNull(),
	shortDescription: text("short_description").notNull(),
	fullDescription: text("full_description"),
	maxGuests: integer("max_guests").notNull(),
	bedrooms: integer().notNull(),
	bathrooms: integer().notNull(),
	parkingSpaces: integer("parking_spaces").default(0).notNull(),
	areaM2: numeric("area_m2", { precision: 8, scale:  2 }),
	allowsPets: boolean("allows_pets").default(false).notNull(),
	propertyStyle: varchar("property_style", { length: 100 }),
	bedTypes: text("bed_types"),
	minimumStay: integer("minimum_stay").notNull(),
	checkInTime: varchar("check_in_time", { length: 10 }),
	checkOutTime: varchar("check_out_time", { length: 10 }),
	petPolicy: text("pet_policy"),
	cancellationPolicy: text("cancellation_policy"),
	externalLink: varchar("external_link", { length: 500 }),
	status: varchar({ length: 20 }).default('pending').notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
	propertyClass: varchar("property_class", { length: 50 }).default('Normal').notNull(),
	maximumStay: integer("maximum_stay"),
	aboutBuilding: text("about_building"),
	ownerId: varchar("owner_id", { length: 21 }),
}, (table) => [
	foreignKey({
			columns: [table.ownerId],
			foreignColumns: [owners.id],
			name: "properties_owner_id_owners_id_fk"
		}).onDelete("set null"),
]);

export const reservations = pgTable("reservations", {
	id: serial().primaryKey().notNull(),
	propertyId: varchar("property_id", { length: 21 }).notNull(),
	userId: integer("user_id"),
	guestName: varchar("guest_name", { length: 255 }).notNull(),
	guestEmail: varchar("guest_email", { length: 255 }).notNull(),
	guestPhone: varchar("guest_phone", { length: 20 }),
	checkInDate: date("check_in_date").notNull(),
	checkOutDate: date("check_out_date").notNull(),
	numberOfGuests: integer("number_of_guests").notNull(),
	totalAmount: numeric("total_amount", { precision: 10, scale:  2 }).notNull(),
	status: varchar({ length: 20 }).default('pending').notNull(),
	paymentStatus: varchar("payment_status", { length: 20 }).default('pending').notNull(),
	specialRequests: text("special_requests"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.propertyId],
			foreignColumns: [properties.id],
			name: "reservations_property_id_properties_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "reservations_user_id_users_id_fk"
		}).onDelete("set null"),
]);

export const propertyLocation = pgTable("property_location", {
	id: serial().primaryKey().notNull(),
	propertyId: varchar("property_id", { length: 21 }).notNull(),
	fullAddress: text("full_address").notNull(),
	neighborhood: varchar({ length: 100 }).notNull(),
	city: varchar({ length: 100 }).notNull(),
	state: varchar({ length: 50 }).notNull(),
	zipCode: varchar("zip_code", { length: 10 }).notNull(),
	latitude: numeric({ precision: 10, scale:  8 }),
	longitude: numeric({ precision: 11, scale:  8 }),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
	municipality: varchar({ length: 100 }).notNull(),
	popularDestination: varchar("popular_destination", { length: 100 }).default('Nenhum dos anteriores').notNull(),
}, (table) => [
	foreignKey({
			columns: [table.propertyId],
			foreignColumns: [properties.id],
			name: "property_location_property_id_properties_id_fk"
		}).onDelete("cascade"),
]);

export const propertyClasses = pgTable("property_classes", {
	id: serial().primaryKey().notNull(),
	name: varchar({ length: 100 }).notNull(),
	description: text(),
	isActive: boolean("is_active").default(true).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	unique("property_classes_name_unique").on(table.name),
]);

export const propertyNearbyAirports = pgTable("property_nearby_airports", {
	id: serial().primaryKey().notNull(),
	propertyId: varchar("property_id", { length: 21 }).notNull(),
	name: varchar({ length: 255 }).notNull(),
	distance: varchar({ length: 50 }).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.propertyId],
			foreignColumns: [properties.id],
			name: "property_nearby_airports_property_id_properties_id_fk"
		}).onDelete("cascade"),
]);

export const propertyNearbyBeaches = pgTable("property_nearby_beaches", {
	id: serial().primaryKey().notNull(),
	propertyId: varchar("property_id", { length: 21 }).notNull(),
	name: varchar({ length: 255 }).notNull(),
	distance: varchar({ length: 50 }).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.propertyId],
			foreignColumns: [properties.id],
			name: "property_nearby_beaches_property_id_properties_id_fk"
		}).onDelete("cascade"),
]);

export const propertyNearbyPlaces = pgTable("property_nearby_places", {
	id: serial().primaryKey().notNull(),
	propertyId: varchar("property_id", { length: 21 }).notNull(),
	name: varchar({ length: 255 }).notNull(),
	distance: varchar({ length: 50 }).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.propertyId],
			foreignColumns: [properties.id],
			name: "property_nearby_places_property_id_properties_id_fk"
		}).onDelete("cascade"),
]);

export const propertyNearbyRestaurants = pgTable("property_nearby_restaurants", {
	id: serial().primaryKey().notNull(),
	propertyId: varchar("property_id", { length: 21 }).notNull(),
	name: varchar({ length: 255 }).notNull(),
	distance: varchar({ length: 50 }).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.propertyId],
			foreignColumns: [properties.id],
			name: "property_nearby_restaurants_property_id_properties_id_fk"
		}).onDelete("cascade"),
]);

export const owners = pgTable("owners", {
	id: varchar({ length: 21 }).primaryKey().notNull(),
	fullName: varchar("full_name", { length: 255 }).notNull(),
	email: varchar({ length: 255 }).notNull(),
	password: varchar({ length: 255 }).notNull(),
	phone: varchar({ length: 20 }),
	isActive: boolean("is_active").default(true).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
	instagram: varchar({ length: 255 }),
	website: varchar({ length: 255 }),
	profileImage: varchar("profile_image", { length: 500 }),
}, (table) => [
	unique("owners_email_unique").on(table.email),
]);

export const propertyAmenities = pgTable("property_amenities", {
	propertyId: varchar("property_id", { length: 21 }).notNull(),
	amenityId: integer("amenity_id").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.propertyId],
			foreignColumns: [properties.id],
			name: "property_amenities_property_id_properties_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.amenityId],
			foreignColumns: [amenities.id],
			name: "property_amenities_amenity_id_amenities_id_fk"
		}).onDelete("cascade"),
	primaryKey({ columns: [table.propertyId, table.amenityId], name: "property_amenities_property_id_amenity_id_pk"}),
]);

export const propertyPropertyClasses = pgTable("property_property_classes", {
	propertyId: varchar("property_id", { length: 21 }).notNull(),
	classId: integer("class_id").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.propertyId],
			foreignColumns: [properties.id],
			name: "property_property_classes_property_id_properties_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.classId],
			foreignColumns: [propertyClasses.id],
			name: "property_property_classes_class_id_property_classes_id_fk"
		}).onDelete("cascade"),
	primaryKey({ columns: [table.propertyId, table.classId], name: "property_property_classes_property_id_class_id_pk"}),
]);

export const propertyAvailability = pgTable("property_availability", {
	propertyId: varchar("property_id", { length: 21 }).notNull(),
	date: date().notNull(),
	isAvailable: boolean("is_available").default(true).notNull(),
	specialPrice: numeric("special_price", { precision: 10, scale:  2 }),
	notes: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.propertyId],
			foreignColumns: [properties.id],
			name: "property_availability_property_id_properties_id_fk"
		}).onDelete("cascade"),
	primaryKey({ columns: [table.propertyId, table.date], name: "property_availability_property_id_date_pk"}),
]);
