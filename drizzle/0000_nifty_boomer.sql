CREATE TABLE "items" (
	"sourceType" text NOT NULL,
	"sourceId" text NOT NULL,
	"title" text NOT NULL,
	"coverImage" text,
	"imageList" text[],
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
