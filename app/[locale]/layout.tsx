import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { locales } from "@/i18n.config";
import { Metadata } from "next";
import ClientWrapper from "./ClientWrapper";
import { Locale, i18n } from "@/i18n.config";

interface LocaleLayoutProps {
	children: ReactNode;
	params: Promise<{ locale: string; lang: Locale; }>;
}

export async function generateStaticParams() {
	return i18n.locales.map((locale) => ({ lang: locale }));
}

export const metadata: Metadata = {
	title: "ESA Industry",
	description: "ESA Industry Description",
};

type Locale = "en" | "vi";

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
	const resolvedParams = await params;
	const locale = resolvedParams.locale as Locale;

	if (!locales.includes(locale)) {
		return redirect("/vi");
	}

	let messages;
	try {
		messages = await import(`@/messages/${locale}.json`);
		if (!messages) {
			throw new Error(`Messages for ${locale} not found`);
		}
	} catch (error) {
		console.error("Error loading messages:", error);
		return redirect("/vi");
	}

	return (
		<html>
			<body suppressHydrationWarning={true}>
				<ClientWrapper locale={locale} messages={messages.default}>
					{children}
				</ClientWrapper>
			</body>
		</html>
	);
}
