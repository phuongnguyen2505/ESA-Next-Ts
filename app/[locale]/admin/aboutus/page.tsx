"use client";

import AdminLayout from "@/app/[locale]/admin/components/layouts/AdminLayout";
import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";
import axios from "axios";

import "ckeditor5/ckeditor5.css";
import "ckeditor5-premium-features/ckeditor5-premium-features.css";
import MyUploadAdapter from "@/pages/api/myUploadAdapter";
import InputSm from "../components/Ui/InputSm";
import InputCKeditor from "../components/Ui/InputCKeditor";
import InputTextarea from "../components/Ui/InputArea";
import LanguageTabs from "../components/Ui/LanguageTabs";
import InputImage from "../components/Ui/InputImage";
import Button from "../components/Ui/Button";
import InputCheckbox from "../components/Ui/InputCheckbox";
import Modal from "../components/Ui/ModalAlert";

function removeAccents(str: string) {
	return str
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "")
		.replace(/đ/g, "d")
		.replace(/Đ/g, "D");
}

// Thêm function để khởi tạo upload adapter
function uploadPlugin(editor: any) {
	editor.plugins.get("FileRepository").createUploadAdapter = (loader: any) => {
		return new MyUploadAdapter(loader);
	};
}

// Cập nhật cấu hình editor
const editorConfig = {
	toolbar: [
		"heading",
		"|",
		"bold",
		"italic",
		"link",
		"bulletedList",
		"numberedList",
		"|",
		"imageUpload",
		"blockQuote",
		"insertTable",
		"mediaEmbed",
		"undo",
		"redo",
	],
	extraPlugins: [uploadPlugin],
};

