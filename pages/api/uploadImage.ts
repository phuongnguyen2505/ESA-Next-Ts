import { NextApiRequest, NextApiResponse } from "next";
import multer from "multer";
import path from "path";

const upload = multer({
	storage: multer.diskStorage({
		destination: "./public/uploads/editor",
		filename: (req, file, cb) => {
			const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
			cb(null, uniqueSuffix + path.extname(file.originalname));
		},
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
	if (req.method !== "POST") {
		return res.status(405).json({ error: "Method not allowed" });
	}

	try {
		await runMiddleware(req, res, upload.single("upload"));
		const file = (req as any).file;

		res.status(200).json({
			url: `/uploads/editor/${file.filename}`,
			uploaded: true,
		});
	} catch (error) {
		console.error("Error uploading image:", error);
		res.status(500).json({
			uploaded: false,
			error: {
				message: "Could not upload the image.",
			},
		});
	}
}

export const config = {
	api: {
		bodyParser: false,
	},
};
