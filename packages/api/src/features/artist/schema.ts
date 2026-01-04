import z from "zod";
import { withPagination } from "../../shared/schema";

export const getArtistPopularRequest = withPagination({
	limit: z.coerce.number(),
});
export const getArtistByIdRequest = z.object({
	artistId: z.string(),
});

export type TGetArtistPopularRequest = z.infer<typeof getArtistPopularRequest>;
export type TGetArtistByIdRequest = z.infer<typeof getArtistByIdRequest>;
