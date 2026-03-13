import { useRouter } from "expo-router";
import { useState } from "react";
import {
	Alert,
	KeyboardAvoidingView,
	Platform,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import Animated, {
	useAnimatedStyle,
	useSharedValue,
	withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "@/components/ui/button";
import { TextInputField } from "@/components/ui/text-input";

import { authClient } from "@/lib/auth-client";

type OnboardingStep = "welcome" | "genres" | "preferences" | "complete";

// Sample genres - replace with your actual genres
const GENRES = [
	"Pop",
	"Rock",
	"Hip Hop",
	"R&B",
	"Jazz",
	"Classical",
	"Electronic",
	"Country",
	"Indie",
	"K-Pop",
	"Latin",
	"Metal",
	"Reggae",
	"Blues",
	"Folk",
];

export default function OnboardingScreen() {
	const { data: session } = authClient.useSession();
	const user = session?.user;
	const router = useRouter();

	const [step, setStep] = useState<OnboardingStep>("welcome");
	const [username, setUsername] = useState("");
	const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
	const [notificationsEnabled, setNotificationsEnabled] = useState(true);
	const [isLoading, setIsLoading] = useState(false);

	const contentTranslateX = useSharedValue(0);
	const contentOpacity = useSharedValue(1);

	const moveToStep = (newStep: OnboardingStep) => {
		const steps: OnboardingStep[] = [
			"welcome",
			"genres",
			"preferences",
			"complete",
		];
		const currentIndex = steps.indexOf(step);
		const newIndex = steps.indexOf(newStep);
		const direction = newIndex > currentIndex ? 1 : -1;

		// Animate current content out
		contentTranslateX.value = withTiming(-300 * direction, { duration: 250 });
		contentOpacity.value = withTiming(0, { duration: 200 });

		setTimeout(() => {
			setStep(newStep);
			// Reset for new content animation
			contentTranslateX.value = 300 * direction;
			contentOpacity.value = 0;

			// Animate new content in
			contentTranslateX.value = withTiming(0, { duration: 250 });
			contentOpacity.value = withTiming(1, { duration: 200 });
		}, 250);
	};

	const handleNext = async () => {
		switch (step) {
			case "welcome":
				if (!username.trim()) {
					Alert.alert("Error", "Please enter a username");
					return;
				}
				moveToStep("genres");
				break;
			case "genres":
				if (selectedGenres.length === 0) {
					Alert.alert("Error", "Please select at least one genre");
					return;
				}
				moveToStep("preferences");
				break;
			case "preferences":
				moveToStep("complete");
				break;
			case "complete":
				await handleComplete();
				break;
			default:
		}
	};

	const handleSkip = () => {
		if (step === "genres") {
			moveToStep("preferences");
		} else if (step === "preferences") {
			moveToStep("complete");
		}
	};

	const handleComplete = () => {
		setIsLoading(true);
		try {
			router.replace("/(tabs)/home");
		} catch (err) {
			console.error("Failed to complete onboarding:", err);
			Alert.alert("Error", "Failed to save preferences. Please try again.");
		} finally {
			setIsLoading(false);
		}
	};

	const toggleGenre = (genre: string) => {
		setSelectedGenres((prev) =>
			prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre],
		);
	};

	const animatedContentStyle = useAnimatedStyle(() => ({
		transform: [{ translateX: contentTranslateX.value }],
		opacity: contentOpacity.value,
	}));

	const progressStyle = useAnimatedStyle(() => {
		const steps: OnboardingStep[] = [
			"welcome",
			"genres",
			"preferences",
			"complete",
		];
		const currentIndex = steps.indexOf(step);
		const progress = ((currentIndex + 1) / steps.length) * 100;

		return {
			width: withTiming(`${progress}%`, { duration: 250 }),
		};
	});

	const renderStepContent = () => {
		switch (step) {
			case "welcome":
				return (
					<Animated.View style={[styles.stepContent, animatedContentStyle]}>
						<Text style={styles.stepTitle}>Welcome to Moodio!</Text>
						<Text style={styles.stepSubtitle}>
							Hi {user?.name?.split(" ")[0] || "there"}! Let's personalize your
							experience.
						</Text>

						<TextInputField
							autoCapitalize="none"
							label="Choose a username"
							onChangeText={setUsername}
							placeholder="Enter your username"
							style={styles.inputField}
							value={username}
						/>

						<Text style={styles.helperText}>
							You can always change this later in settings
						</Text>
					</Animated.View>
				);

			case "genres":
				return (
					<Animated.View style={[styles.stepContent, animatedContentStyle]}>
						<Text style={styles.stepTitle}>What do you like to listen to?</Text>
						<Text style={styles.stepSubtitle}>
							Select at least 3 genres to get personalized recommendations
						</Text>

						<View style={styles.genresContainer}>
							{GENRES.map((genre) => (
								<TouchableOpacity
									key={genre}
									onPress={() => toggleGenre(genre)}
									style={[
										styles.genreChip,
										selectedGenres.includes(genre) && styles.genreChipSelected,
									]}
								>
									<Text
										style={[
											styles.genreText,
											selectedGenres.includes(genre) &&
												styles.genreTextSelected,
										]}
									>
										{genre}
									</Text>
								</TouchableOpacity>
							))}
						</View>

						<Text style={styles.selectedCount}>
							{selectedGenres.length} genre
							{selectedGenres.length !== 1 ? "s" : ""} selected
						</Text>
					</Animated.View>
				);

			case "preferences":
				return (
					<Animated.View style={[styles.stepContent, animatedContentStyle]}>
						<Text style={styles.stepTitle}>Set your preferences</Text>
						<Text style={styles.stepSubtitle}>
							Customize how you want to use Moodio
						</Text>

						<View style={styles.preferencesContainer}>
							<TouchableOpacity
								onPress={() => setNotificationsEnabled(!notificationsEnabled)}
								style={styles.preferenceItem}
							>
								<View style={styles.preferenceInfo}>
									<Text style={styles.preferenceTitle}>Push Notifications</Text>
									<Text style={styles.preferenceDescription}>
										Get notified about new releases and recommendations
									</Text>
								</View>
								<View
									style={[
										styles.toggle,
										notificationsEnabled === true && styles.toggleActive,
									]}
								>
									<View
										style={[
											styles.toggleThumb,
											notificationsEnabled === true && styles.toggleThumbActive,
										]}
									/>
								</View>
							</TouchableOpacity>
						</View>
					</Animated.View>
				);

			case "complete":
				return (
					<Animated.View style={[styles.stepContent, animatedContentStyle]}>
						<View style={styles.completeIcon}>
							<Text style={styles.completeEmoji}>🎉</Text>
						</View>
						<Text style={styles.stepTitle}>You're all set!</Text>
						<Text style={styles.stepSubtitle}>
							Let's start discovering amazing music together
						</Text>

						<View style={styles.summaryContainer}>
							<View style={styles.summaryItem}>
								<Text style={styles.summaryLabel}>Username</Text>
								<Text style={styles.summaryValue}>@{username}</Text>
							</View>
							<View style={styles.summaryItem}>
								<Text style={styles.summaryLabel}>Favorite Genres</Text>
								<Text style={styles.summaryValue}>
									{selectedGenres.slice(0, 3).join(", ")}
									{selectedGenres.length > 3 &&
										` +${selectedGenres.length - 3} more`}
								</Text>
							</View>
							<View style={styles.summaryItem}>
								<Text style={styles.summaryLabel}>Notifications</Text>
								<Text style={styles.summaryValue}>
									{notificationsEnabled ? "Enabled" : "Disabled"}
								</Text>
							</View>
						</View>
					</Animated.View>
				);

			default:
				return null;
		}
	};

	const getButtonTitle = () => {
		if (step === "complete") {
			return isLoading ? "Starting..." : "Start Listening";
		}
		return "Next";
	};

	const showSkipButton = step === "genres" || step === "preferences";

	return (
		<SafeAreaView edges={["top", "bottom"]} style={styles.container}>
			<KeyboardAvoidingView
				behavior={Platform.OS === "ios" ? "padding" : "height"}
				style={styles.keyboardAvoid}
			>
				{/* Progress Bar */}
				<View style={styles.progressBarContainer}>
					<View style={styles.progressBarTrack}>
						<Animated.View style={[styles.progressBarFill, progressStyle]} />
					</View>
				</View>

				<ScrollView
					contentContainerStyle={styles.scrollContent}
					showsVerticalScrollIndicator={false}
				>
					<View style={styles.content}>{renderStepContent()}</View>
				</ScrollView>

				{/* Bottom Buttons */}
				<View style={styles.bottomButtons}>
					<Button
						disabled={isLoading}
						fullWidth
						onPress={handleNext}
						size="md"
						title={getButtonTitle()}
						variant="primary"
					/>

					{showSkipButton === true && (
						<TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
							<Text style={styles.skipText}>Skip for now</Text>
						</TouchableOpacity>
					)}
				</View>
			</KeyboardAvoidingView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#000000",
	},
	keyboardAvoid: {
		flex: 1,
	},
	progressBarContainer: {
		paddingHorizontal: 24,
		paddingTop: 16,
		paddingBottom: 8,
	},
	progressBarTrack: {
		height: 4,
		backgroundColor: "rgba(255, 255, 255, 0.2)",
		borderRadius: 2,
		overflow: "hidden",
	},
	progressBarFill: {
		height: "100%",
		backgroundColor: "#1DB954",
		borderRadius: 2,
	},
	scrollContent: {
		flexGrow: 1,
		paddingHorizontal: 24,
		paddingTop: 32,
	},
	content: {
		flex: 1,
	},
	stepContent: {
		flex: 1,
	},
	stepTitle: {
		fontSize: 28,
		fontWeight: "700",
		color: "#FFFFFF",
		marginBottom: 12,
	},
	stepSubtitle: {
		fontSize: 16,
		color: "rgba(255, 255, 255, 0.7)",
		marginBottom: 32,
		lineHeight: 22,
	},
	inputField: {
		marginBottom: 12,
	},
	helperText: {
		fontSize: 14,
		color: "rgba(255, 255, 255, 0.5)",
	},
	genresContainer: {
		flexDirection: "row",
		flexWrap: "wrap",
		gap: 12,
		marginBottom: 24,
	},
	genreChip: {
		paddingHorizontal: 20,
		paddingVertical: 10,
		borderRadius: 20,
		backgroundColor: "rgba(255, 255, 255, 0.1)",
		borderWidth: 1,
		borderColor: "rgba(255, 255, 255, 0.2)",
	},
	genreChipSelected: {
		backgroundColor: "#1DB954",
		borderColor: "#1DB954",
	},
	genreText: {
		fontSize: 14,
		color: "#FFFFFF",
		fontWeight: "500",
	},
	genreTextSelected: {
		color: "#000000",
	},
	selectedCount: {
		fontSize: 14,
		color: "rgba(255, 255, 255, 0.7)",
		textAlign: "center",
	},
	preferencesContainer: {
		gap: 16,
	},
	preferenceItem: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		backgroundColor: "rgba(255, 255, 255, 0.05)",
		padding: 16,
		borderRadius: 12,
	},
	preferenceInfo: {
		flex: 1,
		marginRight: 16,
	},
	preferenceTitle: {
		fontSize: 16,
		fontWeight: "600",
		color: "#FFFFFF",
		marginBottom: 4,
	},
	preferenceDescription: {
		fontSize: 14,
		color: "rgba(255, 255, 255, 0.6)",
	},
	toggle: {
		width: 51,
		height: 31,
		borderRadius: 15.5,
		backgroundColor: "rgba(255, 255, 255, 0.3)",
		padding: 2,
		justifyContent: "center",
	},
	toggleActive: {
		backgroundColor: "#1DB954",
	},
	toggleThumb: {
		width: 27,
		height: 27,
		borderRadius: 13.5,
		backgroundColor: "#FFFFFF",
	},
	toggleThumbActive: {
		transform: [{ translateX: 20 }],
	},
	completeIcon: {
		alignItems: "center",
		marginBottom: 24,
	},
	completeEmoji: {
		fontSize: 80,
	},
	summaryContainer: {
		gap: 20,
		marginTop: 24,
	},
	summaryItem: {
		backgroundColor: "rgba(255, 255, 255, 0.05)",
		padding: 16,
		borderRadius: 12,
	},
	summaryLabel: {
		fontSize: 12,
		color: "rgba(255, 255, 255, 0.5)",
		marginBottom: 4,
		textTransform: "uppercase",
		letterSpacing: 0.5,
	},
	summaryValue: {
		fontSize: 16,
		color: "#FFFFFF",
		fontWeight: "500",
	},
	bottomButtons: {
		paddingHorizontal: 24,
		paddingBottom: 24,
		paddingTop: 16,
		gap: 12,
	},
	skipButton: {
		alignItems: "center",
		paddingVertical: 12,
	},
	skipText: {
		fontSize: 16,
		color: "rgba(255, 255, 255, 0.7)",
		fontWeight: "500",
	},
});
