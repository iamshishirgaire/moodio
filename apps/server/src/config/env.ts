import z from "zod";

export const envschema = z.object({
	PORT: z.coerce.number().int().positive(),
	LOG_LEVEL: z.string(),
	NODE_ENV: z
		.enum(["development", "test", "production"])
		.default("development"),
	CORS_ORIGIN: z.url(),
	DATABASE_URL: z.url().startsWith("postgresql://"),
	REDIS_HOST: z.string(),
	REDIS_PORT: z.coerce.number().int().positive(),
	REDIS_PASSWORD: z.string(),

	GOOGLE_CLIENT_ID: z.string(),
	GOOGLE_CLIENT_SECRET: z.string(),
	GOOGLE_REDIRECT_URI: z.url(),
});

const parsed = envschema.safeParse(process.env);

if (!parsed.success) {
	const message = parsed.error.issues
		.map((e) => `Invalid env ${e.path.join(".")}: ${e.message}`)
		.join("\n");
	throw new Error(`Environment validation failed:\n${message}`);
}
export const env = parsed.data;
export type Env = z.infer<typeof envschema>;
