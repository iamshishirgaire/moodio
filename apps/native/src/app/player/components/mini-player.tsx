import {
	IconDevices,
	IconPlayerPauseFilled,
	IconPlayerPlayFilled,
} from "@tabler/icons-react-native";
import { BlurView } from "expo-blur";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import {
	ImageBackground,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import Animated, {
	useAnimatedStyle,
	useSharedValue,
	withTiming,
} from "react-native-reanimated";
import { Icon } from "@/components/ui/icon";
import { IconButton } from "@/components/ui/icon-button";
import { theme } from "@/constants/theme";
import { useMusicPlayer } from "@/store/player/player";

const MINI_PLAYER_HEIGHT = 64;
const BOTTOM_TAB_HEIGHT = 90; // Adjust based on your tab bar height
const PLAYER_BOTTOM_OFFSET = BOTTOM_TAB_HEIGHT + 8; // 8px gap

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);
const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export default function MiniPlayer() {
	const router = useRouter();
	const { currentTrack, playbackState, position, duration, togglePlayPause } =
		useMusicPlayer();

	const translateY = useSharedValue(200); // Start off-screen
	const opacity = useSharedValue(0);
	const scale = useSharedValue(0.95);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <>
	useEffect(() => {
		if (currentTrack) {
			translateY.value = withTiming(0);
			opacity.value = withTiming(1, { duration: 300 });
			scale.value = withTiming(1);
		} else {
			translateY.value = withTiming(200);
			opacity.value = withTiming(0, { duration: 200 });
			scale.value = withTiming(0.95);
		}
	}, [currentTrack]);

	const navigateToPlayer = () => {
		router.push("/player");
	};

	const progressStyle = useAnimatedStyle(() => {
		const progress = duration > 0 ? position / duration : 0;
		return {
			width: `${progress * 100}%`,
		};
	});

	if (!currentTrack) {
		return null;
	}

	const isPlaying = playbackState === "playing";

	const artworkUrl = currentTrack?.albumArtwork[0]?.url || "";

	return (
		<AnimatedTouchable
			activeOpacity={0.95}
			onPress={navigateToPlayer}
			style={[styles.container]}
		>
			{/* Background with blur */}
			<ImageBackground
				blurRadius={100}
				source={{ uri: artworkUrl }}
				style={styles.backgroundImage}
			>
				<AnimatedBlurView
					intensity={80}
					style={styles.blurContainer}
					tint="light"
				>
					<Animated.View style={[styles.progressBar, progressStyle]} />

					{/* Content */}
					<View style={styles.content}>
						<View style={styles.artworkContainer}>
							{artworkUrl ? (
								<Image source={{ uri: artworkUrl }} style={styles.artwork} />
							) : (
								<View style={[styles.artwork, styles.artworkPlaceholder]}>
									<Icon icon="play" />
								</View>
							)}
						</View>

						{/* Track info */}
						<View style={styles.trackInfo}>
							<Text numberOfLines={1} style={styles.trackTitle}>
								{currentTrack.name}
							</Text>
							<Text numberOfLines={1} style={styles.trackArtist}>
								{currentTrack.artists.length === 0
									? currentTrack.artists[0].name
									: currentTrack.artists.map((a) => `${a.name},`)}
							</Text>
						</View>

						{/* Controls */}
						<View style={styles.controls}>
							<IconButton>
								<IconDevices size={22} />
							</IconButton>
							<IconButton onPress={togglePlayPause}>
								{isPlaying ? (
									<IconPlayerPauseFilled size={22} />
								) : (
									<IconPlayerPlayFilled size={22} />
								)}
							</IconButton>
						</View>
					</View>
				</AnimatedBlurView>
			</ImageBackground>
		</AnimatedTouchable>
	);
}

const styles = StyleSheet.create({
	container: {
		position: "absolute",
		bottom: PLAYER_BOTTOM_OFFSET,
		left: theme.spacing.sm,
		right: theme.spacing.sm,
		height: MINI_PLAYER_HEIGHT,
		borderRadius: theme.borderRadius.lg,
		overflow: "hidden",
		...theme.shadows.large,
	},
	backgroundImage: {
		flex: 1,
		width: "100%",
		height: "100%",
	},
	blurContainer: {
		flex: 1,
		backgroundColor: "rgba(255, 255, 255, 0.8)",
	},
	progressBar: {
		position: "absolute",
		top: 0,
		left: 0,
		height: 2,
		backgroundColor: theme.colors.surfaceSecondary,
		zIndex: 10,
	},
	content: {
		flex: 1,
		flexDirection: "row",
		alignItems: "center",
		paddingHorizontal: theme.spacing.sm,
		paddingVertical: theme.spacing.xs,
		gap: theme.spacing.sm,
	},
	artworkContainer: {
		width: 48,
		height: 48,
	},
	artwork: {
		width: 48,
		height: 48,
		borderRadius: theme.borderRadius.sm,
		overflow: "hidden",
		justifyContent: "center",
		alignItems: "center",
	},

	artworkOverlay: {
		...StyleSheet.absoluteFillObject,
		backgroundColor: "rgba(0, 0, 0, 0.1)",
	},
	artworkPlaceholder: {
		backgroundColor: theme.colors.surface,
	},
	trackInfo: {
		flex: 1,
		justifyContent: "center",
		gap: 2,
	},
	trackTitle: {
		fontSize: theme.typography.fontSizes.sm,
		fontWeight: theme.typography.fontWeights.semibold,
		color: theme.colors.textSecondary,
	},
	trackArtist: {
		fontSize: theme.typography.fontSizes.xs,
		color: theme.colors.textTertiary,
	},
	controls: {
		flexDirection: "row",
		alignItems: "center",
		gap: theme.spacing.xs,
	},
	controlButton: {
		width: 40,
		height: 40,
		justifyContent: "center",
		alignItems: "center",
	},
});
