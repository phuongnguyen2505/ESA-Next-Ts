"use client";

import React, { useRef } from "react";

async function uploadFileToGoogleDrive(file: File) {
	const formData = new FormData();
	formData.append("file", file);
	// Thêm tham số folder để upload vào thư mục Vesa/PDF
	formData.append("folder", "Vesa/PDF");

	try {
		const response = await fetch("/api/drive", {
			method: "POST",
			body: formData,
		});
		if (!response.ok) {
			console.error("Upload failed:", await response.text());
			return null;
		}
		const data = await response.json();
		return data; // Ví dụ: { url: "https://drive.google.com/d/..." }
	} catch (error) {
		console.error("Upload error:", error);
		return null;
	}
}

interface GoogleDriveUploadButtonProps {
	onSuccess: (url: string) => void;
}

export default function GoogleDriveUploadButton({
	onSuccess,
}: GoogleDriveUploadButtonProps) {
	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleButtonClick = () => {
		fileInputRef.current?.click();
	};

	const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			const result = await uploadFileToGoogleDrive(file);
			if (result && result.url) {
				onSuccess(result.url);
			}
		}
	};

	return (
		<div>
			<button
				type="button"
				onClick={handleButtonClick}
				className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
			>
				Upload File to Google Drive
			</button>
			<input
				placeholder="Upload file"
                className="hidden"
				type="file"
				ref={fileInputRef}
				accept=".pdf, image/*"
				onChange={handleFileChange}
			/>
		</div>
	);
}
