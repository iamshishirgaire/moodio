import { AntDesign } from "@expo/vector-icons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
	coolDownAsync,
	maybeCompleteAuthSession,
	warmUpAsync,
} from "expo-web-browser";
import { useEffect, useState } from "react";
import {
	Alert,
	ImageBackground,
	KeyboardAvoidingView,
	Platform,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { theme } from "@/constants/theme";
import { authClient } from "@/lib/auth-client";
import { Button } from "../../components/ui/button";
import { Icon, Icons } from "../../components/ui/icon";
// Preloads the browser for Android devices to reduce authentication load time
export const useWarmUpBrowser = () => {
	useEffect(() => {
		if (Platform.OS !== "android") {
			return;
		}
		warmUpAsync();
		return () => {
			coolDownAsync();
		};
	}, []);
};

if (Platform.OS === "web") {
	maybeCompleteAuthSession();
}
export default function AuthHomeScreen() {
	const router = useRouter();
	const [isGoogleLoading, setIsGoogleLoading] = useState(false);
	const [isAppleLoading, setIsAppleLoading] = useState(false);

	const handleSignIn = () => {
		router.push("/auth/signin");
	};

	const handleSignUp = () => {
		router.push("/auth/signup");
	};

	const handleContinueWithGoogle = async () => {
		setIsGoogleLoading(true);
		try {
			const { error } = await authClient.signIn.social({
				provider: "google",
				callbackURL: "/(tabs)/home",
			});
			if (!error) {
				router.replace("/(tabs)/home");
			}
		} catch (e: unknown) {
			console.error(e);
			Alert.alert("Error", "Failed to sign in with Google. Please try again.");
		} finally {
			setIsGoogleLoading(false);
		}
	};

	const handleContinueWithApple = async () => {
		setIsAppleLoading(true);
		try {
			const { error } = await authClient.signIn.social({
				provider: "apple",
			});
			console.log(error);
			if (!error) {
				router.push("/(tabs)/home");
			}
		} catch (err: unknown) {
			console.error("Apple sign in error:", JSON.stringify(err, null, 2));
			Alert.alert("Error", "Failed to sign in with Apple. Please try again.");
		} finally {
			setIsAppleLoading(false);
		}
	};

	return (
		<View style={styles.container}>
			<StatusBar style="light" />
			<ImageBackground
				resizeMode="cover"
				source={require("@assets/images/auth_back.png")}
				style={styles.backgroundImage}
			>
				<LinearGradient
					colors={["rgba(0.5,0.5,0.5,0)", "white", "white"]}
					end={{ x: 0, y: 1 }}
					locations={[0.1, 0.3, 1]}
					start={{ x: 0, y: 0 }}
					style={styles.gradient}
				/>

				<SafeAreaView style={styles.safeArea}>
					<KeyboardAvoidingView
						behavior={Platform.OS === "ios" ? "padding" : "height"}
						style={styles.keyboardAvoid}
					>
						<ScrollView
							contentContainerStyle={styles.scrollContent}
							showsVerticalScrollIndicator={false}
						>
							<View style={styles.content}>
								{/* Logo */}
								<View style={styles.logoContainer}>
									<Image
										source={require("@assets/images/icon.png")}
										style={styles.logo}
									/>
								</View>

								{/* Title */}
								<View style={styles.titleContainer}>
									<Text style={styles.title}>Millions of Songs.</Text>
									<Text style={styles.title}>Free on Moodio.</Text>
								</View>

								{/* Buttons */}
								<View style={styles.buttonContainer}>
									<Button
										disabled={isGoogleLoading || isAppleLoading}
										fullWidth
										onPress={handleSignUp}
										size="md"
										style={styles.signUpButton}
										title="Sign up free"
										variant="primary"
									/>

									<Button
										disabled={isGoogleLoading || isAppleLoading}
										fullWidth
										icon={
											<AntDesign
												color={theme.colors.textSecondary}
												name="google"
												size={20}
											/>
										}
										onPress={handleContinueWithGoogle}
										size="md"
										style={styles.socialButton}
										title={
											isGoogleLoading ? "Connecting..." : "Continue with Google"
										}
										variant="secondary"
									/>

									<Button
										disabled={isGoogleLoading || isAppleLoading}
										fullWidth
										icon={
											<Icon
												color={theme.colors.textSecondary}
												icon={Icons.apple}
												size={20}
											/>
										}
										onPress={handleContinueWithApple}
										size="md"
										style={styles.socialButton}
										title={
											isAppleLoading ? "Connecting..." : "Continue with Apple"
										}
										variant="secondary"
									/>
								</View>

								{/* Login Link */}
								<View style={styles.loginContainer}>
									<Text style={styles.loginText}>
										Already have an account?{" "}
									</Text>
									<TouchableOpacity
										disabled={isGoogleLoading || isAppleLoading}
										onPress={handleSignIn}
									>
										<Text style={styles.loginLink}>Log in</Text>
									</TouchableOpacity>
								</View>

								{/* Terms */}
								<View style={styles.termsContainer}>
									<Text style={styles.termsText}>
										By continuing you agree to our{" "}
										<Text style={styles.termsLink}>Terms</Text> and{" "}
										<Text style={styles.termsLink}>Privacy Policy</Text>
									</Text>
								</View>
							</View>
						</ScrollView>
					</KeyboardAvoidingView>
				</SafeAreaView>
			</ImageBackground>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	backgroundImage: {
		flex: 1,
		width: "100%",
		height: "50%",
	},
	gradient: {
		...StyleSheet.absoluteFillObject,
	},
	safeArea: {
		flex: 1,
	},
	keyboardAvoid: {
		flex: 1,
	},
	scrollContent: {
		flexGrow: 1,
		justifyContent: "flex-end",
		alignItems: "center",
		marginBottom: 40,
	},
	content: {
		width: "100%",
		maxWidth: 400,
		paddingHorizontal: 24,
		alignItems: "center",
	},
	logoContainer: {
		marginBottom: 48,
	},
	logo: {
		width: 64,
		height: 64,
		justifyContent: "space-between",
		alignItems: "center",
	},
	titleContainer: {
		marginBottom: 48,
		alignItems: "center",
	},
	title: {
		fontSize: 32,
		fontWeight: "700",
		color: theme.colors.textSecondary,
		textAlign: "center",
		lineHeight: 40,
	},
	buttonContainer: {
		width: "100%",
		gap: 16,
		marginBottom: 32,
	},
	signUpButton: {
		marginBottom: 8,
	},
	socialButton: {
		marginBottom: 8,
	},
	loginContainer: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 24,
	},
	loginText: {
		fontSize: 14,
		color: theme.colors.textSecondary,
		fontWeight: "400",
	},
	loginLink: {
		fontSize: 14,
		color: theme.colors.textSecondary,
		fontWeight: "600",
	},
	termsContainer: {
		alignItems: "center",
	},
	termsText: {
		fontSize: 12,
		color: theme.colors.textSecondary,
		textAlign: "center",
		lineHeight: 16,
	},
	termsLink: {
		color: theme.colors.textSecondary,
		textDecorationLine: "underline",
	},
});
