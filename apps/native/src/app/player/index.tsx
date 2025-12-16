import { IconDots } from "@tabler/icons-react-native";
import { BlurView } from "expo-blur";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import {
	Dimensions,
	ImageBackground,
	Platform,
	ScrollView,
	StatusBar,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import Animated, {
	Extrapolation,
	interpolate,
	useAnimatedProps,
	useAnimatedScrollHandler,
	useAnimatedStyle,
	useSharedValue,
} from "react-native-reanimated";
import { Icon } from "@/components/ui/icon";
import { IconButton } from "@/components/ui/icon-button";
import { theme } from "@/constants/theme";
import { useAlbumStore } from "@/store/home/album";
import { useMusicPlayer } from "@/store/player/player";
import DeviceAndQueueControl from "./components/device-and-queue-control";
import { PlaybackControls } from "./components/playback-control";
import SeekBar from "./components/seekbar";
import TrackInfo from "./components/track-info";

const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);
const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

const HEADER_HEIGHT = 44;
const IMAGE_SIZE = Dimensions.get("window").width - 30;

export default function PlayerPage() {
	const album = useAlbumStore((s) => s.current);
	const scrollY = useSharedValue(0);
	const router = useRouter();

	// Music player state
	const {
		currentTrack,
		playbackState,
		position,
		duration,
		seekTo,
		initializePlayer,
		updateLockScreen,
	} = useMusicPlayer();

	// Initialize player on mount
	// biome-ignore lint/correctness/useExhaustiveDependencies: <>
	useEffect(() => {
		initializePlayer();
	}, []);

	// Update lock screen controls
	// biome-ignore lint/correctness/useExhaustiveDependencies: <>
	useEffect(() => {
		if (currentTrack) {
			updateLockScreen(true);
		}
		return () => {
			updateLockScreen(false);
		};
	}, [currentTrack]);

	const scrollHandler = useAnimatedScrollHandler({
		onScroll: (event) => {
			scrollY.value = event.contentOffset.y;
		},
	});

	const headerTitleAnimatedStyle = useAnimatedStyle(() => {
		const opacity = interpolate(
			scrollY.value,
			[IMAGE_SIZE - 100, IMAGE_SIZE - 50],
			[0, 1],
			Extrapolation.CLAMP
		);

		return {
			opacity,
		};
	});

	const headerBlurAnimatedProps = useAnimatedProps(() => {
		const intensity = interpolate(
			scrollY.value,
			[0, 100],
			[0, 80],
			Extrapolation.CLAMP
		);

		return {
			intensity,
		};
	});

	const imageAnimatedStyle = useAnimatedStyle(() => {
		const scale = interpolate(
			scrollY.value,
			[-100, 0],
			[1.5, 1],
			Extrapolation.CLAMP
		);

		const translateY = interpolate(
			scrollY.value,
			[-100, 0],
			[-50, 0],
			Extrapolation.CLAMP
		);

		return {
			transform: [{ scale }, { translateY }],
		};
	});

	if (!album) {
		return (
			<View style={styles.center}>
				<Text style={styles.emptyText}>No album selected.</Text>
			</View>
		);
	}

	const releaseYear = album.releaseDate.split("-")[0];

	return (
		<View style={styles.container}>
			<StatusBar barStyle="dark-content" />

			{/* Background Image with Blur */}
			<ImageBackground
				blurRadius={90}
				source={{ uri: album.images[0].url }}
				style={styles.backgroundImage}
				tintColor={"white"}
			>
				<BlurView intensity={85} style={styles.backgroundBlur} tint="light" />
			</ImageBackground>

			{/* Fixed Header */}
			<View style={styles.header}>
				<AnimatedBlurView
					animatedProps={headerBlurAnimatedProps}
					style={styles.headerBlur}
					tint="light"
				>
					<View style={styles.headerContent}>
						<TouchableOpacity
							onPress={() => {
								router.back();
							}}
							style={styles.headerButton}
						>
							<Icon
								color={theme.colors.textSecondary}
								icon="chevron-down"
								size={22}
							/>
						</TouchableOpacity>
						<Animated.Text
							numberOfLines={1}
							style={[styles.headerTitle, headerTitleAnimatedStyle]}
						>
							{currentTrack?.name || album.name}
						</Animated.Text>

						<IconButton
							onPress={() => {
								console.log("More");
							}}
						>
							<IconDots />
						</IconButton>
					</View>
				</AnimatedBlurView>
			</View>

			<AnimatedScrollView
				contentContainerStyle={styles.scrollContent}
				onScroll={scrollHandler}
				scrollEventThrottle={16}
				showsVerticalScrollIndicator={false}
				style={styles.scrollView}
			>
				{/* Album Cover */}
				<View style={styles.coverContainer}>
					<Animated.View style={imageAnimatedStyle}>
						<Animated.Image
							source={{
								uri: currentTrack?.albumArtwork[0]?.url || album.images[0].url,
							}}
							style={styles.cover}
						/>
					</Animated.View>
				</View>

				{/* Track Info */}
				{currentTrack ? (
					<View style={styles.trackInfoContainer}>
						<TrackInfo
							artists={currentTrack.artists.map((a) => a.name)}
							isLiked={false}
							onLike={() => {
								console.log("Toggle like");
							}}
							onMore={() => {
								console.log("Show more options");
							}}
							title={currentTrack.name}
						/>
					</View>
				) : (
					<View style={styles.infoContainer}>
						<Text style={styles.albumName}>{album.name}</Text>
						<Text style={styles.albumMeta}>
							{album.albumType.charAt(0).toUpperCase() +
								album.albumType.slice(1)}{" "}
							· {releaseYear}
						</Text>
						{album.genres !== null && album.genres.length > 0 && (
							<Text style={styles.genres}>{album.genres.join(", ")}</Text>
						)}
					</View>
				)}

				{/* Seek Bar */}
				<View style={styles.seekBarContainer}>
					<SeekBar
						currentTime={position}
						duration={duration}
						isBuffering={playbackState === "buffering"}
						onSeek={seekTo}
					/>
				</View>

				{/* Playback Controls */}
				<View style={styles.controlsContainer}>
					<PlaybackControls />
				</View>
				<View style={styles.controlsContainer}>
					<DeviceAndQueueControl />
				</View>

				<View style={styles.bottomSpacing} />
			</AnimatedScrollView>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: theme.colors.background,
	},
	backgroundBlur: {
		flex: 1,
		backgroundColor: "rgba(255, 255, 255, 0.7)",
	},
	backgroundImage: {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		width: "100%",
		height: "100%",
	},

	center: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: theme.colors.background,
	},
	emptyText: {
		color: theme.colors.textSecondary,
		fontSize: theme.typography.fontSizes.md,
	},
	header: {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		zIndex: 100,
		height: HEADER_HEIGHT + (Platform.OS === "ios" ? 44 : 0),
	},
	headerBlur: {
		flex: 1,
		paddingTop: Platform.OS === "ios" ? 44 : 0,
	},
	headerContent: {
		flex: 1,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		paddingHorizontal: theme.spacing.md,
	},
	headerButton: {
		width: 44,
		height: 44,
		justifyContent: "center",
		alignItems: "center",
	},
	headerTitle: {
		flex: 1,
		color: theme.colors.textSecondary,
		fontSize: theme.typography.fontSizes.lg,
		fontWeight: theme.typography.fontWeights.semibold,
		textAlign: "center",
		marginHorizontal: theme.spacing.sm,
	},
	scrollView: {
		flex: 1,
	},
	scrollContent: {
		paddingTop: Platform.OS === "ios" ? 88 : 44,
	},
	coverContainer: {
		alignItems: "center",
		paddingTop: theme.spacing.lg,
		paddingBottom: theme.spacing.xl,
	},
	cover: {
		width: IMAGE_SIZE,
		height: IMAGE_SIZE,
		borderRadius: theme.borderRadius.md,
		...theme.shadows.large,
	},
	trackInfoContainer: {
		marginBottom: theme.spacing.lg,
	},
	infoContainer: {
		paddingHorizontal: theme.spacing.lg,
		alignItems: "center",
		marginBottom: theme.spacing.lg,
	},
	albumName: {
		fontSize: theme.typography.fontSizes.xxl,
		fontWeight: theme.typography.fontWeights.bold,
		color: theme.colors.textSecondary,
		textAlign: "center",
		marginBottom: theme.spacing.xs,
	},
	albumMeta: {
		fontSize: theme.typography.fontSizes.sm,
		color: theme.colors.textTertiary,
		marginBottom: theme.spacing.xs,
	},
	genres: {
		fontSize: theme.typography.fontSizes.xs,
		color: theme.colors.textTertiary,
		textTransform: "capitalize",
	},
	seekBarContainer: {
		marginBottom: theme.spacing.lg,
	},
	controlsContainer: {
		marginBottom: theme.spacing.sm,
	},
	volumeContainer: {
		marginBottom: theme.spacing.xl,
	},
	bottomSpacing: {
		height: 100,
	},
});
