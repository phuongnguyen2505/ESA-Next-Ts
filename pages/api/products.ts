import { NextApiRequest, NextApiResponse } from "next";
import db from "@/lib/db";
import formidable from 'formidable';
import path from 'path';
import fs from 'fs';

export const config = {
	api: {
		bodyParser: false,
	},
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method === 'GET') {
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
	} else if (req.method === 'POST') {
		try {
			const uploadDir = path.join(process.cwd(), 'public/uploads/products');

			const form = formidable({
				uploadDir,
				keepExtensions: true,
				maxFileSize: 5 * 1024 * 1024, // 5MB
			});

			const [fields, files] = await new Promise<[formidable.Fields, formidable.Files]>((resolve, reject) => {
				form.parse(req, (err, fields, files) => {
					if (err) reject(err);
					resolve([fields, files]);
				});
			});

			// Xử lý file ảnh
			const photo = files.photo;
			let photoName = '';
			
			if (photo && Array.isArray(photo) && photo[0]) {
				const file = photo[0];
				const ext = path.extname(file.newFilename);
				const timestamp = Date.now();
				photoName = `fig${timestamp}${ext}`;
				
				const newPath = path.join(uploadDir, photoName);
				fs.renameSync(file.filepath, newPath);
			}

			const insertData = {
				id_list: fields.id_list?.[0],
				id_cat: fields.id_cat?.[0],
				ten_vi: fields.ten_vi?.[0],
				ten_en: fields.ten_en?.[0],
				masp: fields.masp?.[0],
				mota_vi: fields.mota_vi?.[0],
				mota_en: fields.mota_en?.[0],
				noidung_vi: fields.noidung_vi?.[0] || '',
				noidung_en: fields.noidung_en?.[0] || '',
				title_vi: fields.title_vi?.[0],
				title_en: fields.title_en?.[0],
				keywords_vi: fields.keywords_vi?.[0],
				keywords_en: fields.keywords_en?.[0],
				description_vi: fields.description_vi?.[0],
				description_en: fields.description_en?.[0],
				photo: photoName,
				stt: parseInt(fields.stt?.[0] || '1'),
				hienthi: parseInt(fields.hienthi?.[0] || '1'),
				noibat: parseInt(fields.noibat?.[0] || '0'),
				tags_vi: fields.tags_vi?.[0],
				tags_en: fields.tags_en?.[0],
				ngaytao: new Date(),
				ngaysua: new Date()
			};

			await new Promise((resolve, reject) => {
				db.query('INSERT INTO table_product SET ?', insertData, (err, result) => {
					if (err) reject(err);
					else resolve(result);
				});
			});

			res.status(201).json({ message: "Created successfully" });
		} catch (error) {
			console.error("Error creating product:", error);
			res.status(500).json({ 
				error: "Internal Server Error",
				details: error instanceof Error ? error.message : "Unknown error"
			});
		}
	} else {
		res.status(405).json({ error: "Method not allowed" });
	}
}
