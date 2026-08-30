/*
  Venue facts: the phone number, the opening hours, the address.

  Every one of these is unset, and that is not an oversight. No document in the
  pack carries them. Doc 04's admin Settings surface is where they are meant to
  live ("site-wide settings: hero copy, contact details, opening hours,
  safeguarding lead, feature flags"), and that surface is Phase 8.

  They are collected here rather than scattered so that filling them in is one
  edit, and so that no screen invents them. A wrong phone number on /join would
  send someone leaving prison to a stranger, which is worse than no number at
  all, so every consumer of this file degrades honestly instead.
*/

export type OpeningHours = {
	/** 0 = Sunday, matching Date.getDay(). */
	day: number;
	opens: string;
	closes: string;
}[];

export const venue = {
	/** E.164 for the tel: href. Null until the CIC's line is live. */
	phoneHref: null as string | null,
	/** Display form, as it should read on the page. */
	phoneDisplay: null as string | null,
	/** When someone actually answers. Doc 04 §/join writes this line. */
	answerHours: "We answer between 10am and 6pm.",
	/** Null until the venue address is set (Doc 04 empty-state rule). */
	openingHours: null as OpeningHours | null,
} as const;

/**
 * 30 minute slots between opening hours, per Doc 04 /restaurant/book.
 * Returns an empty list while the hours are unset, and the booking form then
 * asks for a preferred time directly rather than offering invented slots.
 */
export function bookingSlots(hours: OpeningHours | null): string[] {
	if (!hours || hours.length === 0) return [];
	const seen = new Set<string>();
	for (const h of hours) {
		const [oh, om] = h.opens.split(":").map(Number);
		const [ch, cm] = h.closes.split(":").map(Number);
		for (let m = oh * 60 + om; m <= ch * 60 + cm - 30; m += 30) {
			seen.add(
				`${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`,
			);
		}
	}
	return [...seen].sort();
}
