interface FilterItem {
	label: string;
	value: string;
}

interface FilterSidebarProps {
	title: string;
	filters: FilterItem[];
	selectedFilters: string[];
	onToggle: (value: string) => void;
	onReset?: () => void;
	showMoreCondition?: boolean;
	onToggleShowMore?: () => void;
	isExpanded?: boolean;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({
	title,
	filters,
	selectedFilters,
	onToggle,
	onReset,
	showMoreCondition,
	onToggleShowMore,
	isExpanded = false,
}) => {
	const truncateText = (text: string, maxLength: number = 20) =>
		text.length <= maxLength ? text : text.slice(0, maxLength) + "...";
	const truncateCate = (text: string, maxLength: number = 25) => {
		if (text.length <= maxLength) return text;
		let sub = text.slice(0, maxLength);
		const lastSpace = sub.lastIndexOf(" ");
		return (lastSpace !== -1 ? sub.slice(0, lastSpace) : sub) + "...";
	};
	const truncateTitle = (text: string, maxLength: number = 35) => {
		if (text.length <= maxLength) return text;
		let sub = text.slice(0, maxLength);
		const lastSpace = sub.lastIndexOf(" ");
		return (lastSpace !== -1 ? sub.slice(0, lastSpace) : sub) + "...";
	};
	return (
		<div className="mb-6">
			<h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
			<div className="flex flex-wrap gap-2">
				{onReset && (
					<button
						onClick={onReset}
						className={`px-3 py-1 rounded-full border ${
							selectedFilters.length === 0
								? "bg-blue-600 text-white"
								: "text-gray-700"
						}`}
					>
						All
					</button>
				)}
				{filters.map((filter, index) => (
					<button
						key={index}
						onClick={() => onToggle(filter.value)}
						className={`px-3 py-1 rounded-full border hover:text-white hover:bg-blue-400 ${
							selectedFilters.includes(filter.value)
								? "bg-blue-600 text-white"
								: "text-gray-700"
						}`}
					>
						{truncateCate(filter.label)}
					</button>
				))}
			</div>
			{showMoreCondition && onToggleShowMore && (
				<button
					onClick={onToggleShowMore}
					className="mt-2 text-sm text-blue-600 hover:underline"
				>
					{isExpanded ? "Show Less" : "Show More"}
				</button>
			)}
		</div>
	);
};

export default FilterSidebar;
