import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
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
import { TPlayerTrack, useMusicPlayer } from "@/store/player/player";

export default function ResultModal() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    trackData?: string;
    shazamTitle?: string;
    shazamArtist?: string;
    shazamArtwork?: string;
    webURL?: string;
    appleMusicURL?: string;
  }>();

  const [track, setTrack] = useState<TPlayerTrack | null>(null);
  const { setTrack: playTrack, currentTrack, playbackState, togglePlayPause } = useMusicPlayer();

  // Parse track data
  useEffect(() => {
    if (params.trackData) {
      try {
        const parsedTrack = JSON.parse(params.trackData) as TPlayerTrack;
        setTrack(parsedTrack);
      } catch (error) {
        console.error("Failed to parse track data:", error);
      }
    }
  }, [params.trackData]);

  const title = track?.name || params.shazamTitle || "Unknown Title";
  const artist = track?.artists?.map((a) => a.name).join(", ") || params.shazamArtist || "Unknown Artist";
  const artworkUrl = track?.albumArtwork?.[0]?.url || params.shazamArtwork;
  const webURL = params.webURL;
  const isCurrentTrack = currentTrack?.id === track?.id;
  const isPlaying = isCurrentTrack && playbackState === "playing";

  // intro animation
  const ready = useSharedValue(0);
  useEffect(() => {
    ready.value = withTiming(1, {
      duration: 600,
      easing: Easing.out(Easing.quad),
    });
  }, [ready]);

  const introStyle = useAnimatedStyle(() => ({
    opacity: ready.value,
    transform: [
      { translateY: (1 - ready.value) * 30 },
      { scale: 0.96 + ready.value * 0.04 },
    ],
  }));

  const handlePlayPress = async () => {
    if (!track) {
      return;
    }

    if (isCurrentTrack) {
      // Toggle play/pause if this is the current track
      togglePlayPause();
    } else {
      // Play the new track
      await playTrack(track, true);
    }
  };

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
          <Ionicons color={theme.colors.surface} name="close" size={22} />
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
              color={theme.colors.surface}
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
              style={[
                styles.playButton,
                isPlaying && styles.playButtonActive,
              ]}
              onPress={handlePlayPress}
            >
              <Ionicons
                color="#FFFFFF"
                name={isPlaying ? "pause" : "play"}
                size={28}
              />
            </TouchableOpacity>
          </View>



          {/* Artist Row */}
          <View style={styles.artistRow}>
            <View>
              <Text style={styles.artistLabel}>Artist</Text>
              <Text style={styles.artistName}>{artist}</Text>
            </View>
          </View>

          {/* Track Info */}
          {track && (
            <View style={styles.trackInfoSection}>
              {track.explicit && (
                <View style={styles.explicitBadge}>
                  <Text style={styles.explicitText}>E</Text>
                </View>
              )}
              {track.durationMs && (
                <Text style={styles.trackDuration}>
                  {Math.floor(track.durationMs / 60000)}:
                  {String(Math.floor((track.durationMs % 60000) / 1000)).padStart(2, "0")}
                </Text>
              )}
            </View>
          )}
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
    color: theme.colors.surface,
    marginBottom: 4,
  },


  artistRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: theme.spacing.lg,
  },
  artistLabel: {
    fontSize: theme.typography.fontSizes.xs,
    color: theme.colors.surface,
    opacity: 0.7,
  },
  artistName: {
    fontSize: theme.typography.fontSizes.md,
    color: theme.colors.surface,
    fontWeight: theme.typography.fontWeights.semibold,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: theme.spacing.md,
    marginBottom: theme.spacing.md,
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
  playButtonActive: {
    backgroundColor: theme.colors.primaryDark,
  },
  trackInfoSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: theme.spacing.lg,
  },
  explicitBadge: {
    backgroundColor: theme.colors.primary,
    width: 20,
    height: 20,
    borderRadius: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  explicitText: {
    color: theme.colors.surface,
    fontSize: 10,
    fontWeight: "bold",
  },
  trackDuration: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.surface,
    opacity: 0.8,
  },
  linksSection: {
    gap: theme.spacing.sm,
    marginTop: theme.spacing.md,
  },

});
