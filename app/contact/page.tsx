import type { Metadata } from "next";
import Link from "next/link";
import { GeneralContactForm } from "@/components/site/forms/contact-form";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Lead } from "@/components/ui/typography";
import { venue } from "@/lib/venue";

/*
  Doc 04 §/contact, locked by Doc 09 §3.20: hero, audience router above the
  form, general form of four fields, phone and address at the foot. No
  breadcrumbs here, per Doc 03 §7, which names /contact as a single-purpose
  top-level page where they would be noise.
*/

export const metadata: Metadata = {
	title: "Talk to us · Off the Hook",
	description:
		"Get in touch with Off the Hook. Funders, referral partners, employers and diners each have a faster route, and everything else can come through the form.",
};

/* Doc 04 gives these four prompts and their destinations. */
const AUDIENCE_ROUTES = [
	{
		label: "I'm a funder",
		href: "/partners/funders",
		note: "What your money buys, and what we report back.",
	},
	{
		label: "I'm a referral partner",
		href: "/partners/referrals",
		note: "Refer someone leaving custody, with the safeguarding route built in.",
	},
	{
		label: "I'm an employer",
		href: "/partners/employers",
		note: "Hire a graduate who has already worked a real service.",
	},
	{
		label: "I want to book a table",
		href: "/restaurant/book",
		note: "The restaurant is the training floor. Booking one funds the other.",
	},
] as const;

export default function ContactPage() {
	const hasPhone = venue.phoneDisplay !== null && venue.phoneHref !== null;
	const hasAddress =
		venue.addressLines !== null && venue.addressLines.length > 0;

	return (
		<>
			<Section spacing="sm">
				<Container width="narrow">
					<h1>Talk to us.</h1>
					<Lead className="mt-4">
						If your question does not fit anywhere else on the site, this is the
						place for it.
					</Lead>
				</Container>
			</Section>

			<Section spacing="sm">
				<Container>
					{/* Copy verbatim, per Doc 09 §3.20. */}
					<p className="max-w-[var(--measure)] text-text-secondary">
						For the fastest reply, use the pages built for you.
					</p>
					<ul className="mt-6 grid gap-4 sm:grid-cols-2">
						{AUDIENCE_ROUTES.map((route) => (
							<li key={route.href}>
								<Card interactive className="h-full">
									<h2 className="text-[length:var(--fs-h3)]">
										<Link
											href={route.href}
											className="underline-offset-4 hover:underline"
										>
											{route.label}
										</Link>
									</h2>
									<p className="mt-2 text-[length:var(--fs-small)] text-text-secondary">
										{route.note}
									</p>
								</Card>
							</li>
						))}
					</ul>
				</Container>
			</Section>

			<Section spacing="md" background="surface">
				<Container width="narrow">
					<h2>Anything else</h2>
					<p className="mt-3 max-w-[var(--measure)] text-text-secondary">
						Four fields. We read every one of these ourselves.
					</p>
					<div className="mt-8">
						<GeneralContactForm />
					</div>
				</Container>
			</Section>

			<Section spacing="sm">
				<Container width="narrow">
					<h2 className="text-[length:var(--fs-h3)]">Phone and address</h2>
					{hasPhone || hasAddress ? (
						<div className="mt-4 space-y-4 text-text-secondary">
							{hasPhone && (
								<p>
									<a href={`tel:${venue.phoneHref}`}>{venue.phoneDisplay}</a>.{" "}
									{venue.answerHours}
								</p>
							)}
							{hasAddress && (
								<address className="not-italic">
									{venue.addressLines?.map((line) => (
										<span key={line} className="block">
											{line}
										</span>
									))}
								</address>
							)}
						</div>
					) : (
						/*
						  Both live in lib/venue.ts and both are unset. A wrong number here
						  is worse than none, so this says so rather than inventing one.
						*/
						<p className="mt-4 max-w-[var(--measure)] text-text-secondary">
							Our phone line and our address are still being set up. Until they
							are, the form above is the fastest way to reach us, and we reply
							within two working days.
						</p>
					)}
				</Container>
			</Section>
		</>
	);
}
