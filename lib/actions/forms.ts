"use server";

import { createHash } from "node:crypto";
import { headers } from "next/headers";
import { callCreateReferral, callSubmitEnquiry } from "@/lib/rpc";
import {
	enquirySchema,
	fieldErrors,
	referralSchema,
} from "@/lib/validation/forms";

/*
  Server actions for the public forms. Progressive enhancement: they run from a
  plain <form action>, no client JS required (Doc 10 §8.2).

  Security posture (deadbolt):
  - Zod parse at the boundary; the RPC re-validates and rate-limits.
  - Honeypot `website` must be empty; a filled one is silently accepted (200)
    so bots learn nothing, but nothing is written.
  - IP is hashed before it leaves this function; the raw IP is never stored.
  - Referral notes are never logged; on error we log a class, not the payload.
  - Turnstile: verified here when TURNSTILE_SECRET is set (keys pending). The
    honeypot plus the RPC rate limit hold the line until then. FLAGGED.
*/

export type FormState = {
	status: "idle" | "ok" | "error";
	errors?: Record<string, string>;
};

async function ipHash(): Promise<string> {
	const h = await headers();
	const ip = (h.get("x-forwarded-for") ?? "").split(",")[0].trim() || "unknown";
	return createHash("sha256").update(ip).digest("hex").slice(0, 32);
}

async function turnstileOk(token: FormDataEntryValue | null): Promise<boolean> {
	const secret = process.env.TURNSTILE_SECRET;
	if (!secret) return true; // no keys yet; honeypot + RPC rate limit cover this (flagged)
	try {
		const res = await fetch(
			"https://challenges.cloudflare.com/turnstile/v0/siteverify",
			{
				method: "POST",
				headers: { "content-type": "application/x-www-form-urlencoded" },
				body: new URLSearchParams({ secret, response: String(token ?? "") }),
			},
		);
		return (await res.json())?.success === true;
	} catch {
		return false;
	}
}

export async function submitEnquiryAction(
	_prev: FormState,
	form: FormData,
): Promise<FormState> {
	const parsed = enquirySchema.safeParse({
		type: form.get("type"),
		first_name: form.get("first_name"),
		last_name: form.get("last_name") ?? "",
		email: form.get("email"),
		organisation: form.get("organisation") || undefined,
		phone: form.get("phone") || undefined,
		message: form.get("message"),
		gdpr_consent: form.get("gdpr_consent") === "on",
		source_page: form.get("source_page") || undefined,
		website: form.get("website") ?? "",
	});
	if (!parsed.success)
		return { status: "error", errors: fieldErrors(parsed.error) };
	if (parsed.data.website) return { status: "ok" }; // honeypot: pretend success, write nothing
	if (!(await turnstileOk(form.get("cf-turnstile-response")))) {
		return {
			status: "error",
			errors: { form: "We could not verify the form. Please try again." },
		};
	}
	try {
		const { website, ...data } = parsed.data;
		void website;
		await callSubmitEnquiry({ ...data, ip_hash: await ipHash() });
		return { status: "ok" };
	} catch (err) {
		const msg =
			err instanceof Error && err.message.includes("rate limited")
				? "You've submitted a few times. Please wait a minute and try again."
				: "Something went wrong at our end. Your details are still here, try again.";
		return { status: "error", errors: { form: msg } };
	}
}

export async function submitReferralAction(
	_prev: FormState,
	form: FormData,
): Promise<FormState> {
	const parsed = referralSchema.safeParse({
		referrer_name: form.get("referrer_name"),
		referrer_organisation: form.get("referrer_organisation"),
		referrer_email: form.get("referrer_email"),
		referrer_phone: form.get("referrer_phone") || undefined,
		candidate_first_name: form.get("candidate_first_name"),
		candidate_last_name_initial: form.get("candidate_last_name_initial"),
		release_date: form.get("release_date") || undefined,
		supervision_status: form.get("supervision_status") || undefined,
		notes: form.get("notes") || undefined,
		consent_to_share: form.get("consent_to_share") === "on",
		website: form.get("website") ?? "",
	});
	if (!parsed.success)
		return { status: "error", errors: fieldErrors(parsed.error) };
	if (parsed.data.website) return { status: "ok" };
	if (!(await turnstileOk(form.get("cf-turnstile-response")))) {
		return {
			status: "error",
			errors: { form: "We could not verify the form. Please try again." },
		};
	}
	try {
		const { website, consent_to_share, ...data } = parsed.data;
		void website;
		void consent_to_share;
		await callCreateReferral({ ...data, ip_hash: await ipHash() });
		return { status: "ok" };
	} catch (err) {
		// Never log the referral payload. Log the error class only.
		console.error(
			"referral submit failed:",
			err instanceof Error ? err.message : "unknown",
		);
		const msg =
			err instanceof Error && err.message.includes("rate limited")
				? "You've submitted a few times. Please wait a minute and try again."
				: "Something went wrong at our end. Please try again, or call us if it is urgent.";
		return { status: "error", errors: { form: msg } };
	}
}
