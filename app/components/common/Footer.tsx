import React, { useEffect, useState } from "react";

export default function Footer() {
	const [footers, setFooters] = useState([]);

	useEffect(() => {
		
		fetch("/api/footers")
			.then((res) => {
				if (!res.ok) {
					throw new Error("Failed to fetch footers");
				}
				return res.json();
			})
			.then((data) => {
				if (data && data.footers) {
					setFooters(data.footers);
				}
			})
			.catch((error) => {
				console.error("Error fetching footers:", error);
			});
	}, []);

	return (
		<footer className="rounded-t-xl bg-gray-800">
			<section className="flex mx-24 h-80 py-8 text-white">
				{footers.length > 0 ? (
					footers.map((footer: { id: string; noidung_vi: string }) => (
						<span key={footer.id} className="mr-4 flex flex-col">
							{footer.noidung_vi}
						</span>
					))
				) : (
					<span>Loading footer content...</span> 
				)}
			</section>
		</footer>
	);
}
