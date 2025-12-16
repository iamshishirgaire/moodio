import { useNetworkState } from "expo-network";
import { Redirect } from "expo-router";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { authClient } from "@/lib/auth-client";
export default function Page() {
	const { data: session, isPending } = authClient.useSession();
	const { isInternetReachable } = useNetworkState();

	if (isPending) {
		return <LoadingSpinner />;
	}
	if (session && isInternetReachable) {
		return <Redirect href="/(tabs)/home" />;
	}
	if (isInternetReachable !== undefined && isInternetReachable === true) {
		return <Redirect href="/auth" />;
	}
}
