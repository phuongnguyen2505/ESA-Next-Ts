import { useTranslations } from "next-intl";

interface ModalProps {
	isOpen: boolean;
	message: string;
	type: "success" | "error";
	onClose: () => void;
}

export default function Modal({ isOpen, message, type, onClose }: ModalProps) {
	const t = useTranslations("admin");
	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center">
			{/* Overlay */}
			<div className="fixed inset-0 bg-black opacity-50" onClick={onClose}></div>

			{/* Modal */}
			<div className="relative bg-white rounded-lg p-6 shadow-xl max-w-sm w-full mx-4">
				<div className="text-center">
					{/* Icon */}
					{type === "success" ? (
						<div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
							<svg
								className="h-6 w-6 text-green-600"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="M5 13l4 4L19 7"
								/>
							</svg>
						</div>
					) : (
						<div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
							<svg
								className="h-6 w-6 text-red-600"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="M6 18L18 6M6 6l12 12"
								/>
							</svg>
						</div>
					)}

					{/* Message */}
					<div className="mt-2 text-center">
						<p
							className={`text-sm ${
								type === "success" ? "text-green-600" : "text-red-600"
							}`}
						>
							{message}
						</p>
					</div>

					{/* Button */}
					<div className="mt-5">
						<button
							type="button"
							className={`inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white 
                  ${
							type === "success"
								? "bg-green-600 hover:bg-green-700"
								: "bg-red-600 hover:bg-red-700"
						}
                  focus:outline-none focus:ring-2 focus:ring-offset-2 ${
							type === "success" ? "focus:ring-green-500" : "focus:ring-red-500"
						}`}
							onClick={onClose}
						>
							{t("close")}
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
