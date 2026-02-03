import { useQuery } from "@tanstack/react-query";
import React from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  Pressable,
  StyleSheet,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { theme } from "@/constants/theme"; // Adjust import path
import { orpc } from "@/utils/orpc";
type ElementType<T> = T extends (infer U)[] ? U : never;

export default function LibraryScreen() {
  const router = useRouter();

  // Fetch recommendations
  const { isLoading, data: recommendationsData } = useQuery(
    orpc.recommendation.getAll.queryOptions({
      input: { limit: 10, offset: 0 },
    }),
  );

  type RecommendedTrack = ElementType<typeof recommendationsData>;

  // Helper to get album image
  const getAlbumImage = (track: RecommendedTrack) => {
    return track.album?.images?.[0]?.url || "https://via.placeholder.com/200";
  };

  // Mock data for other sections
  const recentlyPlayed = [
    {
      id: "1",
      title: "Chill Vibes",
      subtitle: "Playlist • 45 songs",
      image: "https://picsum.photos/seed/playlist1/200",
    },
    {
      id: "2",
      title: "Indie Rock Essentials",
      subtitle: "Playlist • 67 songs",
      image: "https://picsum.photos/seed/playlist2/200",
    },
    {
      id: "3",
      title: "Late Night Jazz",
      subtitle: "Playlist • 32 songs",
      image: "https://picsum.photos/seed/playlist3/200",
    },
    {
      id: "4",
      title: "Workout Beats",
      subtitle: "Playlist • 78 songs",
      image: "https://picsum.photos/seed/playlist4/200",
    },
  ];

  const yourPlaylists = [
    {
      id: "p1",
      title: "My Favorites",
      subtitle: "123 songs",
      image: "https://picsum.photos/seed/fav1/200",
    },
    {
      id: "p2",
      title: "Road Trip",
      subtitle: "45 songs",
      image: "https://picsum.photos/seed/fav2/200",
    },
    {
      id: "p3",
      title: "Study Session",
      subtitle: "89 songs",
      image: "https://picsum.photos/seed/fav3/200",
    },
    {
      id: "p4",
      title: "Summer 2024",
      subtitle: "56 songs",
      image: "https://picsum.photos/seed/fav4/200",
    },
    {
      id: "p5",
      title: "Party Mix",
      subtitle: "112 songs",
      image: "https://picsum.photos/seed/fav5/200",
    },
  ];

  const likedAlbums = [
    {
      id: "a1",
      title: "After Hours",
      artist: "The Weeknd",
      image: "https://picsum.photos/seed/album1/200",
    },
    {
      id: "a2",
      title: "folklore",
      artist: "Taylor Swift",
      image: "https://picsum.photos/seed/album2/200",
    },
    {
      id: "a3",
      title: "DAMN.",
      artist: "Kendrick Lamar",
      image: "https://picsum.photos/seed/album3/200",
    },
    {
      id: "a4",
      title: "Blonde",
      artist: "Frank Ocean",
      image: "https://picsum.photos/seed/album4/200",
    },
  ];

  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const renderQuickAccessItem = ({ item }: { item: any }) => (
    <Pressable
      style={({ pressed }) => [
        styles.quickAccessItem,
        pressed && styles.itemPressed,
      ]}
      onPress={() => console.log("Navigate to:", item.title)}
    >
      <Image source={{ uri: item.image }} style={styles.quickAccessImage} />
      <Text style={styles.quickAccessTitle} numberOfLines={1}>
        {item.title}
      </Text>
    </Pressable>
  );

  const renderRecommendedTrack = (track: RecommendedTrack) => (
    <Pressable
      key={track.id}
      style={({ pressed }) => [styles.trackItem, pressed && styles.itemPressed]}
      onPress={() => console.log("Play track:", track.name)}
    >
      <Image source={{ uri: getAlbumImage(track) }} style={styles.trackImage} />
      <View style={styles.trackInfo}>
        <Text style={styles.trackTitle} numberOfLines={1}>
          {track.name}
        </Text>
        <Text style={styles.trackArtist} numberOfLines={1}>
          {track.artists?.map((a) => a.name).join(", ")}
        </Text>
      </View>
      <Text style={styles.trackDuration}>
        {formatDuration(track.durationMs)}
      </Text>
    </Pressable>
  );

  const renderPlaylistCard = ({ item }: { item: any }) => (
    <Pressable
      style={({ pressed }) => [
        styles.playlistCard,
        pressed && styles.itemPressed,
      ]}
      onPress={() => console.log("Navigate to:", item.title)}
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
          <Text style={styles.headerTitle}>Your Library</Text>
        </View>

        {/* Quick Access Grid */}
        <View style={styles.section}>
          <FlatList
            data={recentlyPlayed}
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
            <Pressable onPress={() => console.log("See all recommendations")}>
              <Text style={styles.seeAllButton}>See all</Text>
            </Pressable>
          </View>

          {isLoading ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Loading recommendations...</Text>
            </View>
          ) : recommendationsData && recommendationsData.length > 0 ? (
            <View style={styles.tracksContainer}>
              {recommendationsData
                .slice(0, 5)
                .map((track) => renderRecommendedTrack(track))}
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

  // Recommended Tracks - UPDATED TO MATCH DESIGN
  tracksContainer: {
    paddingHorizontal: 16,
  },
  trackItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 0,
    backgroundColor: "transparent",
  },
  trackImage: {
    width: 56,
    height: 56,
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: "#e0e0e0",
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
  trackArtist: {
    fontSize: 13,
    color: "#666",
    marginBottom: 2,
  },
  recommendationReason: {
    fontSize: 11,
    color: "#1db954",
    fontStyle: "italic",
  },
  trackDuration: {
    fontSize: 13,
    color: "#666",
    marginLeft: 12,
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
