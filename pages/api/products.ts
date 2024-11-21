import { NextApiRequest, NextApiResponse } from "next";
import db from "../../lib/db";
import { Product } from "../../types/Product"; // Import Product interface

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	try {
		db.query("SELECT * FROM table_product", (err, results) => {
			if (err) {
				console.error("Error fetching products:", err);
				res.status(500).json({ error: "Error fetching products" });
				return;
			}
			const products: Product[] = results.map((product: any) => ({
				id: product.id,
				id_list: product.id_list,
				ten_vi: product.ten_vi,
				ten_en: product.ten_en,
				mota_vi: product.mota_vi,
				mota_en: product.mota_en,
			}));
			res.status(200).json({ products });
		});
	} catch (error) {
		console.error("Server error:", error);
		res.status(500).json({ error: "Server error" });
	}
}
