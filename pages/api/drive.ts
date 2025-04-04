import type { NextApiRequest, NextApiResponse } from "next";

export const config = {
	api: {
		bodyParser: false,
	},
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method === "POST") {
		// Ở đây bạn sẽ xử lý file upload thực tế với Google Drive API.
		// Để kiểm tra, chúng ta trả về một URL giả lập.
		return res.status(200).json({ url: "https://drive.google.com/d/dummy-file-url" });
	} else {
		res.setHeader("Allow", ["POST"]);
		return res.status(405).json({ error: `Method ${req.method} not allowed` });
	}
}
