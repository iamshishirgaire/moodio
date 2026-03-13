import {
	boolean,
	index,
	integer,
	pgTable,
	text,
	timestamp,
} from "drizzle-orm/pg-core";
import { user } from "./auth";
import { tracks } from "./tracks";

export const playlists = pgTable("playlists", {
	id: text("id").primaryKey(),
	name: text().notNull(),
	description: text(),
	thumbnail: text("thumbnail"),
	isPublic: boolean("is_public").default(true).notNull(),
	userId: text("user_id")
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at")
		.defaultNow()
		.$onUpdate(() => new Date()),
});

export const playlistTracks = pgTable(
	"playlist_tracks",
	{
		playlistId: text("playlist_id")
			.notNull()
			.references(() => playlists.id, { onDelete: "cascade" }),
		trackId: text("track_id")
			.notNull()
			.references(() => tracks.id, { onDelete: "cascade" }),
		addedAt: timestamp("added_at").defaultNow().notNull(),
		position: integer().notNull(), // To maintain custom sort order
	},
	(table) => [index("playlist_tracks_playlist_id_idx").on(table.playlistId)],
);
