import { Stack } from "expo-router";
import { headerStyles } from "@/components/header";

export default function RadioLayout() {
	return (
		<Stack>
			<Stack.Screen
				name="index"
				options={{
					...headerStyles,
					title: "Radio",
				}}
			/>
		</Stack>
	);
}
