"use client";

import Navbar from "../common/Navbar";
import Footer from "../common/Footer";
import Head from 'next/head';
import { useParams } from "next/navigation";

interface MetaData {
	title_vi?: string;
	title_en?: string;
	description_vi?: string;
	description_en?: string;
	keywords_vi?: string;
	keywords_en?: string;
}

export default function ClientLayout({ 
	children,
	metadata
}: { 
	children: React.ReactNode;
	metadata?: MetaData;
}) {
	const params = useParams();
	const locale = params?.locale as string;

	// Lấy metadata theo ngôn ngữ
	const title = locale === 'en' ? metadata?.title_en : metadata?.title_vi;
	const description = locale === 'en' ? metadata?.description_en : metadata?.description_vi;
	const keywords = locale === 'en' ? metadata?.keywords_en : metadata?.keywords_vi;

	return (
		<>
			<Head>
				{/* Thẻ title */}
				<title>{title || 'Your Website Name'}</title>

				{/* Thẻ meta cơ bản */}
				<meta name="description" content={description || 'Default description'} />
				<meta name="keywords" content={keywords || 'default, keywords'} />
				
				{/* Thẻ meta cho viewport */}
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
				
				{/* Thẻ meta cho Open Graph (Facebook) */}
				<meta property="og:title" content={title || 'Your Website Name'} />
				<meta property="og:description" content={description || 'Default description'} />
				<meta property="og:type" content="website" />
				<meta property="og:image" content="/path-to-your-default-image.jpg" />
				<meta property="og:url" content="https://your-domain.com" />
				
				{/* Thẻ meta cho Twitter */}
				<meta name="twitter:card" content="summary_large_image" />
				<meta name="twitter:title" content={title || 'Your Website Name'} />
				<meta name="twitter:description" content={description || 'Default description'} />
				<meta name="twitter:image" content="/path-to-your-default-image.jpg" />
				
				{/* Thẻ meta khác */}
				<meta name="robots" content="index, follow" />
				<meta name="language" content={locale === 'en' ? 'English' : 'Vietnamese'} />
				<meta charSet="UTF-8" />
				
				{/* Canonical URL */}
				<link rel="canonical" href="https://your-domain.com" />
			</Head>

			<section>
				<Navbar />
				<div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-mont-r)]">
					<main className="w-full flex flex-col gap-8 row-start-2 items-center sm:items-start">
						{children}
					</main>
				</div>
				<Footer />
			</section>
		</>
	);
}
