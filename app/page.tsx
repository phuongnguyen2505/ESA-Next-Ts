"use client";

import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";
import { useTranslations } from "next-intl";
import LocaleSwitcher from "./components/Ui/LocaleSwitcher";

export default function Home() {
	const t = useTranslations("home");
	return (
		<>
			<LocaleSwitcher />
			<h1>{t("title")}</h1>
			<p>{t("description")}</p>
			<Navbar />
			<div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-mont-r)]">
				<main className="flex flex-col gap-8 row-start-2 items-center sm:items-start"></main>
			</div>
			<Footer />
		</>
	);
}
