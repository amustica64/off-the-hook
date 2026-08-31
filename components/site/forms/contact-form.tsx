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
import { type FormState, submitContactAction } from "@/lib/actions/forms";
import { SubmitButton } from "./submit-button";

const initial: FormState = { status: "idle" };

/*
  GeneralContactForm, named and specified in Doc 04 §/contact: name, email,
  subject, message. Four fields, which is the count Doc 09 §3.20 locks. The
  six-field EnquiryForm on the partner pages asks for an organisation, and the
  person who lands here is the one who did not fit a persona.
*/
export function GeneralContactForm() {
	const [state, action] = useActionState(submitContactAction, initial);

	if (state.status === "ok") {
		return (
			<Callout tone="important">
				Thanks, that has reached us. We reply within two working days.
			</Callout>
		);
	}

	return (
		<form action={action} noValidate className="space-y-5">
			{/* Honeypot: visually hidden, off the tab order, must stay empty. */}
			<div aria-hidden className="absolute h-0 w-0 overflow-hidden">
				<label htmlFor="contact-website">Leave this empty</label>
				<input
					id="contact-website"
					name="website"
					tabIndex={-1}
					autoComplete="off"
				/>
			</div>

			{state.errors?.form && <FormError>{state.errors.form}</FormError>}

			<div className="grid gap-5 sm:grid-cols-2">
				<Field label="Your name" name="name" error={state.errors?.name}>
					<Input autoComplete="name" required />
				</Field>
				<Field label="Email" name="email" error={state.errors?.email}>
					<Input type="email" autoComplete="email" required />
				</Field>
			</div>
			<Field label="Subject" name="subject" error={state.errors?.subject}>
				<Input required />
			</Field>
			<Field label="Message" name="message" error={state.errors?.message}>
				<Textarea required />
			</Field>
			<GdprConsent />
			<SubmitButton label="Send message" />
		</form>
	);
}
