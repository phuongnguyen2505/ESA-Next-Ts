"use client";

import AdminLayout from "@/app/[locale]/admin/components/layouts/AdminLayout";
import { useTranslations } from "next-intl";

export default function Dashboard() {
	const t = useTranslations("admin");
	return (
		<AdminLayout pageName={t("dashboard")}>
			<div>
				<h1>Dashboard Content</h1>
			</div>
		</AdminLayout>
	);
}
