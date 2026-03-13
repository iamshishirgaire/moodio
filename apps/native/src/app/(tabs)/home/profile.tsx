import { ScrollView, StyleSheet, View } from "react-native";
import { CircleAvatar } from "@/components/ui/circle-avatar";
import { Text } from "@/components/ui/text";

import { theme } from "@/constants/theme";
import { authClient } from "@/lib/auth-client";
import SignOutButton from "../../auth/components/signout-button";

export default function ProfileScreen() {
	const { data: session } = authClient.useSession();
	const user = session?.user;
	const hasImage = !!user?.image;

	return (
		<ScrollView
			contentContainerStyle={styles.contentContainer}
			style={styles.container}
		>
			<View style={styles.header}>
				<CircleAvatar
					name={user?.name ?? ""}
					size={120}
					source={
						// biome-ignore lint/nursery/noLeakedRender: <>
						hasImage
							? {
									// biome-ignore lint/style/noNonNullAssertion: <>
									uri: user!.image!,
								}
							: undefined
					}
				/>
				<Text style={styles.name}>{user?.name}</Text>
				<Text style={styles.handle}>{user?.email}</Text>
			</View>
			<View style={styles.footer}>
				<SignOutButton />
			</View>
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: theme.colors.background,
	},
	contentContainer: {
		padding: theme.spacing.lg,
		paddingTop: theme.spacing.xxl,
	},
	header: {
		alignItems: "center",
		marginBottom: theme.spacing.xxl,
	},
	name: {
		fontSize: theme.typography.fontSizes.xxl,
		fontWeight: theme.typography.fontWeights.bold,
		color: theme.colors.textPrimary,
		marginTop: theme.spacing.md,
		marginBottom: theme.spacing.xs,
	},
	handle: {
		fontSize: theme.typography.fontSizes.md,
		color: theme.colors.textSecondary,
		marginBottom: theme.spacing.lg,
	},

	footer: {
		alignItems: "center",
		marginTop: "auto",
		paddingBottom: theme.spacing.xl,
	},
});
