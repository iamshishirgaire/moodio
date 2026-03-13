import { useQuery } from "@tanstack/react-query";
import {
	ActivityIndicator,
	Modal,
	Pressable,
	StyleSheet,
	Text,
	View,
} from "react-native";
import { theme } from "@/constants/theme";
import { client, orpc, queryClient } from "@/utils/orpc";

type Props = {
	visible: boolean;
	trackId?: string | null;
	onClose: () => void;
};

export default function PlaylistPickerSheet({
	visible,
	trackId,
	onClose,
}: Props) {
	const { data, isLoading } = useQuery({
		...orpc.library.getPlaylists.queryOptions(),
		enabled: visible,
	});

	const handleAdd = async (playlistId: string) => {
		if (!trackId) {
			return;
		}

		await client.library.addTrackToPlaylist({ playlistId, trackId });
		await queryClient.invalidateQueries();
		onClose();
	};

	return (
		<Modal
			animationType="slide"
			onRequestClose={onClose}
			presentationStyle="formSheet"
			transparent
			visible={visible}
		>
			<View style={styles.overlay}>
				<Pressable onPress={onClose} style={styles.backdrop} />
				<View style={styles.sheet}>
					<Text style={styles.title}>Add to Playlist</Text>
					{isLoading ? (
						<View style={styles.center}>
							<ActivityIndicator color={theme.colors.primary} size="small" />
						</View>
					) : (data?.length || 0) === 0 ? (
						<View style={styles.center}>
							<Text style={styles.emptyText}>No playlists found.</Text>
						</View>
					) : (
						data?.map((playlist) => (
							<Pressable
								key={playlist.id}
								onPress={() => handleAdd(playlist.id)}
								style={({ pressed }) => [
									styles.row,
									pressed && styles.rowPressed,
								]}
							>
								<Text style={styles.rowTitle}>{playlist.name}</Text>
								<Text style={styles.rowSubtitle}>
									{playlist.trackCount} song
									{playlist.trackCount === 1 ? "" : "s"}
								</Text>
							</Pressable>
						))
					)}
				</View>
			</View>
		</Modal>
	);
}

const styles = StyleSheet.create({
	overlay: {
		flex: 1,
		justifyContent: "flex-end",
	},
	backdrop: {
		...StyleSheet.absoluteFillObject,
		backgroundColor: "rgba(0,0,0,0.35)",
	},
	sheet: {
		backgroundColor: theme.colors.background,
		padding: theme.spacing.md,
		borderTopLeftRadius: theme.borderRadius.lg,
		borderTopRightRadius: theme.borderRadius.lg,
		minHeight: 360,
		paddingBottom: theme.spacing.xl,
	},
	title: {
		fontSize: 18,
		fontWeight: "700",
		color: theme.colors.textPrimary,
		marginBottom: theme.spacing.sm,
	},
	center: {
		paddingVertical: theme.spacing.md,
		alignItems: "center",
	},
	emptyText: {
		color: theme.colors.textSecondary,
	},
	row: {
		paddingVertical: theme.spacing.md,
		minHeight: 56,
		borderRadius: theme.borderRadius.sm,
	},
	rowPressed: {
		backgroundColor: theme.colors.backgroundSecondary,
	},
	rowTitle: {
		color: theme.colors.textPrimary,
		fontSize: 16,
		fontWeight: "600",
	},
	rowSubtitle: {
		color: theme.colors.textSecondary,
		fontSize: 12,
		marginTop: 4,
	},
});
