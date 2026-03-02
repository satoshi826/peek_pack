CREATE TYPE "public"."focus_type" AS ENUM('AF', 'MF', 'AF/MF');--> statement-breakpoint
CREATE TYPE "public"."gear_status" AS ENUM('owned', 'wanted', 'previously-owned');--> statement-breakpoint
CREATE TYPE "public"."gear_type" AS ENUM('camera', 'lens');--> statement-breakpoint
CREATE TYPE "public"."product_type" AS ENUM('camera', 'lens');--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"profile_image" text NOT NULL,
	"bio" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "user_bookmarks" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"target_user_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_bookmarks_user_target_unique" UNIQUE("user_id","target_user_id")
);
--> statement-breakpoint
CREATE TABLE "makers" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"name_ja" text,
	"website" text,
	"product_types" "product_type"[] NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "camera_masters" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"maker_id" text NOT NULL,
	"release_date" timestamp,
	"sensor_size" text,
	"lens_mount" text,
	"resolution" text,
	"is_compact" boolean NOT NULL,
	"has_stabilization" boolean NOT NULL,
	"stabilization_stops" real,
	"weight" integer,
	"size" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "lens_masters" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"maker_id" text NOT NULL,
	"release_date" timestamp,
	"lens_mount" text,
	"focal_length" text,
	"max_aperture" text,
	"focus_type" "focus_type" NOT NULL,
	"weight" integer,
	"size" jsonb,
	"filter_diameter" real,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_gears" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"gear_type" "gear_type" NOT NULL,
	"master_id" text,
	"custom_name" text,
	"custom_maker" text,
	"status" "gear_status" NOT NULL,
	"comment" text,
	"photos" text[],
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "user_bookmarks" ADD CONSTRAINT "user_bookmarks_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_bookmarks" ADD CONSTRAINT "user_bookmarks_target_user_id_users_id_fk" FOREIGN KEY ("target_user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "camera_masters" ADD CONSTRAINT "camera_masters_maker_id_makers_id_fk" FOREIGN KEY ("maker_id") REFERENCES "public"."makers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lens_masters" ADD CONSTRAINT "lens_masters_maker_id_makers_id_fk" FOREIGN KEY ("maker_id") REFERENCES "public"."makers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_gears" ADD CONSTRAINT "user_gears_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;