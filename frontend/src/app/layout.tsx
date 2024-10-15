import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
	title: "Multiplatform Bot Detector",
	description:
		"A Thesis Project, where we aim to detect bots in multiple platforms.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<head>
				<title>Multiplatform Bot Detector</title>
			</head>
			<body>{children}</body>
		</html>
	);
}
