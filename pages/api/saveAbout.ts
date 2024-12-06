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
	if (req.method !== 'POST') {
		return res.status(405).json({ error: 'Method not allowed' });
	}

	try {
		// Cấu hình upload
		const uploadDir = path.join(process.cwd(), 'public/uploads/about');
		const form = formidable({
			uploadDir,
			keepExtensions: true,
			maxFileSize: 5 * 1024 * 1024, // 5MB
		});

		// Parse form data
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
			// Nếu có ảnh mới và có id, xóa ảnh cũ
			const id = fields.id?.[0];
			if (id) {
				const [oldData]: any = await new Promise((resolve, reject) => {
					db.query(
						'SELECT photo FROM table_about WHERE id = ?',
						[id],
						(err, results) => {
							if (err) reject(err);
							else resolve(results);
						}
					);
				});

				if (oldData?.photo) {
					const oldPath = path.join(process.cwd(), 'public', oldData.photo);
					if (fs.existsSync(oldPath)) {
						fs.unlinkSync(oldPath);
					}
				}
			}

			// Lưu ảnh mới
			const file = photo[0];
			const ext = path.extname(file.newFilename);
			const timestamp = Date.now();
			photoName = `about_${timestamp}${ext}`;
			
			const newPath = path.join(uploadDir, photoName);
			fs.renameSync(file.filepath, newPath);
		}

		// Chuẩn bị data để lưu
		const updateData = {
			ten_vi: fields.ten_vi?.[0],
			mota_vi: fields.mota_vi?.[0],
			noidung_vi: fields.noidung_vi?.[0],
			title_vi: fields.title_vi?.[0],
			keywords_vi: fields.keywords_vi?.[0],
			description_vi: fields.description_vi?.[0],
			ten_en: fields.ten_en?.[0],
			mota_en: fields.mota_en?.[0],
			noidung_en: fields.noidung_en?.[0],
			title_en: fields.title_en?.[0],
			keywords_en: fields.keywords_en?.[0],
			description_en: fields.description_en?.[0],
			tenkhongdau: fields.tenkhongdau?.[0],
			hienthi: parseInt(fields.hienthi?.[0] || '1'),
			...(photoName && { photo: photoName }),
		};

		const id = fields.id?.[0];
		if (id) {
			// Lấy nội dung cũ
			const [oldData]: any = await new Promise((resolve, reject) => {
				db.query(
					'SELECT noidung_vi, noidung_en FROM table_about WHERE id = ?',
					[id],
					(err, results) => {
						if (err) reject(err);
						else resolve(results);
					}
				);
			});

			if (oldData) {
				// Xóa ảnh từ nội dung cũ
				deleteImagesFromContent(oldData.noidung_vi || '', fields.noidung_vi?.[0] || '');
				deleteImagesFromContent(oldData.noidung_en || '', fields.noidung_en?.[0] || '');
			}

			// Tiếp tục với phần update như cũ
			await new Promise((resolve, reject) => {
				db.query(
					'UPDATE table_about SET ? WHERE id = ?',
					[updateData, id],
					(err, result) => {
						if (err) reject(err);
						else resolve(result);
					}
				);
			});
		} else {
			// Insert
			await new Promise((resolve, reject) => {
				db.query(
					'INSERT INTO table_about SET ?',
					updateData,
					(err, result) => {
						if (err) reject(err);
						else resolve(result);
					}
				);
			});
		}

		res.status(200).json({ message: "Data saved successfully" });
	} catch (error) {
		console.error("Error saving about:", error);
		res.status(500).json({ 
			error: "Internal Server Error",
			details: error instanceof Error ? error.message : "Unknown error"
		});
	}
}

// Thêm hàm helper để tìm và xóa ảnh từ nội dung HTML
const deleteImagesFromContent = (oldContent: string, newContent: string) => {
	const oldImages: string[] = oldContent.match(/\/uploads\/editor\/[^"'\s)]+/g) || [];
	const newImages: string[] = newContent.match(/\/uploads\/editor\/[^"'\s)]+/g) || [];
	
	const imagesToDelete = oldImages.filter(img => !newImages.includes(img));
	
	imagesToDelete.forEach(imagePath => {
		const fullPath = path.join(process.cwd(), 'public', imagePath);
		if (fs.existsSync(fullPath)) {
			fs.unlinkSync(fullPath);
		}
	});
};
