import { Briefcase, GraduationCap, Landmark, UserPlus } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@/components/motion/reveal";
import { PartnerLogos } from "@/components/site/partner-logos";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Lead } from "@/components/ui/typography";
import { getPartners } from "@/lib/data/partners";

export const metadata: Metadata = {
	title: "For partners · Off the Hook",
	description:
		"Fund the work, refer someone, hire a graduate, or deliver qualifications with us.",
};

export const revalidate = 300;

/* Doc 09 §3.11: hub with four role cards (one icon each) and a partner logo strip. */

const roles = [
	{
		icon: Landmark,
		title: "Funders",
		note: "Fund measurable work.",
		href: "/partners/funders",
	},
	{
		icon: UserPlus,
		title: "Referrers",
		note: "Refer someone to the programme.",
		href: "/partners/referrals",
	},
	{
		icon: Briefcase,
		title: "Employers",
		note: "Hire a work-ready graduate.",
		href: "/partners/employers",
	},
	{
		icon: GraduationCap,
		title: "Educators",
		note: "Deliver qualifications with us.",
		href: "/partners/education",
	},
];

export default async function PartnersPage() {
	const partners = await getPartners();

	return (
		<>
			<Section spacing="sm">
				<Container width="narrow">
					<Reveal>
						<h1>For partners.</h1>
						<Lead className="mt-4">
							Four ways to work with us. Each has its own page, its own form,
							and a person who reads it.
						</Lead>
					</Reveal>
				</Container>
			</Section>

			<Section spacing="sm">
				<Container>
					<ul className="grid gap-6 sm:grid-cols-2">
						{roles.map((r) => (
							<li key={r.href}>
								<Link
									href={r.href}
									className="group flex h-full flex-col rounded-[var(--r-md)] border border-divider bg-surface p-6 transition-[border-color,box-shadow] duration-[var(--dur-fast)] hover:border-accent hover:shadow-[var(--shadow-md)]"
								>
									<r.icon size={24} aria-hidden className="text-accent" />
									<h3 className="mt-4 group-hover:underline group-hover:underline-offset-4">
										{r.title}
									</h3>
									<p className="mt-1 text-text-secondary">{r.note}</p>
									<span className="mt-4 text-[length:var(--fs-small)] font-medium text-accent">
										Learn more
									</span>
								</Link>
							</li>
						))}
					</ul>
				</Container>
			</Section>

			{partners.length >= 3 && (
				<Section spacing="md" background="surface">
					<Container>
						<h2>The people we work with.</h2>
						<div className="mt-8">
							<PartnerLogos partners={partners} />
						</div>
					</Container>
				</Section>
			)}
		</>
	);
}
