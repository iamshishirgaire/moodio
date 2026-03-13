import { index, integer, pgTable, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";
import { user } from "./auth";
import { tracks } from "./tracks";

export const history = pgTable(
	"history",
	{
		id: text("id").primaryKey(),
		userId: text("user_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		trackId: text("track_id")
			.notNull()
			.references(() => tracks.id, { onDelete: "cascade" }),
		listenCount: integer("listen_count").default(0),
		lastPlayedAt: timestamp("last_played_at").defaultNow().notNull(),
	},
	(table) => [
		index("history_user_id_idx").on(table.userId),
		index("history_last_played_at_idx").on(table.lastPlayedAt),
		uniqueIndex("history_user_track_unique").on(table.userId, table.trackId),
	],
);
