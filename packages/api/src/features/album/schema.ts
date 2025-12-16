import { albums } from "@moodio/db/schema/album";
import { tracks } from "@moodio/db/schema/tracks";
import { createSelectSchema } from "drizzle-zod";
import z from "zod";
import { withPagination } from "../../shared/schema";

export const getAlbumsRequest = withPagination({
	artistId: z.string().optional(),
	albumType: z.enum(["album", "single"]).default("album"),
});
export const getAlbumByIdRequest = z.object({
	albumId: z.string(),
});

export const AlbumSchema = createSelectSchema(albums);
export const TrackSchema = createSelectSchema(tracks);
// export const PaginatedAlbumResponseSchema = createPaginatedResponseSchema(
// 	AlbumSchema.extend({
// 		artistName: z.string().nullable(),
// 	})
// );

// export const AlbumByIdResponseSchema = createResponseSchema(AlbumSchema);
// export type TPaginatedAlbumResponse = z.infer<
// 	typeof PaginatedAlbumResponseSchema
// >;

export type TAlbum = z.infer<typeof AlbumSchema>;
export type TTrack = z.infer<typeof TrackSchema>;

export type TGetAlbumRequest = z.infer<typeof getAlbumsRequest>;
export type TGetAlbumByIdRequest = z.infer<typeof getAlbumByIdRequest>;
