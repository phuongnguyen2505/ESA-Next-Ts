import { NextApiRequest, NextApiResponse } from "next";
import db from "@/lib/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	console.log('API Request:', {
		method: req.method,
		query: req.query,
		body: req.body,
		headers: req.headers
	});

	if (req.method === "PATCH") {
		try {
			const { id } = req.query;
			const updateData = req.body;

			if (!id) {
				console.log('Missing ID');
				return res.status(400).json({ error: "ID is required" });
			}

			if (!updateData) {
				console.log('Missing update data');
				return res.status(400).json({ error: "Update data is required" });
			}

			console.log('Update operation:', {
				id,
				updateData,
				sql: "UPDATE table_product_cat SET ? WHERE id = ?"
			});

			const allowedFields = ['hienthi', 'noibat'];
			const filteredData = Object.keys(updateData)
				.filter(key => allowedFields.includes(key))
				.reduce((obj, key) => ({
					...obj,
					[key]: Number(updateData[key])
				}), {});

			const dataToUpdate = {
				...filteredData,
				ngaysua: new Date()
			};

			console.log('Filtered data to update:', dataToUpdate);

			const result = await new Promise((resolve, reject) => {
				db.query(
					"UPDATE table_product_cat SET ? WHERE id = ?",
					[dataToUpdate, id],
					(err, result) => {
						if (err) {
							console.error('Database error:', err);
							reject(err);
						}
						resolve(result);
					}
				);
			});

			console.log('Update result:', result);

			return res.status(200).json({
				success: true,
				message: "Updated successfully",
				data: result
			});

		} catch (error) {
			console.error('Error in PATCH handler:', error);
			return res.status(500).json({
				error: "Internal Server Error",
				details: error instanceof Error ? error.message : "Unknown error"
			});
		}
	}

	return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
}
