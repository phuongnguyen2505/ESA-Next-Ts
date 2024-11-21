import React from "react";

interface InputSmProps {
	title: string;
	value: any;
	onChange: any;
}

export default function InputSm({ title, value, onChange }: InputSmProps) {
	return (
		<>
			<label className="block text-sm font-medium mb-1">
				{title}
			</label>
			<input
				type="text"
				name="ten_vi"
				value={value || ""}
				onChange={onChange}
				placeholder="Tiêu đề"
				className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-[#333333]"
			/>
		</>
	);
}
