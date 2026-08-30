import type { Metadata } from "next";
import { Reveal } from "@/components/motion/reveal";
import { EnquiryForm } from "@/components/site/forms/enquiry-form";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Eyebrow, Lead } from "@/components/ui/typography";

export const metadata: Metadata = {
	title: "Deliver qualifications with us · Off the Hook",
	description:
		"For colleges, programme leads and awarding bodies: deliver accredited qualifications with Off the Hook.",
};

/* Doc 09 §3.15. Enquiry lands with type=educator. */

const quals = [
	{ name: "Food Safety in Catering", level: "Level 2", body: "Highfield" },
	{ name: "Professional Cookery", level: "Level 2", body: "City & Guilds" },
	{ name: "First Aid for Mental Health", level: "Level 1", body: "RSPH" },
];

export default function EducationPage() {
	return (
		<>
			<Section spacing="sm">
				<Container width="narrow">
					<Reveal>
						<Eyebrow>For educators</Eyebrow>
						<h1 className="mt-3">Deliver qualifications with us.</h1>
						<Lead className="mt-4">
							We work with colleges and awarding bodies to put nationally
							recognised qualifications inside a real kitchen. Assessment
							happens on the pass, not in an exam hall.
						</Lead>
					</Reveal>
				</Container>
			</Section>

			<Section spacing="sm" background="surface">
				<Container width="narrow">
					<h2>Qualifications currently offered.</h2>
					<ul className="mt-6">
						{quals.map((q) => (
							<li
								key={q.name}
								className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-divider py-4 first:border-t"
							>
								<p className="font-medium text-copper-500">{q.name}</p>
								<p className="text-[length:var(--fs-small)] text-text-secondary">
									{q.level} · {q.body}
								</p>
							</li>
						))}
					</ul>
				</Container>
			</Section>

			<Section spacing="md">
				<Container width="narrow">
					<h2>Talk to us about a partnership.</h2>
					<div className="mt-6">
						<EnquiryForm
							type="educator"
							sourcePage="/partners/education"
							submitLabel="Start a conversation"
							organisationLabel="College or awarding body"
						/>
					</div>
				</Container>
			</Section>
		</>
	);
}
