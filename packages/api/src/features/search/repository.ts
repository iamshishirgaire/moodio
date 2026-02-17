import { db } from "@moodio/db";
import { albums } from "@moodio/db/schema/album";
import { artists } from "@moodio/db/schema/artist";
import { playlists } from "@moodio/db/schema/playlist";
import { tracks } from "@moodio/db/schema/tracks";
import { ilike, eq } from "drizzle-orm";

export const searchRepository = {
  async searchAll(query: string) {
    const [searchedAlbums, searchedArtists, searchedTracks, searchedPlaylists] =
      await Promise.all([
        db
          .select()
          .from(albums)
          .where(ilike(albums.name, `%${query}%`))
          .limit(20),
        db
          .select()
          .from(artists)
          .where(ilike(artists.name, `%${query}%`))
          .limit(20),
        // Tracks with album artwork for TPlayerTrack compatibility
        db
          .select({
            // All track fields required by TPlayerTrack
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
            // Album artwork (required by TPlayerTrack as albumArtwork)
            albumArtwork: albums.images,
          })
          .from(tracks)
          .leftJoin(albums, eq(tracks.albumId, albums.id))
          .where(ilike(tracks.name, `%${query}%`))
          .limit(20),
        db
          .select()
          .from(playlists)
          .where(ilike(playlists.name, `%${query}%`))
          .limit(20),
      ]);
    return {
      albums: searchedAlbums,
      artists: searchedArtists,
      tracks: searchedTracks,
      playlists: searchedPlaylists,
    };
  },

  async searchTracks(query: string) {
    const searchedTracks = await db
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
      })
      .from(tracks)
      .leftJoin(albums, eq(tracks.albumId, albums.id))
      .where(ilike(tracks.name, `%${query}%`))
      .limit(50);

    return searchedTracks;
  },
  async searchTrackByTitleAndArtist(title: string, artist?: string) {
    let query = db
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
      })
      .from(tracks)
      .leftJoin(albums, eq(tracks.albumId, albums.id))
      .where(ilike(tracks.name, `%${title}%`))
      .limit(10);

    const results = await query;

    if (artist && results.length > 0) {
      const filteredResults = results.filter((track) => {
        const trackArtists = track.artists?.map((a: any) =>
          a.name.toLowerCase()
        ).join(" ") || "";
        return trackArtists.includes(artist.toLowerCase());
      });

      return filteredResults.length > 0 ? filteredResults : results;
    }

    return results;
  },
};
