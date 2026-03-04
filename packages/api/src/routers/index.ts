import type { RouterClient } from "@orpc/server";
import { albumRouter } from "../features/album/router";
import { artistRouter } from "../features/artist/router";
import { healthRouter } from "../features/health/router";
import { searchRouter } from "../features/search/router";
import { recommendationRouter } from "../features/recommendations/router";
import { actionsRouter } from "../features/actions/router";
import { libraryRouter } from "../features/library/router";

export const appRouter = {
  healthCheck: healthRouter,
  album: albumRouter,
  artist: artistRouter,
  search: searchRouter,
  recommendation: recommendationRouter,
  actions: actionsRouter,
  library: libraryRouter,
};
export type AppRouter = typeof appRouter;
export type AppRouterClient = RouterClient<typeof appRouter>;
