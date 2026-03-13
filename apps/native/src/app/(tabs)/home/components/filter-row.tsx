import type React from "react";
import { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { FilterPill } from "../../../../components/ui/filter-pill";
import { theme } from "../../../../constants/theme";

const filterOptions = [
	"All",
	"Music",
	"Podcasts",
	"Live",
	"Made for you",
	"New releases",
	"Pop",
	"Hip Hop",
];

const FilterRow: React.FC = () => {
	const [activeFilter, setActiveFilter] = useState("All");

	return (
		<View>
			<ScrollView
				contentContainerStyle={styles.scrollContent}
				horizontal
				showsHorizontalScrollIndicator={false}
			>
				{filterOptions.map((filter) => (
					<FilterPill
						isActive={activeFilter === filter}
						key={filter}
						onPress={() => setActiveFilter(filter)}
						title={filter}
					/>
				))}
			</ScrollView>
		</View>
	);
};

const styles = StyleSheet.create({
	scrollContent: {
		paddingHorizontal: theme.spacing.lg,
		gap: theme.spacing.sm,
	},
});

export default FilterRow;
