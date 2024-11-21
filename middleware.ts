import createMiddleware from "next-intl/middleware";
import { defaultLocale, locales } from "./i18n.config";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { i18n } from "@/i18n.config";

export default createMiddleware({
	defaultLocale,
	locales,
	localePrefix: "always",
});

export function middleware(request: NextRequest) {
	const pathname = request.nextUrl.pathname;
	const pathnameIsMissingLocale = i18n.locales.every(
		(locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`,
	);

	if (pathnameIsMissingLocale) {
		return NextResponse.redirect(
			new URL(`/${i18n.defaultLocale}${pathname}`, request.url),
		);
	}
}

export const config = {
	matcher: ["/((?!api|_next|_vercel|.*\\..*).*)", "/admin/:path*"],
};
