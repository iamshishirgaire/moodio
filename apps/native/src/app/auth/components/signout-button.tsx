import { createURL, openURL } from "expo-linking";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

const SignOutButton = () => {
	const handleSignOut = async () => {
		try {
			await authClient.signOut();
			openURL(createURL("/"));
		} catch (err) {
			console.error(JSON.stringify(err, null, 2));
		}
	};
	return <Button onPress={handleSignOut} title="Sign out" />;
};
export default SignOutButton;
