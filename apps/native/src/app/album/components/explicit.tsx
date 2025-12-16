import { View } from "react-native";
import { Text } from "@/components/ui/text";
import { theme } from "@/constants/theme";

export default function Explicit() {
	return (
		<View
			style={{
				transform: [
					{
						scale: 0.7,
					},
				],
			}}
		>
			<Text
				size="xs"
				style={{
					fontSize: 16,
					textAlign: "center",
					textAlignVertical: "center",
					backgroundColor: theme.colors.textSecondary,
					borderRadius: theme.borderRadius.sm,
					width: 22,
					height: 22,
				}}
			>
				E
			</Text>
		</View>
	);
}
