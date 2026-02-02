import type { SearchResult } from "@moodio/api/features/search/schema";
import { useRouter } from "expo-router";
import type React from "react";
import { Image, Pressable, SectionList, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "@/components/ui/text";
import { theme } from "@/constants/theme";

type SearchResultsProps = {
	results: SearchResult;
};

type AlbumItem = SearchResult["albums"][number];
type ArtistItem = SearchResult["artists"][number];
type TrackItem = SearchResult["tracks"][number];
type PlaylistItem = SearchResult["playlists"][number];

export type SearchItem = AlbumItem | ArtistItem | TrackItem | PlaylistItem;

interface SectionData {
	title: string;
	data: SearchItem[];
	type: "album" | "artist" | "track" | "playlist";
}

export const SearchResults: React.FC<SearchResultsProps> = ({ results }) => {
	const router = useRouter();

	const handleItemPress = (item: SearchItem) => {
		router.push({
			pathname: "/(tabs)/search/details",
			params: { item: JSON.stringify(item) },
		});
	};

	// Organize data into sections
	const sections = [
		{
			title: "Artists",
			data: results.artists || [],
			type: "artist" as const,
		},
		{
			title: "Albums",
			data: results.albums || [],
			type: "album" as const,
		},
		{
			title: "Tracks",
			data: results.tracks || [],
			type: "track" as const,
		},
		{
			title: "Playlists",
			data: results.playlists || [],
			type: "playlist" as const,
		},
	].filter((section) => section.data.length > 0) as any[];

	const renderAlbumItem = (item: AlbumItem) => {
		const imageUrl = item.images?.[0]?.url;

		return (
			<Pressable
				onPress={() => handleItemPress(item)}
				style={({ pressed }) => [
					styles.itemContainer,
					pressed && styles.itemPressed,
				]}
			>
				<View style={styles.imageContainer}>
					{imageUrl ? (
						<Image
							resizeMode="cover"
							source={{ uri: imageUrl }}
							style={styles.albumImage}
						/>
					) : (
						<View style={[styles.albumImage, styles.placeholderImage]}>
							<Text style={styles.placeholderText}>♪</Text>
						</View>
					)}
				</View>
				<View style={styles.itemContent}>
					<Text numberOfLines={1} style={styles.itemTitle}>
						{item.name}
					</Text>
					<Text numberOfLines={1} style={styles.itemSubtitle}>
						Album • {item.releaseDate?.split("-")[0] || "Unknown year"}
					</Text>
				</View>
			</Pressable>
		);
	};

	const renderArtistItem = (item: ArtistItem) => {
		const imageUrl = item.images?.[0]?.url;

		return (
			<Pressable
				onPress={() => handleItemPress(item)}
				style={({ pressed }) => [
					styles.itemContainer,
					pressed && styles.itemPressed,
				]}
			>
				<View style={styles.imageContainer}>
					{imageUrl ? (
						<Image
							resizeMode="cover"
							source={{ uri: imageUrl }}
							style={styles.artistImage}
						/>
					) : (
						<View style={[styles.artistImage, styles.placeholderImage]}>
							<Text style={styles.placeholderText}>♪</Text>
						</View>
					)}
				</View>
				<View style={styles.itemContent}>
					<Text numberOfLines={1} style={styles.itemTitle}>
						{item.name}
					</Text>
					<Text numberOfLines={1} style={styles.itemSubtitle}>
						Artist{" "}
						{item.followers
							? `• ${item.followers.toLocaleString()} followers`
							: ""}
					</Text>
				</View>
			</Pressable>
		);
	};

	const renderTrackItem = (item: TrackItem) => {
		const imageUrl = undefined;

		return (
			<Pressable
				onPress={() => handleItemPress(item)}
				style={({ pressed }) => [
					styles.itemContainer,
					pressed && styles.itemPressed,
				]}
			>
				<View style={styles.imageContainer}>
					{imageUrl ? (
						<Image
							resizeMode="cover"
							source={{ uri: imageUrl }}
							style={styles.albumImage}
						/>
					) : (
						<View style={[styles.albumImage, styles.placeholderImage]}>
							<Text style={styles.placeholderText}>♪</Text>
						</View>
					)}
				</View>
				<View style={styles.itemContent}>
					<Text numberOfLines={1} style={styles.itemTitle}>
						{item.name}
					</Text>
					<Text numberOfLines={1} style={styles.itemSubtitle}>
						Song •{" "}
						{item.artists?.map((a) => a.name).join(", ") || "Unknown artist"}
					</Text>
				</View>
			</Pressable>
		);
	};

	const renderPlaylistItem = (item: PlaylistItem) => {
		const imageUrl = item.thumbnail;

		return (
			<Pressable
				onPress={() => handleItemPress(item)}
				style={({ pressed }) => [
					styles.itemContainer,
					pressed && styles.itemPressed,
				]}
			>
				<View style={styles.imageContainer}>
					{imageUrl ? (
						<Image
							resizeMode="cover"
							source={{ uri: imageUrl }}
							style={styles.albumImage}
						/>
					) : (
						<View style={[styles.albumImage, styles.placeholderImage]}>
							<Text style={styles.placeholderText}>♪</Text>
						</View>
					)}
				</View>
				<View style={styles.itemContent}>
					<Text numberOfLines={1} style={styles.itemTitle}>
						{item.name}
					</Text>
					<Text numberOfLines={1} style={styles.itemSubtitle}>
						Playlist
					</Text>
				</View>
			</Pressable>
		);
	};

	const renderSectionHeader = ({ section }: { section: any }) => (
		<View style={styles.sectionHeader}>
			<Text style={styles.sectionTitle}>{section.title}</Text>
		</View>
	);

	return (
		<SafeAreaView style={styles.container}>
			<SectionList
				contentContainerStyle={styles.listContent}
				keyExtractor={(item) => item.id}
				renderItem={({ item, section }) => {
					if (section.type === "album") {
						return renderAlbumItem(item as AlbumItem);
					}
					if (section.type === "artist") {
						return renderArtistItem(item as ArtistItem);
					}
					if (section.type === "track") {
						return renderTrackItem(item as TrackItem);
					}
					return renderPlaylistItem(item as PlaylistItem);
				}}
				renderSectionHeader={renderSectionHeader}
				sections={sections}
				showsVerticalScrollIndicator={false}
			/>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: theme.colors.background,
	},
	listContent: {
		paddingBottom: 20,
	},
	sectionHeader: {
		paddingHorizontal: 16,
		paddingTop: 24,
		paddingBottom: 12,
		backgroundColor: theme.colors.background,
	},
	sectionTitle: {
		fontSize: 22,
		fontWeight: "700",
		color: theme.colors.textSecondary,
		letterSpacing: -0.5,
	},
	itemContainer: {
		flexDirection: "row",
		alignItems: "center",
		paddingHorizontal: 16,
		paddingVertical: 8,
		backgroundColor: "transparent",
	},
	itemPressed: {
		opacity: 0.6,
		backgroundColor:
			theme.colors.backgroundSecondary || "rgba(255, 255, 255, 0.05)",
	},
	imageContainer: {
		marginRight: 12,
	},
	albumImage: {
		width: 56,
		height: 56,
		borderRadius: 4,
	},
	artistImage: {
		width: 56,
		height: 56,
		borderRadius: 28,
	},
	placeholderImage: {
		backgroundColor: theme.colors.surface || "#1a1a1a",
		justifyContent: "center",
		alignItems: "center",
	},
	placeholderText: {
		fontSize: 24,
		color: theme.colors.textSecondary || "#888",
	},
	itemContent: {
		flex: 1,
		justifyContent: "center",
	},
	itemTitle: {
		fontSize: 16,
		fontWeight: "600",
		color: theme.colors.textSecondary,
		marginBottom: 4,
	},
	itemSubtitle: {
		fontSize: 13,
		color: theme.colors.textSecondary || "#b3b3b3",
	},
	emptyState: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		paddingHorizontal: 32,
	},
	emptyStateTitle: {
		fontSize: 20,
		fontWeight: "700",
		color: theme.colors.textSecondary,
		marginBottom: 8,
	},
	emptyStateSubtitle: {
		fontSize: 14,
		color: theme.colors.textSecondary || "#b3b3b3",
		textAlign: "center",
	},
});
