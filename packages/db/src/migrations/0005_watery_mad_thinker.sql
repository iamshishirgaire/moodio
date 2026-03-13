ALTER TABLE "history" ADD COLUMN "last_played_at" timestamp NOT NULL DEFAULT now();
CREATE INDEX "history_last_played_at_idx" ON "history" ("last_played_at");
