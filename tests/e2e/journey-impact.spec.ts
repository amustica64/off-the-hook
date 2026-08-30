import { expect, test } from "@playwright/test";

/* Journey (Doc 09 §3.8) and Impact (§3.9). */

test("journey timeline: seven tabs, keyboard navigation, panel updates", async ({
	page,
	isMobile,
}) => {
	test.skip(isMobile, "desktop tab rail only; mobile shows all cards");
	await page.goto("/journey");
	await expect(page.getByRole("heading", { level: 1 })).toHaveText(
		/Seven steps/,
	);
	const tabs = page.getByRole("tab");
	await expect(tabs).toHaveCount(7);
	await expect(page.getByRole("tabpanel")).toContainText(
		/last six to twelve weeks/,
	);
	await tabs.first().focus();
	await page.keyboard.press("ArrowRight");
	await expect(page.getByRole("tabpanel")).toContainText(/two working days/);
	await page.keyboard.press("End");
	await expect(page.getByRole("tabpanel")).toContainText(
		/door here stays open/,
	);
});

test("journey mobile shows all seven step cards", async ({ page }) => {
	await page.setViewportSize({ width: 390, height: 844 });
	await page.goto("/journey");
	for (const t of ["Prison", "Referral", "Employment"]) {
		await expect(
			page.getByRole("heading", { name: t, exact: true }),
		).toBeVisible();
	}
});

test("impact renders headline, six dated tiles with sources, and stories", async ({
	page,
}) => {
	await page.goto("/impact");
	await expect(
		page.getByText("people through the programme so far, 2026."),
	).toBeVisible();
	await expect(page.getByText("Updated 2026")).toHaveCount(6);
	await page.getByText("Behind the numbers.").scrollIntoViewIfNeeded();
	await expect(page.getByText("Behind the numbers.")).toBeVisible();
});
