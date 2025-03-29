"use client";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import BlurText from "../Ui/BlurText";

interface BannerProps {}

const bannerItems = [
	{
		path: "about",
		title: "About Us",
		des: "Learn about our story, our mission, and the people who make it all happen.",
	},
	{
		path: "products",
		title: "Products",
		des: "Discover innovative solutions designed to help your business thrive.",
	},
	{
		path: "services",
		title: "Services",
		des: "Discover our comprehensive range of services.",
	},
	{
		path: "news",
		title: "News",
		des: "Stay updated with our latest news and announcements.",
	},
	{
		path: "contact",
		title: "Contact",
		des: "Get in touch with us today.",
	},
];

export default function Banner({}: BannerProps) {
	const titleRef = useRef<HTMLHeadingElement>(null);
	const descRef = useRef<HTMLParagraphElement>(null);
	const pathname = usePathname();
	let currentPath = "";

	if (pathname) {
		if (pathname.includes("/en/")) {
			currentPath = pathname.split("/en/")[1];
		} else {
			currentPath = pathname.startsWith("/") ? pathname.slice(1) : pathname;
		}
		// Ensure only the first segment is used
		currentPath = currentPath.split("/")[0];
	}

	const currentBanner = bannerItems.find((item) => item.path === currentPath) || {
		title: "Welcome",
		des: "Welcome to our website",
	};

	const handleAnimationComplete = () => {
		console.log("");
	};

	return (
		<section className="relative bg-gradient-to-br from-[#1e1e2f] to-[#0d0d1a] overflow-hidden rounded-t-2xl px-6 py-12 sm:px-8 sm:py-16">
			{/* Hiệu ứng nền trang trí */}
			<div className="absolute inset-0 bg-[url('/patterns/diagonal-lines.png')] opacity-20" />

			{/* Nội dung chính */}
			<div className="relative z-10 max-w-7xl mx-auto text-left">
				<BlurText
					text={currentBanner.title}
					delay={200}
					animateBy="letters"
					direction="top"
					onAnimationComplete={handleAnimationComplete}
					className="mb-6 font-extrabold text-white text-4xl sm:text-6xl md:text-7xl lg:text-[18vmin] xl:text-[20vmin] tracking-wide"
				/>
				<BlurText
					text={currentBanner.des}
					delay={200}
					animateBy="words"
					direction="top"
					onAnimationComplete={handleAnimationComplete}
					className="mt-2 mb-8 text-white text-sm sm:text-base md:text-lg lg:text-[3vmin] leading-relaxed"
				/>
			</div>
		</section>
	);
}
