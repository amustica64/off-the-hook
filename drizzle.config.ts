import { defineConfig } from "drizzle-kit";

export default defineConfig({
	schema: "./db/schema/index.ts",
	out: "./db/migrations",
	dialect: "postgresql",
	dbCredentials: {
		// biome-ignore lint/style/noNonNullAssertion: fail fast if unset
		url: process.env.DATABASE_URL!,
	},
});
