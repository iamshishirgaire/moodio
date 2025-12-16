import { LinearGradient } from "expo-linear-gradient";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
	type SharedValue,
	useAnimatedStyle,
	withSpring,
	withTiming,
} from "react-native-reanimated";
import { theme } from "@/constants/theme";
import LogoSvg from "./logo";

// Simplified red gradient palette
const colors = {
	primary: "#E00000",

	// Red gradient background
	gradientTop: "#FF4444",
	gradientMiddle: "#E00000",
	gradientBottom: "#CC0000",

	// Clearly separated white circles
	innermost: "#FFFFFF", // Solid white
	middle: "rgba(255, 255, 255, 0.5)", // 50% white
	outer: "rgba(255, 255, 255, 0.25)", // 25% white
	outermost: "rgba(255, 255, 255, 0.12)", // 12% white
};

type Props = {
	audioLevel: SharedValue<number>;
	isRecordingShared: SharedValue<number>;
	pulseAnim: SharedValue<number>;
	isRecordingBool: boolean;
	onPress: () => void;
	wsConnected: boolean;
	isListening: boolean;
};

export default function RecordingVisualizer({
	audioLevel,
	isRecordingShared,
	onPress,
}: Props) {
	// Outermost circle
	const circle1Style = useAnimatedStyle(() => {
		const isActive = isRecordingShared.value > 0;
		const audioScale = isActive ? 1 + audioLevel.value * 0.4 : 1;
		const targetScale = isActive ? audioScale : 0;

		return {
			transform: [
				{
					scale: withSpring(targetScale, {
						damping: 20,
						stiffness: 90,
					}),
				},
			],
			opacity: withTiming(isActive ? 1 : 0, { duration: 300 }),
		};
	});

	// Outer circle
	const circle2Style = useAnimatedStyle(() => {
		const isActive = isRecordingShared.value > 0;
		const audioScale = isActive ? 1 + audioLevel.value * 0.3 : 1;
		const targetScale = isActive ? audioScale : 0;

		return {
			transform: [
				{
					scale: withSpring(targetScale, {
						damping: 22,
						stiffness: 100,
					}),
				},
			],
			opacity: withTiming(isActive ? 1 : 0, { duration: 300 }),
		};
	});

	// Middle circle
	const circle3Style = useAnimatedStyle(() => {
		const isActive = isRecordingShared.value > 0;
		const audioScale = isActive ? 1 + audioLevel.value * 0.2 : 1;
		const targetScale = isActive ? audioScale : 0;

		return {
			transform: [
				{
					scale: withSpring(targetScale, {
						damping: 25,
						stiffness: 110,
					}),
				},
			],
			opacity: withTiming(isActive ? 1 : 0, { duration: 300 }),
		};
	});

	// Innermost circle
	const circle4Style = useAnimatedStyle(() => {
		const isActive = isRecordingShared.value > 0;
		const audioScale = isActive ? 1 + audioLevel.value * 0.15 : 1;
		const targetScale = isActive ? audioScale : 0;

		return {
			transform: [
				{
					scale: withSpring(targetScale, {
						damping: 28,
						stiffness: 120,
					}),
				},
			],
			opacity: withTiming(isActive ? 1 : 0, { duration: 300 }),
		};
	});

	// Main button
	const buttonStyle = useAnimatedStyle(() => {
		const isActive = isRecordingShared.value > 0;
		const scale = isActive ? 1 + audioLevel.value * 0.08 : 1;
		return {
			transform: [
				{
					scale: withSpring(scale, {
						damping: 30,
						stiffness: 150,
					}),
				},
			],
		};
	});

	// Animated title and subtitle
	const titleStyle = useAnimatedStyle(() => {
		const isActive = isRecordingShared.value > 0;
		return {
			opacity: withTiming(isActive ? 1 : 0, { duration: 400 }),
			transform: [
				{
					translateY: withSpring(isActive ? 0 : 20, {
						damping: 20,
						stiffness: 90,
					}),
				},
			],
		};
	});

	return (
		<LinearGradient
			colors={[
				colors.gradientTop,
				colors.gradientMiddle,
				colors.gradientBottom,
			]}
			end={{ x: 0, y: 1 }}
			start={{ x: 0, y: 0 }}
			style={styles.container}
		>
			<View style={styles.visualizer}>
				{/* Outermost circle - most transparent */}
				<Animated.View style={[styles.circle1, circle1Style]} />

				{/* Outer circle */}
				<Animated.View style={[styles.circle2, circle2Style]} />

				{/* Middle circle */}
				<Animated.View style={[styles.circle3, circle3Style]} />

				{/* Innermost circle - most opaque */}
				<Animated.View style={[styles.circle4, circle4Style]} />

				{/* Center button with logo */}
				<Animated.View style={buttonStyle}>
					<Pressable onPress={onPress} style={styles.button}>
						<View style={styles.buttonInner}>
							<LogoSvg color={theme.colors.primary} height={50} width={50} />
						</View>
					</Pressable>
				</Animated.View>
			</View>

			{/* Animated listening indicator */}
			<Animated.View style={[styles.listeningContainer, titleStyle]}>
				<Text style={styles.listeningText}>Listening for music</Text>
				<Text style={styles.subtitleText}>
					Make sure your device can hear the song clearly
				</Text>
			</Animated.View>
		</LinearGradient>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
	},
	visualizer: {
		width: 450,
		height: 450,
		alignItems: "center",
		justifyContent: "center",
	},
	circle1: {
		position: "absolute",
		width: 440,
		height: 440,
		borderRadius: 220,
		backgroundColor: colors.outermost,
	},
	circle2: {
		position: "absolute",
		width: 360,
		height: 360,
		borderRadius: 180,
		backgroundColor: colors.outer,
	},
	circle3: {
		position: "absolute",
		width: 280,
		height: 280,
		borderRadius: 140,
		backgroundColor: colors.middle,
	},
	circle4: {
		position: "absolute",
		width: 200,
		height: 200,
		borderRadius: 100,
		backgroundColor: colors.innermost,
	},
	button: {
		width: 170,
		height: 170,
		borderRadius: 85,
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "transparent",
	},
	buttonInner: {
		width: 170,
		height: 170,
		borderRadius: 85,
		backgroundColor: "#FFFFFF",
		shadowColor: "#FFFFFF",
		shadowOffset: { width: 0, height: 0 },
		shadowOpacity: 0.6,
		shadowRadius: 20,
		elevation: 10,
		alignItems: "center",
		justifyContent: "center",
	},
	listeningContainer: {
		position: "absolute",
		bottom: 120,
		alignItems: "center",
		gap: 8,
	},
	dotsContainer: {
		flexDirection: "row",
		gap: 6,
		marginBottom: 8,
	},
	dot: {
		width: 6,
		height: 24,
		backgroundColor: "#FFFFFF",
		borderRadius: 3,
	},
	listeningText: {
		fontSize: 22,
		fontWeight: "600",
		color: "#FFFFFF",
		letterSpacing: 0.5,
	},
	subtitleText: {
		fontSize: 15,
		fontWeight: "400",
		color: "rgba(255, 255, 255, 0.7)",
		textAlign: "center",
		marginTop: 4,
		paddingHorizontal: 40,
	},
});
