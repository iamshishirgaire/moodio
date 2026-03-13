import { ActivityIndicator, View } from "react-native";
import { theme } from "@/constants/theme";
export const LoadingSpinner = () => (
	<View
		style={{
			flex: 1,
			justifyContent: "center",
			alignItems: "center",
			backgroundColor: theme.colors.background,
		}}
	>
		<ActivityIndicator size="small" />
	</View>
);
