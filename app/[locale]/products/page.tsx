"use client";

import ClientLayout from "@/app/components/layouts/ClientLayout";
import React, { useEffect, useState, useRef, ChangeEvent, useMemo } from "react";
import { Product } from "@/types/Product";
import axios from "axios";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger);

export default function Products() {
	const [products, setProducts] = useState<Product[]>([]);
	const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
	const [loading, setLoading] = useState(true);
	// Cho phép chọn nhiều category
	const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
	const [featuredOnly, setFeaturedOnly] = useState<boolean>(false);
	const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
	const [showAllCategories, setShowAllCategories] = useState<boolean>(false);

	const productsRef = useRef<HTMLDivElement>(null);

	// Fetch dữ liệu sản phẩm khi component mount
	useEffect(() => {
		const fetchProducts = async () => {
			try {
				const response = await axios.get<{ products: Product[] }>("/api/products");
				setProducts(response.data.products);
				setFilteredProducts(response.data.products);
			} catch (error) {
				console.error("Error fetching products:", error);
			} finally {
				setLoading(false);
			}
		};
		fetchProducts();
	}, []);

	// Tính toán danh sách các category độc nhất dựa trên dữ liệu sản phẩm
	const categories = useMemo((): string[] => {
		return Array.from(
			new Set(
				products
					.map((p) => p.list_ten_en)
					.filter((cat): cat is string => Boolean(cat)),
			),
		);
	}, [products]);

	// Xác định danh sách category hiển thị (giới hạn 5 nếu chưa bật show more)
	const visibleCategories = useMemo(() => {
		return showAllCategories ? categories : categories.slice(0, 5);
	}, [categories, showAllCategories]);

	// Hàm xử lý chọn/gỡ bỏ category
	const toggleCategory = (category: string) => {
		if (selectedCategories.includes(category)) {
			setSelectedCategories(selectedCategories.filter((c) => c !== category));
		} else {
			setSelectedCategories([...selectedCategories, category]);
		}
	};

	// Áp dụng filter và sắp xếp mỗi khi các state thay đổi
	useEffect(() => {
		let updated = [...products];

		// Lọc theo các category đã chọn nếu có
		if (selectedCategories.length > 0) {
			updated = updated.filter(
				(p) => p.list_ten_en && selectedCategories.includes(p.list_ten_en),
			);
		}

		if (featuredOnly) {
			updated = updated.filter((p) => p.noibat === 1);
		}

		updated.sort((a, b) => {
			const nameA = a.ten_en.toLowerCase();
			const nameB = b.ten_en.toLowerCase();
			if (nameA < nameB) return sortOrder === "asc" ? -1 : 1;
			if (nameA > nameB) return sortOrder === "asc" ? 1 : -1;
			return 0;
		});

		setFilteredProducts(updated);

		// Lấy các phần tử .product-card sau khi render xong
		const cards = document.querySelectorAll(".product-card");
		if (cards.length > 0) {
			gsap.fromTo(
				cards,
				{ opacity: 0, y: 20 },
				{
					opacity: 1,
					y: 0,
					stagger: 0.1,
					duration: 0.5,
					ease: "power3.out",
				},
			);
		}
	}, [selectedCategories, featuredOnly, sortOrder, products]);

	// GSAP animation cho khối sản phẩm khi load xong dữ liệu
	useEffect(() => {
		if (!loading && productsRef.current) {
			// Hủy các ScrollTrigger cũ
			ScrollTrigger.getAll().forEach((trigger) => trigger.kill());

			const tl = gsap.timeline({
				defaults: { ease: "power3.out" },
				scrollTrigger: {
					trigger: productsRef.current,
					start: "top center",
					toggleActions: "play none none none",
				},
			});

			tl.from(productsRef.current, {
				y: 30,
				opacity: 0,
				duration: 0.8,
			});

			return () => {
				tl.scrollTrigger?.kill();
				gsap.killTweensOf(".product-card");
			};
		}
	}, [loading]);

	if (loading) {
		return (
			<ClientLayout>
				<div className="flex items-center justify-center min-h-screen">
					<div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-900"></div>
				</div>
			</ClientLayout>
		);
	}

	return (
		<ClientLayout>
			<section className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
				<div className="max-w-7xl mx-auto">
					<h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">
						Our Products
					</h1>

					{/* Layout với sidebar bên trái và danh sách sản phẩm bên phải */}
					<div className="flex flex-col md:flex-row gap-8">
						{/* Sidebar bộ lọc */}
						<aside className="md:w-1/4 bg-white p-6 rounded-lg shadow-md">
							<h2 className="text-2xl font-semibold text-gray-800 mb-6">
								Filters
							</h2>

							{/* Lọc theo sản phẩm nổi bật */}
							<div className="mb-6">
								<label className="flex items-center text-gray-700 font-medium">
									<input
										type="checkbox"
										checked={featuredOnly}
										onChange={(e) => setFeaturedOnly(e.target.checked)}
										className="h-5 w-5 mr-2"
									/>
									Featured Only
								</label>
							</div>

							{/* Lọc theo Category (Multi-select) */}
							<div className="mb-6">
								<label className="block text-gray-700 font-medium mb-2">
									Categories:
								</label>
								<div className="flex flex-wrap gap-2">
									<button
										onClick={() => setSelectedCategories([])}
										className={`px-3 py-1 rounded-full border ${
											selectedCategories.length === 0
												? "bg-blue-600 text-white"
												: "text-gray-700"
										}`}
									>
										All
									</button>
									{visibleCategories.map((cat, index) => (
										<button
											key={index}
											onClick={() => toggleCategory(cat)}
											className={`px-3 py-1 rounded-full border ${
												selectedCategories.includes(cat)
													? "bg-blue-600 text-white"
													: "text-gray-700"
											}`}
										>
											{cat}
										</button>
									))}
								</div>
								{categories.length > 5 && (
									<button
										onClick={() => setShowAllCategories(!showAllCategories)}
										className="mt-2 text-sm text-blue-600 hover:underline"
									>
										{showAllCategories ? "Show Less" : "Show More"}
									</button>
								)}
							</div>
						</aside>

						{/* Main content danh sách sản phẩm */}
						<main className="md:w-3/4">
							<div className="w-[30%] ml-auto mb-4">
								<label className="block text-gray-700 font-medium mb-2">
									Sort:
								</label>
								<select
									aria-label="Sort products by name"
									value={sortOrder}
									onChange={(e: ChangeEvent<HTMLSelectElement>) =>
										setSortOrder(e.target.value as "asc" | "desc")
									}
									className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
								>
									<option value="asc">A - Z</option>
									<option value="desc">Z - A</option>
								</select>
							</div>
							<div
								ref={productsRef}
								className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
							>
								{filteredProducts.map((product) => (
									<div
										key={product.id}
										className="product-card bg-white rounded-lg shadow-lg overflow-hidden transform transition-transform hover:scale-105"
									>
										<div className="relative aspect-square">
											<Image
												src={`/uploads/products/${product.photo}`}
												alt={product.ten_en}
												fill
												sizes="(max-width: 768px) 100vw, 33vw"
												className="object-cover"
											/>
											{product.noibat === 1 && (
												<span className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-md text-sm">
													Featured
												</span>
											)}
										</div>
										<div className="p-6">
											<div className="flex justify-between items-start mb-4">
												<h2 className="text-xl font-semibold text-gray-900 mb-2">
													{product.ten_en}
												</h2>
											</div>
											{product.list_ten_en && (
												<p className="text-sm text-gray-600 mb-2">
													Category: {product.list_ten_en}
												</p>
											)}
											<p className="text-gray-700 mb-4 line-clamp-2">
												{product.mota_en}
											</p>
											<Link
												href={`/products/${product.tenkhongdau}`}
												className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
											>
												View Details
											</Link>
										</div>
									</div>
								))}
							</div>
						</main>
					</div>
				</div>
			</section>
		</ClientLayout>
	);
}
