import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function LocaleSwitcher() {
	const pathname = usePathname();

	const redirectedPathName = (locale: string) => {
		if (!pathname) return "/";
		const segments = pathname.split("/");
		segments[1] = locale;
		return segments.join("/");
	};
	return (
		<>
			<span className="w-20 h-5 flex gap-3">
				<Link href={redirectedPathName("vi")}>
					<Image
						src="/images/vn.png"
						alt="Ngôn ngữ"
						className="w-full h-full"
						width={50}
						height={30}
						priority
					/>  
				</Link>
				<Link href={redirectedPathName("en")}>
					<Image
						src="/images/en.png"
						alt="Languages"
						className="w-full h-full"
						width={50}
						height={30}
						priority
					/>
				</Link>
			</span>
		</>
	);
}
