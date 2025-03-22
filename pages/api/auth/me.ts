import type { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    const { token } = req.cookies;
    if (!token) {
        return res.status(401).json({ message: "Chưa đăng nhập" });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!);
        console.log("Decoded token:", decoded);  // Thêm log để kiểm tra
        return res.status(200).json({ ten: (decoded as any).ten });
    } catch (error) {
        console.error("Token không hợp lệ:", error);
        return res.status(401).json({ message: "Token không hợp lệ" });
    }
}
