import { NextApiRequest, NextApiResponse } from "next";
import db from "@/lib/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method === 'GET') {
		try {
			const results: any = await new Promise((resolve, reject) => {
				db.query(
					`SELECT * FROM table_product_list 
                    ORDER BY stt ASC, id DESC`,
					(err, results) => {
						if (err) reject(err);
						else resolve(results);
					},
				);
			});

			const lists = results.map((item: any) => ({
				id: item.id,
				ten_vi: item.ten_vi,
				ten_en: item.ten_en,
				tenkhongdau: item.tenkhongdau,
				mota_vi: item.mota_vi,
				mota_en: item.mota_en,
				noidung_vi: item.noidung_vi,
				noidung_en: item.noidung_en,
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

			res.status(200).json({ lists });
		} catch (error) {
			console.error("Error fetching product lists:", error);
			res.status(500).json({ error: "Internal Server Error" });
		}
	} else if (req.method === 'POST') {
		try {
			const data = req.body;
			await new Promise((resolve, reject) => {
				db.query(
					'INSERT INTO table_product_list SET ?',
					{
						ten_vi: data.ten_vi,
						ten_en: data.ten_en,
						tenkhongdau: data.tenkhongdau,
						mota_vi: data.mota_vi,
						mota_en: data.mota_en,
						noidung_vi: data.noidung_vi,
						noidung_en: data.noidung_en,
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
					},
					(err, result) => {
						if (err) reject(err);
						else resolve(result);
					}
				);
			});
			res.status(201).json({ message: 'Created successfully' });
		} catch (error) {
			console.error('Error creating product list:', error);
			res.status(500).json({ error: 'Internal Server Error' });
		}
	}
}
