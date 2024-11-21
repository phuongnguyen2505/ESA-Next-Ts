import { NextApiRequest, NextApiResponse } from "next";
import db from "@/lib/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	try {
		const results: any = await new Promise((resolve, reject) => {
			db.query("SELECT * FROM table_about LIMIT 1", (err, results: any) => {
				if (err) reject(err);
				else resolve(results);
			});
		});

		if (results.length > 0) {
			const about = results[0];
			const response = {
				id: about.id,
				ten_vi: about.ten_vi,
				mota_vi: about.mota_vi,
				noidung_vi: about.noidung_vi,
				title_vi: about.title_vi,
				keywords_vi: about.keywords_vi,
				description_vi: about.description_vi,
				ten_en: about.ten_en,
				mota_en: about.mota_en,
				noidung_en: about.noidung_en,
				title_en: about.title_en,
				keywords_en: about.keywords_en,
				description_en: about.description_en,
				tenkhongdau: about.tenkhongdau,
				photo: about.photo,
				hienthi: about.hienthi,
			};
			res.status(200).json(response);
		} else {
			res.status(404).json({ error: "No about information found" });
		}
	} catch (error) {
		console.error("Error fetching about:", error);
		res.status(500).json({ error: "Internal Server Error" });
	}
}
