import type { NextApiRequest, NextApiResponse } from "next";
import { serialize } from "cookie";
import { executeQuery } from "@/lib/db";
import jwt from "jsonwebtoken";

type User = {
	id: number;
	username: string;
	password: string;
	ten: string;
	dienthoai: string;
	role: string;
	hienthi: number;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method !== "POST") {
		res.setHeader("Allow", ["POST"]);
		return res.status(405).end(`Method ${req.method} Not Allowed`);
	}

	try {
		const { username, password } = req.body;
		console.log("Login attempt:", username, password);

		const results: User[] =
			(await executeQuery<User[]>(
				"SELECT * FROM table_user WHERE username = ? AND hienthi = 1 LIMIT 1",
				[username],
			));

		if (results.length === 0) {
			console.log("User not found for username:", username);
			return res.status(401).json({ message: "Tài khoản hoặc mật khẩu không đúng" });
		}

		const user = results[0];
		console.log(
			"Found user:",
			user.username,
			"Stored password:",
			user.password,
			"Provided password:",
			password,
		);

		if (user.password.trim() !== password.trim()) {
			console.log("Password mismatch");
			return res.status(401).json({ message: "Tài khoản hoặc mật khẩu không đúng" });
			}
			
		const token = jwt.sign(
			{
				id: user.id,
				username: user.username,
				ten: user.ten,
				role: user.role,
			},
			process.env.JWT_SECRET || "",
			{ expiresIn: "1h" },
		);

		// Set token vào cookie HTTP-only
		res.setHeader(
			"Set-Cookie",
			serialize("token", token, {
				httpOnly: true,
				secure: process.env.NODE_ENV === "production",
				sameSite: "strict",
				path: "/",
				maxAge: 60 * 60, // 1 hour
			}),
		);

		console.log("Login successful. Token set.");
		return res.status(200).json({
			message: "Đăng nhập thành công",
			token: token,
		});
	} catch (error) {
		console.error("Login error:", error);
		return res.status(500).json({ message: "Internal Server Error" });
	}
}
