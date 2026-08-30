import type { Metadata } from "next";
import { Reveal } from "@/components/motion/reveal";
import { EnquiryForm } from "@/components/site/forms/enquiry-form";
import { PartnerLogos } from "@/components/site/partner-logos";
import { LinkButton } from "@/components/ui/button";
import { MetricTile } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Eyebrow, Lead } from "@/components/ui/typography";
import { getHomeMetrics } from "@/lib/data/home";
import { getPartners } from "@/lib/data/partners";
import { formatMetric, metricLabel } from "@/lib/impact-metrics";

export const metadata: Metadata = {
	title: "Fund the next chapter · Off the Hook",
	description:
		"Fund measurable work: cost per trainee, outcome rates and retention, all dated and sourced.",
};

export const revalidate = 300;

/* Doc 09 §3.12. Enquiry lands with type=funder. */

const measurable = [
	"Cost per trainee, published and dated.",
	"Employment rate at six and twelve months.",
	"Qualifications awarded per cohort.",
	"Reoffending compared with a matched national cohort.",
];

export default async function FundersPage() {
	const metrics = await getHomeMetrics();
	const partners = await getPartners("funder");
	const snapshot = [
		"people_trained",
		"employment_rate",
		"qualifications_awarded",
	]
		.map((k) => metrics.find((m) => m.metric_key === k))
		.filter((m): m is NonNullable<typeof m> => Boolean(m));

	return (
		<>
			<Section spacing="sm">
				<Container width="narrow">
					<Reveal>
						<Eyebrow>For funders</Eyebrow>
						<h1 className="mt-3">Fund the next chapter.</h1>
						<Lead className="mt-4">
							We measure what we do and we show our working. If you fund
							outcomes, this is a programme you can hold to account.
						</Lead>
						<div className="mt-6 flex flex-wrap gap-3">
							<LinkButton href="#funder-form">Talk to us</LinkButton>
							<LinkButton href="/impact" variant="secondary">
								See the impact
							</LinkButton>
						</div>
					</Reveal>
				</Container>
			</Section>

			{snapshot.length > 0 && (
				<Section spacing="sm">
					<Container>
						<div className="grid gap-6 sm:grid-cols-3">
							{snapshot.map((m) => (
								<MetricTile
									key={m.metric_key}
									value={formatMetric(m.metric_key, String(m.value))}
									label={metricLabel(m.metric_key)}
									source={m.source_note ?? undefined}
									updated={String(m.year)}
									className="bg-surface"
								/>
							))}
						</div>
					</Container>
				</Section>
			)}

			<Section spacing="sm" background="surface">
				<Container>
					<div className="grid gap-8 lg:grid-cols-12">
						<h2 className="lg:col-span-5">What funders can measure.</h2>
						<ul className="lg:col-span-6 lg:col-start-7">
							{measurable.map((m) => (
								<li
									key={m}
									className="border-b border-divider py-3 text-text-secondary"
								>
									{m}
								</li>
							))}
						</ul>
					</div>
				</Container>
			</Section>

			{partners.length >= 3 && (
				<Section spacing="sm">
					<Container>
						<PartnerLogos partners={partners} />
					</Container>
				</Section>
			)}

			<Section spacing="md" id="funder-form">
				<Container width="narrow">
					<h2>Talk to us.</h2>
					<p className="mt-2 text-text-secondary">
						Tell us what you fund and we will send the numbers that match.
					</p>
					<div className="mt-6">
						<EnquiryForm
							type="funder"
							sourcePage="/partners/funders"
							submitLabel="Start the conversation"
							organisationLabel="Foundation or organisation"
						/>
					</div>
				</Container>
			</Section>
		</>
	);
}
