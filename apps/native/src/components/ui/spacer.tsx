import { View } from "react-native";

type SpacerProps = {
	height?: number;
	width?: number;
};
export default function Spacer({ height, width }: SpacerProps) {
	return (
		<View
			style={{
				height,
				width,
			}}
		/>
	);
}
