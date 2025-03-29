"use client";

import ClientLayout from "@/app/components/layouts/ClientLayout";
import React, { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { Product } from "@/types/Product";

export default function ProductDetailPage() {
	const { slug } = useParams() as { slug: string };
	const router = useRouter();
	const [product, setProduct] = useState<Product | null>(null);
	const [related, setRelated] = useState<Product[]>([]);
	const containerRef = useRef<HTMLDivElement>(null);
	const hasIncremented = useRef(false);

	useEffect(() => {
		const load = async () => {
			const res = await fetch(`/api/products`);
			const { products } = await res.json();
			const found = products.find((p: Product) => p.tenkhongdau === slug);
			if (!found) return router.replace("/404");
			setProduct(found);
			// Related: same category (excluding itself)
			setRelated(
				products.filter(
					(p: Product) => p.list_ten_en === found.list_ten_en && p.id !== found.id,
				),
			);
		};
		load();
	}, [slug, router]);

	useEffect(() => {
		if (product && containerRef.current) {
			gsap.fromTo(
				containerRef.current,
				{ opacity: 0, y: 30 },
				{ opacity: 1, y: 0, duration: 0.8 },
			);
		}
	}, [product]);

	useEffect(() => {
		if (product && !hasIncremented.current) {
			hasIncremented.current = true;

			fetch(`/api/products/${product.id}`, {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ luotxem: product.luotxem + 1 }),
			})
				.then((res) => {
					if (res.ok) {
						setProduct((prev) =>
							prev ? { ...prev, luotxem: prev.luotxem + 1 } : prev,
						);
					} else {
						console.error("Failed to update view count");
					}
				})
				.catch((err) => console.error("Error updating view count:", err));
		}
	}, [product]);

	const getImageUrl = (photo: string | null) => {
		if (!photo) return "/no-image.png";
		if (photo.startsWith("http")) return photo;

		try {
			return `/uploads/products/${photo}`;
		} catch {
			return "/no-image.png";
		}
	};

	const truncateTitle = (text: string, maxLength: number = 30): string => {
		if (text.length <= maxLength) return text;
		let sub = text.slice(0, maxLength);
		const lastSpace = sub.lastIndexOf(" ");
		if (lastSpace !== -1) {
			sub = sub.slice(0, lastSpace);
		}
		return sub + "...";
	};

	const truncateText = (text: string, maxLength: number = 20): string => {
		if (text.length <= maxLength) return text;
		let sub = text.slice(0, maxLength);
		const lastSpace = sub.lastIndexOf(" ");
		if (lastSpace !== -1) {
			sub = sub.slice(0, lastSpace);
		}
		return sub + "...";
	};

	if (!product) {
		return (
			<ClientLayout>
				<div className="min-h-screen flex items-center justify-center">
					Loading...
				</div>
			</ClientLayout>
		);
	}

	return (
		<ClientLayout>
			<section className="w-full">
				<div className="max-w-7xl mx-auto flex flex-col gap-10" ref={containerRef}>
					{/* Breadcrumb */}
					<nav className="text-md mb-4">
						<Link href="/" className="text-blue-600 hover:underline">
							Home
						</Link>
						<span className="mx-2">/</span>
						<Link href="/products" className="text-blue-600 hover:underline">
							Products
						</Link>
						<span className="mx-2">/</span>
						<span className="text-blue-600">{product.list_ten_en}</span>
						<span className="mx-2">/</span>
						<span className="font-semibold">{product.cat_ten_en}</span>
						{/* <span className="mx-2">/</span>
						<span className="font-semibold">{product.ten_en}</span> */}
					</nav>
					{/* Main content */}
					<div className="flex flex-col md:flex-row gap-8">
						{/* Left: Image */}
						<div className="md:w-2/5 h-fit rounded-lg shadow overflow-hidden aspect-square">
							<img
								src={getImageUrl(product.photo)}
								alt={product.ten_en}
								width={500}
								height={500}
								className="object-cover rounded"
								loading="lazy"
								onError={(e) => {
									e.currentTarget.src = "/no-image.png";
								}}
							/>
						</div>
						{/* Right: Details */}
						<div className="space-y-6">
							{product.noibat === 1 && (
								<span className="bg-red-500 text-white px-2 py-1 rounded-md text-sm">
									Featured
								</span>
							)}
							<h1 className="text-4xl font-bold flex items-center gap-6">
								{product.ten_en}{" "}
							</h1>
							<p className="text-lg text-gray-600">{product.mota_en}</p>
							<span className="text-sm text-gray-500">
								Views: {product.luotxem}
							</span>
							<div className="flex flex-wrap gap-4 items-center">
								<span className="text-xl font-semibold text-blue-600">
									{Number(product.gia) > 0
										? `$${Number(product.gia).toFixed(2)}`
										: "Contact for price"}
								</span>
							</div>
							<div className="flex gap-4">
								{product.file && (
									<Link
										href={`/uploads/products/${product.file}`}
										className="px-6 py-3 bg-gray-200 rounded-lg hover:bg-gray-300"
									>
										Download Catalog
									</Link>
								)}
								<Link
									href="/contact"
									className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
								>
									Contact Us
								</Link>
							</div>
							{/* Specs */}
							<div className="bg-gray-50 p-6 rounded-lg">
								<h2 className="text-2xl font-semibold mb-4">Specifications</h2>
								<table className="w-full text-left text-sm">
									<tbody>
										<tr>
											<th className="py-2">Model</th>
											<td>{product.ten_en}</td>
										</tr>
										<tr>
											<th className="py-2">Category List</th>
											<td>{product.list_ten_en}</td>
										</tr>
										<tr>
											<th className="py-2">Product Line</th>
											<td>{product.cat_ten_en}</td>
										</tr>
									</tbody>
								</table>
							</div>
							{/* Related Products */}
						</div>
					</div>
					{/* Content Section */}
					{product.noidung_en && (
						<div className="mt-12 border-t pt-8">
							<h2 className="text-2xl font-semibold mb-4">Product Details</h2>
							<div dangerouslySetInnerHTML={{ __html: product.noidung_en }} />
						</div>
					)}

					{related.length > 0 && (
						<div className="mt-12 border-t pt-8">
							<h2 className="text-3xl font-bold mb-6">Related Products</h2>
							<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
								{related.slice(0, 8).map((r) => (
									<Link
										key={r.id}
										href={`/products/${r.tenkhongdau}`}
										className="group transition-all duration-300 hover:-translate-y-1 h-full"
									>
										<div className="bg-white rounded-xl shadow-md overflow-hidden h-full flex flex-col">
											<div className="relative aspect-square">
												<img
													src={getImageUrl(r.photo)}
													alt={r.ten_en}
													className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
													loading="lazy"
													onError={(e) => {
														e.currentTarget.src = "/no-image.png";
													}}
												/>
											</div>
											<div className="p-4 flex flex-col flex-grow">
												<h3 className="font-semibold text-lg text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
													{truncateTitle(r.ten_en)}
												</h3>
												<div className="mt-auto flex items-center justify-between">
													<span className="text-sm text-gray-500">
														{truncateText(r.cat_ten_en ?? "-")}
													</span>
													<span className="text-blue-600 font-medium">
														{Number(r.gia) > 0
															? `$${Number(r.gia).toFixed(2)}`
															: "Contact"}
													</span>
												</div>
											</div>
										</div>
									</Link>
								))}
							</div>
						</div>
					)}
				</div>
			</section>
		</ClientLayout>
	);
}
