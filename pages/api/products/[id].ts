import { NextApiRequest, NextApiResponse } from "next";
import db from "@/lib/db";
import { RowDataPacket } from "mysql2";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	const { id } = req.query;

	if (!id) {
		return res.status(400).json({ error: "ID is required" });
	}

	switch (req.method) {
		case "GET":
			try {
				const result = await new Promise<RowDataPacket[]>((resolve, reject) => {
					db.query(
						`SELECT p.*, pl.ten_en as list_ten_en,
							pc.ten_en as cat_ten_en
							FROM table_product p
							LEFT JOIN table_product_list pl ON p.id_list = pl.id
							LEFT JOIN table_product_cat pc ON p.id_cat = pc.id
							WHERE p.id = ?`,
						[id],
						(err, results: RowDataPacket[]) => {
							if (err) reject(err);
							else resolve(results);
						},
					);
				});

				const product = result[0];

				if (!product) {
					return res.status(404).json({ error: "Product not found" });
				}

				if (product.photo && !product.photo.startsWith("http")) {
					product.photo = `/uploads/products/${product.photo}`;
				}

				return res.status(200).json({
					success: true,
					product: product,
				});
			} catch (error) {
				console.error("Error fetching product:", error);
				return res.status(500).json({
					error: "Internal Server Error",
					details: error instanceof Error ? error.message : "Unknown error",
				});
			}
			break;

		case "PATCH":
			try {
				const updateData = req.body;
				if (!updateData) {
					return res.status(400).json({ error: "Update data is required" });
				}

				// Cho phép cập nhật cả gia và luotxem
				const allowedFields = ["hienthi", "noibat", "gia", "luotxem"];
				const filteredData = Object.keys(updateData)
					.filter((key) => allowedFields.includes(key))
					.reduce(
						(obj, key) => ({
							...obj,
							[key]:
								key === "gia"
									? parseFloat(updateData[key])
									: Number(updateData[key]),
						}),
						{},
					);

				const dataToUpdate = {
					...filteredData,
					ngaysua: new Date(),
				};

				const result = await new Promise((resolve, reject) => {
					db.query(
						"UPDATE table_product SET ? WHERE id = ?",
						[dataToUpdate, id],
						(err, result) => {
							if (err) {
								console.error("Database error:", err);
								reject(err);
							} else resolve(result);
						},
					);
				});

				return res.status(200).json({
					success: true,
					message: "Updated successfully",
					data: result,
				});
			} catch (error) {
				console.error("Error in PATCH handler:", error);
				return res.status(500).json({
					error: "Internal Server Error",
					details: error instanceof Error ? error.message : "Unknown error",
				});
			}

		default:
			return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
	}
}
