"use client";

/**
 * Hero scroll engine. Doc 17 section 3, build list item 1.
 *
 * A fixed stage holds the chapters. A tall spacer gives the page its scroll
 * length. Scroll position, not a timer, sets everything. Nothing autoplays.
 *
 * Per chapter, two bands read from motionTokens.hero:
 *   hold       the image drifts by a scroll driven ken burns, copy fully in
 *   transition the outgoing image warps away, the incoming one wipes in
 *              behind a hairline of cream light
 *
 * Reduced motion: no blur, no scale, no clip. Chapters cross fade under 150ms
 * as they become active. The hero is just as composed standing still.
 *
 * Constraints held: transform, opacity, clip-path and filter only, never
 * layout properties. Buttons are real links in the DOM from first paint.
 * Scroll is native and never hijacked.
 *
 * QA register fixes applied: H1, H2, H3, H4, H5, H6, H7, H8, N2, N4, X1, X2.
 */

import {
	type MotionValue,
	motion,
	useMotionValueEvent,
	useScroll,
	useTransform,
} from "framer-motion";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { heroGeometry, motionTokens } from "@/lib/motion";
import { useCanWarp, useMotionPreference } from "./use-motion-preference";

const { hero, duration, ease, stagger, travel } = motionTokens;

export type HeroChapter = {
	/**
	 * Path under /public/heroes. Optional: with no frame the layer renders the
	 * Doc 09 §1.6 slot instead. Every pack image was retired on 31 August as
	 * off-register (Doc 20 open item 3), so this is the current state for all
	 * chapters until the two master anchors are signed off.
	 */
	image?: string;
	/** Describes the photograph for screen readers. Never decorative here. */
	alt: string;
	kicker: string;
	headline: string;
	lead: string;
	actions: { label: string; href: string }[];
};

/**
 * Copy locked and voice checked in Doc 17 section 3.
 * No dashes, sentence case, UK spelling.
 *
 * Image paths point at the real files in /public/heroes. The originals in the
 * spec were guessed .jpg names that never existed. Alt text is carried over
 * unchanged and should be checked against the actual photographs before this
 * ships, since the file names are only a strong hint at what each frame shows.
 */
export const heroChapters: HeroChapter[] = [
	{
		alt: "Plates going out under the pass in a working kitchen",
		kicker: "Restaurant and academy, London",
		headline: "Real work. Real qualifications. Real chances.",
		lead: "A working kitchen that trains people leaving prison, then pays them to do it well.",
		actions: [
			{ label: "Book a table", href: "/restaurant/book" },
			{ label: "See the menu", href: "/restaurant/menu" },
		],
	},
	{
		alt: "A plate of beef shin with mash and greens",
		kicker: "This week on the pass",
		headline: "Every plate carries a story.",
		lead: "Beef shin, mash, greens. Honest food, cooked to the standard our chefs learned in Michelin kitchens.",
		actions: [
			{ label: "See the menu", href: "/restaurant/menu" },
			{ label: "Our story", href: "/about" },
		],
	},
	{
		alt: "Hands working at a kitchen bench during service",
		kicker: "Inside the kitchen",
		headline: "Skill you can see.",
		lead: "Every trainee works a real service, on real tickets, to a real standard.",
		actions: [
			{ label: "The academy", href: "/journey" },
			{ label: "Our impact", href: "/impact" },
		],
	},
];

/*
  One frame per chapter, or the Doc 09 §1.6 slot when there is none. Doc 17 §7
  is explicit that swapping hero images "is a data change, not a motion change",
  so the engine below is untouched by the frames being absent.
*/
function ChapterFrame({
	chapter,
	isFirst,
}: {
	chapter: HeroChapter;
	isFirst: boolean;
}) {
	if (!chapter.image) {
		return (
			<div
				role="img"
				aria-label={`Photograph to come: ${chapter.alt}`}
				className="absolute inset-0 bg-surface"
			/>
		);
	}
	return (
		<Image
			src={chapter.image}
			alt={chapter.alt}
			fill
			priority={isFirst}
			sizes="100vw"
			className="object-cover"
		/>
	);
}

