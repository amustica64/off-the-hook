"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { dur, easeEnter, motionTokens } from "@/lib/motion";
import { useMotionPreference } from "./use-motion-preference";

/*
  Scroll reveal per Doc 05 §3.2: single fade and 12px rise, dur-med, ease-enter,
  fires once at 20% visibility. Reduced motion: opacity-only, near-instant.
  `delay` staggers siblings (H1 hero sequence uses 80ms steps).

  QA register fixes applied. This component is live on every route, so these are
  the ones that bite today rather than after wiring.

  X1: data-reveal, so the noscript override in app/layout.tsx can put back the
  opacity that framer serialises into the SSR markup. Without it a page that
  never hydrates keeps every revealed section invisible.

  X2 and N3: reduced motion comes from the shared hook. The reduced duration
  moves from dur.instant (0.1) to the reduced.fade token (0.14). Both sit under
  the 150ms that Doc 05 section 11 asks for; the point is that there is now one
  place to change it.

  S4 and T4: the 12px rise was written as lift.sm + 4. It is travel.reveal now.
*/
export function Reveal({
	children,
	delay = 0,
	className,
}: {
	children: ReactNode;
	delay?: number;
	className?: string;
}) {
	const { isReduced, fade } = useMotionPreference();
	return (
		<motion.div
			data-reveal
			className={className}
			initial={
				isReduced
					? { opacity: 0 }
					: { opacity: 0, y: motionTokens.travel.reveal }
			}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true, amount: motionTokens.viewport.subtle }}
			transition={{
				duration: isReduced ? fade : dur.med,
				delay: isReduced ? 0 : delay,
				ease: easeEnter,
			}}
		>
			{children}
		</motion.div>
	);
}
