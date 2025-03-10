import React from "react";

interface SortSelectProps {
	value: string;
	onChange: (value: string) => void;
	t: (key: string) => string;
}

export default function SortSelect({ value, onChange, t }: SortSelectProps) {
	return (
		<select
			title="Sort"
			value={value}
			onChange={(e) => onChange(e.target.value)}
			className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
		>
			<option value="newest">{t("sort.newest")}</option>
			<option value="oldest">{t("sort.oldest")}</option>
			<option value="nameAsc">{t("sort.nameAsc")}</option>
			<option value="nameDesc">{t("sort.nameDesc")}</option>
			<option value="priorityAsc">{t("sort.priorityAsc")}</option>
			<option value="priorityDesc">{t("sort.priorityDesc")}</option>
		</select>
	);
}
