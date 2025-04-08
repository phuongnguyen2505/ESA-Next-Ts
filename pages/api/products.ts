import { NextApiRequest, NextApiResponse } from "next";
import db from "@/lib/db";
import formidable from "formidable";
import path from "path";
import fs from "fs";
import { v2 as cloudinary } from "cloudinary";

// Cấu hình Cloudinary (nên lưu các thông tin này trong biến môi trường)
cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const config = {
	api: {
		bodyParser: false,
	},
};

function getFieldValue(value: unknown): string | undefined {
	if (typeof value === "string") return value;
	if (Array.isArray(value) && typeof value[0] === "string") return value[0];
	return undefined;
}

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
             ORDER BY p.ten_en ASC, p.id DESC`,
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
				sptb: item.sptb,
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
			// Đảm bảo thư mục upload tồn tại (cho ảnh)
			const uploadDir = path.join(process.cwd(), "public/uploads/products");
			if (!fs.existsSync(uploadDir)) {
				fs.mkdirSync(uploadDir, { recursive: true });
			}

			const form = formidable({
				uploadDir,
				keepExtensions: true,
				maxFileSize: 5 * 1024 * 1024, // 5MB
			});

			const [fields, files] = await new Promise<[formidable.Fields, formidable.Files]>(
				(resolve, reject) => {
					form.parse(req, (err, fields, files) => {
						if (err) {
							console.error("Form parsing error:", err);
							reject(err);
						} else {
							resolve([fields, files]);
						}
					});
				},
			);

			// Xử lý upload ảnh (photo)
			let photoUrl = "";
			const photoField = getFieldValue(fields.photo);
			if (photoField && photoField.startsWith("http")) {
				photoUrl = photoField;
			} else if (files.photo && Array.isArray(files.photo) && files.photo[0]) {
				const file = files.photo[0];
				const timestamp = Date.now();
				const originalName = file.originalFilename || "default.jpg";
				const ext = path.extname(originalName);
				const baseName = path.basename(originalName, ext);
				photoUrl = `${baseName}-${timestamp}${ext}`;

				try {
					const newPath = path.join(uploadDir, photoUrl);
					await fs.promises.copyFile(file.filepath, newPath);
					fs.unlinkSync(file.filepath);
				} catch (error) {
					console.error("Error saving photo:", error);
					throw new Error("Failed to save photo");
				}
			}

			// Xử lý file đính kèm (file PDF hoặc file khác)
			let fileName = "";
			const fileField = getFieldValue(fields.file);
			if (fileField && fileField.startsWith("http")) {
				// Nếu đã có URL (ví dụ: từ Cloudinary)
				fileName = fileField;
			} else if (files.file && Array.isArray(files.file) && files.file[0]) {
				const fileItem = files.file[0];
				// Nếu file là PDF thì upload lên Cloudinary với resource_type: "raw"
				if (fileItem.mimetype === "application/pdf") {
					const result = await cloudinary.uploader.upload(fileItem.filepath, {
						resource_type: "raw",
					});
					fileName = result.secure_url;
					// Xóa file tạm nếu cần
					fs.unlinkSync(fileItem.filepath);
				} else {
					// Nếu không phải PDF, xử lý upload cục bộ (hoặc có thể bổ sung xử lý cho các loại file khác)
					const timestamp = Date.now();
					const originalName = fileItem.originalFilename || "default_name";
					const ext = path.extname(originalName);
					const baseName = path.basename(originalName, ext);
					fileName = `${baseName}-${timestamp}${ext}`;

					try {
						const newPath = path.join(uploadDir, fileName);
						await fs.promises.copyFile(fileItem.filepath, newPath);
						fs.unlinkSync(fileItem.filepath);
					} catch (error) {
						console.error("Error saving file:", error);
						throw new Error("Failed to save attachment");
					}
				}
			}

			const insertData = {
				id_list: getFieldValue(fields.id_list),
				id_cat: getFieldValue(fields.id_cat),
				ten_en: getFieldValue(fields.ten_en),
				masp: getFieldValue(fields.masp),
				sptb: getFieldValue(fields.sptb),
				mota_en: getFieldValue(fields.mota_en),
				noidung_en: getFieldValue(fields.noidung_en) || "",
				title_en: getFieldValue(fields.title_en),
				keywords_en: getFieldValue(fields.keywords_en),
				description_en: getFieldValue(fields.description_en),
				photo: photoUrl,
				file: fileName || "",
				stt: parseInt(getFieldValue(fields.stt) || "1"),
				hienthi: parseInt(getFieldValue(fields.hienthi) || "1"),
				noibat: parseInt(getFieldValue(fields.noibat) || "0"),
				ngaytao: new Date(),
				ngaysua: new Date(),
				tenkhongdau: getFieldValue(fields.tenkhongdau),
				gia: parseFloat(getFieldValue(fields.gia) || "0"),
				luotxem: 0,
			};

			try {
				await new Promise((resolve, reject) => {
					db.query("INSERT INTO table_product SET ?", insertData, (err, result) => {
						if (err) {
							console.error("Database insert error:", err);
							reject(err);
						} else {
							resolve(result);
						}
					});
				});

				return res.status(201).json({
					success: true,
					message: "Tạo thành công",
					data: { photo: photoUrl, file: fileName },
				});
			} catch (dbError) {
				// Nếu DB insert thất bại, xóa các file đã upload (nếu có)
				if (photoUrl) {
					const photoPath = path.join(uploadDir, photoUrl);
					if (fs.existsSync(photoPath)) fs.unlinkSync(photoPath);
				}
				if (fileName && !fileName.startsWith("http")) {
					const filePath = path.join(uploadDir, fileName);
					if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
				}
				throw dbError;
			}
		} catch (error) {
			console.error("Error creating product:", error);
			return res.status(500).json({
				success: false,
				error: "Internal Server Error",
				details: error instanceof Error ? error.message : "Unknown error",
			});
		}
	} else if (req.method === "PUT") {
		try {
			const uploadDir = path.join(process.cwd(), "public/uploads/products");
			if (!fs.existsSync(uploadDir)) {
				fs.mkdirSync(uploadDir, { recursive: true });
			}

			const form = formidable({
				uploadDir,
				keepExtensions: true,
				maxFileSize: 5 * 1024 * 1024,
			});

			const [fields, files] = await new Promise<[formidable.Fields, formidable.Files]>(
				(resolve, reject) => {
					form.parse(req, (err, fields, files) => {
						if (err) return reject(err);
						resolve([fields, files]);
					});
				},
			);

			// Xử lý upload ảnh (photo)
			let photoUrl = "";
			const photoField = getFieldValue(fields.photo);
			if (photoField && photoField.startsWith("http")) {
				photoUrl = photoField;
			} else if (files.photo && Array.isArray(files.photo) && files.photo[0]) {
				const file = files.photo[0];
				const timestamp = Date.now();
				const originalName = file.originalFilename || "default.jpg";
				const ext = path.extname(originalName);
				const baseName = path.basename(originalName, ext);
				photoUrl = `${baseName}-${timestamp}${ext}`;
				const newPath = path.join(uploadDir, photoUrl);
				await fs.promises.copyFile(file.filepath, newPath);
				fs.unlinkSync(file.filepath);
			}

			// Xử lý file đính kèm (file PDF từ Cloudinary hoặc upload cục bộ)
			let fileName = "";
			const fileField = getFieldValue(fields.file);
			if (fileField && fileField.startsWith("http")) {
				fileName = fileField;
			} else if (files.file && Array.isArray(files.file) && files.file[0]) {
				const fileItem = files.file[0];
				if (fileItem.mimetype === "application/pdf") {
					const result = await cloudinary.uploader.upload(fileItem.filepath, {
						resource_type: "raw",
					});
					fileName = result.secure_url;
					fs.unlinkSync(fileItem.filepath);
				} else {
					const timestamp = Date.now();
					const originalName = fileItem.originalFilename || "default_name";
					const ext = path.extname(originalName);
					const baseName = path.basename(originalName, ext);
					fileName = `${baseName}-${timestamp}${ext}`;
					const newPath = path.join(uploadDir, fileName);
					await fs.promises.copyFile(fileItem.filepath, newPath);
					fs.unlinkSync(fileItem.filepath);
				}
			}

			const updateData = {
				id_list: getFieldValue(fields.id_list),
				id_cat: getFieldValue(fields.id_cat),
				ten_en: getFieldValue(fields.ten_en),
				masp: getFieldValue(fields.masp),
				sptb: getFieldValue(fields.sptb),
				mota_en: getFieldValue(fields.mota_en),
				noidung_en: getFieldValue(fields.noidung_en) || "",
				title_en: getFieldValue(fields.title_en),
				keywords_en: getFieldValue(fields.keywords_en),
				description_en: getFieldValue(fields.description_en),
				photo: photoUrl,
				file: fileName,
				stt: parseInt(getFieldValue(fields.stt) || "1"),
				hienthi: parseInt(getFieldValue(fields.hienthi) || "1"),
				noibat: parseInt(getFieldValue(fields.noibat) || "0"),
				ngaysua: new Date(),
				tenkhongdau: getFieldValue(fields.tenkhongdau),
				gia: parseFloat(getFieldValue(fields.gia) || "0"),
			};

			// Giả sử id sản phẩm được truyền qua fields để xác định sản phẩm cần cập nhật
			const productId = getFieldValue(fields.id);
			if (!productId) {
				throw new Error("Missing product id");
			}

			await new Promise((resolve, reject) => {
				db.query(
					"UPDATE table_product SET ? WHERE id = ?",
					[updateData, productId],
					(err, result) => {
						if (err) {
							console.error("Database update error:", err);
							reject(err);
						} else {
							resolve(result);
						}
					},
				);
			});

			return res.status(200).json({
				success: true,
				message: "Update successful",
				data: { photo: photoUrl, file: fileName },
			});
		} catch (error) {
			console.error("Error updating product:", error);
			return res.status(500).json({
				success: false,
				error: "Internal Server Error",
				details: error instanceof Error ? error.message : "Unknown error",
			});
		}
	} else {
		return res
			.status(405)
			.json({ success: false, error: "Phương thức không được phép" });
	}
}
