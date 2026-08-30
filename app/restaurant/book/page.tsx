import type { Metadata } from "next";
import { BookingForm } from "@/components/site/forms/booking-form";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Lead } from "@/components/ui/typography";
import { venue } from "@/lib/venue";

export const metadata: Metadata = { title: "Book a table · Off the Hook" };

const DAYS = [
	"Sunday",
	"Monday",
	"Tuesday",
	"Wednesday",
	"Thursday",
	"Friday",
	"Saturday",
];

/*
  Doc 09 §3.7. Narrow column, no hero image, H1, the honest lead about live
  availability, the form, then the hours summary and the phone number below it.

  Sign-off is ninety seconds on a 375px phone with a screen reader, and zero
  optional fields before the fold, which is why occasion and notes sit last.

  Hours and the phone number are unset (lib/venue.ts) because no document
  carries them and Doc 04 puts them in the admin Settings surface. Both degrade
  to an honest line rather than an invented one.
*/
export default function Page() {
	return (
		<Section>
			<Container width="narrow">
				<h1>Book a table.</h1>
				<Lead className="mt-4">
					Tell us when and how many. We reply within one working day. Full
					deposit booking with live availability launches soon.
				</Lead>

				<div className="mt-10">
					<BookingForm />
				</div>

				<div className="mt-12 border-t border-divider pt-8">
					<h2 className="text-[length:var(--fs-h3)]">Opening hours</h2>
					{venue.openingHours ? (
						<ul className="mt-3 space-y-1 text-text-secondary">
							{venue.openingHours.map((h) => (
								<li key={`${h.day}-${h.opens}`} className="tabular-nums">
									{DAYS[h.day]}: {h.opens} to {h.closes}
								</li>
							))}
						</ul>
					) : (
						/* Doc 04 empty-state rule: hours publish with the venue address. */
						<p className="mt-3 text-text-secondary">
							Hours publish with the address. Send the form and we will confirm
							a time that works.
						</p>
					)}

					{venue.phoneHref && venue.phoneDisplay ? (
						<p className="mt-6">
							<a
								href={`tel:${venue.phoneHref}`}
								className="text-[length:var(--fs-h3)] text-accent underline underline-offset-4"
							>
								{venue.phoneDisplay}
							</a>
						</p>
					) : (
						<p className="mt-6 text-text-secondary">
							Our phone line goes live with the restaurant. Until then the form
							is the fastest way to reach us.
						</p>
					)}
				</div>
			</Container>
		</Section>
	);
}
