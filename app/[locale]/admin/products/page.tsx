"use client";

import AdminLayout from "@/app/[locale]/admin/components/layouts/AdminLayout";
import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";
import axiosInstance from "@/lib/axios";
import Modal from "../components/Ui/ModalAlert";
import Button from "../components/Ui/Button";
import Image from "next/image";
import Link from "next/link";
import { BiEdit, BiListPlus, BiTrash } from "react-icons/bi";
import { FaCheck, FaFolderPlus, FaTimes } from "react-icons/fa";
import { IoAddCircleOutline } from "react-icons/io5";
import { Product } from "@/types/Product";

// Thêm hàm helper (đặt ở đầu file, ngoài component)
const truncateText = (text: string, maxLength: number = 20) => {
	if (text.length <= maxLength) return text;
	return text.slice(0, maxLength) + "...";
};

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

	const handleToggleStatus = async (id: number, currentStatus: number) => {
		try {
			await axiosInstance.patch(`/api/products/${id}`, {
				hienthi: currentStatus ? 0 : 1,
			});

			setProducts(
				products.map((product) =>
					product.id === id
						? { ...product, hienthi: currentStatus ? 0 : 1 }
						: product,
				),
			);

			setModal({
				isOpen: true,
				message: t("messages.updateSuccess"),
				type: "success",
			});
		} catch (error) {
			console.error("Error toggling status:", error);
			setModal({
				isOpen: true,
				message: t("messages.updateFailed"),
				type: "error",
			});
		}
	};
	useEffect(() => {
		fetchProducts();
	}, []);

	const fetchProducts = async () => {
		try {
			const response = await axiosInstance.get<{ products: Product[] }>(
				"/api/products",
			);
			setProducts(response.data.products);
		} catch (error) {
			console.error("Error fetching products:", error);
			setModal({
				isOpen: true,
				message: "Lỗi khi tải danh sách sản phẩm",
				type: "error",
			});
		}
	};

	const handleDelete = async (id: number) => {
		try {
			await axiosInstance.delete(`/api/products/${id}`);
			setModal({
				isOpen: true,
				message: t("messages.deleteSuccess"),
				type: "success",
			});
			fetchProducts();
		} catch (error) {
			console.error("Error fetching products:", error);
			setModal({
				isOpen: true,
				message: t("messages.deleteFailed"),
				type: "error",
			});
		}
	};

	return (
		<AdminLayout pageName={t("products")}>
			<Modal
				isOpen={modal.isOpen}
				message={modal.message}
				type={modal.type}
				onClose={() => setModal((prev) => ({ ...prev, isOpen: false }))}
			/>

			<div className="w-full px-4 py-6 space-y-6">
				<div className="flex justify-between items-center">
					<h2 className="text-xl font-bold">{t("productList")}</h2>
					<div className="space-x-2">
						<Button type="button">
							<BiListPlus className="h-5 w-5" />
						</Button>
						<Button type="button">
							<FaFolderPlus className="h-5 w-5" />
						</Button>
						<Button type="button">
							<IoAddCircleOutline className="h-5 w-5" />
						</Button>
					</div>
				</div>

				<div className="overflow-x-auto">
					<table className="min-w-full bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
						<thead className="bg-gray-100 dark:bg-gray-700">
							<tr>
								<th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
									{t("picture")}
								</th>
								<th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
									{t("productCode")}
								</th>
								<th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
									{t("name")}
								</th>
								<th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
									{t("list")}
								</th>
								<th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
									{t("category")}
								</th>
								<th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
									{t("priority")}
								</th>
								<th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
									{t("status")}
								</th>
								<th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
									{t("actions")}
								</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-200 dark:divide-gray-600 text-center">
							{products.map((product) => (
								<tr key={product.id}>
									<td className="px-6 py-4 whitespace-nowrap">
										<Image
											src={product.photo || "/images/no-image.png"}
											alt={product.ten_vi}
											width={40}
											height={40}
											className="object-cover rounded"
											loading="lazy"
										/>
									</td>
									<td className="px-6 py-4 whitespace-nowrap">{product.masp}</td>
									<td className="px-6 py-4 whitespace-nowrap">
										<div className="max-w-xs" title={product.ten_vi}>
											{truncateText(product.ten_vi)}
										</div>
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										{product.list_ten_vi ?? "-"}
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										{product.cat_ten_vi ?? "-"}
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										<span
											className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
												product.noibat
													? "bg-yellow-100 text-yellow-800"
													: "bg-gray-100 text-gray-800"
											}`}
										>
											{product.noibat ? t("featured") : t("normal")}
										</span>
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										<button
											onClick={() =>
												handleToggleStatus(product.id, product.hienthi)
											}
											className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full cursor-pointer transition-colors duration-200 ${
												product.hienthi
													? "bg-green-100 text-green-800 hover:bg-green-200"
													: "bg-red-100 text-red-800 hover:bg-red-200"
											}`}
											title={
												product.hienthi
													? t("clickToDeactivate")
													: t("clickToActivate")
											}
										>
											{product.hienthi ? (
												<FaCheck className="h-4 w-4" />
											) : (
												<FaTimes className="h-4 w-4" />
											)}
										</button>
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
										<Link
											href={`/admin/products/edit/${product.id}`}
											className="text-indigo-600 hover:text-indigo-900 mr-4 inline-block"
											title={t("edit")}
										>
											<BiEdit className="h-5 w-5" />
										</Link>
										<button
											onClick={() => handleDelete(product.id)}
											className="text-red-600 hover:text-red-900 inline-block"
											title={t("delete")}
										>
											<BiTrash className="h-5 w-5" />
										</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</AdminLayout>
	);
}
