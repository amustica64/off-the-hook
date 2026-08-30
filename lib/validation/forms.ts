import { z } from "zod";

/*
  Shared form schemas (Doc 10 §8.2: one Zod schema, client and server).
  The RPCs re-validate server-side, so this is defence in depth, not the only gate.
*/

const email = z
	.string()
	.trim()
	.email(
		"This email address does not look right. Check the spelling and try again.",
	);
const required = (label: string) =>
	z.string().trim().min(1, `${label} is required.`);
const honeypot = z.string().max(0); // bots fill hidden fields; humans leave them empty

export const enquirySchema = z.object({
	type: z.enum([
		"contact",
		"hire",
		"partnership",
		"employer",
		"press",
		"funder",
		"educator",
		"volunteer",
		"donation",
		"trainee",
	]),
	first_name: required("Your name"),
	last_name: z.string().trim().default(""),
	email,
	organisation: z.string().trim().optional(),
	phone: z.string().trim().optional(),
	message: required("A message"),
	gdpr_consent: z.boolean().refine((v) => v === true, {
		message: "Please tick the box so we can reply.",
	}),
	source_page: z.string().optional(),
	website: honeypot,
});

export type EnquiryInput = z.infer<typeof enquirySchema>;

/*
  Referral: the most sensitive form on the site. The candidate is identified by
  first name and a single initial only, never a full name, mirrored in the RPC.
  `notes` may hold sensitive context and is encrypted at rest by the RPC.
*/
export const referralSchema = z.object({
	referrer_name: required("Your name"),
	referrer_organisation: required("Your organisation"),
	referrer_email: email,
	referrer_phone: z.string().trim().optional(),
	candidate_first_name: required("The candidate's first name"),
	candidate_last_name_initial: z
		.string()
		.trim()
		.regex(
			/^[A-Za-z]$/,
			"One letter only, never a full surname at this stage.",
		),
	release_date: z.string().trim().optional(),
	supervision_status: z
		.enum(["in_custody", "on_licence", "community", "no_current_sentence"])
		.optional(),
	notes: z.string().trim().max(2000).optional(),
	consent_to_share: z.boolean().refine((v) => v === true, {
		message: "Please confirm you have consent to refer.",
	}),
	website: honeypot,
});

export type ReferralInput = z.infer<typeof referralSchema>;

/* Flatten Zod errors to a field-keyed record for inline display (Doc 09 §1.5). */
export function fieldErrors(error: z.ZodError): Record<string, string> {
	const out: Record<string, string> = {};
	for (const issue of error.issues) {
		const key = String(issue.path[0] ?? "form");
		if (!out[key]) out[key] = issue.message;
	}
	return out;
}

/*
  Booking. Fields and order per Doc 04 /restaurant/book, which Doc 09 §3.7 locks.
  Date and time are collected separately because a native date input and a
  native time input are what a phone gives you, then combined server side into
  the single `requested_at` timestamp the bookings table holds.
*/
export const bookingSchema = z.object({
	name: required("Your name"),
	email,
	phone: required("A phone number"),
	party_size: z.coerce
		.number()
		.int()
		.min(1, "Party size is required.")
		.max(40, "For more than 40, please call us."),
	party_note: z.string().trim().max(200).optional(),
	date: required("A preferred date"),
	time: required("A preferred time"),
	occasion: z
		.enum(["none", "birthday", "anniversary", "business", "other"])
		.optional(),
	notes: z
		.string()
		.trim()
		.max(500, "Please keep notes under 500 characters.")
		.optional(),
	gdpr_consent: z.boolean().refine((v) => v === true, {
		message: "Please tick the box so we can confirm your table.",
	}),
	website: honeypot,
});

export type BookingInput = z.infer<typeof bookingSchema>;

/*
  Join. Five fields only, per Doc 04 /join and Doc 09 §3.16, and no email:
  the audience is mobile-only and low-data, and many will not have one. A name
  or an alias is accepted, because a first name is enough to start a
  conversation and this page must not feel like a form that catches you out.
*/
export const joinSchema = z.object({
	name: required("Your name, or a name you want us to use"),
	phone: required("A phone number"),
	best_time: z.enum(["morning", "afternoon", "evening", "any"]),
	referral_status: z.enum(["referred", "self_referring", "not_sure"]),
	notes: z.string().trim().max(500).optional(),
	gdpr_consent: z.boolean().refine((v) => v === true, {
		message: "Please tick the box so we can call you back.",
	}),
	website: honeypot,
});

export type JoinInput = z.infer<typeof joinSchema>;
