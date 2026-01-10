import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { TextInputField } from "@/components/ui/text-input";
import { theme } from "@/constants/theme";
import { orpc } from "@/utils/orpc";
import { SearchResults } from "./components/results";

export default function SearchScreen() {
	const [query, setQuery] = useState("");
	const { data } = useQuery(
		orpc.search.queryOptions({
			input: { query },
		})
	);

	return (
		<View style={styles.container}>
			<TextInputField
				onChangeText={setQuery}
				placeholder="Search for albums, artists, tracks, and playlists"
				value={query}
			/>
			{data !== undefined && <SearchResults results={data} />}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: theme.colors.background,
		paddingHorizontal: theme.spacing.md,
	},
});
