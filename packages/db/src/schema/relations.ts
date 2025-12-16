import { relations } from "drizzle-orm/relations";
import { albums } from "./album";
import { artists } from "./artist";
import { tracks } from "./tracks";

// export const fingerprintRelations = relations(fingerprint, ({ one }) => ({
//   track: one(tracks, {
//     fields: [fingerprint.songid],
//     references: [tracks.id],
//   }),
// }));

export const tracksRelations = relations(tracks, ({ one }) => ({
	// fingerprints: many(fingerprint),
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
