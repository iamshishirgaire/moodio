import type React from "react";
import {
	StyleSheet,
	Text,
	TouchableOpacity,
	type ViewStyle,
} from "react-native";
import { theme } from "../../constants/theme";

type FilterPillProps = {
	title: string;
	isActive?: boolean;
	onPress?: () => void;
	style?: ViewStyle;
};

export const FilterPill: React.FC<FilterPillProps> = ({
	title,
	isActive = false,
	onPress,
	style,
}) => (
	<TouchableOpacity
		activeOpacity={0.7}
		onPress={onPress}
		style={[
			styles.pill,
			isActive ? styles.pillActive : styles.pillInactive,
			style,
		]}
	>
		<Text
			style={[
				styles.pillText,
				isActive ? styles.pillTextActive : styles.pillTextInactive,
			]}
		>
			{title}
		</Text>
	</TouchableOpacity>
);

const styles = StyleSheet.create({
	pill: {
		paddingHorizontal: theme.spacing.md,
		paddingVertical: theme.spacing.sm,
		borderRadius: 20,
		alignItems: "center",
		justifyContent: "center",
	},
	pillActive: {
		backgroundColor: theme.colors.primary,
	},
	pillInactive: {
		backgroundColor: theme.colors.surfaceTertiary,
	},
	pillText: {
		fontSize: theme.typography.fontSizes.sm,
		fontWeight: theme.typography.fontWeights.medium,
	},
	pillTextActive: {
		color: theme.colors.surface,
	},
	pillTextInactive: {
		color: theme.colors.textTertiary,
	},
});
