import type { NextApiRequest, NextApiResponse } from "next";
import { serialize } from "cookie";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method !== 'POST') {
		return res.status(405).json({ message: 'Method not allowed' });
	}

	try {
		res.setHeader(
			"Set-Cookie",
			serialize("token", "", {
				httpOnly: true,
				secure: process.env.NODE_ENV === 'production',
				sameSite: 'strict',
				path: "/",
				expires: new Date(0),
				maxAge: 0,
			})
		);

		return res.status(200).json({ success: true, message: "Logout successful" });
	} catch (error) {
		return res.status(500).json({ success: false, message: "Logout failed" });
	}
}
