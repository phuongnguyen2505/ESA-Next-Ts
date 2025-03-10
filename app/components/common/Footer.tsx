import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

export default function Footer() {
	const section2Ref = useRef<HTMLDivElement>(null);

	const socialLinks = [
		{ icon: "/images/fb.svg", href: "/", alt: "Facebook" },
		{ icon: "/images/zalo.svg", href: "/", alt: "Zalo" },
		{ icon: "/images/ytb.svg", href: "/", alt: "Youtube" },
	];

	useEffect(() => {
		if (typeof window !== "undefined" && section2Ref.current) {
			gsap.registerPlugin(ScrollTrigger);
			gsap.from(section2Ref.current.children, {
				opacity: 0,
				y: 50,
				duration: 0.8,
				stagger: 0.3,
				ease: "power3.out",
				scrollTrigger: {
					trigger: section2Ref.current,
					start: "top 80%",
				},
			});
		}
	}, []);

	return (
		<footer className="ft-bg flex flex-col rounded-t-xl h-[400px] justify-between bg-gray-800 bg-contain bg-no-repeat bg-center">
			{/* Logo Section */}
			<section className="flex flex-col items-center justify-center mx-24 pt-4">
				<div className="relative w-full h-[180px] mb-2">
					<Image
						src="/images/shortcut.png"
						alt="Logo"
						fill
						className="object-contain"
						priority
					/>
				</div>
				<h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
					ENERGY SAVING SOLUTIONS
				</h2>
			</section>

			{/* Main Content Section */}
			<section
				ref={section2Ref}
				className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mx-24 py-8"
			></section>

			{/* Social Links & Copyright */}
			<section className="flex flex-col items-center space-y-4 pb-4">
				<div className="flex gap-6">
					{socialLinks.map((social) => (
						<Link
							key={social.alt}
							href={social.href}
							className="p-2 bg-white/5 rounded-lg transition-all duration-300 hover:scale-110 hover:bg-white/10"
						>
							<Image
								src={social.icon}
								alt={social.alt}
								width={24}
								height={24}
								className="w-6 h-6"
								priority
							/>
						</Link>
					))}
				</div>
				<p className="text-gray-400 text-sm">
					© {new Date().getFullYear()} VESA - All rights reserved
				</p>
			</section>
		</footer>
	);
}
