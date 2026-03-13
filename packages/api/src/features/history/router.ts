import { protectedProcedure } from "../..";
import { Tags } from "../../utils/tags";
import { historyRepository } from "./repository";
import { getHistoryRequestSchema, logHistoryRequestSchema } from "./schema";

const getRecent = protectedProcedure
	.route({
		method: "GET",
		path: "/history",
		tags: [Tags.HISTORY],
	})
	.input(getHistoryRequestSchema)
	.handler(async ({ context, input }) =>
		historyRepository.getRecent(context.session.user.id, input),
	);

export const historyRouter = {
	getRecent,
	log: protectedProcedure
		.route({
			method: "POST",
			path: "/history/log",
			tags: [Tags.HISTORY],
		})
		.input(logHistoryRequestSchema)
		.handler(async ({ context, input }) =>
			historyRepository.logPlay(context.session.user.id, input),
		),
};
