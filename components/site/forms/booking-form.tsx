"use client";

import { useActionState, useId, useState } from "react";
import {
	Field,
	FormError,
	GdprConsent,
	Input,
	Select,
	Textarea,
} from "@/components/ui/field";
import { Callout } from "@/components/ui/typography";
import { type FormState, submitBookingAction } from "@/lib/actions/forms";
import { bookingSlots, venue } from "@/lib/venue";
import { SubmitButton } from "./submit-button";

const initial: FormState = { status: "idle" };

const OCCASIONS = [
	{ value: "none", label: "No special occasion" },
	{ value: "birthday", label: "Birthday" },
	{ value: "anniversary", label: "Anniversary" },
	{ value: "business", label: "Business" },
	{ value: "other", label: "Something else" },
];

/*
  BookingForm. Fields and order exactly as Doc 04 /restaurant/book lists them,
  which Doc 09 §3.7 locks: name, email, phone, party size, date, time,
  occasion, notes, honeypot. One column, because the sign-off is ninety seconds
  on a 375px phone.

  Party size 1 to 8, with "9 or more" opening a note field, per Doc 04.

  Time: 30 minute slots between opening hours where the hours are known. They
  are not known yet (lib/venue.ts), so the field asks for a preferred time
  instead of offering invented slots.
*/
export function BookingForm() {
	const [state, action] = useActionState(submitBookingAction, initial);
	const [largeParty, setLargeParty] = useState(false);
	const noteId = useId();
	const slots = bookingSlots(venue.openingHours);

	if (state.status === "ok") {
		return (
			<Callout tone="important">
				Thanks, we have your request. We reply within one working day to confirm
				the table. Nothing is booked until you hear from us.
			</Callout>
		);
	}

	return (
		<form action={action} noValidate className="space-y-5">
			{/* Honeypot: visually hidden, off the tab order, must stay empty. */}
			<div aria-hidden className="absolute h-0 w-0 overflow-hidden">
				<label htmlFor="booking-website">Leave this empty</label>
				<input
					id="booking-website"
					name="website"
					tabIndex={-1}
					autoComplete="off"
				/>
			</div>

			{state.errors?.form && <FormError>{state.errors.form}</FormError>}

			<Field label="Your name" name="name" error={state.errors?.name}>
				<Input autoComplete="name" required />
			</Field>
			<Field label="Email" name="email" error={state.errors?.email}>
				<Input type="email" autoComplete="email" required />
			</Field>
			<Field label="Phone" name="phone" error={state.errors?.phone}>
				<Input type="tel" autoComplete="tel" required />
			</Field>

			<Field
				label="How many people?"
				name="party_size"
				error={state.errors?.party_size}
			>
				<Select
					required
					defaultValue="2"
					onChange={(e) => setLargeParty(e.target.value === "9")}
				>
					{[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
						<option key={n} value={n}>
							{n}
						</option>
					))}
					<option value="9">9 or more</option>
				</Select>
			</Field>
			{largeParty && (
				<Field
					label="Tell us how many, and anything we should know"
					name="party_note"
					hint="Large parties are worth a conversation, so we will call you."
					error={state.errors?.party_note}
				>
					<Input id={noteId} />
				</Field>
			)}

			<Field label="Preferred date" name="date" error={state.errors?.date}>
				<Input type="date" required />
			</Field>

			{slots.length > 0 ? (
				<Field label="Preferred time" name="time" error={state.errors?.time}>
					<Select required>
						{slots.map((t) => (
							<option key={t} value={t}>
								{t}
							</option>
						))}
					</Select>
				</Field>
			) : (
				<Field
					label="Preferred time"
					name="time"
					hint="We will confirm the nearest table to this."
					error={state.errors?.time}
				>
					<Input type="time" required />
				</Field>
			)}

			<Field label="Occasion" name="occasion" optional>
				<Select defaultValue="none">
					{OCCASIONS.map((o) => (
						<option key={o.value} value={o.value}>
							{o.label}
						</option>
					))}
				</Select>
			</Field>

			<Field
				label="Anything else we should know?"
				name="notes"
				optional
				hint="Allergies, access needs, a high chair."
				error={state.errors?.notes}
			>
				<Textarea maxLength={500} />
			</Field>

			<GdprConsent />
			<SubmitButton label="Request a table" />
		</form>
	);
}
