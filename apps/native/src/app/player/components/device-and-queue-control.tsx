import { IconDevices, IconMenu4, IconShare2 } from "@tabler/icons-react-native";
import { StyleSheet, View } from "react-native";
import { IconButton } from "@/components/ui/icon-button";
import { theme } from "@/constants/theme";

type DeviceAndQueueControlProps = {
	onOpenQueue: () => void;
};

export default function DeviceAndQueueControl({
	onOpenQueue,
}: DeviceAndQueueControlProps) {
	return (
		<>
			{/* Fixed Control bar at bottom */}
			<View style={styles.fixedContainer}>
				{/* Left: Devices */}
				<IconButton onPress={() => console.log("devices")}>
					<IconDevices color={theme.colors.textSecondary} size={22} />
				</IconButton>

				{/* Right controls */}
				<View style={styles.rightControls}>
					{/* Menu icon */}
					<IconButton onPress={() => console.log("menu")}>
						<IconShare2 color={theme.colors.textSecondary} size={22} />
					</IconButton>
					<IconButton onPress={onOpenQueue}>
						<IconMenu4 color={theme.colors.textSecondary} size={22} />
					</IconButton>
				</View>
			</View>
		</>
	);
}

const styles = StyleSheet.create({
	fixedContainer: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		paddingHorizontal: theme.spacing.lg,
		paddingVertical: theme.spacing.sm,
		backgroundColor: theme.colors.transparent,
	},
	rightControls: {
		flexDirection: "row",
		alignItems: "center",
		gap: 12,
	},
});
