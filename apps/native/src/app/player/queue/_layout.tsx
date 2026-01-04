import { Stack } from "expo-router";

export default function QueueLayout() {
	return (
		<Stack>
			<Stack.Screen
				name="index"
				options={{
					presentation: "modal",
					headerShown: false,
				}}
			/>
		</Stack>
	);
}
