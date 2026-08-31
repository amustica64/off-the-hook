import type { Metadata } from "next";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Callout, Prose } from "@/components/ui/typography";
import {
	getLegalDoc,
	headingId,
	LEGAL_DOCS,
	readLegalBody,
	tableOfContents,
} from "@/lib/content/legal";

/*
  One template, six routes (Doc 09 §3.23). Doc 04 §/legal/*: narrow prose, slim
  H1, last-updated under it, sticky contents rail on desktop only, breadcrumbs
  per Doc 03 §7, and no decoration, because a legal page that looks designed
  looks evasive.

  Grid note. Doc 04 asks for prose at `col-span-8 start-3` and the rail at
  `col-span-3 start-10`. Those cannot both hold in a 12 column grid: columns
  3 to 10 and 10 to 12 collide on column 10. The prose starts one column
  earlier instead, so the rail keeps the position the doc gives it and nothing
  overlaps. Flagged rather than silently redrawn.
*/

export const dynamicParams = false;

export function generateStaticParams() {
	return LEGAL_DOCS.map((doc) => ({ slug: doc.slug }));
}

type Params = Promise<{ slug: string }>;

export async function generateMetadata({
	params,
}: {
	params: Params;
}): Promise<Metadata> {
	const doc = getLegalDoc((await params).slug);
	if (!doc) return { title: "The small print · Off the Hook" };
	return {
		title: `${doc.title} · Off the Hook`,
		description: doc.summary,
		// An unpublished statement should not be the thing a search engine has
		// on file for us. It stays reachable by anyone who follows the footer.
		robots: doc.status === "draft" ? { index: false, follow: true } : undefined,
	};
}

/** MDX heading text is plain in these documents, but flatten defensively. */
function textOf(node: React.ReactNode): string {
	if (typeof node === "string") return node;
	if (typeof node === "number") return String(node);
	if (Array.isArray(node)) return node.map(textOf).join("");
	return "";
}

const mdxComponents = {
	// Anchor ids come from the same helper the contents rail uses, so a
	// renamed heading cannot leave the rail pointing at nothing.
	h2: ({ children }: { children?: React.ReactNode }) => (
		<h2 id={headingId(textOf(children))}>{children}</h2>
	),
	Callout,
};

const formatDate = (iso: string) =>
	new Intl.DateTimeFormat("en-GB", {
		day: "numeric",
		month: "long",
		year: "numeric",
	}).format(new Date(`${iso}T00:00:00Z`));

export default async function LegalPage({ params }: { params: Params }) {
	const { slug } = await params;
	const doc = getLegalDoc(slug);
	// dynamicParams is false, so an unknown slug is already a 404 before here.
	if (!doc) return null;

	const published = doc.status === "published";
	const body = published ? await readLegalBody(slug) : null;
	if (published && body === null) {
		throw new Error(
			`content/legal/${slug}.mdx is missing, but the registry marks it published.`,
		);
	}
	const toc = body ? tableOfContents(body) : [];

	return (
		<>
			<Section spacing="sm">
				<Container>
					<nav aria-label="Breadcrumb">
						<ol className="flex flex-wrap items-center gap-2 text-[length:var(--fs-small)] text-text-muted">
							<li>The small print</li>
							<li aria-hidden>&rsaquo;</li>
							<li aria-current="page" className="text-text">
								{doc.title}
							</li>
						</ol>
					</nav>
				</Container>
			</Section>

			<Section spacing="sm" className="pt-0">
				<Container>
					<div className="grid gap-10 lg:grid-cols-12">
						<div className="lg:col-span-8 lg:col-start-2">
							<h1>{doc.title}</h1>
							{doc.updated && (
								<p className="mt-3 text-[length:var(--fs-small)] text-text-muted">
									Last updated {formatDate(doc.updated)}
								</p>
							)}

							{body ? (
								<Prose className="mt-8">
									<MDXRemote source={body} components={mdxComponents} />
								</Prose>
							) : (
								<Prose className="mt-8">
									<Callout>
										<p>
											This statement is being written and is not published yet.
											We would rather leave it blank than put up something that
											has not been checked.
										</p>
										<p className="mt-3">
											If you need it now, ask through the{" "}
											<Link href="/contact">contact page</Link> and we will send
											you what we have.
										</p>
									</Callout>
									{doc.draftNote && <p className="mt-6">{doc.draftNote}</p>}
								</Prose>
							)}
						</div>

						{toc.length > 1 && (
							<nav
								aria-label="On this page"
								className="hidden lg:col-span-3 lg:col-start-10 lg:block"
							>
								<div className="sticky top-24">
									<p className="text-[length:var(--fs-tiny)] font-medium uppercase tracking-[0.08em] text-text-muted">
										On this page
									</p>
									<ul className="mt-3 space-y-2 text-[length:var(--fs-small)]">
										{toc.map((entry) => (
											<li key={entry.id}>
												<a
													href={`#${entry.id}`}
													className="text-text-secondary underline-offset-4 hover:text-accent hover:underline"
												>
													{entry.text}
												</a>
											</li>
										))}
									</ul>
								</div>
							</nav>
						)}
					</div>
				</Container>
			</Section>
		</>
	);
}
