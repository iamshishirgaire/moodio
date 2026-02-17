import { IconButton } from "@/components/ui/icon-button";
import { theme } from "@/constants/theme";
import { client } from "@/utils/orpc";
import ShazamKit, { MediaInfo } from "@edualm/react-native-shazam-kit";
import { IconChevronLeft } from "@tabler/icons-react-native";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, View } from "react-native";
import {
    Easing,
    useSharedValue,
    withRepeat,
    withSpring,
    withTiming,
} from "react-native-reanimated";
import RecordingVisualizer from "./components/recording-visualizer";

export default function RecordScreen() {
  const router = useRouter();
  const [isListening, setIsListening] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
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

  // Continuous pulse animation when recording or searching
  useEffect(() => {
    if (isListening || isSearching) {
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
  }, [isListening, isSearching, isRecordingShared, pulseAnim, audioLevel]);

  // Search database when song is found
  useEffect(() => {
    if (songResult) {
      searchDatabase(songResult);
    }
  }, [songResult]);

  const searchDatabase = async (result: MediaInfo) => {
    try {
      setIsSearching(true);

      const searchQuery = result.title || "";

      if (!searchQuery) {
        Alert.alert("Error", "No track title to search for");
        setIsSearching(false);
        setSongResult(null);
        return;
      }

      const searchResults = await client.search.searchTrack({
        query : searchQuery
      })
      const foundTracks = searchResults?.tracks || [];

      if (foundTracks!==undefined && foundTracks.length === 0) {
        Alert.alert(
          "Not Available",
          "Failed to recognize the song in our library.",
          [
            {
              text: "OK",
              onPress: () => {
                setSongResult(null);
                setIsSearching(false);
              },
            },
          ]
        );
        return;
      }

      // Try to find exact match by comparing artist names
      let matchedTrack = foundTracks[0]; // Default to first result

      if (result.artist) {
        const exactMatch = foundTracks.find((track: any) => {
          const trackArtists = track.artists?.map((a: any) =>
            a.name.toLowerCase()
          ).join(" ") || "";
          return trackArtists.includes(result.artist!.toLowerCase());
        });

        if (exactMatch) {
          matchedTrack = exactMatch;
        }
      }

      // Navigate to result page with complete track data
      const params: Record<string, string> = {
        trackData: JSON.stringify(matchedTrack), // Pass entire track object for playback
        shazamTitle: result.title || "",
        shazamArtist: result.artist || "",
      };
      setTimeout(() => {
        try {
          router.push({ pathname: "/recognize/result", params });
        } finally {
          setSongResult(null);
          setIsSearching(false);
        }
      }, 100);

    } catch (error) {
      console.error("Database search error:", error);
      Alert.alert(
        "Search Error",
        "Failed to search the database. Please try again.",
        [
          {
            text: "OK",
            onPress: () => {
              setSongResult(null);
              setIsSearching(false);
            },
          },
        ]
      );
    }
  };

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

      setIsListening(false);

      if (result) {
        setSongResult(result);
      } else {
        Alert.alert("No Match", "No songs found. Please try again.");
      }

    } catch (error: any) {
      console.error("Error:", error);
      setIsListening(false);

      if (error instanceof Error) {
        Alert.alert("Error", error.message);
      } else {
        Alert.alert("Error", "An error occurred while listening");
      }
    }
  };

  const stop = () => {
    // ShazamKit doesn't have an explicit stop method for the listen() function
    // The listening will stop automatically when a match is found or times out
    setIsListening(false);
    setIsSearching(false);
    setSongResult(null);
  };

  return (
    <View style={{ flex: 1 }}>
      <RecordingVisualizer
        audioLevel={audioLevel}
        isListening={isListening || isSearching}
        isRecordingBool={isListening || isSearching}
        isRecordingShared={isRecordingShared}
        onPress={isListening || isSearching ? stop : start}
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
