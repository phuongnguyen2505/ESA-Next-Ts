"use client";

import AdminLayout from "@/app/[locale]/admin/components/layouts/AdminLayout";
import { useTranslations } from "next-intl";
import { useState, useEffect, use } from "react";
import axiosInstance from "@/lib/axios";
import Modal from "../../../components/Ui/ModalAlert";
import InputSm from "../../../components/Ui/InputSm";
import InputTextarea from "../../../components/Ui/InputArea";
import InputCKeditor from "../../../components/Ui/InputCKeditor";
import InputImage from "../../../components/Ui/InputImage";
import InputCheckbox from "../../../components/Ui/InputCheckbox";
import Button from "../../../components/Ui/Button";
import Select from "../../../components/Ui/Select";
import { Product } from "@/types/Product";
import { ProductList } from "@/types/productList";
import { ProductCat } from "@/types/productCat";
import { useRouter } from "next/navigation";
import UploadFile from "../../../components/Ui/UploadFile";

type EditProductForm = Omit<
	Product,
	| "id"
	| "id_item"
	| "list_ten_vi"
	| "cat_ten_vi"
	| "thumb"
	| "file"
	| "ngaytao"
	| "ngaysua"
	| "luotxem"
	| "tenkhongdau"
> & {
	file: File | string | null;
	tenkhongdau: string;
	gia: number;
	luotxem: number;
};

interface ProductResponse {
	product: Product;
}

export default function EditProduct({ params }: { params: Promise<{ id: string }> }) {
	const resolvedParams = use(params);
	const id = resolvedParams.id;
	const t = useTranslations("admin");
	const router = useRouter();
	const [formData, setFormData] = useState<EditProductForm>({
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
		file: null,
		stt: 1,
		hienthi: 1,
		noibat: 0,
		tags_en: "",
		tenkhongdau: "",
		title_vi: "",
		gia: 0,
		luotxem: 0,
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
	const [imagePreview, setImagePreview] = useState<string | null>(null);
	const [productLists, setProductLists] = useState<ProductList[]>([]);
	const [productCats, setProductCats] = useState<ProductCat[]>([]);
	const [filteredCats, setFilteredCats] = useState<ProductCat[]>([]);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const [listsRes, catsRes] = await Promise.all([
					axiosInstance.get<{ lists: ProductList[] }>("/api/productList"),
					axiosInstance.get<{ categories: ProductCat[] }>("/api/productCat"),
				]);
				setProductLists(listsRes.data.lists || []);
				setProductCats(catsRes.data.categories || []);
			} catch (error) {
				console.error("Error fetching data:", error);
				setProductLists([]);
				setProductCats([]);
			}
		};
		fetchData();
	}, []);

	useEffect(() => {
		const fetchProduct = async () => {
			if (!id) return; // Kiểm tra nếu id không tồn tại

			try {
				const response = await axiosInstance.get<ProductResponse>(
					`/api/products/${id}`,
				);
				const product = response.data.product;

				setFormData((prev) => ({
					...prev,
					id_list: product.id_list,
					id_cat: product.id_cat,
					ten_en: product.ten_en,
					masp: product.masp,
					mota_en: product.mota_en,
					noidung_en: product.noidung_en,
					title_en: product.title_en,
					keywords_en: product.keywords_en,
					description_en: product.description_en,
					photo: product.photo,
					file: product.file,
					stt: product.stt,
					hienthi: product.hienthi,
					noibat: product.noibat,
					tags_en: product.tags_en,
					tenkhongdau: product.tenkhongdau,
					title_vi: product.title_vi,
					gia: product.gia ?? 0,
					luotxem: product.luotxem ?? 0,
				}));

				if (product.photo) {
					setImagePreview(product.photo);
				}

				const filtered = productCats.filter(
					(cat) => Number(cat.id_list) === product.id_list,
				);
				setFilteredCats(filtered);
			} catch (error) {
				console.error("Error fetching product:", error);
				setModal({
					isOpen: true,
					message: t("messages.fetchError"),
					type: "error",
				});
			}
		};

		fetchProduct();
	}, [id, productCats, t]);

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

	useEffect(() => {
		return () => {
			if (imagePreview) {
				URL.revokeObjectURL(imagePreview);
			}
		};
	}, [imagePreview]);

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
			await axiosInstance.put(`/api/editProduct`, formDataToSend, {
				params: { id },
				headers: {
					"Content-Type": "multipart/form-data",
				},
			});

			setModal({
				isOpen: true,
				message: t("messages.updateSuccess"),
				type: "success",
			});

			router.push("/admin/products");
		} catch (error) {
			console.error("Error updating product:", error);
			setModal({
				isOpen: true,
				message: t("messages.updateFailed"),
				type: "error",
			});
		}
	};

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleEditorChange = (data: string, name: string) => {
		setFormData((prev) => ({
			...prev,
			[name]: data,
		}));
	};

	const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { checked } = e.target;
		setFormData((prev) => ({
			...prev,
			hienthi: checked ? 1 : 0,
		}));
	};

	const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: parseInt(value),
		}));
	};

	const handleFileUpload = (file: File | null) => {
		setFormData((prev) => ({
			...prev,
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
			tenkhongdau: newName.toLowerCase().replace(/\s+/g, "-"),
		}));
	};

	return (
		<AdminLayout pageName={t("editProduct")}>
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

					<InputSm
						title={t("productCode")}
						value={formData.masp}
						onChange={handleChange}
						name="masp"
						required
						placeholder={t("productCode")}
						disabled={true} // Nếu tự động gen thì không cho chỉnh sửa
					/>
				</div>

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
				</div>

				{/* Thêm trường Price & Views */}
				<div className="space-y-6">
					<InputSm
						title={t("price") + " (USD)"}
						name="gia"
						type="number"
						step="0.01"
						min="0"
						value={formData.gia.toString()}
						onChange={handleChange}
						required
					/>
				</div>

				<UploadFile
					title={t("uploadFile")}
					fileNames={formData.file ? [formData.file.toString()] : undefined}
					onFileUpload={handleFileUpload}
				/>

				<InputImage
					title={t("picture")}
					name="photo"
					onChange={handleImageUpload}
					imagePreview={imagePreview}
					currentImage={formData.photo}
					t={t}
				/>

				<InputSm
					title={t("url")}
					value={formData.tenkhongdau}
					onChange={(e) =>
						setFormData((prev) => ({ ...prev, tenkhongdau: e.target.value }))
					}
					name="tenkhongdau"
					placeholder={t("url")}
					disabled
				/>

				<InputCheckbox
					name="hienthi"
					checked={formData.hienthi === 1}
					onChange={handleCheckboxChange}
					label={t("show")}
					placeholder={t("show")}
				/>

				<div className="flex justify-end space-x-4">
					<Button
						type="button"
						onClick={handleBack}
						className="bg-gray-500 hover:bg-gray-600"
					>
						{t("back")}
					</Button>
					<Button type="submit" className="bg-green-600 hover:bg-green-700">
						{t("save")}
					</Button>
				</div>
			</form>
		</AdminLayout>
	);
}
