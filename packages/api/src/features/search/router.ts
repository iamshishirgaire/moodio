import { os } from "@orpc/server";
import { z } from "zod";
import { Tags } from "../../utils/tags";
import { searchRepository } from "./repository";
import { searchResultSchema } from "./schema";

export const searchAll = os
	.route({
		method: "GET",
		path: "/search",
		tags: [Tags.SEARCH],
	})
	.input(z.object({ query: z.string() }))
	.output(searchResultSchema)
	.handler(async ({ input }) => await searchRepository.searchAll(input.query));

export const searchTrack = os
	.route({
		method: "GET",
		path: "/search-track",
		tags: [Tags.SEARCH],
	})
	.input(z.object({ query: z.string() }))
	// .output(searchTrackResultSchema)
	.handler(async ({ input }) => await searchRepository.searchAll(input.query));


export const searchRouter = {
  searchAll: searchAll,
  searchTrack:searchTrack
}
