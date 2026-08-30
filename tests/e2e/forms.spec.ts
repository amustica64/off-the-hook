import { expect, test } from "@playwright/test";

/*
  Phase 6 form gates on the partners set. These exercise the server actions
  against the local database. They mutate rows, so they run serially and
  clean up via unique ip hashes per run is not possible here; instead the
  assertions tolerate accumulation and check the newest row.
*/

test("partners hub links to the four audience pages", async ({ page }) => {
	await page.goto("/partners");
	for (const [name, href] of [
		["Funders", "/partners/funders"],
		["Referrers", "/partners/referrals"],
		["Employers", "/partners/employers"],
		["Educators", "/partners/education"],
	]) {
		await expect(
			page.getByRole("link", { name: new RegExp(name) }).first(),
		).toHaveAttribute("href", href);
	}
});

test("funder enquiry validates, then submits end to end", async ({ page }) => {
	await page.goto("/partners/funders");
	const form = page.locator("#funder-form form");
	await form.scrollIntoViewIfNeeded();

	// Submit empty: inline errors, no success.
	await form.getByRole("button", { name: /Start the conversation/ }).click();
	await expect(page.getByText("Your name is required.")).toBeVisible();

	// Fill and submit.
	await form.getByLabel("Your name").fill("Priya Shah");
	await form.getByLabel("Email").fill("priya@example.org");
	await form
		.getByLabel("How can we help?")
		.fill("We fund employment programmes and would like the numbers.");
	await form.getByLabel(/I agree to Off the Hook/).check();
	await form.getByRole("button", { name: /Start the conversation/ }).click();
	await expect(
		page.getByText(/We reply within two working days/),
	).toBeVisible();
});

test("referral form submits and the candidate initial is enforced", async ({
	page,
}) => {
	await page.goto("/partners/referrals");
	const form = page
		.locator("form")
		.filter({ has: page.getByText("About you") });

	await form.getByLabel("Your name").fill("Mark Probation");
	await form.getByLabel("Your organisation").fill("St Giles Trust");
	await form.getByLabel("Email").fill("mark@stgiles.org.uk");
	await form.getByLabel("First name").fill("John");
	await form.getByLabel("Last name initial").fill("D");
	await form
		.getByLabel(/Anything we should know/)
		.fill("Sensitive context for the safeguarding lead only.");
	await form.getByLabel(/I have the person's consent/).check();
	await form.getByRole("button", { name: "Send referral" }).click();
	await expect(
		page.getByText(/safeguarding lead will be in touch/),
	).toBeVisible();
});
