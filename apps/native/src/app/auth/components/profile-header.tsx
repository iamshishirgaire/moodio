import { BlurView } from "expo-blur";
import { useState } from "react";
import {
	Pressable,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import { CircleAvatar } from "@/components/ui/circle-avatar";
import { Icon, Icons } from "@/components/ui/icon";
import { theme } from "@/constants/theme";
import { authClient } from "@/lib/auth-client";
import SignOutButton from "./signout-button";

export default function ProfileHeader() {
	const { data: session } = authClient.useSession();
	const [_modalVisible, setModalVisible] = useState(false);
	const user = session?.user;
	return (
		<BlurView intensity={20} style={styles.absolute} tint="dark">
			<Pressable onPress={() => setModalVisible(false)} style={styles.overlay}>
				<Pressable
					onPress={(e) => e.stopPropagation()}
					style={styles.modalContent}
				>
					<View style={styles.header}>
						<Text style={styles.title}>Profile</Text>
						<TouchableOpacity
							onPress={() => setModalVisible(false)}
							style={styles.closeButton}
						>
							<Icon
								color={theme.colors.textSecondary}
								icon={Icons.close}
								size={20}
							/>
						</TouchableOpacity>
					</View>

					<View style={styles.userInfo}>
						<CircleAvatar
							name={user?.name ?? ""}
							size={80}
							source={{
								uri: user?.image ?? undefined,
							}}
						/>
						<Text style={styles.userName}>{user?.name}</Text>
						<Text style={styles.userEmail}>{user?.email}</Text>
					</View>

					<View style={styles.actions}>
						<SignOutButton />
					</View>
				</Pressable>
			</Pressable>
		</BlurView>
	);
}

const styles = StyleSheet.create({
	absolute: {
		...StyleSheet.absoluteFillObject,
	},
	overlay: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "rgba(0,0,0,0.5)",
	},
	modalContent: {
		width: "85%",
		backgroundColor: theme.colors.surface,
		borderRadius: theme.borderRadius.xl,
		padding: theme.spacing.lg,
		borderWidth: 1,
		borderColor: theme.colors.surfaceSecondary,
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 4,
		elevation: 5,
	},
	header: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: theme.spacing.lg,
	},
	title: {
		fontSize: theme.typography.fontSizes.lg,
		fontWeight: theme.typography.fontWeights.semibold,
		color: theme.colors.textPrimary,
	},
	closeButton: {
		padding: theme.spacing.xs,
	},
	userInfo: {
		alignItems: "center",
		marginBottom: theme.spacing.xl,
	},
	userName: {
		fontSize: theme.typography.fontSizes.xl,
		fontWeight: theme.typography.fontWeights.bold,
		color: theme.colors.textPrimary,
		marginTop: theme.spacing.md,
		marginBottom: theme.spacing.xs,
	},
	userEmail: {
		fontSize: theme.typography.fontSizes.sm,
		color: theme.colors.textSecondary,
	},
	actions: {
		borderTopWidth: 1,
		borderTopColor: theme.colors.surfaceSecondary,
		paddingTop: theme.spacing.lg,
		alignItems: "center",
	},
});
