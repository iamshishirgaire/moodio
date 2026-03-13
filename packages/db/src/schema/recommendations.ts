import {
	doublePrecision,
	index,
	pgTable,
	text,
	timestamp,
} from "drizzle-orm/pg-core";
import { user } from "./auth";
import { tracks } from "./tracks";

export const userRecommendations = pgTable(
	"user_recommendations",
	{
		id: text("id").primaryKey(),
		userId: text("user_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		trackId: text("track_id")
			.notNull()
			.references(() => tracks.id, { onDelete: "cascade" }),
		score: doublePrecision().notNull(), // How strong is the recommendation?
		reason: text(), // e.g., "Because you like Artist X"
		createdAt: timestamp("created_at").defaultNow().notNull(),
	},
	(table) => [index("recommendations_user_id_idx").on(table.userId)],
);
