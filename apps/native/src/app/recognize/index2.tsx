import { IconChevronLeft } from "@tabler/icons-react-native";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { View } from "react-native";
import {
	Easing,
	useSharedValue,
	withRepeat,
	withSpring,
	withTiming,
} from "react-native-reanimated";
import { IconButton } from "@/components/ui/icon-button";
import { theme } from "@/constants/theme";
import RecordingVisualizer from "./components/recording-visualizer";
import useSongRecognition from "./hooks/use-song-recognition";

export default function RecordScreen() {
	const {
		isListening,
		level,
		wsConnected,
		songResult,
		start,
		stop,
		clearResult,
	} = useSongRecognition();
	const router = useRouter();

	// Shared values for animations
	const audioLevel = useSharedValue(0);
	const isRecordingShared = useSharedValue(0);
	const pulseAnim = useSharedValue(0);

	// Update audio level with responsive spring animation
	useEffect(() => {
		audioLevel.value = withSpring(level, {
			damping: 8,
			stiffness: 100,
			mass: 0.5,
		});
	}, [level, audioLevel]);

	// Continuous pulse animation when recording
	// biome-ignore lint/correctness/useExhaustiveDependencies: <>
	useEffect(() => {
		if (isListening) {
			isRecordingShared.value = withSpring(1, { damping: 12 });
			pulseAnim.value = withRepeat(
				withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
				-1,
				true,
			);
		} else {
			isRecordingShared.value = withSpring(0);
			pulseAnim.value = 0;
			audioLevel.value = withSpring(0);
		}
	}, [isListening]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <>
	useEffect(() => {
		if (songResult) {
			const r = songResult;
			const params = {
				title: r.title,
				artist: r.artist,
				confidence: String(r.confidence),
				album: r.album ?? undefined,
				artwork: r.artwork ?? undefined,
				artistImage: r.artistImage ?? undefined,
				artistUrl: r.externalUrls?.artist ?? undefined,
				albumUrl: r.externalUrls?.album ?? undefined,
			} as const;
			// Defer navigation to avoid race conditions with recorder/WebSocket teardown
			setTimeout(() => {
				try {
					router.push({ pathname: "/recognize/result", params });
				} finally {
					// Clear after navigation is initiated
					clearResult();
				}
			}, 0);
		}
	}, [songResult]);

	return (
		<View style={{ flex: 1 }}>
			<RecordingVisualizer
				audioLevel={audioLevel}
				isListening={isListening}
				isRecordingBool={isListening}
				isRecordingShared={isRecordingShared}
				// biome-ignore lint/nursery/noLeakedRender: <>
				onPress={isListening === true ? stop : start}
				pulseAnim={pulseAnim}
				wsConnected={wsConnected}
			/>
			<IconButton
				btnstyle={{
					position: "absolute",
					top: 74,
					left: 22,
					backgroundColor: theme.colors.background,
				}}
				onPress={() => router.back()}
			>
				<IconChevronLeft size={22} />
			</IconButton>
		</View>
	);
}
