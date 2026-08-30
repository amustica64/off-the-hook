import { expect, test } from "@playwright/test";

/* Phase 5 screen checks: About (Doc 09 §3.2), Restaurant (§3.4), Menu (§3.5). */

test("about renders the founder story and CIC section", async ({ page }) => {
	await page.goto("/about");
	await expect(page.getByRole("heading", { level: 1 })).toHaveText(
		/kitchen we would want to work in/,
	);
	await expect(page.getByText("Anne Kiragu, founder.")).toBeVisible();
	await expect(
		page.getByRole("link", { name: /full CIC declaration/ }),
	).toHaveAttribute("href", "/legal/cic-declaration");
});

test("restaurant shows live menu teaser with prices from the database", async ({
	page,
}) => {
	await page.goto("/restaurant");
	await expect(page.getByRole("heading", { level: 1 })).toHaveText(
		"Off the Hook, the restaurant.",
	);
	await page.getByText("This week's menu.").scrollIntoViewIfNeeded();
	await expect(page.getByText("Sourdough, cultured butter")).toBeVisible();
	await expect(page.getByText("£4.50").first()).toBeVisible();
});

test("menu renders sections, dietary tags, allergens and tabular prices", async ({
	page,
}) => {
	await page.goto("/restaurant/menu");
	await expect(
		page.getByRole("heading", { name: "Small plates" }),
	).toBeVisible();
	await expect(page.getByText("Beef shin, mash, greens")).toBeVisible();
	await expect(page.getByText("£16.50")).toBeVisible();
	await expect(page.getByText("Contains milk, sulphites")).toBeVisible();
	await expect(page.getByText("VG").first()).toBeVisible();
});
