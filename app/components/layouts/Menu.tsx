"use client";

import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";

type NavItem = {
	key: string;
	path: string;
	translationKey: string;
};

const NAV_ITEMS: NavItem[] = [
	{ key: "home", path: "/", translationKey: "homepage" },
	{ key: "about", path: "/about", translationKey: "about" },
	{ key: "products", path: "/products", translationKey: "products" },
	{ key: "services", path: "/services", translationKey: "services" },
	{ key: "news", path: "/news", translationKey: "news" },
	{ key: "contact", path: "/contact", translationKey: "contact" },
];

export default function Menu() {
	const t = useTranslations("home");
	const pathname = usePathname();
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const mobileMenuRef = useRef<HTMLDivElement>(null);

	const getCurrentLocale = (): string => {
		if (!pathname) return "en";
		const segments = pathname.split("/");
		return segments[1] || "en";
	};

	const createLocalePath = (path: string): string => {
		const locale = getCurrentLocale();
		return `/${locale}${path === "/" ? "" : path}`;
	};

	const isActiveLink = (path: string): boolean => {
		const localePath = createLocalePath(path);
		return pathname === localePath;
	};

	const renderNavItems = (items: NavItem[]) => (
		<ul className="flex gap-4 max-xl:flex-col">
			{items.map((item) => (
				<li key={item.key} className={isActiveLink(item.path) ? "active" : ""}>
					<Link
						href={createLocalePath(item.path)}
						onClick={() => setMobileMenuOpen(false)}
						className="max-xl:text-2xl"
					>
						{t(item.translationKey)}
					</Link>
				</li>
			))}
		</ul>
	);

	// GSAP animation cho mobile menu khi mở
	useEffect(() => {
		if (mobileMenuOpen && mobileMenuRef.current) {
			gsap.fromTo(
				mobileMenuRef.current,
				{ y: -50, opacity: 0 },
				{ y: 0, opacity: 1, duration: 0.5 },
			);
		}
	}, [mobileMenuOpen]);

	return (
		<>
			{/* Desktop Menu */}
			<nav className="w-full z-50 max-xl:hidden">
				<div className="flex justify-evenly items-center uppercase">
					<ul className="menu min-w-[360px] list-none m-0 p-0 flex gap-4">
						{renderNavItems(NAV_ITEMS.slice(0, 3))}
					</ul>
					<div className="flex items-center">
						<div className="max-w-36 flex justify-center items-center flex-1">
							<Link
								href={createLocalePath("/")}
								className="flex h-12 max-h-32 relative items-center"
							>
								<Image
									src="/images/shortcut.png"
									alt="Logo"
									className="logo top-7 relative object-contain"
									width={150}
									height={50}
									priority
								/>
							</Link>
						</div>
					</div>
					<ul className="menu min-w-[360px] list-none m-0 p-0 flex gap-4">
						{renderNavItems(NAV_ITEMS.slice(3))}
					</ul>
				</div>
			</nav>

			{/* Mobile Header with Hamburger */}
			<nav className="hidden max-xl:flex justify-between items-center p-4 uppercase">
				<Link
					href={createLocalePath("/")}
					className="flex h-12 relative items-center"
				>
					<Image
						src="/images/shortcut.png"
						alt="Logo"
						className="relative object-contain"
						width={80}
						height={50}
						priority
					/>
				</Link>
				<button
					onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
					className="focus:outline-none"
					aria-label="Toggle Menu"
				>
					{mobileMenuOpen ? (
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-6 w-6 text-blue-500"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M6 18L18 6M6 6l12 12"
							/>
						</svg>
					) : (
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-6 w-6 text-blue-500"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M4 6h16M4 12h16M4 18h16"
							/>
						</svg>
					)}
				</button>
			</nav>

			{/* Mobile Fullscreen Menu */}
			{mobileMenuOpen && (
				<div
					ref={mobileMenuRef}
					className="inset-0 z-50 bg-white flex flex-col justify-start items-center p-8 uppercase overflow-hidden min-h-screen"
				>
					{renderNavItems(NAV_ITEMS)}
				</div>
			)}
		</>
	);
}
