/** biome-ignore-all lint/nursery/noLeakedRender: <> */
import type React from "react";
import {
	TextInput as RNTextInput,
	StyleSheet,
	Text,
	type TextInputProps,
	View,
} from "react-native";
import { theme } from "@/constants/theme";

export interface TextInputFieldProps extends TextInputProps {
	label?: string;
	error?: string;
	leftIcon?: React.ReactNode;
	rightIcon?: React.ReactNode;
	onRightIconPress?: () => void;
}

export const TextInputField: React.FC<TextInputFieldProps> = ({
	label,
	error,
	leftIcon,
	rightIcon,
	onRightIconPress,
	style,
	...props
}) => (
	<View style={styles.container}>
		{label && <Text style={styles.label}>{label}</Text>}
		<View style={styles.inputContainer}>
			{leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
			<RNTextInput
				cursorColor={theme.colors.primary}
				placeholderTextColor={theme.colors.textSecondary}
				selectionColor={theme.colors.primary}
				style={[
					styles.input,
					leftIcon ? styles.inputWithLeftIcon : undefined,
					rightIcon ? styles.inputWithRightIcon : undefined,
					error ? styles.inputError : undefined,
					style,
				].filter(Boolean)}
				{...props}
			/>
			{rightIcon && (
				<View style={styles.rightIcon}>
					{onRightIconPress ? (
						<View
							onTouchEnd={onRightIconPress}
							style={styles.rightIconTouchable}
						>
							{rightIcon}
						</View>
					) : (
						rightIcon
					)}
				</View>
			)}
		</View>
		{error && <Text style={styles.errorText}>{error}</Text>}
	</View>
);

const styles = StyleSheet.create({
	container: {
		marginBottom: 20,
	},
	label: {
		fontSize: 16,
		fontWeight: "500",
		color: theme.colors.textSecondary,
		marginBottom: 8,
	},
	inputContainer: {
		position: "relative",
	},
	input: {
		backgroundColor: theme.colors.backgroundTertiary,
		borderWidth: 1,
		borderColor: theme.colors.background,
		borderRadius: 8,
		paddingHorizontal: 16,
		paddingVertical: 16,
		fontSize: 16,
		color: theme.colors.textSecondary,
	},
	inputWithLeftIcon: {
		paddingLeft: 48,
	},
	inputWithRightIcon: {
		paddingRight: 48,
	},
	inputError: {
		borderColor: theme.colors.error,
	},
	leftIcon: {
		position: "absolute",
		left: 16,
		top: "50%",
		marginTop: -12,
		zIndex: 1,
	},
	rightIcon: {
		position: "absolute",
		right: 16,
		top: "50%",
		marginTop: -12,
		zIndex: 1,
	},
	rightIconTouchable: {
		padding: 4,
	},
	errorText: {
		fontSize: 14,
		color: theme.colors.error,
		marginTop: 4,
	},
});
