"use client";

import React, { useEffect, useState } from "react";
import AdminLayout from "../components/layouts/AdminLayout";
import { useTranslations } from "next-intl";
import axios from "axios";
import InputSm from "../components/Ui/InputSm";
import InputTextarea from "../components/Ui/InputArea";
import Button from "../components/Ui/Button";
import Modal from "../components/Ui/ModalAlert";

export default function Setting() {
	const t = useTranslations("admin");
	const [formData, setFormData] = useState({
		id: "",
		title_en: "",
		keywords_en: "",
		description_en: "",
		ten_en: "",
		email: "",
		diachi_en: "",
		hotline: "",
		website: "",
		toado: "",
		analytics: "",
		headcode: "",
	});
	const [loading, setLoading] = useState(false);
	const [modal, setModal] = useState({
		isOpen: false,
		message: "",
		type: "success" as "success" | "error",
	});

	// Lấy dữ liệu setting khi component mount
	useEffect(() => {
		const fetchSetting = async () => {
			try {
				const res = await axios.get<{ setting?: typeof formData }>("/api/settings");
				if (res.data.setting) {
					setFormData((prev) => ({ ...prev, ...res.data.setting }));
				}
			} catch (error) {
				console.error("Error fetching setting:", error);
			}
		};
		fetchSetting();
	}, []);

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setModal((prev) => ({ ...prev, message: "" }));
		try {
			if (formData.id) {
				// Cập nhật setting (PUT)
				await axios.put("/api/settings", formData);
				setModal({
					isOpen: true,
					message: "Setting updated successfully",
					type: "success",
				});
			} else {
				// Tạo mới setting (POST)
				const res = await axios.post<{ id: string }>("/api/settings", formData);
				setFormData((prev) => ({ ...prev, id: res.data.id }));
				setModal({
					isOpen: true,
					message: "Setting created successfully",
					type: "success",
				});
			}
		} catch (error) {
			console.error("Error saving setting:", error);
			setModal({
				isOpen: true,
				message: "Error saving setting",
				type: "error",
			});
		} finally {
			setLoading(false);
		}
	};

	return (
		<AdminLayout pageName={t("setting")}>
			<Modal
				isOpen={modal.isOpen}
				message={modal.message}
				type={modal.type}
				onClose={() => setModal((prev) => ({ ...prev, isOpen: false }))}
			/>
			<form
				onSubmit={handleSubmit}
				className="w-full mx-auto p-6 bg-white rounded-lg shadow-lg space-y-6 dark:bg-gray-800"
			>
				{/* Thông tin chính */}
				<div className="space-y-6">
					<InputSm
						title="Title"
						type="text"
						name="title_en"
						value={formData.title_en}
						onChange={handleChange}
						placeholder={t("title")}
					/>
					<InputSm
						title="Name"
						type="text"
						name="ten_en"
						value={formData.ten_en}
						onChange={handleChange}
						placeholder={t("name")}
					/>
					<InputSm
						title="Keywords"
						type="text"
						name="keywords_en"
						value={formData.keywords_en}
						onChange={handleChange}
						placeholder={t("keywords")}
					/>
					<InputTextarea
						title="Description"
						name="description_en"
						value={formData.description_en}
						onChange={handleChange}
						placeholder={t("description")}
					/>
					<InputSm
						title="Email"
						type="email"
						name="email"
						value={formData.email}
						onChange={handleChange}
						placeholder={t("email")}
					/>
					<InputSm
						title="Address"
						type="text"
						name="diachi_en"
						value={formData.diachi_en}
						onChange={handleChange}
						placeholder={t("address")}
					/>
					<InputSm
						title="Hotline"
						type="text"
						name="hotline"
						value={formData.hotline}
						onChange={handleChange}
						placeholder={t("hotline")}
					/>
					<InputSm
						title="Website"
						type="text"
						name="website"
						value={formData.website}
						onChange={handleChange}
						placeholder={t("website")}
					/>
					<InputSm
						title="Coordinates"
						type="text"
						name="toado"
						value={formData.toado}
						onChange={handleChange}
						placeholder={t("coordinates")}
					/>
				</div>
				{/* Các cấu hình bổ sung */}
				<div>
					<InputTextarea
						title="Analytics"
						name="analytics"
						value={formData.analytics}
						onChange={handleChange}
						placeholder={t("analytics")}
					/>
				</div>
				<div>
					<InputTextarea
						title="Headcode"
						name="headcode"
						value={formData.headcode}
						onChange={handleChange}
						placeholder={t("headcode")}
					/>
				</div>
				<div className="flex justify-end">
					<Button type="submit" className="bg-green-500 hover:bg-green-700" disabled={loading}>
						{t("save")}
					</Button>
				</div>
			</form>
		</AdminLayout>
	);
}
