import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import React from "react";
import LocaleSwitcher from "../Ui/LocaleSwitcher";
import Link from "next/link";



type NavItem = {
	key: string;
	path: string;
	translationKey: string;
};

const NAV_ITEMS: NavItem[] = [
	{ key: "home", path: "/", translationKey: "homepage" },
	{ key: "about", path: "/about", translationKey: "aboutus" },
	{ key: "products", path: "/products", translationKey: "products" },
	{ key: "services", path: "/services", translationKey: "services" },
	{ key: "news", path: "/news", translationKey: "news" },
	{ key: "contact", path: "/contact", translationKey: "contact" },
];

export default function Menu() {
	const t = useTranslations("home");
	const pathname = usePathname();

	const getCurrentLocale = (): string => {
		if (!pathname) return "vi";
		const segments = pathname.split("/");
		return segments[1] || "vi";
	};

	const createLocalePath = (path: string): string => {
		const locale = getCurrentLocale();
		return `/${locale}${path === "/" ? "" : path}`;
	};
	
	return (
		<>
			<ul className="menu list-none m-0 p-0 flex uppercase items-center gap-4 top-1">
				{NAV_ITEMS.map((item) => (
					<li key={item.key} className={pathname === createLocalePath(item.path) ? "active" : ""}>
						<Link
							href={createLocalePath(item.path)}
						>
							{t(item.translationKey)}
						</Link>
					</li>
				))}
				<li className="pb-1">
					<LocaleSwitcher />
				</li>
			</ul>
		</>
	);
}
