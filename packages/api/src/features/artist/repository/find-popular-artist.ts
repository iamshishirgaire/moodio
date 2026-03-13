import { db } from "@moodio/db";
import { artists } from "@moodio/db/schema/artist";
import { asc } from "drizzle-orm";
import type { TGetArtistPopularRequest } from "../schema";

export const findPopular = async (request: TGetArtistPopularRequest) => {
	const { limit } = request;
	const data = await db.query.artists.findMany({
		orderBy: asc(artists.popularity),
		limit,
	});
	return data;
};
