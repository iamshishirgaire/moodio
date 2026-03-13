import { actionTypeEnum } from "@moodio/db/schema/actions";
import { z } from "zod";

export const logActionRequestSchema = z.object({
    trackId: z.string(),
    action: z.enum(actionTypeEnum.enumValues),
});

export type TLogActionRequest = z.infer<typeof logActionRequestSchema>;
