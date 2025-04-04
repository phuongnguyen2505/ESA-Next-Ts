interface ButtonProps {
	type: "button" | "submit" | "reset";
	onClick?: () => void;
	children: React.ReactNode;
	className?: string;
	disabled?: boolean;
}

const Button = ({ type, onClick, children, className, disabled }: ButtonProps) => {
	return (
		<button
			disabled={disabled}
			type={type}
			onClick={onClick}
			className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
		>
			{children}
		</button>
	);
};

export default Button;
