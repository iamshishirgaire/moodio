import { IconDevices, IconMenu4, IconShare2 } from "@tabler/icons-react-native";
import { StyleSheet, View } from "react-native";
import { IconButton } from "@/components/ui/icon-button";
import { theme } from "@/constants/theme";

export default function DeviceAndQueueControl() {
	return (
		<View style={styles.container}>
			{/* Shuffle Button */}
			<IconButton
				onPress={() => {
					console.log("devices");
				}}
			>
				<IconDevices color={theme.colors.textSecondary} size={22} />
			</IconButton>

			{/* Repeat Button */}
			<View
				style={{
					display: "flex",
					flexDirection: "row",
					gap: 12,
					alignItems: "center",
				}}
			>
				<IconButton
					onPress={() => {
						console.log("devices");
					}}
				>
					<IconShare2 color={theme.colors.textSecondary} size={22} />
				</IconButton>
				<IconButton
					onPress={() => {
						console.log("devices");
					}}
				>
					<IconMenu4 color={theme.colors.textSecondary} size={22} />
				</IconButton>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		paddingHorizontal: theme.spacing.lg,
		paddingVertical: theme.spacing.sm,
	},
	iconButton: {
		width: 44,
		height: 44,
		justifyContent: "center",
		alignItems: "center",
	},
	button: {
		padding: theme.spacing.sm,
		alignItems: "center",
		justifyContent: "center",
	},
});
