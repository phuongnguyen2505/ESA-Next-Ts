import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function LocaleSwitcher() {
	const pathname = usePathname();
	const currentLocale = pathname?.split("/")[1] || "vi";

	const redirectedPathName = (locale: string) => {
		if (!pathname) return "/";
		const segments = pathname.split("/");
		segments[1] = locale;
		return segments.join("/");
	};

	return (
		<div className="relative w-32 overflow-hidden">
			<Link
				href={redirectedPathName(currentLocale === "vi" ? "en" : "vi")}
				className="block group"
				>
				<div className="relative h-8">
					{/* Current Language */}
					<div className="flex items-center gap-2 absolute inset-0 transition-transform duration-300 ease-in-out group-hover:-translate-y-full">
						<Image
							src={`/images/${currentLocale}.png`}
							alt={currentLocale === "vi" ? "Tiếng Việt" : "English"}
							width={24}
							height={16}
							className="object-cover"
							priority
						/>
						<span className="text-sm">
							{currentLocale === "vi" ? "Tiếng Việt" : "English"}
						</span>
					</div>

					{/* Alternative Language */}
					<div className="flex items-center gap-2 absolute inset-0 transition-transform duration-300 ease-in-out translate-y-full group-hover:translate-y-0">
						<Image
							src={`/images/${currentLocale === "vi" ? "en" : "vi"}.png`}
							alt={currentLocale === "vi" ? "English" : "Tiếng Việt"}
							width={24}
							height={16}
							className="object-cover"
							priority
						/>
						<span className="text-sm">
							{currentLocale === "vi" ? "English" : "Tiếng Việt"}
						</span>
					</div>
				</div>
			</Link>
		</div>
	);
}
