"use client";

import "./globals.css";
import "./globals.scss";
import { ReactNode } from "react";

interface RootLayoutProps {
	children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
	return (
		<html>
			<body>{children}</body>
		</html>
	);
}
