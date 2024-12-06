interface ModalProps {
	isOpen: boolean;
	message: string;
	type: "success" | "error" | "warning";
	onClose: () => void;
	showConfirmButton?: boolean;
	onConfirm?: () => void;
}

export default function Modal({
	isOpen,
	message,
	type,
	onClose,
	showConfirmButton = false,
	onConfirm,
}: ModalProps) {
	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center">
			<div className="fixed inset-0 bg-black opacity-50"></div>
			<div className="relative bg-white rounded-lg p-8 max-w-sm w-full mx-4">
				<div className="text-center">
					<p
						className={`text-lg ${
							type === "success"
								? "text-green-600"
								: type === "warning"
								? "text-yellow-600"
								: "text-red-600"
						}`}
					>
						{message}
					</p>
					<div className="mt-4 flex justify-center gap-4">
						{showConfirmButton && (
							<button
								onClick={onConfirm}
								className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
							>
								Xác nhận
							</button>
						)}
						<button
							onClick={onClose}
							className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
						>
							{showConfirmButton ? "Hủy" : "Đóng"}
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
