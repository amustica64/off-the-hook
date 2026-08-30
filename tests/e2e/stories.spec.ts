import { expect, test } from "@playwright/test";

/* Stories index and detail per Doc 09 §3.10. */

test("index shows granted stories, filter narrows, consent note present", async ({
	page,
}) => {
	await page.goto("/stories");
	await expect(
		page.getByRole("link", { name: /Danny makes bread/ }),
	).toBeVisible();
	await expect(page.getByText("explicit consent")).toBeVisible();
	await page
		.getByRole("navigation", { name: "Story categories" })
		.getByRole("link", { name: "Kitchen notes" })
		.click();
	await expect(
		page.getByRole("link", { name: /What the kitchen taught us/ }),
	).toBeVisible();
	await expect(
		page.getByRole("link", { name: /Danny makes bread/ }),
	).toBeHidden();
});

test("detail renders MDX body, byline, pull quote and next actions", async ({
	page,
}) => {
	await page.goto("/stories/danny-makes-bread");
	await expect(page.getByRole("heading", { level: 1 })).toHaveText(
		"Danny makes bread",
	);
	await expect(page.getByText(/minute read/)).toBeVisible();
	await expect(page.getByText(/probation referral in February/)).toBeVisible();
	await expect(
		page.getByText(/never had a job I was proud of/).first(),
	).toBeVisible();
	await expect(
		page.getByRole("link", { name: "Support the next chapter" }),
	).toHaveAttribute("href", "/support/donate");
});

test("an unpublished or unknown slug is a 404", async ({ page }) => {
	await page.goto("/stories/not-a-story");
	await expect(
		page.getByRole("heading", { name: /not on the menu/i }),
	).toBeVisible();
});
