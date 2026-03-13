import {
  RecordingPresets,
  requestRecordingPermissionsAsync,
  setAudioModeAsync,
  useAudioRecorder,
  useAudioRecorderState,
} from "expo-audio";
import { IconChevronLeft } from "@tabler/icons-react-native";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Alert, Platform, View } from "react-native";
import {
  Easing,
  useSharedValue,
  withRepeat,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { IconButton } from "@/components/ui/icon-button";
import { theme } from "@/constants/theme";
import RecordingVisualizer from "../recognize/components/recording-visualizer";

type MoodPrediction = {
  emotion: string;
  confidence: number;
  probabilities: Record<string, number>;
};

const MAX_RECORDING_TIME_MS = 10_000;

function getPredictEndpoint() {
  const configured = process.env.EXPO_PUBLIC_MOOD_API_URL || "http://127.0.0.1:3003";
  const trimmed = configured.replace(/\/$/, "");
  return trimmed.endsWith("/predict") ? trimmed : `${trimmed}/predict`;
}

export default function MoodDetectRecordScreen() {
  const router = useRouter();
  const [isListening, setIsListening] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const recorder = useAudioRecorder({
    ...RecordingPresets.HIGH_QUALITY,
    isMeteringEnabled: Platform.OS !== "web",
    web: {
      mimeType: "audio/webm",
      bitsPerSecond: 128_000,
    },
  });
  const recorderState = useAudioRecorderState(recorder, 30);
  const stopTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const audioLevel = useSharedValue(0);
  const isRecordingShared = useSharedValue(0);
  const pulseAnim = useSharedValue(0);

  const level = useMemo(() => {
    const metering = (recorderState as { metering?: number }).metering;
    if (typeof metering !== "number") {
      return 0;
    }

    const minDb = -60;
    const maxDb = 0;
    const clamped = Math.max(minDb, Math.min(maxDb, metering));
    return (clamped - minDb) / (maxDb - minDb);
  }, [recorderState]);

  useEffect(() => {
    const setup = async () => {
      const { granted } = await requestRecordingPermissionsAsync();
      if (!granted) {
        Alert.alert("Permission required", "Microphone permission is required to detect mood.");
        return;
      }

      await setAudioModeAsync({
        allowsRecording: true,
        playsInSilentMode: true,
      });
    };

    setup().catch((error) => {
      console.error("Failed to setup recording", error);
      Alert.alert("Error", "Unable to setup recording on this device.");
    });

    return () => {
      if (stopTimerRef.current) {
        clearTimeout(stopTimerRef.current);
        stopTimerRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    audioLevel.value = withSpring(level, {
      damping: 8,
      stiffness: 100,
      mass: 0.5,
    });
  }, [audioLevel, level]);

  useEffect(() => {
    if (isListening || isUploading) {
      isRecordingShared.value = withSpring(1, { damping: 12 });
      pulseAnim.value = withRepeat(
        withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
        -1,
        true,
      );
      return;
    }

    isRecordingShared.value = withSpring(0);
    pulseAnim.value = 0;
    audioLevel.value = withSpring(0);
  }, [audioLevel, isListening, isRecordingShared, isUploading, pulseAnim]);

  const predictMood = useCallback(async (uri: string): Promise<MoodPrediction> => {
    const formData = new FormData();

    if (Platform.OS === "web") {
      const response = await fetch(uri);
      const blob = await response.blob();
      formData.append("file", blob, "mood-recording.webm");
    } else {
      formData.append("file", {
        uri,
        name: "mood-recording.m4a",
        type: "audio/m4a",
      } as unknown as Blob);
    }

    const response = await fetch(getPredictEndpoint(), {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const message = await response.text();
      throw new Error(message || "Mood prediction failed.");
    }

    return (await response.json()) as MoodPrediction;
  }, []);

  const stopAndAnalyze = useCallback(async () => {
    if (stopTimerRef.current) {
      clearTimeout(stopTimerRef.current);
      stopTimerRef.current = null;
    }

    try {
      if (recorderState.isRecording) {
        await recorder.stop();
      }
    } catch (error) {
      console.warn("Failed to stop recorder", error);
    }

    setIsListening(false);

    const uri = recorder.uri;
    if (!uri) {
      Alert.alert("Recording error", "No audio file was captured. Please try again.");
      return;
    }

    try {
      setIsUploading(true);
      const mood = await predictMood(uri);

      router.push({
        pathname: "/mood-detect/result",
        params: {
          emotion: mood.emotion,
          confidence: String(mood.confidence),
          probabilities: JSON.stringify(mood.probabilities),
        },
      } as never);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to analyze your mood.";
      Alert.alert("Mood detection failed", message);
    } finally {
      setIsUploading(false);
    }
  }, [predictMood, recorder, recorderState.isRecording, router]);

  const start = useCallback(async () => {
    if (isUploading || recorderState.isRecording) {
      return;
    }

    try {
      await recorder.prepareToRecordAsync();
      recorder.record();
      setIsListening(true);

      stopTimerRef.current = setTimeout(() => {
        stopAndAnalyze().catch((error) => {
          console.error("Auto-stop failed", error);
        });
      }, MAX_RECORDING_TIME_MS);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to start recording.";
      Alert.alert("Recording error", message);
    }
  }, [isUploading, recorder, recorderState.isRecording, stopAndAnalyze]);

  return (
    <View style={{ flex: 1 }}>
      <RecordingVisualizer
        audioLevel={audioLevel}
        isListening={isListening || isUploading}
        isRecordingBool={isListening || isUploading}
        isRecordingShared={isRecordingShared}
        onPress={isListening ? stopAndAnalyze : start}
        pulseAnim={pulseAnim}
        wsConnected={true}
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
