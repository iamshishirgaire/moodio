import type { RouterClient } from "@orpc/server";
import { albumRouter } from "../features/album/router";
import { artistRouter } from "../features/artist/router";
import { healthRouter } from "../features/health/router";
import { searchRouter } from "../features/search/router";
import { recommendationRouter } from "../features/recommendations/router";

export const appRouter = {
  healthCheck: healthRouter,
  album: albumRouter,
  artist: artistRouter,
  search: searchRouter,
  recommendation: recommendationRouter,
};
export type AppRouter = typeof appRouter;
export type AppRouterClient = RouterClient<typeof appRouter>;
