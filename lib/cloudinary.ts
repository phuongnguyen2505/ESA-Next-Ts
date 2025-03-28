import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadToCloudinary = async (file: string | Buffer) => {
	try {
		const result = await cloudinary.uploader.upload(file.toString(), {
			folder: "products",
			resource_type: "auto",
			upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET,
		});

		return {
			url: result.secure_url,
			public_id: result.public_id,
		};
	} catch (error: any) {
		console.error("Cloudinary upload error:", error);
		throw new Error(`Failed to upload to Cloudinary: ${error.message}`);
	}
};
