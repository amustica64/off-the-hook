import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

for (const theme of ["light", "dark"] as const) {
	test(`/design has no axe violations in ${theme} theme`, async ({ page }) => {
		await page.goto("/design");
		if (theme === "dark") {
			await page.getByRole("button", { name: /dark theme/i }).click();
			await expect
				.poll(() =>
					page.evaluate(() =>
						document.documentElement.getAttribute("data-theme"),
					),
				)
				.toBe("dark");
		}
		const results = await new AxeBuilder({ page })
			.withTags(["wcag2a", "wcag2aa"])
			.analyze();
		expect(results.violations).toEqual([]);
	});
}
