"use client";

/**
 * JourneyLine. Doc 17 section 4, build list item 4. The centrepiece.
 *
 * A single line drawn down the page, its pathLength bound to scroll progress
 * across the journey section. Each step arrives as the line reaches it.
 * This is where the interactivity budget goes, which is why everything else
 * on the site earns its restraint.
 *
 * Reduced motion: the line shows fully drawn, every step simply present.
 * The section is just as composed standing still.
 *
 * Semantics: an ordered list. The line is decorative and hidden from
 * assistive tech. Every step is in the DOM before anything moves.
 *
 * TWO FLAGGED DEVIATIONS from Doc 5, both resolved in favour of Doc 17
 * because it is the later spec written to be built from:
 *
 * 1. Orientation. Doc 5 J1 specifies a horizontal rail on desktop and
 *    vertical on mobile. Doc 17 specifies "a single motion.path down the
 *    page". Vertical at every breakpoint. It also avoids binding a
 *    horizontal draw to vertical scroll, which reads as scroll-jacking.
 *
 * 2. Node entry scale. Doc 5 J1 says nodes scale 0.7 to 1. Doc 17's
 *    anti-slop guardrail says never start below 0.96 and always pair with
 *    opacity. Using 0.96.
 *
 * NOTE: components/site/journey-timeline.tsx already implements Doc 5 J1 as a
 * WAI-ARIA tabs pattern with keyboard navigation, and is what /journey renders
 * today. This component is the Doc 17 replacement and is not yet wired to a
 * route. Swapping them is a content and accessibility decision, not a motion
 * one, because the tabs pattern carries interaction this list does not.
 *
 * QA register fixes applied: J1, J2, J4, J5, X1, X2, X4.
 */

