import { createSelectSchema } from "drizzle-zod";
import z from "zod";
import { withPagination } from "../../shared/schema";
import { artists } from "@moodio/db/schema/artist";
import { albums } from "@moodio/db/schema/album";

export const getArtistPopularRequest = withPagination({
	limit: z.coerce.number(),
});
export const getArtistByIdRequest = z.object({
	artistId: z.string(),
});

export const ArtistDetailsSchema = createSelectSchema(artists).extend({
    albums: z.array(createSelectSchema(albums)),
});

export type TGetArtistPopularRequest = z.infer<typeof getArtistPopularRequest>;
export type TGetArtistByIdRequest = z.infer<typeof getArtistByIdRequest>;
