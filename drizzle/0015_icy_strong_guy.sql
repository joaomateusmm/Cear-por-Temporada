CREATE TABLE "property_house_rules" (
	"id" serial PRIMARY KEY NOT NULL,
	"property_id" varchar(21) NOT NULL,
	"check_in_rule" text,
	"check_out_rule" text,
	"cancellation_rule" text,
	"children_rule" text,
	"beds_rule" text,
	"age_restriction_rule" text,
	"groups_rule" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "property_payment_methods" (
	"id" serial PRIMARY KEY NOT NULL,
	"property_id" varchar(21) NOT NULL,
	"accepts_visa" boolean DEFAULT false NOT NULL,
	"accepts_american_express" boolean DEFAULT false NOT NULL,
	"accepts_master_card" boolean DEFAULT false NOT NULL,
	"accepts_maestro" boolean DEFAULT false NOT NULL,
	"accepts_elo" boolean DEFAULT false NOT NULL,
	"accepts_diners_club" boolean DEFAULT false NOT NULL,
	"accepts_pix" boolean DEFAULT false NOT NULL,
	"accepts_cash" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "property_house_rules" ADD CONSTRAINT "property_house_rules_property_id_properties_id_fk" FOREIGN KEY ("property_id") REFERENCES "public"."properties"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "property_payment_methods" ADD CONSTRAINT "property_payment_methods_property_id_properties_id_fk" FOREIGN KEY ("property_id") REFERENCES "public"."properties"("id") ON DELETE cascade ON UPDATE no action;