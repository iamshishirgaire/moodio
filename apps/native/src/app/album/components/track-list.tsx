import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import PlayingIndicator from "@/app/player/components/bars-visualizer";
import { Icon } from "@/components/ui/icon";
import { IconButton } from "@/components/ui/icon-button";
import { Text } from "@/components/ui/text";
import { theme } from "@/constants/theme";
import { type TPlayerTrack, useMusicPlayer } from "@/store/player/player";
import { orpc } from "@/utils/orpc";
import Explicit from "./explicit";

type TrackListProps = {
	albumId: string;
	albumArtwork: TPlayerTrack["albumArtwork"];
};

export default function TrackList({ albumId, albumArtwork }: TrackListProps) {
	const { data } = useQuery(
		orpc.album.getTracksById.queryOptions({
			input: {
				albumId,
			},
		})
	);

	const { setQueue, currentTrack, playbackState, initializePlayer, queue } =
		useMusicPlayer();

	const [showPlayAll, setShowPlayAll] = useState(true);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <>
	useEffect(() => {
		initializePlayer();
	}, []);

	const handleTrackPress = async (trackIndex: number) => {
		if (!data || data.length === 0) {
			return;
		}

		const tracks: TPlayerTrack[] = data.map((track) => ({
			...track,
			albumArtwork,
		}));

		await setQueue(tracks, trackIndex);
		setShowPlayAll(false);
	};

	const isTrackPlaying = (trackId: string) =>
		currentTrack?.id === trackId && playbackState === "playing";

	const isCurrentTrack = (trackId: string) => currentTrack?.id === trackId;

	if (!data || data.length === 0) {
		return <View />;
	}

	const hasCurrentAlbumInQueue = queue.some(
		(track) => track.albumId === albumId
	);

	return (
		<Animated.View entering={FadeIn} style={styles.trackListContainer}>
			{/* Play All Header */}
			{(showPlayAll === true || hasCurrentAlbumInQueue === true) && (
				<Animated.View
					entering={FadeInDown.delay(100)}
					style={styles.playAllHeader}
				>
					<View style={styles.playAllInfo}>
						<Text style={styles.trackCount}>
							{data.length} {data.length === 1 ? "song" : "songs"}
						</Text>
					</View>
				</Animated.View>
			)}

			{data.map((d, idx) => {
				const isCurrent = isCurrentTrack(d.id);
				const isPlaying = isTrackPlaying(d.id);

				return (
					<Animated.View entering={FadeInDown.delay(idx * 50)} key={d.id}>
						<TouchableOpacity
							activeOpacity={0.7}
							onPress={() => handleTrackPress(idx)}
							style={[styles.trackRow]}
						>
							{/* Track Info */}
							<View style={styles.trackInfo}>
								<View style={styles.trackNameContainer}>
									<View
										style={{
											flex: 1,
											flexDirection: "column",
										}}
									>
										<Text
											color={isCurrent === true ? "brand" : "secondary"}
											ellipsizeMode="tail"
											numberOfLines={1}
										>
											{d.name}
										</Text>
										<View
											style={{
												flex: 1,
												flexDirection: "row",
												alignItems: "center",
												gap: 4,
											}}
										>
											<View
												style={{
													height: 16,
													width: 16,
													borderRadius: 8,
													backgroundColor: theme.colors.primary,
													display: "flex",
													alignItems: "center",
													justifyContent: "center",
												}}
											>
												<Icon icon="arrow-down" size={10} />
											</View>
											{d.explicit === true ? <Explicit /> : null}
											<Text
												color={"subtle"}
												ellipsizeMode="tail"
												numberOfLines={1}
												size="sm"
												weight="medium"
											>
												{d.artists.map((a) => a.name).join(", ")}
											</Text>
										</View>
									</View>

									<PlayingIndicator isPlaying={isPlaying} />
								</View>
							</View>

							{/* More Options */}
							<IconButton
								onPress={() => {
									console.log("");
								}}
							>
								<Icon
									color={
										isCurrent ? theme.colors.primary : theme.colors.textTertiary
									}
									icon="ellipsis-horizontal"
									size={18}
								/>
							</IconButton>
						</TouchableOpacity>
					</Animated.View>
				);
			})}
		</Animated.View>
	);
}

const styles = StyleSheet.create({
	trackListContainer: {
		paddingHorizontal: theme.spacing.lg,
		marginTop: theme.spacing.sm,
		paddingBottom: theme.spacing.xl,
	},

	playAllHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: theme.spacing.md,
		paddingHorizontal: theme.spacing.xs,
	},
	playAllInfo: {
		flexDirection: "row",
		alignItems: "center",
		gap: theme.spacing.xs,
	},
	trackCount: {
		fontSize: theme.typography.fontSizes.sm,
		fontWeight: theme.typography.fontWeights.semibold,
		color: theme.colors.textSecondary,
	},

	trackRow: {
		flexDirection: "row",
		alignItems: "center",
		paddingVertical: theme.spacing.sm,
		gap: theme.spacing.md,
		paddingHorizontal: theme.spacing.md,
	},

	trackNumberContainer: {
		width: 24,
		alignItems: "center",
		justifyContent: "center",
	},
	trackNumber: {
		fontSize: theme.typography.fontSizes.sm,
		color: theme.colors.textTertiary,
		textAlign: "center",
		fontWeight: theme.typography.fontWeights.medium,
	},
	trackNumberActive: {
		color: theme.colors.primary,
		fontWeight: theme.typography.fontWeights.bold,
	},
	playingIndicator: {
		flexDirection: "row",
		alignItems: "flex-end",
		gap: 2,
		height: 16,
	},

	trackInfo: {
		flex: 1,
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	trackNameContainer: {
		flexDirection: "row",
		alignItems: "center",
		gap: theme.spacing.sm,
		flex: 1,
	},
	trackName: {
		fontSize: theme.typography.fontSizes.md,
		color: theme.colors.textTertiary,
		fontWeight: theme.typography.fontWeights.regular,
		overflow: "hidden",
		flex: 1,
	},

	explicitBadge: {
		backgroundColor: theme.colors.textTertiary,
		paddingHorizontal: 4,
		paddingVertical: 2,
		borderRadius: 2,
		marginVertical: 4,
	},
	explicitText: {
		fontSize: 8,
		fontWeight: theme.typography.fontWeights.bold,
		color: theme.colors.background,
	},
	trackDuration: {
		fontSize: theme.typography.fontSizes.sm,
		color: theme.colors.textTertiary,
	},
	trackMore: {
		width: 32,
		height: 32,
		justifyContent: "center",
		alignItems: "center",
	},
});
