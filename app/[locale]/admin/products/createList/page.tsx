"use client";

import AdminLayout from "@/app/[locale]/admin/components/layouts/AdminLayout";
import { useTranslations } from "next-intl";
import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import axiosInstance from "@/lib/axios";
import Modal from "../../components/Ui/ModalAlert";
import Button from "../../components/Ui/Button";
import InputSm from "../../components/Ui/InputSm";
import LanguageTabs from "../../components/Ui/LanguageTabs";
import InputTextarea from "../../components/Ui/InputArea";
import { ProductListFormData } from "@/types/productList";


interface ApiResponse {
	list: ProductListFormData;
}

// Thêm hàm chuyển đổi string thành URL friendly
const convertToSlug = (text: string): string => {
	return text
		.toLowerCase()
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')  // Bỏ dấu tiếng Việt
		.replace(/[đĐ]/g, 'd')            // Thay đ/Đ thành d
		.replace(/[^a-z0-9\s-]/g, '')     // Chỉ giữ lại chữ thường, số và dấu gạch ngang
		.replace(/\s+/g, '-')             // Thay khoảng trắng bằng dấu gạch ngang
		.replace(/-+/g, '-')              // Xóa các dấu gạch ngang liên tiếp
		.trim();                          // Xóa khoảng trắng đầu/cuối
};

