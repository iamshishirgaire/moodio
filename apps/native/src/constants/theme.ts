export const colors = {
	// Primary colors
	primary: "#E00000",
	primaryDark: "#B00000",
	primaryLight: "#FF6B6B",

	// Background colors
	background: "#FFFFFF",
	backgroundSecondary: "#F5F5F5",
	backgroundTertiary: "#EAEAEA",

	// Surface colors
	surface: "#FFFFFF",
	surfaceSecondary: "#F0F0F0",
	surfaceTertiary: "#E0E0E0",

	// Text colors
	textPrimary: "#FFFFFF",
	textSecondary: "#333333",
	textTertiary: "#777777",

	// Accent colors
	accent: "#D9D9D9",
	accentSecondary: "#C4C4C4",

	// Status colors
	success: "#28A745",
	warning: "#FF9500",
	error: "#FF3B30",
	info: "#007AFF",

	// Transparent colors
	overlay: "rgba(0, 0, 0, 0.05)",
	transparent: "transparent",
} as const;

export const spacing = {
	xs: 4,
	sm: 8,
	md: 16,
	lg: 24,
	xl: 32,
	xxl: 48,
} as const;

export const borderRadius = {
	sm: 4,
	md: 8,
	lg: 12,
	xl: 16,
	xxl: 20,
	round: 999,
} as const;

export const typography = {
	fontSizes: {
		xs: 12,
		sm: 14,
		md: 16,
		lg: 18,
		xl: 20,
		xxl: 24,
		xxxl: 32,
	},
	fontWeights: {
		light: "300",
		regular: "400",
		medium: "500",
		semibold: "600",
		bold: "700",
	},
	lineHeights: {
		tight: 1.2,
		normal: 1.4,
		relaxed: 1.6,
	},
} as const;

export const shadows = {
	small: {
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.2,
		shadowRadius: 2,
		elevation: 2,
	},
	medium: {
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.25,
		shadowRadius: 4,
		elevation: 5,
	},
	large: {
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.3,
		shadowRadius: 8,
		elevation: 10,
	},
} as const;

export const theme = {
	colors,
	spacing,
	borderRadius,
	typography,
	shadows,
} as const;

export type Theme = typeof theme;
