"use client";

import { cn } from "@/lib/utils";

/* Skip link: first tab stop on every page (Doc 03 §16). Visible only on focus. */
export function SkipLink() {
	return (
		<a
			href="#main"
			className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-[var(--r-sm)] focus:bg-accent focus:px-4 focus:py-2 focus:text-cream-50"
		>
			Skip to main content
		</a>
	);
}

/* Polite live region for announcing state changes non-visually (Doc 05 §13). */
export function Announce({ message }: { message: string }) {
	return (
		<div aria-live="polite" role="status" className="sr-only">
			{message}
		</div>
	);
}

/* Static soft placeholder. Admin-only per Doc 05 C5; pulse is barely perceptible, none under reduced motion. */
export function Skeleton({ className }: { className?: string }) {
	return (
		<div
			aria-hidden
			className={cn("skeleton rounded-[var(--r-sm)] bg-surface", className)}
		/>
	);
}
