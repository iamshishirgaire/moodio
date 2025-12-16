import type { RouterClient } from "@orpc/server";
import { albumRouter } from "../features/album/router";
import { healthRouter } from "../features/health/router";

export const appRouter = {
	healthCheck: healthRouter,
	album: albumRouter,
};
export type AppRouter = typeof appRouter;
export type AppRouterClient = RouterClient<typeof appRouter>;
