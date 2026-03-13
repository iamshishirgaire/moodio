import { queryClient } from "@/app/_layout";
import AppScrollView from "@/components/app-scroll-view";
import { CircleAvatar } from "@/components/ui/circle-avatar";
import Spacer from "@/components/ui/spacer";
import { Text } from "@/components/ui/text";
import { theme } from "@/constants/theme";
import { authClient } from "@/lib/auth-client";
import { useAlbumStore } from "@/store/home/album";
import { client, orpc } from "@/utils/orpc";
import {
	IconArrowsSort,
	IconDownload,
	IconLayoutGrid,
	IconPin,
	IconPlus,
	IconSearch,
} from "@tabler/icons-react-native";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import {
	ActivityIndicator,
	Image,
	Modal,
	Pressable,
	StyleSheet,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import LibraryFilterRow from "./components/library-filter-row";

type SortOption = "recents" | "alphabetical";

type LibraryItem = {
	id: string;
	type: "playlist" | "album";
	title: string;
	subtitle: string;
	image?: string;
	isPinned?: boolean;
	isDownloaded?: boolean;
	sortDate?: string;
	albumData?: any;
};

export default function LibraryPage() {
	const insets = useSafeAreaInsets();
	const router = useRouter();
	const setAlbum = useAlbumStore((s) => s.setCurrent);
	const { data: session } = authClient.useSession();

	const [refreshing, setRefreshing] = useState(false);
	const [sortBy, setSortBy] = useState<SortOption>("recents");
	const [showCreateModal, setShowCreateModal] = useState(false);
	const [newPlaylistName, setNewPlaylistName] = useState("");
	const [isCreatingPlaylist, setIsCreatingPlaylist] = useState(false);

	const {
		data,
		isLoading,
		isFetching,
		refetch,
	} = useQuery(orpc.library.getLibrary.queryOptions());

	const libraryItems = useMemo(() => {
		const playlists: LibraryItem[] = (data?.playlists || []).map((playlist) => ({
			id: playlist.id,
			type: "playlist",
			title: playlist.name,
			subtitle: `Playlist • ${playlist.trackCount} song${playlist.trackCount === 1 ? "" : "s"}`,
			image: playlist.thumbnail || undefined,
			isPinned: false,
			sortDate: (playlist.updatedAt as unknown as string) || undefined,
		}));

		const albums: LibraryItem[] = (data?.savedAlbums || []).map((album) => ({
			id: album.id,
			type: "album",
			title: album.name,
			subtitle: `Album • ${album.artistName || "Unknown Artist"}`,
			image: album.images?.[0]?.url,
			isDownloaded: false,
			sortDate: (album.savedAt as unknown as string) || undefined,
			albumData: album,
		}));

		const all = [...playlists, ...albums];

		if (sortBy === "alphabetical") {
			return all.sort((a, b) => a.title.localeCompare(b.title));
		}

		return all.sort((a, b) => {
			const first = a.sortDate ? new Date(a.sortDate).getTime() : 0;
			const second = b.sortDate ? new Date(b.sortDate).getTime() : 0;
			return second - first;
		});
	}, [data?.playlists, data?.savedAlbums, sortBy]);

	const onRefresh = async () => {
		setRefreshing(true);
		await queryClient.invalidateQueries();
		await refetch();
		setRefreshing(false);
	};

	const createPlaylist = async () => {
		const trimmed = newPlaylistName.trim();
		if (!trimmed) {
			return;
		}

		try {
			setIsCreatingPlaylist(true);
			await client.library.createPlaylist({ name: trimmed });
			setNewPlaylistName("");
			setShowCreateModal(false);
			await refetch();
		} finally {
			setIsCreatingPlaylist(false);
		}
	};

	const renderLibraryItem = (item: LibraryItem) => (
		<Pressable
			key={`${item.type}-${item.id}`}
			style={({ pressed }) => [styles.libraryItem, pressed && styles.itemPressed]}
			onPress={() => {
				if (item.type === "album" && item.albumData) {
					setAlbum(item.albumData);
					router.push("/album");
					return;
				}
				router.push({ pathname: "/playlist/[id]", params: { id: item.id } } as never);
			}}
		>
			{item.image ? (
				<Image source={{ uri: item.image }} style={styles.itemImage} />
			) : (
				<View style={[styles.itemImage, styles.itemImagePlaceholder]}>
					<Text style={styles.placeholderText}>♪</Text>
				</View>
			)}
			<View style={styles.itemInfo}>
				<Text style={styles.itemTitle} numberOfLines={1}>
					{item.title}
				</Text>
				<View style={styles.itemSubtitleRow}>
					{item.isPinned && (
						<View style={styles.badge}>
							<IconPin color={theme.colors.primary} size={14} />
						</View>
					)}
					{item.isDownloaded && (
						<View style={styles.badge}>
							<IconDownload color={theme.colors.primary} size={14} />
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
		<>
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
								name={session?.user.name}
								source={{ uri: session?.user.image ?? undefined }}
							/>
						</TouchableOpacity>
						<Text style={styles.headerTitle}>Your Library</Text>
					</View>
					<View style={styles.headerRight}>
						<TouchableOpacity style={styles.iconButton}>
							<IconSearch color={theme.colors.textPrimary} size={24} />
						</TouchableOpacity>
						<TouchableOpacity
							onPress={() => setShowCreateModal(true)}
							style={styles.iconButton}
						>
							<IconPlus color={theme.colors.textPrimary} size={24} />
						</TouchableOpacity>
					</View>
				</View>

				<LibraryFilterRow />
				<Spacer height={theme.spacing.md} />

				<View style={styles.sortContainer}>
					<TouchableOpacity
						style={styles.sortButton}
						onPress={() =>
							setSortBy(sortBy === "recents" ? "alphabetical" : "recents")
						}
					>
						<IconArrowsSort color={theme.colors.textPrimary} size={20} />
						<Text style={styles.sortText}>
							{sortBy === "recents" ? "Recents" : "Alphabetical"}
						</Text>
					</TouchableOpacity>
					<TouchableOpacity style={styles.gridButton}>
						<IconLayoutGrid color={theme.colors.textPrimary} size={24} />
					</TouchableOpacity>
				</View>

				<Spacer height={theme.spacing.sm} />

				<View style={styles.libraryList}>
					{isLoading || isFetching ? (
						<View style={styles.centerState}>
							<ActivityIndicator color={theme.colors.primary} size="small" />
						</View>
					) : libraryItems.length === 0 ? (
						<View style={styles.centerState}>
							<Text style={styles.emptyText}>No saved albums or playlists yet.</Text>
						</View>
					) : (
						libraryItems.map(renderLibraryItem)
					)}
				</View>

				<Spacer height={100} />
			</AppScrollView>

			<Modal
				animationType="slide"
				onRequestClose={() => setShowCreateModal(false)}
				transparent
				visible={showCreateModal}
			>
				<View style={styles.modalOverlay}>
					<View style={styles.modalCard}>
						<Text style={styles.modalTitle}>Create Playlist</Text>
						<TextInput
							autoFocus
							onChangeText={setNewPlaylistName}
							placeholder="Playlist name"
							placeholderTextColor={theme.colors.textTertiary}
							style={styles.modalInput}
							value={newPlaylistName}
						/>
						<View style={styles.modalActions}>
							<TouchableOpacity
								onPress={() => {
									setShowCreateModal(false);
									setNewPlaylistName("");
								}}
								style={styles.modalButton}
							>
								<Text style={styles.modalButtonText}>Cancel</Text>
							</TouchableOpacity>
							<TouchableOpacity
								disabled={isCreatingPlaylist}
								onPress={createPlaylist}
								style={[styles.modalButton, styles.modalButtonPrimary]}
							>
								<Text style={styles.modalButtonPrimaryText}>
									{isCreatingPlaylist ? "Creating..." : "Create"}
								</Text>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</Modal>
		</>
	);
}

const styles = StyleSheet.create({
	scrollContent: {
		paddingBottom: 100,
	},
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
	itemImagePlaceholder: {
		justifyContent: "center",
		alignItems: "center",
	},
	placeholderText: {
		color: theme.colors.textTertiary,
		fontSize: 24,
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
	centerState: {
		paddingVertical: theme.spacing.xl,
		alignItems: "center",
	},
	emptyText: {
		color: theme.colors.textSecondary,
	},
	modalOverlay: {
		flex: 1,
		backgroundColor: "rgba(0,0,0,0.4)",
		justifyContent: "center",
		padding: theme.spacing.lg,
	},
	modalCard: {
		backgroundColor: theme.colors.background,
		borderRadius: theme.borderRadius.md,
		padding: theme.spacing.md,
	},
	modalTitle: {
		fontSize: 18,
		fontWeight: "700",
		color: theme.colors.textPrimary,
		marginBottom: theme.spacing.sm,
	},
	modalInput: {
		borderRadius: theme.borderRadius.sm,
		borderWidth: 1,
		borderColor: theme.colors.backgroundSecondary,
		paddingHorizontal: theme.spacing.sm,
		paddingVertical: theme.spacing.sm,
		color: theme.colors.textPrimary,
	},
	modalActions: {
		marginTop: theme.spacing.md,
		flexDirection: "row",
		justifyContent: "flex-end",
		gap: theme.spacing.sm,
	},
	modalButton: {
		paddingHorizontal: theme.spacing.md,
		paddingVertical: theme.spacing.xs,
	},
	modalButtonText: {
		color: theme.colors.textSecondary,
		fontWeight: "600",
	},
	modalButtonPrimary: {
		backgroundColor: theme.colors.primary,
		borderRadius: theme.borderRadius.sm,
	},
	modalButtonPrimaryText: {
		color: theme.colors.surfaceSecondary,
		fontWeight: "700",
	},
});
