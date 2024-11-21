import { NextApiRequest, NextApiResponse } from "next";
import db from "@/lib/db";
import multer from "multer";

const upload = multer({
	storage: multer.diskStorage({
		destination: "./public/uploads",
		filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
	}),
});

const runMiddleware = (req: NextApiRequest, res: NextApiResponse, fn: Function) => {
	return new Promise((resolve, reject) => {
		fn(req, res, (result: any) => {
			if (result instanceof Error) {
				return reject(result);
			}
			return resolve(result);
		});
	});
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method !== 'POST') {
		return res.status(405).json({ error: 'Method not allowed' });
	}

	try {
		await runMiddleware(req, res, upload.single('photo'));
		
		const {
			id,
			ten_vi,
			mota_vi,
			noidung_vi,
			title_vi,
			keywords_vi,
			description_vi,
			ten_en,
			mota_en,
			noidung_en,
			title_en,
			keywords_en,
			description_en,
			tenkhongdau,
			hienthi,
		} = req.body;

		const photo = req.file ? `/uploads/${req.file.filename}` : null;

		try {
			if (id) {
				// Nếu có id, thực hiện cập nhật
				await new Promise((resolve, reject) => {
					const query = `
						UPDATE table_about SET
						ten_vi = ?, mota_vi = ?, noidung_vi = ?, title_vi = ?, keywords_vi = ?, description_vi = ?,
						ten_en = ?, mota_en = ?, noidung_en = ?, title_en = ?, keywords_en = ?, description_en = ?,
						tenkhongdau = ?, hienthi = ?, photo = ?
						WHERE id = ?`;
					const values = [
						ten_vi,
						mota_vi,
						noidung_vi,
						title_vi,
						keywords_vi,
						description_vi,
						ten_en,
						mota_en,
						noidung_en,
						title_en,
						keywords_en,
						description_en,
						tenkhongdau,
						hienthi,
						photo,
						id,
					];
					db.query(query, values, (err, result) => {
						if (err) {
							console.error("Error executing update query:", err);
							reject(err);
						} else {
							console.log("Update query result:", result);
							resolve(true);
						}
					});
				});
			} else {
				// Nếu không có id, thực hiện lưu mới
				await new Promise((resolve, reject) => {
					const query = `
						INSERT INTO table_about (ten_vi, mota_vi, noidung_vi, title_vi, keywords_vi, description_vi,
						ten_en, mota_en, noidung_en, title_en, keywords_en, description_en, tenkhongdau, hienthi, photo)
						VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
					const values = [
						ten_vi,
						mota_vi,
						noidung_vi,
						title_vi,
						keywords_vi,
						description_vi,
						ten_en,
						mota_en,
						noidung_en,
						title_en,
						keywords_en,
						description_en,
						tenkhongdau,
						hienthi,
						photo,
					];
					db.query(query, values, (err, result) => {
						if (err) {
							console.error("Error executing insert query:", err);
							reject(err);
						} else {
							console.log("Insert query result:", result);
							resolve(true);
						}
					});
				});
			}

			res.status(200).json({ message: "Data saved successfully" });
		} catch (error) {
			console.error("Error saving about:", error);
			res.status(500).json({ error: "Internal Server Error" });
		}
	} catch (error) {
		console.error("Error processing upload:", error);
		res.status(500).json({ error: "Error processing upload" });
	}
}

export const config = {
	api: {
		bodyParser: false, // Tắt bodyParser để multer có thể xử lý form data
	},
};
