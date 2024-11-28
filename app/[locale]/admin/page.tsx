"use client";

import { ReactNode, useEffect, useState } from "react";
import Sidebar from "./components/layouts/Sidebar";
import Header from "./components/layouts/Header";
import Breadcrumb from "@/app/components/Ui/Breadcrumb";
import { useRouter, usePathname } from "next/navigation";
import { useTranslations } from "next-intl";

interface AdminLayoutProps {
	children?: React.ReactNode;
	params: {
		locale?: string;
	};
}

export default function AdminLayout({ children = null, params }: AdminLayoutProps) {
	const t = useTranslations("admin");
	const [darkMode, setDarkMode] = useState(false);
	const router = useRouter();
	const pathname = usePathname();

	useEffect(() => {
		// Xử lý dark mode
		const isDarkMode = localStorage.getItem("darkMode") === "true";
		setDarkMode(isDarkMode);
		if (isDarkMode) {
			document.body.classList.add("dark");
		} else {
			document.body.classList.remove("dark");
		}
	}, []);

	useEffect(() => {
		// Chuyển hướng client-side
		router.push("/admin/dashboard");
	}, [router]);

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
				<div className="p-4 overflow-auto flex-1">{children}</div>
			</div>
		</div>
	);
}
