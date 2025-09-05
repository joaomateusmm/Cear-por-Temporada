CREATE TABLE "property_classes" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"description" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "property_classes_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "property_property_classes" (
	"property_id" varchar(21) NOT NULL,
	"class_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "property_property_classes_property_id_class_id_pk" PRIMARY KEY("property_id","class_id")
);
--> statement-breakpoint
ALTER TABLE "property_property_classes" ADD CONSTRAINT "property_property_classes_property_id_properties_id_fk" FOREIGN KEY ("property_id") REFERENCES "public"."properties"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "property_property_classes" ADD CONSTRAINT "property_property_classes_class_id_property_classes_id_fk" FOREIGN KEY ("class_id") REFERENCES "public"."property_classes"("id") ON DELETE cascade ON UPDATE no action;