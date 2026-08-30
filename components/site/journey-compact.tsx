import Link from "next/link";

type Step = { order: number; title: string; subtitle: string | null };

/*
  Compact journey strip for the home page (Doc 09 §3.1 section 1).
  Static in Phase 5: the J1 rail draw and detail panels live on /journey in Phase 7.
  Numerals in Fraunces stand in until the seven commissioned icons exist.
*/
export function JourneyCompact({ steps }: { steps: Step[] }) {
	if (steps.length === 0) return null;
	return (
		<ol className="mt-10 grid gap-x-6 gap-y-8 border-t border-divider pt-8 grid-cols-2 sm:grid-cols-4 lg:grid-cols-7">
			{steps.map((s) => (
				<li key={s.order}>
					<Link href="/journey" className="group block">
						<span className="font-serif text-[length:var(--fs-h2)] font-medium tabular-nums text-accent">
							{s.order}
						</span>
						<span className="mt-1 block font-medium text-text group-hover:underline group-hover:underline-offset-4">
							{s.title}
						</span>
						{s.subtitle && (
							<span className="mt-0.5 block text-[length:var(--fs-small)] text-text-muted">
								{s.subtitle}
							</span>
						)}
					</Link>
				</li>
			))}
		</ol>
	);
}
