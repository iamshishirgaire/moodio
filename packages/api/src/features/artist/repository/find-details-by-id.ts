import { db } from "@moodio/db";
import { albums } from "@moodio/db/schema/album";
import { artists } from "@moodio/db/schema/artist";
import { eq, desc } from "drizzle-orm";
import type { TGetArtistByIdRequest } from "../schema";

export const findDetailsById = async (request: TGetArtistByIdRequest) => {
	const { artistId } = request;

    const artistDetails = await db.query.artists.findFirst({
		where: eq(artists.id, artistId),
	});

    if (!artistDetails) {
        return null;
    }

    const artistAlbums = await db.query.albums.findMany({
        where: eq(albums.artistId, artistId),
        orderBy: desc(albums.releaseDate),
        limit: 50, // Let's limit to 50 for now
    });

	return { ...artistDetails, albums: artistAlbums };
};
