import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import { FlatList, Image, Pressable, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "@/components/ui/text";
import { theme } from "@/constants/theme";
import { type TPlayerTrack, useMusicPlayer } from "@/store/player/player";
import { orpc } from "@/utils/orpc";

export default function PlaylistDetailsPage() {
	const router = useRouter();
	const { id } = useLocalSearchParams<{ id: string }>();
	const { setQueue } = useMusicPlayer();

	const { data, isLoading } = useQuery(
		orpc.library.getPlaylistById.queryOptions({
			input: { playlistId: id },
		}),
	);

	if (isLoading) {
		return (
			<SafeAreaView style={styles.container}>
				<View style={styles.centerWrap}>
					<Text color="subtle">Loading playlist...</Text>
				</View>
			</SafeAreaView>
		);
	}

	if (!data) {
		return (
			<SafeAreaView style={styles.container}>
				<View style={styles.centerWrap}>
					<Text color="subtle">Playlist not found.</Text>
				</View>
			</SafeAreaView>
		);
	}

	const tracks = data.tracks as TPlayerTrack[];

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.header}>
				<Pressable onPress={() => router.back()}>
					<Text style={styles.backText}>Back</Text>
				</Pressable>
				<Text style={styles.title}>{data.playlist.name}</Text>
				<Text style={styles.subtitle}>{tracks.length} songs</Text>
			</View>

			<FlatList
				data={tracks}
				keyExtractor={(item) => item.id}
				renderItem={({ item, index }) => (
					<Pressable
						onPress={() => setQueue(tracks, index)}
						style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
					>
						{item.albumArtwork?.[0]?.url ? (
							<Image
								source={{ uri: item.albumArtwork[0].url }}
								style={styles.image}
							/>
						) : (
							<View style={[styles.image, styles.imagePlaceholder]}>
								<Text color="subtle">♪</Text>
							</View>
						)}
						<View style={styles.textWrap}>
							<Text numberOfLines={1}>{item.name}</Text>
							<Text color="subtle" numberOfLines={1} size="sm">
								{item.artists.map((artist) => artist.name).join(", ")}
							</Text>
						</View>
					</Pressable>
				)}
			/>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: theme.colors.background,
	},
	header: {
		paddingHorizontal: theme.spacing.md,
		paddingTop: theme.spacing.sm,
		paddingBottom: theme.spacing.md,
	},
	backText: {
		color: theme.colors.primary,
		fontWeight: "600",
		marginBottom: theme.spacing.xs,
	},
	title: {
		fontSize: 24,
		fontWeight: "700",
		color: theme.colors.textPrimary,
	},
	subtitle: {
		marginTop: 2,
		color: theme.colors.textSecondary,
	},
	centerWrap: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
	},
	row: {
		flexDirection: "row",
		alignItems: "center",
		paddingHorizontal: theme.spacing.md,
		paddingVertical: theme.spacing.xs,
	},
	rowPressed: {
		backgroundColor: theme.colors.backgroundSecondary,
	},
	image: {
		width: 52,
		height: 52,
		borderRadius: 6,
		backgroundColor: theme.colors.backgroundSecondary,
	},
	imagePlaceholder: {
		alignItems: "center",
		justifyContent: "center",
	},
	textWrap: {
		flex: 1,
		marginLeft: theme.spacing.sm,
	},
});
