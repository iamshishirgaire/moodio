import { db } from "@moodio/db";
import { albums } from "@moodio/db/schema/album";
import { artists } from "@moodio/db/schema/artist";
import { playlists } from "@moodio/db/schema/playlist";
import { tracks } from "@moodio/db/schema/tracks";
import { ilike } from "drizzle-orm";

export const searchRepository = {
	async searchAll(query: string) {
		const [searchedAlbums, searchedArtists, searchedTracks, searchedPlaylists] =
			await Promise.all([
				db
					.select()
					.from(albums)
					.where(ilike(albums.name, `%${query}%`)),
				db
					.select()
					.from(artists)
					.where(ilike(artists.name, `%${query}%`)),
				db
					.select()
					.from(tracks)
					.where(ilike(tracks.name, `%${query}%`)),
				db
					.select()
					.from(playlists)
					.where(ilike(playlists.name, `%${query}%`)),
			]);
		console.log("searchedAlbums:", searchedAlbums);
		console.log("searchedArtists:", searchedArtists);
		console.log("searchedTracks:", searchedTracks);
		console.log("searchedPlaylists:", searchedPlaylists);
		return {
			albums: searchedAlbums,
			artists: searchedArtists,
			tracks: searchedTracks,
			playlists: searchedPlaylists,
		};
	},
};
