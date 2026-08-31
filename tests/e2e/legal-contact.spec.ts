import { expect, test } from "@playwright/test";

/*
  Doc 09 §3.23 (/legal/*, one template, six routes) and §3.20 (/contact).
  The legal checks are all static; only the last test in this file needs a
  database.
*/

const LEGAL = [
	{ slug: "privacy", title: "Privacy", published: false },
	{ slug: "cookies", title: "Cookies and storage", published: true },
	{ slug: "safeguarding", title: "Safeguarding", published: false },
	{ slug: "accessibility", title: "Accessibility", published: true },
	{ slug: "cic-declaration", title: "CIC declaration", published: false },
	{
		slug: "modern-slavery",
		title: "Modern slavery statement",
		published: false,
	},
] as const;

test("all six legal routes render from the one template", async ({ page }) => {
	for (const doc of LEGAL) {
		await page.goto(`/legal/${doc.slug}`);
		await expect(page.getByRole("heading", { level: 1 })).toHaveText(doc.title);
		// Breadcrumbs per Doc 03 §7, with the current page last and not a link.
		const crumb = page.getByRole("navigation", { name: "Breadcrumb" });
		await expect(crumb).toContainText("The small print");
		await expect(crumb.getByRole("link")).toHaveCount(0);
	}
});

test("an unknown legal slug is a 404, not a blank template", async ({
	page,
}) => {
	const res = await page.goto("/legal/not-a-real-document");
	expect(res?.status()).toBe(404);
});

test("a published page carries a last updated date", async ({ page }) => {
	await page.goto("/legal/cookies");
	await expect(
		page.getByText(/Last updated [0-9]+ [A-Za-z]+ [0-9]{4}/),
	).toBeVisible();
});

test("the contents rail matches the page headings", async ({
	page,
}, testInfo) => {
	// Doc 04 §/legal/* puts the rail on desktop only, so there is nothing to
	// check at the mobile viewport.
	test.skip(
		testInfo.project.name === "mobile",
		"contents rail is desktop only",
	);
	await page.goto("/legal/cookies");

	// Every rail link must point at a heading that exists on the page. This is
	// the drift the shared headingId helper exists to prevent.
	const hrefs = await page
		.getByRole("navigation", { name: "On this page" })
		.getByRole("link")
		.evaluateAll((links) =>
			links.map((l) => l.getAttribute("href") ?? "").map((h) => h.slice(1)),
		);
	expect(hrefs.length).toBeGreaterThan(1);
	for (const id of hrefs) {
		await expect(page.locator(`h2#${id}`)).toHaveCount(1);
	}
});

test("an unpublished statement says so and is not indexed", async ({
	page,
}) => {
	await page.goto("/legal/privacy");
	await expect(page.getByText(/is not published yet/i)).toBeVisible();
	await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
		"content",
		/noindex/,
	);
	// No date is claimed for a document that does not exist.
	await expect(page.getByText(/Last updated/)).toHaveCount(0);
	// And no contents rail, because there are no headings to list.
	await expect(
		page.getByRole("navigation", { name: "On this page" }),
	).toHaveCount(0);
});

test("a published statement is left indexable", async ({ page }) => {
	await page.goto("/legal/cookies");
	await expect(page.locator('meta[name="robots"]')).toHaveCount(0);
});

test("the unpublished safeguarding page still routes an urgent concern", async ({
	page,
}) => {
	await page.goto("/legal/safeguarding");
	await expect(page.getByText(/Call 999/)).toBeVisible();
});

test("contact routes each audience before offering the general form", async ({
	page,
}) => {
	await page.goto("/contact");
	await expect(page.getByRole("heading", { level: 1 })).toHaveText(
		"Talk to us.",
	);
	// Copy verbatim, per Doc 09 §3.20.
	await expect(
		page.getByText("For the fastest reply, use the pages built for you."),
	).toBeVisible();

	const main = page.getByRole("main");
	for (const [name, href] of [
		["I'm a funder", "/partners/funders"],
		["I'm a referral partner", "/partners/referrals"],
		["I'm an employer", "/partners/employers"],
		["I want to book a table", "/restaurant/book"],
	] as const) {
		await expect(main.getByRole("link", { name })).toHaveAttribute(
			"href",
			href,
		);
	}

	// The router sits above the form (Doc 04 §/contact section order).
	const html = await page.content();
	expect(html.indexOf("For the fastest reply")).toBeLessThan(
		html.indexOf("Anything else"),
	);
});

test("contact asks for four fields and invents no phone number", async ({
	page,
}) => {
	await page.goto("/contact");
	const main = page.getByRole("main");
	for (const label of ["Your name", "Email", "Subject", "Message"]) {
		await expect(main.getByLabel(label, { exact: true })).toBeVisible();
	}
	// lib/venue.ts is unset, so the page says so rather than printing a number
	// that would send someone to a stranger.
	await expect(main.getByText(/still being set up/i)).toBeVisible();
	await expect(main.locator('a[href^="tel:"]')).toHaveCount(0);
});

/* Needs a database: the row lands in `enquiries` tagged contact. */
test("the general contact form submits end to end", async ({ page }) => {
	await page.goto("/contact");
	const main = page.getByRole("main");
	await main.getByLabel("Your name", { exact: true }).fill("Jo Okonkwo");
	await main.getByLabel("Email", { exact: true }).fill("jo@example.com");
	await main
		.getByLabel("Subject", { exact: true })
		.fill("Question about work experience");
	await main
		.getByLabel("Message", { exact: true })
		.fill("Do you take college placements in the kitchen?");
	await main.getByRole("checkbox").check();
	await main.getByRole("button", { name: "Send message" }).click();

	await expect(page.getByText(/that has reached us/i)).toBeVisible();
});
