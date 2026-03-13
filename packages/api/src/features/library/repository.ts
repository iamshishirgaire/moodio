import { db } from "@moodio/db";
import { albums } from "@moodio/db/schema/album";
import { artists } from "@moodio/db/schema/artist";
import { playlists, playlistTracks } from "@moodio/db/schema/playlist";
import { tracks } from "@moodio/db/schema/tracks";
import { userSavedAlbums } from "@moodio/db/schema/library";
import { and, asc, desc, eq, sql } from "drizzle-orm";
import { randomUUID } from "node:crypto";
import type {
	TAddTrackToPlaylistRequest,
	TCreatePlaylistRequest,
	TGetPlaylistRequest,
	TGetExploreRequest,
	TRemoveTrackFromPlaylistRequest,
	TSaveAlbumRequest,
	TUnsaveAlbumRequest,
} from "./schema";

export const libraryRepository = {
	async getLibrary(userId: string) {
		const [userPlaylists, savedAlbums] = await Promise.all([
			this.getPlaylists(userId),
			db
				.select({
					savedAt: userSavedAlbums.createdAt,
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
				.from(userSavedAlbums)
				.innerJoin(albums, eq(userSavedAlbums.albumId, albums.id))
				.leftJoin(artists, eq(albums.artistId, artists.id))
				.where(eq(userSavedAlbums.userId, userId))
				.orderBy(desc(userSavedAlbums.createdAt)),
		]);

		return {
			playlists: userPlaylists,
			savedAlbums,
		};
	},

	async getPlaylists(userId: string, limit?: number) {
		return db
			.select({
				id: playlists.id,
				name: playlists.name,
				description: playlists.description,
				thumbnail: playlists.thumbnail,
				isPublic: playlists.isPublic,
				createdAt: playlists.createdAt,
				updatedAt: playlists.updatedAt,
				trackCount: sql<number>`cast(count(${playlistTracks.trackId}) as int)`,
			})
			.from(playlists)
			.leftJoin(playlistTracks, eq(playlistTracks.playlistId, playlists.id))
			.where(eq(playlists.userId, userId))
			.groupBy(playlists.id)
			.orderBy(desc(playlists.updatedAt))
			.limit(limit ?? 50);
	},

	async getPlaylistById(userId: string, input: TGetPlaylistRequest) {
		const [playlist] = await db
			.select({
				id: playlists.id,
				name: playlists.name,
				description: playlists.description,
				thumbnail: playlists.thumbnail,
				isPublic: playlists.isPublic,
				createdAt: playlists.createdAt,
				updatedAt: playlists.updatedAt,
			})
			.from(playlists)
			.where(and(eq(playlists.id, input.playlistId), eq(playlists.userId, userId)))
			.limit(1);

		if (!playlist) {
			throw new Error("Playlist not found");
		}

		const playlistWithTracks = await db
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
				position: playlistTracks.position,
			})
			.from(playlistTracks)
			.innerJoin(tracks, eq(playlistTracks.trackId, tracks.id))
			.leftJoin(albums, eq(tracks.albumId, albums.id))
			.where(eq(playlistTracks.playlistId, input.playlistId))
			.orderBy(asc(playlistTracks.position));

		return {
			playlist,
			tracks: playlistWithTracks,
		};
	},

	async getExploreSections(userId: string, input: TGetExploreRequest) {
		const playlistLimit = input.playlistLimit ?? 10;
		const albumLimit = input.albumLimit ?? 10;

		const [playlistsResult, albumsResult] = await Promise.all([
			this.getPlaylists(userId, playlistLimit),
			db
				.select({
					savedAt: userSavedAlbums.createdAt,
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
				.from(userSavedAlbums)
				.innerJoin(albums, eq(userSavedAlbums.albumId, albums.id))
				.leftJoin(artists, eq(albums.artistId, artists.id))
				.where(eq(userSavedAlbums.userId, userId))
				.orderBy(desc(userSavedAlbums.createdAt))
				.limit(albumLimit),
		]);

		return {
			playlists: playlistsResult,
			albums: albumsResult,
		};
	},

	async createPlaylist(userId: string, input: TCreatePlaylistRequest) {
		const id = randomUUID();

		await db.insert(playlists).values({
			id,
			name: input.name,
			description: input.description,
			thumbnail: input.thumbnail,
			isPublic: input.isPublic ?? false,
			userId,
		});

		return { id, success: true };
	},

	async addTrackToPlaylist(userId: string, input: TAddTrackToPlaylistRequest) {
		const [ownedPlaylist] = await db
			.select({ id: playlists.id })
			.from(playlists)
			.where(
				and(eq(playlists.id, input.playlistId), eq(playlists.userId, userId)),
			)
			.limit(1);

		if (!ownedPlaylist) {
			throw new Error("Playlist not found");
		}

		const [existingTrack] = await db
			.select({ trackId: playlistTracks.trackId })
			.from(playlistTracks)
			.where(
				and(
					eq(playlistTracks.playlistId, input.playlistId),
					eq(playlistTracks.trackId, input.trackId),
				),
			)
			.limit(1);

		if (existingTrack) {
			return { success: true, added: false };
		}

		const [positionInfo] = await db
			.select({
				maxPosition:
					sql<number>`coalesce(max(${playlistTracks.position}), -1)`,
			})
			.from(playlistTracks)
			.where(eq(playlistTracks.playlistId, input.playlistId));

		await db.insert(playlistTracks).values({
			playlistId: input.playlistId,
			trackId: input.trackId,
			position: (positionInfo?.maxPosition ?? -1) + 1,
		});

		await db
			.update(playlists)
			.set({ updatedAt: new Date() })
			.where(eq(playlists.id, input.playlistId));

		return { success: true, added: true };
	},

	async removeTrackFromPlaylist(
		userId: string,
		input: TRemoveTrackFromPlaylistRequest,
	) {
		const [ownedPlaylist] = await db
			.select({ id: playlists.id })
			.from(playlists)
			.where(
				and(eq(playlists.id, input.playlistId), eq(playlists.userId, userId)),
			)
			.limit(1);

		if (!ownedPlaylist) {
			throw new Error("Playlist not found");
		}

		await db
			.delete(playlistTracks)
			.where(
				and(
					eq(playlistTracks.playlistId, input.playlistId),
					eq(playlistTracks.trackId, input.trackId),
				),
			);

		await db
			.update(playlists)
			.set({ updatedAt: new Date() })
			.where(eq(playlists.id, input.playlistId));

		return { success: true };
	},

	async saveAlbum(userId: string, input: TSaveAlbumRequest) {
		await db
			.insert(userSavedAlbums)
			.values({
				id: randomUUID(),
				userId,
				albumId: input.albumId,
			})
			.onConflictDoNothing();

		return { success: true };
	},

	async unsaveAlbum(userId: string, input: TUnsaveAlbumRequest) {
		await db
			.delete(userSavedAlbums)
			.where(
				and(
					eq(userSavedAlbums.userId, userId),
					eq(userSavedAlbums.albumId, input.albumId),
				),
			);

		return { success: true };
	},
};
