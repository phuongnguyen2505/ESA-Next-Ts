import { NextApiRequest, NextApiResponse } from "next";
import db from "@/lib/db";
import formidable from "formidable";
import path from "path";
import fs from "fs";

export const config = {
	api: {
		bodyParser: false,
	},
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method === "GET") {
		try {
			const results: any = await new Promise((resolve, reject) => {
				db.query(
					`SELECT p.*, 
                  pl.ten_en as list_ten_en,
                  pc.ten_en as cat_ten_en
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
				file: item.file,
				ten_en: item.ten_en,
				masp: item.masp,
				mota_en: item.mota_en,
				noidung_en: item.noidung_en,
				title_en: item.title_en,
				keywords_en: item.keywords_en,
				description_en: item.description_en,
				stt: item.stt,
				hienthi: item.hienthi,
				ngaytao: item.ngaytao,
				ngaysua: item.ngaysua,
				luotxem: item.luotxem,
				list_ten_en: item.list_ten_en,
				cat_ten_en: item.cat_ten_en,
				tenkhongdau: item.tenkhongdau,
				gia: item.gia,
			}));

			return res.status(200).json({ success: true, products });
		} catch (error) {
			console.error("Lỗi khi lấy sản phẩm:", error);
			return res.status(500).json({
				success: false,
				error: "Lỗi máy chủ nội bộ",
				details: error instanceof Error ? error.message : "Lỗi không xác định",
			});
		}
	} else if (req.method === "POST") {
		try {
			const uploadDir = path.join(process.cwd(), "public/uploads/products");

			const form = formidable({
				uploadDir,
				keepExtensions: true,
				maxFileSize: 5 * 1024 * 1024, // 5MB
			});

			const [fields, files] = await new Promise<[formidable.Fields, formidable.Files]>(
				(resolve, reject) => {
					form.parse(req, (err, fields, files) => {
						if (err) reject(err);
						else resolve([fields, files]);
					});
				},
			);

			// Xử lý file ảnh
			const photo = files.photo;
			let photoName = "";
			if (photo && Array.isArray(photo) && photo[0]) {
				const file = photo[0];
				photoName = file.originalFilename || "default.jpg";
				const newPath = path.join(uploadDir, photoName);
				fs.renameSync(file.filepath, newPath);
			}

			// Xử lý file đính kèm (nếu có)
			const file = files.file;
			let fileName = "";
			if (file && Array.isArray(file) && file[0]) {
				const fileItem = file[0];
				fileName = fileItem.originalFilename || "default_name";
				const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9_.-]/g, "_");
				const newPath = path.join(uploadDir, sanitizedFileName);
				fs.renameSync(fileItem.filepath, newPath);
			}

			const insertData = {
				id_list: fields.id_list?.[0],
				id_cat: fields.id_cat?.[0],
				ten_en: fields.ten_en?.[0],
				masp: fields.masp?.[0],
				mota_en: fields.mota_en?.[0],
				noidung_en: fields.noidung_en?.[0] || "",
				title_en: fields.title_en?.[0],
				keywords_en: fields.keywords_en?.[0],
				description_en: fields.description_en?.[0],
				photo: photoName,
				file: fileName || "",
				stt: parseInt(fields.stt?.[0] || "1"),
				hienthi: parseInt(fields.hienthi?.[0] || "1"),
				noibat: parseInt(fields.noibat?.[0] || "0"),
				ngaytao: new Date(),
				ngaysua: new Date(),
				tenkhongdau: fields.tenkhongdau?.[0],
				gia: parseFloat(fields.gia?.[0] || "0"),
				luotxem: 0,
			};

			await new Promise((resolve, reject) => {
				db.query("INSERT INTO table_product SET ?", insertData, (err, result) => {
					if (err) reject(err);
					else resolve(result);
				});
			});

			return res.status(201).json({ success: true, message: "Tạo thành công" });
		} catch (error) {
			console.error("Lỗi khi tạo sản phẩm:", error);
			return res.status(500).json({
				success: false,
				error: "Lỗi máy chủ nội bộ",
				details: error instanceof Error ? error.message : "Lỗi không xác định",
			});
		}
	} else {
		return res
			.status(405)
			.json({ success: false, error: "Phương thức không được phép" });
	}
}
