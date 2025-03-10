"use client";

import { ReactNode } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import Breadcrumb from "@/app/components/Ui/Breadcrumb";

interface AdminLayoutProps {
	children: ReactNode;
	pageName: string;
}

export default function AdminLayout({ children, pageName }: AdminLayoutProps) {
	return (
		<div className="flex h-screen">
			<Sidebar />
			<div className="flex-1 bg-white dark:bg-dark-bg dark:text-white overflow-scroll">
				<Header />
				<div className="bg-gray-200 dark:bg-gray-700 p-4">
					<Breadcrumb pageName={pageName} url="/admin/dashboard" />
				</div>
				<div className="p-4 overflow-auto flex-1">
					{children}
				</div>
			</div>
		</div>
	);
}
