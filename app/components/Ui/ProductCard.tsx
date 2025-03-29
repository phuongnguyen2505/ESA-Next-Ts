import Link from "next/link";
import { Product } from "@/types/Product";

interface ProductCardProps {
	product: Product;
	truncateTitle: (text: string, maxLength?: number) => string;
	getImageUrl: (photo: string | null) => string;
}

const ProductCard: React.FC<ProductCardProps> = ({
	product,
	truncateTitle,
	getImageUrl,
}) => {
	return (
		<Link
			href={`/products/${product.tenkhongdau}`}
			className="flex flex-col overflow-hidden bg-white rounded-lg shadow hover:shadow-xl transition-shadow product-card"
		>
			<div className="relative h-64">
				<img
					src={getImageUrl(product.photo)}
					alt={product.ten_en}
					className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
				/>
				{product.noibat === 1 && (
					<span className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-md text-sm">
						Featured
					</span>
				)}
			</div>
			<div className="flex flex-col flex-1 p-4">
				<h2 className="text-xl font-semibold text-gray-900">
					{truncateTitle(product.ten_en)}
				</h2>
				<div className="mt-auto">
					<p className="text-lg font-medium text-blue-600">
						{product.gia > 0
							? `$${Number(product.gia).toFixed(2)}`
							: "Contact for price"}
					</p>
				</div>
			</div>
		</Link>
	);
};

export default ProductCard;
