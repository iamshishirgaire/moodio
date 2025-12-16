import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import { Text } from "@/components/ui/text";
import { useAlbumStore } from "@/store/home/album";
import { orpc } from "@/utils/orpc";
import MusicSection from "../music-section";

export default function LatestSingles() {
	const { isLoading, data } = useQuery(
		orpc.album.getAll.queryOptions({
			input: {
				albumType: "single",
			},
		})
	);
	const { setCurrent } = useAlbumStore();

	if (!data || data === undefined || isLoading) {
		return <Text>No data Found</Text>;
	}
	return (
		<MusicSection
			items={data}
			onPress={(id: string) => {
				const album = data.find((d) => d.id === id);
				if (!album) {
					return;
				}
				setCurrent(album);
				router.push({
					pathname: "/album",
				});
			}}
			title="Latest Singles"
		/>
	);
}
