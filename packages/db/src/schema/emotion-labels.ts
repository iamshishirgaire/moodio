import { foreignKey, pgTable, text } from "drizzle-orm/pg-core";
import { tracks } from "./tracks";

export const trackEmotions = pgTable(
	"emotion_labels",
	{
		id: text("song_id").primaryKey(),
		emotion: text("emotion").notNull(),
	},
	(table) => [
		foreignKey({
			columns: [table.id],
			foreignColumns: [tracks.id],
			name: "song_emotion_id_fkey",
		}).onDelete("cascade"),
	]
);