export default function Hero({
	chapters = heroChapters,
}: {
	chapters?: HeroChapter[];
}) {
	const sectionRef = useRef<HTMLElement>(null);
	const stageRef = useRef<HTMLDivElement>(null);
	const { isReduced, fade } = useMotionPreference();
	const canWarp = useCanWarp();
	const geo = heroGeometry(chapters.length);

	const { scrollYProgress } = useScroll({
		target: sectionRef,
		offset: ["start start", "end end"],
	});

	const [active, setActive] = useState(0);

	/*
	  Register H7. A chapter now takes over at the midpoint of the transition
	  into it, the same point the copy swaps, rather than at the very end. The
	  dots used to lag the visible chapter for the whole warp, because
	  holdStart(i + 1) and transEnd(i) are the same value.
	*/
	const switchPoint = (i: number) => {
		if (i === 0) return 0;
		const from = geo.holdEnd(i - 1);
		return from + (geo.holdStart(i) - from) * hero.copySwapAt;
	};

	useMotionValueEvent(scrollYProgress, "change", (p) => {
		let next = 0;
		for (let i = 0; i < chapters.length; i++) {
			if (p >= switchPoint(i) - 0.001) next = i;
		}
		if (next !== active) setActive(next);
	});

	/*
	  Register H1, H2 and N2 together, because they are one calculation.

	  H1: scrollYProgress over ["start start", "end end"] maps onto
	  offsetHeight minus the height of the sticky stage, not offsetHeight. The
	  old version multiplied by the full height and overshot every dot but the
	  first, by roughly 0.82 of a screen on chapter three.

	  H2: offsetTop is offset parent relative, so any positioned or transformed
	  ancestor broke it. getBoundingClientRect plus scrollY is absolute.

	  N2: the stage is sized in svh, which does not track Safari's collapsing
	  URL bar, while window.innerHeight does. Measuring the stage element
	  removes the disagreement entirely.
	*/
	const jumpTo = (i: number) => {
		const el = sectionRef.current;
		const stage = stageRef.current;
		if (!el || !stage) return;
		const docTop = el.getBoundingClientRect().top + window.scrollY;
		const range = Math.max(0, el.offsetHeight - stage.offsetHeight);
		window.scrollTo({
			top: docTop + range * geo.holdStart(i),
			behavior: isReduced ? "auto" : "smooth",
		});
	};

	return (
		<section
			ref={sectionRef}
			data-hero-section
			aria-label="Introduction"
			style={{ height: `${geo.totalVH}svh` }}
			className="relative"
		>
			{/* The fixed stage. Everything visual lives here. */}
			<div
				ref={stageRef}
				className="sticky top-0 h-[100svh] w-full overflow-hidden bg-night-950"
			>
				{chapters.map((chapter, i) => (
					<ChapterLayer
						// Register H8. The image path alone collided when two chapters reused a
						// photograph. Chapters are a fixed, ordered list that is never sorted or
						// filtered, so the index is a stable part of the identity here.
						// biome-ignore lint/suspicious/noArrayIndexKey: fixed ordered list, index is stable identity
						key={`${chapter.headline}-${i}`}
						chapter={chapter}
						index={i}
						total={chapters.length}
						progress={scrollYProgress}
						isActive={active === i}
						isReduced={isReduced}
						fade={fade}
						canWarp={canWarp}
					/>
				))}

				{/* Chapter dots. Real buttons, keyboard reachable, never decorative. */}
				<nav
					aria-label="Introduction chapters"
					className="absolute bottom-8 left-1/2 z-30 flex -translate-x-1/2 gap-3"
				>
					{chapters.map((chapter, i) => (
						<button
							// biome-ignore lint/suspicious/noArrayIndexKey: fixed ordered list, index is stable identity
							key={`${chapter.headline}-${i}`}
							type="button"
							onClick={() => jumpTo(i)}
							aria-current={active === i ? "true" : undefined}
							aria-label={`Chapter ${i + 1}: ${chapter.kicker}`}
							className="h-2.5 w-2.5 rounded-full border border-cream-200 transition-colors"
							style={{
								backgroundColor:
									active === i ? "var(--cream-50)" : "transparent",
								transitionDuration: `${duration.ui}s`,
							}}
						/>
					))}
				</nav>
			</div>
		</section>
	);
}

