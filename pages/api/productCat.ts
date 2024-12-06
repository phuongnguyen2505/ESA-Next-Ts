import { NextApiRequest, NextApiResponse } from "next";
import db from "@/lib/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method === "GET") {
		try {
			const results: any = await new Promise((resolve, reject) => {
				db.query(
					`SELECT * FROM table_product_cat 
                    ORDER BY stt ASC, id DESC`,
					(err, results) => {
						if (err) reject(err);
						else resolve(results);
					},
				);
			});

			const categories = results.map((item: any) => ({
				id: item.id,
				id_list: item.id_list,
				ten_vi: item.ten_vi,
				ten_en: item.ten_en,
				tenkhongdau: item.tenkhongdau,
				title_vi: item.title_vi,
				title_en: item.title_en,
				keywords_vi: item.keywords_vi,
				keywords_en: item.keywords_en,
				description_vi: item.description_vi,
				description_en: item.description_en,
				stt: item.stt,
				hienthi: item.hienthi,
				noibat: item.noibat,
				ngaytao: item.ngaytao,
				ngaysua: item.ngaysua,
			}));

			res.status(200).json({ categories });
		} catch (error) {
			console.error("Error fetching product categories:", error);
			res.status(500).json({ error: "Internal Server Error" });
		}
	} else if (req.method === "POST") {
		try {
			const data = req.body;
			
			console.log("Received data:", data);
			
			const query = "INSERT INTO table_product_cat SET ?";
			
			const insertData = {
				id_list: data.id_list,
				ten_vi: data.ten_vi,
				ten_en: data.ten_en,
				tenkhongdau: data.tenkhongdau,
				title_vi: data.title_vi,
				title_en: data.title_en,
				keywords_vi: data.keywords_vi,
				keywords_en: data.keywords_en,
				description_vi: data.description_vi,
				description_en: data.description_en,
				hienthi: data.hienthi,
				noibat: data.noibat,
				ngaytao: new Date(),
				ngaysua: new Date()
			};

			await new Promise((resolve, reject) => {
				db.query(query, insertData, (err, result) => {
					if (err) {
						console.error("Database error:", err);
						reject(err);
					} else {
						console.log("Insert result:", result);
						resolve(result);
					}
				});
			});

			res.status(201).json({ message: "Created successfully" });
		} catch (error) {
			console.error("Error creating product category:", error);
			res.status(500).json({ 
				error: "Internal Server Error",
				details: error instanceof Error ? error.message : "Unknown error"
			});
		}
	} else if (req.method === "DELETE") {
		try {
			const { id } = req.query;

			if (!id) {
				return res.status(400).json({ error: "Product category ID is required" });
			}

			await new Promise((resolve, reject) => {
				db.query(
					'DELETE FROM table_product_cat WHERE id = ?',
					[id],
					(err, result) => {
						if (err) reject(err);
						else resolve(result);
					}
				);
			});

			res.status(200).json({ message: "Deleted successfully" });
		} catch (error) {
			console.error("Error deleting product category:", error);
			res.status(500).json({ error: "Internal Server Error" });
		}
	} else if (req.method === "PATCH") {
		try {
			const { id } = req.query;
			const updateData = req.body;

			if (!id) {
				return res.status(400).json({ error: "Product category ID is required" });
			}

			await new Promise((resolve, reject) => {
				db.query(
					'UPDATE table_product_cat SET ? WHERE id = ?',
					[updateData, id],
					(err, result) => {
						if (err) reject(err);
						else resolve(result);
					}
				);
			});

			res.status(200).json({ message: "Updated successfully" });
		} catch (error) {
			console.error("Error updating product category:", error);
			res.status(500).json({ error: "Internal Server Error" });
		}
	} else {
		res.status(405).json({ error: "Method not allowed" });
	}
}
