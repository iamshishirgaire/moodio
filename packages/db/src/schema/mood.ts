import {
	index,
	integer,
	pgEnum,
	pgTable,
	text,
	timestamp,
} from "drizzle-orm/pg-core";
import { user } from "./auth";

export const moodEnum = pgEnum("mood_type", [
	"happy",
	"sad",
	"energetic",
	"calm",
	"focused",
	"angry",
	"romantic",
]);

export const userMoodLogs = pgTable(
	"user_mood_logs",
	{
		id: text("id").primaryKey(),
		userId: text("user_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		mood: moodEnum("mood").notNull(),
		confidenceScore: integer("confidence_score"), // 0-100 (if detected by AI)
		source: text("source"), // e.g., 'face_api', 'manual_selection', 'activity_sensor'
		createdAt: timestamp("created_at").defaultNow().notNull(),
	},
	(table) => [
		index("mood_log_user_id_idx").on(table.userId),
		index("mood_log_created_at_idx").on(table.createdAt),
	]
);
