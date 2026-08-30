"use client";

/**
 * LineDraw and IntroDraw. Doc 17 section 4, build list item 2.
 *
 * One pathLength based primitive reused by every line moment on the site:
 * the intro draw, the section reveal hairline, the journey line, the impact
 * underline, the footer knot. One device, three jobs. It reveals, it
 * connects, it measures.
 *
 * Never animates layout. pathLength only.
 * Reduced motion always shows the line finished, never drawing.
 *
 * QA register fixes applied: L1, L2, L3, L4, L5, S5, X1b.
 */

import {
	type MotionValue,
	motion,
	useMotionValue,
	useTransform,
	type Variants,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { motionTokens } from "@/lib/motion";
import { useMotionPreference } from "./use-motion-preference";

const { duration, ease } = motionTokens;

type LineDrawProps = {
	/** SVG path data. Use viewBox coordinates, never fixed pixels, so it survives zoom. */
	d: string;
	viewBox: string;
	/** Stroke colour token. Defaults to the forest accent. */
	stroke?: string;
	strokeWidth?: number;
	/** Seconds. Defaults to the reveal duration. The intro uses `signature`. */
	drawDuration?: number;
	delay?: number;
	/**
	 * Drive pathLength from a scroll progress value instead of from view.
	 * When present, `whileInView` is not used and the draw is linear, because
	 * scroll linked motion is never eased.
	 */
	progress?: MotionValue<number>;
	/**
	 * Drive the draw from a parent variant tree instead of this component's own
	 * in-view trigger. Register S1: without this the line opts itself out of
	 * variant inheritance and the parent's delayChildren sequences nothing.
	 */
	variants?: Variants;
	/** Skip the animation entirely and render finished. */
	drawn?: boolean;
	className?: string;
	/** Set for a meaningful line. Left unset the line is decorative and hidden. */
	title?: string;
	/** Register S5. Pass "none" to stretch a rule flush to its container. */
	preserveAspectRatio?: string;
};

export function LineDraw({
	d,
	viewBox,
	stroke = "var(--accent)",
	strokeWidth = 1.5,
	drawDuration = duration.reveal,
	delay = 0,
	progress,
	variants,
	drawn = false,
	className,
	title,
	preserveAspectRatio,
}: LineDrawProps) {
	const { isReduced } = useMotionPreference();
	const finished = drawn || isReduced;

	/*
	  Register L5. The previous version cast a hand written object literal to a
	  MotionValue so the hook count stayed stable when no scroll progress was
	  passed. It satisfied what useCombineMotionValues happens to call today, but
	  it carried no getVelocity, and framer's own isMotionValue is exactly
	  `Boolean(value && value.getVelocity)`, so every framer code path that asks
	  would have said "not a motion value". A real motion value costs one hook.
	*/
	const idle = useMotionValue(0);
	const scrollPathLength = useTransform(progress ?? idle, [0, 1], [0, 1]);

	const shared = {
		d,
		stroke,
		strokeWidth,
		fill: "none" as const,
		strokeLinecap: "round" as const,
		strokeLinejoin: "round" as const,
		vectorEffect: "non-scaling-stroke" as const,
	};

	return (
		// A line with a `title` is meaningful and gets role="img" plus that title.
		// A line without one is decorative and is hidden from assistive tech
		// outright, which is the correct treatment and what the rule wants.
		// biome-ignore lint/a11y/noSvgWithoutTitle: decorative branch sets role=presentation and aria-hidden
		<svg
			viewBox={viewBox}
			preserveAspectRatio={preserveAspectRatio}
			className={className}
			role={title ? "img" : "presentation"}
			aria-hidden={title ? undefined : "true"}
			focusable="false"
		>
			{title ? <title>{title}</title> : null}

			{finished ? (
				<path {...shared} pathLength={1} />
			) : progress ? (
				<motion.path
					{...shared}
					data-reveal
					style={{ pathLength: scrollPathLength }}
				/>
			) : variants ? (
				<motion.path {...shared} data-reveal variants={variants} />
			) : (
				<motion.path
					{...shared}
					data-reveal
					initial={{ pathLength: 0 }}
					whileInView={{ pathLength: 1 }}
					viewport={{ once: true, amount: motionTokens.viewport.standard }}
					transition={{ duration: drawDuration, ease: ease.enter, delay }}
				/>
			)}
		</svg>
	);
}

/* ------------------------------------------------------------------ */

const INTRO_KEY = "oth:intro-drawn";

/**
 * IntroDraw. The one set piece per session.
 *
 * The mark draws over `signature` (1.0s), the wordmark rises underneath.
 * Guarded by sessionStorage so it plays once and never again on route change.
 * Reduced motion shows it finished.
 *
 * Renders nothing at all once the session guard is set, so it costs no layout
 * and no paint on subsequent navigations.
 */
export function IntroDraw({
	markPath,
	viewBox,
	wordmark = "Off the Hook",
	onDone,
}: {
	markPath: string;
	viewBox: string;
	wordmark?: string;
	onDone?: () => void;
}) {
	const { isReduced, fade } = useMotionPreference();
	const [shouldPlay, setShouldPlay] = useState(false);
	const [gone, setGone] = useState(false);

	/*
	  Register L2. onDone used to sit in the dependency array, so a parent passing
	  an inline callback re-ran the effect on every render, and the re-run found
	  the session key already set and unmounted the overlay mid play. A ref keeps
	  the latest callback without making it a dependency.
	*/
	const doneRef = useRef(onDone);
	useEffect(() => {
		doneRef.current = onDone;
	});

	useEffect(() => {
		let seen = false;
		try {
			seen = window.sessionStorage.getItem(INTRO_KEY) === "1";
		} catch {
			// Private mode or storage disabled. Treat as seen so we never trap
			// someone in a repeating intro.
			seen = true;
		}

		if (seen) {
			setGone(true);
			doneRef.current?.();
			return;
		}

		setShouldPlay(true);

		/*
		  Register L1. The session key used to be written here, before the
		  animation ran. StrictMode double invokes effects, so the second pass read
		  "1" and cut straight to gone, which meant the one set piece on the site
		  was invisible in every development session. Writing the key on completion
		  instead makes the second pass identical to the first: it simply restarts
		  the timer the cleanup just cleared.

		  Register L4. The reduced hold is now measured against the reduced fade
		  rather than a delayed one, so the overlay no longer unmounts 62% of the
		  way through its own fade. The full motion hold carries a 120ms margin
		  over the 1400ms fade instead of landing on exactly the same frame.
		*/
		const hold = isReduced
			? fade * 1000 + 60
			: (duration.signature + 0.4) * 1000 + 120;

		const timer = setTimeout(() => {
			try {
				window.sessionStorage.setItem(INTRO_KEY, "1");
			} catch {
				/* no-op */
			}
			setGone(true);
			doneRef.current?.();
		}, hold);

		return () => clearTimeout(timer);
	}, [isReduced, fade]);

	if (gone || !shouldPlay) return null;

	return (
		<motion.div
			/*
			  Register L3. pointer-events-none throughout. The overlay used to swallow
			  every click for 1.4 seconds while its own comment claimed nothing was
			  gated on it finishing. It is decorative and aria-hidden, so nothing here
			  needs to receive a pointer.
			*/
			className="pointer-events-none fixed inset-0 z-50 flex flex-col items-center justify-center bg-bg"
			initial={{ opacity: 1 }}
			animate={{ opacity: 0 }}
			transition={{
				duration: isReduced ? fade : duration.transition,
				delay: isReduced ? 0 : duration.signature + 0.16,
				ease: ease.exit,
			}}
			aria-hidden="true"
		>
			<LineDraw
				d={markPath}
				viewBox={viewBox}
				stroke="var(--accent)"
				strokeWidth={2}
				drawDuration={duration.signature}
				drawn={isReduced}
				className="h-24 w-24"
			/>

			<motion.p
				className="mt-4 font-serif text-2xl font-medium tracking-[-0.01em] text-text"
				initial={
					isReduced
						? { opacity: 0 }
						: { opacity: 0, y: motionTokens.travel.min }
				}
				animate={{ opacity: 1, y: 0 }}
				transition={{
					duration: isReduced ? fade : duration.reveal,
					delay: isReduced ? 0 : duration.signature * 0.55,
					ease: ease.enter,
				}}
			>
				{wordmark}
			</motion.p>
		</motion.div>
	);
}
