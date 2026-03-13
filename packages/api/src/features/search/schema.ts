import { albums } from "@moodio/db/schema/album";
import { artists } from "@moodio/db/schema/artist";
import { playlists } from "@moodio/db/schema/playlist";
import { tracks } from "@moodio/db/schema/tracks";
import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";

const trackWithAlbumArtworkSchema = createSelectSchema(tracks).extend({
	albumArtwork: createSelectSchema(albums).shape.images.nullable(),
});

const albumWithArtistInfoSchema = createSelectSchema(albums).extend({
    artistName: z.string().nullable(),
    artistImage: createSelectSchema(artists).shape.images.nullable(),
});

export const searchResultSchema = z.object({
	albums: z.array(albumWithArtistInfoSchema),
	artists: z.array(createSelectSchema(artists)),
	tracks: z.array(trackWithAlbumArtworkSchema),
	playlists: z.array(createSelectSchema(playlists)),
});

export const searchTrackResultSchema = z.object({
	tracks: z.array(trackWithAlbumArtworkSchema),
});
export type SearchTrackResult =  z.infer<typeof searchTrackResultSchema>
export type SearchResult = z.infer<typeof searchResultSchema>;
