// components/player/TrackInfo.tsx

import { Ionicons } from "@expo/vector-icons";
import { IconHeart } from "@tabler/icons-react-native";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { IconButton } from "@/components/ui/icon-button";
import { theme } from "@/constants/theme";

type TrackInfoProps = {
	title: string;
	artists: string[];
	isLiked?: boolean;
	onLike?: () => void;
	onMore?: () => void;
};

export default function TrackInfo({
	title,
	artists,
	isLiked = false,
	onLike,
	onMore,
}: TrackInfoProps) {
	return (
		<View style={styles.container}>
			<View style={styles.textContainer}>
				<Text numberOfLines={1} style={styles.title}>
					{title}
				</Text>
				<Text numberOfLines={1} style={styles.artists}>
					{artists.join(", ")}
				</Text>
			</View>
			<View style={styles.actions}>
				{(onLike !== undefined) === true && (
					<IconButton onPress={onLike}>
						{isLiked ? (
							<IconHeart
								color={
									isLiked ? theme.colors.primary : theme.colors.textSecondary
								}
								fill={"pink"}
								size={22}
							/>
						) : (
							<IconHeart
								color={
									isLiked ? theme.colors.primary : theme.colors.textSecondary
								}
								size={22}
							/>
						)}
					</IconButton>
				)}
				{onMore === undefined && (
					<TouchableOpacity onPress={onMore} style={styles.actionButton}>
						<Ionicons
							color={theme.colors.textSecondary}
							name="ellipsis-horizontal"
							size={24}
						/>
					</TouchableOpacity>
				)}
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		paddingHorizontal: theme.spacing.lg,
		gap: theme.spacing.md,
	},
	textContainer: {
		flex: 1,
		gap: theme.spacing.xs / 2,
	},
	title: {
		fontSize: theme.typography.fontSizes.lg,
		fontWeight: theme.typography.fontWeights.bold,
		color: theme.colors.textSecondary,
	},
	artists: {
		fontSize: theme.typography.fontSizes.sm,
		color: theme.colors.textTertiary,
	},
	actions: {
		flexDirection: "row",
		gap: theme.spacing.sm,
	},
	actionButton: {
		width: 40,
		height: 40,
		justifyContent: "center",
		alignItems: "center",
	},
});
