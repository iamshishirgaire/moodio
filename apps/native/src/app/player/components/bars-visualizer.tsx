import type React from "react";
import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
	cancelAnimation,
	Easing,
	useAnimatedStyle,
	useSharedValue,
	withDelay,
	withRepeat,
	withTiming,
} from "react-native-reanimated";

type AnimatedBarProps = {
	baseHeight: number;
	delay?: number;
	isPlaying: boolean;
};

const AnimatedBar: React.FC<AnimatedBarProps> = ({
	baseHeight,
	delay = 0,
	isPlaying,
}) => {
	const scaleY = useSharedValue<number>(1);

	useEffect(() => {
		if (isPlaying) {
			scaleY.value = withDelay(
				delay,
				withRepeat(
					withTiming(1.8, {
						duration: 400,
						easing: Easing.inOut(Easing.ease),
					}),
					-1,
					true
				)
			);
		} else {
			cancelAnimation(scaleY);
			scaleY.value = 1;
		}
	}, [isPlaying, delay, scaleY]);

	const animatedStyle = useAnimatedStyle(() => ({
		transform: [{ scaleY: scaleY.value }],
	}));

	if (isPlaying === false) {
		return null;
	}
	return (
		<Animated.View
			style={[styles.bar, { height: baseHeight }, animatedStyle]}
		/>
	);
};

type PlayingIndicatorProps = {
	isPlaying: boolean;
};

const PlayingIndicator: React.FC<PlayingIndicatorProps> = ({ isPlaying }) => (
	<View style={styles.playingIndicator}>
		<AnimatedBar baseHeight={8} isPlaying={isPlaying} />
		<AnimatedBar baseHeight={14} delay={120} isPlaying={isPlaying} />
		<AnimatedBar baseHeight={10} delay={240} isPlaying={isPlaying} />
	</View>
);

export default PlayingIndicator;

const styles = StyleSheet.create({
	playingIndicator: {
		flexDirection: "row",
		alignItems: "flex-end",
		gap: 4,
	},
	bar: {
		width: 3,
		borderRadius: 4,
		backgroundColor: "#e00606ff",
	},
});
