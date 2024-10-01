import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "AIMAX",
	description: "Search for study subjects",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='en'>
			<body className={inter.className}>
				<main className='flex flex-col h-screen w-screen'>
					<Header />
					{children}
				</main>
			</body>
		</html>
	);
}
