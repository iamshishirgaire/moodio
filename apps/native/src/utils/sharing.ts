import { createURL } from "expo-linking";
import { Alert, Share } from "react-native";

/**
 * Handles sharing a deep link to a specific resource within the app.
 * @param type - The resource type ('track' | 'album' | 'artist')
 * @param externalUrl - The encoded URL to be shared
 */
export const handleAppShare = async (type: string, externalUrl: string) => {
	try {
		// 1. Create a deep link that points to your app's share route
		// This will generate: myapp://share/track/https%3A%2F%2Fspotify.com...
		const deepLink = createURL(
			`share/${type}/${encodeURIComponent(externalUrl)}`,
		);

		// 2. Open the native share dialog
		const result = await Share.share({
			message: `Check out this ${type} I found! \n\n${deepLink}`,
			url: deepLink, // Important for iOS to show app-specific share options
			title: `Share ${type}`,
		});

		if (result.action === Share.sharedAction) {
			console.log("Resource shared successfully");
		}
	} catch (_e) {
		Alert.alert("Error");
	}
};
