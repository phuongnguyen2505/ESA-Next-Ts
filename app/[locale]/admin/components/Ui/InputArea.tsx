interface InputTextareaProps {
	title: string;
	value: string;
	onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
	placeholder?: string;
	rows?: number;
	name?: string;
}

const InputTextarea = ({
	title,
	value,
	onChange,
	placeholder,
	rows = 3,
	name,
}: InputTextareaProps) => {
	return (
		<div>
			<label className="block text-sm font-medium mb-1">
				{title}
			</label>
			<textarea
				name={name}
				rows={rows}
				value={value || ""}
				onChange={onChange}
				placeholder={placeholder}
				className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-[#333333]"
			></textarea>
		</div>
	);
};

export default InputTextarea;
