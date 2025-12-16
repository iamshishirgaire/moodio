import type React from "react";
import {
	Image,
	ScrollView,
	StyleSheet,
	TouchableOpacity,
	View,
} from "react-native";
import { Text } from "@/components/ui/text";
import { theme } from "@/constants/theme";
import type { TAlbumWithUserName } from "@/store/home/album";

type MusicSectionProps = {
	title: string;
	items: TAlbumWithUserName[];
	onPress: (id: string) => void;
};

const MusicSection: React.FC<MusicSectionProps> = ({
	title,
	items,
	onPress,
}) => (
	<View style={styles.section}>
		<Text style={styles.sectionTitle}>{title}</Text>
		<ScrollView
			contentContainerStyle={styles.horizontalScroll}
			horizontal
			showsHorizontalScrollIndicator={false}
		>
			{items.map((item) => (
				<TouchableOpacity
					activeOpacity={0.8}
					key={item.id}
					onPress={() => {
						onPress(item.id);
					}}
					style={styles.albumCard}
				>
					<Image
						source={{ uri: item.images[0].url }}
						style={styles.albumImage}
					/>
					<Text numberOfLines={1} style={styles.albumTitle}>
						{item.name}
					</Text>
					<Text style={styles.albumSubtitle}>{item.artistName}</Text>
				</TouchableOpacity>
			))}
		</ScrollView>
	</View>
);

const styles = StyleSheet.create({
	section: {
		marginBottom: theme.spacing.xxl,
	},
	sectionTitle: {
		fontSize: theme.typography.fontSizes.xl,
		fontWeight: theme.typography.fontWeights.bold,
		color: theme.colors.textSecondary,
		paddingHorizontal: theme.spacing.lg,
		marginBottom: theme.spacing.md,
	},
	horizontalScroll: {
		paddingHorizontal: theme.spacing.lg,
		gap: theme.spacing.md,
	},
	albumCard: {
		width: 150,
	},
	albumImage: {
		width: 150,
		height: 150,
		borderRadius: theme.borderRadius.sm,
		marginBottom: theme.spacing.sm,
	},
	albumTitle: {
		fontSize: theme.typography.fontSizes.md,
		fontWeight: theme.typography.fontWeights.medium,
		color: theme.colors.textSecondary,
		marginBottom: 2,
	},
	albumSubtitle: {
		fontSize: theme.typography.fontSizes.sm,
		color: theme.colors.textTertiary,
		lineHeight: 16,
	},
});

export default MusicSection;
