import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";

type Column = { heading: string; line: string; cta: string; href: string };

/*
  Forest CTA band per Doc 09 taste pass item 3: text-led columns separated by
  cream hairlines at 24 percent, no boxes, no icons. Motion CT1 lands in Phase 7.
*/
export function CtaBand({
	heading,
	columns,
	footnote,
}: {
	heading: string;
	columns: Column[];
	footnote?: React.ReactNode;
}) {
	return (
		<Section background="forest" spacing="md">
			<Container>
				<h2 className="text-center text-cream-25">{heading}</h2>
				<div
					className={`mt-10 grid gap-8 md:divide-x md:divide-cream-25/25 ${columns.length === 3 ? "md:grid-cols-3" : columns.length === 2 ? "md:grid-cols-2" : ""}`}
				>
					{columns.map((c) => (
						<div key={c.href} className="md:px-8 md:first:pl-0 md:last:pr-0">
							<h3 className="text-cream-25">{c.heading}</h3>
							<p className="mt-2 text-cream-200">{c.line}</p>
							<Link
								href={c.href}
								className="mt-3 inline-block text-cream-25 underline underline-offset-4 transition-[text-underline-offset] duration-[var(--dur-fast)] hover:underline-offset-2"
							>
								{c.cta}
							</Link>
						</div>
					))}
				</div>
				{footnote && (
					<p className="mt-10 text-center text-cream-200">{footnote}</p>
				)}
			</Container>
		</Section>
	);
}
