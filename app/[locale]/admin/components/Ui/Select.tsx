import React from "react";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
	title?: string;
	error?: string;
	children: React.ReactNode;
}

const Select: React.FC<SelectProps> = ({
	title,
	error,
	children,
	className = "",
	...props
}) => {
	return (
		<div className="w-full">
			{title && (
				<label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
					{title}
				</label>
			)}
			<select
				className={`
                    w-full px-3 py-2 
                    border border-gray-300 
                    rounded-md shadow-sm 
                    focus:outline-none 
                    focus:ring-primary-500 
                    focus:border-primary-500 
                    dark:bg-gray-700 
                    dark:border-gray-600 
                    dark:text-white
                    ${error ? "border-red-500" : ""}
                    ${props.disabled ? "bg-gray-100 cursor-not-allowed" : ""}
                    ${className}
                `}
				{...props}
			>
				{children}
			</select>
			{error && <p className="mt-1 text-sm text-red-500">{error}</p>}
		</div>
	);
};

export default Select;
