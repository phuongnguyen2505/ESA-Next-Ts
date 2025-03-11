"use client";

import { ReactNode, useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import Breadcrumb from "@/app/components/Ui/Breadcrumb";

interface AdminLayoutProps {
	children: ReactNode;
	pageName: string;
}

export default function AdminLayout({ children, pageName }: AdminLayoutProps) {
	const [darkMode, setDarkMode] = useState(false);

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
					<Breadcrumb pageName={pageName} url="/admin/dashboard" />
				</div>
				<div className="p-4 overflow-auto flex-1">{children}</div>
			</div>
		</div>
	);
}
