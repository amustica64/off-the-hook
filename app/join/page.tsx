import type { Metadata } from "next";
import { JoinForm } from "@/components/site/forms/join-form";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { venue } from "@/lib/venue";

export const metadata: Metadata = {
	title: "Interested in training with us · Off the Hook",
};

/*
  Doc 09 §3.16, the most humane page on the site. Reading age ten, mobile-only,
  low-data audience.

  Locks applied: type sits one step larger than the site default, so body is
  --fs-lead throughout. Every step is one line. Short sentences. No photography
  of people, because the reader may be in a hostel or a library and the page
  should feel private rather than observed, so there is no ImageSlot here
  either.

  Taste pass: the phone number and the form are equal citizens, and on mobile
  the phone block renders directly under the four steps and before the form,
  because calling is the lower-friction path for this reader. The DOM order
  below is that order, and it does not change at any breakpoint.
*/

const STEPS = [
	"Fill in the short form, or call us.",
	"We call you back within 2 working days.",
	"We meet for a coffee and a chat.",
	"If it is a fit, we set up your first day.",
];

const PROGRAMME = [
	"You cook and serve.",
	"You learn on the job.",
	"You get a qualification.",
	"You get paid the London Living Wage.",
];

export default function Page() {
	return (
		<Section>
			<Container width="narrow" className="text-[length:var(--fs-lead)]">
				<h1>Interested in training with us?</h1>
				<p className="mt-4 text-text-secondary">
					This page is for you. If you have been referred, or you want to be
					referred, tell us a bit about yourself and we will call you back.
				</p>

				<section className="mt-12">
					<h2>What happens if you get in touch</h2>
					<ol className="mt-5 space-y-4">
						{STEPS.map((step, i) => (
							<li key={step} className="flex gap-4">
								<span
									aria-hidden
									className="shrink-0 font-serif text-[length:var(--fs-h3)] text-accent tabular-nums"
								>
									{i + 1}
								</span>
								<span className="pt-1 text-text-secondary">{step}</span>
							</li>
						))}
					</ol>
				</section>

				{/* Doc 09 §3.16 taste pass: the phone sits here, before the form. */}
				<section className="mt-12 border-y border-divider py-8">
					<h2>Or call us</h2>
					{venue.phoneHref && venue.phoneDisplay ? (
						<p className="mt-3">
							<a
								href={`tel:${venue.phoneHref}`}
								className="font-serif text-[length:var(--fs-h1)] text-accent underline underline-offset-8"
							>
								{venue.phoneDisplay}
							</a>
						</p>
					) : (
						/*
						  No number is shown until the CIC's line is live. A wrong number on
						  this page would send someone leaving prison to a stranger, which is
						  worse than no number, so the form carries the page until then.
						*/
						<p className="mt-3 text-text-secondary">
							Our phone line is being set up. Fill in the form below and we will
							call you.
						</p>
					)}
					<p className="mt-3 text-[length:var(--fs-body)] text-text-muted">
						{venue.answerHours}
					</p>
				</section>

				<section className="mt-12">
					<h2>What the programme is like</h2>
					<ul className="mt-5 space-y-3">
						{PROGRAMME.map((line) => (
							<li key={line} className="text-text-secondary">
								{line}
							</li>
						))}
					</ul>
				</section>

				<section className="mt-12">
					<h2>Tell us about yourself</h2>
					<p className="mt-3 text-text-secondary">
						Five questions. It takes a minute.
					</p>
					<div className="mt-8 text-[length:var(--fs-body)]">
						<JoinForm />
					</div>
				</section>
			</Container>
		</Section>
	);
}
