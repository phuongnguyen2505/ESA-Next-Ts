"use client";

import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import React from "react";
import Link from "next/link";
import Image from "next/image";

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
		<ul className="flex gap-4">
			{items.map((item) => (
				<li key={item.key} className={isActiveLink(item.path) ? "active" : ""}>
					<Link href={createLocalePath(item.path)}>{t(item.translationKey)}</Link>
				</li>
			))}
		</ul>
	);

	return (
		<nav className="w-full z-50">
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
	);
}
