import Link from "next/link";
import { ImageSlot } from "./image-slot";

type Story = {
	slug: string;
	title: string;
	strapline: string | null;
	author_name: string | null;
	author_role: string | null;
	cover?: string;
};

/* StoryCard per Doc 09 §3.1: 4:5 image, name in Fraunces, 1px border, no shadow at rest. */
export function StoryCard({ story }: { story: Story }) {
	return (
		<Link
			href={`/stories/${story.slug}`}
			className="group block w-72 shrink-0 snap-start rounded-[var(--r-md)] border border-divider bg-surface transition-[border-color,box-shadow] duration-[var(--dur-fast)] hover:border-accent hover:shadow-[var(--shadow-md)] sm:w-80"
		>
			<ImageSlot
				label={`Portrait: ${story.author_name ?? "trainee"}`}
				src={story.cover}
				ratio="4/5"
				rounded={false}
				sizes="320px"
				className="rounded-t-[var(--r-md)] border-0 border-b"
			/>
			<div className="p-5">
				<h3 className="group-hover:underline group-hover:underline-offset-4">
					{story.title}
				</h3>
				{story.strapline && (
					<p className="mt-1.5 text-[length:var(--fs-small)] text-text-secondary">
						{story.strapline}
					</p>
				)}
				{story.author_name && (
					<p className="mt-3 text-[length:var(--fs-tiny)] text-text-muted">
						{story.author_name}
						{story.author_role ? `, ${story.author_role}` : ""}
					</p>
				)}
			</div>
		</Link>
	);
}

/* CSS scroll-snap carousel: three visible desktop, 1.1 mobile, keyboard reachable links. */
export function StoryCarousel({ stories }: { stories: Story[] }) {
	return (
		<ul
			aria-label="Stories"
			className="-mx-4 flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-4 md:mx-0 md:px-0 [scrollbar-width:thin]"
		>
			{stories.map((s) => (
				<li key={s.slug} className="flex">
					<StoryCard story={s} />
				</li>
			))}
		</ul>
	);
}
