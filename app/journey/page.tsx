import type { Metadata } from "next";
import { Reveal } from "@/components/motion/reveal";
import { CtaBand } from "@/components/site/cta-band";
import { JourneyTimeline } from "@/components/site/journey-timeline";
import { TextLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Callout, Eyebrow, Lead } from "@/components/ui/typography";
import { getJourneySteps } from "@/lib/data/home";

export const metadata: Metadata = {
	title: "The academy · From referral to a real job",
	description:
		"How the Off the Hook academy works, end to end: seven steps from referral to employment, paid throughout, with nationally recognised qualifications.",
};

export const revalidate = 300;

/*
  Doc 09 §3.8, the signature page. The typical-week grid waits on a content
  model (gap logged); qualification names are confirmed with awarding bodies
  before launch.
*/

const qualifications = [
	{
		name: "Food Safety in Catering, Level 2",
		body: "Highfield",
		note: "Taken in week three",
	},
	{
		name: "Professional Cookery, Level 2",
		body: "City & Guilds",
		note: "Assessed in the kitchen across the programme",
	},
	{
		name: "Awareness of First Aid for Mental Health, Level 1",
		body: "RSPH",
		note: "Optional, offered every cohort",
	},
];

export default async function JourneyPage() {
	const steps = await getJourneySteps();

	return (
		<>
			<Section spacing="md">
				<Container width="narrow">
					<Reveal>
						<Eyebrow>The academy</Eyebrow>
						<h1 className="mt-3">From referral to a real job. Seven steps.</h1>
						<Lead className="mt-5">
							This page is the whole operating model. What happens at each step,
							what we provide, and what you leave with. Nothing here is
							aspiration: it is the programme as it runs.
						</Lead>
					</Reveal>
				</Container>
			</Section>

			<Section spacing="md">
				<Container>
					<JourneyTimeline
						steps={steps.map((s) => ({
							order: s.order,
							title: s.title,
							subtitle: s.subtitle,
							body: s.body,
							outcome_summary: s.outcome_summary,
						}))}
					/>
				</Container>
			</Section>

			{/* Qualifications: table rows, copper sanctioned on the qualification name only. */}
			<Section spacing="md" background="surface">
				<Container width="narrow">
					<Reveal>
						<h2>Qualifications we work toward.</h2>
					</Reveal>
					<ul className="mt-8">
						{qualifications.map((q) => (
							<li
								key={q.name}
								className="border-b border-divider py-4 first:border-t"
							>
								<div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
									<p className="font-medium text-copper-500">{q.name}</p>
									<p className="text-[length:var(--fs-small)] text-text-secondary">
										{q.body}
									</p>
								</div>
								<p className="mt-1 text-[length:var(--fs-small)] text-text-muted">
									{q.note}
								</p>
							</li>
						))}
					</ul>
					<p className="mt-4 text-[length:var(--fs-tiny)] text-text-muted">
						The final qualification list is confirmed with each awarding body
						before every cohort starts.
					</p>
				</Container>
			</Section>

			{/* Safeguarding and support. The named lead publishes once confirmed. */}
			<Section spacing="md">
				<Container>
					<div className="grid gap-10 lg:grid-cols-12">
						<div className="lg:col-span-6">
							<h2>Safeguarding and support.</h2>
							<div className="mt-4 space-y-4 text-text-secondary">
								<p>
									Every trainee has a named person, a weekly one-to-one, and a
									group check-in on Fridays. The code of conduct is two pages
									and everyone signs it, staff included.
								</p>
								<p>
									Referral information is held encrypted, read only by the
									safeguarding lead, and every access is logged. That is not a
									promise, it is how the database is built.
								</p>
							</div>
						</div>
						<div className="lg:col-span-5 lg:col-start-8">
							<Callout tone="important">
								The safeguarding lead's name and contact publish here once
								confirmed. The full statement, including how to raise a concern,
								is at{" "}
								<TextLink href="/legal/safeguarding" className="text-inherit">
									/legal/safeguarding
								</TextLink>
								.
							</Callout>
						</div>
					</div>
				</Container>
			</Section>

			<CtaBand
				heading="Open the door for someone."
				columns={[
					{
						heading: "Refer someone",
						line: "Probation, prison education, third sector. We reply within two working days.",
						cta: "See how",
						href: "/partners/referrals",
					},
					{
						heading: "Fund the work",
						line: "Every step above has a cost per trainee and a dated outcome. Ask for both.",
						cta: "Talk to us",
						href: "/partners/funders",
					},
				]}
				footnote={
					<>
						Thinking about training with us yourself?{" "}
						<TextLink href="/join" className="text-cream-25">
							This page is for you
						</TextLink>
						.
					</>
				}
			/>
		</>
	);
}