function ChapterLayer({
	chapter,
	index,
	total,
	progress,
	isActive,
	isReduced,
	fade,
	canWarp,
}: {
	chapter: HeroChapter;
	index: number;
	total: number;
	progress: MotionValue<number>;
	isActive: boolean;
	isReduced: boolean;
	fade: number;
	canWarp: boolean;
}) {
	const geo = heroGeometry(total);
	const isFirst = index === 0;
	const isLast = index === total - 1;

	const holdStart = geo.holdStart(index);
	const holdEnd = geo.holdEnd(index);
	const inStart = isFirst ? 0 : geo.holdEnd(index - 1);

	/*
	  Register H5. For the last chapter holdEnd and transEnd are both exactly 1,
	  which made every outgoing range zero width. framer's progress() guards that
	  case (motion-utils 12.39: `return range ? (value - from) / range : 1`), so
	  it never produced NaN, but relying on a library's divide by zero guard is
	  not a design. The last chapter now simply has no outgoing band.
	*/
	const transEnd = isLast ? 1 : geo.transEnd(index);
	const hasOutgoing = !isLast;

	const [kbFrom, kbTo] = hero.kenburns;

	/*
	  Register N4, reconciled against Doc 17 §3 and §7 on 31 August 2026.

	  Doc 17 §7 names "the cross dissolve fallback in the hero decision record"
	  as the mitigation for blur cost. That record, in §3, reads in full:
	  "Reversal trigger: if a mid tier Android cannot hold the blur at 60fps,
	  drop the blur and keep a scroll linked cross dissolve plus the line, which
	  is cheap."

	  What matches: blur to zero, cross dissolve, and now the line, which this
	  code used to drop.

	  Two things still diverge, both flagged for Abbey rather than quietly kept.

	  1. Doc 17 frames this as a REVERSAL TRIGGER, a decision taken once after
	     measuring a mid tier Android, not a per device runtime fork. §6 item 1
	     makes "holds 60fps with the blur on a mid tier Android" the done
	     criterion, and that measurement has never been taken. useCanWarp instead
	     forks automatically per device, which ships two experiences and device
	     tests neither. It is defensible engineering and it is not what the doc
	     specifies.
	  2. hero.dissolveScaleTo (1.03) is invented. Doc 17 §2's token set has no
	     such token, and the record says cross dissolve, which is opacity. The
	     scale is kept because it holds the shape of the gesture, but it is not
	     doc backed.

	  The 8 core threshold below remains a judgement call with no doc behind it.
	  Capability, never user agent.
	*/
	const outScale = canWarp ? hero.outScaleTo : hero.dissolveScaleTo;
	const inScale = canWarp ? hero.inScaleFrom : hero.dissolveScaleTo;

	const scale = useTransform(
		progress,
		isFirst
			? [holdStart, holdEnd, transEnd]
			: [inStart, holdStart, holdEnd, transEnd],
		isFirst
			? [kbFrom, kbTo, hasOutgoing ? outScale : kbTo]
			: [inScale, kbFrom, kbTo, hasOutgoing ? outScale : kbTo],
	);

	const blurMax = canWarp ? hero.blurMaxPx : 0;
	const blur = useTransform(
		progress,
		isFirst
			? [holdStart, holdEnd, transEnd]
			: [inStart, holdStart, holdEnd, transEnd],
		isFirst
			? [0, 0, hasOutgoing ? blurMax : 0]
			: [blurMax, 0, 0, hasOutgoing ? blurMax : 0],
	);
	const filter = useTransform(blur, (b) =>
		b < 0.01 ? "none" : `blur(${b.toFixed(2)}px)`,
	);

	/*
	  Outgoing fade. On the warp path the incoming reveal is done by the clip
	  wipe, so two images never dissolve into mud. Without the warp there is no
	  wipe, so the incoming layer fades in instead.
	*/
	const outOpacity = useTransform(
		progress,
		hasOutgoing ? [holdEnd, transEnd] : [0, 1],
		hasOutgoing ? [1, 0] : [1, 1],
	);
	const inOpacity = useTransform(
		progress,
		isFirst ? [0, 1] : [inStart, holdStart],
		isFirst ? [1, 1] : [0, 1],
	);
	const dissolveOpacity = useTransform(
		[inOpacity, outOpacity] as MotionValue<number>[],
		([i, o]: number[]) => Math.min(i, o),
	);

	// The wipe. clip-path only, never layout. First chapter is never clipped.
	const clipPath = useTransform(
		progress,
		[inStart, holdStart],
		["inset(0 100% 0 0)", "inset(0 0% 0 0)"],
	);

	// The hairline of cream light riding the wipe edge. Brand device.
	const lineLeft = useTransform(progress, [inStart, holdStart], ["0%", "100%"]);
	const lineOpacity = useTransform(
		progress,
		[inStart, inStart + 0.01, holdStart - 0.01, holdStart],
		[0, 1, 1, 0],
	);

	// Copy swaps at the midpoint of the transition so two headlines are never
	// on screen together.
	const copyIn = isFirst
		? holdStart
		: inStart + (holdStart - inStart) * hero.copySwapAt;
	const copyOut = hasOutgoing
		? holdEnd + (transEnd - holdEnd) * hero.copySwapAt
		: 1;
	const copyOpacity = useTransform(
		progress,
		[
			copyIn - 0.001,
			copyIn + hero.copyFade / 100,
			copyOut - hero.copyFade / 100,
			copyOut,
		],
		isFirst ? [1, 1, 1, hasOutgoing ? 0 : 1] : [0, 1, 1, hasOutgoing ? 0 : 1],
	);

	/**
	 * willChange goes on only while this chapter is actually moving, and comes
	 * off after. Never left on. Doc 5 section 12.
	 */
	const [moving, setMoving] = useState(false);
	useMotionValueEvent(progress, "change", (p) => {
		const inTransition =
			(p > inStart && p < holdStart) ||
			(hasOutgoing && p > holdEnd && p < transEnd);
		if (inTransition !== moving) setMoving(inTransition);
	});

	/*
	  Register H6. Reduced motion is no longer a scroll linked ramp across 0.001
	  of progress, which was a 4px cut whose apparent speed was set by scroll
	  velocity. It is now a real timed cross fade on `fade`, driven by which
	  chapter is active. Under 150ms, and the same length however fast you
	  scroll.
	*/
	if (isReduced) {
		return (
			<motion.div
				className="absolute inset-0"
				data-hero-layer
				data-hero-index={index}
				animate={{ opacity: isActive ? 1 : 0 }}
				transition={{ duration: fade, ease: ease.enter }}
				aria-hidden={!isActive}
				inert={!isActive}
			>
				<ChapterFrame chapter={chapter} isFirst={isFirst} />
				<ChapterCopy chapter={chapter} isActive={isActive} isReduced />
			</motion.div>
		);
	}

	return (
		<motion.div
			className="absolute inset-0"
			data-hero-layer
			data-hero-index={index}
			style={
				canWarp
					? {
							opacity: outOpacity,
							clipPath: isFirst ? undefined : clipPath,
							willChange: moving ? "transform, filter, clip-path" : "auto",
						}
					: {
							opacity: dissolveOpacity,
							willChange: moving ? "transform, opacity" : "auto",
						}
			}
			/*
			  Register H4. aria-hidden used to be `undefined`, a no-op, so the page
			  shipped three h1 elements and six links, four of them tabbable while
			  invisible. inert removes the non-active layers from the tab order too.
			*/
			aria-hidden={!isActive}
			inert={!isActive}
		>
			<motion.div className="absolute inset-0" style={{ scale, filter }}>
				<ChapterFrame chapter={chapter} isFirst={isFirst} />
			</motion.div>

			{/*
			  The hairline. It rides the wipe edge when there is a wipe, and keeps
			  travelling as a scroll linked sweep when there is not.

			  Reconciled against Doc 17 §3 on 31 August 2026. It used to be gated on
			  canWarp, so the fallback dropped it. The decision record is explicit
			  that the fallback keeps it: "drop the blur and keep a scroll linked
			  cross dissolve plus the line, which is cheap." Doc 14 makes the line
			  the single brand device across the whole site, so dropping it on the
			  cheap path dropped the one thing that must not go.
			*/}
			{!isFirst ? (
				<motion.div
					aria-hidden="true"
					className="absolute inset-y-0 z-20 w-[2px] bg-cream-50"
					style={{
						left: lineLeft,
						opacity: lineOpacity,
						boxShadow: "0 0 24px 4px var(--forest-500)",
					}}
				/>
			) : null}

			<motion.div
				className="absolute inset-0 z-10"
				style={{ opacity: copyOpacity }}
			>
				<ChapterCopy chapter={chapter} isActive={isActive} isReduced={false} />
			</motion.div>
		</motion.div>
	);
}

