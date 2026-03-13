import type { SearchResult } from "@moodio/api/features/search/schema";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { IconButton } from "@/components/ui/icon-button";
import { theme } from "@/constants/theme";
import { orpc } from "@/utils/orpc";
import SearchResults from "../(tabs)/search/components/results";

type MoodProbabilities = Record<string, number>;

function getValue(param: string | string[] | undefined) {
  if (!param) {
    return "";
  }
  return Array.isArray(param) ? param[0] ?? "" : param;
}

function getRecommendationQuery(emotion: string) {
  const key = emotion.toLowerCase();
  const moodMap: Record<string, string> = {
    angry: "intense energetic",
    calm: "chill calm",
    fear: "comfort calm",
    fearful: "comfort calm",
    happy: "happy upbeat",
    neutral: "feel good",
    sad: "sad emotional",
    surprise: "surprise feel good",
    surprised: "surprise feel good",
  };

  return moodMap[key] || emotion;
}

export default function MoodDetectResultScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    emotion?: string;
    confidence?: string;
    probabilities?: string;
  }>();

  const emotion = getValue(params.emotion);
  const confidence = Number(getValue(params.confidence));
  const recommendationQuery = getRecommendationQuery(emotion || "");

  const { data, isLoading, error } = useQuery({
    ...orpc.search.searchTrack.queryOptions({
      input: { query: recommendationQuery },
    }),
    enabled: !!recommendationQuery,
  });

  let probabilities: MoodProbabilities = {};
  try {
    probabilities = JSON.parse(getValue(params.probabilities) || "{}") as MoodProbabilities;
  } catch {
    probabilities = {};
  }

  const sortedProbabilities = Object.entries(probabilities)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  const result: SearchResult = {
    albums: [],
    artists: [],
    playlists: [],
    tracks: data?.tracks || [],
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <IconButton
          btnstyle={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backText}>Back</Text>
        </IconButton>
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>Detected Mood</Text>
        <Text style={styles.mood}>{emotion || "Unknown"}</Text>
        <Text style={styles.confidence}>
          Confidence: {Number.isFinite(confidence) ? `${Math.round(confidence * 100)}%` : "-"}
        </Text>
        {sortedProbabilities.length > 0 && (
          <Text style={styles.topScores}>
            Top signals: {sortedProbabilities.map(([name, value]) => `${name} (${Math.round(value * 100)}%)`).join(", ")}
          </Text>
        )}
      </View>

      <Text style={styles.sectionTitle}>Recommended Songs</Text>

      {isLoading ? (
        <View style={styles.centered}>
          <ActivityIndicator color={theme.colors.primary} size="small" />
        </View>
      ) : error ? (
        <View style={styles.centered}>
          <Text style={styles.errorText}>Failed to load recommendations. Try again.</Text>
        </View>
      ) : result.tracks.length === 0 ? (
        <View style={styles.centered}>
          <Text style={styles.emptyText}>No recommendations found for this mood yet.</Text>
        </View>
      ) : (
        <View style={styles.resultsWrap}>
          <SearchResults results={result} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    paddingHorizontal: theme.spacing.md,
    paddingTop: 68,
    marginBottom: 8,
  },
  backButton: {
    alignSelf: "flex-start",
    backgroundColor: theme.colors.backgroundSecondary,
  },
  backText: {
    color: theme.colors.textSecondary,
    fontWeight: "600",
  },
  card: {
    marginHorizontal: theme.spacing.md,
    marginBottom: 16,
    borderRadius: 16,
    padding: 16,
    backgroundColor: theme.colors.backgroundSecondary,
  },
  title: {
    color: theme.colors.textSecondary,
    fontSize: 14,
    fontWeight: "500",
    opacity: 0.8,
  },
  mood: {
    marginTop: 4,
    color: theme.colors.textSecondary,
    fontSize: 30,
    fontWeight: "700",
    textTransform: "capitalize",
  },
  confidence: {
    marginTop: 8,
    color: theme.colors.textSecondary,
    fontSize: 14,
  },
  topScores: {
    marginTop: 6,
    color: theme.colors.textSecondary,
    fontSize: 12,
    opacity: 0.8,
  },
  sectionTitle: {
    marginHorizontal: theme.spacing.md,
    marginBottom: 8,
    color: theme.colors.textSecondary,
    fontSize: 20,
    fontWeight: "700",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: theme.spacing.lg,
  },
  errorText: {
    color: theme.colors.error,
    textAlign: "center",
  },
  emptyText: {
    color: theme.colors.textSecondary,
    textAlign: "center",
  },
  resultsWrap: {
    flex: 1,
  },
});
