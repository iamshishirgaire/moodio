import type React from "react";
import {
	Image,
	type ImageSourcePropType,
	StyleSheet,
	Text,
	View,
} from "react-native";
import { theme } from "../../constants/theme";

type CircleAvatarProps = {
	source?: ImageSourcePropType;
	size?: number;
	name?: string;
	backgroundColor?: string;
	textColor?: string;
	fontSize?: number;
};

export const CircleAvatar: React.FC<CircleAvatarProps> = ({
	source,
	size = 40,
	name,
	backgroundColor = theme.colors.transparent,
	textColor = theme.colors.textPrimary,
	fontSize = 16,
}) => {
	const getInitials = (userName: string) =>
		userName
			.split(" ")
			.map((word) => word[0])
			.join("")
			.toUpperCase()
			.slice(0, 2);

	const avatarStyle = {
		width: size,
		height: size,
		borderRadius: size / 2,
		backgroundColor: source ? "transparent" : backgroundColor,
	};

	const textStyle = {
		fontSize,
		color: textColor,
	};

	return (
		<View style={[styles.avatar, avatarStyle]}>
			{source ? (
				<Image
					resizeMode="cover"
					source={source}
					style={[styles.avatarImage, avatarStyle]}
				/>
			) : (
				<Text style={[styles.avatarText, textStyle]}>
					{getInitials(name ?? "")}
				</Text>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	avatar: {
		justifyContent: "center",
		alignItems: "center",
		overflow: "hidden",
	},
	avatarImage: {
		position: "absolute",
		top: 0,
		left: 0,
	},
	avatarText: {
		fontWeight: theme.typography.fontWeights.medium,
	},
});
