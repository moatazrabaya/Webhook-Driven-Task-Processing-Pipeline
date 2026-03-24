CREATE TABLE "pipelines" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"source_key" varchar(50) NOT NULL,
	"action_type" varchar(50) NOT NULL,
	"config" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "pipelines_source_key_unique" UNIQUE("source_key")
);
