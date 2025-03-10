import { Locale } from "./types/i18n";

export const defaultLocale: Locale = "en";
export const locales: Locale[] = ["en"];

export interface I18nConfig {
	defaultLocale: Locale;
	locales: Locale[];
}

export const i18n: I18nConfig = {
	defaultLocale: "en",
	locales: ["en"],
};
