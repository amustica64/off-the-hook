"use client";

/**
 * PageTransition and FooterKnot. Doc 17 build list item 6.
 *
 * "The line ties off, a small knot closing the page the way the intro
 * opened it."
 *
 * ── A note on what is actually possible here ──────────────────────────
 *
 * Doc 17 section 4 asks for AnimatePresence on the route with a 240ms cross
 * fade. A true cross fade needs the outgoing page to stay mounted while it
 * animates out. The Next.js App Router swaps the segment before that can
 * happen, so an AnimatePresence wrapper here compiles, renders, and never
 * plays its exit. It would look like it works and do nothing.
 *
 * This is enter-only: the incoming route fades up over 240ms, keyed on
 * pathname. Doc 5 S2 already takes the same position, deferring shared
 * element transitions because they fight streaming.
 *
 * If a real two-sided cross fade is wanted later, the options are the View
 * Transitions API behind a capability check, or freezing the router context
 * so the old tree survives one frame. Both are real work and neither is in
 * this slice. Flagged rather than faked.
 *
 * ── Constraints held ──────────────────────────────────────────────────
 *
 * Opacity only. No transform, no travel, so there is no layout shift and
 * no scroll jump, which is the item 6 done criterion.
 *
 * Header and footer are persistent because they live in the root layout,
 * outside this wrapper. This component wraps {children} only.
 *
 * QA register fixes applied: P1, P4, P5, P6, P7.
 */

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { type ReactNode, useEffect, useRef } from "react";
import { motionTokens } from "@/lib/motion";
import { LineDraw } from "./line-draw";
import { useMotionPreference } from "./use-motion-preference";

const { duration, ease } = motionTokens;

export function PageTransition({ children }: { children: ReactNode }) {
	const pathname = usePathname();
	const { isReduced } = useMotionPreference();

	/*
	  Register P7. The App Router does not move focus on navigation, so keyboard
	  and screen reader users stayed wherever they were after a route change.
	  Focus moves to the new page container, but never on first load, and never
	  with a scroll of its own.
	*/
	const containerRef = useRef<HTMLDivElement>(null);
	const isFirstRender = useRef(true);
	// pathname is not read in the body, it is the trigger. Removing it, which is
	// what the rule suggests, would mean focus never moves on navigation, which
	// is the entire point of the effect.
	// biome-ignore lint/correctness/useExhaustiveDependencies: pathname is the trigger, not a read value
	useEffect(() => {
		if (isFirstRender.current) {
			isFirstRender.current = false;
			return;
		}
		containerRef.current?.focus({ preventScroll: true });
	}, [pathname]);

	/*
	  Register P1. This used to early return bare children under reduced motion.
	  useReducedMotion returns false during SSR, because the server has no media
	  query, so the server always emitted the wrapper at opacity 0 including for
	  reduced motion users, which is precisely what the old comment claimed it
	  avoided. Worse, on hydration those users rendered bare children against a
	  server <div style="opacity:0">, a structural mismatch of the exact kind
	  IntroDraw was written to avoid.

	  The wrapper is now always present. Only the transition changes.
	*/
	return (
		<motion.div
			key={pathname}
			ref={containerRef}
			data-reveal
			tabIndex={-1}
			className="outline-none"
			initial={{ opacity: isReduced ? 1 : 0 }}
			animate={{ opacity: 1 }}
			transition={
				isReduced
					? { duration: 0 }
					: { duration: duration.transition, ease: ease.enter }
			}
		>
			{children}
		</motion.div>
	);
}

/* ------------------------------------------------------------------ */

/**
 * A line that runs in, loops once, and runs out. The closing gesture.
 *
 * PLACEHOLDER PATH. This should be derived from the brand mark once Logo
 * Direction B is commissioned, so the knot and the intro draw are visibly
 * the same line. Same open item as IntroDraw's markPath.
 */
const KNOT_D =
	"M 0 12 L 28 12 C 40 12 42 3 32 4 C 21 5 25 20 37 20 C 48 20 50 12 62 12 L 92 12";
const KNOT_VIEWBOX = "0 0 92 24";

/*
  Register P4. FooterKnot used to call useReducedMotion purely to pass
  drawn={isReduced}, which LineDraw already computes for itself as
  `drawn || isReduced`. The hook call and the prop are both gone.
*/
export function FooterKnot({ className }: { className?: string }) {
	return (
		<LineDraw
			d={KNOT_D}
			viewBox={KNOT_VIEWBOX}
			stroke="var(--cream-200)"
			strokeWidth={1.5}
			drawDuration={duration.reveal}
			className={className ?? "h-6 w-24"}
		/>
	);
}

/**
 * Usage in app/layout.tsx:
 *
 *   <body>
 *     <SkipLink />
 *     <Header />                    // persistent, outside the transition
 *     <main id="main">
 *       <PageTransition>{children}</PageTransition>
 *     </main>
 *     <Footer />                    // persistent, FooterKnot sits inside it
 *   </body>
 *
 * Register P6, recorded rather than fixed: key={pathname} remounts the subtree
 * on every navigation, discarding state in any client component under <main>.
 * That is necessary, because without a key change `initial` never re-runs and
 * there is no fade at all. It is not free, and it is worth knowing before a
 * stateful client component is placed under main.
 */
