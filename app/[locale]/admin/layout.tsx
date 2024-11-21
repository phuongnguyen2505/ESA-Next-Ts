import { ReactNode } from "react";
import "./admin.scss";

interface AdminLayoutProps {
	children: ReactNode;
}

export default function RootLayout({ children }: AdminLayoutProps) {
	return (
		<html>
			<body>{children}</body>
		</html>
	);
}
