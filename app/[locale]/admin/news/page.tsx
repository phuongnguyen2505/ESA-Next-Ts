"use client";

import React from "react";
import AdminLayout from "../components/layouts/AdminLayout";
import { useTranslations } from "next-intl";

export default function News() {
	const t = useTranslations("admin");
	return <AdminLayout pageName={t("news")}>News</AdminLayout>;
}
