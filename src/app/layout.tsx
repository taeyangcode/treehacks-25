import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const manrope = Manrope({
	variable: "--font-manrope",
	subsets: ["latin"],
});

const departure = localFont({
	src: "../../public/fonts/DepartureMono.otf",
	variable: "--font-departure",
});

export const metadata: Metadata = {
	title: "Odin",
	description: "",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={`${departure.variable} ${manrope.variable} h-dvh w-full antialiased`}>{children}</body>
		</html>
	);
}
