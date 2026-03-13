export type SpotifyImage = {
	height: number | null;
	width: number | null;
	url: string;
};

export type ExternalUrls = {
	spotify: string;
};

export type Copyright = {
	text: string;
	type: string;
};

export type SimplifiedArtist = {
	id: string;
	name: string;
};
