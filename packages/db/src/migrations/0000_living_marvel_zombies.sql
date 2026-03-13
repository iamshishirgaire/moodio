CREATE TABLE "account" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "albums" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"album_type" text NOT NULL,
	"release_date" text NOT NULL,
	"total_tracks" integer NOT NULL,
	"images" jsonb NOT NULL,
	"external_urls" jsonb NOT NULL,
	"genres" text[] DEFAULT ARRAY['RAY']::text[],
	"popularity" integer DEFAULT 0 NOT NULL,
	"copyrights" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"artist_id" text,
	"singles_artist_id" text
);
--> statement-breakpoint
CREATE TABLE "artists" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"genres" text[],
	"popularity" integer NOT NULL,
	"followers" integer NOT NULL,
	"images" jsonb NOT NULL,
	"external_urls" jsonb NOT NULL,
	"fetched_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tracks" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"track_number" integer,
	"duration_ms" integer NOT NULL,
	"explicit" boolean NOT NULL,
	"popularity" integer,
	"preview_url" text,
	"external_urls" jsonb NOT NULL,
	"artists" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"album_id" text,
	"top_tracks_artist_id" text,
	"stream_url" text
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "albums" ADD CONSTRAINT "albums_artist_id_fkey" FOREIGN KEY ("artist_id") REFERENCES "public"."artists"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "albums" ADD CONSTRAINT "albums_singles_artist_id_fkey" FOREIGN KEY ("singles_artist_id") REFERENCES "public"."artists"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "tracks" ADD CONSTRAINT "tracks_album_id_fkey" FOREIGN KEY ("album_id") REFERENCES "public"."albums"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "tracks" ADD CONSTRAINT "tracks_top_tracks_artist_id_fkey" FOREIGN KEY ("top_tracks_artist_id") REFERENCES "public"."artists"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
CREATE INDEX "account_userId_idx" ON "account" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "session_userId_idx" ON "session" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "verification_identifier_idx" ON "verification" USING btree ("identifier");--> statement-breakpoint
CREATE INDEX "albums_artist_id_idx" ON "albums" USING btree ("artist_id" text_ops);--> statement-breakpoint
CREATE INDEX "albums_created_at_idx" ON "albums" USING btree ("created_at" timestamptz_ops);--> statement-breakpoint
CREATE INDEX "albums_popularity_idx" ON "albums" USING btree ("popularity" int4_ops);--> statement-breakpoint
CREATE INDEX "albums_release_date_idx" ON "albums" USING btree ("release_date" text_ops);--> statement-breakpoint
CREATE INDEX "albums_singles_artist_id_idx" ON "albums" USING btree ("singles_artist_id" text_ops);--> statement-breakpoint
CREATE INDEX "artists_created_at_idx" ON "artists" USING btree ("created_at" timestamptz_ops);--> statement-breakpoint
CREATE INDEX "artists_fetched_at_idx" ON "artists" USING btree ("fetched_at" timestamptz_ops);--> statement-breakpoint
CREATE INDEX "artists_followers_idx" ON "artists" USING btree ("followers" int4_ops);--> statement-breakpoint
CREATE INDEX "artists_name_idx" ON "artists" USING btree ("name" text_ops);--> statement-breakpoint
CREATE INDEX "artists_popularity_idx" ON "artists" USING btree ("popularity" int4_ops);--> statement-breakpoint
CREATE INDEX "tracks_album_id_idx" ON "tracks" USING btree ("album_id" text_ops);--> statement-breakpoint
CREATE INDEX "tracks_created_at_idx" ON "tracks" USING btree ("created_at" timestamptz_ops);--> statement-breakpoint
CREATE INDEX "tracks_popularity_idx" ON "tracks" USING btree ("popularity" int4_ops);--> statement-breakpoint
CREATE INDEX "tracks_stream_url_idx" ON "tracks" USING btree ("stream_url" text_ops);--> statement-breakpoint
CREATE INDEX "tracks_top_tracks_artist_id_idx" ON "tracks" USING btree ("top_tracks_artist_id" text_ops);