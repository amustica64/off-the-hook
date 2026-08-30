"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useId, useRef, useState } from "react";
import { dur, easeEnter } from "@/lib/motion";
import { cn } from "@/lib/utils";

type Step = {
	order: number;
	title: string;
	subtitle: string | null;
	body: string;
	outcome_summary: string | null;
};

/*
  Full journey timeline per Doc 09 §3.8 and Doc 05 J1.
  Desktop: horizontal rail (drawn once on entry, 800ms), step nodes as tabs,
  detail panel below with a cross-fade on change. Keyboard: arrow keys move,
  Home/End jump. Mobile: vertical cards, every step visible.
  Numerals in Fraunces stand in until the seven commissioned icons land.
*/
export function JourneyTimeline({ steps }: { steps: Step[] }) {
	const [active, setActive] = useState(0);
	const reduced = useReducedMotion();
	const baseId = useId();
	const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

	if (steps.length === 0) return null;
	const step = steps[active];

	const onKeyDown = (e: React.KeyboardEvent) => {
		const last = steps.length - 1;
		let next: number | null = null;
		if (e.key === "ArrowRight" || e.key === "ArrowDown")
			next = active === last ? 0 : active + 1;
		if (e.key === "ArrowLeft" || e.key === "ArrowUp")
			next = active === 0 ? last : active - 1;
		if (e.key === "Home") next = 0;
		if (e.key === "End") next = last;
		if (next !== null) {
			e.preventDefault();
			setActive(next);
			tabRefs.current[next]?.focus();
		}
	};

	return (
		<div>
			{/* Desktop rail */}
			<div className="relative hidden md:block">
				<motion.div
					aria-hidden
					data-reveal
					className="absolute left-0 right-0 top-5 h-px origin-left bg-forest-600"
					initial={reduced ? { scaleX: 1 } : { scaleX: 0 }}
					whileInView={{ scaleX: 1 }}
					viewport={{ once: true }}
					transition={{ duration: reduced ? 0 : dur.slow, ease: easeEnter }}
				/>
				{/* biome-ignore lint/a11y/useSemanticElements: tablist composite per WAI-ARIA tabs pattern */}
				<div
					role="tablist"
					aria-label="The seven steps"
					className="relative grid grid-cols-7 gap-2"
				>
					{steps.map((s, i) => (
						<button
							key={s.order}
							ref={(el) => {
								tabRefs.current[i] = el;
							}}
							type="button"
							role="tab"
							id={`${baseId}-tab-${i}`}
							aria-selected={i === active}
							aria-controls={`${baseId}-panel`}
							tabIndex={i === active ? 0 : -1}
							onClick={() => setActive(i)}
							onKeyDown={onKeyDown}
							className="group flex flex-col items-start gap-2 pt-0 text-left"
						>
							<motion.span
								animate={{ scale: i === active ? 1.08 : 1 }}
								transition={{ duration: dur.fast, ease: easeEnter }}
								className={cn(
									"flex h-10 w-10 items-center justify-center rounded-full border bg-bg font-serif text-[length:var(--fs-h3)] font-medium tabular-nums transition-colors duration-[var(--dur-fast)]",
									i === active
										? "border-forest-600 text-accent"
										: "border-divider text-text-muted",
								)}
							>
								{s.order}
							</motion.span>
							<span
								className={cn(
									"text-[length:var(--fs-small)] font-medium transition-colors duration-[var(--dur-fast)]",
									i === active
										? "text-text"
										: "text-text-secondary group-hover:text-text",
								)}
							>
								{s.title}
							</span>
						</button>
					))}
				</div>

				<motion.div
					key={step.order}
					data-reveal
					id={`${baseId}-panel`}
					role="tabpanel"
					aria-labelledby={`${baseId}-tab-${active}`}
					initial={reduced ? { opacity: 0 } : { opacity: 0, y: 8 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{
						duration: reduced ? dur.instant : dur.fast,
						ease: easeEnter,
					}}
					className="mt-10 rounded-[var(--r-md)] border border-divider bg-surface p-8"
				>
					{step.subtitle && (
						<p className="text-[length:var(--fs-tiny)] font-medium uppercase tracking-[0.08em] text-accent">
							{step.subtitle}
						</p>
					)}
					<p className="mt-3 max-w-[var(--measure)] text-text-secondary">
						{step.body}
					</p>
					{step.outcome_summary && (
						<p className="mt-5 border-t border-divider pt-4 font-medium text-text">
							{step.outcome_summary}
						</p>
					)}
				</motion.div>
			</div>

			{/* Mobile: every step as a card, soft rise on entry */}
			<ol className="space-y-4 md:hidden">
				{steps.map((s, i) => (
					<motion.li
						key={s.order}
						data-reveal
						initial={reduced ? { opacity: 0 } : { opacity: 0, y: 12 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true, amount: 0.3 }}
						transition={{
							duration: reduced ? dur.instant : dur.med,
							delay: reduced ? 0 : i * 0.04,
							ease: easeEnter,
						}}
						className="rounded-[var(--r-md)] border border-divider bg-surface p-6"
					>
						<div className="flex items-baseline gap-3">
							<span className="font-serif text-[length:var(--fs-h2)] font-medium tabular-nums text-accent">
								{s.order}
							</span>
							<div>
								<h3>{s.title}</h3>
								{s.subtitle && (
									<p className="text-[length:var(--fs-small)] text-text-muted">
										{s.subtitle}
									</p>
								)}
							</div>
						</div>
						<p className="mt-3 text-[length:var(--fs-small)] text-text-secondary">
							{s.body}
						</p>
						{s.outcome_summary && (
							<p className="mt-4 border-t border-divider pt-3 text-[length:var(--fs-small)] font-medium text-text">
								{s.outcome_summary}
							</p>
						)}
					</motion.li>
				))}
			</ol>
		</div>
	);
}
