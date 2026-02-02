/** biome-ignore-all lint/suspicious/noExplicitAny: <> */
import { File } from "expo-file-system";

function shouldForceBase64(): boolean {
	try {
		return !!(global as any).__FORCE_BASE64_WS;
	} catch {
		return false;
	}
}
export type SongResult = {
	title: string;
	artist: string;
	confidence: number;
	// Optional rich metadata
	album?: string;
	artwork?: string; // album cover image URL
	artistImage?: string; // artist photo URL
	artistId?: string;
	albumId?: string;
	externalUrls?: {
		artist?: string;
		album?: string;
		track?: string;
	};
};

// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: <>
export default async function sendRecordedFileAsChunk(
	uri: string,
	ws: WebSocket | null,
): Promise<number> {
	let localSentBytes = 0;
	let file: File | null = null;
	let buffer: ArrayBuffer | null = null;
	try {
		try {
			file = new File(uri);
			buffer = await file.arrayBuffer();
			console.log("[Audio] chunk read", {
				uri,
				byteLength: buffer?.byteLength ?? 0,
			});
		} catch (e) {
			console.warn("Failed to read file via new FS API", e);
		}

		if (!ws) {
			console.warn("No WS instance, chunk not sent");
		} else if (ws.readyState === WebSocket.OPEN) {
			try {
				const forceBase64 = shouldForceBase64();
				if (buffer && !forceBase64) {
					ws.send(buffer);
					localSentBytes = buffer.byteLength;
					try {
						console.log("[Audio] sending chunk as binary", {
							bytes: localSentBytes,
						});
					} catch (e) {
						console.log(e);
					}
					ws.send(
						JSON.stringify({
							event: "chunk_sent",
							bytes: localSentBytes,
							ts: new Date().toISOString(),
						}),
					);
				} else if (buffer) {
					// Convert buffer -> base64
					let b64 = "";
					try {
						if (typeof (global as any).Buffer !== "undefined") {
							b64 = (global as any).Buffer.from(buffer).toString("base64");
						} else {
							const bytes = new Uint8Array(buffer);
							let binary = "";
							for (let i = 0; i < bytes.byteLength; i++) {
								binary += String.fromCharCode(bytes[i]);
							}
							b64 = btoa(binary);
						}
					} catch (e) {
						console.warn("Base64 conversion failed", e);
					}
					ws.send(b64);
					localSentBytes = buffer.byteLength;
					try {
						console.log("[Audio] sending chunk as base64", {
							approxBytes: localSentBytes,
							b64Length: b64.length,
							forced: forceBase64,
						});
					} catch (e) {
						console.log(e);
					}
					ws.send(
						JSON.stringify({
							event: "chunk_sent",
							bytes: localSentBytes,
							ts: new Date().toISOString(),
						}),
					);
				} else {
					console.warn("No buffer available to send; chunk skipped");
				}
			} catch (e) {
				console.warn("send chunk failed, fallback to base64", e);
				try {
					if (buffer) {
						let b64 = "";
						try {
							if (typeof (global as any).Buffer !== "undefined") {
								b64 = (global as any).Buffer.from(buffer).toString("base64");
							} else {
								const bytes = new Uint8Array(buffer);
								let binary = "";
								for (let i = 0; i < bytes.byteLength; i++) {
									binary += String.fromCharCode(bytes[i]);
								}
								b64 = btoa(binary);
							}
						} catch (convErr) {
							console.warn("Base64 conversion (fallback) failed", convErr);
						}
						ws.send(b64);
						localSentBytes = buffer.byteLength;
						try {
							console.log("[Audio] fallback sending as base64", {
								approxBytes: localSentBytes,
								b64Length: b64.length,
							});
						} catch (err) {
							console.log(err);
						}
						ws.send(
							JSON.stringify({
								event: "chunk_sent",
								bytes: localSentBytes,
								ts: new Date().toISOString(),
							}),
						);
					}
				} catch (e2) {
					console.warn("fallback send failed", e2);
				}
			}
		} else {
			console.warn(
				"WS exists but not open, chunk not sent (readyState)",
				ws?.readyState,
			);
		}
	} catch (e) {
		console.warn("sendRecordedFileAsChunk failed", e);
	}

	try {
		if (file) {
			file.delete();
		}
	} catch (e) {
		console.warn("delete temp file failed", e);
	}

	return localSentBytes;
}

export function startChunkLoop(
	recorder: any,
	intervalMs: number,
	onChunk: (uri: string) => Promise<void>,
): number {
	const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
	const id = global.setInterval(async () => {
		try {
			await recorder.stop();
			await sleep(100);
			const uri = recorder.uri;
			if (uri) {
				try {
					console.log("[Audio] chunk captured", { uri, intervalMs });
				} catch (e) {
					console.log(e);
				}
				await onChunk(uri);
			} else {
				try {
					console.log("[Audio] no URI after stop; skipping this interval");
				} catch (e) {
					console.log(e);
				}
			}
			await recorder.prepareToRecordAsync();
			recorder.record();
		} catch (e) {
			console.warn("chunk loop error", e);
		}
	}, intervalMs) as unknown as number;
	return id;
}

export function stopChunkLoop(timerId: number | null): void {
	try {
		if (timerId) {
			clearInterval(timerId);
		}
	} catch (e) {
		console.log(e);
	}
}
