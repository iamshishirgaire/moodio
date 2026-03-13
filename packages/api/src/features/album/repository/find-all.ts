import { db } from "@moodio/db";
import { albums } from "@moodio/db/schema/album";
import { artists } from "@moodio/db/schema/artist";
import { and, asc, desc, eq, gt, type SQL } from "drizzle-orm";
import type { TGetAlbumRequest } from "../schema";

export const findAll = async (request: TGetAlbumRequest) => {
	const {
		artistId,
		limit = 20,
		cursor,
		sortOrder = "asc",
		albumType,
	} = request;

	const conditions: (SQL | undefined)[] = [];

	if (artistId) {
		conditions.push(eq(albums.artistId, artistId));
	}

	if (cursor) {
		conditions.push(gt(albums.id, cursor));
	}
	conditions.push(eq(albums.albumType, albumType));
	const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
	const orderFn = sortOrder === "asc" ? asc : desc;
	const orderByClause = orderFn(albums.id);
	const data = await db
		.select({
			id: albums.id,
			name: albums.name,
			albumType: albums.albumType,
			releaseDate: albums.releaseDate,
			totalTracks: albums.totalTracks,
			images: albums.images,
			externalUrls: albums.externalUrls,
			genres: albums.genres,
			popularity: albums.popularity,
			copyrights: albums.copyrights,
			createdAt: albums.createdAt,
			updatedAt: albums.updatedAt,
			artistId: albums.artistId,
			singlesArtistId: albums.singlesArtistId,
			artistName: artists.name,
			artistImage: artists.images,
		})
		.from(albums)
		.leftJoin(
			artists,
			eq(
				artists.id,
				albumType === "album" ? albums.artistId : albums.singlesArtistId,
			),
		)
		.where(whereClause)
		.limit(limit)
		.orderBy(orderByClause);
	return data;
};
