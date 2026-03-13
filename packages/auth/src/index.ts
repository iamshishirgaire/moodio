import { expo } from "@better-auth/expo";
import { db } from "@moodio/db";
// biome-ignore lint/performance/noNamespaceImport: <>
import * as schema from "@moodio/db/schema/auth";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { openAPI } from "better-auth/plugins";

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: "pg",
		schema,
	}),
	trustedOrigins: [
		process.env.CORS_ORIGIN || "",
		"moodio://",
		"exp://",
		"https://appleid.apple.com",
	],
	emailAndPassword: {
		enabled: true,
		autoSignIn: true,
	},
	socialProviders: {
		google: {
			prompt: "select_account",
			clientId: process.env.GOOGLE_CLIENT_ID as string,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
			redirectURI: process.env.GOOGLE_REDIRECT_URI,
		},
		apple: {
			clientId: process.env.APPLE_CLIENT_ID as string,
			clientSecret: process.env.APPLE_CLIENT_SECRET as string,
		},
	},
	autoSignInAfterVerification: true,
	advanced: {
		defaultCookieAttributes: {
			sameSite: "none",
			secure: true,
			httpOnly: true,
		},
	},
	plugins: [expo(), openAPI({})],
});
