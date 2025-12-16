import { useRouter } from "expo-router";
import { useState } from "react";
import {
	Alert,
	KeyboardAvoidingView,
	Platform,
	ScrollView,
	StyleSheet,
	View,
} from "react-native";
import Animated, {
	useAnimatedStyle,
	useSharedValue,
	withTiming,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";
import { Icon, Icons } from "@/components/ui/icon";
import { authClient } from "@/lib/auth-client";
import { Button } from "../../components/ui/button";
import { TextInputField } from "../../components/ui/text-input";
import { theme } from "../../constants/theme";

type SignupStep = "name" | "email" | "password" | "confirm";

export default function SignUpScreen() {
	const [step, setStep] = useState<SignupStep>("name");
	const [firstNameInput, setFirstName] = useState("");
	const [lastNameInput, setLastName] = useState("");
	const [emailInput, setEmail] = useState("");
	const [passwordInput, setPassword] = useState("");
	const [confirmPasswordInput, setConfirmPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const router = useRouter();

	const contentTranslateX = useSharedValue(0);
	const contentOpacity = useSharedValue(1);

	const stepsOrder: SignupStep[] = ["name", "email", "password", "confirm"];
	const nextStepMap: Partial<Record<SignupStep, SignupStep>> = {
		name: "email",
		email: "password",
		password: "confirm",
	};
	const prevStepMap: Partial<Record<SignupStep, SignupStep>> = {
		email: "name",
		password: "email",
		confirm: "password",
	};

	const moveToStep = (newStep: SignupStep) => {
		const currentIndex = stepsOrder.indexOf(step);
		const newIndex = stepsOrder.indexOf(newStep);
		const direction = newIndex > currentIndex ? 1 : -1;

		// Animate current content out
		contentTranslateX.value = withTiming(-300 * direction, { duration: 250 });
		contentOpacity.value = withTiming(0, { duration: 200 });

		setTimeout(() => {
			scheduleOnRN(() => setStep(newStep));

			contentTranslateX.value = 300 * direction;
			contentOpacity.value = 0;

			contentTranslateX.value = withTiming(0, { duration: 250 });
			contentOpacity.value = withTiming(1, { duration: 200 });
		}, 250);
	};

	const validators: Record<
		SignupStep,
		(ctx: {
			firstName: string;
			lastName: string;
			email: string;
			password: string;
			confirmPassword: string;
		}) => boolean
	> = {
		name: ({ firstName, lastName }) => {
			if (!(firstName.trim() && lastName.trim())) {
				Alert.alert("Error", "Please enter your first and last name");
				return false;
			}
			return true;
		},
		email: ({ email }) => {
			if (!email.trim()) {
				Alert.alert("Error", "Please enter your email");
				return false;
			}
			if (!email.includes("@")) {
				Alert.alert("Error", "Please enter a valid email");
				return false;
			}
			return true;
		},
		password: ({ password }) => {
			if (!password) {
				Alert.alert("Error", "Please enter a password");
				return false;
			}
			if (password.length < 8) {
				Alert.alert("Error", "Password must be at least 8 characters");
				return false;
			}
			return true;
		},
		confirm: ({ password, confirmPassword }) => {
			if (!confirmPassword) {
				Alert.alert("Error", "Please confirm your password");
				return false;
			}
			if (password !== confirmPassword) {
				Alert.alert("Error", "Passwords do not match");
				return false;
			}
			return true;
		},
	};

	async function handleNext() {
		const isValid = validators[step]({
			firstName: firstNameInput,
			lastName: lastNameInput,
			email: emailInput,
			password: passwordInput,
			confirmPassword: confirmPasswordInput,
		});

		if (!isValid) {
			return;
		}

		if (step === "confirm") {
			await handleSignUp();
			return;
		}

		const target = nextStepMap[step];
		if (target) {
			moveToStep(target);
		}
	}

	const handleSignUp = async () => {
		setIsLoading(true);
		try {
			const { data, error } = await authClient.signUp.email({
				email: emailInput,
				password: passwordInput,
				name: `${firstNameInput} ${lastNameInput}`,
			});

			if (error) {
				console.log("Sign up error:", JSON.stringify(error, null, 2));
				Alert.alert("Error", error.message || "Sign up failed");
			} else {
				console.log("Sign up success:", JSON.stringify(data, null, 2));
				Alert.alert("Success", "Account created successfully!");
				router.replace("/(tabs)/home");
			}
		} catch (err) {
			console.error("Sign up error:", err);
			Alert.alert("Error", "Failed to create account. Please try again.");
		} finally {
			setIsLoading(false);
		}
	};

	const handleBack = () => {
		if (step === "name") {
			router.push("/auth/signin");
			return;
		}
		const target = prevStepMap[step];
		if (target) {
			moveToStep(target);
		}
	};

	const animatedContentStyle = useAnimatedStyle(() => ({
		transform: [{ translateX: contentTranslateX.value }],
		opacity: contentOpacity.value,
	}));

	const dotIndicatorStyle = useAnimatedStyle(() => {
		const currentIndex = stepsOrder.indexOf(step);
		const dotWidth = 8;
		const dotSpacing = 16;
		const indicatorWidth = dotWidth + dotSpacing * currentIndex;

		return {
			width: withTiming(indicatorWidth, { duration: 250 }),
		};
	});

	const renderStepContent = () => {
		switch (step) {
			case "name":
				return (
					<Animated.View style={[styles.stepContent, animatedContentStyle]}>
						<TextInputField
							autoComplete="name"
							cursorColor={theme.colors.primary}
							label="First Name"
							onChangeText={setFirstName}
							placeholder="Enter first name"
							style={styles.inputField}
							value={firstNameInput}
						/>
						<TextInputField
							autoComplete="family-name"
							cursorColor={theme.colors.primary}
							label="Last Name"
							onChangeText={setLastName}
							placeholder="Enter last name"
							style={styles.inputField}
							value={lastNameInput}
						/>
					</Animated.View>
				);

			case "email":
				return (
					<Animated.View style={[styles.stepContent, animatedContentStyle]}>
						<TextInputField
							autoCapitalize="none"
							autoComplete="email"
							cursorColor={theme.colors.primary}
							keyboardType="email-address"
							label="Email"
							onChangeText={setEmail}
							placeholder="Enter your email"
							style={styles.inputField}
							value={emailInput}
						/>
					</Animated.View>
				);

			case "password":
				return (
					<Animated.View style={[styles.stepContent, animatedContentStyle]}>
						<TextInputField
							autoComplete="password"
							cursorColor={theme.colors.primary}
							label="Password"
							onChangeText={setPassword}
							onRightIconPress={() => setShowPassword(!showPassword)}
							placeholder="Create a password (min 8 characters)"
							rightIcon={
								<Icon
									color="white"
									icon={showPassword ? Icons.eye : Icons.eyeOff}
									size={20}
								/>
							}
							secureTextEntry={!showPassword}
							style={styles.inputField}
							value={passwordInput}
						/>
					</Animated.View>
				);

			case "confirm":
				return (
					<Animated.View style={[styles.stepContent, animatedContentStyle]}>
						<TextInputField
							autoComplete="password"
							cursorColor={theme.colors.primary}
							label="Confirm Password"
							onChangeText={setConfirmPassword}
							onRightIconPress={() =>
								setShowConfirmPassword(!showConfirmPassword)
							}
							placeholder="Confirm your password"
							rightIcon={
								<Icon
									color="white"
									icon={showConfirmPassword ? Icons.eye : Icons.eyeOff}
									size={20}
								/>
							}
							secureTextEntry={!showConfirmPassword}
							style={styles.inputField}
							value={confirmPasswordInput}
						/>
					</Animated.View>
				);

			default:
				return null;
		}
	};

	const getButtonTitle = () => (step === "confirm" ? "Create Account" : "Next");

	return (
		<View style={styles.container}>
			<KeyboardAvoidingView
				behavior={Platform.OS === "ios" ? "padding" : "height"}
				style={styles.keyboardAvoid}
			>
				<ScrollView
					contentContainerStyle={styles.scrollContent}
					showsVerticalScrollIndicator={false}
				>
					<View style={styles.content}>
						{/* Progress Indicator at Top */}
						<View style={styles.topIndicator}>
							<View style={styles.dotIndicator}>
								<View style={styles.dotTrack}>
									<Animated.View
										style={[styles.dotProgress, dotIndicatorStyle]}
									/>
								</View>
							</View>
						</View>

						{/* Form Content */}
						<View style={styles.formContent}>
							{renderStepContent()}

							<Button
								disabled={isLoading}
								fullWidth
								onPress={handleNext}
								size="md"
								title={getButtonTitle()}
								variant="primary"
							/>

							{step !== "name" && (
								<Button
									disabled={isLoading}
									fullWidth
									onPress={handleBack}
									size="md"
									style={styles.backButton}
									title="Back"
									variant="secondary"
								/>
							)}
						</View>
					</View>
				</ScrollView>
			</KeyboardAvoidingView>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: theme.colors.background,
	},
	keyboardAvoid: {
		flex: 1,
	},
	scrollContent: {
		flexGrow: 1,
		justifyContent: "flex-start",
	},
	content: {
		flex: 1,
		paddingHorizontal: theme.spacing.lg,
	},
	topIndicator: {
		alignItems: "center",
		paddingVertical: theme.spacing.sm,
		marginBottom: theme.spacing.lg,
	},
	dotIndicator: {
		alignItems: "center",
	},
	dotTrack: {
		width: 96,
		height: 4,
		backgroundColor: theme.colors.surfaceSecondary,
		borderRadius: theme.borderRadius.sm,
		overflow: "hidden",
	},
	dotProgress: {
		height: "100%",
		backgroundColor: theme.colors.primary,
		borderRadius: theme.borderRadius.sm,
	},
	formContent: {
		flex: 1,
	},
	stepContent: {
		marginBottom: theme.spacing.xxl,
	},
	inputField: {
		marginBottom: theme.spacing.sm,
	},
	backButton: {
		marginTop: theme.spacing.md,
	},
	verificationHeader: {
		marginBottom: theme.spacing.lg,
	},
	verificationTitle: {
		fontSize: 24,
		fontWeight: "bold",
		color: "white",
		marginBottom: theme.spacing.xs,
	},
	verificationSubtitle: {
		fontSize: 14,
		color: "rgba(255, 255, 255, 0.7)",
	},
});
