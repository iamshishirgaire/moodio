import { Stack } from "expo-router";
import { theme } from "@/constants/theme";

export default function AuthLayout() {
	return (
		<Stack
			screenOptions={{
				headerShadowVisible: false,
				headerStyle: {
					backgroundColor: theme.colors.background,
				},
				headerBackVisible: true,
				headerTitleStyle: {
					color: theme.colors.textSecondary,
				},
				headerBackButtonDisplayMode: "minimal",
			}}
		>
			<Stack.Screen
				name="index"
				options={{
					headerShown: false,
					title: "Welcome",
				}}
			/>
			<Stack.Screen
				name="signin"
				options={{
					headerShown: true,
					title: "Login",
				}}
			/>
			<Stack.Screen
				name="signup"
				options={{
					headerShown: true,
					title: "Create Account",
				}}
			/>
			<Stack.Screen
				name="onboarding"
				options={{
					headerShown: true,
					title: "Onboarding",
				}}
			/>
		</Stack>
	);
}
