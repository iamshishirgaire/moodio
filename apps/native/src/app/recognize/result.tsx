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
    subtitle?: string;
    artwork?: string;
    webURL?: string;
    videoURL?: string;
  }>();

  const title = params.title ?? "Unknown Title";
  const artist = params.artist ?? "Unknown Artist";
  const subtitle = params.subtitle;
  const artworkUrl = params.artwork;
  const webURL = params.webURL;
  const videoURL = params.videoURL;

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
      {artworkUrl && (
        <ImageBackground
          resizeMode="cover"
          source={{ uri: artworkUrl }}
          style={StyleSheet.absoluteFill}
        >
          {/* Dark overlay for better text contrast */}
          <View
            style={[
              StyleSheet.absoluteFill,
              { backgroundColor: "rgba(0, 0, 0, 0.4)" },
            ]}
          />
          <BlurView
            intensity={80}
            style={StyleSheet.absoluteFill}
            tint="dark"
          />
        </ImageBackground>
      )}

      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => router.back()}
          style={styles.iconButton}
        >
          <Ionicons color={theme.colors.textPrimary} name="close" size={22} />
        </TouchableOpacity>

        <View style={styles.rightIcons}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              if (webURL) Linking.openURL(webURL);
            }}
            style={styles.iconButton}
          >
            <Ionicons
              color={theme.colors.textPrimary}
              name="share-outline"
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
        {artworkUrl && (
          <Animated.View style={[styles.artworkContainer, introStyle]}>
            <Image source={{ uri: artworkUrl }} style={styles.artworkImage} />
          </Animated.View>
        )}

        {/* Info Section */}
        <View style={styles.infoSection}>
          <View style={styles.titleRow}>
            <View style={styles.titleText}>
              <Text numberOfLines={2} style={styles.songTitle}>
                {title}
              </Text>
            </View>
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.playButton}
              onPress={() => videoURL && Linking.openURL(videoURL)}
            >
              <Ionicons color="#FFFFFF" name="play" size={28} />
            </TouchableOpacity>
          </View>

          {subtitle && <Text style={styles.albumText}>{subtitle}</Text>}

          {/* Artist Row */}
          <View style={styles.artistRow}>
            <View>
              <Text style={styles.artistLabel}>Artist</Text>
              <Text style={styles.artistName}>{artist}</Text>
            </View>
          </View>

          {/* Shazam/Apple Music links */}
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
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    alignItems: "center",
    justifyContent: "center",
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
  albumText: {
    fontSize: theme.typography.fontSizes.md,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.md,
    opacity: 0.9,
  },
  shazamRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: theme.spacing.md,
    flexWrap: "wrap",
  },
  shazamButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: theme.borderRadius.lg,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginRight: 4,
  },
  shazamText: {
    color: theme.colors.primary,
    fontSize: theme.typography.fontSizes.sm,
    fontWeight: theme.typography.fontWeights.semibold,
  },
  artistRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: theme.spacing.lg,
  },
  artistLabel: {
    fontSize: theme.typography.fontSizes.xs,
    color: theme.colors.textPrimary,
    opacity: 0.7,
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
});
