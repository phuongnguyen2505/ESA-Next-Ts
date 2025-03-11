import { ReactNode, useEffect } from "react";
import { redirect } from "next/navigation";
import { locales } from "@/i18n.config";
import { Metadata } from "next";
import ClientWrapper from "./ClientWrapper";
import { i18n } from "@/i18n.config";
import Script from 'next/script'

interface LocaleLayoutProps {
	children: ReactNode;
	params: Promise<{ locale: string; lang: Locale }>;
}

export async function generateStaticParams() {
	return i18n.locales.map((locale) => ({ lang: locale }));
}

export const metadata: Metadata = {
	title: 'VESA - Energy Saving Solutions',
	description: 'Professional VESA device energy-saving solutions',
};

type Locale = "en" | "vi";

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
	const resolvedParams = await params;
	const locale = resolvedParams.locale as Locale;

	if (!(locales as Locale[]).includes(locale)) {
		return redirect("/en");
	}

	let messages;
	try {
		messages = await import(`@/messages/${locale}.json`);
		if (!messages) {
			throw new Error(`Messages for ${locale} not found`);
		}
	} catch (error) {
		console.error("Error loading messages:", error);
		return redirect("/en");
	}

	return (
		<html>
			<head>
				<Script src="https://cdn.ckbox.io/ckbox/2.4.0/ckbox.js" strategy="lazyOnload" />
			</head>
			<body suppressHydrationWarning={true}>
				<ClientWrapper locale={locale} messages={messages.default}>
					<div className="relative">
						{children}
					</div>
				</ClientWrapper>
			</body>
		</html>
	);
}
