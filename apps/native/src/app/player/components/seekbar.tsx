// components/player/SeekBar.tsx

import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import Slider from "@/components/ui/slider";
import { theme } from "@/constants/theme";

type SeekBarProps = {
	currentTime: number; // in milliseconds
	duration: number; // in milliseconds
	onSeek: (time: number) => void;
	isBuffering?: boolean;
};

export default function SeekBar({ currentTime, duration }: SeekBarProps) {
	const [isSeeking, setIsSeeking] = useState(false);
	const [seekTime, setSeekTime] = useState(0);

	const formatTime = (ms: number) => {
		const totalSeconds = Math.floor(ms / 1000);
		const minutes = Math.floor(totalSeconds / 60);
		const seconds = totalSeconds % 60;
		return `${minutes}:${seconds.toString().padStart(2, "0")}`;
	};

	const displayTime = isSeeking ? seekTime : currentTime;

	return (
		<View style={styles.seekContainer}>
			<Slider
				max={duration}
				min={0}
				onChange={(value) => {
					setSeekTime(value);
				}}
				onSeekingStart={() => {
					setIsSeeking(true);
				}}
				onSeekingStop={() => {
					setIsSeeking(false);
				}}
				value={displayTime}
			/>
			<View style={styles.timeContainer}>
				<Text style={styles.timeText}>{formatTime(displayTime)}</Text>
				<Text style={styles.timeText}>{formatTime(duration)}</Text>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	seekContainer: {
		width: "100%",
		paddingHorizontal: theme.spacing.lg,
	},
	slider: {
		width: "100%",
		height: 40,
	},
	timeContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		paddingHorizontal: theme.spacing.xs,
	},
	timeText: {
		fontSize: theme.typography.fontSizes.xs,
		color: theme.colors.textSecondary,
		fontWeight: theme.typography.fontWeights.medium,
	},
});
