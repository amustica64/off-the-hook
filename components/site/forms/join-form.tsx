"use client";

import { useActionState } from "react";
import {
	Field,
	FormError,
	GdprConsent,
	Input,
	RadioGroup,
	Textarea,
} from "@/components/ui/field";
import { Callout } from "@/components/ui/typography";
import { type FormState, submitJoinAction } from "@/lib/actions/forms";
import { SubmitButton } from "./submit-button";

const initial: FormState = { status: "idle" };

/*
  JoinForm. Five things only, per Doc 04 /join and Doc 09 §3.16: name or alias,
  phone, best time to call, referral status, notes.

  No email field, on purpose. The reader may have no email address the week they
  come out. Migration 0003 relaxes the enquiries NOT NULL so a phone is enough.

  Radio buttons rather than a select for referral status, because "not sure" has
  to be as easy to reach as the other two, and a select hides its options behind
  a tap. Reading age ten means nothing is a trick question.
*/
export function JoinForm() {
	const [state, action] = useActionState(submitJoinAction, initial);

	if (state.status === "ok") {
		return (
			<Callout tone="important">
				Thanks. We will call you back within two working days. If you would
				rather not wait, call us on the number above.
			</Callout>
		);
	}

	return (
		<form action={action} noValidate className="space-y-6">
			<div aria-hidden className="absolute h-0 w-0 overflow-hidden">
				<label htmlFor="join-website">Leave this empty</label>
				<input
					id="join-website"
					name="website"
					tabIndex={-1}
					autoComplete="off"
				/>
			</div>

			{state.errors?.form && <FormError>{state.errors.form}</FormError>}

			<Field
				label="Your name"
				name="name"
				hint="A first name is fine. Or a name you want us to use."
				error={state.errors?.name}
			>
				<Input autoComplete="given-name" required />
			</Field>

			<Field
				label="Your phone number"
				name="phone"
				hint="We will call you. We do not text unless you ask."
				error={state.errors?.phone}
			>
				<Input type="tel" autoComplete="tel" required />
			</Field>

			<RadioGroup
				legend="When is best to call?"
				name="best_time"
				defaultValue="any"
				options={[
					{ value: "morning", label: "Morning" },
					{ value: "afternoon", label: "Afternoon" },
					{ value: "evening", label: "Evening" },
					{ value: "any", label: "Any time is fine" },
				]}
			/>

			<RadioGroup
				legend="Has someone referred you?"
				name="referral_status"
				defaultValue="not_sure"
				options={[
					{ value: "referred", label: "Yes, someone has referred me" },
					{
						value: "self_referring",
						label: "No, I am getting in touch myself",
					},
					{ value: "not_sure", label: "I am not sure" },
				]}
			/>

			<Field
				label="Anything you want us to know?"
				name="notes"
				optional
				error={state.errors?.notes}
			>
				<Textarea maxLength={500} />
			</Field>

			<GdprConsent />
			<SubmitButton label="Ask us to call you" />
		</form>
	);
}
