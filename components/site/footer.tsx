import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Input } from "@/components/ui/field";
import { Logo } from "./logo";

/* Footer per Doc 03 §3 and Doc 04 global chrome. Four columns, newsletter row, slim strip. */

const columns = [
	{
		heading: "Off the Hook",
		links: [
			["About us", "/about"],
			["The team", "/about/team"],
			["News and updates", "/news"],
			["Contact", "/contact"],
		],
	},
	{
		heading: "Eat with us",
		links: [
			["The restaurant", "/restaurant"],
			["Menu", "/restaurant/menu"],
			["Private events", "/restaurant/events"],
			["Book a table", "/restaurant/book"],
		],
	},
	{
		heading: "Get involved",
		links: [
			["Refer someone", "/partners/referrals"],
			["Fund the work", "/partners/funders"],
			["Hire a graduate", "/partners/employers"],
			["Volunteer", "/support/volunteer"],
			["Donate", "/support/donate"],
		],
	},
	{
		heading: "The small print",
		links: [
			["Privacy", "/legal/privacy"],
			["Cookies", "/legal/cookies"],
			["Safeguarding", "/legal/safeguarding"],
			["Accessibility", "/legal/accessibility"],
			["CIC declaration", "/legal/cic-declaration"],
			["Modern slavery statement", "/legal/modern-slavery"],
		],
	},
] as const;

/* Lucide removed brand icons in v1; these two are drawn on the same 24px grid, 1.5px stroke. */
function InstagramIcon() {
	return (
		// biome-ignore lint/a11y/noSvgWithoutTitle: decorative icon, aria-hidden; a title would announce it to assistive tech
		<svg
			width="20"
			height="20"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.5"
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden
		>
			<rect width="18" height="18" x="3" y="3" rx="5" />
			<circle cx="12" cy="12" r="4" />
			<circle cx="17.2" cy="6.8" r="0.5" fill="currentColor" />
		</svg>
	);
}

function LinkedinIcon() {
	return (
		// biome-ignore lint/a11y/noSvgWithoutTitle: decorative icon, aria-hidden; a title would announce it to assistive tech
		<svg
			width="20"
			height="20"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.5"
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden
		>
			<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4V8h4v1.5" />
			<rect width="4" height="12" x="2" y="9" />
			<circle cx="4" cy="4" r="2" />
		</svg>
	);
}

export function Footer() {
	return (
		<footer className="border-t border-divider bg-surface">
			<Container className="py-12 md:py-16">
				<div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
					{columns.map((col) => (
						<nav key={col.heading} aria-label={col.heading}>
							<h2 className="font-sans text-[length:var(--fs-small)] font-medium tracking-[0.02em] text-text-secondary">
								{col.heading}
							</h2>
							<ul className="mt-4 space-y-2.5">
								{col.links.map(([label, href]) => (
									<li key={href}>
										<Link
											href={href}
											className="text-[length:var(--fs-small)] text-text-secondary transition-colors duration-[var(--dur-fast)] hover:text-accent hover:underline hover:underline-offset-4"
										>
											{label}
										</Link>
									</li>
								))}
							</ul>
						</nav>
					))}
				</div>

				<div className="mt-12 border-t border-divider pt-8">
					{/* Newsletter capture UI. The RPC and double opt-in land in Phase 6. */}
					<form
						className="flex max-w-md flex-col gap-3 sm:flex-row"
						aria-label="Newsletter sign-up"
					>
						<label htmlFor="footer-email" className="sr-only">
							Email address
						</label>
						<Input
							id="footer-email"
							name="email"
							type="email"
							placeholder="you@example.com"
							required
						/>
						<Button type="submit" className="shrink-0">
							Sign up
						</Button>
					</form>
					<p className="mt-2 text-[length:var(--fs-small)] text-text-muted">
						One email a month on the kitchen, the academy, and the numbers. No
						noise.
					</p>
				</div>

				<div className="mt-10 flex flex-col gap-4 border-t border-divider pt-6 sm:flex-row sm:items-center sm:justify-between">
					<Logo />
					<p className="text-[length:var(--fs-tiny)] text-text-muted">
						CIC no. pending · Registered office to follow · ©{" "}
						{new Date().getFullYear()} Off the Hook CIC
					</p>
					<div className="flex gap-2">
						<a
							href="https://instagram.com"
							aria-label="Off the Hook on Instagram"
							className="inline-flex h-11 w-11 items-center justify-center rounded-[var(--r-sm)] text-text-secondary transition-colors duration-[var(--dur-fast)] hover:bg-bg"
						>
							<InstagramIcon />
						</a>
						<a
							href="https://linkedin.com"
							aria-label="Off the Hook on LinkedIn"
							className="inline-flex h-11 w-11 items-center justify-center rounded-[var(--r-sm)] text-text-secondary transition-colors duration-[var(--dur-fast)] hover:bg-bg"
						>
							<LinkedinIcon />
						</a>
					</div>
				</div>
			</Container>
		</footer>
	);
}
