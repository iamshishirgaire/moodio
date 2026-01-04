import {
	doublePrecision,
	foreignKey,
	pgTable,
	text,
} from "drizzle-orm/pg-core";
import { tracks } from "./tracks";

export const trackFeatures = pgTable(
	"track_features",
	{
		id: text("song_id").primaryKey(),
		// MFCC: Mel-frequency cepstral coefficients (typically 13-20 values)
		mfcc: doublePrecision().array().notNull(),
		tempo: doublePrecision().notNull(),
		// Chroma: Represents the 12 different pitch classes
		chroma: doublePrecision().array().notNull(),
		spectralCentroid: doublePrecision("spectral_centroid").notNull(),
		spectralBandwidth: doublePrecision("spectral_bandwidth").notNull(),
		// Spectral Contrast: Difference between peaks and valleys in the spectrum
		spectralContrast: doublePrecision("spectral_contrast").array().notNull(),
		rmsEnergy: doublePrecision("rms_energy").notNull(),
		// ZCR: Zero Crossing Rate
		zcr: doublePrecision().notNull(),
	},
	(table) => [
		foreignKey({
			columns: [table.id],
			foreignColumns: [tracks.id],
			name: "song_features_song_id_fkey",
		}).onDelete("cascade"),
	]
);
