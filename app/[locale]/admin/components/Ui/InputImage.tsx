import Image from "next/image";

interface InputImageProps {
	title: string;
	name: string;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	imagePreview: string | null;
	currentImage?: string;
	t: (key: string) => string;
}

const InputImage = ({
	title,
	name,
	onChange,
	imagePreview,
	currentImage,
	t,
}: InputImageProps) => {
	return (
		<div>
			<label className="block text-sm font-medium mb-1">{title}</label>
			<div className="space-y-2">
				<input
					type="file"
					name={name}
					accept="image/*"
					onChange={onChange}
					placeholder="Chọn hình ảnh"
					className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
				/>
				{(imagePreview || currentImage) && (
					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-2">
							<p className="text-sm text-gray-500">{t("original")}:</p>
							<div className="relative aspect-video w-full">
								<Image
									src={imagePreview || currentImage || ""}
									alt="Preview"
									fill
									className="object-contain rounded-md border border-gray-200"
									priority
								/>
							</div>
						</div>
						<div className="space-y-2">
							<p className="text-sm text-gray-500">{t("thumbnail")}:</p>
							<div className="relative aspect-video w-full">
								<Image
									src={imagePreview || currentImage || ""}
									alt="Thumbnail Preview"
									fill
									className="object-cover rounded-md border border-gray-200"
									priority
								/>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default InputImage;
