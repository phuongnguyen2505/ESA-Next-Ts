import Link from "next/link";

export default function NotFound() {
	return (
		<div>
			<h2>Không tìm thấy trang</h2>
			<p>Trang bạn đang tìm kiếm không tồn tại</p>
			<Link href="/vi">Quay về trang chủ</Link>
		</div>
	);
}
