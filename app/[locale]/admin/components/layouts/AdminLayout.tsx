"use client";
import { ReactNode, useEffect, useState } from "react";
import Breadcrumb from "@/app/components/Ui/Breadcrumb";
import Sidebar from "@/app/[locale]/admin/components/layouts/Sidebar";
import Header from "@/app/[locale]/admin/components/layouts/Header";


interface AdminLayoutProps {
	children: ReactNode;
	pageName: string;
}

export default function AdminLayout({ children, pageName }: AdminLayoutProps) {
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
		<section className="flex h-screen">
			<Sidebar toggleDarkMode={toggleDarkMode} />
			<div className="flex-1 bg-white h dark:bg-dark-bg dark:text-white h-screen">
				<Header />
				<div className="bg-gray-200 dark:bg-gray-700 p-4">
					<Breadcrumb pageName={pageName} url=""/>
				</div>
				<div className="p-4 overflow-auto flex-1">{children}</div>
			</div>
		</section>
	);
}
