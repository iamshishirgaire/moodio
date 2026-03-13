import { db } from "@moodio/db";
import { albums } from "@moodio/db/schema/album";
import { history } from "@moodio/db/schema/play-history";
import { tracks } from "@moodio/db/schema/tracks";
import { desc, eq, sql } from "drizzle-orm";
import type { TGetHistoryRequest } from "./schema";
import type { TLogHistoryRequest } from "./schema";
import { randomUUID } from "node:crypto";

export const historyRepository = {
	async getRecent(userId: string, input: TGetHistoryRequest) {
		const limit = input.limit ?? 10;

		return db
			.select({
				id: tracks.id,
				name: tracks.name,
				trackNumber: tracks.trackNumber,
				durationMs: tracks.durationMs,
				explicit: tracks.explicit,
				popularity: tracks.popularity,
				previewUrl: tracks.previewUrl,
				externalUrls: tracks.externalUrls,
				artists: tracks.artists,
				streamUrl: tracks.streamUrl,
				createdAt: tracks.createdAt,
				updatedAt: tracks.updatedAt,
				albumId: tracks.albumId,
				topTracksArtistId: tracks.topTracksArtistId,
				albumArtwork: albums.images,
				listenCount: history.listenCount,
				lastPlayedAt: history.lastPlayedAt,
			})
			.from(history)
			.innerJoin(tracks, eq(history.trackId, tracks.id))
			.leftJoin(albums, eq(tracks.albumId, albums.id))
			.where(eq(history.userId, userId))
			.orderBy(desc(history.lastPlayedAt))
			.limit(limit);
	},

	async logPlay(userId: string, input: TLogHistoryRequest) {
		await db
			.insert(history)
			.values({
				id: randomUUID(),
				userId,
				trackId: input.trackId,
				listenCount: 1,
				lastPlayedAt: new Date(),
			})
			.onConflictDoUpdate({
				target: [history.userId, history.trackId],
				set: {
					listenCount: sql`${history.listenCount} + 1`,
					lastPlayedAt: new Date(),
				},
			});

		return { success: true };
	},
};
