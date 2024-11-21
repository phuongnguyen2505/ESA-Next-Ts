import LocaleSwitcher from "@/app/components/Ui/LocaleSwitcher";

const Header = () => {
	return (
		<header className="flex justify-between items-center bg-gray-800 text-white p-4">
			<div className="flex items-center space-x-4">
				<span className="text-lg">Admin Dashboard</span>
			</div>
			<div className="flex items-center space-x-6">
				<LocaleSwitcher />
				<span>Welcome, User</span>
				<button className="py-2 px-4 bg-gray-600 text-white rounded hover:bg-gray-500 transition">
					Logout
				</button>
			</div>
		</header>
	);
};

export default Header;
