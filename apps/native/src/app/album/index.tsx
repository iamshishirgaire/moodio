import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import {
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
import { theme } from "@/constants/theme";
import { useAlbumStore } from "@/store/home/album";
import TrackList from "./components/track-list";

const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);
const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

const HEADER_HEIGHT = 44;
const IMAGE_SIZE = 240;

export default function AlbumPage() {
	const album = useAlbumStore((s) => s.current);
	const scrollY = useSharedValue(0);

	const router = useRouter();
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
				blurRadius={80}
				source={{ uri: album.images[0].url }}
				style={styles.backgroundImage}
			>
				<BlurView intensity={95} style={styles.backgroundBlur} tint="light" />
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
							<Ionicons
								color={theme.colors.textSecondary}
								name="chevron-back"
								size={28}
							/>
						</TouchableOpacity>
						<Animated.Text
							numberOfLines={1}
							style={[styles.headerTitle, headerTitleAnimatedStyle]}
						>
							{album.name}
						</Animated.Text>
						<TouchableOpacity style={styles.headerButton}>
							<Ionicons
								color={theme.colors.textSecondary}
								name="ellipsis-horizontal"
								size={24}
							/>
						</TouchableOpacity>
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
							source={{ uri: album.images[0].url }}
							style={styles.cover}
						/>
					</Animated.View>
				</View>

				{/* Album Info */}
				<View style={styles.infoContainer}>
					<Text style={styles.albumName}>{album.name}</Text>
					<View
						style={{
							display: "flex",
							flexDirection: "row",
							justifyContent: "center",
							alignItems: "center",
							gap: theme.spacing.sm,
						}}
					>
						{album.artistImage !== null && (
							<Image
								source={{
									uri: album.artistImage[0].url,
								}}
								style={{
									height: 24,
									width: 24,
									borderRadius: theme.borderRadius.sm,
								}}
							/>
						)}
						<Text style={styles.albumDesc}>{album.artistName}</Text>
					</View>

					<Text style={styles.albumMeta}>
						{album.albumType.charAt(0).toUpperCase() + album.albumType.slice(1)}{" "}
						· {releaseYear}
					</Text>
					{album.genres !== null && album.genres.length > 0 && (
						<Text style={styles.genres}>{album.genres.join(", ")}</Text>
					)}
				</View>

				{/* Action Buttons */}
				<View style={styles.actionsContainer}>
					<TouchableOpacity style={styles.playButton}>
						<Ionicons color={theme.colors.textPrimary} name="play" size={24} />
						<Text style={styles.playButtonText}>Play</Text>
					</TouchableOpacity>

					<TouchableOpacity style={styles.shuffleButton}>
						<Ionicons
							color={theme.colors.textSecondary}
							name="shuffle"
							size={20}
						/>
						<Text style={styles.shuffleButtonText}>Shuffle</Text>
					</TouchableOpacity>
				</View>

				{/* Secondary Actions */}
				<View style={styles.secondaryActions}>
					<TouchableOpacity style={styles.iconButton}>
						<Ionicons
							color={theme.colors.textSecondary}
							name="add-circle-outline"
							size={26}
						/>
					</TouchableOpacity>
					<TouchableOpacity style={styles.iconButton}>
						<Ionicons
							color={theme.colors.textSecondary}
							name="arrow-down-circle-outline"
							size={26}
						/>
					</TouchableOpacity>
					<TouchableOpacity style={styles.iconButton}>
						<Ionicons
							color={theme.colors.textSecondary}
							name="share-outline"
							size={26}
						/>
					</TouchableOpacity>
					<TouchableOpacity style={styles.iconButton}>
						<Ionicons
							color={theme.colors.textSecondary}
							name="ellipsis-horizontal"
							size={26}
						/>
					</TouchableOpacity>
				</View>
				<TrackList albumArtwork={album.images} albumId={album.id} />
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
	backgroundImage: {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		width: "100%",
		height: "100%",
	},
	backgroundBlur: {
		flex: 1,
		backgroundColor: "rgba(255, 255, 255, 0.7)",
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
		paddingBottom: theme.spacing.lg,
	},
	cover: {
		width: IMAGE_SIZE,
		height: IMAGE_SIZE,
		borderRadius: theme.borderRadius.md,
		...theme.shadows.large,
	},
	infoContainer: {
		paddingHorizontal: theme.spacing.lg,
		alignItems: "flex-start",
		marginBottom: theme.spacing.lg,
		gap: theme.spacing.xs,
	},
	albumName: {
		fontSize: theme.typography.fontSizes.xxl,
		fontWeight: theme.typography.fontWeights.bold,
		color: theme.colors.textSecondary,
		textAlign: "center",
		marginBottom: theme.spacing.xs,
	},
	albumDesc: {
		fontSize: theme.typography.fontSizes.sm,
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
	actionsContainer: {
		flexDirection: "row",
		paddingHorizontal: theme.spacing.lg,
		gap: theme.spacing.md,
		marginBottom: theme.spacing.md,
	},
	playButton: {
		flex: 1,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: theme.colors.primary,
		borderRadius: theme.borderRadius.round,
		paddingVertical: theme.spacing.md,
		gap: theme.spacing.sm,
		...theme.shadows.small,
	},
	playButtonText: {
		color: theme.colors.textPrimary,
		fontSize: theme.typography.fontSizes.md,
		fontWeight: theme.typography.fontWeights.semibold,
	},
	shuffleButton: {
		flex: 1,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: theme.colors.surface,
		borderRadius: theme.borderRadius.round,
		paddingVertical: theme.spacing.md,
		gap: theme.spacing.sm,
		borderWidth: 1,
		borderColor: theme.colors.accentSecondary,
	},
	shuffleButtonText: {
		color: theme.colors.textSecondary,
		fontSize: theme.typography.fontSizes.md,
		fontWeight: theme.typography.fontWeights.semibold,
	},
	secondaryActions: {
		flexDirection: "row",
		paddingHorizontal: theme.spacing.lg,
		justifyContent: "space-around",
		marginBottom: theme.spacing.lg,
	},
	iconButton: {
		width: 44,
		height: 44,
		justifyContent: "center",
		alignItems: "center",
	},
	detailsContainer: {
		paddingHorizontal: theme.spacing.lg,
		paddingTop: theme.spacing.xl,
		gap: theme.spacing.sm,
	},
	detailsDate: {
		fontSize: theme.typography.fontSizes.xs,
		color: theme.colors.textTertiary,
	},
	detailsPopularity: {
		fontSize: theme.typography.fontSizes.xs,
		color: theme.colors.textTertiary,
	},
	copyright: {
		fontSize: 11,
		color: theme.colors.textTertiary,
		marginTop: theme.spacing.sm,
		lineHeight: 16,
	},
	bottomSpacing: {
		height: 100,
	},
});
