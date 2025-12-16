import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect } from "react";
import {
	Image,
	ImageBackground,
	Linking,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import Animated, {
	Easing,
	useAnimatedStyle,
	useSharedValue,
	withTiming,
} from "react-native-reanimated";
import { theme } from "../../constants/theme";

export default function ResultModal() {
	const router = useRouter();
	const params = useLocalSearchParams<{
		title?: string;
		artist?: string;
		album?: string;
		artwork?: string;
		artistImage?: string;
		confidence?: string;
		artistUrl?: string;
		albumUrl?: string;
	}>();

	const title = params.title ?? "Blinding Lights";
	const artist = params.artist ?? "The Weeknd";
	const album = params.album ?? "After Hours";
	const artworkUrl =
		params.artwork ??
		"https://upload.wikimedia.org/wikipedia/en/a/af/The_Weeknd_-_After_Hours.png";
	const artistImageUrl =
		params.artistImage ??
		"https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/The_Weeknd_in_2021.jpg/440px-The_Weeknd_in_2021.jpg";
	const albumUrl = params.albumUrl;

	// intro animation
	const ready = useSharedValue(0);
	useEffect(() => {
		ready.value = withTiming(1, {
			duration: 600,
			easing: Easing.out(Easing.quad),
		});
	}, [ready]);

	// Success sound moved to system notification on result
	const introStyle = useAnimatedStyle(() => ({
		opacity: ready.value,
		transform: [
			{ translateY: (1 - ready.value) * 30 },
			{ scale: 0.96 + ready.value * 0.04 },
		],
	}));

	return (
		<View style={styles.container}>
			<ImageBackground
				resizeMode="cover"
				source={{ uri: artworkUrl }}
				style={StyleSheet.absoluteFill}
			>
				{/* Keep blur but the overall palette is light; rely on overlay on top elements */}
				<BlurView
					intensity={100}
					style={StyleSheet.absoluteFill}
					tint="light"
				/>
			</ImageBackground>

			{/* Top Bar */}
			<View style={styles.topBar}>
				<TouchableOpacity
					activeOpacity={0.8}
					onPress={() => router.back()}
					style={styles.iconButton}
				>
					<Ionicons color={theme.colors.textPrimary} name="close" size={22} />
				</TouchableOpacity>

				<TouchableOpacity activeOpacity={0.8} style={styles.lyricsButton}>
					<Ionicons color={theme.colors.textPrimary} name="list" size={18} />
					<Text style={styles.lyricsText}>Lyrics</Text>
				</TouchableOpacity>

				<View style={styles.rightIcons}>
					<TouchableOpacity
						activeOpacity={0.8}
						onPress={() => router.back()}
						style={styles.iconButton}
					>
						<Ionicons
							color={theme.colors.textPrimary}
							name="share-outline"
							size={20}
						/>
					</TouchableOpacity>

					<TouchableOpacity
						activeOpacity={0.8}
						onPress={() => router.back()}
						style={styles.iconButton}
					>
						<Ionicons
							color={theme.colors.textPrimary}
							name="ellipsis-horizontal"
							size={20}
						/>
					</TouchableOpacity>
				</View>
			</View>

			<Animated.ScrollView
				contentContainerStyle={styles.scrollContainer}
				showsVerticalScrollIndicator={false}
			>
				{/* Foreground Artwork */}
				<Animated.View style={[styles.artworkContainer, introStyle]}>
					<Image source={{ uri: artworkUrl }} style={styles.artworkImage} />
				</Animated.View>

				{/* Info Section */}
				<View style={styles.infoSection}>
					<View style={styles.titleRow}>
						<View style={styles.titleText}>
							<Text numberOfLines={2} style={styles.songTitle}>
								{title}
							</Text>
						</View>
						<TouchableOpacity activeOpacity={0.8} style={styles.playButton}>
							<Ionicons
								color={theme.colors.surface}
								name="play"
								size={28} // icon on primary-colored button
							/>
						</TouchableOpacity>
					</View>

					<TouchableOpacity
						disabled={!albumUrl}
						onPress={() => albumUrl !== undefined && Linking.openURL(albumUrl)}
					>
						<Text style={styles.albumText}>{album}</Text>
					</TouchableOpacity>

					{/* Artist Row */}
					<View style={styles.artistRow}>
						<Image
							source={{ uri: artistImageUrl }}
							style={styles.artistImage}
						/>
						<View>
							<Text style={styles.artistLabel}>Artist</Text>
							<Text style={styles.artistName}>{artist}</Text>
						</View>
					</View>
				</View>
			</Animated.ScrollView>
		</View>
	);
}

/* === Styles === */
const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: theme.colors.background,
	},
	topBar: {
		paddingTop: 80,
		paddingBottom: theme.spacing.md,
		paddingHorizontal: theme.spacing.md,
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	iconButton: {
		width: 40,
		height: 40,
		borderRadius: theme.borderRadius.round,
		backgroundColor: theme.colors.overlay,
		alignItems: "center",
		justifyContent: "center",
	},
	lyricsButton: {
		flexDirection: "row",
		alignItems: "center",
		gap: 6,
		backgroundColor: theme.colors.overlay,
		paddingHorizontal: 16,
		height: 40,
		borderRadius: theme.borderRadius.round,
	},
	lyricsText: {
		color: theme.colors.textPrimary,
		fontSize: theme.typography.fontSizes.sm,
		fontWeight: theme.typography.fontWeights.semibold,
	},
	rightIcons: {
		flexDirection: "row",
		alignItems: "center",
		gap: 10,
	},

	artworkContainer: {
		marginTop: theme.spacing.xl,
		marginBottom: theme.spacing.lg,
		alignSelf: "center",
		...theme.shadows.large,
	},
	artworkImage: {
		width: 250,
		height: 250,
		borderRadius: theme.borderRadius.xl,
	},

	scrollContainer: {
		paddingBottom: theme.spacing.xl,
	},

	infoSection: {
		paddingHorizontal: theme.spacing.lg,
		paddingBottom: theme.spacing.xl,
		marginTop: theme.spacing.lg,
	},
	songTitle: {
		fontSize: theme.typography.fontSizes.xxxl,
		fontWeight: theme.typography.fontWeights.bold,
		color: theme.colors.textPrimary,
		marginBottom: 4,
	},
	songArtist: {
		fontSize: theme.typography.fontSizes.lg,
		fontWeight: theme.typography.fontWeights.medium,
		color: theme.colors.textPrimary,
	},
	albumText: {
		fontSize: theme.typography.fontSizes.md,
		color: theme.colors.textSecondary,
		marginBottom: theme.spacing.md,
	},
	shazamRow: {
		flexDirection: "row",
		alignItems: "center",
		gap: 6,
		marginBottom: theme.spacing.md,
	},
	shazamCount: {
		fontSize: theme.typography.fontSizes.sm,
		color: theme.colors.textPrimary,
	},
	artistRow: {
		flexDirection: "row",
		alignItems: "center",
		gap: 12,
		marginBottom: theme.spacing.lg,
	},
	artistImage: {
		width: 48,
		height: 48,
		borderRadius: theme.borderRadius.round,
	},
	artistLabel: {
		fontSize: theme.typography.fontSizes.xs,
		color: theme.colors.textTertiary,
	},
	artistName: {
		fontSize: theme.typography.fontSizes.md,
		color: theme.colors.textPrimary,
		fontWeight: theme.typography.fontWeights.semibold,
	},
	titleRow: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "flex-start",
		gap: theme.spacing.md,
	},
	titleText: {
		flex: 1,
		paddingRight: theme.spacing.md,
	},
	playButton: {
		width: 64,
		height: 64,
		borderRadius: theme.borderRadius.round,
		backgroundColor: theme.colors.primary,
		alignItems: "center",
		justifyContent: "center",
		flexShrink: 0,
	},
	fullSongButton: {
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: theme.colors.primary,
		paddingVertical: 14,
		borderRadius: theme.borderRadius.xl,
	},
});
