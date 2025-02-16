"use client";

import { useAuth } from "@/utils/supabase/auth";
import supabase from "@/utils/supabase/supabase";

import { useEffect } from "react";

export default function App() {
	const { fetchUser, setUser } = useAuth();

	useEffect(() => {
		fetchUser();

		const result = supabase.auth.onAuthStateChange((event, session) => {
			console.log({ user: session?.user });
			setUser(session?.user ?? null);
		});

		return () => result.data.subscription.unsubscribe();
	}, []);

	return (
		<div>
			<button
				onClick={async () => {
					const result = await supabase.auth.signInWithOAuth({
						provider: "google",
						options: { redirectTo: "http://localhost:3000/create" },
					});
				}}
			>
				Sign in
			</button>
		</div>
	);
}
