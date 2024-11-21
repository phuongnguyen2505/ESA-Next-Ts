import React from "react";

interface SwitchProps {
	checked?: boolean;
	onChange?: (checked: boolean) => void;
}

export default function Switch({ checked = false, onChange }: SwitchProps) {
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		onChange?.(e.target.checked);
	};

	return (
		<label className="relative inline-block cursor-pointer">
			<input
				type="checkbox"
				className="sr-only"
				checked={checked}
				onChange={handleChange}
			/>
			<div className="w-12 h-5 bg-[rgb(135,150,165)] rounded-full relative">
				<div
					className={`
            pointer-events-none 
            absolute -top-1.5 w-8 h-8 
            rounded-full shadow-md
            flex items-center justify-center
            transition-all duration-150 ease-in-out
            ${
					checked
						? "translate-x-4 bg-[rgb(0,56,146)]"
						: "translate-x-0 bg-[rgb(232,89,15)]"
				}`}
				>
					{checked ? (
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="w-5 h-5"
							viewBox="0 0 20 20"
						>
							<path
								fill="#fff"
								d="M4.2 2.5l-.7 1.8-1.8.7 1.8.7.7 1.8.6-1.8L6.7 5l-1.9-.7-.6-1.8zm15 8.3a6.7 6.7 0 11-6.6-6.6 5.8 5.8 0 006.6 6.6z"
							/>
						</svg>
					) : (
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="w-5 h-5"
							viewBox="0 0 20 20"
						>
							<path
								fill="#fff"
								d="M9.305 1.667V3.75h1.389V1.667h-1.39zm-4.707 1.95l-.982.982L5.09 6.072l.982-.982-1.473-1.473zm10.802 0L13.927 5.09l.982.982 1.473-1.473-.982-.982zM10 5.139a4.872 4.872 0 00-4.862 4.86A4.872 4.872 0 0010 14.862 4.872 4.872 0 0014.86 10 4.872 4.872 0 0010 5.139zm0 1.389A3.462 3.462 0 0113.471 10a3.462 3.462 0 01-3.473 3.472A3.462 3.462 0 016.527 10 3.462 3.462 0 0110 6.528zM1.665 9.305v1.39h2.083v-1.39H1.666zm14.583 0v1.39h2.084v-1.39h-2.084zM5.09 13.928L3.616 15.4l.982.982 1.473-1.473-.982-.982zm9.82 0l-.982.982 1.473 1.473.982-.982-1.473-1.473zM9.305 16.25v2.083h1.389V16.25h-1.39z"
							/>
						</svg>
					)}
				</div>
			</div>
		</label>
	);
}
