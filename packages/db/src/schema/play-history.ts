import { index, integer, pgTable, text } from "drizzle-orm/pg-core";
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
	},
	(table) => [index("history_user_id_idx").on(table.userId)],
);
