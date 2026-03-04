import { db } from "@moodio/db";
import { userActions } from "@moodio/db/schema/actions";
import type { TLogActionRequest } from "./schema";

export const logAction = async (userId: string, request: TLogActionRequest) => {
    const { trackId, action } = request;

  await db.insert(userActions).values({

        userId,
        trackId,
        action,
    });

    return { success: true };
}
