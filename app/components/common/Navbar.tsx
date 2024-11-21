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
				className={`navbar p-4 sticky top-0 left-0 z-50 bg-transparent font-medium ${
					scrolled ? "scrolled" : ""
				}`}
			>
				<div className="flex justify-between items-center mx-24">
					<div className="max-w-36 flex justify-center items-center flex-1">
						<Link href="./" className="flex h-12 max-h-32 relative items-center">
							<Image
								src="/images/final.png"
								alt="Logo"
								className="logo top-7 relative"
								width={150}
								height={50}
							/>
						</Link>
					</div>
					<Menu />
				</div>
			</nav>
		</>
	);
}
