import { IconBroadcast } from "@tabler/icons-react-native";
import { Stack, useRouter } from "expo-router";
import { headerStyles } from "@/components/header";
import { IconButton } from "@/components/ui/icon-button";
import { theme } from "@/constants/theme";
import { View } from "react-native";

export default function SearchLayout() {
	const router = useRouter();
	return (
		<Stack>
			<Stack.Screen
				name="index"
				options={{
					...headerStyles,
					headerTransparent: true,
					title: "Search",
					headerTitleStyle: {
						color: theme.colors.textSecondary,
					},
					headerLargeTitleStyle: {
						color: theme.colors.textSecondary,
					},
					headerRight: () => (
						<View style={{
						  flexDirection: "row",
								alignItems: "center",
								gap: 8,
						}}>
						<IconButton
							onPress={() => {
								router.push("/recognize");
							}}
						>
							<IconBroadcast size={22} />
						</IconButton>
						<IconButton
							onPress={() => {
								router.push("/mood-detect");
							}}
						>
							<IconBroadcast size={22} />
						</IconButton>

						</View>
					),
					headerSearchBarOptions: {
						allowToolbarIntegration: true,
						placement: "automatic",
						hideWhenScrolling: true,
						placeholder: "Artists, albums and more",

						onFocus: () => {
							router.setParams({ isSearchActive: 1 });
						},
						onBlur: () => {
							router.setParams({ isSearchActive: 0 });
						},
						onClose: () => {
							router.setParams({ isSearchActive: 0 });
						},

						onChangeText: (text) => {
							router.setParams({ query: text.nativeEvent.text });
						},
					},
				}}
			/>
		</Stack>
	);
}
