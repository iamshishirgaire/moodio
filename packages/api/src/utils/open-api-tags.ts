import { Tags } from "./tags";

type TagObject = {
	name: string;
	description?: string;
};

export const openAPITags: TagObject[] = [
	{
		name: Tags.ALBUM,
		description: "Album related endpoints",
	},
	{
		name: Tags.HEALTH_CHECK,
		description: "Health check related endpoints",
	},
];
