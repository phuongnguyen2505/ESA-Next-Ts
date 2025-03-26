import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { defaultLocale, locales } from "./i18n.config";

export async function middleware(req: NextRequest) {
	const { pathname } = req.nextUrl;

	// Localization: nếu thiếu locale ở đầu URL thì redirect
	const isMissingLocale = locales.every(
		(locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`,
	);
	if (isMissingLocale) {
		return NextResponse.redirect(new URL(`/${defaultLocale}${pathname}`, req.url));
	}

	// Dynamic redirect: nếu URL là /{locale}/products/{numericId}, fetch slug rồi redirect
	const parts = pathname.split("/");
	const locale = parts[1];
	if (parts[2] === "products" && /^\d+$/.test(parts[3] || "")) {
		try {
			const id = parts[3];
			const apiRes = await fetch(`${req.nextUrl.origin}/api/products/${id}`);
			if (apiRes.ok) {
				const { product } = await apiRes.json();
				return NextResponse.redirect(
					new URL(`/${locale}/products/${product.tenkhongdau}`, req.url),
				);
			}
		} catch (err) {
			console.error("Redirect fetch error:", err);
		}
	}

	// Admin authentication (ngoại trừ /admin/login)
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
		} catch {
			return NextResponse.redirect(new URL(`/${defaultLocale}/admin/login`, req.url));
		}
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/((?!api|_next|_vercel|.*\\..*).*)", "/admin/:path*"],
};