export default function AboutUs() {
	const t = useTranslations("admin");
	const [abouts, setAbouts] = useState<any>({
		ten_vi: "",
		mota_vi: "",
		noidung_vi: "",
		title_vi: "",
		keywords_vi: "",
		description_vi: "",
		ten_en: "",
		mota_en: "",
		noidung_en: "",
		title_en: "",
		keywords_en: "",
		description_en: "",
		photo: null,
		hienthi: 0,
	});
	const [imageFile, setImageFile] = useState<File | null>(null);
	const [modal, setModal] = useState<{
		isOpen: boolean;
		message: string;
		type: "success" | "error";
	}>({
		isOpen: false,
		message: "",
		type: "success"
	});

	useEffect(() => {
		async function fetchData() {
			try {
				const response = await fetch("/api/abouts");
				const data = await response.json();
				setAbouts(data);
			} catch (error) {
				console.error("Error fetching about:", error);
			}
		}
		fetchData();
	}, []);

	// Thêm useEffect để set imagePreview khi có ảnh từ server
	useEffect(() => {
		if (abouts.photo) {
			setImagePreview(abouts.photo);
		}
	}, [abouts.photo]);

	const [activeTab, setActiveTab] = useState<"vi" | "en">("vi");
	const [imagePreview, setImagePreview] = useState<string | null>(null);
	const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			setImageFile(file);
			const previewUrl = URL.createObjectURL(file);
			setImagePreview(previewUrl);
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		const formData = new FormData();
		Object.entries(abouts).forEach(([key, value]) => {
			formData.append(key, value as string);
		});
		if (imageFile) {
			formData.append("photo", imageFile);
		}

		try {
			await axios.post('/api/saveAbout', formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			});
			
			setModal({
				isOpen: true,
				message: t("messages.updateSuccess"),
				type: "success"
			});
		} catch (error) {
			console.error('Lỗi khi cập nhật:', error);
			setModal({
				isOpen: true,
				message: t("messages.updateFailed"),
				type: "error"
			});
		}
	};

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
	) => {
		const { name, value } = e.target;
		setAbouts((prev: any) => ({
			...prev,
			[name]: value,
			tenkhongdau: name === "ten_vi" ? removeAccents(value) : prev.tenkhongdau,
		}));
	};

	const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { checked } = e.target;
		setAbouts((prev: any) => ({
			...prev,
			hienthi: checked ? 1 : 0,
		}));
	};

	return (
		<AdminLayout pageName={t("aboutus")}>
			<Modal
				isOpen={modal.isOpen}
				message={modal.message}
				type={modal.type}
				onClose={() => setModal(prev => ({ ...prev, isOpen: false }))}
			/>
				<form
					onSubmit={handleSubmit}
					className="w-full mx-auto p-6 bg-white rounded-lg shadow-lg space-y-6 dark:bg-gray-800"
				>
					{/* Language Tabs */}
					<LanguageTabs activeTab={activeTab} onTabChange={setActiveTab} t={t} />
					{/* Content based on active tab */}
					<div className={activeTab === "vi" ? "block" : "hidden"}>
						{/* Vietnamese Content */}
						<div className="space-y-6">
							<div>
								<InputSm
									title={t("name")}
									value={abouts.ten_vi}
									onChange={handleChange}
									language={t("vn")}
									placeholder={t("name")}
									name="ten_vi"
									required
								/>
							</div>
							<div>
								<InputTextarea
									title={t("description")}
									name="mota_vi"
									value={abouts.mota_vi}
									onChange={handleChange}
									language={t("vn")}
									placeholder={t("description")}
								/>
							</div>
							<div>
								<InputCKeditor
									title={t("content")}
									value={abouts.noidung_vi}
									onChange={(data) =>
										setAbouts((prev: any) => ({
											...prev,
											noidung_vi: data,
										}))
									}
									language={t("vn")}
									editorConfig={editorConfig}
								/>
							</div>
							<div className="space-y-4">
								<div>
									<InputSm
										title={t("title") + " SEO"}
										value={abouts.title_vi}
										onChange={handleChange}
										placeholder={t("title") + " SEO"}
										name="title_vi"
									/>
								</div>
								<div>
									<InputSm
										title={t("keywords") + " SEO"}
										value={abouts.keywords_vi}
										onChange={handleChange}
										placeholder={t("keywords") + " SEO"}
										name="keywords_vi"
									/>
								</div>
								<div>
									<InputTextarea
										title={t("description") + " SEO"}
										name="description_vi"
										value={abouts.description_vi}
										onChange={handleChange}
										language={t("vn")}
										placeholder={t("description") + " SEO"}
									/>
								</div>
							</div>
						</div>
					</div>

					{/* English Content */}
					<div className={activeTab === "en" ? "block" : "hidden"}>
						<div className="space-y-6">
							<div>
								<InputSm
									title={t("name")}
									language={t("en")}
									value={abouts.ten_en}
									onChange={handleChange}
									placeholder={t("name")}
									name="ten_en"
									required
								/>
							</div>

							<div>
								<InputTextarea
									title={t("description")}
									name="mota_en"
									placeholder={t("description")}
									value={abouts.mota_en}
									onChange={handleChange}
									language={t("en")}
								/>
							</div>

							<div>
								<InputCKeditor
									title={t("content")}
									value={abouts.noidung_en}
									onChange={(data) =>
										setAbouts((prev: any) => ({
											...prev,
											noidung_en: data,
										}))
									}
									language={t("en")}
									editorConfig={editorConfig}
								/>
							</div>

							<div className="space-y-4">
								<div>
									<InputSm
										title={t("title") + " SEO"}
										language={t("en")}
										value={abouts.title_en}
										onChange={handleChange}
										placeholder={t("title") + " SEO"}
										name="title_en"
									/>
								</div>
								<div>
									<InputSm
										title={t("keywords") + " SEO"}
										language={t("en")}
										value={abouts.keywords_en}
										onChange={handleChange}
										placeholder={t("keywords") + " SEO"}
										name="keywords_en"
									/>
								</div>
								<div>
									<InputTextarea
										title={t("description") + " SEO"}
										name="description_en"
										value={abouts.description_en}
										onChange={handleChange}
										language={t("en")}
										placeholder={t("description") + " SEO"}
									/>
								</div>
							</div>
						</div>
					</div>

					{/* Hình ảnh */}
					<div className="space-y-4">
						<InputImage
							title={t("picture")}
							name="photo"
							onChange={handleImageUpload}
							imagePreview={imagePreview}
							currentImage={abouts.photo}
							t={t}
							required
						/>
					</div>

					{/* Hiển thị */}
					<div className="flex items-center space-x-2">
						<InputCheckbox
							name="hienthi"
							checked={abouts.hienthi === 1}
							onChange={handleCheckboxChange}
							label={t("show")}
							placeholder={t("show")}
						/>
					</div>

					{/* Buttons */}
					<div className="flex justify-end space-x-4">
						<Button type="submit">{t("save")}</Button>
					</div>
				</form>
		</AdminLayout>
	);
}
