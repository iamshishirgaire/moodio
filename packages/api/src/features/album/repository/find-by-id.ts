import { db } from "@moodio/db";
import { albums } from "@moodio/db/schema/album";
import { eq } from "drizzle-orm";
import type { TGetAlbumByIdRequest } from "../schema";

export const findById = async (request: TGetAlbumByIdRequest) => {
	const { albumId } = request;
	const data = await db.query.albums.findFirst({
		where: eq(albums.id, albumId),
	});
	return data;
};
