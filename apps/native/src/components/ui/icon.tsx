import { Ionicons } from "@expo/vector-icons";
import type React from "react";
import type { ComponentProps } from "react";

type IoniconsName = ComponentProps<typeof Ionicons>["name"];

export type IconProps = {
	icon: IoniconsName;
	size?: number;
	color?: string;
	strokeWidth?: number;
};

export const Icon: React.FC<IconProps> = ({
	icon,
	size = 24,
	color = "white",
}) => <Ionicons color={color} name={icon} size={size} type="hierarchical" />;

export const Icons = {
	// User & Authentication
	user: "person",
	mail: "envelope",
	lock: "lock",
	eye: "eye",
	eyeOff: "eye.slash",

	// Navigation
	chevronLeft: "chevron.left",
	home: "house",
	search: "magnifyingglass",
	library: "book",

	// Actions
	heart: "heart",
	play: "play.circle",
	more: "ellipsis",
	close: "xmark",

	// Settings & Notifications
	bell: "bell",
	clock: "clock",
	gear: "gear.circle",

	// Social & Brands
	apple: "applelogo",
	message: "message.circle",

	// Content
	music: "music.note",
	podcast: "podcast",
	live: "radio",
	discover: "sparkles",
	trending: "flame",
	new: "plus.circle",
} as const;

export const UserIcon = { icon: Icons.user };
export const MailIcon = { icon: Icons.mail };
export const LockIcon = { icon: Icons.lock };
export const ViewIcon = { icon: Icons.eye };
export const ViewOffSlashIcon = { icon: Icons.eyeOff };
export const AppleIcon = { icon: Icons.apple };
export const FacebookIcon = { icon: Icons.message };
export const ChevronLeftIcon = { icon: Icons.chevronLeft };
export const HomeIcon = { icon: Icons.home };
export const SearchIcon = { icon: Icons.search };
export const LibraryIcon = { icon: Icons.library };
export const HeartIcon = { icon: Icons.heart };
export const PlayIcon = { icon: Icons.play };
export const MoreIcon = { icon: Icons.more };
export const NotificationIcon = { icon: Icons.bell };
export const RecentlyPlayedIcon = { icon: Icons.clock };
export const SettingsIcon = { icon: Icons.gear };
