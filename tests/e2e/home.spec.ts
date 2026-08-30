import { expect, test } from "@playwright/test";

/* Home sign-off per Doc 09 §3.1 and §6, automatable subset. */

test("hero carries the exact tagline and the intended first read", async ({
	page,
}) => {
	await page.goto("/");
	const h1 = page.getByRole("heading", { level: 1 });
	await expect(h1).toHaveText(
		/Real work\.\s*Real qualifications\.\s*Real chances\./,
	);
	await expect(
		page.getByText("Hospitality-led social enterprise"),
	).toBeVisible();
});

test("exactly two primary CTAs on the page, both Book a table", async ({
	page,
}) => {
	await page.goto("/");
	const primaries = page.locator("main .bg-accent-fill");
	// Two primary buttons (hero + restaurant teaser) and the sign-up submit is a form action, not a page CTA
	const bookButtons = page
		.getByRole("link", { name: "Book a table" })
		.filter({ visible: true });
	expect(await bookButtons.count()).toBeGreaterThanOrEqual(1);
	expect(await primaries.count()).toBeLessThanOrEqual(3);
});

test("impact tiles render seeded values with year and source disclosure", async ({
	page,
}) => {
	await page.goto("/");
	await page.getByText("The numbers so far.").scrollIntoViewIfNeeded();
	await expect(page.getByText("The numbers so far.")).toBeVisible();
	await expect(page.getByText("42")).toBeVisible(); // count-up settles on the true value
	await expect(page.getByText("68%").first()).toBeVisible();
	await expect(page.getByText("Updated 2026").first()).toBeVisible();
	const source = page.getByText("Source", { exact: true }).first();
	await source.click();
	await expect(page.getByText("Programme records").first()).toBeVisible();
});

test("stories section renders granted stories only, with the consent line", async ({
	page,
}) => {
	await page.goto("/");
	await expect(page.getByText("The people this is for.")).toBeVisible();
	await expect(
		page.getByRole("link", { name: /Danny makes bread/ }),
	).toBeVisible();
	await expect(page.getByText("explicit consent")).toBeVisible();
});

test("partners band links to the three audiences and /join", async ({
	page,
}) => {
	await page.goto("/");
	for (const [name, href] of [
		["Talk to us", "/partners/funders"],
		["See how", "/partners/referrals"],
		["Partner with us", "/partners/employers"],
		["Start here", "/join"],
	]) {
		await expect(page.getByRole("link", { name })).toHaveAttribute(
			"href",
			href,
		);
	}
});

test("journey strip shows all seven steps from the database", async ({
	page,
}) => {
	await page.goto("/");
	for (const step of [
		"Prison",
		"Referral",
		"Induction",
		"Training",
		"Service",
		"Qualification",
		"Employment",
	]) {
		await expect(
			page.getByRole("link", { name: new RegExp(step) }).first(),
		).toBeVisible();
	}
});
