import { protectedProcedure } from "../..";
import { Tags } from "../../utils/tags";
import { logAction } from "./repository";
import { logActionRequestSchema } from "./schema";

export const actionsRouter = {
    log: protectedProcedure
        .route({
            method: "POST",
            path: "/actions/log",
            tags: [Tags.ACTIONS],
        })
        .input(logActionRequestSchema)
        .handler(async ({ context, input }) => {
            await logAction(context.session.user.id, input);
            return { success: true };
        }),
};
