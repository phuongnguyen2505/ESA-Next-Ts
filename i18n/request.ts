import { getRequestConfig } from "next-intl/server";
import { locales } from "@/i18n.config";

export default getRequestConfig(async ({ locale }) => {
	if (!locales.includes(locale as any)) {
		return {
			messages: {},
		};
	}

	return {
		messages: (await import(`@/messages/${locale}.json`)).default,
	};
});
