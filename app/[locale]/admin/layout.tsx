import { ReactNode } from "react";
import "./admin.scss";

interface AdminLayoutProps {
	children: ReactNode;
}

export default function RootLayout({ children }: AdminLayoutProps) {
	return <div className="admin-layout">{children}</div>;
}
