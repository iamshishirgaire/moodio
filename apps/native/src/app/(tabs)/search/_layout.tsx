import { IconBroadcast } from "@tabler/icons-react-native";
import { Stack, useRouter } from "expo-router";
import { headerStyles } from "@/components/header";
import { IconButton } from "@/components/ui/icon-button";
import { theme } from "@/constants/theme";

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
						<IconButton
							onPress={() => {
								router.push("/recognize");
							}}
						>
							<IconBroadcast size={22} />
						</IconButton>
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
