/** biome-ignore-all lint/suspicious/noExplicitAny: <> */
import {
	RecordingPresets,
	requestRecordingPermissionsAsync,
	setAudioModeAsync,
	useAudioRecorder,
	useAudioRecorderState,
} from "expo-audio";
import {
	AndroidImportance,
	AndroidNotificationVisibility,
	requestPermissionsAsync,
	scheduleNotificationAsync,
	setNotificationChannelAsync,
} from "expo-notifications";
import { useEffect, useMemo, useRef, useState } from "react";
import { Alert, Platform } from "react-native";

export type SongResult = {
	title: string;
	artist: string;
	confidence?: number;
	album?: string;
	artwork?: string;
	artistImage?: string;
	artistId?: string;
	albumId?: string;
	externalUrls?: Record<string, string>;
};

const WS_URL =
	process.env.EXPO_PUBLIC_WS_URL || "ws://192.168.1.133:3002/ws/audio";
const STREAM_INTERVAL_MS = 100;
const MAX_RECORDING_TIME_MS = 10_000;

export default function useSongRecognition() {
	const [songResult, setSongResult] = useState<SongResult | null>(null);
	const [waitingForServer, setWaitingForServer] = useState(false);
	const [wsConnected, setWsConnected] = useState(false);
	const [bytesSent, setBytesSent] = useState(0);
	const [isListening, setIsListening] = useState(false);

	const recorder = useAudioRecorder({
		...RecordingPresets.HIGH_QUALITY,
		isMeteringEnabled: Platform.OS !== "web",
		web: {
			mimeType: "audio/webm",
			bitsPerSecond: 128_000,
		},
	});

	const state = useAudioRecorderState(recorder, 30);

	const wsRef = useRef<WebSocket | null>(null);
	const streamIntervalRef = useRef<number | null>(null);
	const recordingStartTimeRef = useRef<number | null>(null);

	// Normalize metering dB [-60, 0] -> [0, 1]
	const level = useMemo(() => {
		const m = (state as any).metering;
		if (typeof m !== "number") {
			return 0;
		}

		const minDb = -60;
		const maxDb = 0;
		const clamped = Math.max(minDb, Math.min(maxDb, m));
		return (clamped - minDb) / (maxDb - minDb);
	}, [state]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <>
	useEffect(() => {
		setupPermissions();
		openWebsocket();

		return () => {
			cleanup();
		};
	}, []);

	async function setupPermissions() {
		const { granted } = await requestRecordingPermissionsAsync();
		if (!granted) {
			Alert.alert("Microphone permission denied");
			return;
		}

		await setAudioModeAsync({
			allowsRecording: true,
			playsInSilentMode: true,
		});

		await setupNotifications();
	}

	async function setupNotifications() {
		try {
			if (Platform.OS === "ios") {
				await requestPermissionsAsync();
			} else if (Platform.OS === "android") {
				await setNotificationChannelAsync("default", {
					name: "Default",
					importance: AndroidImportance.DEFAULT,
					sound: "default",
					enableVibrate: true,
					lockscreenVisibility: AndroidNotificationVisibility.PUBLIC,
				});
			}
		} catch (e) {
			console.warn("Notification setup failed", e);
		}
	}

	function cleanup() {
		stopStreaming();
		closeWebsocket();
	}

	function closeWebsocket() {
		try {
			if (wsRef.current?.readyState === WebSocket.OPEN) {
				wsRef.current.close(1000, "Cleanup");
			}
		} catch (e) {
			console.warn("Failed to close WebSocket:", e);
		}
	}

	function openWebsocket() {
		if (wsRef.current?.readyState === WebSocket.OPEN) {
			return;
		}

		try {
			const ws = new WebSocket(WS_URL);
			ws.binaryType = "arraybuffer";
			ws.onopen = () => handleWebSocketOpen(ws);
			ws.onmessage = (ev) => handleWebSocketMessage(ev);
			ws.onerror = (e) => handleWebSocketError(e, ws);
			ws.onclose = (ev) => handleWebSocketClose(ev);
			wsRef.current = ws;
		} catch (e) {
			console.warn("WS open failed", e);
		}
	}

	function handleWebSocketOpen(ws: WebSocket) {
		try {
			setWsConnected(true);
			ws.send(
				JSON.stringify({
					event: "connected",
					ts: new Date().toISOString(),
				}),
			);
		} catch (e) {
			console.warn("ws.onopen send failed", e);
		}
	}

	async function handleWebSocketMessage(ev: MessageEvent) {
		if (typeof ev.data !== "string") {
			return;
		}

		try {
			const json = JSON.parse(ev.data);
			console.debug("[WS] parsed", json);

			if (json.type === "result" && json.result) {
				await handleSongResult(json.result);
			} else if (json.type === "bytes_received") {
				handleBytesReceived(json.bytes);
			}
		} catch (error) {
			console.warn("Failed to parse WebSocket message:", error);
		}
	}

	async function handleSongResult(result: any) {
		setWaitingForServer(false);
		await stopStreaming();
		setIsListening(false);

		const enriched: SongResult = {
			title: result.title,
			artist: result.artist,
			confidence: result.confidence,
			album: result.album,
			artwork: result.artwork,
			artistImage: result.artistImage,
			artistId: result.artistId,
			albumId: result.albumId,
			externalUrls: result.externalUrls,
		};

		setSongResult(enriched);
		await showNotification(enriched);
		closeWebsocket();
	}

	function handleBytesReceived(bytes: number) {
		console.log("[WS] server bytes_received", bytes);
		setBytesSent(bytes || 0);
	}

	async function showNotification(result: SongResult) {
		try {
			await scheduleNotificationAsync({
				content: {
					title: "Song Identified",
					body: `${result.title} — ${result.artist}`,
					sound: true,
				},
				trigger: null,
			});
		} catch (e) {
			console.warn("Failed to present notification", e);
		}
	}

	function handleWebSocketError(e: Event, ws: WebSocket) {
		console.warn("WS onerror", e);
		setWsConnected(false);
		try {
			if (ws.readyState !== WebSocket.CLOSED) {
				ws.close();
			}
		} catch (err) {
			console.log(err);
		}
		wsRef.current = null;
	}

	function handleWebSocketClose(ev: CloseEvent) {
		setWsConnected(false);
		wsRef.current = null;
		console.debug("WS closed", {
			code: (ev as any)?.code,
			reason: (ev as any)?.reason,
		});
	}

	function ensureWebsocket() {
		const s = wsRef.current?.readyState;
		const isConnectedOrConnecting =
			s === WebSocket.OPEN || s === WebSocket.CONNECTING;

		if (!(wsRef.current && isConnectedOrConnecting)) {
			openWebsocket();
		}
	}

	async function streamAudioData() {
		const uri = recorder.uri;
		if (!uri) {
			return;
		}

		try {
			const base64 = await readAudioAsBase64(uri);
			await sendAudioChunk(base64);
		} catch (e) {
			console.log(e);
			console.warn("Failed to stream audio data", e);
		}
	}

	async function readAudioAsBase64(uri: string): Promise<string> {
		if (Platform.OS === "web") {
			return await readWebAudio(uri);
		}
		return await readNativeAudio(uri);
	}

	async function readWebAudio(uri: string): Promise<string> {
		const response = await fetch(uri);
		const blob = await response.blob();
		const arrayBuffer = await blob.arrayBuffer();
		return btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
	}

	async function readNativeAudio(uri: string): Promise<string> {
		const FileSystem = require("expo-file-system/legacy");
		return await FileSystem.readAsStringAsync(uri, {
			encoding: "base64",
		});
	}

	function sendAudioChunk(base64: string) {
		if (wsRef.current?.readyState !== WebSocket.OPEN) {
			return;
		}

		wsRef.current.send(
			JSON.stringify({
				event: "audio_chunk",
				data: base64,
				ts: new Date().toISOString(),
			}),
		);

		const estimatedBytes = (base64.length * 3) / 4;
		setBytesSent((prev) => prev + estimatedBytes);
	}

	function checkMaxRecordingTime() {
		if (!recordingStartTimeRef.current) {
			return false;
		}

		const elapsed = Date.now() - recordingStartTimeRef.current;
		if (elapsed >= MAX_RECORDING_TIME_MS) {
			console.log("Max recording time reached, stopping...");
			stop();
			return true;
		}
		return false;
	}

	function startStreaming() {
		if (streamIntervalRef.current) {
			return;
		}

		recordingStartTimeRef.current = Date.now();

		streamIntervalRef.current = setInterval(() => {
			if (checkMaxRecordingTime()) {
				return;
			}
			streamAudioData();
		}, STREAM_INTERVAL_MS) as any;
	}

	async function stopStreaming() {
		if (streamIntervalRef.current) {
			clearInterval(streamIntervalRef.current);
			streamIntervalRef.current = null;
		}
		recordingStartTimeRef.current = null;

		try {
			if (state.isRecording) {
				await recorder.stop();
			}
		} catch (e) {
			console.warn("Failed to stop recorder", e);
		}
	}

	function sendStartEvent() {
		if (wsRef.current?.readyState !== WebSocket.OPEN) {
			return;
		}

		try {
			wsRef.current.send(
				JSON.stringify({
					event: "start",
					streamIntervalMs: STREAM_INTERVAL_MS,
					maxDurationMs: MAX_RECORDING_TIME_MS,
					ts: new Date().toISOString(),
				}),
			);
		} catch (e) {
			console.warn("Failed to send start event", e);
		}
	}

	function sendStopEvent() {
		if (wsRef.current?.readyState !== WebSocket.OPEN) {
			return;
		}

		wsRef.current.send(
			JSON.stringify({
				event: "stop",
				ts: new Date().toISOString(),
			}),
		);
	}

	const start = async () => {
		try {
			ensureWebsocket();
			await recorder.prepareToRecordAsync();
			recorder.record();
			sendStartEvent();
			setIsListening(true);
			startStreaming();
		} catch (e: any) {
			Alert.alert("Start failed", e?.message ?? String(e));
		}
	};

	const stop = async () => {
		try {
			await stopStreaming();
			setIsListening(false);

			if (recorder.uri) {
				await streamAudioData();
			}

			sendStopEvent();
			setWaitingForServer(true);
		} catch (e: any) {
			Alert.alert("Stop failed", e?.message ?? String(e));
		}
	};

	const clearResult = () => setSongResult(null);

	return {
		isRecording: !!state.isRecording,
		isListening,
		level,
		wsConnected,
		bytesSent,
		waitingForServer,
		songResult,
		start,
		stop,
		clearResult,
	} as const;
}
