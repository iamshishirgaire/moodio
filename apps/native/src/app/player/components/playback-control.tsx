import {
	IconArrowsShuffle,
	IconPlayerPauseFilled,
	IconPlayerPlayFilled,
	IconPlayerSkipBack,
	IconPlayerSkipForward,
	IconRepeat,
	IconRepeatOff,
	IconRepeatOnce,
} from "@tabler/icons-react-native";
import { StyleSheet, View } from "react-native";
import { IconButton } from "@/components/ui/icon-button";
import { theme } from "@/constants/theme";
import { useMusicPlayer } from "@/store/player/player";

export default function PlaybackControls() {
	const {
		playbackState,
		isShuffled,
		repeatMode,
		togglePlayPause,
		playPrevious,
		playNext,
		toggleShuffle,
		toggleRepeat,
	} = useMusicPlayer();

	const isPlaying = playbackState === "playing";

	return (
		<View style={styles.container}>
			{/* Shuffle */}
			<IconButton onPress={toggleShuffle}>
				<IconArrowsShuffle
					color={isShuffled ? theme.colors.primary : theme.colors.textSecondary}
					size={22}
				/>
			</IconButton>

			{/* Previous */}
			<IconButton onPress={playPrevious}>
				<IconPlayerSkipBack color={theme.colors.textSecondary} size={22} />
			</IconButton>

			{/* Play / Pause */}
			{isPlaying ? (
				<IconButton
					btnstyle={{
						backgroundColor: theme.colors.primary,
						height: 60,
						width: 60,
						borderRadius: 30,
					}}
					onPress={togglePlayPause}
				>
					<IconPlayerPauseFilled color={theme.colors.textPrimary} size={32} />
				</IconButton>
			) : (
				<IconButton
					btnstyle={{
						backgroundColor: theme.colors.primary,
						height: 60,
						width: 60,
						borderRadius: 30,
					}}
					onPress={togglePlayPause}
				>
					<IconPlayerPlayFilled color={theme.colors.textPrimary} size={32} />
				</IconButton>
			)}

			{/* Next */}
			<IconButton onPress={playNext}>
				<IconPlayerSkipForward color={theme.colors.textSecondary} size={22} />
			</IconButton>

			{/* Repeat */}
			<IconButton onPress={toggleRepeat}>
				{repeatMode === "track" ? (
					<IconRepeatOnce color={theme.colors.primary} size={22} />
					// biome-ignore lint/style/noNestedTernary: <>
				) : repeatMode === "off" ? (
					<IconRepeatOff color={theme.colors.textSecondary} size={22} />
				) : (
					<IconRepeat color={theme.colors.primary} size={22} />
				)}
			</IconButton>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		paddingHorizontal: theme.spacing.lg,
		paddingVertical: theme.spacing.md,
	},
});
