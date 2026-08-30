import { expect, test } from "@playwright/test";

/* Doc 09 §3.7 sign-off: the row lands in `bookings` via the submit_booking RPC. */
test("booking form submits end to end and opens a note field for large parties", async ({
	page,
}) => {
	await page.goto("/restaurant/book");
	await expect(page.getByRole("heading", { level: 1 })).toHaveText(
		"Book a table.",
	);

	// "9 or more" opens the note field (Doc 04), and nothing before it does.
	await expect(page.getByLabel(/how many, and anything/i)).toBeHidden();
	await page.getByLabel("How many people?").selectOption("9");
	await expect(page.getByLabel(/how many, and anything/i)).toBeVisible();
	await page.getByLabel("How many people?").selectOption("4");

	// Scoped to main throughout: the footer newsletter also has an email field.
	const form = page.getByRole("main");
	await form.getByLabel("Your name").fill("Priya Shah");
	await form.getByLabel("Email").fill("priya@example.com");
	await form.getByLabel("Phone").fill("07700900123");
	await form.getByLabel("Preferred date").fill("2027-03-04");
	await form.getByLabel("Preferred time").fill("19:30");
	await form.getByRole("checkbox").check();
	await form.getByRole("button", { name: /request a table/i }).click();

	await expect(page.getByText(/we have your request/i)).toBeVisible();
});

/* Doc 09 §3.16 sign-off: data lands in `enquiries` tagged trainee, no email asked. */
test("join form submits with a phone and no email address", async ({
	page,
}) => {
	await page.goto("/join");
	await expect(page.getByRole("heading", { level: 1 })).toHaveText(
		"Interested in training with us?",
	);

	// The page must never ask for an email. That is the whole point of it.
	// Scoped to main: the footer newsletter has its own email field site-wide.
	await expect(page.getByRole("main").getByLabel(/email/i)).toHaveCount(0);

	// The phone block sits before the form in the DOM (taste pass).
	const html = await page.content();
	expect(html.indexOf("Or call us")).toBeLessThan(
		html.indexOf("Tell us about yourself"),
	);

	const form = page.getByRole("main");
	await form.getByLabel("Your name").fill("Danny");
	await form.getByLabel("Your phone number").fill("07700900456");
	await form.getByRole("radio", { name: "Evening" }).check();
	await form.getByRole("radio", { name: /someone has referred me/i }).check();
	await form.getByRole("checkbox").check();
	await form.getByRole("button", { name: /ask us to call you/i }).click();

	await expect(
		page.getByText(/call you back within two working days/i),
	).toBeVisible();
});
