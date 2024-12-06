interface InputPriorityProps {
	title: string;
	value: number;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	name: string;
	min?: string;
	placeholder?: string;
	className?: string;
}

const InputPriority = ({
	title,
	value,
	onChange,
	name,
	min = "1",
	placeholder = "",
	className = "",
}: InputPriorityProps) => {
	return (
		<div className={`${className}`}>
			<label className="block text-sm font-medium mb-2">{title}</label>
			<input
				type="number"
				value={value}
				onChange={onChange}
				name={name}
				min={min}
				placeholder={placeholder}
				className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 dark:bg-white dark:text-black"
			/>
		</div>
	);
};

export default InputPriority;
