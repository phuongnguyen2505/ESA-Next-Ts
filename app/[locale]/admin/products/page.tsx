"use client";

import AdminLayout from "@/app/[locale]/admin/components/layouts/AdminLayout";
import { useTranslations } from "next-intl";
import { useState, useEffect, useCallback } from "react";
import axiosInstance from "@/lib/axios";
import Modal from "../components/Ui/ModalAlert";
import Button from "../components/Ui/Button";
import Image from "next/image";
import Link from "next/link";
import { BiEdit, BiTrash } from "react-icons/bi";
import { FaCheck, FaFolderPlus, FaTimes, FaPlus } from "react-icons/fa";
import { RiPlayListAddFill } from "react-icons/ri";
import { Product } from "@/types/Product";
import { ProductList } from "@/types/productList";
import { ProductCat } from "@/types/productCat";
import SortSelect from "@/app/[locale]/admin/components/Ui/SortSelect";

interface ProductMenuItem {
	translationKey: string;
	sortable?: boolean;
}

const truncateText = (text: string, maxLength: number = 20) => {
	if (text.length <= maxLength) return text;
	return text.slice(0, maxLength) + "...";
};

interface ProductListResponse {
	lists: ProductList[];
}
interface ProductCategoriesResponse {
	categories: any[];
}

interface ApiResponse {
	success: boolean;
	message: string;
	data?: any;
}

const PRODUCT_LIST_MENU_ITEMS: ProductMenuItem[] = [
	{ translationKey: "name" },
	{ translationKey: "description" },
	{ translationKey: "featured", sortable: true },
	{ translationKey: "status" },
	{ translationKey: "actions" },
];

const PRODUCT_MENU_ITEMS: ProductMenuItem[] = [
	{ translationKey: "picture" },
	{ translationKey: "productCode" },
	{ translationKey: "name" },
	{ translationKey: "category" },
	{ translationKey: "productLine" },
	{ translationKey: "featured", sortable: true },
	{ translationKey: "topProduct", sortable: true },
	{ translationKey: "status" },
	{ translationKey: "actions" },
];

const PRODUCT_CATEGORY_MENU_ITEMS: ProductMenuItem[] = [
	{ translationKey: "name" },
	{ translationKey: "category" },
	{ translationKey: "featured", sortable: true },
	{ translationKey: "status" },
	{ translationKey: "actions" },
];

// Thêm interface cho sorting
interface SortConfig {
	key: string;
	direction: "asc" | "desc";
}

