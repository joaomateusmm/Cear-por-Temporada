import { relations } from "drizzle-orm/relations";
import { properties, propertyImages, propertyPricing, owners, reservations, users, propertyLocation, propertyAmenities, amenities, propertyPropertyClasses, propertyClasses, propertyAvailability } from "./schema";

export const propertyImagesRelations = relations(propertyImages, ({one}) => ({
	property: one(properties, {
		fields: [propertyImages.propertyId],
		references: [properties.id]
	}),
}));

export const propertiesRelations = relations(properties, ({one, many}) => ({
	propertyImages: many(propertyImages),
	propertyPricings: many(propertyPricing),
	owner: one(owners, {
		fields: [properties.ownerId],
		references: [owners.id]
	}),
	reservations: many(reservations),
	propertyLocations: many(propertyLocation),
	propertyAmenities: many(propertyAmenities),
	propertyPropertyClasses: many(propertyPropertyClasses),
	propertyAvailabilities: many(propertyAvailability),
}));

export const propertyPricingRelations = relations(propertyPricing, ({one}) => ({
	property: one(properties, {
		fields: [propertyPricing.propertyId],
		references: [properties.id]
	}),
}));

export const ownersRelations = relations(owners, ({many}) => ({
	properties: many(properties),
}));

export const reservationsRelations = relations(reservations, ({one}) => ({
	property: one(properties, {
		fields: [reservations.propertyId],
		references: [properties.id]
	}),
	user: one(users, {
		fields: [reservations.userId],
		references: [users.id]
	}),
}));

export const usersRelations = relations(users, ({many}) => ({
	reservations: many(reservations),
}));

export const propertyLocationRelations = relations(propertyLocation, ({one}) => ({
	property: one(properties, {
		fields: [propertyLocation.propertyId],
		references: [properties.id]
	}),
}));

export const propertyAmenitiesRelations = relations(propertyAmenities, ({one}) => ({
	property: one(properties, {
		fields: [propertyAmenities.propertyId],
		references: [properties.id]
	}),
	amenity: one(amenities, {
		fields: [propertyAmenities.amenityId],
		references: [amenities.id]
	}),
}));

export const amenitiesRelations = relations(amenities, ({many}) => ({
	propertyAmenities: many(propertyAmenities),
}));

export const propertyPropertyClassesRelations = relations(propertyPropertyClasses, ({one}) => ({
	property: one(properties, {
		fields: [propertyPropertyClasses.propertyId],
		references: [properties.id]
	}),
	propertyClass: one(propertyClasses, {
		fields: [propertyPropertyClasses.classId],
		references: [propertyClasses.id]
	}),
}));

export const propertyClassesRelations = relations(propertyClasses, ({many}) => ({
	propertyPropertyClasses: many(propertyPropertyClasses),
}));

export const propertyAvailabilityRelations = relations(propertyAvailability, ({one}) => ({
	property: one(properties, {
		fields: [propertyAvailability.propertyId],
		references: [properties.id]
	}),
}));