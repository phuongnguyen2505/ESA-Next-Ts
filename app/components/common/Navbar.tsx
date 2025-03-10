import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Menu from "../layouts/Menu";

export default function Navbar() {
	const t = useTranslations("home");
	const [scrolled, setScrolled] = useState(false);
	useEffect(() => {
		const handleScroll = () => {
			if (window.scrollY > 49) {
				setScrolled(true);
			} else {
				setScrolled(false);
			}
		};
		window.addEventListener("scroll", handleScroll);
		return () => {
			window.removeEventListener("scroll", handleScroll);
		};
	}, []);

	return (
		<>
			<nav
				className={`navbar p-4 sticky bg-white backdrop-blur-lg top-0 z-50 border-b border-gray-100/20 font-medium ${
					scrolled ? "scrolled" : ""
				}`}
			>
				<div className="flex justify-evenly items-center mx-24">
					<Menu />
				</div>
			</nav>
		</>
	);
}
