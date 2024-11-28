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
				title={t("name")}
				value={formData[`ten_${prefix}`]}
				onChange={(e) =>
					setFormData({ ...formData, [`ten_${prefix}`]: e.target.value })
				}
				placeholder={t("name")}
				name={`ten_${prefix}`}
			/>
			<InputTextarea
				title={t("description")}
				value={formData[`mota_${prefix}`] || ""}
				onChange={(e) =>
					setFormData({ ...formData, [`mota_${prefix}`]: e.target.value })
				}
				language={t(prefix)}
				placeholder={t("description")}
				name={`mota_${prefix}`}
			/>
			{/* Các trường khác tương tự */}
		</>
	);
};
