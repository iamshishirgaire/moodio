import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Poppins_100Thin } from "@expo-google-fonts/poppins/100Thin";
import { Poppins_100Thin_Italic } from "@expo-google-fonts/poppins/100Thin_Italic";
import { Poppins_200ExtraLight } from "@expo-google-fonts/poppins/200ExtraLight";
import { Poppins_200ExtraLight_Italic } from "@expo-google-fonts/poppins/200ExtraLight_Italic";
import { Poppins_300Light } from "@expo-google-fonts/poppins/300Light";
import { Poppins_300Light_Italic } from "@expo-google-fonts/poppins/300Light_Italic";
import { Poppins_400Regular } from "@expo-google-fonts/poppins/400Regular";
import { Poppins_400Regular_Italic } from "@expo-google-fonts/poppins/400Regular_Italic";
import { Poppins_500Medium } from "@expo-google-fonts/poppins/500Medium";
import { Poppins_500Medium_Italic } from "@expo-google-fonts/poppins/500Medium_Italic";
import { Poppins_600SemiBold } from "@expo-google-fonts/poppins/600SemiBold";
import { Poppins_600SemiBold_Italic } from "@expo-google-fonts/poppins/600SemiBold_Italic";
import { Poppins_700Bold } from "@expo-google-fonts/poppins/700Bold";
import { Poppins_700Bold_Italic } from "@expo-google-fonts/poppins/700Bold_Italic";
import { Poppins_800ExtraBold } from "@expo-google-fonts/poppins/800ExtraBold";
import { Poppins_800ExtraBold_Italic } from "@expo-google-fonts/poppins/800ExtraBold_Italic";
import { Poppins_900Black } from "@expo-google-fonts/poppins/900Black";
import { Poppins_900Black_Italic } from "@expo-google-fonts/poppins/900Black_Italic";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useFonts } from "expo-font";
import { useNetworkState } from "expo-network";
import { Stack } from "expo-router";
import { hideAsync, preventAutoHideAsync } from "expo-splash-screen";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import OfflineSnackbar from "@/components/offline-snackbar";
import "react-native-reanimated";

// biome-ignore lint/performance/noBarrelFile: <>
export { ErrorBoundary } from "expo-router";

preventAutoHideAsync();
export const queryClient = new QueryClient();

export default function RootLayout() {
	const [loaded, error] = useFonts({
		...FontAwesome.font,
		Poppins_100Thin,
		Poppins_100Thin_Italic,
		Poppins_200ExtraLight,
		Poppins_200ExtraLight_Italic,
		Poppins_300Light,
		Poppins_300Light_Italic,
		Poppins_400Regular,
		Poppins_400Regular_Italic,
		Poppins_500Medium,
		Poppins_500Medium_Italic,
		Poppins_600SemiBold,
		Poppins_600SemiBold_Italic,
		Poppins_700Bold,
		Poppins_700Bold_Italic,
		Poppins_800ExtraBold,
		Poppins_800ExtraBold_Italic,
		Poppins_900Black,
		Poppins_900Black_Italic,
	});

	// Expo Router uses Error Boundaries to catch errors in the navigation tree.
	useEffect(() => {
		if (error) {
			throw error;
		}
	}, [error]);

	useEffect(() => {
		if (loaded) {
			hideAsync();
		}
	}, [loaded]);

	if (!loaded) {
		return null;
	}

	return <RootLayoutNav />;
}

function RootLayoutNav() {
	const { isInternetReachable } = useNetworkState();

	return (
		<QueryClientProvider client={queryClient}>
			<GestureHandlerRootView style={{ flex: 1 }}>
				<Stack
					screenOptions={{
						headerShown: false,
					}}
				>
					<Stack.Screen
						name="(tabs)"
						options={{
							headerShown: false,
						}}
					/>

					<Stack.Screen
						name="recognize"
						options={{
							headerShown: false,
						}}
					/>
					<Stack.Screen
						name="album/index"
						options={{
							title: "",
							headerShadowVisible: false,
							headerShown: false,
							presentation: "transparentModal",
						}}
					/>
					<Stack.Screen
						name="player/index"
						options={{
							headerShadowVisible: false,
							headerShown: false,
							presentation: "transparentModal",
						}}
					/>
				</Stack>
				<OfflineSnackbar isVisible={!isInternetReachable} />
			</GestureHandlerRootView>
		</QueryClientProvider>
	);
}
