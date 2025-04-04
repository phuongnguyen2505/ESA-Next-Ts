"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { Product } from "@/types/Product";
import Viewmore from "../Ui/Viewmore";
import { motion } from "framer-motion";
import ScrollFloat from "../Ui/ScrollFloat";

export default function Featured() {
	const [products, setProducts] = useState<Product[]>([]);

	useEffect(() => {
		const fetchProducts = async () => {
			try {
				const response = await axios.get<{ products: Product[] }>("/api/products");
				const productsData = response.data.products
					.filter((product: any) => product.sptb === 1)
					.sort((a, b) => a.id - b.id) // Sắp xếp giảm dần theo id
					.slice(0, 4) // Lấy 4 sản phẩm đầu tiên
					.map((product: any) => ({
						...product,
						link: `/product/${product.id}`,
					}));
				setProducts(productsData);
			} catch (error) {
				console.error("Error fetching products:", error);
			}
		};

		fetchProducts();
	}, []);

	return (
		<section className="relative min-h-screen bg-gradient-to-b from-[#1a1a2e] to-[#23233d] py-20">
			{/* Background Effects */}
			<div className="absolute inset-0 opacity-20">
				<div className="absolute inset-0 bg-[radial-gradient(circle_500px_at_50%_200px,#3c3c67,transparent)]" />
				<div className="absolute w-full h-full bg-[url('/grid.svg')] bg-center opacity-20" />
			</div>

			<div className="container mx-auto px-4 md:px-6 relative z-10">
				{/* Header */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					className="text-center mb-16"
				>
					{/* <h2 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent text-white">
						Featured Products
					</h2> */}
					<ScrollFloat
						animationDuration={1}
						ease="back.inOut(2)"
						scrollStart="center bottom+=50%"
						scrollEnd="bottom bottom-=40%"
						stagger={0.03}
						containerClassName="text-4xl md:text-6xl font-bold bg-clip-text text-transparent text-white"
					>
						Featured Products
					</ScrollFloat>
					<div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-3xl mx-auto mt-4" />
				</motion.div>

				{/* Products Grid */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
					{products.map((product, index) => (
						<motion.div
							key={product.id}
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ delay: index * 0.1 }}
							className="group relative flex flex-col h-full overflow-hidden rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 p-6 hover:border-white/20 transition-all duration-300"
						>
							{/* Product Image */}
							<div className="relative aspect-square mb-6 overflow-hidden rounded-xl">
								<div
									className={`absolute inset-0 bg-cover bg-center transform group-hover:scale-110 transition-transform duration-500 product-bg-${product.id}`}
								/>
								<style jsx>{`
									.product-bg-${product.id} {
										background-image: url(${product.photo.startsWith("http")
											? product.photo
											: `/uploads/products/${product.photo}`});
									}
								`}</style>
								<div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300" />
							</div>

							{/* Product Info */}
							<div className="flex flex-col flex-grow justify-between">
								<div>
									<Link
										href={`/products/${product.tenkhongdau}`}
										className="text-xl font-semibold text-white hover:text-blue-400 transition-colors duration-300"
									>
										{product.ten_en}
									</Link>
								</div>

								{/* Links Block - Đặt ở cuối */}
								<div className="mt-4 flex items-center justify-between flex-col xl:flex-row md:flex-col">
									{product.file && (
										<a
											href={product.file}
											target="_blank"
											rel="noopener noreferrer"
											className="inline-flex items-center space-x-2 text-sm text-blue-400 hover:text-blue-600 transition-colors duration-300"
										>
											<span>Download PDF</span>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												className="h-4 w-4"
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
												/>
											</svg>
										</a>
									)}
									<Link
										href={`/products/${product.tenkhongdau}`}
										className="inline-flex items-center space-x-2 text-sm text-blue-400 hover:text-blue-600 transition-colors duration-300"
									>
										<span>Learn More</span>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="h-4 w-4"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M9 5l7 7-7 7"
											/>
										</svg>
									</Link>
								</div>
							</div>
						</motion.div>
					))}
				</div>
				{/* View More Button */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					className="flex justify-center"
				>
					<Viewmore
						url="/products"
						text="Explore All Products"
						className="w-[300px] bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
					/>
				</motion.div>
			</div>
		</section>
	);
}
