import type { Metadata } from "next";
import "./globals.css";
import "./globals.scss";
import { ReactNode } from "react";

interface RootLayoutProps {
	children: ReactNode;
}

export const metadata: Metadata = {
	title: "ESA Industry",
	description: "ESA Industry Description",
};

export default function RootLayout({ children }: RootLayoutProps) {
	return <>{children}</>;
}
