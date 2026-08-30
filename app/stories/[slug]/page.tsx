import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { ImageSlot } from "@/components/site/image-slot";
import { LinkButton } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Callout, Eyebrow, Prose, PullQuote } from "@/components/ui/typography";
import {
	getAnotherStory,
	getStory,
	readingTimeMinutes,
	STORY_COVERS,
} from "@/lib/data/stories";

export const revalidate = 300;

/*
  Doc 09 §3.10 detail. MDX renders with the restricted allowlist only
  (Doc 06 §3.4): PullQuote, Callout, Divider, Image. No raw HTML reaches
  the page: anything outside the allowlist renders as plain text elements.
*/
const mdxComponents = {
	PullQuote,
	Callout,
	Divider: () => <hr className="my-8 border-divider" />,
	Image: ImageSlot,
};

type Params = Promise<{ slug: string }>;

export async function generateMetadata({
	params,
}: {
	params: Params;
}): Promise<Metadata> {
	const story = await getStory((await params).slug);
	if (!story) return { title: "Story · Off the Hook" };
	return {
		title: `${story.title} · Off the Hook`,
		description: story.strapline ?? undefined,
	};
}

export default async function StoryPage({ params }: { params: Params }) {
	const { slug } = await params;
	const story = await getStory(slug);
	if (!story) notFound();
	const next = await getAnotherStory(slug);
	const minutes =
		story.reading_time_minutes ?? readingTimeMinutes(story.body_mdx);

	const jsonLd = {
		"@context": "https://schema.org",
		"@type": "Article",
		headline: story.title,
		datePublished: story.published_at?.toISOString(),
		author: { "@type": "Person", name: story.author_name ?? "Off the Hook" },
	};

	return (
		<>
			<Section spacing="sm">
				<Container width="narrow">
					<Eyebrow>Stories</Eyebrow>
					<h1 className="mt-3">{story.title}</h1>
					<p className="mt-4 text-[length:var(--fs-small)] text-text-muted">
						{story.author_name}
						{story.author_role ? `, ${story.author_role}` : ""} · {minutes}{" "}
						minute read
					</p>
				</Container>
			</Section>

			{STORY_COVERS[slug] && (
				<Section spacing="sm">
					<Container width="narrow">
						<ImageSlot
							label={story.title}
							src={STORY_COVERS[slug]}
							ratio="16/9"
							sizes="720px"
						/>
					</Container>
				</Section>
			)}

			<Section spacing="sm">
				<Container width="narrow">
					<Prose>
						<MDXRemote source={story.body_mdx} components={mdxComponents} />
					</Prose>
					{story.pull_quote && (
						<PullQuote
							quote={story.pull_quote}
							attribution={story.author_name ?? undefined}
						/>
					)}
				</Container>
			</Section>

			<Section spacing="sm" background="surface">
				<Container width="narrow">
					<div className="flex flex-wrap gap-3">
						{next && (
							<LinkButton href={`/stories/${next.slug}`} variant="secondary">
								Read another story
							</LinkButton>
						)}
						<LinkButton href="/support/donate">
							Support the next chapter
						</LinkButton>
					</div>
				</Container>
			</Section>

			<script
				type="application/ld+json"
				// biome-ignore lint/security/noDangerouslySetInnerHtml: static JSON-LD from server data
				dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
			/>
		</>
	);
}
