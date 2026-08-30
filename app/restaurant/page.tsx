import type { Metadata } from "next";
import Image from "next/image";
import { Reveal } from "@/components/motion/reveal";
import { CtaBand } from "@/components/site/cta-band";
import { ImageSlot } from "@/components/site/image-slot";
import { LinkButton, TextLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Lead } from "@/components/ui/typography";
import { formatPrice, getMenu } from "@/lib/data/restaurant";

export const metadata: Metadata = {
	title: "The restaurant · Off the Hook",
	description:
		"A working London kitchen with a story on every plate. Short weekly menu, honest cooking, book a table.",
};

export const revalidate = 300;

/* Doc 09 §3.4. Ken-burns (R1) lands in Phase 7. Location section hidden until the address is set (Doc 04). */

const atmosphere = [
	{ src: "/heroes/portrait-chef.webp", caption: "The kitchen, before doors" },
	{ src: "/heroes/plate-beef-shin.webp", caption: "The pass" },
	{
		src: "/heroes/dining-room-morning.webp",
		caption: "The dining room, first light",
	},
];

export default async function RestaurantPage() {
	const menu = await getMenu();
	const small = menu.filter((m) => m.section === "small").slice(0, 2);
	const large = menu.filter((m) => m.section === "large").slice(0, 2);
	const teaser = [...small, ...large];

	return (
		<>
			{/* Full-bleed hero, square corners, text on a solid ink panel (no gradients). */}
			<section className="relative aspect-[4/5] w-full md:aspect-[16/9] md:max-h-[70dvh]">
				<Image
					src="/heroes/room-mid-service.webp"
					alt="The dining room mid-service, warm light, staff between tables"
					fill
					priority
					sizes="100vw"
					className="object-cover"
				/>
				<div className="absolute inset-x-0 bottom-0 p-4 md:p-8">
					<Reveal>
						<div className="max-w-xl bg-ink-900/65 p-6 text-cream-25 md:p-8">
							<h1 className="text-cream-25">Off the Hook, the restaurant.</h1>
							<Lead className="mt-3 text-cream-100">
								A working kitchen with a story on every plate.
							</Lead>
							<div className="mt-6 flex flex-wrap gap-3">
								<LinkButton href="/restaurant/book">Book a table</LinkButton>
								<LinkButton
									href="/restaurant/menu"
									variant="secondary"
									className="border-cream-25 text-cream-25 hover:bg-cream-25/10"
								>
									See the menu
								</LinkButton>
							</div>
						</div>
					</Reveal>
				</div>
			</section>

			{/* Atmosphere strip: three 4:5 images, one-line captions. */}
			<Section spacing="md">
				<Container>
					<div className="grid gap-6 md:grid-cols-3">
						{atmosphere.map((a, i) => (
							<Reveal key={a.src} delay={i * 0.08}>
								<ImageSlot
									label={a.caption}
									src={a.src}
									ratio="4/5"
									sizes="(max-width: 768px) 100vw, 33vw"
								/>
								<p className="mt-2 text-[length:var(--fs-small)] text-text-muted">
									{a.caption}
								</p>
							</Reveal>
						))}
					</div>
				</Container>
			</Section>

			{/* Menu teaser: philosophy left, four live items right, hairline rules, tabular prices. */}
			<Section spacing="md" background="surface">
				<Container>
					<div className="grid gap-10 lg:grid-cols-12">
						<div className="lg:col-span-5">
							<Reveal>
								<h2>This week's menu.</h2>
							</Reveal>
							<p className="mt-4 text-text-secondary">
								Short, seasonal, honest. The menu changes weekly with the market
								and the cohort's training. Everything is cooked from scratch in
								one kitchen.
							</p>
							<div className="mt-6">
								<LinkButton href="/restaurant/menu" variant="secondary">
									See the full menu
								</LinkButton>
							</div>
						</div>
						<div className="lg:col-span-6 lg:col-start-7">
							{teaser.length > 0 ? (
								<ul>
									{teaser.map((item) => (
										<li
											key={item.id}
											className="border-b border-divider py-4 first:pt-0"
										>
											<div className="flex items-baseline justify-between gap-6">
												<p className="font-medium text-text">{item.name}</p>
												<p className="tabular-nums text-text-secondary">
													{formatPrice(item.price_pence)}
												</p>
											</div>
											{item.description && (
												<p className="mt-1 text-[length:var(--fs-small)] text-text-muted">
													{item.description}
												</p>
											)}
										</li>
									))}
								</ul>
							) : (
								<p className="text-text-muted">
									The next menu goes live shortly.
								</p>
							)}
						</div>
					</div>
				</Container>
			</Section>

			{/* Location and hours render once the venue address is set (Doc 04 empty-state rule). */}

			{/* Private events teaser. */}
			<Section spacing="md">
				<Container>
					<div className="grid items-center gap-10 lg:grid-cols-12">
						<div className="lg:col-span-6">
							<Reveal>
								<ImageSlot
									label="A long table laid for a private dinner"
									src="/heroes/bread-and-menu.webp"
									ratio="4/3"
									sizes="(max-width: 1024px) 100vw, 50vw"
								/>
							</Reveal>
						</div>
						<div className="lg:col-span-5 lg:col-start-8">
							<h2>Private events.</h2>
							<p className="mt-4 text-text-secondary">
								Book the whole room for a supper club, a launch, or a team
								night. Every event pays for training.
							</p>
							<div className="mt-6">
								<LinkButton href="/restaurant/events" variant="secondary">
									Host an event
								</LinkButton>
							</div>
						</div>
					</div>
				</Container>
			</Section>

			<CtaBand
				heading="The food stands on its own."
				columns={[
					{
						heading: "Book a table",
						line: "Lunch and dinner, Tuesday to Sunday. We reply within one working day.",
						cta: "Book now",
						href: "/restaurant/book",
					},
				]}
				footnote={
					<>
						Prefer to see the kitchen at work first?{" "}
						<TextLink href="/journey" className="text-cream-25">
							See how the academy runs
						</TextLink>
						.
					</>
				}
			/>
		</>
	);
}
