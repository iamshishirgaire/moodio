import { Stack } from "expo-router";

export default function RecognizeLayout() {
	return (
		<Stack>
			<Stack.Screen
				name="index"
				options={{
					title: "",
					headerShadowVisible: false,
					headerTransparent: true,
					headerShown: false,
				}}
			/>
			<Stack.Screen
				name="result"
				options={{
					headerShown: false,
					presentation: "fullScreenModal",
				}}
			/>
		</Stack>
	);
}
