import type { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import db from "@/lib/db";
import path from "path";
import fs from "fs";

export const config = {
	api: {
		bodyParser: false,
	},
};

const saveFile = async (file: formidable.File, uploadDir: string) => {
	const timestamp = Date.now();
	const originalName = file.originalFilename || "default";
	const ext = path.extname(originalName);
	const baseName = path.basename(originalName, ext);
	const newFileName = `${baseName}-${timestamp}${ext}`;
	const newPath = path.join(uploadDir, newFileName);

	try {
		await fs.promises.copyFile(file.filepath, newPath);
		await fs.promises.unlink(file.filepath);
		return newFileName;
	} catch (error) {
		console.error(`Error saving file ${newFileName}:`, error);
		if (error instanceof Error) {
			throw new Error(`Failed to save file: ${error.message}`);
		} else {
			throw new Error("Failed to save file");
		}
	}
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	const { id } = req.query;

	if (req.method === "PUT") {
		try {
			// Đảm bảo thư mục uploads tồn tại
			const uploadDir = path.join(process.cwd(), "public/uploads/products");
			if (!fs.existsSync(uploadDir)) {
				fs.mkdirSync(uploadDir, { recursive: true });
			}

			const form = formidable({
				uploadDir,
				keepExtensions: true,
				maxFileSize: 5 * 1024 * 1024, // 5MB
			});

			// Parse form data
			const [fields, files] = await new Promise<[formidable.Fields, formidable.Files]>(
				(resolve, reject) => {
					form.parse(req, (err, fields, files) => {
						if (err) {
							console.error("Form parse error:", err);
							reject(err);
						} else {
							resolve([fields, files]);
						}
					});
				},
			);

			// Xử lý file ảnh mới (nếu có)
			// Ưu tiên sử dụng URL Cloudinary được gửi qua fields.photo nếu có
			let photoName = "";
			if (
				fields.photo &&
				typeof fields.photo[0] === "string" &&
				(fields.photo[0].startsWith("http://") || fields.photo[0].startsWith("https://"))
			) {
				photoName = fields.photo[0];
			} else {
				const photo = files.photo;
				if (photo && Array.isArray(photo) && photo[0]) {
					try {
						// Lấy thông tin ảnh cũ để xóa
						const [oldProduct] = await new Promise<{ photo: string }[]>((resolve, reject) => {
							db.query(
								"SELECT photo FROM table_product WHERE id = ?",
								[id],
								(err, results) => {
									if (err) reject(err);
									else resolve(results as { photo: string }[]);
								},
							);
						});

						// Xóa ảnh cũ nếu tồn tại
						if (oldProduct && oldProduct.photo) {
							const oldPhotoPath = path.join(uploadDir, oldProduct.photo);
							if (fs.existsSync(oldPhotoPath)) {
								fs.unlinkSync(oldPhotoPath);
							}
						}

						// Lưu ảnh mới từ file cục bộ
						const file = photo[0];
						photoName = await saveFile(file, uploadDir);
					} catch (error) {
						console.error("Error handling photo:", error);
						throw error;
					}
				}
			}

			// Xử lý file đính kèm (nếu có)
			const file = files.file;
			let fileName = "";
			if (file && Array.isArray(file) && file[0]) {
				const fileItem = file[0];
				fileName = await saveFile(fileItem, uploadDir);
			}

			// Chuẩn bị dữ liệu cập nhật
			const updateData: { [key: string]: any } = {
				id_list: fields.id_list?.[0],
				id_cat: fields.id_cat?.[0],
				ten_vi: fields.ten_vi?.[0],
				ten_en: fields.ten_en?.[0],
				masp: fields.masp?.[0],
				mota_vi: fields.mota_vi?.[0],
				mota_en: fields.mota_en?.[0],
				noidung_vi: fields.noidung_vi?.[0] || "",
				noidung_en: fields.noidung_en?.[0] || "",
				title_vi: fields.title_vi?.[0],
				title_en: fields.title_en?.[0],
				keywords_vi: fields.keywords_vi?.[0],
				keywords_en: fields.keywords_en?.[0],
				description_vi: fields.description_vi?.[0],
				description_en: fields.description_en?.[0],
				photo: photoName || undefined,
				file: fileName || undefined,
				stt: parseInt(fields.stt?.[0] || "1"),
				hienthi: parseInt(fields.hienthi?.[0] || "1"),
				noibat: parseInt(fields.noibat?.[0] || "0"),
				ngaysua: new Date(),
				tenkhongdau: fields.tenkhongdau?.[0],
			};

			// Loại bỏ các trường undefined
			Object.keys(updateData).forEach(
				(key) => updateData[key] === undefined && delete updateData[key],
			);

			// Cập nhật database
			await new Promise((resolve, reject) => {
				db.query(
					"UPDATE table_product SET ? WHERE id = ?",
					[updateData, id],
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

			res.status(200).json({ message: "Updated successfully" });
		} catch (error) {
			console.error("Error updating product:", error);
			res.status(500).json({
				error: "Internal Server Error",
				details: error instanceof Error ? error.message : "Unknown error",
			});
		}
	} else {
		res.setHeader("Allow", ["PUT"]);
		res.status(405).json({ error: `Method ${req.method} Not Allowed` });
	}
}
