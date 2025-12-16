import { StyleSheet } from "react-native";
import Animated, { SlideInUp, SlideOutUp } from "react-native-reanimated";
import { Text } from "@/components/ui/text";
import { theme } from "@/constants/theme";

const OfflineSnackbar = ({ isVisible }: { isVisible: boolean }) => {
	if (!isVisible) {
		return null;
	}

	return (
		<Animated.View
			entering={SlideInUp.duration(500)}
			exiting={SlideOutUp.duration(500)}
			style={styles.snackbarContainer}
		>
			<Text style={styles.snackbarText}>You're offline!</Text>
		</Animated.View>
	);
};
export default OfflineSnackbar;

const styles = StyleSheet.create({
	snackbarContainer: {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		alignItems: "flex-end",
		justifyContent: "center",
		flexDirection: "row",
		backgroundColor: theme.colors.info,
		minHeight: 100,
		paddingTop: 30,
		paddingBottom: 10,
		zIndex: 10,
		elevation: 5,
	},
	snackbarText: {
		color: "white",
		fontSize: 14,
	},
});
