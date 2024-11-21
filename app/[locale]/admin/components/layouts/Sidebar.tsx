import Image from "next/image";
import Menu from "../Ui/Menu";
import Switch from "@/app/components/Ui/Switch";
import React, { useState } from "react";

interface SidebarProps {
	toggleDarkMode: () => void;
}

export default function Sidebar({ toggleDarkMode }: SidebarProps) {
	const [darkMode, setDarkMode] = useState(false);

	const handleToggle = (checked: boolean) => {
		setDarkMode(checked);
		toggleDarkMode();
	};

	return (
		<div className="w-64 bg-gray-800 text-white p-6 flex flex-col justify-evenly items-center gap-5 shadow-lg shadow-orange-950">
			<div className="text-center mb-6 w-20 h-20">
				<Image
					src="/images/shortcut.png"
					alt="Logo"
					className="logo top-4 w-full h-full relative"
					width={150}
					height={50}
				/>
			</div>
			<Menu />
			<Switch checked={darkMode} onChange={handleToggle} />
		</div>
	);
}
