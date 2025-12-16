import { db } from "@moodio/db";
import { tracks } from "@moodio/db/schema/tracks";
import { eq } from "drizzle-orm";
import type { TGetAlbumByIdRequest } from "../schema";

export const getTracksByAlbumId = async (request: TGetAlbumByIdRequest) => {
	const { albumId } = request;
	const data = await db.query.tracks.findMany({
		where: eq(tracks.albumId, albumId),
	});
	return data;
};
