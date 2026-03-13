import { Slider as RNSlider } from "@miblanchard/react-native-slider";
import { theme } from "@/constants/theme";

// Define the component props using your provided type structure
type SliderProps = {
	onChange: (value: number) => void;
	value: number;
	minHeight?: number; // Added to the containing View style
	max: number;
	min: number;
	onSeekingStart?: () => void;
	onSeekingStop?: () => void;
};

export default function Slider({
	onChange,
	value,
	// minHeight = 40,
	max,
	min,
	onSeekingStart,
	onSeekingStop,
}: SliderProps) {
	return (
		<RNSlider
			maximumTrackTintColor="#A9A9A9"
			maximumValue={max}
			minimumTrackTintColor={theme.colors.primary}
			minimumValue={min} // value changes continuously while sliding
			onSlidingComplete={onSeekingStop} // User starts touching the thumb
			onSlidingStart={onSeekingStart} // User releases the thumb
			onValueChange={(v) => onChange(v[0])} // iOS blue color
			thumbStyle={{
				height: 15,
				width: 15,
				borderRadius: 25,
			}} // White thumb
			thumbTintColor={theme.colors.primary}
			value={value}
		/>
	);
}
