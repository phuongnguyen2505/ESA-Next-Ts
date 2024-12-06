"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import AdminLayout from "../../components/layouts/AdminLayout";
import InputArea from "../../components/Ui/InputArea";
import InputSm from "../../components/Ui/InputSm";
import Button from "../../components/Ui/Button";
import Modal from "../../components/Ui/ModalAlert";
import LanguageTabs from "../../components/Ui/LanguageTabs";
import axiosInstance from "@/lib/axios";
import { ProductList } from "@/types/productList";

export default function CreateProductCat() {
	const router = useRouter();
	const t = useTranslations("admin");
	const [activeTab, setActiveTab] = useState<"vi" | "en">("vi");
	const [formData, setFormData] = useState({
		id_list: 0,
		ten_vi: "",
		ten_en: "",
		tenkhongdau: "",
		title_vi: "",
		title_en: "",
		keywords_vi: "",
		keywords_en: "",
		description_vi: "",
		description_en: "",
		hienthi: 1,
		noibat: 0,
		ngaytao: new Date(),
		ngaysua: new Date(),
	});

	const [modal, setModal] = useState({
		isOpen: false,
		message: "",
		type: "success" as "success" | "error",
	});

	const [lists, setLists] = useState<ProductList[]>([]);

	const fetchLists = async () => {
		try {
			const response = await axiosInstance.get<{ lists: ProductList[] }>(
				"/api/productList",
			);
			setLists(response.data.lists);
		} catch (error) {
			console.error("Error fetching lists:", error);
		}
	};

	useEffect(() => {
		fetchLists();
	}, []);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			await axiosInstance.post("/api/productCats", formData);
			setModal({
				isOpen: true,
				message: t("messages.createSuccess"),
				type: "success",
			});
			router.push("/admin/products");
		} catch (error) {
			console.error("Error creating product category:", error);
			setModal({
				isOpen: true,
				message: t("messages.createFailed"),
				type: "error",
			});
		}
	};

	const convertToSlug = (text: string): string => {
		return text
			.toLowerCase()
			.normalize("NFD")
			.replace(/[\u0300-\u036f]/g, "") // Bỏ dấu tiếng Việt
			.replace(/[đĐ]/g, "d") // Thay đ/Đ thành d
			.replace(/[^a-z0-9\s-]/g, "") // Chỉ giữ lại chữ thường, số và dấu gạch ngang
			.replace(/\s+/g, "-") // Thay khoảng trắng bằng dấu gạch ngang
			.replace(/-+/g, "-") // Xóa các dấu gạch ngang liên tiếp
			.trim(); // Xóa khoảng trắng đầu/cuối
	};
	return (
		<AdminLayout pageName={t("createCat")}>
			<Modal
				isOpen={modal.isOpen}
				message={modal.message}
				type={modal.type}
				onClose={() => setModal((prev) => ({ ...prev, isOpen: false }))}
			/>
			<div className="w-full max-w-2xl mx-auto px-4 py-6">
				<form onSubmit={handleSubmit} className="space-y-6">
					<div>
						<label
							htmlFor="id_list"
							className="block text-sm font-medium text-gray-700 dark:text-white mb-2"
						>
							{t("productList")}
						</label>
						<select
							id="id_list"
							value={formData.id_list}
							onChange={(e) =>
								setFormData((prev) => ({
									...prev,
									id_list: Number(e.target.value),
								}))
							}
							className="p-2 mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:text-gray-700 focus:border-indigo-500 focus:ring-indigo-500"
							required
						>
							<option value="">{t("selectProductList")}</option>
							{lists.map((list) => (
								<option key={list.id} value={list.id}>
									{list.ten_vi}
								</option>
							))}
						</select>
					</div>
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
										tenkhongdau: convertToSlug(newTenVi),
									}));
								}}
								placeholder={t("name")}
								name="ten_vi"
								required
							/>
							<div>
								<InputArea
									title={t("description")}
									value={formData.description_vi}
									onChange={(e) =>
										setFormData({ ...formData, description_vi: e.target.value })
									}
									language={t("vn")}
									placeholder={t("description")}
									name="description_vi"
								/>
							</div>

							<InputSm
								title={t("title")}
								language={t("vn")}
								value={formData.title_vi}
								onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
									setFormData({ ...formData, title_vi: e.target.value })
								}
								placeholder={t("title")}
								name="title_vi"
							/>

							<InputSm
								title={t("keywords")}
								language={t("vn")}
								value={formData.keywords_vi}
								onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
									setFormData({ ...formData, keywords_vi: e.target.value })
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
									setFormData({ ...formData, ten_en: e.target.value })
								}
								placeholder={t("name")}
								name="ten_en"
							/>

							<div>
								<InputArea
									title={t("description")}
									value={formData.description_en}
									onChange={(e) =>
										setFormData({ ...formData, description_en: e.target.value })
									}
									language={t("en")}
									placeholder={t("description")}
									name="description_en"
								/>
							</div>

							<InputSm
								title={t("title")}
								language={t("en")}
								value={formData.title_en}
								onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
									setFormData({ ...formData, title_en: e.target.value })
								}
								placeholder={t("title")}
								name="title_en"
							/>

							<InputSm
								title={t("keywords")}
								language={t("en")}
								value={formData.keywords_en}
								onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
									setFormData({ ...formData, keywords_en: e.target.value })
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
							setFormData({ ...formData, tenkhongdau: e.target.value })
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
