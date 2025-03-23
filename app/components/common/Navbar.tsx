"use client";
export const dynamic = "force-dynamic";

import { useTranslations } from "next-intl";
import React, { useEffect, useState } from "react";
import Menu from "../layouts/Menu";

export default function Navbar() {
	const t = useTranslations("home");
	const [scrolled, setScrolled] = useState(false);

	useEffect(() => {
		const handleScroll = () => {
			setScrolled(window.scrollY > 49);
		};
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	return (
		<nav
			className={`navbar p-4 sticky bg-white backdrop-blur-lg top-0 z-50 border-b border-gray-100/20 font-medium ${
				scrolled ? "scrolled" : ""
			}`}
		>
			<div className="mx-4 md:mx-24">
				<Menu />
			</div>
		</nav>
	);
}
