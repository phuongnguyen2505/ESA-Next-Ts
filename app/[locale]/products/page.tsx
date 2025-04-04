"use client";

import ClientLayout from "@/app/components/layouts/ClientLayout";
import React, { useEffect, useState, useRef, ChangeEvent, useMemo } from "react";
import axios from "axios";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import Pagination from "@/app/components/Ui/Pagination";
import { Product } from "@/types/Product";
import FilterSidebar from "@/app/components/Ui/FilterSidebar";
import ProductCard from "@/app/components/Ui/ProductCard";

gsap.registerPlugin(ScrollTrigger);

export default function Products() {
	const [products, setProducts] = useState<Product[]>([]);
	const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
	const [loading, setLoading] = useState(true);
	const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
	const [featuredOnly, setFeaturedOnly] = useState<boolean>(false);
	const [sortOrder, setSortOrder] = useState<
		"asc" | "desc" | "newest" | "oldest" | "mostViewed"
	>("asc");
	const [showAllCategories, setShowAllCategories] = useState<boolean>(false);
	const [selectedProductLines, setSelectedProductLines] = useState<string[]>([]);
	const [showAllProductLines, setShowAllProductLines] = useState<boolean>(false);
	const productsRef = useRef<HTMLDivElement>(null);
	const [searchQuery, setSearchQuery] = useState("");
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 12;

	// Fetch products
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

	// Tính toán dynamic categories và product lines
	const dynamicCategories = useMemo((): string[] => {
		const filtered =
			selectedProductLines.length > 0
				? products.filter(
						(p) => p.cat_ten_en && selectedProductLines.includes(p.cat_ten_en),
				  )
				: products;
		return Array.from(
			new Set(filtered.map((p) => p.list_ten_en).filter(Boolean) as string[]),
		);
	}, [products, selectedProductLines]);

	const dynamicProductLines = useMemo((): string[] => {
		const filtered =
			selectedCategories.length > 0
				? products.filter(
						(p) => p.list_ten_en && selectedCategories.includes(p.list_ten_en),
				  )
				: products;
		return Array.from(
			new Set(filtered.map((p) => p.cat_ten_en).filter(Boolean) as string[]),
		);
	}, [products, selectedCategories]);

	const visibleCategories = useMemo(
		() => (showAllCategories ? dynamicCategories : dynamicCategories.slice(0, 5)),
		[dynamicCategories, showAllCategories],
	);
	const visibleProductLines = useMemo(
		() => (showAllProductLines ? dynamicProductLines : dynamicProductLines.slice(0, 5)),
		[dynamicProductLines, showAllProductLines],
	);

	// Hàm toggle
	const toggleCategory = (category: string) => {
		if (category === "") {
			setSelectedCategories([]);
		} else {
			setSelectedCategories((prev) =>
				prev.includes(category)
					? prev.filter((c) => c !== category)
					: [...prev, category],
			);
		}
	};

	const toggleProductLine = (line: string) => {
		if (line === "") {
			setSelectedProductLines([]);
		} else {
			setSelectedProductLines((prev) =>
				prev.includes(line) ? prev.filter((l) => l !== line) : [...prev, line],
			);
		}
	};

	// Lọc, sắp xếp sản phẩm
	useEffect(() => {
		let updated = [...products];
		if (selectedCategories.length > 0) {
			updated = updated.filter(
				(p) => p.list_ten_en && selectedCategories.includes(p.list_ten_en),
			);
		}
		if (selectedProductLines.length > 0) {
			updated = updated.filter(
				(p) => p.cat_ten_en && selectedProductLines.includes(p.cat_ten_en),
			);
		}
		if (featuredOnly) {
			updated = updated.filter((p) => p.noibat === 1);
		}
		updated.sort((a, b) => {
			switch (sortOrder) {
				case "asc":
					return a.ten_en.toLowerCase().localeCompare(b.ten_en.toLowerCase());
				case "desc":
					return b.ten_en.toLowerCase().localeCompare(a.ten_en.toLowerCase());
				case "newest":
					return b.id - a.id;
				case "oldest":
					return a.id - b.id;
				case "mostViewed":
					return (b.luotxem || 0) - (a.luotxem || 0);
				default:
					return 0;
			}
		});
		setFilteredProducts(updated);
		// GSAP animation cho product cards
		const cards = document.querySelectorAll(".product-card");
		if (cards.length > 0) {
			gsap.fromTo(
				cards,
				{ opacity: 0, y: 20 },
				{ opacity: 1, y: 0, stagger: 0.1, duration: 0.5, ease: "power3.out" },
			);
		}
	}, [selectedCategories, selectedProductLines, featuredOnly, sortOrder, products]);

	// Animation khi load sản phẩm
	useEffect(() => {
		if (!loading && productsRef.current) {
			ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
			const tl = gsap.timeline({
				defaults: { ease: "power3.out" },
				scrollTrigger: {
					trigger: productsRef.current,
					start: "top center",
					toggleActions: "play none none none",
				},
			});
			tl.from(productsRef.current, { y: 30, opacity: 0, duration: 0.8 });
			return () => {
				tl.scrollTrigger?.kill();
				gsap.killTweensOf(".product-card");
			};
		}
	}, [loading]);

	// Tìm kiếm sản phẩm
	useEffect(() => {
		const updated = products.filter(
			(product) =>
				product.ten_en.toLowerCase().includes(searchQuery.toLowerCase()) ||
				(product.masp &&
					product.masp.toLowerCase().includes(searchQuery.toLowerCase())),
		);
		setFilteredProducts(updated);
		setCurrentPage(1);
	}, [searchQuery, products]);

	// Phân trang
	const totalPages = useMemo(
		() => Math.ceil(filteredProducts.length / itemsPerPage),
		[filteredProducts.length, itemsPerPage],
	);
	const paginatedProducts = useMemo(
		() =>
			filteredProducts.slice(
				(currentPage - 1) * itemsPerPage,
				currentPage * itemsPerPage,
			),
		[filteredProducts, currentPage, itemsPerPage],
	);

	// Một số hàm tiện ích
	const truncateTitle = (text: string, maxLength: number = 35) => {
		if (text.length <= maxLength) return text;
		let sub = text.slice(0, maxLength);
		const lastSpace = sub.lastIndexOf(" ");
		return (lastSpace !== -1 ? sub.slice(0, lastSpace) : sub) + "...";
	};
	const getImageUrl = (photo: string | null) => {
		if (!photo) return "/no-image.png";
		return photo.startsWith("http") ? photo : `/uploads/products/${photo}`;
	};

	return (
		<ClientLayout>
			<section className="w-full py-12 px-4 sm:px-6 lg:px-12 bg-gray-50">
				<div className="max-w-7xl mx-auto">
					<h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">
						Our Products
					</h1>
					<div className="flex flex-col md:flex-row gap-8">
						<aside className="md:w-1/4 h-fit bg-white p-6 rounded-lg shadow-md">
							<h2 className="text-xl font-semibold mb-4">Filters</h2>
							<div className="mb-6">
								<button
									onClick={() => setFeaturedOnly(!featuredOnly)}
									className={`px-3 py-1 rounded-full border hover:text-white hover:bg-blue-400 ${
										featuredOnly ? "bg-blue-600 text-white" : "text-gray-700"
									}`}
								>
									Featured
								</button>
							</div>
							<div className="mb-6">
								<FilterSidebar
									title="Categories"
									filters={visibleCategories.map((cat) => ({
										label: cat,
										value: cat,
									}))}
									selectedFilters={selectedCategories}
									onToggle={toggleCategory}
									onReset={() => setSelectedCategories([])}
									showMoreCondition={dynamicCategories.length > 5}
									onToggleShowMore={() => setShowAllCategories((prev) => !prev)}
									isExpanded={showAllCategories}
								/>
							</div>
							<div className="mb-6">
								<FilterSidebar
									title="Product Lines"
									filters={visibleProductLines.map((line) => ({
										label: line,
										value: line,
									}))}
									selectedFilters={selectedProductLines}
									onToggle={toggleProductLine}
									onReset={() => setSelectedProductLines([])}
									showMoreCondition={dynamicProductLines.length > 5}
									onToggleShowMore={() =>
										setShowAllProductLines((prev) => !prev)
									}
									isExpanded={showAllProductLines}
								/>
							</div>
						</aside>
						<main className="md:w-3/4">
							<div className="flex flex-col items-end sm:flex-row justify-between mb-6">
								<div className="w-[30%]">
									<label className="block text-gray-700 font-medium mb-2">
										Sort:
									</label>
									<select
										aria-label="Sort by"
										value={sortOrder}
										onChange={(e: ChangeEvent<HTMLSelectElement>) =>
											setSortOrder(
												e.target.value as
													| "asc"
													| "desc"
													| "newest"
													| "oldest"
													| "mostViewed",
											)
										}
										className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
									>
										<option value="asc">Name (A - Z)</option>
										<option value="desc">Name (Z - A)</option>
										<option value="newest">Newest First</option>
										<option value="oldest">Oldest First</option>
										<option value="mostViewed">Most Viewed</option>
									</select>
								</div>
								<div className="mt-4 sm:mt-0">
									<input
										type="text"
										value={searchQuery}
										onChange={(e: ChangeEvent<HTMLInputElement>) =>
											setSearchQuery(e.target.value)
										}
										placeholder="Search products..."
										className="px-4 py-2 border border-gray-300 rounded-md w-full max-w-sm"
									/>
								</div>
							</div>
							<div
								ref={productsRef}
								className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
							>
								{paginatedProducts
									.filter((product) => product.hienthi === 1)
									.map((product) => (
										<ProductCard
											key={product.id}
											product={product}
											truncateTitle={truncateTitle}
											getImageUrl={getImageUrl}
										/>
									))}
							</div>
							{totalPages > 1 && (
								<Pagination
									currentPage={currentPage}
									totalPages={totalPages}
									onPageChange={setCurrentPage}
								/>
							)}
						</main>
					</div>
				</div>
			</section>
		</ClientLayout>
	);
}
