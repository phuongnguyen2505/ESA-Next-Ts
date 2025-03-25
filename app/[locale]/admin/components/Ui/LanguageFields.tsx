import InputSm from "../../components/Ui/InputSm";
import InputTextarea from "../../components/Ui/InputArea";
import { ProductListFormData } from "@/types/productList";

interface LanguageFieldsProps {
	formData: Partial<ProductListFormData>;
	setFormData: (data: Partial<ProductListFormData>) => void;
	t: (key: string) => string;
	language: "vn" | "en";
}

export const LanguageFields = ({
	formData,
	setFormData,
	t,
	language,
}: LanguageFieldsProps) => {
	const prefix = language === "vn" ? "vn" : "en";

	return (
		<>
			<InputSm
				type="text"
				title={t("name")}
				value={String(formData[`ten_${prefix}` as keyof ProductListFormData] ?? "")}
				onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
					setFormData({ ...formData, [`ten_${prefix}`]: e.target.value })
				}
				placeholder={t("name")}
				name={`ten_${prefix}`}
			/>
			<InputTextarea
				title={t("description")}
				value={String(formData[`mota_${prefix}` as keyof ProductListFormData] ?? "")}
				onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
					setFormData({ ...formData, [`mota_${prefix}`]: e.target.value })
				}
				placeholder={t("description")}
				name={`mota_${prefix}`}
			/>
			{/* Các trường khác tương tự */}
		</>
	);
};
