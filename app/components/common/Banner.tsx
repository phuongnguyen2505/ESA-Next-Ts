"use client";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import gsap from "gsap";

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

	useEffect(() => {
		if (titleRef.current && descRef.current) {
			gsap.fromTo(
				titleRef.current,
				{ opacity: 0, y: -50 },
				{ opacity: 1, y: 0, duration: 1 },
			);
			gsap.fromTo(
				descRef.current,
				{ opacity: 0, y: 50 },
				{ opacity: 1, y: 0, duration: 1, delay: 0.5 },
			);
		}
	}, [currentBanner.title, currentBanner.des]);

	return (
		<section className="bg-[#202037] relative flex items-center overflow-hidden py-12 sm:py-16 rounded-t-2xl">
			{/* Background Effects */}
			<div className="absolute inset-0 bg-gradient-to-br from-[#1e1e2f] to-[#0d0d1a]" />

			{/* Content Container */}
			<div className="container mx-auto px-4 text-left">
				<h1
					ref={titleRef}
					className="font-bold text-white text-4xl sm:text-6xl md:text-7xl lg:text-[18vmin] xl:text-[20vmin]"
				>
					{currentBanner.title}
				</h1>
				<p
					ref={descRef}
					className="mt-4 text-white text-sm sm:text-base md:text-lg lg:text-[3vmin]"
				>
					{currentBanner.des}
				</p>
			</div>
		</section>
	);
}
