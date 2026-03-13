CREATE TYPE "public"."action_type" AS ENUM('play', 'skip', 'like', 'unlike', 'save_to_library');--> statement-breakpoint
CREATE TYPE "public"."mood_type" AS ENUM('happy', 'sad', 'energetic', 'calm', 'focused', 'angry', 'romantic');--> statement-breakpoint
CREATE TABLE "user_actions" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"track_id" text NOT NULL,
	"action" "action_type" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_mood_logs" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"mood" "mood_type" NOT NULL,
	"confidence_score" integer,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "history" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"track_id" text NOT NULL,
	"listen_count" integer DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE "playlist_tracks" (
	"playlist_id" text NOT NULL,
	"track_id" text NOT NULL,
	"added_at" timestamp DEFAULT now() NOT NULL,
	"position" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "playlists" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"thumbnail" text,
	"is_public" boolean DEFAULT true NOT NULL,
	"user_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "user_recommendations" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"track_id" text NOT NULL,
	"score" double precision NOT NULL,
	"reason" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "track_features" (
	"song_id" text PRIMARY KEY NOT NULL,
	"mfcc" double precision[] NOT NULL,
	"tempo" double precision NOT NULL,
	"chroma" double precision[] NOT NULL,
	"spectral_centroid" double precision NOT NULL,
	"spectral_bandwidth" double precision NOT NULL,
	"spectral_contrast" double precision[] NOT NULL,
	"rms_energy" double precision NOT NULL,
	"zcr" double precision NOT NULL
);
--> statement-breakpoint
ALTER TABLE "song_fingerprints" ALTER COLUMN "address" SET DATA TYPE bigint;--> statement-breakpoint
ALTER TABLE "user_actions" ADD CONSTRAINT "user_actions_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_actions" ADD CONSTRAINT "user_actions_track_id_tracks_id_fk" FOREIGN KEY ("track_id") REFERENCES "public"."tracks"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_mood_logs" ADD CONSTRAINT "user_mood_logs_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "history" ADD CONSTRAINT "history_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "history" ADD CONSTRAINT "history_track_id_tracks_id_fk" FOREIGN KEY ("track_id") REFERENCES "public"."tracks"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "playlist_tracks" ADD CONSTRAINT "playlist_tracks_playlist_id_playlists_id_fk" FOREIGN KEY ("playlist_id") REFERENCES "public"."playlists"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "playlist_tracks" ADD CONSTRAINT "playlist_tracks_track_id_tracks_id_fk" FOREIGN KEY ("track_id") REFERENCES "public"."tracks"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "playlists" ADD CONSTRAINT "playlists_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_recommendations" ADD CONSTRAINT "user_recommendations_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_recommendations" ADD CONSTRAINT "user_recommendations_track_id_tracks_id_fk" FOREIGN KEY ("track_id") REFERENCES "public"."tracks"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "track_features" ADD CONSTRAINT "song_features_song_id_fkey" FOREIGN KEY ("song_id") REFERENCES "public"."tracks"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "user_action_user_id_idx" ON "user_actions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "user_action_track_id_idx" ON "user_actions" USING btree ("track_id");--> statement-breakpoint
CREATE INDEX "user_action_composite_idx" ON "user_actions" USING btree ("user_id","action");--> statement-breakpoint
CREATE INDEX "mood_log_user_id_idx" ON "user_mood_logs" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "mood_log_created_at_idx" ON "user_mood_logs" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "history_user_id_idx" ON "history" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "playlist_tracks_playlist_id_idx" ON "playlist_tracks" USING btree ("playlist_id");--> statement-breakpoint
CREATE INDEX "recommendations_user_id_idx" ON "user_recommendations" USING btree ("user_id");