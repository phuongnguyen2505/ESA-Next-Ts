import { NextApiRequest, NextApiResponse } from "next";
import db from "@/lib/db";
import formidable from 'formidable';
import path from 'path';

export const config = {
	api: {
		bodyParser: false,
	},
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	const { id } = req.query;

	if (req.method === 'PUT') {
		try {
			const form = formidable({
				uploadDir: path.join(process.cwd(), 'public/uploads/products'),
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
				photoName = file.newFilename;
			}

			const updateData: { [key: string]: any } = {
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
				photo: photoName || undefined, // Chỉ cập nhật nếu có ảnh mới
				stt: parseInt(fields.stt?.[0] || '1'),
				hienthi: parseInt(fields.hienthi?.[0] || '1'),
				noibat: parseInt(fields.noibat?.[0] || '0'),
				tags_vi: fields.tags_vi?.[0],
				tags_en: fields.tags_en?.[0],
				ngaysua: new Date()
			};

			// Loại bỏ các trường không cần cập nhật
			Object.keys(updateData).forEach(key => updateData[key] === undefined && delete updateData[key]);

			await new Promise((resolve, reject) => {
				db.query('UPDATE table_product SET ? WHERE id = ?', [updateData, id], (err, result) => {
					if (err) reject(err);
					else resolve(result);
				});
			});

			res.status(200).json({ message: "Updated successfully" });
		} catch (error) {
			console.error("Error updating product:", error);
			res.status(500).json({ 
				error: "Internal Server Error",
				details: error instanceof Error ? error.message : "Unknown error"
			});
		}
	} else {
		res.status(405).json({ error: "Method not allowed" });
	}
}
