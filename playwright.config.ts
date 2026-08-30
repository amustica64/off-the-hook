import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
	testDir: "./tests/e2e",
	globalSetup: "./tests/global-setup.ts",
	fullyParallel: true,
	reporter: "list",
	use: {
		baseURL: process.env.BASE_URL ?? "http://localhost:3000",
		trace: "on-first-retry",
		// CI/sandbox images ship a system Chromium; use it instead of downloading.
		launchOptions: process.env.PW_CHROMIUM_PATH
			? { executablePath: process.env.PW_CHROMIUM_PATH }
			: undefined,
	},
	projects: [
		{
			name: "desktop",
			use: {
				...devices["Desktop Chrome"],
				viewport: { width: 1440, height: 900 },
			},
		},
		{ name: "mobile", use: { ...devices["Pixel 7"] } },
	],
	webServer: process.env.BASE_URL
		? undefined
		: {
				command: "pnpm start",
				url: "http://localhost:3000",
				reuseExistingServer: true,
			},
});
