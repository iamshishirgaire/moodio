import type React from "react";
import {
	ActivityIndicator,
	StyleSheet,
	Text,
	type TextStyle,
	TouchableOpacity,
	View,
	type ViewStyle,
} from "react-native";
import {
	borderRadius,
	spacing,
	theme,
	typography,
} from "../../constants/theme";

export type ButtonProps = {
	title: string;
	variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
	size?: "sm" | "md" | "lg";
	disabled?: boolean;
	loading?: boolean;
	icon?: React.ReactNode;
	iconPosition?: "left" | "right";
	fullWidth?: boolean;
	onPress: () => void;
	style?: ViewStyle;
};

export const Button: React.FC<ButtonProps> = ({
	title,
	variant = "primary",
	size = "md",
	disabled = false,
	loading = false,
	icon,
	iconPosition = "left",
	fullWidth = false,
	onPress,
	style,
}) => {
	const getButtonStyles = (): ViewStyle => {
		const baseStyle: ViewStyle = {
			flexDirection: "row",
			alignItems: "center",
			justifyContent: "center",
			borderRadius: borderRadius.sm,
			minWidth: 170,
		};

		const sizeStyles: Record<string, ViewStyle> = {
			sm: {
				paddingHorizontal: spacing.md,
				paddingVertical: spacing.sm,
				minHeight: 26,
			},
			md: {
				paddingHorizontal: spacing.lg,
				paddingVertical: spacing.md,
				minHeight: 34,
			},
			lg: {
				paddingHorizontal: spacing.xl,
				paddingVertical: spacing.lg,
				minHeight: 42,
			},
		};

		const variantStyles: Record<string, ViewStyle> = {
			primary: {
				backgroundColor: theme.colors.primary,
				borderWidth: 0,
			},
			secondary: {
				backgroundColor: theme.colors.surfaceTertiary,
				borderWidth: 1,
				borderColor: theme.colors.surface,
			},
			outline: {
				backgroundColor: "transparent",
				borderWidth: 1,
				borderColor: theme.colors.primary,
			},
			ghost: {
				backgroundColor: "transparent",
				borderWidth: 0,
			},
			danger: {
				backgroundColor: theme.colors.error,
				borderWidth: 0,
			},
		};

		return {
			...baseStyle,
			...sizeStyles[size],
			...variantStyles[variant],
			opacity: disabled ? 0.5 : 1,
			width: fullWidth ? "100%" : undefined,
		};
	};

	const getTextStyles = (): TextStyle => {
		const baseStyle: TextStyle = {
			fontWeight: typography.fontWeights.medium,
			textAlign: "center",
		};

		const sizeStyles: Record<string, TextStyle> = {
			sm: {
				fontSize: typography.fontSizes.sm,
			},
			md: {
				fontSize: typography.fontSizes.md,
			},
			lg: {
				fontSize: typography.fontSizes.lg,
			},
		};

		const variantStyles: Record<string, TextStyle> = {
			primary: {
				color: theme.colors.textPrimary,
			},
			secondary: {
				color: theme.colors.textSecondary,
			},
			outline: {
				color: theme.colors.primary,
			},
			ghost: {
				color: theme.colors.surface,
			},
			danger: {
				color: theme.colors.error,
			},
		};

		return {
			...baseStyle,
			...sizeStyles[size],
			...variantStyles[variant],
		};
	};

	const renderIcon = () => {
		if (!(icon || loading)) {
			return null;
		}

		if (loading) {
			return <ActivityIndicator color={getTextStyles().color} size="small" />;
		}

		return icon;
	};

	return (
		<TouchableOpacity
			activeOpacity={0.8}
			disabled={disabled || loading}
			onPress={onPress}
			style={[styles.button, getButtonStyles(), style]}
		>
			<View style={styles.buttonContent}>
				{iconPosition === "left" && renderIcon() && (
					<View style={styles.iconLeft}>{renderIcon()}</View>
				)}
				<Text style={[getTextStyles(), styles.buttonText]}>{title}</Text>
				{iconPosition === "right" && renderIcon() && (
					<View style={styles.iconRight}>{renderIcon()}</View>
				)}
			</View>
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	button: {
		position: "relative",
		overflow: "hidden",
	},
	buttonContent: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		width: "100%",
		flex: 1,
	},
	iconLeft: {
		alignItems: "flex-start",
		justifyContent: "center",
		flex: 0,
	},
	iconRight: {
		alignItems: "flex-end",
		justifyContent: "center",
		flex: 0,
	},
	buttonText: {
		flex: 1,
		textAlign: "center",
	},
});
