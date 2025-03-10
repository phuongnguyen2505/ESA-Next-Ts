import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import path from "path";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const config: NextConfig = {
	reactStrictMode: true,
	sassOptions: {
		includePaths: [path.join(process.cwd(), "styles")],
	},
	images: {
		domains: ["localhost"], // Add your image domains here
		deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
		imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
	},
	typescript: {
		// Set to false to ensure TypeScript errors are treated as build errors
		ignoreBuildErrors: false,
	},
	// Add support for importing SVGs as React components
	webpack(config) {
		config.module.rules.push({
			test: /\.svg$/,
			use: ["@svgr/webpack"],
		});
		return config;
	},
};

export default withNextIntl(config);
