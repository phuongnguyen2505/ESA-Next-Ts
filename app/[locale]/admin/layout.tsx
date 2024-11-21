"use client";

import { ReactNode, useEffect, useState } from "react";
import Sidebar from "./components/layouts/Sidebar";
import Header from "./components/layouts/Header";
import Breadcrumb from "@/app/components/Ui/Breadcrumb";
import { redirect, usePathname } from "next/navigation";
import { useTranslations } from "next-intl";

interface AdminLayoutProps {
	children: ReactNode;
	params: {
		locale: string;
	};
}

export default function AdminLayout({ children, params }: AdminLayoutProps) {
	const t = useTranslations("admin");
	const [darkMode, setDarkMode] = useState(false);

	useEffect(() => {
		const isDarkMode = localStorage.getItem("darkMode") === "true";
		setDarkMode(isDarkMode);
		if (isDarkMode) {
			document.body.classList.add("dark");
		} else {
			document.body.classList.remove("dark");
		}
	}, []);

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

	const _isActiveLink = (path: string): boolean => {
		const localePath = createLocalePath(path);
		return pathname === localePath;
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
	redirect("./admin/dashboard");
	return (
		<div className="flex h-screen">
			<Sidebar toggleDarkMode={toggleDarkMode} />
			<div className="flex-1 bg-white dark:bg-dark-bg dark:text-white overflow-scroll">
				<Header />
				<div className="bg-gray-200 dark:bg-gray-700 p-4">
					<Breadcrumb pageName="" url="" />
				</div>
				<div className="p-4 overflow-auto flex-1">{children}</div>
			</div>
		</div>
	);
}
