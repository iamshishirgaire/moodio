import { os } from "@orpc/server";
import { Tags } from "../../utils/tags";

const get = os
	.route({
		method: "GET",
		path: "/health",
		tags: [Tags.HEALTH_CHECK],
	})
	.handler(async () => "OK");

export const healthRouter = {
	health: {
		get,
	},
};
