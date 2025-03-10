import { useTranslations } from "next-intl";
import React from "react";

interface UploadFileProps {
	onFileUpload: (file: File | null) => void;
	title: string;
	fileNames?: string[];
}

const UploadFile: React.FC<UploadFileProps> = ({ onFileUpload, title, fileNames }) => {
	const t = useTranslations("admin");
	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0] || null;
		onFileUpload(file);
	};

	return (
		<div className="upload-file">
			<label className="block text-sm font-medium mb-1">{title}</label>
			<input
				className="w-full px-3 py-2 border border-gray-300 bg-white text-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
				type="file"
				onChange={handleFileChange}
				placeholder="upload"
			/>
			<p className="text-sm">{t("file")}:</p>
			<div className="w-full px-3 py-2 border border-gray-300 bg-white text-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
				{fileNames}
			</div>
		</div>
	);
};

export default UploadFile;
