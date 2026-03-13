import {
	index,
	integer,
	jsonb,
	pgTable,
	text,
	timestamp,
} from "drizzle-orm/pg-core";
import type { ExternalUrls, SpotifyImage } from "./db-types";

export const artists = pgTable(
	"artists",
	{
		// Spotify Artist ID is the Primary Key (text)
		id: text("id").primaryKey(),
		name: text().notNull(),
		genres: text().array(), // text[] column
		popularity: integer().notNull(),
		followers: integer().notNull(),
		images: jsonb().notNull().$type<SpotifyImage[]>(),
		externalUrls: jsonb("external_urls").notNull().$type<ExternalUrls>(),
		fetchedAt: timestamp("fetched_at", { withTimezone: true })
			.defaultNow()
			.notNull(),
		createdAt: timestamp("created_at", {
			withTimezone: true,
		})
			.defaultNow()
			.notNull(),
	},
	(table) => [
		index("artists_created_at_idx").using(
			"btree",
			table.createdAt.asc().nullsLast().op("timestamptz_ops"),
		),
		index("artists_fetched_at_idx").using(
			"btree",
			table.fetchedAt.asc().nullsLast().op("timestamptz_ops"),
		),
		index("artists_followers_idx").using(
			"btree",
			table.followers.asc().nullsLast().op("int4_ops"),
		),
		index("artists_name_idx").using(
			"btree",
			table.name.asc().nullsLast().op("text_ops"),
		),

		index("artists_popularity_idx").using(
			"btree",
			table.popularity.asc().nullsLast().op("int4_ops"),
		),
		// Fixed: Remove the GIN index from here - we'll create it separately
	],
);