export default function ListForm() {
	const t = useTranslations("admin");
	const router = useRouter();
	const params = useParams() as { action?: string; id?: string };
	const isEdit = params.action === "edit";

	const [formData, setFormData] = useState<Partial<ProductListFormData>>({
		ten_vi: "",
		ten_en: "",
		tenkhongdau: "",
		mota_vi: "",
		mota_en: "",
		noidung_vi: "",
		noidung_en: "",
		title_vi: "",
		title_en: "",
		keywords_vi: "",
		keywords_en: "",
		description_vi: "",
		description_en: "",
		hienthi: 1,
		noibat: 0,
		ngaytao: new Date(),
		ngaysua: new Date()
	});

	const [activeTab, setActiveTab] = useState<"vi" | "en">("vi");
	const [modal, setModal] = useState({
		isOpen: false,
			message: "",
			type: "success" as "success" | "error",
	});

	const fetchListData = useCallback(async () => {
		try {
			const timestamp = new Date().getTime();
			const response = await axiosInstance.get<ApiResponse>(
				`/api/productList/${params.id}?t=${timestamp}`,
			);
			setFormData(response.data.list);
		} catch (error) {
			console.error("Lỗi khi tải dữ liệu:", error);
			setModal({
				isOpen: true,
				message: t("messages.loadDataError"),
				type: "error",
			});
		}
	}, [params.id, t]);

	useEffect(() => {
		if (isEdit && params.id) {
			fetchListData();
		}
	}, [isEdit, params.id, fetchListData]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			if (isEdit) {
				await axiosInstance.put(`/api/productList/${params.id}`, {
					...formData,
					ngaysua: new Date().toISOString(),
				});
			} else {
				await axiosInstance.post("/api/productList", {
					...formData,
					ngaytao: new Date().toISOString(),
					ngaysua: new Date().toISOString(),
				});
			}

			setModal({
				isOpen: true,
				message: t(isEdit ? "messages.updateSuccess" : "messages.createSuccess"),
				type: "success",
			});

			router.push("/admin/products");
		} catch (error: any) {
			console.error("Lỗi khi lưu:", error);
			const errorMessage =
				error.response?.data?.message ||
				t(isEdit ? "messages.updateFailed" : "messages.createFailed");
			setModal({
				isOpen: true,
				message: errorMessage,
				type: "error",
			});
		}
	};

	return (
		<AdminLayout pageName={t("create") + " " + t("productList")}>
			<Modal
				isOpen={modal.isOpen}
				message={modal.message}
				type={modal.type}
				onClose={() => setModal((prev) => ({ ...prev, isOpen: false }))}
			/>

			<div className="w-full max-w-2xl mx-auto px-4 py-6">
				<form onSubmit={handleSubmit} className="space-y-6">
					<LanguageTabs activeTab={activeTab} onTabChange={setActiveTab} t={t} />

					{activeTab === "vi" ? (
						<>
							<InputSm
								title={t("name")}
								language={t("vn")}
								value={formData.ten_vi}
								onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
									const newTenVi = e.target.value;
									setFormData((prev) => ({ 
										...prev, 
										ten_vi: newTenVi,
										tenkhongdau: convertToSlug(newTenVi)
									}));
								}}
								placeholder={t("name")}
								name="ten_vi"
							/>

							<div>
								<InputTextarea
									title={t("description")}
									value={formData.mota_vi || ""}
									onChange={(e) =>
										setFormData((prev) => ({
											...prev,
											mota_vi: e.target.value,
										}))
									}
									language={t("vn")}
									placeholder={t("description")}
									name="mota_vi"
								/>
							</div>

							<InputSm
								title={t("title")}
								language={t("vn")}
								value={formData.title_vi}
								onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
									setFormData((prev) => ({ ...prev, title_vi: e.target.value }))
								}
								placeholder={t("title")}
								name="title_vi"
							/>

							<InputSm
								title={t("keywords")}
								language={t("vn")}
								value={formData.keywords_vi}
								onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
									setFormData((prev) => ({
										...prev,
										keywords_vi: e.target.value,
									}))
								}
								placeholder={t("keywords")}
								name="keywords_vi"
							/>
						</>
					) : (
						<>
							<InputSm
								title={t("name")}
								language={t("en")}
								value={formData.ten_en}
								onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
									setFormData((prev) => ({ ...prev, ten_en: e.target.value }))
								}
								placeholder={t("name")}
								name="ten_en"
							/>

							<div>
								<InputTextarea
									title={t("description")}
									value={formData.mota_en || ""}
									onChange={(e) =>
										setFormData((prev) => ({
											...prev,
											mota_en: e.target.value,
										}))
									}
									language={t("en")}
									placeholder={t("description")}
									name="mota_en"
								/>
							</div>

							<InputSm
								title={t("title")}
								language={t("en")}
								value={formData.title_en}
								onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
									setFormData((prev) => ({ ...prev, title_en: e.target.value }))
								}
								placeholder={t("title")}
								name="title_en"
							/>

							<InputSm
								title={t("keywords")}
								language={t("en")}
								value={formData.keywords_en}
								onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
									setFormData((prev) => ({
										...prev,
										keywords_en: e.target.value,
									}))
								}
								placeholder={t("keywords")}
								name="keywords_en"
							/>
						</>
					)}

					<InputSm
						title={t("url")}
						value={formData.tenkhongdau}
						onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
							setFormData((prev) => ({ ...prev, tenkhongdau: e.target.value }))
						}
						name="tenkhongdau"
						placeholder={t("url")}
						readOnly
						disabled
					/>

					<div className="flex space-x-4">
						<div className="flex-1">
							<label
								htmlFor="status"
								className="p-2 block text-sm font-medium text-gray-700 dark:text-white"
							>
								{t("status")}
							</label>
							<select
								id="status"
								value={formData.hienthi}
								onChange={(e) =>
									setFormData((prev) => ({
										...prev,
										hienthi: Number(e.target.value),
									}))
								}
								name="hienthi"
								className="p-2 mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:text-gray-700 focus:border-indigo-500 focus:ring-indigo-500"
							>
								<option value={1}>{t("active")}</option>
								<option value={0}>{t("inactive")}</option>
							</select>
						</div>

						<div className="flex-1">
							<label
								htmlFor="priority"
								className="p-2 block text-sm font-medium text-gray-700 dark:text-white"
							>
								{t("priority")}
							</label>
							<select
								id="priority"
								value={formData.noibat}
								onChange={(e) =>
									setFormData((prev) => ({
										...prev,
										noibat: Number(e.target.value),
									}))
								}
								className="p-2 mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:text-gray-700 focus:border-indigo-500 focus:ring-indigo-500"
							>
								<option value={1}>{t("featured")}</option>
								<option value={0}>{t("normal")}</option>
							</select>
						</div>
					</div>

					{isEdit && (
						<div className="grid grid-cols-2 gap-4">
							<div>
								<label className="block text-sm font-medium text-gray-700">
									{t("createdAt")}
								</label>
								<input
									type="text"
									value={new Date(formData.ngaytao || "").toLocaleDateString()}
									disabled
									readOnly
									className="p-2 mt-1 block w-full rounded-md border-gray-300 bg-gray-100 dark:text-gray-700"
								/>
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-700">
									{t("updatedAt")}
								</label>
								<input
									type="text"
									value={new Date(formData.ngaysua || "").toLocaleDateString()}
									disabled
									readOnly
									className="p-2 mt-1 block w-full rounded-md border-gray-300 bg-gray-100 dark:text-gray-700"
								/>
							</div>
						</div>
					)}

					<div className="flex justify-end space-x-3">
						<Button
							type="button"
							onClick={() => router.back()}
							className="bg-gray-600 hover:bg-gray-700"
						>
							{t("cancel")}
						</Button>
						<Button type="submit" className="bg-green-600 hover:bg-green-700">
							{t("save")}
						</Button>
					</div>
				</form>
			</div>
		</AdminLayout>
	);
}
