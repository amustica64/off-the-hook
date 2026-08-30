import type { Metadata } from "next";
import { Reveal } from "@/components/motion/reveal";
import { CtaBand } from "@/components/site/cta-band";
import { ImageSlot } from "@/components/site/image-slot";
import { JourneyCompact } from "@/components/site/journey-compact";
import { StoryCarousel } from "@/components/site/story-card";
import { Button, LinkButton, TextLink } from "@/components/ui/button";
import { MetricTile, StatCard } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Input } from "@/components/ui/field";
import { Section } from "@/components/ui/section";
import { Display, Eyebrow, Lead } from "@/components/ui/typography";
import {
	getGrantedStories,
	getHomeMetrics,
	getJourneySteps,
} from "@/lib/data/home";
import { formatMetric, metricLabel } from "@/lib/impact-metrics";

export const metadata: Metadata = {
	title: "Off the Hook · A hospitality-led training academy for prison leavers",
	description:
		"A working London restaurant and a serious training academy. Real work, nationally recognised qualifications, and jobs on the other side.",
};

export const revalidate = 300;

const HOME_TILE_KEYS = [
	"people_trained",
	"qualifications_awarded",
	"employment_rate",
	"meals_served",
];

export default async function Home() {
	const [metrics, stories, steps] = await Promise.all([
		getHomeMetrics(),
		getGrantedStories(6),
		getJourneySteps(),
	]);

	const tiles = HOME_TILE_KEYS.map((k) =>
		metrics.find((m) => m.metric_key === k),
	).filter((m): m is NonNullable<typeof m> => Boolean(m));
	const headline = metrics.find((m) => m.metric_key === "employment_rate");

	/*
	  Story covers are empty until the media table lands (Phase 8) and the new
	  master anchors are signed off (Doc 19 §4). The whole pack set was retired
	  on 31 August: it was generated against the v1 Michelin register that Doc
	  18 revised withdraws. StoryCard falls back to the Doc 09 §1.6 cream panel
	  on its own when `cover` is undefined, so there is nothing to pass here.
	*/

	return (
		<>
			{/* Hero: 7/5 asymmetric split per Doc 09 §3.1. Two primary buttons max on this page. */}
			<Section spacing="md">
				<Container>
					<div className="grid items-center gap-10 lg:grid-cols-12">
						<div className="lg:col-span-7">
							<Reveal>
								<Eyebrow>Hospitality-led social enterprise</Eyebrow>
							</Reveal>
							{/* One beat per line: a deliberate stack beats a mid-phrase wrap (Doc 09 §1.1). */}
							<Reveal delay={0.08}>
								<Display className="mt-3">
									Real work.
									<br />
									Real qualifications.
									<br />
									Real chances.
								</Display>
							</Reveal>
							<Reveal delay={0.16}>
								<Lead className="mt-5">
									Off the Hook trains people leaving prison into paid restaurant
									work and nationally recognised qualifications. Referrals from
									probation and prison education. Service in a working kitchen.
									Employment on the other side.
								</Lead>
							</Reveal>
							<Reveal delay={0.24}>
								<div className="mt-8 flex flex-wrap gap-3">
									<LinkButton href="/restaurant/book">Book a table</LinkButton>
									<LinkButton href="/impact" variant="secondary">
										See the impact
									</LinkButton>
								</div>
							</Reveal>
						</div>
						<div className="relative lg:col-span-5">
							<Reveal delay={0.16}>
								<ImageSlot
									label="Plate finished at the pass, arm in frame"
									ratio="16/11"
								/>
							</Reveal>
							{headline && (
								<StatCard
									className="mt-4 lg:absolute lg:-bottom-8 lg:left-6 lg:mt-0"
									value={formatMetric(
										headline.metric_key,
										String(headline.value),
									)}
									label="of trainees into work within 6 months"
									source={`${headline.source_note ?? "Internal tracking"}, ${headline.year}`}
								/>
							)}
						</div>
					</div>
				</Container>
			</Section>

			{/* Section 1: the model, 6/5 split then the compact journey. */}
			<Section spacing="md">
				<Container>
					<div className="grid gap-8 lg:grid-cols-12">
						<h2 className="lg:col-span-6">How the programme works.</h2>
						<p className="text-text-secondary lg:col-span-5 lg:col-start-8">
							Twelve weeks in a working kitchen, one day a week in the
							classroom, all of it paid. The route from referral to employment
							has seven steps, and every one of them happens here.
						</p>
					</div>
					<JourneyCompact
						steps={steps.map((s) => ({
							order: s.order,
							title: s.title,
							subtitle: s.subtitle,
						}))}
					/>
					<div className="mt-8">
						<LinkButton href="/journey" variant="secondary">
							See the full journey
						</LinkButton>
					</div>
				</Container>
			</Section>

			{/* Section 2: impact strip. Sanctioned centred H2. Count-up lands in Phase 7 (M1). */}
			<Section spacing="md" background="surface">
				<Container>
					<Reveal>
						<h2 className="text-center">The numbers so far.</h2>
					</Reveal>
					{tiles.length > 0 ? (
						<div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
							{tiles.map((m) => (
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
					) : (
						<p className="mt-8 text-center text-text-muted">
							First figures publish after the pilot phase.
						</p>
					)}
					<div className="mt-8 text-center">
						<TextLink href="/impact">See all impact data</TextLink>
					</div>
				</Container>
			</Section>

			{/* Section 3: stories. Hides entirely below three granted stories (Doc 09 §3.1). */}
			{stories.length >= 3 && (
				<Section spacing="md">
					<Container>
						<div className="flex flex-wrap items-end justify-between gap-4">
							<h2>The people this is for.</h2>
							<p className="text-[length:var(--fs-small)] text-text-muted">
								Every story is published with explicit consent.
							</p>
						</div>
						<div className="mt-8">
							<StoryCarousel stories={stories} />
						</div>
						<TextLink href="/stories">All stories</TextLink>
					</Container>
				</Section>
			)}

			{/* Section 4: restaurant teaser, 6/5 split, image left. Second and last primary button. */}
			<Section spacing="md">
				<Container>
					<div className="grid items-center gap-10 lg:grid-cols-12">
						<div className="lg:col-span-6">
							<Reveal>
								<ImageSlot
									label="Full room mid-service, warm light"
									ratio="4/3"
									sizes="(max-width: 1024px) 100vw, 50vw"
								/>
							</Reveal>
						</div>
						<div className="lg:col-span-5 lg:col-start-8">
							<h2>Come and eat with us.</h2>
							<p className="mt-4 text-text-secondary">
								A short menu that changes weekly, cooked and served by the
								current cohort. Every table pays for training. The food stands
								on its own.
							</p>
							<div className="mt-6 flex flex-wrap gap-3">
								<LinkButton href="/restaurant/book">Book a table</LinkButton>
								<TextLink href="/restaurant/menu" className="self-center">
									See the menu
								</TextLink>
							</div>
						</div>
					</div>
				</Container>
			</Section>

			{/* Section 5: partners band, hairline columns, no boxes, no icons. */}
			<CtaBand
				heading="Fund it. Refer to it. Hire from it."
				columns={[
					{
						heading: "Fund the work",
						line: "Grants, sponsorship, multi-year partnerships. Every metric dated and sourced.",
						cta: "Talk to us",
						href: "/partners/funders",
					},
					{
						heading: "Refer someone",
						line: "Probation, prison education, third sector. We reply within two working days.",
						cta: "See how",
						href: "/partners/referrals",
					},
					{
						heading: "Hire a graduate",
						line: "Qualified, work-ready, and backed by us for the first year.",
						cta: "Partner with us",
						href: "/partners/employers",
					},
				]}
				footnote={
					<>
						Been referred to us, or want to be?{" "}
						<TextLink href="/join" className="text-cream-25">
							Start here
						</TextLink>
						.
					</>
				}
			/>

			{/* Section 6: founder note, narrow, the site's only circular crop. */}
			<Section spacing="md">
				<Container width="narrow">
					<div className="flex items-start gap-5">
						{/*
						  Doc 09 §3.1 puts a 96px circular portrait of Anne here, and circles
						  are reserved for people. The slot stays, empty, until the real shoot
						  lands: a founder's likeness is a real-shoot subject under the Doc 18
						  safe lane and is never generated. Labelled for screen readers rather
						  than in view, because 96px cannot carry the eyebrow text Doc 09 §1.6
						  asks for at larger sizes.
						*/}
						<div
							role="img"
							aria-label="Photograph to come: Anne Kiragu, founder"
							className="h-24 w-24 shrink-0 rounded-full border border-divider bg-surface"
						/>
						<div>
							<p className="text-text-secondary">
								I have run kitchens for twenty years. The best people I ever
								hired were the ones nobody else would interview. Off the Hook
								exists because a kitchen is the fairest room I know: the work is
								in front of everyone, and the work is what counts.
							</p>
							<p className="mt-4 text-text-secondary">
								Come and eat. That is the whole ask. The rest follows from a
								full dining room.
							</p>
							<p className="mt-4 text-[length:var(--fs-small)] text-text-muted">
								Anne Kiragu, founder
							</p>
							<div className="mt-4">
								<TextLink href="/about">Read the full story</TextLink>
							</div>
						</div>
					</div>
				</Container>
			</Section>

			{/* Section 7 (news teaser) is hidden: no news content model exists yet. Doc 04 empty-state rule: hide. */}

			{/* Section 8: sign-up strip. */}
			<Section spacing="sm" background="surface">
				<Container width="narrow" className="text-center">
					<h3>One email a month.</h3>
					<p className="mt-2 text-text-secondary">
						The kitchen, the academy, and the numbers. No noise.
					</p>
					<form
						className="mx-auto mt-5 flex max-w-md flex-col gap-3 sm:flex-row"
						aria-label="Newsletter sign-up"
					>
						<label htmlFor="home-email" className="sr-only">
							Email address
						</label>
						<Input
							id="home-email"
							name="email"
							type="email"
							required
							placeholder="you@example.com"
						/>
						<Button type="submit" className="shrink-0">
							Sign up
						</Button>
					</form>
				</Container>
			</Section>
		</>
	);
}
