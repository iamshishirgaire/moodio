import { queryClient } from "@/app/_layout";
import AppScrollView from "@/components/app-scroll-view";
import { CircleAvatar } from "@/components/ui/circle-avatar";
import Spacer from "@/components/ui/spacer";
import { Text } from "@/components/ui/text";
import { theme } from "@/constants/theme";
import { authClient } from "@/lib/auth-client";
import { IconArrowsSort, IconDownload, IconLayoutGrid, IconPin, IconSearch } from "@tabler/icons-react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
    Image,
    Pressable,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import LibraryFilterRow from "./components/library-filter-row";

// Mock library data
const MOCK_LIBRARY_ITEMS = [
  {
    id: "1",
    type: "playlist",
    title: "Liked Songs",
    subtitle: "Playlist • 280 songs",
    image: "https://picsum.photos/seed/liked/200",
    isPinned: true,
    isDownloaded: true,
  },
  {
    id: "2",
    type: "podcast",
    title: "New Episodes",
    subtitle: "Updated 28 Jan 2025",
    image: "https://picsum.photos/seed/podcast/200",
    isPinned: true,
  },
  {
    id: "3",
    type: "album",
    title: "Hurry Up Tomorrow",
    subtitle: "Album • The Weeknd",
    image: "https://picsum.photos/seed/album1/200",
    isDownloaded: true,
  },
  {
    id: "4",
    type: "artist",
    title: "Atif Aslam",
    subtitle: "Artist",
    image: "https://picsum.photos/seed/artist1/200",
    isCircular: true,
  },
  {
    id: "5",
    type: "artist",
    title: "Lana Del Rey",
    subtitle: "Artist",
    image: "https://picsum.photos/seed/artist2/200",
    isCircular: true,
  },
  {
    id: "6",
    type: "album",
    title: "House Of Balloons (Original)",
    subtitle: "Album • The Weeknd",
    image: "https://picsum.photos/seed/album2/200",
  },
  {
    id: "7",
    type: "playlist",
    title: "Daily Mix 1",
    subtitle: "Playlist • 50 songs",
    image: "https://picsum.photos/seed/mix1/200",
  },
  {
    id: "8",
    type: "album",
    title: "After Hours",
    subtitle: "Album • The Weeknd",
    image: "https://picsum.photos/seed/album3/200",
  },
  {
    id: "9",
    type: "playlist",
    title: "Chill Vibes",
    subtitle: "Playlist • 125 songs",
    image: "https://picsum.photos/seed/chill/200",
  },
  {
    id: "10",
    type: "artist",
    title: "Dua Lipa",
    subtitle: "Artist",
    image: "https://picsum.photos/seed/artist3/200",
    isCircular: true,
  },
];

export default function LibraryPage() {
  const insets = useSafeAreaInsets();
  const [refreshing, setRefreshing] = useState(false);
  const [sortBy, setSortBy] = useState<"recents" | "alphabetical">("recents");
  const router = useRouter();
  const { data } = authClient.useSession();

  const onRefresh = async () => {
    setRefreshing(true);
    await queryClient.invalidateQueries({
      queryKey: ["library"],
    });
    setRefreshing(false);
  };

  const renderLibraryItem = (item: (typeof MOCK_LIBRARY_ITEMS)[0]) => (
    <Pressable
      key={item.id}
      style={({ pressed }) => [
        styles.libraryItem,
        pressed && styles.itemPressed,
      ]}
      onPress={() => console.log("Open item:", item.title)}
    >
      <Image
        source={{ uri: item.image }}
        style={[
          styles.itemImage,
          item.isCircular && styles.itemImageCircular,
        ]}
      />
      <View style={styles.itemInfo}>
        <Text style={styles.itemTitle} numberOfLines={1}>
          {item.title}
        </Text>
        <View style={styles.itemSubtitleRow}>
          {item.isPinned && (
            <View style={styles.badge}>
              <IconPin size={14} color={theme.colors.primary} />
            </View>
          )}
          {item.isDownloaded && (
            <View style={styles.badge}>
              <IconDownload size={14} color={theme.colors.primary} />
            </View>
          )}
          <Text style={styles.itemSubtitle} numberOfLines={1}>
            {item.subtitle}
          </Text>
        </View>
      </View>
    </Pressable>
  );

  return (
    <AppScrollView
      backgroundColor={theme.colors.background}
      blurIntensity={40}
      blurTint="light"
      contentContainerStyle={styles.scrollContent}
      indicatorColor={theme.colors.primary}
      onRefresh={onRefresh}
      refreshing={refreshing}
      showBlurOnScroll={true}
    >
      {/* Header */}
      <View
        style={{
          height: insets.top + 60,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "flex-end",
          paddingBottom: theme.spacing.sm,
          paddingHorizontal: theme.spacing.md,
          paddingTop: insets.top,
        }}
      >
        <View style={styles.headerLeft}>
          <TouchableOpacity
            onPress={() => {
              router.push("/home/profile");
            }}
          >
            <CircleAvatar
              backgroundColor={theme.colors.backgroundSecondary}
              name={data?.user.name}
              source={{ uri: data?.user.image ?? undefined }}
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Your Library</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.iconButton}>
            <IconSearch size={24} color={theme.colors.textPrimary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Filter Row */}
      <LibraryFilterRow />

      <Spacer height={theme.spacing.md} />

      {/* Sort Controls */}
      <View style={styles.sortContainer}>
        <TouchableOpacity
          style={styles.sortButton}
          onPress={() =>
            setSortBy(sortBy === "recents" ? "alphabetical" : "recents")
          }
        >
          <IconArrowsSort size={20} color={theme.colors.textPrimary} />
          <Text style={styles.sortText}>
            {sortBy === "recents" ? "Recents" : "Alphabetical"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.gridButton}>
          <IconLayoutGrid size={24} color={theme.colors.textPrimary} />
        </TouchableOpacity>
      </View>

      <Spacer height={theme.spacing.sm} />

      {/* Library Items */}
      <View style={styles.libraryList}>
        {MOCK_LIBRARY_ITEMS.map(renderLibraryItem)}
      </View>

      <Spacer height={100} />
    </AppScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 100,
  },

  // Header
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: theme.colors.textPrimary,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.xs,
  },
  iconButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },

  // Sort Controls
  sortContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: theme.spacing.md,
  },
  sortButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.xs,
  },
  sortText: {
    fontSize: 14,
    color: theme.colors.textPrimary,
    fontWeight: "500",
  },
  gridButton: {
    padding: theme.spacing.xs,
  },

  // Library Items
  libraryList: {
    paddingHorizontal: theme.spacing.md,
  },
  libraryItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
  },
  itemPressed: {
    backgroundColor: theme.colors.backgroundSecondary,
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 4,
    backgroundColor: theme.colors.backgroundSecondary,
  },
  itemImageCircular: {
    borderRadius: 30,
  },
  itemInfo: {
    flex: 1,
    marginLeft: theme.spacing.sm,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: theme.colors.textPrimary,
    marginBottom: 4,
  },
  itemSubtitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  badge: {
    marginRight: 2,
  },
  itemSubtitle: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
});
