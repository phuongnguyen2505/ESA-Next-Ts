"use client";

import Navbar from "../common/Navbar";
import Footer from "../common/Footer";
import Banner from "../common/Banner";
import Head from "next/head";

interface MetaData {
	title?: string;
	description?: string;
	keywords?: string;
}

export default function ClientLayout({ 
	children,
	metadata
}: { 
	children: React.ReactNode;
	metadata?: MetaData;
}) {
	const title = metadata?.title;
	const description = metadata?.description;
	const keywords = metadata?.keywords;

	return (
		<>
			<Head>
				<title>{title || "VESA Energy Saving"}</title>
				<meta name="description" content={description || "Default description"} />
				<meta name="keywords" content={keywords || "default, keywords"} />
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
				<meta property="og:title" content={title || "VESA Energy Saving"} />
				<meta property="og:description" content={description || "Default description"} />
				<meta property="og:type" content="website" />
				<meta property="og:image" content="/images/shortcut.png" />
				<meta property="og:url" content="https://vesaflow.com" />
				<meta name="twitter:card" content="summary_large_image" />
				<meta name="twitter:title" content={title || "VESA Energy Saving"} />
				<meta name="twitter:description" content={description || "Default description"} />
				<meta name="twitter:image" content="/path-to-your-default-image.jpg" />
				<meta name="robots" content="index, follow" />
				<meta name="language" content="English" />
				<meta charSet="UTF-8" />
				<link rel="canonical" href="https://vesaflow.com" />
			</Head>

			<section className="flex flex-col min-h-screen">
				<Navbar />
				<Banner />
				<div className="min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-mont-r)]">
					<main className="w-full flex flex-col gap-8 row-start-2 sm:items-start">
						{children}
					</main>
				</div>
				<Footer />
			</section>
		</>
	);
}
