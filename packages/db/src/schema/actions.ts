import { index, pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { user } from "./auth";
import { tracks } from "./tracks";

// Define the types of interactions a user can have
export const actionTypeEnum = pgEnum("action_type", [
	"play",
	"skip",
	"like",
	"unlike",
	"save_to_library",
]);

export const userActions = pgTable(
	"user_actions",
	{
		id: text("id").primaryKey(),
		userId: text("user_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		trackId: text("track_id")
			.notNull()
			.references(() => tracks.id, { onDelete: "cascade" }),
		action: actionTypeEnum("action").notNull(),
		createdAt: timestamp("created_at").defaultNow().notNull(),
	},
	(table) => [
		index("user_action_user_id_idx").on(table.userId),
		index("user_action_track_id_idx").on(table.trackId),
		index("user_action_composite_idx").on(table.userId, table.action),
	],
);
