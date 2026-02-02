import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { theme } from "@/constants/theme";
import { orpc } from "@/utils/orpc";
import { SearchResults } from "./components/results";

export default function SearchScreen() {
  const { query } = useLocalSearchParams<{ query?: string }>();
  const [localQuery, setLocalQuery] = useState(query || "");

  // Update local query when search params change
  React.useEffect(() => {
    if (query !== localQuery) {
      setLocalQuery(query || "");
    }
  }, [query, localQuery]);

  const { data, isLoading, error } = useQuery(
    orpc.search.queryOptions({
      input: { query: localQuery },
    }),
  );

  return (
    <View style={styles.container}>
      {isLoading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator color={theme.colors.primary} size="small" />
        </View>
      ) : error ? (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>
            Something went wrong. Please try again.
          </Text>
        </View>
      ) : !localQuery ||
        (data && Object.values(data).every((arr) => arr.length === 0)) ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>Discover Music</Text>
          <Text style={styles.emptySubtitle}>
            Search for artists, albums, songs, and playlists
          </Text>
          <View style={styles.graphicsContainer}>
            <Text style={styles.graphicsText}>🎵</Text>
          </View>
        </View>
      ) : (
        data && <SearchResults results={data} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: theme.colors.textSecondary,
  },
  errorText: {
    fontSize: 16,
    color: theme.colors.error,
    textAlign: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: theme.spacing.lg,
  },
  emptyTitle: {
    fontSize: 28,
    fontWeight: "600",
    color: theme.colors.textPrimary,
    marginBottom: 8,
    textAlign: "center",
  },
  emptySubtitle: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    textAlign: "center",
    marginBottom: 32,
    lineHeight: 24,
  },
  graphicsContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  graphicsText: {
    fontSize: 80,
    opacity: 0.3,
  },
});
