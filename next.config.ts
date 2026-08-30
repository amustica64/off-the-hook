import type { NextConfig } from "next";

/* Vanity redirects per Doc 03 §15: middleware-level, never pages (Doc 12 §3). */
const vanity: [string, string][] = [
	["/book", "/restaurant/book"],
	["/menu", "/restaurant/menu"],
	["/refer", "/partners/referrals"],
	["/fund", "/partners/funders"],
	["/hire", "/partners/employers"],
	["/donate", "/support/donate"],
	["/volunteer", "/support/volunteer"],
	["/train", "/join"],
];

const nextConfig: NextConfig = {
	async redirects() {
		return vanity.map(([source, destination]) => ({
			source,
			destination,
			permanent: true,
		}));
	},
};

export default nextConfig;
