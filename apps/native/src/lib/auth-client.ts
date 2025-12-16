import { expoClient } from "@better-auth/expo/client";
import { createAuthClient } from "better-auth/react";
import Constants from "expo-constants";
// biome-ignore lint/performance/noNamespaceImport: <>
import * as SecureStore from "expo-secure-store";

export const authClient = createAuthClient({
	// baseURL: `${process.env.EXPO_PUBLIC_SERVER_URL}`,
	baseURL: "https://unfated-nonlosable-briella.ngrok-free.dev",
	plugins: [
		expoClient({
			scheme: Constants.expoConfig?.scheme as string,
			storagePrefix: Constants.expoConfig?.scheme as string,
			storage: SecureStore,
		}),
	],
});
