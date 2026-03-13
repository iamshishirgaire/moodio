import { z } from "zod";

export const createPlaylistRequestSchema = z.object({
	name: z.string().min(1).max(120),
	description: z.string().max(500).optional(),
	thumbnail: z.string().url().optional(),
	isPublic: z.boolean().optional(),
});

export const getPlaylistRequestSchema = z.object({
	playlistId: z.string(),
});

export const addTrackToPlaylistRequestSchema = z.object({
	playlistId: z.string(),
	trackId: z.string(),
});

export const removeTrackFromPlaylistRequestSchema = z.object({
	playlistId: z.string(),
	trackId: z.string(),
});

export const saveAlbumRequestSchema = z.object({
	albumId: z.string(),
});

export const unsaveAlbumRequestSchema = z.object({
	albumId: z.string(),
});

export type TCreatePlaylistRequest = z.infer<typeof createPlaylistRequestSchema>;
export type TGetPlaylistRequest = z.infer<typeof getPlaylistRequestSchema>;
export type TAddTrackToPlaylistRequest = z.infer<
	typeof addTrackToPlaylistRequestSchema
>;
export type TRemoveTrackFromPlaylistRequest = z.infer<
	typeof removeTrackFromPlaylistRequestSchema
>;
export type TSaveAlbumRequest = z.infer<typeof saveAlbumRequestSchema>;
export type TUnsaveAlbumRequest = z.infer<typeof unsaveAlbumRequestSchema>;
