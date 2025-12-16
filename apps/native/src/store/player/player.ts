/** biome-ignore-all lint/complexity/noExcessiveCognitiveComplexity: <> */
/** biome-ignore-all lint/suspicious/useAwait: <> */
/** biome-ignore-all lint/nursery/noIncrementDecrement: <> */

import type { TTrack } from "@moodio/api/features/album/schema";
import { type AudioPlayer, setAudioModeAsync } from "expo-audio";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import type { TAlbumWithUserName } from "../home/album";
import zustandStorage from "../storage";

export type TPlayerTrack = TTrack & {
	albumArtwork: TAlbumWithUserName["images"];
};
export type RepeatMode = "off" | "context" | "track";
export type PlaybackState =
	| "playing"
	| "paused"
	| "stopped"
	| "loading"
	| "buffering"
	| "error";

type AudioDevice = {
	id: string;
	name: string;
	type: "speaker" | "headphones" | "bluetooth" | "airplay";
	isActive: boolean;
};

type PlaybackError = {
	message: string;
	code?: string;
	timestamp: number;
};

type MusicPlayerState = {
	// Playback state
	player: AudioPlayer | null;
	currentTrack: TPlayerTrack | null;
	playbackState: PlaybackState;
	position: number; // in milliseconds
	duration: number; // in milliseconds
	isBuffering: boolean;

	// Queue management
	queue: TPlayerTrack[];
	queueIndex: number;
	originalQueue: TPlayerTrack[]; // For shuffle restoration
	history: TPlayerTrack[];

	// Playback controls
	volume: number; // 0 to 1
	isMuted: boolean;
	previousVolume: number;
	isShuffled: boolean;
	repeatMode: RepeatMode;

	// Device management
	availableDevices: AudioDevice[];
	activeDevice: AudioDevice | null;

	// Error handling
	error: PlaybackError | null;

	// Actions - Playback Control
	play: () => void;
	pause: () => void;
	togglePlayPause: () => void;
	stop: () => void;
	seekTo: (position: number) => void;

	// Actions - Track Management
	setTrack: (track: TPlayerTrack, playImmediately?: boolean) => Promise<void>;
	playNext: () => Promise<void>;
	playPrevious: () => Promise<void>;
	skipTo: (index: number) => Promise<void>;

	// Actions - Queue Management
	setQueue: (tracks: TPlayerTrack[], startIndex?: number) => Promise<void>;
	addToQueue: (track: TPlayerTrack) => void;
	addMultipleToQueue: (tracks: TPlayerTrack[]) => void;
	removeFromQueue: (index: number) => void;
	clearQueue: () => void;
	reorderQueue: (fromIndex: number, toIndex: number) => void;

	// Actions - Volume & Audio
	setVolume: (volume: number) => void;
	toggleMute: () => void;
	increaseVolume: (amount?: number) => void;
	decreaseVolume: (amount?: number) => void;

	// Actions - Playback Modes
	toggleShuffle: () => void;
	setRepeatMode: (mode: RepeatMode) => void;
	toggleRepeat: () => void;

	// Actions - Device Management
	setActiveDevice: (device: AudioDevice) => void;
	refreshDevices: () => void;

	// Actions - Lock Screen Controls
	updateLockScreen: (enabled: boolean) => void;

	// Actions - Internal/Utility
	initializePlayer: () => void;
	clearError: () => void;
	reset: () => void;
};

// Utility to shuffle array
const shuffleArray = <T>(array: T[]): T[] => {
	const shuffled = [...array];
	for (let i = shuffled.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
	}
	return shuffled;
};

