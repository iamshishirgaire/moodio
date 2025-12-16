import type React from "react";
import { Text as RNText, type TextStyle } from "react-native";
import { theme, typography } from "../../constants/theme";

export type TextProps = {
	children: React.ReactNode;
	variant?: "heading1" | "heading2" | "heading3" | "body" | "caption" | "label";
	size?: "xs" | "sm" | "md" | "lg" | "xl" | "xxl" | "xxxl";
	weight?: "light" | "regular" | "medium" | "semibold" | "bold";
	color?:
		| "primary"
		| "secondary"
		| "subtle"
		| "brand"
		| "error"
		| "success"
		| "warning";
	align?: "auto" | "left" | "right" | "center" | "justify";
	numberOfLines?: number;
	ellipsizeMode?: "head" | "middle" | "tail" | "clip";
	style?: TextStyle;
};

export const Text: React.FC<TextProps> = ({
	children,
	variant = "body",
	size,
	weight,
	color = "primary",
	align = "auto",
	numberOfLines,
	ellipsizeMode,
	style,
}) => {
	const getTextStyles = (): TextStyle => {
		const baseStyle: TextStyle = {
			color: theme.colors.textPrimary,
		};

		const variantStyles: Record<string, TextStyle> = {
			heading1: {
				fontSize: typography.fontSizes.xxxl,
				fontWeight: typography.fontWeights.bold,
				lineHeight: typography.fontSizes.xxxl * 1.2,
			},
			heading2: {
				fontSize: typography.fontSizes.xxl,
				fontWeight: typography.fontWeights.bold,
				lineHeight: typography.fontSizes.xxl * 1.2,
			},
			heading3: {
				fontSize: typography.fontSizes.xl,
				fontWeight: typography.fontWeights.semibold,
				lineHeight: typography.fontSizes.xl * 1.3,
			},
			body: {
				fontSize: typography.fontSizes.md,
				fontWeight: typography.fontWeights.regular,
				lineHeight: typography.fontSizes.md * 1.4,
			},
			caption: {
				fontSize: typography.fontSizes.sm,
				fontWeight: typography.fontWeights.regular,
				lineHeight: typography.fontSizes.sm * 1.4,
			},
			label: {
				fontSize: typography.fontSizes.sm,
				fontWeight: typography.fontWeights.medium,
				lineHeight: typography.fontSizes.sm * 1.4,
			},
		};

		const sizeStyles: Record<string, TextStyle> = {
			xs: { fontSize: typography.fontSizes.xs },
			sm: { fontSize: typography.fontSizes.sm },
			md: { fontSize: typography.fontSizes.md },
			lg: { fontSize: typography.fontSizes.lg },
			xl: { fontSize: typography.fontSizes.xl },
			xxl: { fontSize: typography.fontSizes.xxl },
			xxxl: { fontSize: typography.fontSizes.xxxl },
		};

		const weightStyles: Record<string, TextStyle> = {
			light: { fontWeight: typography.fontWeights.light },
			regular: { fontWeight: typography.fontWeights.regular },
			medium: { fontWeight: typography.fontWeights.medium },
			semibold: { fontWeight: typography.fontWeights.semibold },
			bold: { fontWeight: typography.fontWeights.bold },
		};

		const colorStyles: Record<string, TextStyle> = {
			primary: { color: theme.colors.textPrimary },
			secondary: { color: theme.colors.textSecondary },
			subtle: { color: theme.colors.textTertiary },
			brand: { color: theme.colors.primary },
			error: { color: theme.colors.error },
			success: { color: theme.colors.success },
			warning: { color: theme.colors.warning },
		};

		const alignStyles: Record<string, TextStyle> = {
			auto: { textAlign: "auto" },
			left: { textAlign: "left" },
			right: { textAlign: "right" },
			center: { textAlign: "center" },
			justify: { textAlign: "justify" },
		};

		return {
			...baseStyle,
			...variantStyles[variant],
			...(size && sizeStyles[size]),
			...(weight && weightStyles[weight]),
			...colorStyles[color],
			...alignStyles[align],
		};
	};

	return (
		<RNText
			ellipsizeMode={ellipsizeMode}
			numberOfLines={numberOfLines}
			style={[getTextStyles(), style]}
		>
			{children}
		</RNText>
	);
};
