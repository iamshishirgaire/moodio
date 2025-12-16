import { os } from "@orpc/server";
import { Tags } from "../../utils/tags";
import { findAll } from "./repository/find-all";
import { findById } from "./repository/find-by-id";
import { getTracksByAlbumId } from "./repository/tracks-by-album-id";

import { getAlbumByIdRequest, getAlbumsRequest } from "./schema";

const getAll = os
	.route({
		method: "GET",
		path: "/albums",
		tags: [Tags.ALBUM],
	})
	.input(getAlbumsRequest)
	.handler(async ({ input }) => findAll(input));

const getById = os
	.route({
		method: "GET",
		path: "/album",
		tags: [Tags.ALBUM],
	})
	.input(getAlbumByIdRequest)
	.handler(async ({ input }) => findById(input));

const getTracksById = os
	.route({
		method: "GET",
		path: "/album/tracks",
		tags: [Tags.ALBUM],
	})
	.input(getAlbumByIdRequest)
	.handler(async ({ input }) => getTracksByAlbumId(input));

export const albumRouter = {
	getAll,
	getById,
	getTracksById,
};
