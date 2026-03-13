import type { ReactElement } from "react";
import { Pressable, StyleSheet, type ViewStyle } from "react-native";

type IconButtonProps = {
	children: ReactElement;
	onPress?: () => void;
	isDisabled?: boolean;
	btnstyle?: ViewStyle;
};

export function IconButton({
	children,
	onPress,
	isDisabled,
	btnstyle,
}: IconButtonProps) {
	return (
		<Pressable
			disabled={isDisabled}
			onPress={onPress}
			style={({ pressed }) => [
				styles.base,
				btnstyle,
				pressed === true && styles.pressed,
				isDisabled === true && styles.disabled,
			]}
		>
			{children}
		</Pressable>
	);
}

const styles = StyleSheet.create({
	base: {
		width: 40,
		height: 40,
		borderRadius: 20,
		alignItems: "center",
		justifyContent: "center",
	},
	pressed: {
		opacity: 0.7,
	},
	disabled: {
		opacity: 0.4,
	},
});
