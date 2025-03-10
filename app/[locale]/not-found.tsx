import Link from "next/link";

export default function NotFound() {
	return (
		<div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
			<h2 className="text-2xl font-bold text-red-600">Không tìm thấy trang</h2>
			<p className="mt-2 text-gray-700">Trang bạn đang tìm kiếm không tồn tại</p>
			<Link href="/vi" className="mt-4 text-blue-500 hover:underline">Quay về trang chủ</Link>
		</div>
	);
}
