interface AlertProps {
	message: string;
	type: "success" | "error";
}

const Alert = ({ message, type }: AlertProps) => {
	return (
		<div
			className={`mb-4 p-4 rounded-md text-white ${
				type === "success" ? "bg-green-500" : "bg-red-500"
			}`}
		>
			{message}
		</div>
	);
};

export default Alert;
