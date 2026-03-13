import { index, pgTable, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";
import { albums } from "./album";
import { user } from "./auth";

export const userSavedAlbums = pgTable(
	"user_saved_albums",
	{
		id: text("id").primaryKey(),
		userId: text("user_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		albumId: text("album_id")
			.notNull()
			.references(() => albums.id, { onDelete: "cascade" }),
		createdAt: timestamp("created_at").defaultNow().notNull(),
	},
	(table) => [
		index("user_saved_albums_user_id_idx").on(table.userId),
		index("user_saved_albums_album_id_idx").on(table.albumId),
		uniqueIndex("user_saved_albums_user_album_unique").on(
			table.userId,
			table.albumId,
		),
	],
);
