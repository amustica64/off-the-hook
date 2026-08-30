/* Motion tokens mirrored for Framer Motion, per Doc 07 §8. Do not duplicate values in components.

   Two sets live here on purpose.

   The Doc 07 set (dur, easeEnter, easeExit, lift, stagger) is consumed by the
   components built in phases 2 to 6: reveal.tsx, count-up.tsx and
   journey-timeline.tsx. It is unchanged.

   The Doc 17 set (motionTokens, heroGeometry) drives the phase 7 motion pass.
   It is purely additive, so no existing route changes behaviour.

   Doc 05 and Doc 17 disagree on the enter curve. Doc 05 section 1 gives
   cubic-bezier(0.2, 0.7, 0.2, 1); Doc 17 section 2 gives [0.16, 1, 0.3, 1].
   Doc 17 wins as the later build spec, so motionTokens.ease.enter carries the
   new curve while easeEnter keeps the old one for components already shipped
   against it. Migrating those is a separate, visually checked change.
*/

/* ------------------------------------------------------------------ */
/* Doc 07 §8. In use by phases 2 to 6. Values unchanged.               */
/* ------------------------------------------------------------------ */

export const dur = {
	instant: 0.1,
	fast: 0.2,
	med: 0.4,
	slow: 0.8,
} as const;

export const easeEnter = [0.2, 0.7, 0.2, 1] as const;
export const easeExit = [0.4, 0, 0.2, 1] as const;

export const lift = { sm: 8, lg: 16 } as const;

export const stagger = { tight: 0.04, med: 0.08, slow: 0.12 } as const;

/* ------------------------------------------------------------------ */
/* Doc 17 §2. The phase 7 motion system.                               */
/* ------------------------------------------------------------------ */

export const motionTokens = {
	duration: {
		// seconds, for Framer Motion
		micro: 0.16, // hover, tap, small state
		ui: 0.2, // buttons, toggles
		transition: 0.24, // page and route cross fade
		reveal: 0.56, // section headings and hero copy
		signature: 1.0, // the intro logo draw, the one set piece per view
	},
	ease: {
		enter: [0.16, 1, 0.3, 1], // circ-out, confident settle, for anything appearing
		exit: [0.4, 0, 1, 1], // ease-in, for anything leaving
		standard: [0.4, 0, 0.2, 1], // position changes where both ends matter
		// scroll linked motion is LINEAR only, driven by scroll position, never eased
	},
	// px. travel.reveal added per register S4 and T4, replacing SectionReveal's
	// local REVEAL_TRAVEL constant.
	travel: { min: 8, reveal: 12, max: 16 },
	stagger: 0.056, // 56ms between staggered children
	// whileInView and useInView amount. Was four loose literals across five
	// files (register N11). Values are the ones already in use, so tokenising
	// them changes no behaviour.
	viewport: { subtle: 0.2, standard: 0.3, tall: 0.5, most: 0.6 },
	hero: {
		holdVH: 90, // see the note on heroGeometry for what this is a proportion of
		transVH: 115,
		blurMaxPx: 14, // peak warp blur at mid transition
		outScaleTo: 1.14, // outgoing image scales up as it blurs away
		inScaleFrom: 1.12, // incoming image settles down from this
		kenburns: [1.02, 1.07] as [number, number], // moving hold drift across a chapter
		copySwapAt: 0.5, // outgoing and incoming copy swap at this transition progress
		copyFade: 0.22, // 220ms fade on the copy swap
		// Register N4. Where a large blur is too expensive, the warp degrades to a
		// scale and cross dissolve. Same shape of gesture, a fraction of the cost.
		dissolveScaleTo: 1.03,
	},
	reduced: {
		// reduced motion collapses everything to a short fade
		fade: 0.14, // under 150ms, per Doc 05 section 11
	},
} as const;

export type MotionTokens = typeof motionTokens;

/**
 * Hero scroll geometry.
 *
 * The stage is fixed. A tall spacer behind it gives the page its scroll
 * length. Scroll position, never a timer, sets the state.
 *
 * For C chapters the timeline is:
 *   hold(0) trans(0>1) hold(1) trans(1>2) ... hold(C-1)
 *
 * Everything below returns normalised 0..1 progress values so components can
 * feed them straight into useTransform.
 *
 * The vh figures are timeline proportions, not screens of scroll. A section of
 * totalVH is scrolled through over (totalVH - 100) vh, because the sticky stage
 * occupies the last screen. For three chapters that is a 500vh timeline across
 * 400vh of travel, so holdVH 90 reads as 72vh of real scrolling. Proportions
 * are preserved, which is all the transforms care about. Register T5.
 */
export function heroGeometry(chapterCount: number) {
	const { holdVH, transVH } = motionTokens.hero;
	const cycle = holdVH + transVH;
	const totalVH = chapterCount * holdVH + (chapterCount - 1) * transVH;

	const at = (vh: number) => vh / totalVH;

	return {
		totalVH,
		/** Normalised progress where chapter i begins holding. */
		holdStart: (i: number) => at(i * cycle),
		/** Normalised progress where chapter i stops holding. */
		holdEnd: (i: number) => at(i * cycle + holdVH),
		/** Normalised progress where the transition out of chapter i completes. */
		transEnd: (i: number) => at(i * cycle + holdVH + transVH),
	};
}