export default function Products() {
	const t = useTranslations("admin");
	const [products, setProducts] = useState<Product[]>([]);
	const [modal, setModal] = useState<{
		isOpen: boolean;
		message: string;
		type: "success" | "error";
	}>({
		isOpen: false,
		message: "",
		type: "success",
	});
	const [activeTab, setActiveTab] = useState<"products" | "lists" | "categories">(
		"products",
	);
	const [lists, setLists] = useState<ProductList[]>([]);
	const [categories, setCategories] = useState<ProductCat[]>([]);
	const [deleteConfirm, setDeleteConfirm] = useState<{
		isOpen: boolean;
		id: number | null;
	}>({
		isOpen: false,
		id: null,
	});
	const [isLoading, setIsLoading] = useState(false);
	const [updatingItems, setUpdatingItems] = useState<{ [key: string]: boolean }>({});
	const [sortBy, setSortBy] = useState("newest");
	const [sortConfig, setSortConfig] = useState<SortConfig>({
		key: "ngaytao",
		direction: "desc",
	});

	const handleToggleStatus = async (
		id: number,
		currentStatus: number,
		type: "products" | "lists" | "categories" = "products",
		field: "sptb" | "hienthi" | "noibat" = "hienthi",
	) => {
		const itemKey = `${type}-${id}-${field}`;

		try {
			setUpdatingItems((prev) => ({ ...prev, [itemKey]: true }));

			console.log("Current state:", {
				id,
				currentStatus,
				type,
				field,
			});

			const newStatus = currentStatus ? 0 : 1;

			const endpoints = {
				products: `/api/products/${id}`,
				lists: `/api/productList/${id}`,
				categories: `/api/productCat/${id}`,
			};

			console.log("Sending request:", {
				url: endpoints[type],
				method: "PATCH",
				data: { [field]: newStatus },
			});

			const response = await axiosInstance.patch<ApiResponse>(endpoints[type], {
				[field]: newStatus,
			});

			console.log("Response:", response.data);

			if (response.data.success) {
				const updateState = {
					products: setProducts,
					lists: setLists,
					categories: setCategories,
				};

				updateState[type]((prevItems: any[]) =>
					prevItems.map((item) =>
						item.id === id ? { ...item, [field]: newStatus } : item,
					),
				);

				setModal({
					isOpen: true,
					message: t("messages.updateSuccess"),
					type: "success",
				});
			}
		} catch (error: any) {
			console.error("Error details:", error.response?.data);

			setModal({
				isOpen: true,
				message: error.response?.data?.error || t("messages.updateFailed"),
				type: "error",
			});
		} finally {
			setUpdatingItems((prev) => ({ ...prev, [itemKey]: false }));
		}
	};

	const fetchData = useCallback(
		async (type: "products" | "lists" | "categories") => {
			setIsLoading(true);
			try {
				let endpoint = "";
				switch (type) {
					case "products":
						endpoint = "/api/products";
						const productRes = await axiosInstance.get<{ products: Product[] }>(
							endpoint,
						);
						setProducts(productRes.data.products);
						break;
					case "lists":
						endpoint = "/api/productList";
						const listRes = await axiosInstance.get<ProductListResponse>(endpoint);
						setLists(listRes.data.lists);
						break;
					case "categories":
						endpoint = "/api/productCat";
						const catRes = await axiosInstance.get<ProductCategoriesResponse>(
							endpoint,
						);
						setCategories(catRes.data.categories);
						break;
				}
			} catch (error) {
				console.error(`Error fetching ${type}:`, error);
				setModal({
					isOpen: true,
					message: t("messages.loadFailed") || "Lỗi khi tải dữ liệu",
					type: "error",
				});
			} finally {
				setIsLoading(false);
			}
		},
		[t],
	);

	useEffect(() => {
		if (activeTab === "products") {
			fetchData("products");
		} else if (activeTab === "lists") {
			fetchData("lists");
		} else if (activeTab === "categories") {
			Promise.all([fetchData("lists"), fetchData("categories")]);
		}
	}, [activeTab, fetchData]);

	const showDeleteConfirm = (id: number) => {
		setDeleteConfirm({
			isOpen: true,
			id: id,
		});
	};

	const confirmDelete = async () => {
		if (!deleteConfirm.id) return;

		try {
			let endpoint = "";
			if (activeTab === "products") {
				endpoint = `/api/productDelete?id=${deleteConfirm.id}`;
			} else if (activeTab === "lists") {
				endpoint = `/api/productList?id=${deleteConfirm.id}`;
			} else if (activeTab === "categories") {
				endpoint = `/api/productCat?id=${deleteConfirm.id}`;
			}

			await axiosInstance.delete(endpoint);
			setModal({
				isOpen: true,
				message: t("messages.deleteSuccess"),
				type: "success",
			});

			if (activeTab === "products") {
				fetchData("products");
			} else if (activeTab === "lists") {
				fetchData("lists");
			} else if (activeTab === "categories") {
				fetchData("categories");
			}
		} catch (error) {
			console.error("Error deleting item:", error);
			setModal({
				isOpen: true,
				message: t("messages.deleteFailed") || "Lỗi khi xóa dữ liệu",
				type: "error",
			});
		} finally {
			setDeleteConfirm({ isOpen: false, id: null });
		}
	};

	const getImageUrl = (photo: string | null) => {
		if (!photo) return "/no-image.png";
		if (photo.startsWith("http")) return photo;

		try {
			return `/uploads/products/${photo}`;
		} catch {
			return "/no-image.png";
		}
	};

	// Hàm xử lý sort
	const handleSort = (key: string) => {
		setSortConfig((prev) => ({
			key,
			direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
		}));
	};

	// Hàm render sort icon
	const renderSortIcon = (key: string) => {
		if (sortConfig.key !== key) {
			return <span className="ml-1 text-gray-400">↕</span>;
		}
		return sortConfig.direction === "asc" ? (
			<span className="ml-1">↑</span>
		) : (
			<span className="ml-1">↓</span>
		);
	};

	// Hàm sort items
	const sortItems = (items: any[]) => {
		const sorted = [...items];
		return sorted.sort((a, b) => {
			if (sortConfig.key === "ngaytao") {
				const result = new Date(a.ngaytao).getTime() - new Date(b.ngaytao).getTime();
				return sortConfig.direction === "asc" ? result : -result;
			}
			if (sortConfig.key === "ten_en") {
				const result = a.ten_en.localeCompare(b.ten_en);
				return sortConfig.direction === "asc" ? result : -result;
			}
			if (sortConfig.key === "stt") {
				return sortConfig.direction === "asc" ? a.stt - b.stt : b.stt - a.stt;
			}
			if (sortConfig.key === "mota_en") {
				const result = (a.mota_en || "").localeCompare(b.mota_en || "");
				return sortConfig.direction === "asc" ? result : -result;
			}
			if (sortConfig.key === "id_list") {
				const aName = lists.find((l) => l.id === a.id_list)?.ten_en || "";
				const bName = lists.find((l) => l.id === b.id_list)?.ten_en || "";
				const result = aName.localeCompare(bName);
				return sortConfig.direction === "asc" ? result : -result;
			}
			if (sortConfig.key === "noibat") {
				return sortConfig.direction === "asc"
					? a.noibat - b.noibat
					: b.noibat - a.noibat;
			}
			if (sortConfig.key === "sptb") {
				return sortConfig.direction === "asc"
					? a.sptb - b.sptb
					: b.sptb - a.sptb;
			}
			return 0;
		});
	};

	return (
		<AdminLayout pageName={t("products")}>
			<Modal
				isOpen={modal.isOpen}
				message={modal.message}
				type={modal.type}
				onClose={() => setModal((prev) => ({ ...prev, isOpen: false }))}
			/>

			<Modal
				isOpen={deleteConfirm.isOpen}
				message={t("confirmDelete")}
				type="warning"
				onClose={() => setDeleteConfirm({ isOpen: false, id: null })}
				showConfirmButton={true}
				onConfirm={confirmDelete}
			/>

			<div className="w-full px-4 py-6 space-y-6">
				<div className="flex justify-between items-center mb-4">
					<h2 className="text-xl font-bold">{t("productList")}</h2>
					<div className="space-x-2 flex items-center gap-1">
						<Link href="/admin/products/create">
							<Button type="button">
								<FaPlus className="h-5 w-5" />
							</Button>
						</Link>
						<Link href="/admin/products/createList">
							<Button type="button">
								<RiPlayListAddFill className="h-5 w-5" />
							</Button>
						</Link>
						<Link href="/admin/products/createCat">
							<Button type="button">
								<FaFolderPlus className="h-5 w-5" />
							</Button>
						</Link>
						<SortSelect value={sortBy} onChange={setSortBy} t={t} />
					</div>
				</div>

				<div className="border-b border-gray-200">
					<nav className="-mb-px flex space-x-8">
						<button
							onClick={() => setActiveTab("products")}
							className={`${
								activeTab === "products"
									? "border-indigo-500 text-indigo-600"
									: "border-transparent text-gray-500 dark:text-gray-300 hover:text-gray-700 hover:border-gray-300"
							} whitespace-nowrap py-4 px-1 border-b-2 font-bold text-sm uppercase`}
						>
							{t("products")}
						</button>
						<button
							onClick={() => setActiveTab("lists")}
							className={`${
								activeTab === "lists"
									? "border-indigo-500 text-indigo-600"
									: "border-transparent text-gray-500 dark:text-gray-300 hover:text-gray-700 hover:border-gray-300"
							} whitespace-nowrap py-4 px-1 border-b-2 font-bold text-sm uppercase`}
						>
							{t("category")}
						</button>
						<button
							onClick={() => setActiveTab("categories")}
							className={`${
								activeTab === "categories"
									? "border-indigo-500 text-indigo-600"
									: "border-transparent text-gray-500 dark:text-gray-300 hover:text-gray-700 hover:border-gray-300"
							} whitespace-nowrap py-4 px-1 border-b-2 font-bold text-sm uppercase`}
						>
							{t("productLine")}
						</button>
					</nav>
				</div>

				{activeTab === "products" && (
					<div className="overflow-x-auto">
						<table className="min-w-full bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
							<thead className="bg-gray-100 dark:bg-gray-700">
								<tr>
									{PRODUCT_MENU_ITEMS.map((item) => (
										<th
											key={item.translationKey}
											className={`px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider ${
												item.sortable ||
												["name", "description", "productGroup"].includes(
													item.translationKey,
												)
													? "cursor-pointer hover:bg-gray-200"
													: ""
											}`}
											onClick={() => {
												if (item.translationKey === "name")
													handleSort("ten_en");
												if (item.translationKey === "description")
													handleSort("mota_en");
												if (item.translationKey === "productGroup")
													handleSort("id_list");
												if (item.translationKey === "featured")
													handleSort("noibat");
												if (item.translationKey === "topProduct")
													handleSort("sptb");
											}}
										>
											<div className="flex items-center justify-center">
												{t(item.translationKey)}
												{(item.sortable ||
													["name", "description", "productGroup"].includes(
														item.translationKey,
													)) &&
													renderSortIcon(
														item.translationKey === "name"
															? "ten_en"
															: item.translationKey === "description"
															? "mota_en"
															: item.translationKey === "productGroup"
															? "id_list"
															: item.translationKey === "featured"
															? "noibat"
															: item.translationKey === "topProduct"
															? "sptb"
															: "",
													)}
											</div>
										</th>
									))}
								</tr>
							</thead>
							<tbody className="divide-y divide-gray-200 dark:divide-gray-600 text-center">
								{sortItems(products).map((product) => (
									<tr key={product.id}>
										<td className="px-6 py-4 whitespace-nowrap">
											<img
												src={getImageUrl(product.photo)}
												alt={product.ten_en}
												width={100}
												height={100}
												className="object-cover rounded"
												loading="lazy"
												onError={(e) => {
													e.currentTarget.src = "/no-image.png";
												}}
											/>
										</td>
										<td className="px-6 py-4 whitespace-nowrap">
											{product.masp}
										</td>
										<td className="px-6 py-4 whitespace-nowrap">
											<div className="max-w-xs" title={product.ten_en}>
												{truncateText(product.ten_en)}
											</div>
										</td>
										<td className="px-6 py-4 whitespace-nowrap">
											{truncateText(product.list_ten_en ?? "-")}
										</td>
										<td className="px-6 py-4 whitespace-nowrap">
											{truncateText(product.cat_ten_en ?? "-")}
										</td>
										<td className="px-6 py-4 whitespace-nowrap">
											<button
												onClick={() =>
													handleToggleStatus(
														product.id,
														product.noibat,
														"products",
														"noibat",
													)
												}
												className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
													product.noibat
														? "bg-yellow-100 text-yellow-800"
														: "bg-gray-100 text-gray-800"
												}`}
											>
												{product.noibat ? t("featured") : t("normal")}
											</button>
										</td>
										<td className="px-6 py-4 whitespace-nowrap">
											<button
												onClick={() =>
													handleToggleStatus(
														product.id,
														product.sptb,
														"products",
														"sptb",
													)
												}
												className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
													product.sptb
														? "bg-blue-100 text-blue-800"
														: "bg-gray-100 text-gray-800"
												}`}
											>
												{product.sptb ? t("topProduct") : t("normal")}
											</button>
										</td>

										<td className="px-6 py-4 whitespace-nowrap">
											<div className="flex items-center justify-center">
												<button
													onClick={() =>
														handleToggleStatus(
															product.id,
															product.hienthi,
															"products",
															"hienthi",
														)
													}
													disabled={
														updatingItems[`products-${product.id}-hienthi`]
													}
													className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full cursor-pointer transition-colors duration-200 ${
														product.hienthi
															? "bg-green-100 text-green-800 hover:bg-green-200"
															: "bg-red-100 text-red-800 hover:bg-red-200"
													} ${
														updatingItems[`products-${product.id}-hienthi`]
															? "opacity-50 cursor-not-allowed"
															: ""
													}`}
													title={product.hienthi ? t("show") : t("hide")}
												>
													{product.hienthi ? (
														<FaCheck className="h-4 w-4" />
													) : (
														<FaTimes className="h-4 w-4" />
													)}
												</button>
											</div>
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
											<div className="flex items-center justify-center">
												<Link
													href={`/admin/products/editProduct/${product.id}`}
													className="text-indigo-600 hover:text-indigo-900 mr-4 inline-block"
													title={t("edit")}
												>
													<BiEdit className="h-5 w-5" />
												</Link>
												<button
													onClick={() => showDeleteConfirm(product.id)}
													className="text-red-600 hover:text-red-900 inline-block"
													title={t("delete")}
												>
													<BiTrash className="h-5 w-5" />
												</button>
											</div>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}

				{activeTab === "lists" && (
					<div className="overflow-x-auto">
						<table className="min-w-full bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
							<thead className="bg-gray-100 dark:bg-gray-700">
								<tr>
									{PRODUCT_LIST_MENU_ITEMS.map((item) => (
										<th
											key={item.translationKey}
											className={`px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider ${
												item.sortable ||
												["name", "description", "productGroup"].includes(
													item.translationKey,
												)
													? "cursor-pointer hover:bg-gray-200"
													: ""
											}`}
											onClick={() => {
												if (item.translationKey === "name")
													handleSort("ten_en");
												if (item.translationKey === "description")
													handleSort("mota_en");
												if (item.translationKey === "productGroup")
													handleSort("id_list");
												if (item.translationKey === "featured")
													handleSort("noibat");
											}}
										>
											<div className="flex items-center justify-center">
												{t(item.translationKey)}
												{(item.sortable ||
													["name", "description", "productGroup"].includes(
														item.translationKey,
													)) &&
													renderSortIcon(
														item.translationKey === "name"
															? "ten_en"
															: item.translationKey === "description"
															? "mota_en"
															: item.translationKey === "productGroup"
															? "id_list"
															: item.translationKey === "featured"
															? "noibat"
															: "",
													)}
											</div>
										</th>
									))}
								</tr>
							</thead>
							<tbody className="divide-y divide-gray-200 dark:divide-gray-600 text-center">
								{sortItems(lists).map((list) => (
									<tr key={list.id}>
										<td className="px-6 py-4 whitespace-nowrap">
											{list.ten_en}
										</td>
										<td className="px-6 py-4 whitespace-nowrap">
											<div className="max-w-xs" title={list.mota_en}>
												{truncateText(list.mota_en || "-", 50)}
											</div>
										</td>
										<td className="px-6 py-4 whitespace-nowrap">
											<button
												onClick={() =>
													handleToggleStatus(
														list.id,
														list.noibat,
														"lists",
														"noibat",
													)
												}
												className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
													list.noibat
														? "bg-yellow-100 text-yellow-800"
														: "bg-gray-100 text-gray-800"
												}`}
											>
												{list.noibat ? t("featured") : t("normal")}
											</button>
										</td>
										<td className="px-6 py-4 whitespace-nowrap">
											<div className="flex items-center justify-center">
												<button
													onClick={() =>
														handleToggleStatus(
															list.id,
															list.hienthi,
															"lists",
															"hienthi",
														)
													}
													className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
														list.hienthi
															? "bg-green-100 text-green-800"
															: "bg-red-100 text-red-800"
													}`}
												>
													{list.hienthi ? (
														<FaCheck className="h-4 w-4" />
													) : (
														<FaTimes className="h-4 w-4" />
													)}
												</button>
											</div>
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
											<div className="flex items-center justify-center">
												<Link
													href={`/admin/products/editList/${list.id}`}
													className="text-indigo-600 hover:text-indigo-900 mr-4 inline-block"
													title={t("edit")}
												>
													<BiEdit className="h-5 w-5" />
												</Link>
												<button
													onClick={() => showDeleteConfirm(list.id)}
													className="text-red-600 hover:text-red-900 inline-block"
													title={t("delete")}
												>
													<BiTrash className="h-5 w-5" />
												</button>
											</div>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}

				{activeTab === "categories" && (
					<div className="overflow-x-auto">
						<table className="min-w-full bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
							<thead className="bg-gray-100 dark:bg-gray-700">
								<tr>
									{PRODUCT_CATEGORY_MENU_ITEMS.map((item) => (
										<th
											key={item.translationKey}
											className={`px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider ${
												item.sortable ||
												["name", "productGroup"].includes(item.translationKey)
													? "cursor-pointer hover:bg-gray-200"
													: ""
											}`}
											onClick={() => {
												if (item.translationKey === "name")
													handleSort("ten_en");
												if (item.translationKey === "productGroup")
													handleSort("id_list");
												if (item.translationKey === "featured")
													handleSort("noibat");
											}}
										>
											<div className="flex items-center justify-center">
												{t(item.translationKey)}
												{(item.sortable ||
													["name", "productGroup"].includes(
														item.translationKey,
													)) &&
													renderSortIcon(
														item.translationKey === "name"
															? "ten_en"
															: item.translationKey === "productGroup"
															? "id_list"
															: item.translationKey === "featured"
															? "noibat"
															: "",
													)}
											</div>
										</th>
									))}
								</tr>
							</thead>
							<tbody className="divide-y divide-gray-200 dark:divide-gray-600 text-center">
								{sortItems(categories).map((category) => (
									<tr key={category.id}>
										<td className="px-6 py-4 whitespace-nowrap">
											{category.ten_en}
										</td>
										<td className="px-6 py-4 whitespace-nowrap">
											{lists.find((list) => list.id === category.id_list)
												?.ten_en || "-"}
										</td>
										<td className="px-6 py-4 whitespace-nowrap">
											<button
												onClick={() =>
													handleToggleStatus(
														category.id,
														category.noibat,
														"categories",
														"noibat",
													)
												}
												className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
													category.noibat
														? "bg-yellow-100 text-yellow-800"
														: "bg-gray-100 text-gray-800"
												}`}
											>
												{category.noibat ? t("featured") : t("normal")}
											</button>
										</td>
										<td className="px-6 py-4 whitespace-nowrap">
											<div className="flex items-center justify-center">
												<button
													onClick={() =>
														handleToggleStatus(
															category.id,
															category.hienthi,
															"categories",
															"hienthi",
														)
													}
													className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full cursor-pointer transition-colors duration-200 ${
														category.hienthi
															? "bg-green-100 text-green-800 hover:bg-green-200"
															: "bg-red-100 text-red-800 hover:bg-red-200"
													}`}
													title={category.hienthi ? t("show") : t("hide")}
												>
													{category.hienthi ? (
														<FaCheck className="h-4 w-4" />
													) : (
														<FaTimes className="h-4 w-4" />
													)}
												</button>
											</div>
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
											<div className="flex items-center justify-center">
												<Link
													href={`/admin/products/editCat/${category.id}`}
													className="text-indigo-600 hover:text-indigo-900 mr-4 inline-block"
													title={t("edit")}
												>
													<BiEdit className="h-5 w-5" />
												</Link>
												<button
													onClick={() => showDeleteConfirm(category.id)}
													className="text-red-600 hover:text-red-900 inline-block"
													title={t("delete")}
												>
													<BiTrash className="h-5 w-5" />
												</button>
											</div>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}
			</div>

			{isLoading && (
				<div className="flex justify-center items-center py-4">
					<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
				</div>
			)}
		</AdminLayout>
	);
}
