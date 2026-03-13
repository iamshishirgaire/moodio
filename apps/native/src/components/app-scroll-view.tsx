/** biome-ignore-all lint/nursery/noLeakedRender: <> */
import { BlurView } from "expo-blur";
import type { ReactNode } from "react";
import {
	ActivityIndicator,
	StyleSheet,
	View,
	type ViewStyle,
} from "react-native";
import Animated, {
	Extrapolation,
	interpolate,
	useAnimatedScrollHandler,
	useAnimatedStyle,
	useSharedValue,
	withSpring,
	withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { scheduleOnRN } from "react-native-worklets";

const PULL_TO_REFRESH_THRESHOLD = 120;

type AppScrollViewProps = {
	children: ReactNode;
	onRefresh: () => Promise<void>;
	refreshing?: boolean;
	showBlurOnScroll?: boolean;
	blurIntensity?: number;
	blurTint?: "light" | "dark" | "default";
	contentContainerStyle?: ViewStyle;
	indicatorColor?: string;
	backgroundColor?: string;
	showsVerticalScrollIndicator?: boolean;
};

export default function AppScrollView({
	children,
	onRefresh,
	refreshing = false,
	showBlurOnScroll = true,
	blurIntensity = 80,
	blurTint = "light",
	indicatorColor = "#007AFF",
	backgroundColor = "#fff",
	showsVerticalScrollIndicator = false,
	contentContainerStyle = {},
}: AppScrollViewProps) {
	const insets = useSafeAreaInsets();
	const scrollY = useSharedValue(0);
	const blurOpacity = useSharedValue(0);
	const pullDistance = useSharedValue(0);
	const isRefreshing = useSharedValue(false);

	const handleRefresh = async () => {
		isRefreshing.value = true;
		await onRefresh();
		isRefreshing.value = false;
		pullDistance.value = withSpring(0);
	};

	const triggerRefresh = () => {
		if (!(refreshing || isRefreshing.value)) {
			handleRefresh();
		}
	};

	const scrollHandler = useAnimatedScrollHandler({
		onScroll: (event) => {
			const currentScrollY = event.contentOffset.y;

			// Handle pull to refresh
			if (currentScrollY < 0 && !isRefreshing.value) {
				pullDistance.value = Math.abs(currentScrollY);
			} else if (!isRefreshing.value) {
				pullDistance.value = 0;
			}

			// Show blur when scrolling
			if (showBlurOnScroll) {
				if (currentScrollY > insets.top) {
					blurOpacity.value = withTiming(1, { duration: 200 });
				} else {
					blurOpacity.value = withTiming(0, { duration: 200 });
				}
			}

			scrollY.value = currentScrollY;
		},
		onEndDrag: (event) => {
			const currentScrollY = event.contentOffset.y;

			if (currentScrollY < -PULL_TO_REFRESH_THRESHOLD && !isRefreshing.value) {
				scheduleOnRN(triggerRefresh);
			} else if (!isRefreshing.value) {
				pullDistance.value = withSpring(0);
			}
		},
	});

	const blurAnimatedStyle = useAnimatedStyle(() => ({
		opacity: blurOpacity.value,
	}));

	const refreshIndicatorStyle = useAnimatedStyle(() => {
		const translateY = interpolate(
			pullDistance.value,
			[0, PULL_TO_REFRESH_THRESHOLD],
			[-60, 0],
			Extrapolation.CLAMP,
		);

		const opacity = interpolate(
			pullDistance.value,
			[0, PULL_TO_REFRESH_THRESHOLD / 2, PULL_TO_REFRESH_THRESHOLD],
			[0, 0.5, 1],
			Extrapolation.CLAMP,
		);

		const scale = interpolate(
			pullDistance.value,
			[0, PULL_TO_REFRESH_THRESHOLD],
			[0.5, 1],
			Extrapolation.CLAMP,
		);

		return {
			transform: [{ translateY }, { scale }],
			opacity,
		};
	});
	const paddingStyleZ = useAnimatedStyle(() => ({
		paddingTop: isRefreshing.value ? withSpring(60) : withSpring(0),
	}));
	return (
		<View style={[styles.container, { backgroundColor }]}>
			{showBlurOnScroll && (
				<Animated.View
					pointerEvents="none"
					style={[
						{
							position: "absolute",
							top: 0,
							left: 0,
							right: 0,
							height: insets.top,
							zIndex: 10,
						},
						blurAnimatedStyle,
					]}
				>
					<BlurView
						intensity={blurIntensity}
						style={{ flex: 1 }}
						tint={blurTint}
					/>
				</Animated.View>
			)}

			{/* Custom Pull to Refresh Indicator */}
			<Animated.View
				pointerEvents="none"
				style={[
					{
						position: "absolute",
						top: insets.top + 10,
						left: 0,
						right: 0,
						alignItems: "center",
						justifyContent: "center",
						zIndex: 5,
					},
					refreshIndicatorStyle,
				]}
			>
				<View
					style={[
						{
							backgroundColor: "rgba(255, 255, 255, 0.9)",
							borderRadius: 20,
							padding: 10,
							shadowColor: "#000",
							shadowOffset: { width: 0, height: 2 },
							shadowOpacity: 0.1,
							shadowRadius: 4,
							elevation: 3,
						},
					]}
				>
					<ActivityIndicator color={indicatorColor} size="small" />
				</View>
			</Animated.View>

			<Animated.ScrollView
				bounces={true}
				contentContainerStyle={contentContainerStyle}
				onScroll={scrollHandler}
				scrollEventThrottle={16}
				showsVerticalScrollIndicator={showsVerticalScrollIndicator}
				style={[styles.scrollView, paddingStyleZ]}
			>
				{children}
			</Animated.ScrollView>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	scrollView: {
		flex: 1,
	},
});
