import { albums } from "@moodio/db/schema/album";
import { artists } from "@moodio/db/schema/artist";
import { playlists } from "@moodio/db/schema/playlist";
import { tracks } from "@moodio/db/schema/tracks";
import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const searchResultSchema = z.object({
	albums: z.array(createSelectSchema(albums)),
	artists: z.array(createSelectSchema(artists)),
	tracks: z.array(createSelectSchema(tracks)),
	playlists: z.array(createSelectSchema(playlists)),
});

export type SearchResult = z.infer<typeof searchResultSchema>;
