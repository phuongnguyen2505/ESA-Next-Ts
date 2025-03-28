import { NextApiRequest, NextApiResponse } from "next";
import { v2 as cloudinary } from "cloudinary";

// Cấu hình Cloudinary (lưu ý: API secret không được công khai)
cloudinary.config({
	cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
	api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default function handler(req: NextApiRequest, res: NextApiResponse) {
	// Tính timestamp hiện tại
	const timestamp = Math.floor(Date.now() / 1000);

	// Lấy tham số từ query (GET) hoặc từ body (POST) nếu cần, nhưng ở đây sử dụng req.query
	const { source, upload_preset, folder } = req.query;

	// Kiểm tra bắt buộc source
	if (!source) {
		return res.status(400).json({ error: "Missing parameter: source is required" });
	}

	// Nếu upload_preset không có, dùng giá trị mặc định "Vesa-Products"
	const preset = upload_preset ? upload_preset.toString() : "Vesa-Products";

	// Tạo đối tượng paramsToSign, bao gồm folder nếu có
	const paramsToSign: { [key: string]: string | number } = {
		source: source.toString(),
		timestamp,
		upload_preset: preset,
	};

	if (folder) {
		paramsToSign.folder = folder.toString();
	}

	if (!process.env.CLOUDINARY_API_SECRET) {
		throw new Error("CLOUDINARY_API_SECRET is not defined");
	}

	// Tính chữ ký dựa trên các tham số đã cho
	const signature = cloudinary.utils.api_sign_request(
		paramsToSign,
		process.env.CLOUDINARY_API_SECRET,
	);

	return res.status(200).json({ signature, timestamp });
}
