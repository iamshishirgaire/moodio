import { Ionicons } from "@expo/vector-icons";
import { useCallback } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import DraggableFlatList, {
	type RenderItemParams,
	ScaleDecorator,
} from "react-native-draggable-flatlist";
import { theme } from "@/constants/theme";
import { type TPlayerTrack, useMusicPlayer } from "@/store/player/player";

export default function QueuePage() {
	const { queue, queueIndex, skipTo, reorderQueue } = useMusicPlayer();

	const renderItem = useCallback(
		({ item, drag, isActive, getIndex }: RenderItemParams<TPlayerTrack>) => {
			const index = getIndex();
			const isPlaying = index === queueIndex;

			return (
				<ScaleDecorator>
					<TouchableOpacity
						activeOpacity={0.8}
						disabled={isActive}
						onLongPress={drag}
						onPress={() => index !== undefined && skipTo(index)}
						style={[
							styles.rowItem,
							{
								backgroundColor:
									isActive === true
										? theme.colors.surfaceTertiary
										: "transparent",
							},
						]}
					>
						<View style={styles.trackInfo}>
							<Image
								source={{ uri: item.albumArtwork?.[0]?.url }}
								style={styles.artwork}
							/>
							<View style={styles.textContainer}>
								<Text
									numberOfLines={1}
									style={[
										styles.trackName,
										isPlaying === true && styles.playingText,
									]}
								>
									{item.name}
								</Text>
								<Text style={styles.artistName}>
									{item.artists.map((a) => a.name).join(", ")}
								</Text>
							</View>
						</View>
						{/* Reorder Handle */}
						<TouchableOpacity onLongPress={drag} style={styles.dragHandle}>
							<Ionicons
								color={theme.colors.textSecondary}
								name="menu-outline"
								size={18}
							/>
						</TouchableOpacity>
					</TouchableOpacity>
				</ScaleDecorator>
			);
		},
		[queueIndex, skipTo]
	);

	return (
		<View style={styles.container}>
			<View style={styles.header}>
				<Text style={styles.headerTitle}>Queue</Text>
				<Text style={styles.subTitle}>Playing Liked Songs</Text>
			</View>

			<DraggableFlatList
				containerStyle={styles.listContainer}
				data={queue}
				keyExtractor={(item) => item.id}
				onDragEnd={({ from, to }) => reorderQueue(from, to)}
				renderItem={renderItem}
				showsVerticalScrollIndicator={false}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingTop: theme.spacing.xl,
		backgroundColor: theme.colors.background,
	},
	header: {
		padding: 20,
		paddingTop: 10,
		paddingBottom: 16,
	},
	headerTitle: {
		color: theme.colors.textSecondary,
		fontSize: 22,
		fontWeight: "bold",
	},
	subTitle: {
		color: theme.colors.textSecondary,
		fontSize: 14,
		marginTop: 4,
	},
	listContainer: {
		flex: 1,
	},
	rowItem: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		paddingVertical: 10,
		paddingHorizontal: 20,
	},
	trackInfo: {
		flexDirection: "row",
		alignItems: "center",
		flex: 1,
	},
	artwork: {
		width: 48,
		height: 48,
		borderRadius: 4,
	},
	textContainer: {
		marginLeft: 12,
		flex: 1,
	},
	trackName: {
		color: theme.colors.textSecondary,
		fontSize: 16,
		fontWeight: "500",
	},
	playingText: {
		color: theme.colors.textSecondary,
	},
	artistName: {
		color: theme.colors.textTertiary,
		fontSize: 14,
	},
	dragHandle: {
		paddingLeft: 10,
	},
});
