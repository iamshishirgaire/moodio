import "dotenv/config";
import { cors } from "@elysiajs/cors";
import { createContext } from "@moodio/api/context";
import { appRouter } from "@moodio/api/routers/index";
import { openAPITags } from "@moodio/api/utils/open-api-tags";
import { auth } from "@moodio/auth";
import { OpenAPI } from "@moodio/auth/openApi";
import { LoggingHandlerPlugin } from "@orpc/experimental-pino";
import { OpenAPIHandler } from "@orpc/openapi/fetch";
import { OpenAPIReferencePlugin } from "@orpc/openapi/plugins";
import { onError } from "@orpc/server";
import { RPCHandler } from "@orpc/server/fetch";
import { ZodToJsonSchemaConverter } from "@orpc/zod/zod4";
import { Elysia } from "elysia";
import pc from "picocolors";
import { env } from "./config/env";
import { logger } from "./config/logger";

const ELYSIA_VERSION = import.meta.require("elysia/package.json").version;

const startTime = performance.now();

// clear screen
process.stdout.write("\x1Bc\n");

const rpcHandler = new RPCHandler(appRouter, {
	interceptors: [
		onError((error) => {
			console.error(error);
		}),
	],
});
const apiHandler = new OpenAPIHandler(appRouter, {
	plugins: [
		new OpenAPIReferencePlugin({
			schemaConverters: [new ZodToJsonSchemaConverter()],
			specGenerateOptions: {
				tags: [...openAPITags],
				components: await OpenAPI.components,
				paths: await OpenAPI.getPaths(),
				info: {
					title: "Moodio Api Playground",
					version: "1.0.0",
					description: "API for moodio music application.",
					contact: {
						name: "Shishir Gaire",
						email: "shishirgaire35@gmail.com",
					},
				},
			},
		}),
		new LoggingHandlerPlugin({
			logger, // Custom logger instance
			generateId: () => crypto.randomUUID(), // Custom ID generator
			logRequestResponse: true, // Log request start/end (disabled by default)
			logRequestAbort: true, // Log when requests are aborted (disabled by default)
		}),
	],
	interceptors: [
		onError((error) => {
			console.error(error);
		}),
	],
});

new Elysia()
	.use(
		cors({
			origin: process.env.CORS_ORIGIN || "",
			methods: ["GET", "POST", "OPTIONS"],
			allowedHeaders: ["Content-Type", "Authorization"],
			credentials: true,
		}),
	)
	.all("/api/auth/*", (context) => {
		const { request, status } = context;
		if (["POST", "GET"].includes(request.method)) {
			return auth.handler(request);
		}
		return status(405);
	})
	.all("/rpc*", async (context) => {
		const { response } = await rpcHandler.handle(context.request, {
			prefix: "/rpc",
			context: await createContext({ context }),
		});
		return response ?? new Response("Not Found", { status: 404 });
	})
	.all("/api*", async (context) => {
		const { response } = await apiHandler.handle(context.request, {
			prefix: "/api",
			context: await createContext({ context }),
		});
		return response ?? new Response("Not Found", { status: 404 });
	})
	.get("/", () => "OK")

	.listen(env.PORT, (server) => {
		const duration = performance.now() - startTime;
		console.log(
			`🦊 ${pc.green(`${pc.bold("Elysia")} v${ELYSIA_VERSION}`)} ${pc.gray("started in")} ${pc.bold(duration.toFixed(2))} ms\n`,
		);
		console.log(
			`${pc.green(" ➜ ")} ${pc.bold("Server")}:   ${pc.cyan(String(server.url))}`,
		);
	});
