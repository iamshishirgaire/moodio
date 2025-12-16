// components/player/QueueButton.tsx

import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { theme } from "@/constants/theme";

type QueueButtonProps = {
	queueLength: number;
	onPress: () => void;
};

export default function QueueButton({
	queueLength,
	onPress,
}: QueueButtonProps) {
	return (
		<TouchableOpacity onPress={onPress} style={styles.container}>
			<View style={styles.iconContainer}>
				<Ionicons color={theme.colors.textSecondary} name="list" size={20} />
				{queueLength > 0 && (
					<View style={styles.badge}>
						<Text style={styles.badgeText}>{queueLength}</Text>
					</View>
				)}
			</View>
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	container: {
		width: 44,
		height: 44,
		justifyContent: "center",
		alignItems: "center",
	},
	iconContainer: {
		position: "relative",
	},
	badge: {
		position: "absolute",
		top: -6,
		right: -10,
		backgroundColor: theme.colors.primary,
		borderRadius: 10,
		minWidth: 18,
		height: 18,
		justifyContent: "center",
		alignItems: "center",
		paddingHorizontal: 4,
	},
	badgeText: {
		color: theme.colors.background,
		fontSize: 10,
		fontWeight: theme.typography.fontWeights.bold,
	},
});
