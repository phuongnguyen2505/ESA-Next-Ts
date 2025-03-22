"use client";

import { useEffect, useState } from "react";
import LocaleSwitcher from "@/app/components/Ui/LocaleSwitcher";
import Link from "next/link";

const Header = () => {
	const [ten, setTen] = useState("");

	useEffect(() => {
		const fetchUser = async () => {
			try {
				const response = await fetch("/api/auth/me", {
					credentials: "include",
				});
				if (response.ok) {
					const data = await response.json();
					setTen(data.ten);
				}
			} catch (error) {
				console.error("Không thể lấy thông tin người dùng:", error);
			}
		};
		fetchUser();
	}, []);

	return (
		<header className="flex justify-between items-center bg-gray-800 text-white p-4">
			<div className="flex items-center space-x-4">
				<span className="text-lg">Admin Dashboard</span>
			</div>
			<div className="flex items-center space-x-6">
				<LocaleSwitcher />
				<span>Welcome, {ten}</span>
				<button
					onClick={async () => {
						try {
							const response = await fetch("/api/auth/logout", {
								method: "POST",
								credentials: "include",
							});
							if (response.ok) {
								window.location.href = `/admin/login?t=${new Date().getTime()}`;
							}
						} catch (error) {
							console.error("Logout failed:", error);
						}
					}}
					className="py-2 px-4 bg-gray-600 text-white rounded hover:bg-gray-500 transition"
				>
					Logout
				</button>
			</div>
		</header>
	);
};

export default Header;