import {
	type MotionValue,
	motion,
	useScroll,
	useTransform,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { motionTokens } from "@/lib/motion";
import { LineDraw } from "./line-draw";
import { useMotionPreference } from "./use-motion-preference";

const { travel } = motionTokens;

/* The band of section progress over which the line draws. */
const LINE_START = 0.15;
const LINE_END = 0.85;
/* How much scroll a single step takes to arrive. */
const STEP_BAND = 0.05;

export type JourneyStep = {
	/** Short label. Sentence case. */
	title: string;
	/** One or two sentences. Voice checked. */
	body: string;
	/**
	 * Path data for the custom step icon, drawn on a 24x24 grid at 1.5px
	 * stroke per Doc 8 section 8.2. Optional until the icons are commissioned.
	 */
	icon?: string;
};

/**
 * The seven steps, from Doc 8 section 8.2.
 *
 * PLACEHOLDER BODIES. The real copy for each step lives in Doc 9, the
 * /journey screen. Pull it from there before this ships. Titles and order
 * are correct; the bodies below pass the voice rules but are not signed off.
 */
export const journeySteps: JourneyStep[] = [
	{
		title: "Prison",
		body: "The first conversation happens inside, months before release. Nobody arrives here cold.",
	},
	{
		title: "Referral",
		body: "A probation officer, a prison education lead or a partner charity puts the name forward.",
	},
	{
		title: "Induction",
		body: "A week to learn the kitchen, meet the team and get an apron with a name on it.",
	},
	{
		title: "Training",
		body: "Knife work, sections, fire, service. Taught by chefs who learned it the same way.",
	},
	{
		title: "Service",
		body: "Real tickets, real customers, real pressure. Paid from the first shift.",
	},
	{
		title: "Qualification",
		body: "A City and Guilds certificate that means something to the next employer who reads it.",
	},
	{
		title: "Employment",
		body: "A job in a kitchen that wants them, with a reference from a kitchen that trained them.",
	},
];

export default function JourneyLine({
	steps = journeySteps,
}: {
	steps?: JourneyStep[];
}) {
	const sectionRef = useRef<HTMLDivElement>(null);
	const listRef = useRef<HTMLOListElement>(null);
	const { isReduced } = useMotionPreference();

	// The line starts drawing as the section arrives and finishes as it leaves.
	const { scrollYProgress } = useScroll({
		target: sectionRef,
		offset: ["start end", "end start"],
	});

	// Scroll linked motion is linear. Never eased.
	const pathLength = useTransform(
		scrollYProgress,
		[LINE_START, LINE_END],
		[0, 1],
	);

	/*
	  Register J2. The rail used to span top-0 to bottom-0 of the whole section
	  while the last item is last:pb-0, so roughly 100px of line continued past
	  the final node, pointing at nothing. Measuring to the last node's centre
	  ends the line where the journey ends. A ResizeObserver keeps it correct
	  through reflow, font loading and breakpoint changes.
	*/
	const [railHeight, setRailHeight] = useState<number | null>(null);
	useEffect(() => {
		const list = listRef.current;
		if (!list || typeof ResizeObserver === "undefined") return;

		const measure = () => {
			const nodes = list.querySelectorAll<HTMLElement>("[data-journey-node]");
			const last = nodes[nodes.length - 1];
			if (!last) return;
			const listTop = list.getBoundingClientRect().top;
			const rect = last.getBoundingClientRect();
			setRailHeight(rect.top + rect.height / 2 - listTop);
		};

		measure();
		const observer = new ResizeObserver(measure);
		observer.observe(list);
		return () => observer.disconnect();
	}, []);

	return (
		<div ref={sectionRef} className="relative">
			{/* The rail. Decorative, so hidden from assistive tech. The steps
			    below carry all the meaning. */}
			<div
				aria-hidden="true"
				className="pointer-events-none absolute left-[11px] top-0 w-[2px] md:left-[15px]"
				style={{ height: railHeight ?? "100%" }}
			>
				{/* Resting track, so the line has somewhere to be drawn onto. */}
				<div className="absolute inset-0 bg-divider" />

				{/*
				  Register X4. This used to reimplement the path inline, which left
				  LineDraw's `progress` prop with zero callers despite its own doc
				  comment naming the journey line as its user. One device, one
				  implementation.
				*/}
				<LineDraw
					d="M 1 0 L 1 100"
					viewBox="0 0 2 100"
					preserveAspectRatio="none"
					stroke="var(--accent)"
					strokeWidth={2}
					progress={pathLength}
					drawn={isReduced}
					className="absolute inset-0 h-full w-full"
				/>
			</div>

			<ol ref={listRef} className="relative m-0 list-none p-0">
				{steps.map((step, i) => (
					<Step
						key={step.title}
						step={step}
						index={i}
						total={steps.length}
						progress={scrollYProgress}
						isReduced={isReduced}
					/>
				))}
			</ol>
		</div>
	);
}

function Step({
	step,
	index,
	total,
	progress,
	isReduced,
}: {
	step: JourneyStep;
	index: number;
	total: number;
	progress: MotionValue<number>;
	isReduced: boolean;
}) {
	/*
	  Register J1. This is the fix the whole component exists for.

	  "Each step arrives as the line reaches it" was the stated behaviour and the
	  reason this section holds the interactivity budget. It was not implemented:
	  the line ran on section scroll progress while each step ran on its own
	  independent whileInView at amount 0.5. Two unrelated clocks that correlate
	  at exactly one section height to viewport height ratio and drift at every
	  other one.

	  Both now read the same motion value. The line head is at fraction
	  (p - LINE_START) / (LINE_END - LINE_START) down the rail, so step i is
	  reached at LINE_START + span * i / (total - 1). Node positions are treated
	  as evenly spaced, which is true to within the last item's missing bottom
	  padding.

	  Register J5 falls out of this: there is no viewport amount left to be
	  measured against a padded box.
	*/
	const span = LINE_END - LINE_START;
	const reachedAt =
		total > 1
			? LINE_START + (span * index) / (total - 1)
			: LINE_START + span / 2;

	const from = Math.max(0, reachedAt - STEP_BAND);
	const nodeOpacity = useTransform(progress, [from, reachedAt], [0, 1]);
	const nodeScale = useTransform(progress, [from, reachedAt], [0.96, 1]);

	/* Register J4. The copy trails the node by a stagger instead of starting
	   with it and finishing 360ms later. */
	const copyFrom = Math.max(
		0,
		reachedAt - STEP_BAND + motionTokens.stagger / 2,
	);
	const copyOpacity = useTransform(
		progress,
		[copyFrom, reachedAt + STEP_BAND / 2],
		[0, 1],
	);
	const copyY = useTransform(
		progress,
		[copyFrom, reachedAt + STEP_BAND / 2],
		[travel.min, 0],
	);

	const nodeStyle = isReduced
		? undefined
		: { opacity: nodeOpacity, scale: nodeScale };
	const copyStyle = isReduced ? undefined : { opacity: copyOpacity, y: copyY };

	return (
		<li className="relative flex gap-6 pb-14 last:pb-0 md:gap-8">
			{/* The node sits on the rail. */}
			<motion.div
				data-journey-node
				data-reveal
				style={nodeStyle}
				aria-hidden="true"
				className="relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-forest-600 bg-bg md:h-8 md:w-8"
			>
				{step.icon ? (
					<svg
						viewBox="0 0 24 24"
						className="h-4 w-4 md:h-5 md:w-5"
						role="presentation"
						aria-hidden="true"
						focusable="false"
					>
						<path
							d={step.icon}
							stroke="var(--accent)"
							strokeWidth={1.5}
							strokeLinecap="round"
							strokeLinejoin="round"
							fill="none"
						/>
					</svg>
				) : (
					<span className="h-2 w-2 rounded-full bg-accent" />
				)}
			</motion.div>

			<motion.div
				data-reveal
				style={copyStyle}
				className="max-w-[var(--measure)] pt-0.5"
			>
				<p className="font-sans text-[length:var(--fs-small)] uppercase tracking-[0.08em] text-accent">
					Step {index + 1}
				</p>
				<h3 className="mt-1 font-serif text-[length:var(--fs-h3)] font-medium tracking-[-0.01em] text-text">
					{step.title}
				</h3>
				<p className="mt-2 font-sans leading-relaxed text-text-secondary">
					{step.body}
				</p>
			</motion.div>
		</li>
	);
}
