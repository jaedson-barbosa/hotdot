CREATE TYPE "public"."align" AS ENUM('left', 'center', 'right');--> statement-breakpoint
CREATE TYPE "public"."font" AS ENUM('Boxxy - 14', 'Cherry - 10', 'Cherry - 11', 'Cherry - 13', 'Ctrld - 10', 'Ctrld - 13', 'Ctrld - 16', 'Dina - 10', 'Dina - 12', 'Dina - 13', 'Dylex - 10', 'Dylex - 13', 'Dylex - 20', 'Gohufont - 11', 'Gohufont - 14', 'Kakwa - 12', 'Lokaltog - 10', 'Lokaltog - 12', 'MPlus - 10', 'MPlus - 12', 'Orp - 12', 'Scientifica - 11', 'Sq - 15', 'Terminus - 14', 'Terminus - 16', 'Terminus - 18', 'Terminus - 20', 'Terminus - 22', 'Terminus - 24', 'Terminus - 28', 'Terminus - 32', 'Tewi - 11', 'Triskweline - 13');--> statement-breakpoint
CREATE TABLE "account" (
	"userId" text NOT NULL,
	"type" text NOT NULL,
	"provider" text NOT NULL,
	"providerAccountId" text NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" integer,
	"token_type" text,
	"scope" text,
	"id_token" text,
	"session_state" text
);
--> statement-breakpoint
CREATE TABLE "authenticator" (
	"credentialID" text NOT NULL,
	"userId" text NOT NULL,
	"providerAccountId" text NOT NULL,
	"credentialPublicKey" text NOT NULL,
	"counter" integer NOT NULL,
	"credentialDeviceType" text NOT NULL,
	"credentialBackedUp" boolean NOT NULL,
	"transports" text,
	CONSTRAINT "authenticator_credentialID_unique" UNIQUE("credentialID")
);
--> statement-breakpoint
CREATE TABLE "print" (
	"id" text PRIMARY KEY NOT NULL,
	"width" smallint DEFAULT 384 NOT NULL,
	"author_id" text,
	"title" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp (0)
);
--> statement-breakpoint
CREATE TABLE "section" (
	"id" serial PRIMARY KEY NOT NULL,
	"text_id" integer,
	"print_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session" (
	"sessionToken" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"expires" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "text" (
	"id" serial PRIMARY KEY NOT NULL,
	"text" text NOT NULL,
	"font" "font" NOT NULL,
	"align" "align" NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text,
	"email" text,
	"emailVerified" timestamp,
	"image" text,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verificationToken" (
	"identifier" text NOT NULL,
	"token" text NOT NULL,
	"expires" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "authenticator" ADD CONSTRAINT "authenticator_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "print" ADD CONSTRAINT "print_author_id_user_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "section" ADD CONSTRAINT "section_text_id_text_id_fk" FOREIGN KEY ("text_id") REFERENCES "public"."text"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "section" ADD CONSTRAINT "section_print_id_print_id_fk" FOREIGN KEY ("print_id") REFERENCES "public"."print"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;