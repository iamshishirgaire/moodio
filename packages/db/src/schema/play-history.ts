import { index, pgTable, text, timestamp } from "drizzle-orm/pg-core";
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
		playedAt: timestamp("played_at").defaultNow().notNull(),
		contextUri: text("context_uri"), // e.g., "playlist:123" or "album:456"
	},
	(table) => [
		index("history_user_id_idx").on(table.userId),
		index("history_played_at_idx").on(table.playedAt),
	]
);
