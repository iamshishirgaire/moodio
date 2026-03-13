CREATE TABLE "user_saved_albums" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"album_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "user_actions" ALTER COLUMN "id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "user_actions" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "user_saved_albums" ADD CONSTRAINT "user_saved_albums_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_saved_albums" ADD CONSTRAINT "user_saved_albums_album_id_albums_id_fk" FOREIGN KEY ("album_id") REFERENCES "public"."albums"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "user_saved_albums_user_id_idx" ON "user_saved_albums" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "user_saved_albums_album_id_idx" ON "user_saved_albums" USING btree ("album_id");--> statement-breakpoint
CREATE UNIQUE INDEX "user_saved_albums_user_album_unique" ON "user_saved_albums" USING btree ("user_id","album_id");