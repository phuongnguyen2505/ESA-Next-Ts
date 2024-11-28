import { NextApiRequest, NextApiResponse } from "next";
import db from "@/lib/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	try {
		const results: any = await new Promise((resolve, reject) => {
			db.query(
				`SELECT p.*, pl.ten_vi as list_ten_vi, pl.ten_en as list_ten_en,
				pc.ten_vi as cat_ten_vi, pc.ten_en as cat_ten_en
				FROM table_product p
				LEFT JOIN table_product_list pl ON p.id_list = pl.id
				LEFT JOIN table_product_cat pc ON p.id_cat = pc.id
				ORDER BY p.stt ASC, p.id DESC`,
				(err, results) => {
					if (err) reject(err);
					else resolve(results);
				},
			);
		});

		const products = results.map((item: any) => ({
			id: item.id,
			id_list: item.id_list,
			id_item: item.id_item,
			id_cat: item.id_cat,
			noibat: item.noibat,
			photo: item.photo,
			thumb: item.thumb,
			file: item.file,
			ten_vi: item.ten_vi,
			ten_en: item.ten_en,
			masp: item.masp,
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
			ngaytao: item.ngaytao,
			ngaysua: item.ngaysua,
			luotxem: item.luotxem,
			tags_vi: item.tags_vi,
			tags_en: item.tags_en,
			list_ten_vi: item.list_ten_vi,
			list_ten_en: item.list_ten_en,
			cat_ten_vi: item.cat_ten_vi,
			cat_ten_en: item.cat_ten_en,
		}));

		res.status(200).json({ products });
	} catch (error) {
		console.error("Error fetching products:", error);
		res.status(500).json({ error: "Internal Server Error" });
	}
}
