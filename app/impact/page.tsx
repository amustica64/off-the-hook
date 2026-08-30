import type { Metadata } from "next";
import { Reveal } from "@/components/motion/reveal";
import { CtaBand } from "@/components/site/cta-band";
import { StoryCarousel } from "@/components/site/story-card";
import { MetricTile } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Lead } from "@/components/ui/typography";
import { getGrantedStories, getHomeMetrics } from "@/lib/data/home";
import { formatMetric, metricLabel } from "@/lib/impact-metrics";

export const metadata: Metadata = {
	title: "Impact · Off the Hook",
	description:
		"Dated, sourced impact numbers from the Off the Hook programme, updated at least every 90 days.",
};

export const revalidate = 300;

/*
  Doc 09 §3.9. Year chips render once more than one year exists; the M2
  cross-fade activates with them. The report download appears when the first
  report file exists. Sources are disclosures, never tooltips.
*/

export default async function ImpactPage() {
	const [metrics, stories] = await Promise.all([
		getHomeMetrics(),
		getGrantedStories(3),
	]);
	const years = [...new Set(metrics.map((m) => m.year))].sort((a, b) => b - a);
	const year = years[0];
	const current = metrics.filter((m) => m.year === year);
	const headline = current.find((m) => m.metric_key === "people_trained");

	return (
		<>
			<Section spacing="sm">
				<Container width="narrow">
					<Reveal>
						<h1>Impact.</h1>
						<Lead className="mt-4">
							Every metric on this page is updated at least every 90 days.
							Sources shown on every number.
						</Lead>
					</Reveal>
				</Container>
			</Section>

			{/* The page's one theatrical moment: the headline metric in Fraunces display. */}
			{headline && (
				<Section spacing="sm">
					<Container>
						{years.length > 1 && (
							<nav aria-label="Years" className="mb-8 flex gap-2">
								{years.map((y) => (
									<span
										key={y}
										className={
											y === year
												? "rounded-full bg-accent-fill px-4 py-2 text-[length:var(--fs-small)] text-cream-50"
												: "rounded-full border border-divider px-4 py-2 text-[length:var(--fs-small)] text-text-secondary"
										}
									>
										{y}
									</span>
								))}
							</nav>
						)}
						<Reveal>
							<p className="display tabular-nums">
								{formatMetric(headline.metric_key, String(headline.value))}
							</p>
							<Lead className="mt-2">
								people through the programme so far, {year}.
							</Lead>
						</Reveal>
					</Container>
				</Section>
			)}

			<Section spacing="md" background="surface">
				<Container>
					<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
						{current.map((m) => (
							<MetricTile
								key={m.metric_key}
								value={formatMetric(m.metric_key, String(m.value))}
								metricKey={m.metric_key}
								numericValue={Number(m.value)}
								label={metricLabel(m.metric_key)}
								source={m.source_note ?? undefined}
								updated={String(m.year)}
								className="bg-bg"
							/>
						))}
					</div>
					{current.length === 0 && (
						<p className="text-center text-text-muted">
							First figures publish after the pilot phase.
						</p>
					)}
				</Container>
			</Section>

			{stories.length > 0 && (
				<Section spacing="md">
					<Container>
						<Reveal>
							<h2>Behind the numbers.</h2>
						</Reveal>
						<div className="mt-8">
							<StoryCarousel
								stories={stories.map((s) => ({
									...s,
									cover: {
										"danny-makes-bread": "/heroes/bread-and-menu.webp",
										"michelle-runs-the-pass": "/heroes/training-session.webp",
										"what-the-kitchen-taught-us":
											"/heroes/plate-beef-shin.webp",
										"the-tuesday-lunch-club":
											"/heroes/dining-room-morning.webp",
									}[s.slug],
								}))}
							/>
						</div>
					</Container>
				</Section>
			)}

			{/* Report download renders when the first report exists in storage. */}

			<CtaBand
				heading="Fund the next phase."
				columns={[
					{
						heading: "Fund the work",
						line: "Cost per trainee, outcome rates, and retention, all dated and sourced. Ask for the pack.",
						cta: "Talk to us",
						href: "/partners/funders",
					},
				]}
			/>
		</>
	);
}
