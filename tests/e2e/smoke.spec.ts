import { expect, test } from "@playwright/test";

test("home renders the tagline in Fraunces on cream, and themes toggle", async ({
	page,
}) => {
	await page.goto("/");

	const h1 = page.getByRole("heading", { level: 1 });
	await expect(h1).toHaveText(
		/Real work\.\s*Real qualifications\.\s*Real chances\./,
	);

	const font = await h1.evaluate((el) => getComputedStyle(el).fontFamily);
	expect(font).toContain("Fraunces");

	const bg = await page.evaluate(
		() => getComputedStyle(document.body).backgroundColor,
	);
	expect(bg).toBe("rgb(250, 245, 233)"); // --cream-50

	await page.getByRole("button", { name: /dark theme/i }).click();
	await expect
		.poll(() =>
			page.evaluate(() => document.documentElement.getAttribute("data-theme")),
		)
		.toBe("dark");

	const darkBg = await page.evaluate(
		() => getComputedStyle(document.body).backgroundColor,
	);
	expect(darkBg).toBe("rgb(22, 18, 16)"); // --night-950
});
