CREATE TABLE "conversations" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar(100),
	"query" text NOT NULL,
	"parsed_query" jsonb,
	"response" text NOT NULL,
	"timestamp" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"price" numeric(10, 2) NOT NULL,
	"specifications" text NOT NULL,
	"category" varchar(100),
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "query_cache" (
	"id" serial PRIMARY KEY NOT NULL,
	"query_hash" varchar(64) NOT NULL,
	"cached_response" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "query_cache_query_hash_unique" UNIQUE("query_hash")
);
--> statement-breakpoint
CREATE INDEX "category_idx" ON "products" USING btree ("category");--> statement-breakpoint
CREATE INDEX "price_idx" ON "products" USING btree ("price");