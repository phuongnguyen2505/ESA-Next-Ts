import { NextApiRequest, NextApiResponse } from "next";
import formidable from 'formidable';
import path from "path";
import fs from 'fs';

export const config = {
	api: {
		bodyParser: false,
	},
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method !== "POST") {
		return res.status(405).json({ error: "Method not allowed" });
	}

	try {
		// Cấu hình upload
		const uploadDir = path.join(process.cwd(), 'public/uploads/editor');
		const form = formidable({
			uploadDir,
			keepExtensions: true,
			maxFileSize: 5 * 1024 * 1024, // 5MB
		});

		// Parse form data
		const [, files] = await new Promise<[formidable.Fields, formidable.Files]>((resolve, reject) => {
			form.parse(req, (err, fields, files) => {
				if (err) reject(err);
				resolve([fields, files]);
			});
		});

		// Xử lý file ảnh
		const uploadedFile = files.upload;
		if (!uploadedFile || !Array.isArray(uploadedFile) || !uploadedFile[0]) {
			throw new Error('No file uploaded');
		}

		const file = uploadedFile[0];
		const ext = path.extname(file.newFilename);
		const timestamp = Date.now();
		const newFilename = `editor_${timestamp}${ext}`;
		const newPath = path.join(uploadDir, newFilename);

		// Đổi tên file
		fs.renameSync(file.filepath, newPath);

		res.status(200).json({
			url: `/uploads/editor/${newFilename}`,
			uploaded: true,
		});
	} catch (error) {
		console.error("Error uploading image:", error);
		res.status(500).json({
			uploaded: false,
			error: {
				message: error instanceof Error ? error.message : "Could not upload the image.",
			},
		});
	}
}
