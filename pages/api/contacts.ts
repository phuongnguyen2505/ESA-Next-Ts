import type { NextApiRequest, NextApiResponse } from "next";
import { executeQuery } from "@/lib/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "GET") {
        try {
            const results = await executeQuery(
                "SELECT * FROM table_lienhe ORDER BY id DESC",
                []
            );
            console.log("Contacts fetched:", results);
            return res.status(200).json({ contacts: results });
        } catch (error) {
            console.error("Error fetching contacts:", error);
            return res.status(500).json({ message: "Error fetching contacts" });
        }
    } else if (req.method === "POST") {
        try {
            const { name, email, subject, message } = req.body;
            console.log("Contact form body:", req.body);

            // Định dạng thời gian hiện tại theo "hh:mm dd/mm/yyyy"
            const query = `
                INSERT INTO table_lienhe 
                (name, email, subject, message, stt, ngaytao) 
                VALUES (?, ?, ?, ?, 1, Now())
            `;
            const result = await executeQuery(query, [name, email, subject, message]);
            console.log("DB insert result:", result);

            return res.status(201).json({ message: "Contact form submitted successfully" });
        } catch (error) {
            console.error("Error in contact form submission:", error);
            return res.status(500).json({ message: "Error submitting contact form" });
        }
    } else if (req.method === "DELETE") {
        try {
            // Lấy id từ query, vd: /api/contacts?id=123
            const { id } = req.query;
            if (!id) {
                return res.status(400).json({ message: "Missing contact id" });
            }

            const result = await executeQuery("DELETE FROM table_lienhe WHERE id = ?", [id]);
            console.log("Deleted contact result:", result);
            return res.status(200).json({ message: "Contact deleted successfully" });
        } catch (error) {
            console.error("Error deleting contact:", error);
            return res.status(500).json({ message: "Error deleting contact" });
        }
    } else {
        res.setHeader("Allow", ["GET", "POST", "DELETE"]);
        return res.status(405).json({ message: `Method ${req.method} not allowed` });
    }
}
