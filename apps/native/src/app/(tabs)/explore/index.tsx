import PlayingIndicator from "@/app/player/components/bars-visualizer";
import { theme } from "@/constants/theme";
import { useAlbumStore } from "@/store/home/album";
import { TPlayerTrack, useMusicPlayer } from "@/store/player/player";
import { orpc } from "@/utils/orpc";
import { useQuery } from "@tanstack/react-query";
import {
  FlatList,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

type ElementType<T> = T extends (infer U)[] ? U : never;

export default function ExploreScreen() {
  // Music player store
  const { setQueue, currentTrack, playbackState } = useMusicPlayer();
  const setAlbum = useAlbumStore((s) => s.setCurrent);
  const router = useRouter();

  // Fetch recommendations
  const { isLoading, data: recommendationsData } = useQuery(
    orpc.recommendation.getAll.queryOptions({
      input: { limit: 10, offset: 0 },
    }),
  );

  const { data: exploreData } = useQuery(
    orpc.library.getExplore.queryOptions({
      input: { playlistLimit: 10, albumLimit: 10 },
    }),
  );

  type RecommendedTrack = ElementType<typeof recommendationsData>;

  // Helper to get album image
  const getAlbumImage = (track: RecommendedTrack) => {
    return track.albumArtwork?.[0]?.url || "https://via.placeholder.com/200";
  };

  // Handle track click - play the track and set queue
  const handleTrackPress = async (track: RecommendedTrack, index: number) => {
    if (!recommendationsData) return;

    // Data is already in TPlayerTrack format from the API
    await setQueue(recommendationsData as TPlayerTrack[], index);
  };

  const { data: historyData } = useQuery(
    orpc.history.getRecent.queryOptions({
      input: { limit: 4 },
    }),
  );

  const yourPlaylists = (exploreData?.playlists || []).map((playlist) => ({
    id: playlist.id,
    title: playlist.name,
    subtitle: `${playlist.trackCount} song${playlist.trackCount === 1 ? "" : "s"}`,
    image: playlist.thumbnail || "https://via.placeholder.com/200",
  }));

  const likedAlbums = (exploreData?.albums || []).map((album) => ({
    id: album.id,
    title: album.name,
    artist: album.artistName || "Unknown Artist",
    image: album.images?.[0]?.url || "https://via.placeholder.com/200",
    albumData: album,
  }));



  const renderQuickAccessItem = ({ item, index }: { item: any; index: number }) => (
    <Pressable
      style={({ pressed }) => [
        styles.quickAccessItem,
        pressed && styles.itemPressed,
      ]}
      onPress={() => {
        if (!historyData) {
          return;
        }
        setQueue(historyData as TPlayerTrack[], index);
      }}
    >
      <Image source={{ uri: item.image }} style={styles.quickAccessImage} />
      <Text style={styles.quickAccessTitle} numberOfLines={1}>
        {item.title}
      </Text>
    </Pressable>
  );

  const renderRecommendedTrack = (track: RecommendedTrack, index: number) => {
    const isCurrentTrack = currentTrack?.id === track.id;
    const isPlaying = isCurrentTrack && playbackState === "playing";

    return (
      <Pressable
        key={track.id}
        style={({ pressed }) => [
          styles.trackItem,
          pressed && styles.itemPressed,
          isCurrentTrack && styles.trackItemActive,
        ]}
        onPress={() => handleTrackPress(track, index)}
      >
        <View style={styles.trackImageContainer}>
          <Image
            source={{ uri: getAlbumImage(track) }}
            style={styles.trackImage}
          />

        </View>
        <View style={styles.trackInfo}>
          <Text
            style={[
              styles.trackTitle,
              isCurrentTrack && styles.trackTitleActive,
            ]}
            numberOfLines={1}
          >
            {track.name}
          </Text>
          <Text style={styles.trackArtist} numberOfLines={1}>
            {track.artists?.map((a) => a.name).join(", ")}
          </Text>

        </View>
            <PlayingIndicator  isPlaying={isPlaying}/>
      </Pressable>
    );
  };

  const renderPlaylistCard = ({ item }: { item: any }) => (
    <Pressable
      style={({ pressed }) => [
        styles.playlistCard,
        pressed && styles.itemPressed,
      ]}
      onPress={() => {
        if (item.albumData) {
          setAlbum(item.albumData);
          router.push("/album");
          return;
        }
        if (item.id) {
          router.push({ pathname: "/playlist/[id]", params: { id: item.id } } as never);
        }
      }}
    >
      <Image source={{ uri: item.image }} style={styles.playlistImage} />
      <Text style={styles.playlistTitle} numberOfLines={2}>
        {item.title}
      </Text>
      <Text style={styles.playlistSubtitle} numberOfLines={1}>
        {item.subtitle || item.artist}
      </Text>
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Explore</Text>
        </View>

        {/* Quick Access Grid */}
        <View style={styles.section}>
          <FlatList
            data={(historyData || []).map((track) => ({
              id: track.id,
              title: track.name,
              subtitle: track.artists?.map((a) => a.name).join(", "),
              image: track.albumArtwork?.[0]?.url || "https://via.placeholder.com/200",
            }))}
            renderItem={renderQuickAccessItem}
            keyExtractor={(item) => item.id}
            numColumns={2}
            scrollEnabled={false}
            columnWrapperStyle={styles.quickAccessRow}
          />
        </View>

        {/* Recommended for You Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recommended for You</Text>

          </View>

          {isLoading ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Loading recommendations...</Text>
            </View>
          ) : recommendationsData && recommendationsData.length > 0 ? (
            <View style={styles.tracksContainer}>
              {recommendationsData
                .slice(0, 5)
                .map((track, index) => renderRecommendedTrack(track, index))}
            </View>
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                No recommendations available yet
              </Text>
              <Text style={styles.emptySubtext}>
                Listen to more music to get personalized recommendations
              </Text>
            </View>
          )}
        </View>

        {/* Your Playlists Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Your Playlists</Text>
            <Pressable onPress={() => console.log("See all playlists")}>
              <Text style={styles.seeAllButton}>See all</Text>
            </Pressable>
          </View>
          <FlatList
            data={yourPlaylists}
            renderItem={renderPlaylistCard}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
          />
        </View>

        {/* Liked Albums Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Albums You Love</Text>
            <Pressable onPress={() => console.log("See all albums")}>
              <Text style={styles.seeAllButton}>See all</Text>
            </Pressable>
          </View>
          <FlatList
            data={likedAlbums}
            renderItem={renderPlaylistCard}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
          />
        </View>

        {/* Bottom Padding */}
        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "800",
    color: "#000",
    letterSpacing: -1,
  },
  section: {
    marginTop: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#000",
    letterSpacing: -0.5,
  },
  seeAllButton: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
  },

  // Quick Access Grid
  quickAccessRow: {
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  quickAccessItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 8,
    width: "48%",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  itemPressed: {
    opacity: 0.7,
  },
  quickAccessImage: {
    width: 56,
    height: 56,
  },
  quickAccessTitle: {
    flex: 1,
    fontSize: 13,
    fontWeight: "700",
    color: "#000",
    paddingHorizontal: 12,
  },

  // Recommended Tracks
  tracksContainer: {
    paddingHorizontal: 16,
  },
  trackItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 8,
    backgroundColor: "transparent",
    borderRadius: 8,
  },
  trackItemActive: {
    backgroundColor: theme.colors.accentSecondary,
  },
  trackImageContainer: {
    position: "relative",
  },
  trackImage: {
    width: 56,
    height: 56,
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: "#e0e0e0",
  },
  playingIndicator: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 12,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 3,
  },
  playingBar: {
    width: 3,
    height: 16,
    backgroundColor:theme.colors.primary,
    borderRadius: 2,
  },
  trackInfo: {
    flex: 1,
    justifyContent: "center",
  },
  trackTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#000",
    marginBottom: 4,
  },
  trackTitleActive: {
    color: theme.colors.primary
  },
  trackArtist: {
    fontSize: 13,
    color: "#666",
    marginBottom: 2,
  },
  recommendationReason: {
    fontSize: 11,
    color: theme.colors.primary,
  },


  // Horizontal Scrolling Cards
  horizontalList: {
    paddingHorizontal: 16,
    gap: 12,
  },
  playlistCard: {
    width: 140,
    marginRight: 4,
  },
  playlistImage: {
    width: 140,
    height: 140,
    borderRadius: 12,
    backgroundColor: "#e0e0e0",
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  playlistTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000",
    marginBottom: 4,
    lineHeight: 18,
  },
  playlistSubtitle: {
    fontSize: 12,
    color: "#666",
  },

  // Loading & Empty States
  loadingContainer: {
    paddingVertical: 40,
    alignItems: "center",
  },
  loadingText: {
    fontSize: 14,
    color: "#666",
  },
  emptyContainer: {
    paddingVertical: 40,
    paddingHorizontal: 32,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginBottom: 8,
    textAlign: "center",
  },
  emptySubtext: {
    fontSize: 13,
    color: "#666",
    textAlign: "center",
    lineHeight: 18,
  },
});
