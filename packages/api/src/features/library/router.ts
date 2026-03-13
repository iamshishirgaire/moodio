import { protectedProcedure } from "../..";
import { Tags } from "../../utils/tags";
import { libraryRepository } from "./repository";
import {
	addTrackToPlaylistRequestSchema,
	createPlaylistRequestSchema,
	getPlaylistRequestSchema,
	removeTrackFromPlaylistRequestSchema,
	saveAlbumRequestSchema,
	unsaveAlbumRequestSchema,
	getExploreRequestSchema,
} from "./schema";

const getLibrary = protectedProcedure
	.route({
		method: "GET",
		path: "/library",
		tags: [Tags.LIBRARY],
	})
	.handler(async ({ context }) =>
		libraryRepository.getLibrary(context.session.user.id),
	);

const getPlaylists = protectedProcedure
	.route({
		method: "GET",
		path: "/library/playlists",
		tags: [Tags.LIBRARY],
	})
	.handler(async ({ context }) =>
		libraryRepository.getPlaylists(context.session.user.id),
	);

const getPlaylistById = protectedProcedure
	.route({
		method: "GET",
		path: "/library/playlist",
		tags: [Tags.LIBRARY],
	})
	.input(getPlaylistRequestSchema)
	.handler(async ({ context, input }) =>
		libraryRepository.getPlaylistById(context.session.user.id, input),
	);

const createPlaylist = protectedProcedure
	.route({
		method: "POST",
		path: "/library/playlists",
		tags: [Tags.LIBRARY],
	})
	.input(createPlaylistRequestSchema)
	.handler(async ({ context, input }) =>
		libraryRepository.createPlaylist(context.session.user.id, input),
	);

const addTrackToPlaylist = protectedProcedure
	.route({
		method: "POST",
		path: "/library/playlists/track",
		tags: [Tags.LIBRARY],
	})
	.input(addTrackToPlaylistRequestSchema)
	.handler(async ({ context, input }) =>
		libraryRepository.addTrackToPlaylist(context.session.user.id, input),
	);

const removeTrackFromPlaylist = protectedProcedure
	.route({
		method: "DELETE",
		path: "/library/playlists/track",
		tags: [Tags.LIBRARY],
	})
	.input(removeTrackFromPlaylistRequestSchema)
	.handler(async ({ context, input }) =>
		libraryRepository.removeTrackFromPlaylist(context.session.user.id, input),
	);

const saveAlbum = protectedProcedure
	.route({
		method: "POST",
		path: "/library/albums/save",
		tags: [Tags.LIBRARY],
	})
	.input(saveAlbumRequestSchema)
	.handler(async ({ context, input }) =>
		libraryRepository.saveAlbum(context.session.user.id, input),
	);

const unsaveAlbum = protectedProcedure
	.route({
		method: "DELETE",
		path: "/library/albums/save",
		tags: [Tags.LIBRARY],
	})
	.input(unsaveAlbumRequestSchema)
	.handler(async ({ context, input }) =>
		libraryRepository.unsaveAlbum(context.session.user.id, input),
	);

const getExplore = protectedProcedure
	.route({
		method: "GET",
		path: "/library/explore",
		tags: [Tags.LIBRARY],
	})
	.input(getExploreRequestSchema)
	.handler(async ({ context, input }) =>
		libraryRepository.getExploreSections(context.session.user.id, input),
	);

export const libraryRouter = {
	getLibrary,
	getPlaylists,
	getPlaylistById,
	createPlaylist,
	addTrackToPlaylist,
	removeTrackFromPlaylist,
	saveAlbum,
	unsaveAlbum,
	getExplore,
};
