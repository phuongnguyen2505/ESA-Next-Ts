"use client";

import React, { useState } from "react";
import AdminLayout from "../components/layouts/AdminLayout";
import { useTranslations } from "next-intl";

export default function Services() {
	const t = useTranslations("admin");
	return <AdminLayout pageName={t("services")}>Services</AdminLayout>;
}
