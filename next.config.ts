import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import path from "path";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const config: NextConfig = {
	reactStrictMode: true,
	sassOptions: {
		includePaths: [path.join(process.cwd(), "styles")],
	},
};

export default withNextIntl(config);
