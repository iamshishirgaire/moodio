import { db } from "@moodio/db";
import { artists } from "@moodio/db/schema/artist";
import { eq } from "drizzle-orm";
import type { TGetArtistByIdRequest } from "../schema";

export const findById = async (request: TGetArtistByIdRequest) => {
	const { artistId } = request;
	const data = await db.query.artists.findFirst({
		where: eq(artists.id, artistId),
	});
	return data;
};
