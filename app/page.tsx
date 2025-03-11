"use client";
import dynamic from 'next/dynamic'

const Navbar = dynamic(() => import('./components/common/Navbar'), { ssr: false })
const Footer = dynamic(() => import('./components/common/Footer'), { ssr: false })


export default function Home() {
	return (
		<>
			<Navbar />
			<div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-mont-r)]">
				<main className="flex flex-col gap-8 row-start-2 items-center sm:items-start"></main>
			</div>
			<Footer />
		</>
	);
}
