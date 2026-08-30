import { Search } from "lucide-react";
import type { Metadata } from "next";
import {
	Button,
	IconButton,
	LinkButton,
	TextLink,
} from "@/components/ui/button";
import { Card, MetricTile, StatCard } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import {
	Checkbox,
	Field,
	FormError,
	GdprConsent,
	Input,
	RadioGroup,
	Select,
	Textarea,
} from "@/components/ui/field";
import { Section } from "@/components/ui/section";
import {
	Callout,
	Display,
	Eyebrow,
	Lead,
	Prose,
	PullQuote,
} from "@/components/ui/typography";
import { Skeleton } from "@/components/ui/utility";

export const metadata: Metadata = {
	title: "Design system · Off the Hook",
	robots: { index: false },
};

const palette = [
	["ink-900", "#1F1912"],
	["ink-700", "#3D2F22"],
	["ink-500", "#6B5A45"],
	["cream-25", "#F7F1DF"],
	["cream-50", "#FAF5E9"],
	["cream-100", "#F3EBD8"],
	["cream-200", "#E7DBBF"],
	["cream-350", "#CFC0A0"],
	["forest-100", "#DDE7D6"],
	["forest-500", "#5B7C56"],
	["forest-600", "#3E5E3A"],
	["forest-700", "#2E4A2C"],
	["olive-500", "#7A8A4A"],
	["copper-500", "#9C6A3E"],
	["night-950", "#161210"],
	["night-900", "#221B14"],
	["night-800", "#2E241B"],
	["status-danger", "#A63A2E"],
	["status-warning", "#B4832A"],
	["status-success", "#3A6B4C"],
	["status-info", "#3A5A6B"],
] as const;

function Demo({
	title,
	children,
}: {
	title: string;
	children: React.ReactNode;
}) {
	return (
		<div className="space-y-4 border-t border-divider pt-8">
			<h3>{title}</h3>
			{children}
		</div>
	);
}

