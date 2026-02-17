
import { Icon } from "@/components/ui/icon";
import { IconButton } from "@/components/ui/icon-button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { theme } from "@/constants/theme";
import { useAlbumStore, type TAlbumWithUserName } from "@/store/home/album";
import { orpc } from "@/utils/orpc";
import type { TAlbum } from "@moodio/api/features/album/schema";
import { useQuery } from "@tanstack/react-query";
import { BlurView } from "expo-blur";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
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
import { SafeAreaView } from "react-native-safe-area-context";

const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);
const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

const HEADER_HEIGHT = 44;
const IMAGE_SIZE = 240;

export default function ArtistPage() {
	const router = useRouter();
	const { id: artistId } = useLocalSearchParams<{ id: string }>();
	const scrollY = useSharedValue(0);
	const setAlbum = useAlbumStore((s) => s.setCurrent);

	const { data: artist, isLoading } = useQuery(
		orpc.artist.getDetailsById.queryOptions({
			input: { artistId },
		}),
	);

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
			Extrapolation.CLAMP,
		);
		return { opacity };
	});

	const headerBlurAnimatedProps = useAnimatedProps(() => {
		const intensity = interpolate(
			scrollY.value,
			[0, 100],
			[0, 80],
			Extrapolation.CLAMP,
		);
		return { intensity };
	});

	const imageAnimatedStyle = useAnimatedStyle(() => {
		const scale = interpolate(
			scrollY.value,
			[-100, 0],
			[1.5, 1],
			Extrapolation.CLAMP,
		);
		const translateY = interpolate(
			scrollY.value,
			[-100, 0],
			[-50, 0],
			Extrapolation.CLAMP,
		);
		return { transform: [{ scale }, { translateY }] };
	});

	const handleAlbumPress = (album: TAlbum) => {
		if (!artist) return;
		const albumWithArtist: TAlbumWithUserName = {
			...album,
			artistName: artist.name,
			artistImage: artist.images,
		};
		setAlbum(albumWithArtist);
		router.push("/album");
	};

	if (isLoading) {
		return (
			<LoadingSpinner/>
		);
	}

	if (!artist) {
		return (
			<View style={styles.center}>
				<Text style={styles.emptyText}>Artist not found.</Text>
			</View>
		);
	}

	return (
		<View style={styles.container}>
			<StatusBar barStyle="dark-content" />
			<ImageBackground
				blurRadius={100}
				source={{ uri: artist.images[0].url }}
				style={styles.backgroundImage}
			>
				<BlurView intensity={85} style={styles.backgroundBlur} tint="light" />
			</ImageBackground>

			<View style={styles.header}>
				<AnimatedBlurView
					animatedProps={headerBlurAnimatedProps}
					style={styles.headerBlur}
					tint="light"
				>
					<SafeAreaView
						edges={["top", "left", "right"]}
						style={{ flex: 1, width: "100%" }}
					>
						<View style={styles.headerContent}>
							<IconButton onPress={() => router.back()}>
								<Icon color={theme.colors.textSecondary} icon="chevron-down" size={22} />
							</IconButton>
							<Animated.Text
								numberOfLines={1}
								style={[styles.headerTitle, headerTitleAnimatedStyle]}
							>
								{artist.name}
							</Animated.Text>
							<View style={{ width: 44 }} />
						</View>
					</SafeAreaView>
				</AnimatedBlurView>
			</View>

			<AnimatedScrollView
				contentContainerStyle={styles.scrollContent}
				onScroll={scrollHandler}
				scrollEventThrottle={16}
				showsVerticalScrollIndicator={false}
				style={styles.scrollView}
			>
				<View style={styles.coverContainer}>
					<Animated.View style={imageAnimatedStyle}>
						<Animated.Image
							source={{ uri: artist.images[0].url }}
							style={styles.cover}
						/>
					</Animated.View>
				</View>

				<View style={styles.infoContainer}>
					<Text style={styles.artistName}>{artist.name}</Text>
					<Text style={styles.artistMeta}>
						{artist.followers.toLocaleString()} followers
					</Text>
					{artist.genres && artist.genres.length > 0 && (
						<Text style={styles.genres}>{artist.genres.join(", ")}</Text>
					)}
				</View>


				<View style={styles.sectionContainer}>
					<Text style={styles.sectionTitle}>Albums</Text>
					{artist.albums.map((album) => (
						<TouchableOpacity key={album.id} onPress={() => handleAlbumPress(album as TAlbum)} style={styles.albumItem}>
							<Image source={{ uri: album.images[0].url }} style={styles.albumImage} />
							<View style={styles.albumInfo}>
								<Text style={styles.albumName}>{album.name}</Text>
								<Text style={styles.albumYear}>{album.releaseDate.split("-")[0]}</Text>
							</View>
						</TouchableOpacity>
					))}
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
	backgroundImage: {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
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
		zIndex: 10,
		height: HEADER_HEIGHT + (Platform.OS === "ios" ? 44 : 0),
	},
	headerBlur: {
		flex: 1,
	},
	headerContent: {
		flex: 1,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		paddingHorizontal: theme.spacing.md,
	},
	headerTitle: {
		flex: 1,
		color: theme.colors.textSecondary,
		fontSize: theme.typography.fontSizes.lg,
		fontWeight: "600",
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
	artistName: {
		fontSize: 28,
		fontWeight: "bold",
		color: theme.colors.textSecondary,
	},
	artistMeta: {
		fontSize: theme.typography.fontSizes.sm,
		color: theme.colors.textTertiary,
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
		color: theme.colors.surfaceTertiary,
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
	sectionContainer: {
		paddingHorizontal: theme.spacing.lg,
		paddingTop: theme.spacing.lg,
	},
	sectionTitle: {
		fontSize: 20,
		fontWeight: "bold",
		color: theme.colors.textSecondary,
		marginBottom: theme.spacing.md,
	},
	albumItem: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: theme.spacing.md,
	},
	albumImage: {
		width: 60,
		height: 60,
		borderRadius: 4,
		marginRight: theme.spacing.md,
	},
	albumInfo: {
		flex: 1,
	},
	albumName: {
		fontSize: 16,
		fontWeight: "600",
		color: theme.colors.textSecondary,
	},
	albumYear: {
		fontSize: 14,
		color: theme.colors.textTertiary,
	},
	bottomSpacing: {
		height: 100,
	},
});
