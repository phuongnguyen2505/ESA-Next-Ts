"use client";

import ClientLayout from "@/app/components/layouts/ClientLayout";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function About() {
	const params = useParams();
	const locale = params?.locale as string;
	const [abouts, setAbouts] = useState<
		{ id: string; noidung_vi: string; noidung_en: string; hienthi: number }[]
	>([]);

	useEffect(() => {
		fetch("/api/abouts")
			.then((res) => {
				if (!res.ok) {
					throw new Error("Failed to fetch abouts");
				}
				return res.json();
			})
			.then((data) => {
				if (data) {
					const visibleAbouts = Array.isArray(data)
						? data.filter((item) => item.hienthi === 1)
						: [data].filter((item) => item.hienthi === 1);
					setAbouts(visibleAbouts);
				}
			})
			.catch((error) => {
				console.error("Error fetching abouts:", error);
			});
	}, []);
	return (
		<ClientLayout>
			<div className="relative w-full bg-gradient-to-b rounded-lg from-gray-50 to-gray-100 overflow-hidden">
				<section className="container mx-auto px-4 md:px-6 py-4 md:py-6">
					{abouts.length > 0
						? abouts.map(
								(about: {
									id: string;
									noidung_vi: string;
									noidung_en: string;
								}) => (
									<div key={about.id} className="flex flex-col">
										<div
											dangerouslySetInnerHTML={{
												__html:
													locale === "en"
														? about.noidung_en
														: about.noidung_vi,
											}}
										/>
									</div>
								),
						  )
						: null}
				</section>
			</div>
		</ClientLayout>
	);
}
