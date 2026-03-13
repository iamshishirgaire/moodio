import { protectedProcedure } from "../..";
import { Tags } from "../../utils/tags";
import { findAllPaginated } from "./repository/find-all";
import { getRecommendationRequest } from "./schema";

const getAll = protectedProcedure
  .route({
    method: "GET",
    path: "/recommendations",
    tags: [Tags.RECOMMENDATIONS],
  })
  .input(getRecommendationRequest)
  .handler(async ({ context }) => findAllPaginated(context.session.user.id));

export const recommendationRouter = {
  getAll,
};
