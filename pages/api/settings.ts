import { NextApiRequest, NextApiResponse } from "next";
import db from "@/lib/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method === "GET") {
		// Lấy thông tin setting
		try {
			const results: any[] = await new Promise((resolve, reject) => {
				db.query("SELECT * FROM table_setting LIMIT 1", (err, results) => {
									if (err) reject(err);
									else resolve(results as any[]);
								});
			});
			if (results.length > 0) {
				return res.status(200).json({ setting: results[0] });
			} else {
				return res.status(200).json({ setting: null });
			}
		} catch (error) {
			console.error("Error fetching setting:", error);
			return res.status(500).json({ error: "Internal Server Error", details: error });
		}
	} else if (req.method === "POST") {
		// Lưu (insert/update) setting
		try {
			const {
				title_en,
				keywords_en,
				description_en,
				ten_en,
				email,
				diachi_en,
				hotline,
				website,
				toado,
				analytics,
				headcode,
			} = req.body;

			// Kiểm tra xem đã có bản ghi setting chưa (lấy bản ghi đầu tiên)
			const existingSetting: any = await new Promise((resolve, reject) => {
				db.query("SELECT * FROM table_setting LIMIT 1", (err, results) => {
					if (err) reject(err);
					else resolve((results as any[])[0]);
				});
			});

			if (existingSetting) {
				// Nếu đã tồn tại, update theo id hiện có
				await new Promise((resolve, reject) => {
					db.query(
						`UPDATE table_setting SET 
              title_en = ?,
              keywords_en = ?,
              description_en = ?,
              ten_en = ?,
              email = ?,
              diachi_en = ?,
              hotline = ?,
              website = ?,
              toado = ?,
              analytics = ?,
              headcode = ?
            WHERE id = ?`,
						[
							title_en,
							keywords_en,
							description_en,
							ten_en,
							email,
							diachi_en,
							hotline,
							website,
							toado,
							analytics,
							headcode,
							existingSetting.id,
						],
						(err, result) => {
							if (err) reject(err);
							else resolve(result);
						},
					);
				});
				return res.status(200).json({ message: "Setting updated successfully" });
			} else {
				// Nếu chưa có, insert bản ghi mới
				const result: any = await new Promise((resolve, reject) => {
					db.query(
						`INSERT INTO table_setting 
              (title_en, keywords_en, description_en, ten_en, email, diachi_en, hotline, website, toado, analytics, headcode)
            VALUES (?,?,?,?,?,?,?,?,?,?,?)`,
						[
							title_en,
							keywords_en,
							description_en,
							ten_en,
							email,
							diachi_en,
							hotline,
							website,
							toado,
							analytics,
							headcode,
						],
						(err, result) => {
							if (err) reject(err);
							else resolve(result);
						},
					);
				});
				return res.status(201).json({
					message: "Setting created successfully",
					id: result.insertId,
				});
			}
		} catch (error) {
			console.error("Error saving setting:", error);
			return res.status(500).json({
				error: "Internal Server Error",
				details: error instanceof Error ? error.message : "Unknown error",
			});
		}
	} else {
		res.setHeader("Allow", ["GET", "POST"]);
		return res.status(405).json({ error: `Method ${req.method} not allowed` });
	}
}
