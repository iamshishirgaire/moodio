import { useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { queryClient } from "@/app/_layout";
import AppScrollView from "@/components/app-scroll-view";
import { CircleAvatar } from "@/components/ui/circle-avatar";
import Spacer from "@/components/ui/spacer";
import { theme } from "@/constants/theme";
import { authClient } from "@/lib/auth-client";
import FilterRow from "./components/filter-row";
import LatestAlbums from "./components/sections/latest-albums";
import LatestSingles from "./components/sections/latest-singles";
export default function Page() {
	const insets = useSafeAreaInsets();
	const [refreshing, setRefreshing] = useState(false);

	const onRefresh = async () => {
		setRefreshing(true);
		await queryClient.invalidateQueries({
			queryKey: ["albums-albums", "singles-singles"],
		});
		setRefreshing(true);
	};
	const router = useRouter();
	const { data } = authClient.useSession();
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
			<View
				style={{
					height: insets.top + 60,
					flexDirection: "row",
					justifyContent: "flex-end",
					alignItems: "flex-end",
					paddingBottom: theme.spacing.sm,
					paddingHorizontal: theme.spacing.md,
					paddingTop: insets.top,
				}}
			>
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
			</View>

			<FilterRow />
			<Spacer height={theme.spacing.xxl} />
			<LatestAlbums />
			<LatestSingles />
		</AppScrollView>
	);
}

const styles = StyleSheet.create({
	scrollContent: {
		paddingBottom: 100,
	},
});
