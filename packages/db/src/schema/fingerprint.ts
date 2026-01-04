import {
	foreignKey,
	index,
	integer,
	pgTable,
	text,
	timestamp,
} from "drizzle-orm/pg-core";
import { tracks } from "./tracks";

export const fingerprints = pgTable(
	"song_fingerprints",
	{
		id: text("id").primaryKey(),
		anchorTime: integer("anchor_time").notNull(),
		address: integer("address").notNull(),
		createdAt: timestamp("created_at", { withTimezone: true })
			.defaultNow()
			.notNull(),
		updatedAt: timestamp("updated_at", {
			withTimezone: true,
		})
			.defaultNow()
			.$onUpdate(() => new Date())
			.notNull(),
		trackId: text("track_id"),
	},
	(table) => [
		index("fingerprint_created_at_idx").using(
			"btree",
			table.createdAt.asc().nullsLast().op("timestamptz_ops")
		),
		foreignKey({
			columns: [table.trackId],
			foreignColumns: [tracks.id],
			name: "fingerprint_track_id_fkey",
		})
			.onUpdate("cascade")
			.onDelete("cascade"),
	]
);
