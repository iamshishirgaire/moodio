import { Image } from "expo-image";
import { View } from "react-native";
import { Text } from "@/components/ui/text";
import { theme } from "@/constants/theme";
import fakeData from "./fakedata";

export default function SearchResult({ query }: { query: string }) {
	return (
		<View style={styles.container}>
			{fakeData
				.filter((item) =>
					item.title?.toLowerCase().includes(query?.toLowerCase())
				)
				.map((item) => (
					<View
						key={item.id}
						style={{
							flexDirection: "row",
							alignItems: "flex-start",
							padding: theme.spacing.md,
							gap: theme.spacing.md,
						}}
					>
						<Image
							contentFit="cover"
							source={{ uri: item.imageUrl }}
							style={styles.avatar}
						/>
						<View style={styles.textContainer}>
							<Text numberOfLines={1} style={styles.itemTitle}>
								{item.title}
							</Text>
							<Text
								color="secondary"
								numberOfLines={1}
								style={styles.itemSubtitle}
							>
								{item.subtitle ||
									item.type.charAt(0).toUpperCase() + item.type.slice(1)}
							</Text>
						</View>
					</View>
				))}
		</View>
	);
}

const styles = {
	container: {
		paddingVertical: theme.spacing.md,
	},

	avatar: {
		width: 50,
		height: 50,
		borderRadius: 25,
		backgroundColor: theme.colors.surfaceSecondary,
	},
	textContainer: {
		flex: 1,
	},
	itemTitle: {
		fontSize: theme.typography.fontSizes.md,
		marginBottom: 2,
	},
	itemSubtitle: {
		fontSize: theme.typography.fontSizes.sm,
	},
};
