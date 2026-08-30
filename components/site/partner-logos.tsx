type Partner = { name: string; category: string; website_url: string | null };

const CATEGORY_LABEL: Record<string, string> = {
	funder: "Funders",
	referral: "Referral partners",
	employer: "Employers",
	supporter: "Supporters",
};

/*
  Partner logo strip (Doc 09 §3.11). Hides entirely below three partners, the
  same no-fake-trust discipline as the home hero. Logos render as monochrome
  wordmarks until real logo assets are uploaded (Doc 06 media pipeline, Phase 8).
*/
export function PartnerLogos({ partners }: { partners: Partner[] }) {
	if (partners.length < 3) return null;

	const groups = Object.entries(CATEGORY_LABEL)
		.map(([key, label]) => ({
			label,
			items: partners.filter((p) => p.category === key),
		}))
		.filter((g) => g.items.length > 0);

	return (
		<div className="space-y-8">
			{groups.map((g) => (
				<div key={g.label}>
					<p className="text-[length:var(--fs-tiny)] font-medium uppercase tracking-[0.08em] text-text-muted">
						{g.label}
					</p>
					<ul className="mt-3 flex flex-wrap gap-x-8 gap-y-3">
						{g.items.map((p) => (
							<li key={p.name}>
								{p.website_url ? (
									<a
										href={p.website_url}
										rel="noopener noreferrer"
										target="_blank"
										className="font-serif text-[length:var(--fs-h3)] text-text-secondary transition-colors duration-[var(--dur-fast)] hover:text-text"
									>
										{p.name}
									</a>
								) : (
									<span className="font-serif text-[length:var(--fs-h3)] text-text-secondary">
										{p.name}
									</span>
								)}
							</li>
						))}
					</ul>
				</div>
			))}
		</div>
	);
}