function ChapterCopy({
	chapter,
	isActive,
	isReduced,
}: {
	chapter: HeroChapter;
	isActive: boolean;
	isReduced: boolean;
}) {
	return (
		<div className="flex h-full w-full items-end">
			<div className="w-full px-6 pb-24 md:px-12 md:pb-28">
				<div className="max-w-[var(--measure)] bg-[color-mix(in_srgb,var(--night-950)_60%,transparent)] p-6 md:p-8">
					<p className="font-sans text-[length:var(--fs-small)] uppercase tracking-[0.08em] text-cream-200">
						{chapter.kicker}
					</p>

					<Headline
						text={chapter.headline}
						play={isActive}
						isReduced={isReduced}
					/>

					<p className="mt-4 font-sans text-[length:var(--fs-lead)] leading-relaxed text-cream-100">
						{chapter.lead}
					</p>

					<div className="mt-6 flex flex-wrap gap-3">
						{chapter.actions.map((action, i) => (
							<a
								key={action.href}
								href={action.href}
								className="inline-flex items-center px-5 py-3 font-sans text-base font-medium transition-colors"
								style={{
									transitionDuration: `${duration.ui}s`,
									backgroundColor:
										i === 0 ? "var(--accent-fill)" : "transparent",
									color: "var(--cream-50)",
									border: i === 0 ? "none" : "1px solid var(--cream-200)",
								}}
							>
								{action.label}
							</a>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}

/**
 * Headline words rise on the enter ease, 56ms apart. Body never animates.
 * The text is in the DOM before anything moves, so it is readable and
 * selectable even if the animation never runs.
 *
 * Register H3. This used to use whileInView with once: true. Every layer sits
 * inside the sticky stage from first paint, so all three headlines animated at
 * once while two of them were clipped, and once: true meant they never replayed
 * when their chapter actually arrived. It now plays when the chapter becomes
 * active, which is the value Hero was already computing and discarding.
 */
function Headline({
	text,
	play,
	isReduced,
}: {
	text: string;
	play: boolean;
	isReduced: boolean;
}) {
	const [hasPlayed, setHasPlayed] = useState(false);
	useEffect(() => {
		if (play) setHasPlayed(true);
	}, [play]);

	const shown = play || hasPlayed;

	const className =
		"mt-3 font-serif text-[length:var(--fs-display)] font-medium leading-[1.05] tracking-[-0.01em] text-cream-50";

	if (isReduced) {
		return <h1 className={className}>{text}</h1>;
	}

	return (
		<h1 className={className}>
			{text.split(" ").map((word, i) => (
				<motion.span
					// biome-ignore lint/suspicious/noArrayIndexKey: words are positional
					key={`${word}-${i}`}
					data-reveal
					className="inline-block"
					initial={{ opacity: 0, y: travel.max }}
					animate={shown ? { opacity: 1, y: 0 } : { opacity: 0, y: travel.max }}
					transition={{
						duration: duration.reveal,
						ease: ease.enter,
						delay: shown ? i * stagger : 0,
					}}
				>
					{word}
					{" "}
				</motion.span>
			))}
		</h1>
	);
}
