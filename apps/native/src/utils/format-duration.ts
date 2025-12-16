export default function formatDurationIntl(ms: number) {
	const date = new Date(ms);
	const formatter = new Intl.DateTimeFormat("en-US", {
		minute: "numeric",
		second: "2-digit",
		timeZone: "UTC", // Important: use UTC to avoid timezone issues
	});

	return formatter.format(date);
}
