import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

interface MenuItem {
	key: string;
	path: string;
	translationKey: string;
}

const ADMIN_MENU_ITEMS: MenuItem[] = [
	{ key: "dashboard", path: "/admin/dashboard", translationKey: "dashboard" },
	{ key: "about", path: "/admin/aboutus", translationKey: "aboutus" },
	{ key: "products", path: "/admin/products", translationKey: "products" },
	{ key: "services", path: "/admin/services", translationKey: "services" },
	{ key: "news", path: "/admin/news", translationKey: "news" },
	{ key: "contact", path: "/admin/contact", translationKey: "contact" },
	{ key: "setting", path: "/admin/setting", translationKey: "setting" },
];

export default function Menu() {
	const t = useTranslations("admin");
	const pathname = usePathname();

	const getCurrentLocale = (): string => {
		if (!pathname) return "vi";
		const segments = pathname.split("/");
		return segments[1] || "vi";
	};

	const createLocalePath = (path: string): string => {
		const locale = getCurrentLocale();
		const cleanPath = path.replace(/^\/+/, "");
		return `/${locale}/${cleanPath}`;
	};

	const isActiveLink = (path: string): boolean => {
		const localePath = createLocalePath(path);
		return pathname === localePath;
	};

	return (
		<nav className="w-full">
			<ul className="flex flex-col gap-3 items-center">
				{ADMIN_MENU_ITEMS.map((item) => (
					<li
						key={item.key}
						className={`w-full text-center block py-2 px-4 rounded transition hover:bg-gray-600 ${
							isActiveLink(item.path) ? "bg-gray-600" : ""
						}`}
					>
						<Link href={createLocalePath(item.path)}>{t(item.translationKey)}</Link>
					</li>
				))}
			</ul>
		</nav>
	);
}
