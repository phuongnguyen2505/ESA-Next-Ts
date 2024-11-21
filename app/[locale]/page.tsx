"use client";

import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";


export default function Home({ children }: { children: React.ReactNode }) {

	return (
		<section>
			<Navbar />
			<div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-mont-r)]">
				<main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
					{children}
				</main>
			</div>
			<Footer />
		</section>
	);
}
