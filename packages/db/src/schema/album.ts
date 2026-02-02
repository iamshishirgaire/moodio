import { sql } from "drizzle-orm";
import {
	foreignKey,
	index,
	integer,
	jsonb,
	pgTable,
	text,
	timestamp,
} from "drizzle-orm/pg-core";
import { artists } from "./artist";
import type { Copyright, ExternalUrls, SpotifyImage } from "./db-types";
export const albums = pgTable(
	"albums",
	{
		id: text("id").primaryKey(),
		name: text().notNull(),
		albumType: text("album_type").notNull(),
		releaseDate: text("release_date").notNull(),
		totalTracks: integer("total_tracks").notNull(),
		images: jsonb().notNull().$type<SpotifyImage[]>(),
		externalUrls: jsonb("external_urls").notNull().$type<ExternalUrls>(),
		genres: text().array().default(sql`ARRAY['RAY']::text[]`),
		popularity: integer().default(0).notNull(),
		copyrights: jsonb().$type<Copyright>(),
		createdAt: timestamp("created_at", { withTimezone: true })
			.defaultNow()
			.notNull(),
		updatedAt: timestamp("updated_at", {
			withTimezone: true,
		})
			.defaultNow()
			.$onUpdate(() => new Date())
			.notNull(),

		artistId: text("artist_id"),
		singlesArtistId: text("singles_artist_id"),
	},
	(table) => [
		index("albums_artist_id_idx").using(
			"btree",
			table.artistId.asc().nullsLast().op("text_ops"),
		),
		index("albums_created_at_idx").using(
			"btree",
			table.createdAt.asc().nullsLast().op("timestamptz_ops"),
		),
		index("albums_popularity_idx").using(
			"btree",
			table.popularity.asc().nullsLast().op("int4_ops"),
		),
		index("albums_release_date_idx").using(
			"btree",
			table.releaseDate.asc().nullsLast().op("text_ops"),
		),

		index("albums_singles_artist_id_idx").using(
			"btree",
			table.singlesArtistId.asc().nullsLast().op("text_ops"),
		),
		foreignKey({
			columns: [table.artistId],
			foreignColumns: [artists.id],
			name: "albums_artist_id_fkey",
		})
			.onUpdate("cascade")
			.onDelete("cascade"),
		foreignKey({
			columns: [table.singlesArtistId],
			foreignColumns: [artists.id],
			name: "albums_singles_artist_id_fkey",
		})
			.onUpdate("cascade")
			.onDelete("cascade"),
	],
);
