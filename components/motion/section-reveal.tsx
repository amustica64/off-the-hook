"use client";

/**
 * SectionReveal. Doc 17 section 4, build list item 3.
 *
 * "The line is the curtain, the content is the act."
 *
 * A hairline draws above the heading, then the heading and its one lead
 * element rise 12 to 0px with opacity over `reveal` (560ms), staggered 56ms.
 * Body copy never animates. Nothing here is ever more than two moving
 * children, because everything else earns its restraint so the hero and the
 * journey line can land.
 *
 * Reduced motion: no travel, opacity fade under 150ms, line shows drawn.
 *
 * QA register fixes applied: S1, S2, S3, S4, S5, X1, X2.
 */

import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";
import { motionTokens } from "@/lib/motion";
import { LineDraw } from "./line-draw";
import { useMotionPreference } from "./use-motion-preference";

const { duration, ease, stagger, travel, viewport } = motionTokens;

/** A plain horizontal hairline. viewBox coordinates so it survives zoom. */
const HAIRLINE_D = "M 0 1 L 100 1";
const HAIRLINE_VIEWBOX = "0 0 100 2";

/*
  Register S2. `as` used to land two levels in, so <SectionReveal as="header">
  emitted div > div > header. The tag now is the outer animated element.
*/
const TAGS = {
	div: motion.div,
	section: motion.section,
	header: motion.header,
} as const;

export function SectionReveal({
	children,
	/** Rendered above the heading as the curtain. Set false where the line rests. */
	line = true,
	className,
	as = "div",
}: {
	children: ReactNode;
	line?: boolean;
	className?: string;
	as?: keyof typeof TAGS;
}) {
	const { isReduced } = useMotionPreference();
	const Tag = TAGS[as];

	/*
	  Register S1. The line used to define its own `initial` object, which opted
	  it out of variant inheritance entirely. The hairline and the content were
	  two independent in-view triggers that happened to share amount 0.3, so
	  delayChildren sequenced nothing and the stated order held only by
	  coincidence. Now there is one trigger on the wrapper, the line is a real
	  variant child, and the content group carries the delay. The line genuinely
	  draws first.
	*/
	const lineVariants: Variants = {
		hidden: { pathLength: isReduced ? 1 : 0 },
		shown: {
			pathLength: 1,
			transition: isReduced
				? { duration: 0 }
				: { duration: duration.reveal, ease: ease.enter },
		},
	};

	const contentGroup: Variants = {
		hidden: {},
		shown: {
			transition: {
				delayChildren: isReduced ? 0 : duration.reveal * 0.35,
				staggerChildren: isReduced ? 0 : stagger,
			},
		},
	};

	return (
		<Tag
			initial="hidden"
			whileInView="shown"
			viewport={{ once: true, amount: viewport.standard }}
			className={className}
		>
			{line ? (
				<LineDraw
					d={HAIRLINE_D}
					viewBox={HAIRLINE_VIEWBOX}
					stroke="var(--accent)"
					strokeWidth={1}
					variants={lineVariants}
					// Register S5. A 50:1 viewBox in a 56:1 box letterboxed to 89% width.
					preserveAspectRatio="none"
					className="mb-6 h-[2px] w-full max-w-[7rem]"
				/>
			) : null}

			<motion.div variants={contentGroup}>{children}</motion.div>
		</Tag>
	);
}

/**
 * The moving children. Wrap the heading and its single lead element only.
 * Anything else inside a SectionReveal stays static by design.
 */
export function RevealItem({
	children,
	className,
}: {
	children: ReactNode;
	className?: string;
}) {
	const { isReduced, fade } = useMotionPreference();

	/* Register S4. travel.reveal replaces the local REVEAL_TRAVEL constant. */
	const variants: Variants = isReduced
		? {
				hidden: { opacity: 0 },
				shown: {
					opacity: 1,
					transition: { duration: fade, ease: ease.enter },
				},
			}
		: {
				hidden: { opacity: 0, y: travel.reveal },
				shown: {
					opacity: 1,
					y: 0,
					transition: { duration: duration.reveal, ease: ease.enter },
				},
			};

	/*
	  Register S3. The empty onAnimationStart handler is gone. Its comment
	  described managing willChange, which read as if something happened there.
	  Framer handles willChange on transform and opacity by itself.
	*/
	return (
		<motion.div data-reveal variants={variants} className={className}>
			{children}
		</motion.div>
	);
}

/**
 * Usage:
 *
 *   <SectionReveal as="header">
 *     <RevealItem>
 *       <Eyebrow>The restaurant</Eyebrow>
 *       <h2>A room that changes lives</h2>
 *     </RevealItem>
 *
 *     <RevealItem>
 *       <p className="mt-4 max-w-[var(--measure)]">
 *         One lead paragraph. This is the only other thing that moves.
 *       </p>
 *     </RevealItem>
 *   </SectionReveal>
 *
 *   <p>Body copy sits outside the wrapper and never animates.</p>
 */
