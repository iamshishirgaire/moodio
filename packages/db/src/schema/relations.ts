import { relations } from "drizzle-orm/relations";
import { userActions } from "./actions";
import { albums } from "./album";
import { artists } from "./artist";
import { user } from "./auth";
import { fingerprints } from "./fingerprint";
import { history } from "./play-history";
import { playlists, playlistTracks } from "./playlist";
import { tracks } from "./tracks";

export const fingerprintRelations = relations(fingerprints, ({ one }) => ({
	track: one(tracks, {
		fields: [fingerprints.trackId],
		references: [tracks.id],
	}),
}));

export const tracksRelations = relations(tracks, ({ one, many }) => ({
	fingerprints: many(fingerprints),
	album: one(albums, {
		fields: [tracks.albumId],
		references: [albums.id],
	}),
	artist: one(artists, {
		fields: [tracks.topTracksArtistId],
		references: [artists.id],
	}),
}));

export const albumsRelations = relations(albums, ({ one, many }) => ({
	artist_artistId: one(artists, {
		fields: [albums.artistId],
		references: [artists.id],
		relationName: "albums_artistId_artists_id",
	}),
	artist_singlesArtistId: one(artists, {
		fields: [albums.singlesArtistId],
		references: [artists.id],
		relationName: "albums_singlesArtistId_artists_id",
	}),
	tracks: many(tracks),
}));

export const artistsRelations = relations(artists, ({ many }) => ({
	albums_artistId: many(albums, {
		relationName: "albums_artistId_artists_id",
	}),
	albums_singlesArtistId: many(albums, {
		relationName: "albums_singlesArtistId_artists_id",
	}),
	tracks: many(tracks),
}));

export const playlistRelations = relations(playlists, ({ one, many }) => ({
	user: one(user, { fields: [playlists.userId], references: [user.id] }),
	tracks: many(playlistTracks),
}));

export const playlistTracksRelations = relations(playlistTracks, ({ one }) => ({
	playlist: one(playlists, {
		fields: [playlistTracks.playlistId],
		references: [playlists.id],
	}),
	track: one(tracks, {
		fields: [playlistTracks.trackId],
		references: [tracks.id],
	}),
}));

export const historyRelations = relations(history, ({ one }) => ({
	user: one(user, { fields: [history.userId], references: [user.id] }),
	track: one(tracks, { fields: [history.trackId], references: [tracks.id] }),
}));

export const userActionsRelations = relations(userActions, ({ one }) => ({
	user: one(user, { fields: [userActions.userId], references: [user.id] }),
	track: one(tracks, {
		fields: [userActions.trackId],
		references: [tracks.id],
	}),
}));
