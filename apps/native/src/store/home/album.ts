import type { TAlbum } from "@moodio/api/features/album/schema";
import { create } from "zustand";
import { type PersistOptions, persist } from "zustand/middleware";
import zustandStorage from "../storage";

export type TAlbumWithUserName = TAlbum & {
	artistName: string | null;
	artistImage: TAlbumWithUserName["images"] | null;
};
type AlbumState = {
	current: TAlbumWithUserName | null;
	setCurrent: (album: TAlbumWithUserName) => void;
	clear: () => void;
};

type PersistedAlbumState = PersistOptions<AlbumState>;

export const useAlbumStore = create<AlbumState>()(
	persist(
		(set) => ({
			current: null,
			setCurrent: (album) => set({ current: album }),
			clear: () => set({ current: null }),
		}),
		{
			name: "album-store",
			storage: zustandStorage,
		} as PersistedAlbumState
	)
);
