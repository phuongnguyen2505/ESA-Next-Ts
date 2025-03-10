import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { defaultLocale, locales } from "./i18n.config";

// Hàm middleware duy nhất, kết hợp cả localization và kiểm tra token
export async function middleware(req: NextRequest) {
	const { pathname } = req.nextUrl;

	// 1. Kiểm tra localization:
	const isMissingLocale = locales.every(
		(locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`,
	);
	if (isMissingLocale) {
		return NextResponse.redirect(new URL(`/${defaultLocale}${pathname}`, req.url));
	}

	// 2. Kiểm tra token cho các URL admin (ngoại trừ /admin/login)
	if (
		pathname.startsWith(`/${defaultLocale}/admin`) &&
		!pathname.startsWith(`/${defaultLocale}/admin/login`)
	) {
		const token = req.cookies.get("token")?.value;
		if (!token) {
			return NextResponse.redirect(new URL(`/${defaultLocale}/admin/login`, req.url));
		}
		try {
			await jwtVerify(
				token,
				new TextEncoder().encode(
					process.env.JWT_SECRET ||
						"a40a670b61eb1eb4581f6f936eeefa16fbc762efeab879fef773f1f04e11ac7939f978bbfb22bbf6d9c427d6a02c382ce4eb95c032f99b26d6b68dd361baceb1",
				),
				{ clockTolerance: 10 },
			);
		} catch (err) {
			console.error("JWT verify error:", err);
			return NextResponse.redirect(new URL(`/${defaultLocale}/admin/login`, req.url));
		}
	}

	// Nếu mọi thứ ổn, cho phép tiếp tục
	return NextResponse.next();
}

export const config = {
	matcher: ["/((?!api|_next|_vercel|.*\\..*).*)", "/admin/:path*"],
};
