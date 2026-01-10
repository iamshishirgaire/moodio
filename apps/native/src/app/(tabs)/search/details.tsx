/** biome-ignore-all lint/nursery/noLeakedRender: <> */
import { useLocalSearchParams } from "expo-router";
import { View } from "react-native";
import { Text } from "@/components/ui/text";
import type { SearchItem } from "./components/results";

const SearchDetails = () => {
	const { item: itemString } = useLocalSearchParams();
	const item: SearchItem = JSON.parse(itemString as string);

	return (
		<View style={{ flex: 1, padding: 20 }}>
			<Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 10 }}>
				{item.name}
			</Text>

			{"albumType" in item && <Text>Album Type: {item.albumType}</Text>}
			{"followers" in item && <Text>Followers: {item.followers}</Text>}
			{"durationMs" in item && (
				<Text>Duration: {item.durationMs / 1000} seconds</Text>
			)}
			{"description" in item && <Text>Description: {item.description}</Text>}
		</View>
	);
};

export default SearchDetails;