export default function DesignPage() {
	return (
		<>
			<Section spacing="sm">
				<Container>
					<Eyebrow>Internal</Eyebrow>
					<Display as="h1" className="mt-2">
						The living style guide
					</Display>
					<Lead className="mt-4">
						Every token and primitive in the system, in both themes. If a
						surface on the site cannot be built from this page, the system is
						missing something.
					</Lead>
				</Container>
			</Section>

			<Section spacing="sm">
				<Container className="space-y-12">
					<Demo title="Colour tokens">
						<div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-7">
							{palette.map(([name, hex]) => (
								<div key={name} className="space-y-1.5">
									<div
										className="h-14 rounded-[var(--r-sm)] border border-divider"
										style={{ background: hex }}
									/>
									<p className="text-[length:var(--fs-tiny)] text-text-secondary">
										{name}
									</p>
									<p className="text-[length:var(--fs-tiny)] text-text-muted">
										{hex}
									</p>
								</div>
							))}
						</div>
					</Demo>

					<Demo title="Type scale">
						<div className="space-y-5">
							<p className="display">Real chances.</p>
							<h1>Page title in Fraunces</h1>
							<h2>Section title in Fraunces</h2>
							<h3>Card title in Fraunces</h3>
							<Lead>
								A lead paragraph in Inter. Three lines at most, sixty-eight
								characters of measure.
							</Lead>
							<p>
								Body copy in Inter at the body clamp. Short sentence. Then a
								longer, considered one that shows the line height breathing at
								one point six.
							</p>
							<Eyebrow>The restaurant</Eyebrow>
						</div>
					</Demo>

					<Demo title="Buttons">
						<div className="flex flex-wrap items-center gap-4">
							<Button>Book a table</Button>
							<Button variant="secondary">See the impact</Button>
							<Button variant="ghost">All stories</Button>
							<Button variant="destructive">Delete story</Button>
							<Button loading>Sending</Button>
							<Button disabled>Unavailable</Button>
							<LinkButton href="/design" variant="secondary" size="sm">
								Small link button
							</LinkButton>
							<IconButton icon={Search} label="Search stories" />
							<TextLink href="/design">Inline text link</TextLink>
						</div>
					</Demo>

					<Demo title="Forms">
						<div className="grid max-w-3xl gap-6 md:grid-cols-2">
							<Field label="Name" name="demo-name">
								<Input placeholder="Anne Kiragu" />
							</Field>
							<Field
								label="Email"
								name="demo-email"
								error="This email address does not look right. Check the spelling and try again."
							>
								<Input type="email" defaultValue="anne@invalid" />
							</Field>
							<Field
								label="Party size"
								name="demo-party"
								hint="For nine or more, add a note."
							>
								<Select defaultValue="2">
									{[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
										<option key={n} value={n}>
											{n}
										</option>
									))}
								</Select>
							</Field>
							<Field label="Notes" name="demo-notes" optional>
								<Textarea placeholder="Anything we should know" />
							</Field>
							<RadioGroup
								legend="Referral status"
								name="demo-referral"
								defaultValue="referred"
								options={[
									{ value: "referred", label: "I have been referred" },
									{ value: "self", label: "I am referring myself" },
									{ value: "unsure", label: "Not sure yet" },
								]}
							/>
							<div className="space-y-4">
								<Checkbox name="demo-check" label="Send me the newsletter" />
								<GdprConsent name="demo-gdpr" />
							</div>
						</div>
						<div className="max-w-3xl">
							<FormError>
								Something went wrong at our end. Your details are still in the
								form, try again.
							</FormError>
						</div>
					</Demo>

					<Demo title="Cards and metrics">
						<div className="grid gap-6 md:grid-cols-3">
							<Card>
								<h3>Plain card</h3>
								<p className="mt-2 text-text-secondary">
									Cream surface, hairline border, soft shadow.
								</p>
							</Card>
							<Card interactive>
								<h3>Interactive card</h3>
								<p className="mt-2 text-text-secondary">
									Border steps to forest on hover, shadow to md.
								</p>
							</Card>
							<StatCard
								value="68%"
								label="of trainees into work within 6 months"
								source="Internal tracking, June 2026"
							/>
						</div>
						<div className="grid gap-6 md:grid-cols-3">
							<MetricTile
								value="42"
								label="people through the programme"
								source="Programme records"
								updated="July 2026"
							/>
							<MetricTile
								value="61"
								label="qualifications awarded"
								source="City & Guilds registry"
								updated="July 2026"
							/>
							<MetricTile
								value="12,400"
								label="meals served"
								updated="July 2026"
							/>
						</div>
					</Demo>

					<Demo title="Quotes and callouts">
						<PullQuote
							quote="I never had a job I was proud of. Now I make bread every morning and someone eats it. That's it. That's the difference."
							attribution="Danny, trainee, 2026"
						/>
						<div className="grid max-w-3xl gap-4 md:grid-cols-2">
							<Callout>
								A note callout on the surface wash, for quiet asides.
							</Callout>
							<Callout tone="important">
								An important callout on the forest wash, for safeguarding
								contacts.
							</Callout>
						</div>
					</Demo>

					<Demo title="Prose">
						<Prose>
							<h2>How the programme works</h2>
							<p>
								Referrals come from probation and prison education. We meet
								people in the last month of their sentence. Induction starts the
								week after release.
							</p>
							<p>
								Training happens in a working kitchen, in service, with paying
								diners. That is the point. Read the{" "}
								<a href="/design">full journey</a>.
							</p>
						</Prose>
					</Demo>

					<Demo title="Loading">
						<div className="max-w-sm space-y-3">
							<Skeleton className="h-5 w-3/4" />
							<Skeleton className="h-5 w-full" />
							<Skeleton className="h-5 w-1/2" />
						</div>
					</Demo>

					<Demo title="Forest section">
						<Section
							background="forest"
							spacing="sm"
							className="rounded-[var(--r-lg)]"
						>
							<Container>
								<h2 className="text-cream-25">
									Fund it. Refer to it. Hire from it.
								</h2>
								<div className="mt-8 grid gap-8 md:grid-cols-3 md:divide-x md:divide-cream-25/25">
									{[
										[
											"Fund the work",
											"Grants, sponsorship, multi-year partnerships.",
											"Talk to us",
										],
										[
											"Refer someone",
											"Probation, prison education, third sector.",
											"See how",
										],
										[
											"Hire a graduate",
											"Qualified, work-ready, supported.",
											"Partner with us",
										],
									].map(([h, line, cta]) => (
										<div key={h} className="md:px-8 md:first:pl-0">
											<h3 className="text-cream-25">{h}</h3>
											<p className="mt-2 text-cream-200">{line}</p>
											<a
												href="/design"
												className="mt-3 inline-block text-cream-25 underline underline-offset-4"
											>
												{cta}
											</a>
										</div>
									))}
								</div>
							</Container>
						</Section>
					</Demo>
				</Container>
			</Section>
		</>
	);
}
