import { createMMKV } from "react-native-mmkv";

import { createJSONStorage as createZustandStorage } from "zustand/middleware";

export const storage = createMMKV({
	id: "your-storage-id",
	encryptionKey: "your-encryption-key",
});

export const zustandStorage = createZustandStorage(() => ({
	setItem: (name, value) => {
		storage.set(name, value);
	},
	getItem: (name) => {
		const value = storage.getString(name);
		return value ?? null;
	},
	removeItem: (name) => {
		storage.remove(name);
	},
}));

export default zustandStorage;
