import React from "react";

interface PaginationProps {
	currentPage: number;
	totalPages: number;
	onPageChange: (page: number) => void;
}

export default function Pagination({
	currentPage,
	totalPages,
	onPageChange,
}: PaginationProps) {
	return (
		<nav
			className="p-10 flex justify-center items-center gap-x-1 mt-4"
			aria-label="Pagination"
		>
			<button
				type="button"
				onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
				disabled={currentPage === 1}
				className="min-h-9.5 min-w-9.5 py-2 px-2.5 inline-flex justify-center items-center gap-x-2 text-sm rounded-lg text-gray-800 hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:text-white dark:hover:bg-white/10 dark:focus:bg-white/10"
				aria-label="Previous"
			>
				<svg
					className="shrink-0 size-3.5"
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
				>
					<path d="m15 18-6-6 6-6"></path>
				</svg>
				<span className="sr-only">Previous</span>
			</button>

			<div className="flex items-center gap-x-1">
				{Array.from({ length: totalPages }, (_, i) => (
					<button
						key={i + 1}
						onClick={() => onPageChange(i + 1)}
						type="button"
						className={`min-h-9.5 min-w-9.5 flex justify-center items-center py-2 px-4 text-sm rounded-lg focus:outline-hidden disabled:opacity-50 disabled:pointer-events-none ${
							currentPage === i + 1
								? "bg-gray-200 text-gray-800 focus:bg-gray-300 dark:bg-neutral-600 dark:text-white dark:focus:bg-neutral-500"
								: "text-gray-800 hover:bg-gray-100 focus:bg-gray-100 dark:text-white dark:hover:bg-white/10 dark:focus:bg-white/10"
						}`}
						aria-current={currentPage === i + 1 ? "page" : undefined}
					>
						{i + 1}
					</button>
				))}
			</div>

			<button
				type="button"
				onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
				disabled={currentPage === totalPages}
				className="min-h-9.5 min-w-9.5 py-2 px-2.5 inline-flex justify-center items-center gap-x-2 text-sm rounded-lg text-gray-800 hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:text-white dark:hover:bg-white/10 dark:focus:bg-white/10"
				aria-label="Next"
			>
				<span className="sr-only">Next</span>
				<svg
					className="shrink-0 size-3.5"
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
				>
					<path d="m9 18 6-6-6-6"></path>
				</svg>
			</button>
		</nav>
	);
}
