import { Locale } from "./types/i18n";

export const defaultLocale: Locale = "vi";
export const locales: Locale[] = ["vi", "en"];

export interface I18nConfig {
	defaultLocale: Locale;
	locales: Locale[];
}

export const i18n: I18nConfig = {
	defaultLocale: "vi",
	locales: ["vi", "en"],
};
