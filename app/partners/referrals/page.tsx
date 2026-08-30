import type { Metadata } from "next";
import { ReferralForm } from "@/components/site/forms/referral-form";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Callout, Eyebrow, Lead } from "@/components/ui/typography";

export const metadata: Metadata = {
	title: "Refer someone · Off the Hook",
	description:
		"For probation, prison education and third-sector partners: refer someone to the Off the Hook academy.",
};

/* Doc 09 §3.13. Data lands in referrals via create_referral; safeguarding-only. */

const criteria = [
	"Aged 18 or over.",
	"Released, or within about six weeks of release.",
	"Motivated to train and work in a kitchen.",
	"Safeguarding-appropriate for a public-facing restaurant.",
	"Able to travel to the restaurant for the working week.",
];

const steps = [
	"You submit the form below.",
	"Our safeguarding lead calls you within two working days.",
	"We meet the candidate for an informal assessment.",
	"Induction week, paid from day one.",
	"The twelve-week programme starts.",
];

export default function ReferralsPage() {
	return (
		<>
			<Section spacing="sm">
				<Container width="narrow">
					<Eyebrow>For referral partners</Eyebrow>
					<h1 className="mt-3">Refer someone to Off the Hook.</h1>
					<Lead className="mt-4">
						We take referrals from probation, prison education and third-sector
						partners. It takes five minutes, and a real person reads every one.
					</Lead>
				</Container>
			</Section>

			<Section spacing="sm">
				<Container width="narrow">
					<div className="grid gap-10 md:grid-cols-2">
						<div>
							<h2 className="text-[length:var(--fs-h3)]">Who we can take.</h2>
							<ul className="mt-4 space-y-2">
								{criteria.map((c) => (
									<li
										key={c}
										className="border-b border-divider pb-2 text-[length:var(--fs-small)] text-text-secondary"
									>
										{c}
									</li>
								))}
							</ul>
						</div>
						<div>
							<h2 className="text-[length:var(--fs-h3)]">What happens next.</h2>
							<ol className="mt-4 space-y-3">
								{steps.map((s, i) => (
									<li
										key={s}
										className="flex gap-3 text-[length:var(--fs-small)] text-text-secondary"
									>
										<span className="font-serif font-medium tabular-nums text-accent">
											{i + 1}
										</span>
										{s}
									</li>
								))}
							</ol>
						</div>
					</div>
				</Container>
			</Section>

			<Section spacing="sm">
				<Container width="narrow">
					<Callout tone="important">
						Referrals are held encrypted and read only by our safeguarding lead.
						Every access is logged. Urgent case? Call us and ask for
						safeguarding.
					</Callout>
				</Container>
			</Section>

			<Section spacing="sm" background="surface">
				<Container width="narrow">
					<h2>The referral form.</h2>
					<p className="mt-2 text-text-secondary">
						We reply within two working days.
					</p>
					<div className="mt-6">
						<ReferralForm />
					</div>
				</Container>
			</Section>
		</>
	);
}
