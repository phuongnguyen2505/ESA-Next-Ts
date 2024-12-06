import { NextApiRequest, NextApiResponse } from "next";
import db from "@/lib/db";
import { RowDataPacket } from 'mysql2';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	const { id } = req.query;

	if (req.method === "GET") {
		try {
			const result = await new Promise<RowDataPacket>((resolve, reject) => {
				db.query(
					"SELECT * FROM table_product_cat WHERE id = ?",
					[id],
					(err, results: RowDataPacket[]) => {
						if (err) reject(err);
						else resolve(results[0]);
					},
				);
			});

			if (!result) {
				return res.status(404).json({ error: "Product cat not found" });
			}

			res.status(200).json({ list: result });
		} catch (error) {
			console.error("Error fetching product list:", error);
			res.status(500).json({ error: "Internal Server Error" });
		}
	} else if (req.method === "PUT") {
		try {
			const {
				id,
				id_list,
				ten_vi,
				ten_en,
				title_vi,
				title_en,
				keywords_vi,
				keywords_en,
				description_vi,
				description_en,
				hienthi,
				noibat,
			} = req.body;

			console.log('Received data:', req.body);

			const result = await new Promise((resolve, reject) => {
				db.query(
					`UPDATE table_product_cat SET 
						id_list = ?,
						ten_vi = ?, 
						ten_en = ?, 
						title_vi = ?, 
						title_en = ?,
						keywords_vi = ?, 
						keywords_en = ?,
						description_vi = ?, 
						description_en = ?,
						hienthi = ?, 
						noibat = ?,
						ngaysua = NOW()
					WHERE id = ?`,
					[
						id_list,
						ten_vi,
						ten_en,
						title_vi,
						title_en,
						keywords_vi,
						keywords_en,
						description_vi,
						description_en,
						hienthi,
						noibat,
						id
					],
					(err, result) => {
						if (err) {
							console.error('SQL Error:', err);
							reject(err);
						} else {
							console.log('Update result:', result);
							resolve(result);
						}
					}
				);
			});

			res.status(200).json({ 
				message: "Updated successfully",
				result: result 
			});
		} catch (error) {
			console.error("Error updating product cat:", error);
			res.status(500).json({ error: "Internal Server Error" });
		}
	} else {
		res.status(405).json({ error: "Method not allowed" });
	}
}
