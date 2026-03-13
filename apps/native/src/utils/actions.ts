import { client } from "@/utils/orpc";

export type UserActionType =
	| "play"
	| "skip"
	| "like"
	| "unlike"
	| "save_to_library";

export async function logUserAction(trackId: string, action: UserActionType) {
	if (!trackId) {
		return;
	}

	try {
		await client.actions.log({
			trackId,
			action,
		});
	} catch (error) {
		console.warn("Failed to log user action", { action, trackId, error });
	}
}
