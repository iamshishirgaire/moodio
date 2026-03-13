import { os } from "@orpc/server";
import { Tags } from "../../utils/tags";
import { findById } from "./repository/find-by-id";
import { findPopular } from "./repository/find-popular-artist";
import { findDetailsById } from "./repository/find-details-by-id";

import { getArtistByIdRequest, getArtistPopularRequest, ArtistDetailsSchema } from "./schema";

const getPopular = os
	.route({
		method: "GET",
		path: "/artist/popular",
		tags: [Tags.ARTIST],
	})
	.input(getArtistPopularRequest)
	.handler(async ({ input }) => findPopular(input));

const getById = os
	.route({
		method: "GET",
		path: "/artist",
		tags: [Tags.ARTIST],
	})
	.input(getArtistByIdRequest)
	.handler(async ({ input }) => findById(input));

const getDetailsById = os
	.route({
		method: "GET",
		path: "/artist/details",
		tags: [Tags.ARTIST],
	})
	.input(getArtistByIdRequest)
	.output(ArtistDetailsSchema.nullable())
	.handler(async ({ input }) => findDetailsById(input));

export const artistRouter = {
	getPopular,
	getById,
	getDetailsById,
};
