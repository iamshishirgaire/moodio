/** biome-ignore-all lint/performance/noNamespaceImport: <> */
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as albumSchema from "./schema/album";
import * as artistSchema from "./schema/artist";
import * as authSchema from "./schema/auth";
import * as actionsSchema from "./schema/actions";
import * as playlistSchema from "./schema/playlist";
import * as recommendationsSchema from "./schema/recommendations";
import * as moodSchema from "./schema/mood";
import * as librarySchema from "./schema/library";
import * as relations from "./schema/relations";
import * as trackSchema from "./schema/tracks";

const pool = new Pool({
	connectionString: process.env.DATABASE_URL as string,
});

export const db = drizzle(pool, {
	schema: {
		...albumSchema,
		...artistSchema,
		...trackSchema,
		...authSchema,
		...actionsSchema,
		...playlistSchema,
		...recommendationsSchema,
		...moodSchema,
		...librarySchema,
		...relations,
	},
});
