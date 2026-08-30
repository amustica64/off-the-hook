import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@/components/motion/reveal";
import { StoryCard } from "@/components/site/story-card";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Lead } from "@/components/ui/typography";
import { getStories, STORY_CATEGORIES, STORY_COVERS } from "@/lib/data/stories";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
	title: "Stories from the kitchen · Off the Hook",
	description:
		"Trainee stories, alumni updates and kitchen notes from Off the Hook. Every story published with explicit consent.",
};

export const revalidate = 300;

/* Doc 09 §3.10: slim hero, filter chips, 3/2/1 grid, consent note at the foot. */

export default async function StoriesPage({
	searchParams,
}: {
	searchParams: Promise<{ category?: string }>;
}) {
	const { category } = await searchParams;
	const valid = STORY_CATEGORIES.some((c) => c.key === category)
		? category
		: undefined;
	const list = await getStories(valid);

	return (
		<>
			<Section spacing="sm">
				<Container width="narrow">
					<Reveal>
						<h1>Stories from the kitchen.</h1>
						<Lead className="mt-4">
							The people this is for, in their own words and ours.
						</Lead>
					</Reveal>
					<nav
						aria-label="Story categories"
						className="mt-6 flex flex-wrap gap-2"
					>
						<Link
							href="/stories"
							className={cn(
								"rounded-full px-4 py-2 text-[length:var(--fs-small)] transition-colors duration-[var(--dur-fast)]",
								!valid
									? "bg-accent-fill text-cream-50"
									: "border border-divider text-text-secondary hover:border-accent hover:text-accent",
							)}
						>
							All
						</Link>
						{STORY_CATEGORIES.map((c) => (
							<Link
								key={c.key}
								href={`/stories?category=${c.key}`}
								className={cn(
									"rounded-full px-4 py-2 text-[length:var(--fs-small)] transition-colors duration-[var(--dur-fast)]",
									valid === c.key
										? "bg-accent-fill text-cream-50"
										: "border border-divider text-text-secondary hover:border-accent hover:text-accent",
								)}
							>
								{c.label}
							</Link>
						))}
					</nav>
				</Container>
			</Section>

			<Section spacing="sm">
				<Container>
					{list.length === 0 ? (
						<p className="max-w-[var(--measure)] text-text-muted">
							The first stories will publish after the pilot phase. In the
							meantime, read the founder note on the{" "}
							<Link
								href="/about"
								className="text-accent underline underline-offset-4"
							>
								about page
							</Link>
							.
						</p>
					) : (
						<ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
							{list.map((s) => (
								<li key={s.slug} className="[&>a]:w-full [&>a]:sm:w-full">
									<StoryCard story={{ ...s, cover: STORY_COVERS[s.slug] }} />
								</li>
							))}
						</ul>
					)}
					<p className="mt-10 text-[length:var(--fs-small)] text-text-muted">
						Every story is published with explicit consent. Names are used where
						consent covers publication; otherwise aliases.
					</p>
				</Container>
			</Section>
		</>
	);
}
