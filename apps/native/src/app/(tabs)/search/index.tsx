import { useLocalSearchParams } from "expo-router";
import { ScrollView, StyleSheet, View } from "react-native";
import { Text } from "@/components/ui/text";
import { theme } from "@/constants/theme";
import RecentlySearchedTile from "./components/recently-searched-tile";
import SearchResult from "./components/search-result";

type ISearchSuggestion = {
	id: string;
	name: string;
};

const searchSuggestions: ISearchSuggestion[] = [
	{
		id: "1",
		name: "Georges Bizet",
	},
	{
		id: "2",
		name: "Mozart Requiem",
	},
	{
		id: "3",
		name: "Maria João Pires",
	},
	{
		id: "4",
		name: "Karajan Die Walküre",
	},
	{
		id: "5",
		name: "L109",
	},
	{
		id: "6",
		name: "Leonard Bernstein Copland Rodeo",
	},
	{
		id: "7",
		name: "Harnoncourt Mozart Requiem",
	},
	{
		id: "8",
		name: "Liszt Piano",
	},
	{
		id: "9",
		name: "Georges Bizet",
	},
	{
		id: "10",
		name: "Mozart Requiem",
	},
	{
		id: "11",
		name: "Maria João Pires",
	},
	{
		id: "12",
		name: "Karajan Die Walküre",
	},
	{
		id: "13",
		name: "L109",
	},
	{
		id: "14",
		name: "Leonard Bernstein Copland Rodeo",
	},
	{
		id: "15",
		name: "Harnoncourt Mozart Requiem",
	},
	{
		id: "16",
		name: "Liszt Piano",
	},
];

export default function SearchScreen() {
	const { query, isSearchActive } = useLocalSearchParams<{
		query: string;
		isSearchActive: string;
	}>();
	return (
		<ScrollView
			automaticallyAdjustContentInsets={true}
			contentContainerStyle={{ alignItems: "flex-start" }}
			contentInsetAdjustmentBehavior="automatic"
			scrollEventThrottle={16}
			style={[styles.container]}
		>
			{query !== "" && <SearchResult query={query} />}
			<View>
				{Number.parseInt(isSearchActive, 10) === 1 ? (
					<RecentlySearchedTile />
				) : (
					searchSuggestions.map((item) => (
						<View key={item.id} style={styles.suggestionItem}>
							<Text color="secondary" size="xl">
								{item.name}
							</Text>
						</View>
					))
				)}
			</View>
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: theme.colors.background,
		paddingHorizontal: theme.spacing.md,
	},
	listContainer: {
		paddingBottom: theme.spacing.sm,
	},
	suggestionItem: {
		paddingVertical: theme.spacing.sm,
		marginBottom: theme.spacing.sm,
	},
});
