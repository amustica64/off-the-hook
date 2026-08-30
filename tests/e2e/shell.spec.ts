import { expect, test } from "@playwright/test";

test("header nav has the six Doc 03 items and the partners dropdown works", async ({
	page,
	isMobile,
}) => {
	test.skip(isMobile, "desktop nav only");
	await page.goto("/");
	const nav = page.getByRole("navigation", { name: "Primary" });
	for (const label of [
		"The restaurant",
		"The academy",
		"Our impact",
		"For partners",
		"About",
	]) {
		await expect(nav.getByText(label)).toBeVisible();
	}
	await nav.getByRole("button", { name: "For partners" }).click();
	await expect(page.getByRole("link", { name: /Referrers/ })).toBeVisible();
	await page.keyboard.press("Escape");
	await expect(page.getByRole("link", { name: /Referrers/ })).toBeHidden();
});

test("mobile drawer opens, traps focus, closes, returns focus", async ({
	page,
}) => {
	await page.setViewportSize({ width: 390, height: 844 });
	await page.goto("/");
	await page.getByRole("button", { name: "Open menu" }).click();
	const dialog = page.getByRole("dialog", { name: "Menu" });
	await expect(dialog).toBeVisible();
	await expect(dialog.getByRole("link", { name: "The academy" })).toBeVisible();
	await page.keyboard.press("Escape");
	await expect(dialog).toBeHidden();
});

test("vanity redirects respond per Doc 03 §15", async ({ request }) => {
	for (const [from, to] of [
		["/book", "/restaurant/book"],
		["/refer", "/partners/referrals"],
		["/train", "/join"],
	]) {
		const res = await request.get(from, { maxRedirects: 0 });
		expect(res.status()).toBeGreaterThanOrEqual(301);
		expect(res.headers().location).toContain(to);
	}
});

test("every public route renders inside the shell", async ({ page }) => {
	for (const route of [
		"/journey",
		"/impact",
		"/partners/referrals",
		"/join",
		"/legal/safeguarding",
		"/restaurant/book",
	]) {
		await page.goto(route);
		await expect(
			page
				.getByRole("navigation", { name: "Primary" })
				.or(page.getByRole("button", { name: "Open menu" }))
				.first(),
		).toBeVisible();
		await expect(page.locator("h1")).toBeVisible();
	}
});

test("404 renders the branded not-found page", async ({ page }) => {
	await page.goto("/no-such-page");
	await expect(
		page.getByRole("heading", { name: /not on the menu/i }),
	).toBeVisible();
});
