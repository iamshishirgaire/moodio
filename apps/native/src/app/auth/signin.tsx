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
import { Button } from "@/components/ui/button";
import { Icon, Icons } from "@/components/ui/icon";
import { TextInputField } from "@/components/ui/text-input";
import { theme } from "@/constants/theme";
import { authClient } from "@/lib/auth-client";

export default function SignInScreen() {
	const router = useRouter();

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const handleSignIn = async () => {
		if (!(email || password)) {
			Alert.alert("Error", "Please fill in all fields");
			return;
		}

		setIsLoading(true);
		try {
			const { error } = await authClient.signIn.email({
				email,
				password,
			});
			if (error) {
				Alert.alert("Error", `${error.message}`);
			} else {
				router.replace("/(tabs)/home");
			}
		} catch (err) {
			Alert.alert("Error", `${err}`);
		} finally {
			setIsLoading(false);
		}
	};

	const handleForgotPassword = () => {
		// Navigate to forgot password screen
		router.push("/auth/forgot-password");
	};

	const handleSignUp = () => {
		router.push("/auth/signup");
	};

	return (
		<View style={styles.container}>
			<KeyboardAvoidingView
				behavior={Platform.OS === "ios" ? "padding" : "height"}
				style={styles.keyboardAvoid}
			>
				<ScrollView
					contentContainerStyle={styles.scrollContent}
					keyboardShouldPersistTaps="handled"
					showsVerticalScrollIndicator={false}
				>
					<View style={styles.content}>
						{/* Form */}
						<View style={styles.form}>
							<TextInputField
								autoCapitalize="none"
								autoComplete="email"
								editable={!isLoading}
								keyboardType="email-address"
								label="Email or phone number"
								onChangeText={setEmail}
								placeholder="Enter your email"
								value={email}
							/>

							<TextInputField
								autoComplete="password"
								editable={!isLoading}
								label="Password"
								onChangeText={setPassword}
								onRightIconPress={() => setShowPassword(!showPassword)}
								onSubmitEditing={handleSignIn}
								placeholder="Enter your password"
								returnKeyType="done"
								rightIcon={
									<Icon
										color="white"
										icon={showPassword ? Icons.eye : Icons.eyeOff}
										size={20}
									/>
								}
								secureTextEntry={!showPassword}
								value={password}
							/>

							<TouchableOpacity
								disabled={isLoading}
								onPress={handleForgotPassword}
								style={styles.forgotPassword}
							>
								<Text style={styles.forgotPasswordText}>Forgot password?</Text>
							</TouchableOpacity>

							<Button
								disabled={isLoading}
								fullWidth
								onPress={handleSignIn}
								size="md"
								style={styles.signInButton}
								title={isLoading ? "Signing In..." : "Sign In"}
								variant="primary"
							/>

							<TouchableOpacity
								disabled={isLoading}
								onPress={handleSignUp}
								style={styles.signUpLink}
							>
								<Text style={styles.signUpText}>
									Don't have an account?{" "}
									<Text style={styles.signUpTextBold}>Sign Up</Text>
								</Text>
							</TouchableOpacity>
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
	},
	form: {
		paddingHorizontal: 24,
		paddingTop: 32,
		paddingBottom: 24,
	},
	forgotPassword: {
		alignSelf: "flex-end",
		marginBottom: 24,
	},
	forgotPasswordText: {
		fontSize: 14,
		color: theme.colors.textSecondary,
		fontWeight: "500",
	},
	signInButton: {
		marginBottom: 24,
	},
	signUpLink: {
		alignItems: "center",
	},
	signUpText: {
		fontSize: 14,
		color: theme.colors.textTertiary,
		textAlign: "center",
	},
	signUpTextBold: {
		fontWeight: "600",
	},
});
