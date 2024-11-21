import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import sass from "sass";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const config: NextConfig = {
	reactStrictMode: true,
	sassOptions: {
		implementation: sass,
	},
};

module.exports = {
	eslint: {
		ignoreDuringBuilds: true,
	},
};

export default withNextIntl(config);
