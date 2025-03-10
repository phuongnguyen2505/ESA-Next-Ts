import React from "react";

interface InputSmProps {
	title: string;
	onChange: any;
	placeholder: string;
	value?: string;
	name: string;
	readOnly?: boolean;
	disabled?: boolean;
	required?: boolean;
}

export default function InputSm({ title, onChange, placeholder, value, name, readOnly, disabled, required }: InputSmProps) {
	return (
		<>
			<label className="block text-sm font-medium mb-1">
				{title}
			</label>
			<input
				type="text"
				name={name}
				onChange={onChange}
				placeholder={placeholder}
				className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-[#333333] ${
					disabled ? 'bg-gray-100 cursor-not-allowed' : ''
				}`}
				value={value}
				readOnly={readOnly}
				disabled={disabled}
				required={required}
			/>
		</>
	);
}
