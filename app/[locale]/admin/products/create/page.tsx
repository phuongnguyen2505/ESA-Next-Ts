"use client";

import AdminLayout from "@/app/[locale]/admin/components/layouts/AdminLayout";
import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";
import axiosInstance from "@/lib/axios";
import Modal from "../../components/Ui/ModalAlert";
import InputSm from "../../components/Ui/InputSm";
import InputTextarea from "../../components/Ui/InputArea";
import InputCKeditor from "../../components/Ui/InputCKeditor";
import InputImage from "../../components/Ui/InputImage";
import InputCheckbox from "../../components/Ui/InputCheckbox";
import Button from "../../components/Ui/Button";
import Select from "../../components/Ui/Select";
import { Product } from "@/types/Product";
import { ProductList } from "@/types/productList";
import { ProductCat } from "@/types/productCat";
import { useRouter } from "next/navigation";
import UploadFile from "../../components/Ui/UploadFile";

type CreateProductForm = Omit<
	Product,
	| "id"
	| "id_item"
	| "list_ten_en"
	| "cat_ten_en"
	| "thumb"
	| "file"
	| "ngaytao"
	| "ngaysua"
	| "luotxem"
>;

export default function CreateProduct() {
	const t = useTranslations("admin");
	const router = useRouter();
	const [formData, setFormData] = useState<CreateProductForm>({
		id_list: 0,
		id_cat: 0,
		ten_en: "",
		masp: "",
		mota_en: "",
		noidung_en: "",
		title_en: "",
		keywords_en: "",
		description_en: "",
		photo: "",
		stt: 1,
		hienthi: 1,
		noibat: 0,
		tags_en: "",
		title_vi: "",
		tenkhongdau: "",
	});
	const [imageFile, setImageFile] = useState<File | null>(null);
	const [modal, setModal] = useState<{
		isOpen: boolean;
		message: string;
		type: "success" | "error";
	}>({
		isOpen: false,
		message: "",
		type: "success",
	});

	const [activeTab, setActiveTab] = useState<"en">("en");
	const [imagePreview, setImagePreview] = useState<string | null>(null);

	const [productLists, setProductLists] = useState<ProductList[]>([]);
	const [productCats, setProductCats] = useState<ProductCat[]>([]);
	const [filteredCats, setFilteredCats] = useState<ProductCat[]>([]);

	const [autoGenCode, setAutoGenCode] = useState<boolean>(true);

	const generateProductCode = async () => {
		try {
			if (!axiosInstance) {
				throw new Error("API connection not initialized");
			}

			const response = await axiosInstance.get<{ lastCode: string }>(
				"/api/products/lastCode",
			);

			if (!response || response.status !== 200) {
				throw new Error(`API error: ${response?.status}`);
			}

			const lastCode = response.data.lastCode;
			if (!lastCode) {
				console.log("No existing product code found");
				return "MH000001";
			}

			const matches = lastCode.match(/MH(\d+)/);
			if (!matches) {
				console.log("Invalid product code format");
				return "MH000001";
			}

			const currentNumber = parseInt(matches[1]);
			if (isNaN(currentNumber)) {
				console.log("Invalid number in product code");
				return "MH000001";
			}

			const nextNumber = currentNumber + 1;
			return `MH${String(nextNumber).padStart(6, "0")}`;
		} catch (error: any) {
			console.error("Product code generation error:", {
				name: error.name,
				message: error.message,
				status: error.response?.status,
				data: error.response?.data,
				stack: error.stack,
			});

			return "MH000001";
		}
	};

	useEffect(() => {
		let isMounted = true;

		const updateProductCode = async () => {
			if (!autoGenCode) return;

			try {
				const newCode = await generateProductCode();
				if (isMounted) {
					setFormData((prev) => ({
						...prev,
						masp: newCode,
					}));
				}
			} catch (error) {
				console.error("Failed to update product code:", error);
				if (isMounted) {
					setFormData((prev) => ({
						...prev,
						masp: "MH000001",
					}));
				}
			}
		};

		updateProductCode();

		return () => {
			isMounted = false;
		};
	}, [autoGenCode]);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const [listsRes, catsRes] = await Promise.all([
					axiosInstance.get<{ lists: Array<ProductList> }>("/api/productList"),
					axiosInstance.get<{ categories: Array<ProductCat> }>("/api/productCat"),
				]);

				setProductLists(listsRes.data.lists || []);
				setProductCats(catsRes.data.categories || []);

				console.log("Product Lists:", listsRes.data.lists);
				console.log("Product Categories:", catsRes.data.categories);
			} catch (error) {
				console.error("Error fetching data:", error);
				setProductLists([]);
				setProductCats([]);
			}
		};
		fetchData();
	}, []);

	const handleProductListChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const listId = parseInt(e.target.value);
		setFormData((prev) => ({
			...prev,
			id_list: listId,
			id_cat: 0,
		}));

		const filtered = productCats.filter((cat) => Number(cat.id_list) === listId);
		setFilteredCats(filtered);
	};

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
		const formDataToSend = new FormData();
		Object.entries(formData).forEach(([key, value]) => {
			formDataToSend.append(key, value as string);
		});
		if (imageFile) {
			formDataToSend.append("photo", imageFile);
		}

		try {
			await axiosInstance.post("/api/products", formDataToSend, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			});

			setModal({
				isOpen: true,
				message: t("messages.createSuccess"),
				type: "success",
			});

			router.push("/admin/products");
		} catch (error) {
			console.error("Error creating product:", error);
			setModal({
				isOpen: true,
				message: t("messages.createFailed"),
				type: "error",
			});
		}
	};

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
	) => {
		const { name, value } = e.target;
		setFormData((prev: typeof formData) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleEditorChange = (data: string, name: string) => {
		setFormData((prev: typeof formData) => ({
			...prev,
			[name]: data,
		}));
	};

	const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { checked } = e.target;
		setFormData((prev: typeof formData) => ({
			...prev,
			hienthi: checked ? 1 : 0,
		}));
	};

	const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const { name, value } = e.target;
		setFormData((prev: typeof formData) => ({
			...prev,
			[name]: parseInt(value),
		}));
	};

	const handleFileUpload = (file: File | null) => {
		setFormData((prevData) => ({
			...prevData,
			file: file,
		}));
	};

	const handleBack = () => {
		router.push("/admin/products");
	};

	const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newName = e.target.value;
		setFormData((prev) => ({
			...prev,
			ten_en: newName,
			tenkhongdau: newName.toLowerCase().replace(/\s+/g, '-'), // Tạo tenkhongdau tự động
		}));
	};

	return (
		<AdminLayout pageName={t("addProduct")}>
			<Modal
				isOpen={modal.isOpen}
				message={modal.message}
				type={modal.type}
				onClose={() => setModal((prev: typeof modal) => ({ ...prev, isOpen: false }))}
			/>
			<form
				onSubmit={handleSubmit}
				className="w-full mx-auto p-6 bg-white rounded-lg shadow-lg space-y-6 dark:bg-gray-800"
			>
				<div className="space-y-6 mb-6">
					<Select
						title={t("productList")}
						name="id_list"
						value={formData.id_list}
						onChange={handleProductListChange}
						required
					>
						<option value="">{t("selectProductList")}</option>
						{productLists.map((list) => (
							<option key={list.id} value={list.id.toString()}>
								{list.ten_en}
							</option>
						))}
					</Select>

					<Select
						title={t("productCat")}
						name="id_cat"
						value={formData.id_cat}
						onChange={handleSelectChange}
						required
						disabled={!formData.id_list}
					>
						<option value="">{t("selectCategory")}</option>
						{filteredCats.map((cat) => (
							<option key={cat.id} value={cat.id}>
								{cat.ten_en}
							</option>
						))}
					</Select>

					<div className="flex items-center space-x-4">
						<InputSm
							title={t("productCode")}
							value={formData.masp}
							onChange={handleChange}
							name="masp"
							required
							disabled={autoGenCode}
							placeholder={t("productCode")}
						/>
						<div className="flex items-center mt-6">
							<input
								type="checkbox"
								checked={autoGenCode}
								onChange={(e) => setAutoGenCode(e.target.checked)}
								className="mr-2"
								placeholder={t("autoGenerate")}
							/>
							<label>{t("autoGenerate")}</label>
						</div>
					</div>
				</div>

				<div className="block">
					<div className="space-y-6">
						<InputSm
							title={t("name")}
							value={formData.ten_en}
							onChange={handleNameChange}
							placeholder={t("name")}
							name="ten_en"
							required
						/>
						<InputTextarea
							title={t("description")}
							name="mota_en"
							placeholder={t("description")}
							value={formData.mota_en}
							onChange={handleChange}
						/>
						<InputCKeditor
							title={t("content")}
							value={formData.noidung_en}
							onChange={(data) => handleEditorChange(data, "noidung_en")}
						/>
						<InputSm
							title={t("title") + " SEO"}
							value={formData.title_en}
							onChange={handleChange}
							placeholder={t("title") + " SEO"}
							name="title_en"
						/>
						<InputSm
							title={t("keywords") + " SEO"}
							value={formData.keywords_en}
							onChange={handleChange}
							placeholder={t("keywords") + " SEO"}
							name="keywords_en"
						/>
						<InputTextarea
							title={t("description") + " SEO"}
							name="description_en"
							value={formData.description_en}
							onChange={handleChange}
							placeholder={t("description") + " SEO"}
						/>
						<InputSm
							title={t("tags")}
							value={formData.tags_en}
							onChange={handleChange}
							placeholder={t("tags")}
							name="tags_en"
						/>
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
					</div>
				</div>

				<UploadFile title={t('uploadFile')} onFileUpload={handleFileUpload} />

				<InputImage
					title={t("picture")}
					name="photo"
					onChange={handleImageUpload}
					imagePreview={imagePreview}
					currentImage={formData.photo}
					t={t}
				/>

				<InputCheckbox
					name="hienthi"
					checked={formData.hienthi === 1}
					onChange={handleCheckboxChange}
					label={t("show")}
					placeholder={t("show")}
				/>

				<div className="flex justify-end space-x-4">
					<Button type="submit">{t("save")}</Button>
					<Button
						type="button"
						onClick={handleBack}
						className="bg-gray-500 hover:bg-gray-600"
					>
						{t("back")}
					</Button>
				</div>
			</form>
		</AdminLayout>
	);
}
