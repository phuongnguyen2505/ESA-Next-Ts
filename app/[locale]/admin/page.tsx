"use client";
export const dynamic = "force-dynamic";

import { ReactNode, useEffect, useState } from "react";
import Sidebar from "./components/layouts/Sidebar";
import Header from "./components/layouts/Header";
import Breadcrumb from "@/app/components/Ui/Breadcrumb";
import { useRouter, usePathname, useParams } from "next/navigation";
import { useTranslations } from "next-intl";

export default function AdminLayout({}: {}) {
	const t = useTranslations("admin");
	const [darkMode, setDarkMode] = useState(false);
	const router = useRouter();
	const pathname = usePathname();
	const params = useParams();
	const locale = (params && params.locale) || "en";

	useEffect(() => {
		// Dark mode handling
		const isDarkMode = localStorage.getItem("darkMode") === "true";
		setDarkMode(isDarkMode);
		if (isDarkMode) {
			document.body.classList.add("dark");
		} else {
			document.body.classList.remove("dark");
		}
	}, []);

	useEffect(() => {
		// Client-side redirect
		router.push(`/${locale}/admin/dashboard`);
	}, [router, locale]);

	const getCurrentLocale = (): string => {
		if (!pathname) return "en";
		const segments = pathname.split("/");
		return segments[1] || "en";
	};

	const createLocalePath = (path: string): string => {
		const currentLocale = getCurrentLocale();
		const cleanPath = path.replace(/^\/+/, "");
		return `/${currentLocale}/${cleanPath}`;
	};

	const toggleDarkMode = () => {
		setDarkMode((prev) => {
			const newDarkMode = !prev;
			localStorage.setItem("darkMode", newDarkMode.toString());
			if (newDarkMode) {
				document.body.classList.add("dark");
			} else {
				document.body.classList.remove("dark");
			}
			return newDarkMode;
		});
	};

	return (
		<div className="flex h-screen">
			<Sidebar toggleDarkMode={toggleDarkMode} />
			<div className="flex-1 bg-white dark:bg-dark-bg dark:text-white overflow-scroll">
				<Header />
				<div className="bg-gray-200 dark:bg-gray-700 p-4">
					<Breadcrumb pageName="Dashboard" url="/admin/dashboard" />
				</div>
				<div className="p-4 overflow-auto flex-1"></div>
			</div>
		</div>
	);
}
