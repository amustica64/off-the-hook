import type { Metadata } from "next";
import { Reveal } from "@/components/motion/reveal";
import { EnquiryForm } from "@/components/site/forms/enquiry-form";
import { PartnerLogos } from "@/components/site/partner-logos";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Eyebrow, Lead } from "@/components/ui/typography";
import { getPartners } from "@/lib/data/partners";

export const metadata: Metadata = {
	title: "Hire from Off the Hook · Off the Hook",
	description:
		"Hire qualified, work-ready hospitality staff, backed by us for the first year.",
};

export const revalidate = 300;

/* Doc 09 §3.14. Enquiry lands with type=employer. */

const pipeline = [
	"Trainee: twelve weeks in a working kitchen, paid.",
	"Qualified: nationally recognised credentials in hand.",
	"Work-ready: full services under real pressure.",
	"Into employment: interviews arranged before the programme ends.",
];

const brings = [
	{
		title: "Qualifications",
		body: "Level 2 food safety and professional cookery as standard.",
	},
	{
		title: "Experience",
		body: "Real services, real orders, a full working week.",
	},
	{
		title: "Values",
		body: "People who wanted this chance and turned up for it.",
	},
];

export default async function EmployersPage() {
	const partners = await getPartners("employer");

	return (
		<>
			<Section spacing="sm">
				<Container width="narrow">
					<Reveal>
						<Eyebrow>For employers</Eyebrow>
						<h1 className="mt-3">Hire from Off the Hook.</h1>
						<Lead className="mt-4">
							Qualified, work-ready people who have already held a station
							through a full service. We stay involved for the first year.
						</Lead>
					</Reveal>
				</Container>
			</Section>

			<Section spacing="sm" background="surface">
				<Container>
					<div className="grid gap-8 lg:grid-cols-12">
						<h2 className="lg:col-span-5">How the pipeline works.</h2>
						<ol className="lg:col-span-6 lg:col-start-7">
							{pipeline.map((p, i) => (
								<li
									key={p}
									className="flex gap-3 border-b border-divider py-3 text-text-secondary"
								>
									<span className="font-serif font-medium tabular-nums text-accent">
										{i + 1}
									</span>
									{p}
								</li>
							))}
						</ol>
					</div>
				</Container>
			</Section>

			<Section spacing="sm">
				<Container>
					<div className="grid gap-6 md:grid-cols-3">
						{brings.map((b, i) => (
							<Reveal key={b.title} delay={i * 0.08}>
								<div>
									<span className="font-serif text-[length:var(--fs-h2)] font-medium tabular-nums text-accent">
										{i + 1}
									</span>
									<h3 className="mt-1">{b.title}</h3>
									<p className="mt-2 text-text-secondary">{b.body}</p>
								</div>
							</Reveal>
						))}
					</div>
				</Container>
			</Section>

			{partners.length >= 3 && (
				<Section spacing="sm" background="surface">
					<Container>
						<PartnerLogos partners={partners} />
					</Container>
				</Section>
			)}

			<Section spacing="md">
				<Container width="narrow">
					<h2>Partner with us.</h2>
					<p className="mt-2 text-text-secondary">
						Tell us the roles you hire for and we will match graduates to them.
					</p>
					<div className="mt-6">
						<EnquiryForm
							type="employer"
							sourcePage="/partners/employers"
							submitLabel="Become a hiring partner"
							organisationLabel="Company"
						/>
					</div>
				</Container>
			</Section>
		</>
	);
}
