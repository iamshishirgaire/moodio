import { theme } from "../constants/theme";

export const headerStyles = {
	headerStyle: {
		backgroundColor: theme.colors.transparent,
	},
	headerTintColor: theme.colors.textPrimary,
	headerTitleStyle: {
		fontSize: 17,
		fontWeight: "600",
		color: theme.colors.textPrimary,
	},

	headerLargeTitle: true, // This enables the collapsible header
	headerLargeStyle: {
		backgroundColor: theme.colors.transparent,
	},
	headerLargeTitleStyle: {
		fontSize: 34,
		fontWeight: "700",
		color: theme.colors.textPrimary,
	},
	headerShadowVisible: false,
	headerBlurEffect: "systemChromeMaterial",
} as const;
