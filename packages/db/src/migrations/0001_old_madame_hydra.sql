CREATE TABLE "song_fingerprints" (
	"id" text PRIMARY KEY NOT NULL,
	"anchor_time" integer NOT NULL,
	"address" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"track_id" text
);
--> statement-breakpoint
ALTER TABLE "song_fingerprints" ADD CONSTRAINT "fingerprint_track_id_fkey" FOREIGN KEY ("track_id") REFERENCES "public"."tracks"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
CREATE INDEX "fingerprint_created_at_idx" ON "song_fingerprints" USING btree ("created_at" timestamptz_ops);