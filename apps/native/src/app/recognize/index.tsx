import { IconChevronLeft } from "@tabler/icons-react-native";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { View, Alert } from "react-native";
import {
  Easing,
  useSharedValue,
  withRepeat,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import ShazamKit, { MediaInfo } from "@edualm/react-native-shazam-kit";
import { IconButton } from "@/components/ui/icon-button";
import { theme } from "@/constants/theme";
import RecordingVisualizer from "./components/recording-visualizer";

export default function RecordScreen() {
  const router = useRouter();
  const [isListening, setIsListening] = useState(false);
  const [songResult, setSongResult] = useState<MediaInfo | null>(null);

  // Shared values for animations
  const audioLevel = useSharedValue(0);
  const isRecordingShared = useSharedValue(0);
  const pulseAnim = useSharedValue(0);

  // Simulate audio level animation while listening
  useEffect(() => {
    if (isListening) {
      // Create a pulsing effect for audio level
      const interval = setInterval(() => {
        audioLevel.value = withSpring(Math.random() * 0.8 + 0.2, {
          damping: 8,
          stiffness: 100,
          mass: 0.5,
        });
      }, 200);

      return () => clearInterval(interval);
    } else {
      audioLevel.value = withSpring(0);
    }
  }, [isListening, audioLevel]);

  // Continuous pulse animation when recording
  useEffect(() => {
    if (isListening) {
      isRecordingShared.value = withSpring(1, { damping: 12 });
      pulseAnim.value = withRepeat(
        withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
        -1,
        true,
      );
    } else {
      isRecordingShared.value = withSpring(0);
      pulseAnim.value = 0;
      audioLevel.value = withSpring(0);
    }
  }, [isListening, isRecordingShared, pulseAnim, audioLevel]);

  // Navigate to result screen when song is found
  useEffect(() => {
    if (songResult) {
      const params: Record<string, string> = {
        title: songResult.title || "Unknown Title",
        artist: songResult.artist || "Unknown Artist",
      };

      // Only add optional params if they exist
      if (songResult.subtitle) params.subtitle = songResult.subtitle;
      if (songResult.artworkURL) params.artwork = songResult.artworkURL;
      if (songResult.webURL) params.webURL = songResult.webURL;
      if (songResult.appleMusicURL) params.videoURL = songResult.appleMusicURL;

      // Defer navigation to avoid race conditions
      setTimeout(() => {
        try {
          router.push({ pathname: "/recognize/result", params });
        } finally {
          // Clear result after navigation
          setSongResult(null);
        }
      }, 0);
    }
  }, [songResult, router]);

  const start = async () => {
    try {
      setIsListening(true);

      // Check if ShazamKit is supported
      const supported = await ShazamKit.isSupported();
      if (!supported) {
        Alert.alert(
          "Not Supported",
          "ShazamKit is not available on this device",
        );
        setIsListening(false);
        return;
      }

      // Start listening
      const result = await ShazamKit.listen();

      if (result) {
        setSongResult(result);
      } else {
        Alert.alert("No Match", "No songs found. Please try again.");
      }

      setIsListening(false);
    } catch (error: any) {
      console.error("ShazamKit error:", error);
      if (error instanceof Error) {
        Alert.alert("Error", error.message);
      } else {
        Alert.alert("Error", "An error occurred while listening");
      }
      setIsListening(false);
    }
  };

  const stop = () => {
    // ShazamKit doesn't have an explicit stop method for the listen() function
    // The listening will stop automatically when a match is found or times out
    // We can just update the UI state
    setIsListening(false);
  };

  return (
    <View style={{ flex: 1 }}>
      <RecordingVisualizer
        audioLevel={audioLevel}
        isListening={isListening}
        isRecordingBool={isListening}
        isRecordingShared={isRecordingShared}
        onPress={isListening ? stop : start}
        pulseAnim={pulseAnim}
        wsConnected={true} // ShazamKit doesn't use WebSocket
      />
      <IconButton
        btnstyle={{
          position: "absolute",
          top: 74,
          left: 22,
          backgroundColor: theme.colors.background,
        }}
        onPress={() => router.back()}
      >
        <IconChevronLeft size={22} />
      </IconButton>
    </View>
  );
}
