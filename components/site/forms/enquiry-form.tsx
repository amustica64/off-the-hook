"use client";

import { useActionState } from "react";
import {
	Field,
	FormError,
	GdprConsent,
	Input,
	Textarea,
} from "@/components/ui/field";
import { Callout } from "@/components/ui/typography";
import { type FormState, submitEnquiryAction } from "@/lib/actions/forms";
import { SubmitButton } from "./submit-button";

const initial: FormState = { status: "idle" };

/*
  General enquiry form for funder / employer / educator / contact / hire flows.
  `type` routes the row in the enquiries table. Success replaces the form inline
  with a confirmation and the two-working-day SLA (Doc 09 §1.5).
*/
export function EnquiryForm({
	type,
	sourcePage,
	submitLabel = "Send",
	organisationLabel = "Organisation",
}: {
	type: string;
	sourcePage: string;
	submitLabel?: string;
	organisationLabel?: string;
}) {
	const [state, action] = useActionState(submitEnquiryAction, initial);

	if (state.status === "ok") {
		return (
			<Callout tone="important">
				Thanks. We reply within two working days. If it is urgent, call us on
				the number in the footer.
			</Callout>
		);
	}

	return (
		<form action={action} noValidate className="space-y-5">
			<input type="hidden" name="type" value={type} />
			<input type="hidden" name="source_page" value={sourcePage} />
			{/* Honeypot: visually hidden, off the tab order, must stay empty. */}
			<div aria-hidden className="absolute h-0 w-0 overflow-hidden">
				<label htmlFor={`${type}-website`}>Leave this empty</label>
				<input
					id={`${type}-website`}
					name="website"
					tabIndex={-1}
					autoComplete="off"
				/>
			</div>

			{state.errors?.form && <FormError>{state.errors.form}</FormError>}

			<div className="grid gap-5 sm:grid-cols-2">
				<Field
					label="Your name"
					name="first_name"
					error={state.errors?.first_name}
				>
					<Input autoComplete="name" required />
				</Field>
				<Field label="Email" name="email" error={state.errors?.email}>
					<Input type="email" autoComplete="email" required />
				</Field>
				<Field
					label={organisationLabel}
					name="organisation"
					optional
					error={state.errors?.organisation}
				>
					<Input autoComplete="organization" />
				</Field>
				<Field label="Phone" name="phone" optional error={state.errors?.phone}>
					<Input type="tel" autoComplete="tel" />
				</Field>
			</div>
			<Field
				label="How can we help?"
				name="message"
				error={state.errors?.message}
			>
				<Textarea required />
			</Field>
			<GdprConsent />
			<SubmitButton label={submitLabel} />
		</form>
	);
}
