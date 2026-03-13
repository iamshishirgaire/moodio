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
		name: Tags.ARTIST,
		description: "Artist related endpoints",
	},
	{
		name: Tags.SEARCH,
		description: "Search related endpoints",
	},
	{
		name: Tags.RECOMMENDATIONS,
		description: "Recommendation related endpoints",
	},
	{
		name: Tags.ACTIONS,
		description: "User actions related endpoints",
	},
	{
		name: Tags.LIBRARY,
		description: "Library related endpoints",
	},
	{
		name: Tags.HISTORY,
		description: "Play history related endpoints",
	},
	{
		name: Tags.HEALTH_CHECK,
		description: "Health check related endpoints",
	},
];
