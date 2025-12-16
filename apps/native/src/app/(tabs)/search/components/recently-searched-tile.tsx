import { Image } from "expo-image";
import { Dimensions, View } from "react-native";
import { Text } from "@/components/ui/text";
import { theme } from "@/constants/theme";
import fakeData from "./fakedata";

export type RecentlySearchedTileProps = {
	id: string;
	title: string;
	type: "artist" | "album" | "track";
	imageUrl: string;
	subtitle?: string;
};

export default function RecentlySearchedTile() {
	return (
		<View style={styles.container}>
			<Text
				color={"secondary"}
				size="lg"
				style={{
					paddingHorizontal: theme.spacing.md,
					paddingVertical: theme.spacing.md,
				}}
				weight="bold"
			>
				Recent Searches
			</Text>
			{fakeData.map((item) => (
				<View
					key={item.id}
					style={{
						flexDirection: "row",
						alignItems: "center",
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
						<Text color="secondary" style={styles.itemTitle}>
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
		flex: 1,
		width: Dimensions.get("screen").width - 40,
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
