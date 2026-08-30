import type { Metadata } from "next";
import { Reveal } from "@/components/motion/reveal";
import { CtaBand } from "@/components/site/cta-band";
import { ImageSlot } from "@/components/site/image-slot";
import { TextLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Eyebrow, Lead, Prose } from "@/components/ui/typography";

export const metadata: Metadata = {
	title: "About · Off the Hook",
	description:
		"The founder story and the operating shape of Off the Hook CIC: a working restaurant and a training academy for prison leavers.",
};

/* Doc 09 §3.2. The team grid is hidden: no team content model exists yet (gap logged). */

export default function AboutPage() {
	return (
		<>
			<Section spacing="md">
				<Container width="narrow">
					<Reveal>
						<Eyebrow>About Off the Hook</Eyebrow>
						<h1 className="mt-3">
							A CIC built around the kitchen we would want to work in.
						</h1>
						<Lead className="mt-5">
							Off the Hook is a community interest company. It runs a real
							restaurant, and the restaurant runs a training academy. Neither
							works without the other.
						</Lead>
					</Reveal>
				</Container>
			</Section>

			{/* Anne's story: prose with the portrait breaking the column edge (the page's one layout event). */}
			<Section spacing="md">
				<Container width="narrow" className="relative">
					<h2>Anne Kiragu, founder.</h2>
					<div className="mt-6 lg:float-right lg:-mr-40 lg:ml-8 lg:w-80">
						<Reveal>
							<ImageSlot
								label="Anne Kiragu, portrait in the kitchen"
								src="/heroes/portrait-anne.webp"
								ratio="4/5"
								sizes="320px"
							/>
						</Reveal>
					</div>
					<Prose className="mt-6">
						{/* Draft in Anne's voice, for her approval before launch (content sign-off owed). */}
						<p>
							Anne has run kitchens for twenty years. Hotel brigades, a
							gastropub, seven years as head chef of a neighbourhood bistro that
							never once missed a service. The best people she hired in that
							time, the ones who stayed longest and worked hardest, were the
							ones nobody else would interview.
						</p>
						<p>
							The first was a man on licence who asked for the pot wash job
							because it was the only one he thought he could get. Within a year
							he was running the larder section. He is a head chef now, at
							someone else's restaurant, which is the point.
						</p>
						<p>
							Off the Hook exists to do that on purpose instead of by accident.
							A kitchen is the fairest room Anne knows. The work is in front of
							everyone, the standard is the same for everyone, and the plate
							does not care where you have been. Twelve weeks of paid training,
							a nationally recognised qualification, and a dining room full of
							people who came for the food.
						</p>
						<p>
							The restaurant pays for the academy. The academy staffs the
							restaurant. Come and eat, and the model works.
						</p>
					</Prose>
				</Container>
			</Section>

			<Section spacing="md" background="surface">
				<Container>
					<div className="grid gap-8 lg:grid-cols-12">
						<h2 className="lg:col-span-5">Why hospitality.</h2>
						<div className="space-y-4 text-text-secondary lg:col-span-6 lg:col-start-7">
							<p>
								Hospitality is one of the few industries that hires on skill
								demonstrated today, not history declared on a form. It is
								short-staffed, it trains on the job, and it promotes fast.
							</p>
							<p>
								It is also visible. A trainee who serves forty covers on a
								Thursday night has proof of work no certificate can match, and a
								reference from a kitchen that expected the same standard it
								expects of everyone.
							</p>
							<p>
								Short version: the industry needs people, and our people need
								exactly this kind of door.
							</p>
						</div>
					</div>
				</Container>
			</Section>

			<Section spacing="md">
				<Container width="narrow">
					<h2>What being a CIC means.</h2>
					<Prose className="mt-6">
						<p>
							A community interest company is a business with a locked purpose.
							Profits go back into the training programme, not to shareholders.
							An asset lock means the company's assets can only serve that
							purpose.
						</p>
						<p>
							We file a community interest report every year alongside our
							accounts, so anyone can check that the money did what we said it
							would.
						</p>
						<p>
							<TextLink href="/legal/cic-declaration">
								Read the full CIC declaration
							</TextLink>
						</p>
					</Prose>
				</Container>
			</Section>

			{/* Team grid renders once a team content model exists and the team exceeds six (Doc 09 §3.2). */}

			<CtaBand
				heading="Two ways to move this forward."
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
				]}
			/>
		</>
	);
}
