CREATE TABLE "emotion_labels" (
	"song_id" text PRIMARY KEY NOT NULL,
	"emotion" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "emotion_labels" ADD CONSTRAINT "song_emotion_id_fkey" FOREIGN KEY ("song_id") REFERENCES "public"."tracks"("id") ON DELETE cascade ON UPDATE no action;