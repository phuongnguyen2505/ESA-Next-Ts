"use client";
export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import { NextIntlClientProvider } from "next-intl";

interface ClientWrapperProps {
	locale: string;
	messages: any;
	children: React.ReactNode;
}

export default function ClientWrapper({
	locale,
	messages,
	children,
}: ClientWrapperProps) {
	const [hasMounted, setHasMounted] = useState(false);

	useEffect(() => {
		setHasMounted(true);
	}, []);

	if (!hasMounted) return null;

	return (
		<NextIntlClientProvider locale={locale} messages={messages} timeZone="UTC">
			{children}
		</NextIntlClientProvider>
	);
}
