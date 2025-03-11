"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface LocaleSwitcherProps {
	className?: string;
	enClassName?: string;
}

export default function LocaleSwitcher({ className, enClassName }: LocaleSwitcherProps) {
	const pathname = usePathname();
	const currentLocale = pathname?.split("/")[1] || "en";

	const redirectedPathName = (locale: string) => {
		if (!pathname) return "/";
		const segments = pathname.split("/");
		segments[1] = locale;
		return segments.join("/");
	};

	return (
		<div className={`relative w-32 overflow-hidden ${className}`}>
			<Link
				href={redirectedPathName("en")}
				className="block group"
			>
				<div className="relative h-8">
					{/* Current Language */}
					<div className={`flex ${enClassName} items-center gap-2 absolute inset-0 transition-transform duration-300 ease-in-out`}>
						<Image
							src={`/images/en.png`}
							alt="English"
							width={24}
							height={16}
							className="object-cover"
							priority
						/>
						<span className="text-sm">English</span>
					</div>
				</div>
			</Link>
		</div>
	);
}