export const useMusicPlayer = create<MusicPlayerState>()(
	devtools(
		persist(
			(set, get) => ({
				// Initial state
				player: null,
				currentTrack: null,
				playbackState: "stopped",
				position: 0,
				duration: 0,
				isBuffering: false,

				queue: [],
				queueIndex: -1,
				originalQueue: [],
				history: [],

				volume: 1.0,
				isMuted: false,
				previousVolume: 1.0,
				isShuffled: false,
				repeatMode: "off",

				availableDevices: [],
				activeDevice: null,

				error: null,

				// Initialize the audio player
				initializePlayer: async () => {
					try {
						// Set audio mode for playback

						await setAudioModeAsync({
							playsInSilentMode: true,
							shouldPlayInBackground: true,
							interruptionMode: "doNotMix", // ← Must be "doNotMix", NOT "duckOthers"
							interruptionModeAndroid: "doNotMix",
						});
					} catch (error) {
						console.error("Failed to initialize audio mode:", error);
					}
				},

				// Playback Control Actions
				play: async () => {
					const { player, currentTrack } = get();

					if (!currentTrack) {
						console.warn("No track to play");
						return;
					}

					try {
						set({ playbackState: "loading", error: null });

						if (player) {
							player.play();
							set({ playbackState: "playing" });
						} else {
							// Load new track
							await get().setTrack(currentTrack, true);
						}
					} catch (error) {
						console.error("Play error:", error);
						set({
							playbackState: "error",
							error: {
								message:
									error instanceof Error ? error.message : "Failed to play",
								timestamp: Date.now(),
							},
						});
					}
				},

				pause: async () => {
					const { player } = get();

					if (!player) {
						return;
					}

					try {
						player.pause();
						set({ playbackState: "paused" });
					} catch (error) {
						console.error("Pause error:", error);
						set({
							error: {
								message:
									error instanceof Error ? error.message : "Failed to pause",
								timestamp: Date.now(),
							},
						});
					}
				},

				togglePlayPause: async () => {
					const { playbackState } = get();

					if (playbackState === "playing") {
						get().pause();
					} else {
						get().play();
					}
				},

				stop: () => {
					const { player } = get();

					try {
						if (player) {
							player.pause();
							player.seekTo(0);
						}

						set({
							playbackState: "stopped",
							position: 0,
						});
					} catch (error) {
						console.error("Stop error:", error);
					}
				},

				seekTo: (position: number) => {
					const { player, duration } = get();

					if (!player) {
						return;
					}

					try {
						const clampedPosition = Math.max(
							0,
							Math.min(position / 1000, duration / 1000)
						); // Convert to seconds
						player.seekTo(clampedPosition);
						set({ position: clampedPosition * 1000 }); // Store in milliseconds
					} catch (error) {
						console.error("Seek error:", error);
					}
				},

				// Track Management Actions
				setTrack: async (track: TPlayerTrack, playImmediately = false) => {
					const { player: oldPlayer, volume, isMuted, currentTrack } = get();
					try {
						if (oldPlayer) {
							oldPlayer.pause();
							set({
								player: null,
								playbackState: "stopped",
								duration: 0,
								position: 0,
							});
							oldPlayer.remove();
						}

						set({
							playbackState: "loading",
							currentTrack: track,
							position: 0,
							error: null,
						});

						// Add previous track to history
						if (currentTrack) {
							set((state) => ({
								history: [currentTrack, ...state.history].slice(0, 50), // Keep last 50
							}));
						}

						// Use streamUrl or fallback to previewUrl
						const audioUrl =
							track.streamUrl ||
							track.previewUrl ||
							"https://res.cloudinary.com/drsrwztkq/video/upload/v1761581017/moodio_music/0NWqNXBJTpXbkI5rPWNy3p.mp3?_s=public-apps";

						if (!audioUrl) {
							throw new Error("No audio URL available for this track");
						}

						// Create new player using the createAudioPlayer function
						const { createAudioPlayer } = await import("expo-audio");
						const newPlayer = createAudioPlayer(audioUrl, {
							updateInterval: 500,
						});

						// Set volume
						newPlayer.volume = isMuted ? 0 : volume;

						// Subscribe to playback status updates
						newPlayer.addListener("playbackStatusUpdate", (status) => {
							set({
								position: status.currentTime * 1000, // Convert to milliseconds
								duration: status.duration * 1000, // Convert to milliseconds
								isBuffering: status.isBuffering,
								playbackState: status.playing ? "playing" : "paused",
							});

							// Auto-play next track when current finishes
							if (status.didJustFinish) {
								get().playNext();
							}
						});

						set({
							player: newPlayer,
							playbackState: playImmediately ? "playing" : "paused",
						});

						if (playImmediately) {
							newPlayer.play();
						}
					} catch (error) {
						console.error("Set track error:", error);
						set({
							playbackState: "error",
							error: {
								message:
									error instanceof Error
										? error.message
										: "Failed to load track",
								timestamp: Date.now(),
							},
						});
					}
				},

				playNext: async () => {
					const { queue, queueIndex, repeatMode, currentTrack } = get();

					if (repeatMode === "track" && currentTrack) {
						// Replay current track
						get().seekTo(0);
						get().play();
						return;
					}

					const nextIndex = queueIndex + 1;

					if (nextIndex < queue.length) {
						set({ queueIndex: nextIndex });
						await get().setTrack(queue[nextIndex], true);
					} else if (repeatMode === "context" && queue.length > 0) {
						// Loop back to start
						set({ queueIndex: 0 });
						await get().setTrack(queue[0], true);
					} else {
						// End of queue
						get().stop();
					}
				},

				playPrevious: async () => {
					const { queue, queueIndex, position } = get();

					// If more than 3 seconds into track, restart it
					if (position > 3000) {
						get().seekTo(0);
						return;
					}

					const prevIndex = queueIndex - 1;

					if (prevIndex >= 0) {
						set({ queueIndex: prevIndex });
						await get().setTrack(queue[prevIndex], true);
					}
				},

				skipTo: async (index: number) => {
					const { queue } = get();

					if (index >= 0 && index < queue.length) {
						set({ queueIndex: index });
						await get().setTrack(queue[index], true);
					}
				},

				// Queue Management Actions
				setQueue: async (tracks: TPlayerTrack[], startIndex = 0) => {
					const { isShuffled } = get();

					if (tracks.length === 0) {
						return;
					}

					const processedQueue = isShuffled ? shuffleArray(tracks) : tracks;
					const actualStartIndex = isShuffled ? 0 : startIndex;

					set({
						queue: processedQueue,
						originalQueue: tracks,
						queueIndex: actualStartIndex,
					});

					await get().setTrack(processedQueue[actualStartIndex], true);
				},

				addToQueue: (track: TPlayerTrack) => {
					set((state) => ({
						queue: [...state.queue, track],
						originalQueue: [...state.originalQueue, track],
					}));
				},

				addMultipleToQueue: (tracks: TPlayerTrack[]) => {
					set((state) => ({
						queue: [...state.queue, ...tracks],
						originalQueue: [...state.originalQueue, ...tracks],
					}));
				},

				removeFromQueue: (index: number) => {
					set((state) => {
						const newQueue = state.queue.filter((_, i) => i !== index);
						const newQueueIndex =
							index < state.queueIndex
								? state.queueIndex - 1
								: state.queueIndex;

						return {
							queue: newQueue,
							queueIndex: Math.max(0, newQueueIndex),
						};
					});
				},

				clearQueue: () => {
					set({
						queue: [],
						originalQueue: [],
						queueIndex: -1,
					});
				},

				reorderQueue: (fromIndex: number, toIndex: number) => {
					set((state) => {
						const newQueue = [...state.queue];
						const [removed] = newQueue.splice(fromIndex, 1);
						newQueue.splice(toIndex, 0, removed);

						// Adjust queueIndex if current track was moved
						let newQueueIndex = state.queueIndex;
						if (fromIndex === state.queueIndex) {
							newQueueIndex = toIndex;
						} else if (
							fromIndex < state.queueIndex &&
							toIndex >= state.queueIndex
						) {
							newQueueIndex--;
						} else if (
							fromIndex > state.queueIndex &&
							toIndex <= state.queueIndex
						) {
							newQueueIndex++;
						}

						return { queue: newQueue, queueIndex: newQueueIndex };
					});
				},

				setVolume: (volume: number) => {
					const { player, isMuted } = get();
					const clampedVolume = Math.max(0, Math.min(1, volume));

					set({ volume: clampedVolume });

					if (player && !isMuted) {
						player.volume = clampedVolume;
					}
				},

				toggleMute: () => {
					const { player, isMuted, volume } = get();

					if (isMuted) {
						// Unmute
						set({ isMuted: false });
						if (player) {
							player.volume = volume;
						}
					} else {
						// Mute
						set({ isMuted: true, previousVolume: volume });
						if (player) {
							player.volume = 0;
						}
					}
				},

				increaseVolume: async (amount = 0.1) => {
					const { volume } = get();
					get().setVolume(volume + amount);
				},

				decreaseVolume: async (amount = 0.1) => {
					const { volume } = get();
					get().setVolume(volume - amount);
				},

				// Playback Modes Actions
				toggleShuffle: () => {
					set((state) => {
						const newShuffleState = !state.isShuffled;

						if (newShuffleState) {
							// Enable shuffle
							const currentTrack = state.queue[state.queueIndex];
							const remainingTracks = state.queue.slice(state.queueIndex + 1);
							const shuffledRemaining = shuffleArray(remainingTracks);

							return {
								isShuffled: true,
								queue: currentTrack
									? [currentTrack, ...shuffledRemaining]
									: shuffleArray(state.queue),
								queueIndex: currentTrack ? 0 : state.queueIndex,
							};
						}
						// Disable shuffle - restore original order
						const currentTrack = state.queue[state.queueIndex];
						const originalIndex = state.originalQueue.findIndex(
							(t) => t.id === currentTrack?.id
						);

						return {
							isShuffled: false,
							queue: state.originalQueue,
							queueIndex: originalIndex >= 0 ? originalIndex : 0,
						};
					});
				},

				setRepeatMode: (mode: RepeatMode) => {
					set({ repeatMode: mode });
				},

				toggleRepeat: () => {
					set((state) => {
						const modes: RepeatMode[] = ["off", "context", "track"];
						const currentIndex = modes.indexOf(state.repeatMode);
						const nextMode = modes[(currentIndex + 1) % modes.length];
						return { repeatMode: nextMode };
					});
				},

				// Device Management Actions
				setActiveDevice: (device: AudioDevice) => {
					// This would integrate with native audio routing
					set({ activeDevice: device });
					console.log("Active device set to:", device.name);
				},

				refreshDevices: () => {
					// Mock device discovery - in real app, use native modules
					const mockDevices: AudioDevice[] = [
						{
							id: "1",
							name: "iPhone Speaker",
							type: "speaker",
							isActive: true,
						},
						{
							id: "2",
							name: "AirPods Pro",
							type: "bluetooth",
							isActive: false,
						},
					];

					set({ availableDevices: mockDevices });
				},

				// Lock Screen Controls
				// Lock Screen Controls
				updateLockScreen: (enabled: boolean) => {
					const { player, currentTrack } = get();

					if (!(player && currentTrack)) {
						return;
					}

					try {
						if (enabled) {
							// Make this player control the lock screen and set initial metadata
							player.setActiveForLockScreen(true, {
								title: currentTrack.name,
								artist: currentTrack.artists.map((a) => a.name).join(", "),
								albumTitle: currentTrack?.name,
								artworkUrl: currentTrack.albumArtwork?.[0]?.url,
							});
							// If you want to update metadata later (e.g. progress, new track):
							player.updateLockScreenMetadata({
								title: currentTrack.name,
								artist: currentTrack.artists.map((a) => a.name).join(", "),
								albumTitle: currentTrack.name,
								artworkUrl: currentTrack.albumArtwork?.[0]?.url,
							});
						} else {
							player.clearLockScreenControls();
						}
					} catch (error) {
						console.error("Lock screen update error:", error);
					}
				},

				// Internal/Utility Actions
				clearError: () => {
					set({ error: null });
				},

				reset: () => {
					const { player } = get();

					if (player) {
						try {
							player.remove();
						} catch (error) {
							console.error("Reset error:", error);
						}
					}

					set({
						player: null,
						currentTrack: null,
						playbackState: "stopped",
						position: 0,
						duration: 0,
						queue: [],
						queueIndex: -1,
						originalQueue: [],
						history: [],
						error: null,
					});
				},
			}),
			{
				name: "music-player-storage",
				storage: zustandStorage,
				partialize: (state) => ({
					volume: state.volume,
					isMuted: state.isMuted,
					isShuffled: state.isShuffled,
					repeatMode: state.repeatMode,
					queue: state.queue,
					queueIndex: state.queueIndex,
					currentTrack: state.currentTrack,
				}),
			}
		)
	)
);
