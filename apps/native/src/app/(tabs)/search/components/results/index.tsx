import type { SearchResult } from "@moodio/api/features/search/schema";

import { useRouter } from "expo-router";
import type React from "react";
import { FlatList, Pressable, View } from "react-native";
import { Text } from "@/components/ui/text";

type SearchResultsProps = {
	results: SearchResult;
};
type AlbumItem = SearchResult["albums"][number];
type ArtistItem = SearchResult["artists"][number];
type TrackItem = SearchResult["tracks"][number];
type PlaylistItem = SearchResult["playlists"][number];

export type SearchItem = AlbumItem | ArtistItem | TrackItem | PlaylistItem;

export const SearchResults: React.FC<SearchResultsProps> = ({ results }) => {
	const router = useRouter();

	const handleItemPress = (item: SearchItem) => {
		router.push({
			pathname: "/(tabs)/search/details",
			params: { item: JSON.stringify(item) },
		});
	};

	const renderItem = ({ item }: { item: SearchItem }) => (
		<View style={{ padding: 10 }}>
			<Pressable onPress={() => handleItemPress(item)}>
				<Text>{item.name}</Text>
			</Pressable>
		</View>
	);

	const allResults: SearchItem[] = [
		...results.albums,
		...results.artists,
		...results.tracks,
		...results.playlists,
	];

	return (
		<FlatList
			data={allResults}
			keyExtractor={(item) => item.id}
			renderItem={renderItem}
		/>
	);
};
