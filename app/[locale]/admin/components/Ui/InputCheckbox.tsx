interface InputCheckboxProps {
	name: string;
	checked: boolean;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	label: string;
	placeholder: string;
}

export default function InputCheckbox({
	name,
	checked,
	onChange,
	label,
	placeholder,
}: InputCheckboxProps) {
	return (
		<div className="flex items-center space-x-2">
			<input
				type="checkbox"
				name={name}
				checked={checked}
				onChange={onChange}
				className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
				placeholder={placeholder}
			/>
			<label className="text-sm font-medium">{label}</label>
		</div>
	);
}
