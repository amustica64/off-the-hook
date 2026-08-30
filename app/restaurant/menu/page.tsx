import type { Metadata } from "next";
import { LinkButton } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Lead } from "@/components/ui/typography";
import { formatPrice, getMenu, MENU_SECTIONS } from "@/lib/data/restaurant";

export const metadata: Metadata = {
	title: "The menu · Off the Hook",
	description:
		"This week's menu at Off the Hook: short, seasonal, cooked from scratch by the current cohort.",
};

export const revalidate = 300;

/*
  Doc 09 §3.5: two-col list, hairline rules, no dot leaders on the web,
  tabular right-aligned prices, dietary tags in olive (tag use only),
  allergen line in muted ink, sticky section mini-headers, print-friendly.
  Section chips are anchor links: no client state needed.
*/

function dietaryTags(item: { is_vegetarian: boolean; is_vegan: boolean }) {
	const tags = [];
	if (item.is_vegan) tags.push("VG");
	else if (item.is_vegetarian) tags.push("V");
	return tags;
}

export default async function MenuPage() {
	const menu = await getMenu();
	const sections = MENU_SECTIONS.map((s) => ({
		...s,
		items: menu.filter((m) => m.section === s.key),
	})).filter((s) => s.items.length > 0);

	return (
		<>
			<Section spacing="sm" className="print:hidden">
				<Container width="narrow">
					<h1>The menu.</h1>
					<Lead className="mt-4">
						Changes weekly. Cooked from scratch by the current cohort.
					</Lead>
					{sections.length > 1 && (
						<nav
							aria-label="Menu sections"
							className="mt-6 flex flex-wrap gap-2"
						>
							{sections.map((s) => (
								<a
									key={s.key}
									href={`#${s.key}`}
									className="rounded-full border border-divider px-4 py-2 text-[length:var(--fs-small)] text-text-secondary transition-colors duration-[var(--dur-fast)] hover:border-accent hover:text-accent"
								>
									{s.label}
								</a>
							))}
						</nav>
					)}
				</Container>
			</Section>

			<Section spacing="sm">
				<Container width="narrow">
					{sections.length === 0 && (
						<p className="text-text-muted">The next menu goes live shortly.</p>
					)}
					{sections.map((s) => (
						<section
							key={s.key}
							aria-labelledby={s.key}
							className="mb-12 last:mb-0"
						>
							<div className="sticky top-16 z-10 -mx-4 bg-bg px-4 py-3 print:static">
								<h2 id={s.key} className="text-[length:var(--fs-h3)]">
									{s.label}
								</h2>
							</div>
							<ul className="mt-2">
								{s.items.map((item) => (
									<li key={item.id} className="border-b border-divider py-4">
										<div className="flex items-baseline justify-between gap-6">
											<p className="font-medium text-text">
												{item.name}
												{dietaryTags(item).map((t) => (
													<span
														key={t}
														className="ml-2 text-[length:var(--fs-tiny)] font-medium text-olive-500"
													>
														{t}
													</span>
												))}
											</p>
											<p className="shrink-0 tabular-nums text-text-secondary">
												{formatPrice(item.price_pence)}
											</p>
										</div>
										{item.description && (
											<p className="mt-1 max-w-[52ch] text-[length:var(--fs-small)] text-text-secondary">
												{item.description}
											</p>
										)}
										{item.allergens.length > 0 && (
											<p className="mt-1 text-[length:var(--fs-tiny)] text-text-muted">
												Contains{" "}
												{item.allergens.join(", ").replaceAll("_", " ")}
											</p>
										)}
									</li>
								))}
							</ul>
						</section>
					))}
					<p className="mt-8 text-[length:var(--fs-small)] text-text-muted">
						Allergies or intolerances: tell us when you book or ask the team.
						Full allergen information is available for every dish.
					</p>
				</Container>
			</Section>

			<Section spacing="sm" background="surface" className="print:hidden">
				<Container width="narrow" className="text-center">
					<h3>Book a table.</h3>
					<div className="mt-5">
						<LinkButton href="/restaurant/book">Book a table</LinkButton>
					</div>
				</Container>
			</Section>
		</>
	);
}
