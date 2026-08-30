"use client";

import { useActionState } from "react";
import {
	Checkbox,
	Field,
	FormError,
	Input,
	Select,
	Textarea,
} from "@/components/ui/field";
import { Callout } from "@/components/ui/typography";
import { type FormState, submitReferralAction } from "@/lib/actions/forms";
import { SubmitButton } from "./submit-button";

const initial: FormState = { status: "idle" };

/*
  Referral form (Doc 09 §3.13). The candidate is identified by first name and a
  single initial only. Notes are read solely by the safeguarding lead and are
  encrypted at rest by the RPC. No referral field ever reaches analytics.
*/
export function ReferralForm() {
	const [state, action] = useActionState(submitReferralAction, initial);

	if (state.status === "ok") {
		return (
			<Callout tone="important">
				Thank you. Our safeguarding lead will be in touch within two working
				days. For an urgent case, call the number above and ask for
				safeguarding.
			</Callout>
		);
	}

	return (
		<form action={action} noValidate className="space-y-6">
			<div aria-hidden className="absolute h-0 w-0 overflow-hidden">
				<label htmlFor="ref-website">Leave this empty</label>
				<input
					id="ref-website"
					name="website"
					tabIndex={-1}
					autoComplete="off"
				/>
			</div>

			{state.errors?.form && <FormError>{state.errors.form}</FormError>}

			<fieldset className="space-y-5">
				<legend className="font-medium text-text">About you</legend>
				<div className="grid gap-5 sm:grid-cols-2">
					<Field
						label="Your name"
						name="referrer_name"
						error={state.errors?.referrer_name}
					>
						<Input autoComplete="name" required />
					</Field>
					<Field
						label="Your organisation"
						name="referrer_organisation"
						error={state.errors?.referrer_organisation}
					>
						<Input autoComplete="organization" required />
					</Field>
					<Field
						label="Email"
						name="referrer_email"
						error={state.errors?.referrer_email}
					>
						<Input type="email" autoComplete="email" required />
					</Field>
					<Field
						label="Phone"
						name="referrer_phone"
						optional
						error={state.errors?.referrer_phone}
					>
						<Input type="tel" autoComplete="tel" />
					</Field>
				</div>
			</fieldset>

			<fieldset className="space-y-5">
				<legend className="font-medium text-text">About the person</legend>
				<div className="grid gap-5 sm:grid-cols-2">
					<Field
						label="First name"
						name="candidate_first_name"
						error={state.errors?.candidate_first_name}
					>
						<Input required />
					</Field>
					<Field
						label="Last name initial"
						name="candidate_last_name_initial"
						hint="One letter. We do not take a full surname at this stage."
						error={state.errors?.candidate_last_name_initial}
					>
						<Input maxLength={1} required />
					</Field>
					<Field
						label="Supervision status"
						name="supervision_status"
						optional
						error={state.errors?.supervision_status}
					>
						<Select defaultValue="">
							<option value="">Prefer not to say</option>
							<option value="in_custody">In custody</option>
							<option value="on_licence">On licence</option>
							<option value="community">In the community</option>
							<option value="no_current_sentence">No current sentence</option>
						</Select>
					</Field>
					<Field
						label="Approximate release date"
						name="release_date"
						optional
						error={state.errors?.release_date}
					>
						<Input type="date" />
					</Field>
				</div>
				<Field
					label="Anything we should know"
					name="notes"
					optional
					hint="Read only by our safeguarding lead. Held encrypted."
					error={state.errors?.notes}
				>
					<Textarea maxLength={2000} />
				</Field>
			</fieldset>

			<Checkbox
				name="consent_to_share"
				required
				label="I have the person's consent to refer them, or a lawful basis to share these details."
			/>
			<SubmitButton label="Send referral" />
		</form>
	);
}
