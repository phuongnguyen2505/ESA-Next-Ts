"use client";

import Link from "next/link";

interface BreadcrumbProps {
	pageName: string;
	url: string;
}

const Breadcrumb = ({ pageName, url }: BreadcrumbProps) => {
	return (
		<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
			<h2 className="text-[20px] font-bold leading-[30px] capitalize text-dark dark:text-white">
				{pageName}
			</h2>

			{/* <nav>
				<ol className="flex items-center gap-2">
					<li>
						<Link className="font-medium" href={url}>
							
						</Link>
					</li>
					<li className="font-medium text-primary">{pageName}</li>
				</ol>
			</nav> */}
		</div>
	);
};

export default Breadcrumb;
