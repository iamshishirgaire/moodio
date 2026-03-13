import {
	boolean,
	foreignKey,
	index,
	integer,
	jsonb,
	pgTable,
	text,
	timestamp,
} from "drizzle-orm/pg-core";
import { albums } from "./album";
import { artists } from "./artist";
import type { ExternalUrls, SimplifiedArtist } from "./db-types";
export const tracks = pgTable(
	"tracks",
	{
		id: text("id").primaryKey(),
		name: text().notNull(),
		trackNumber: integer("track_number"),
		durationMs: integer("duration_ms").notNull(),
		explicit: boolean().notNull(),
		popularity: integer(),
		previewUrl: text("preview_url"),
		externalUrls: jsonb("external_urls").notNull().$type<ExternalUrls>(),
		artists: jsonb().notNull().$type<SimplifiedArtist[]>(),
		createdAt: timestamp("created_at", { withTimezone: true })
			.defaultNow()
			.notNull(),
		updatedAt: timestamp("updated_at", {
			withTimezone: true,
		})
			.defaultNow()
			.$onUpdate(() => new Date())
			.notNull(),

		// Foreign keys must be TEXT
		albumId: text("album_id"),
		topTracksArtistId: text("top_tracks_artist_id"),
		streamUrl: text("stream_url"),
	},
	(table) => [
		index("tracks_album_id_idx").using(
			"btree",
			table.albumId.asc().nullsLast().op("text_ops"),
		),
		index("tracks_created_at_idx").using(
			"btree",
			table.createdAt.asc().nullsLast().op("timestamptz_ops"),
		),
		index("tracks_popularity_idx").using(
			"btree",
			table.popularity.asc().nullsLast().op("int4_ops"),
		),
		index("tracks_stream_url_idx").using(
			"btree",
			table.streamUrl.asc().nullsLast().op("text_ops"),
		),
		index("tracks_top_tracks_artist_id_idx").using(
			"btree",
			table.topTracksArtistId.asc().nullsLast().op("text_ops"),
		),
		foreignKey({
			columns: [table.albumId],
			foreignColumns: [albums.id],
			name: "tracks_album_id_fkey",
		})
			.onUpdate("cascade")
			.onDelete("cascade"),
		foreignKey({
			columns: [table.topTracksArtistId],
			foreignColumns: [artists.id],
			name: "tracks_top_tracks_artist_id_fkey",
		})
			.onUpdate("cascade")
			.onDelete("cascade"),
	],
);
