import { Stack } from "expo-router";
import { View } from "react-native";
import MiniPlayer from "@/app/player/components/mini-player";

export default function HomeLayout() {
	return (
		<View style={{ flex: 1 }}>
			<Stack>
				<Stack.Screen
					name="index"
					options={{
						headerShown: false,
					}}
				/>
				<Stack.Screen
					name="profile"
					options={{
						title: "",
						headerShadowVisible: false,
						headerShown: true,
						presentation: "modal",
					}}
				/>
			</Stack>
			<MiniPlayer />
		</View>
	);
}
