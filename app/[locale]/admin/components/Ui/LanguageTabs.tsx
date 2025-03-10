interface LanguageTabsProps {
	activeTab: "vi" | "en";
	onTabChange: (tab: "vi" | "en") => void;
	t: (key: string) => string;
}

const LanguageTabs = ({ activeTab, onTabChange, t }: LanguageTabsProps) => {
	return (
		<div className="flex space-x-2 border-b border-gray-200">
			<button
				type="button"
				className={`px-4 py-2 font-medium ${
					activeTab === "vi"
						? "text-blue-600 border-b-2 border-blue-600"
						: "text-gray-500 hover:text-gray-700 dark:text-white dark:hover:text-gray-300"
				}`}
				onClick={() => onTabChange("vi")}
			>
				{t("vi")}
			</button>
			<button
				type="button"
				className={`px-4 py-2 font-medium ${
					activeTab === "en"
						? "text-blue-600 border-b-2 border-blue-600"
						: "text-gray-500 hover:text-gray-700 dark:text-white dark:hover:text-gray-300"
				}`}
				onClick={() => onTabChange("en")}
			>
				{t("en")}
			</button>
		</div>
	);
};

export default LanguageTabs;
