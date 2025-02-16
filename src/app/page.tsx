"use client";

import { useAuth } from "@/utils/supabase/auth";
import supabase from "@/utils/supabase/supabase";
import Logo from "../../public/logo.png";

import { useEffect } from "react";
import Image from "next/image";
import { RiGoogleFill } from "@remixicon/react";

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
		<>
			{/* <video
				autoPlay
				muted
				loop
				className="overflow-none object-fit absolute -z-10 h-dvh w-screen overflow-hidden object-fill blur-xl"
			>
				<source src="/background-clouds-1.mp4" type="video/mp4" />
			</video> */}
			<div className="overflow-none flex h-full w-4/5 items-center justify-center place-self-center bg-white">
				<div className="flex h-fit w-fit flex-col items-center justify-between gap-y-5">
					<div className="flex items-center justify-center gap-x-3">
						<Image src={Logo} alt="Logo" width={70} className="" />

						<span className="font-manrope text-5xl font-bold text-black">Odin</span>
					</div>

					<button
						onClick={async () => {
							const result = await supabase.auth.signInWithOAuth({
								provider: "google",
								options: { redirectTo: "http://localhost:3000/create" },
							});
						}}
						className="flex h-fit w-full items-center justify-center gap-x-5 rounded-full bg-white/80 px-4 py-2 font-manrope font-semibold text-black/70"
					>
						<RiGoogleFill className="text-black/70" />
						<span>Login with Google</span>
					</button>
				</div>
			</div>
		</>
	);
}
