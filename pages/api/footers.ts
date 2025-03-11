import { NextApiRequest, NextApiResponse } from "next";
import db from "@/lib/db";
import { Footer } from "../../types/Footer";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	try {
		db.query("SELECT * FROM table_footer", (err, results) => {
			if (err) {
				console.error("Error fetching footer:", err);
				res.status(500).json({ error: "Error fetching footer" });
				return;
			}
			const footers: Footer[] = (results as any[]).map((footer: any) => ({
				id: footer.id,
				noidung_vi: footer.noidung_vi,
				noidung_en: footer.noidung_en,
			}));
			res.status(200).json({ footers });
		});
	} catch (error) {
		console.error("Server error:", error);
		res.status(500).json({ error: "Server error" });
	}
}
