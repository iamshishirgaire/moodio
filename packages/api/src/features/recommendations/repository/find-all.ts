import { db } from "@moodio/db";
import { tracks } from "@moodio/db/schema/tracks";
import { userRecommendations } from "@moodio/db/schema/recommendations";

import { eq, desc } from "drizzle-orm";
import { albums } from "@moodio/db/schema/album";

// Version with pagination
export const findAllPaginated = async (
  userId: string,
  options?: {
    limit?: number;
    offset?: number;
  },
) => {
  const { limit = 20, offset = 0 } = options || {};

  const recommendations = await db
    .select({
      id: tracks.id,
      name: tracks.name,
      trackNumber: tracks.trackNumber,
      durationMs: tracks.durationMs,
      explicit: tracks.explicit,
      popularity: tracks.popularity,
      previewUrl: tracks.previewUrl,
      externalUrls: tracks.externalUrls,
      artists: tracks.artists,
      streamUrl: tracks.streamUrl,

      // Album data for displaying cover art
      album: {
        images: albums.images,
      },

      // Recommendation info
      recommendationScore: userRecommendations.score,
      recommendationReason: userRecommendations.reason,
    })
    .from(userRecommendations)
    .innerJoin(tracks, eq(userRecommendations.trackId, tracks.id))
    .innerJoin(albums, eq(tracks.albumId, albums.id))
    .where(eq(userRecommendations.userId, userId))
    .orderBy(desc(userRecommendations.score))
    .limit(limit)
    .offset(offset);

  return recommendations;
};
