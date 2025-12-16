/** biome-ignore-all lint/performance/noNamespaceImport: <> */
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as albumSchema from "./schema/album";
import * as artistSchema from "./schema/artist";
import * as authSchema from "./schema/auth";
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
		...relations,
	},
});
