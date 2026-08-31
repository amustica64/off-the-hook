"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { LinkButton } from "@/components/ui/button";
import { dur, easeEnter, lift, stagger } from "@/lib/motion";
import { primaryNav } from "./nav-data";

/*
  Right sheet nav per Doc 05 C4: slide from right over dur-med on ease-enter,
  backdrop fade over dur-fast, items 40ms stagger fade + 8px lift.
  Reduced motion: sheet and items appear without slide or stagger.
  Focus is trapped while open and returns to the trigger on close (Doc 03 §16).
*/

const flatNav = [
	...primaryNav.flatMap((i) =>
		i.children ? [{ label: i.label, href: i.href }, ...i.children] : [i],
	),
	{ label: "Support us", href: "/support" },
];

export function MobileMenu({
	open,
	onClose,
}: {
	open: boolean;
	onClose: () => void;
}) {
	const reduced = useReducedMotion();
	const sheetRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!open) return;
		const sheet = sheetRef.current;
		sheet?.querySelector<HTMLElement>("button, a")?.focus();

		const onKey = (e: KeyboardEvent) => {
			if (e.key === "Escape") return onClose();
			if (e.key !== "Tab" || !sheet) return;
			const focusables = sheet.querySelectorAll<HTMLElement>("button, a");
			const first = focusables[0];
			const last = focusables[focusables.length - 1];
			if (e.shiftKey && document.activeElement === first) {
				e.preventDefault();
				last.focus();
			} else if (!e.shiftKey && document.activeElement === last) {
				e.preventDefault();
				first.focus();
			}
		};
		document.addEventListener("keydown", onKey);
		return () => document.removeEventListener("keydown", onKey);
	}, [open, onClose]);

	return (
		<AnimatePresence>
			{open && (
				<>
					<motion.button
						type="button"
						aria-label="Close menu"
						onClick={onClose}
						className="fixed inset-0 z-40 bg-ink-900/40"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: dur.fast }}
					/>
					<motion.div
						ref={sheetRef}
						role="dialog"
						aria-modal="true"
						aria-label="Menu"
						className="fixed inset-y-0 right-0 z-50 flex w-full max-w-sm flex-col bg-bg shadow-[var(--shadow-lg)]"
						initial={reduced ? { opacity: 0 } : { x: "100%" }}
						animate={reduced ? { opacity: 1 } : { x: 0 }}
						exit={reduced ? { opacity: 0 } : { x: "100%" }}
						transition={{
							duration: reduced ? dur.instant : dur.med,
							ease: easeEnter,
						}}
					>
						<div className="flex h-16 items-center justify-end px-4">
							<button
								type="button"
								aria-label="Close menu"
								onClick={onClose}
								className="inline-flex h-11 w-11 items-center justify-center rounded-[var(--r-sm)] text-text"
							>
								<X size={22} aria-hidden />
							</button>
						</div>
						<nav
							aria-label="Mobile"
							className="flex-1 overflow-y-auto px-6 py-4"
						>
							<ul className="space-y-1">
								{flatNav.map((item, i) => (
									<motion.li
										key={item.href + item.label}
										initial={
											reduced ? { opacity: 0 } : { opacity: 0, y: lift.sm }
										}
										animate={{ opacity: 1, y: 0 }}
										transition={{
											duration: reduced ? dur.instant : dur.med,
											delay: reduced ? 0 : i * stagger.tight,
											ease: easeEnter,
										}}
									>
										<Link
											href={item.href}
											onClick={onClose}
											className="block rounded-[var(--r-sm)] px-3 py-3 font-serif text-[length:var(--fs-h3)] text-text transition-colors duration-[var(--dur-fast)] hover:bg-surface"
										>
											{item.label}
										</Link>
									</motion.li>
								))}
							</ul>
						</nav>
						<div className="border-t border-divider p-6">
							<LinkButton
								href="/restaurant/book"
								className="w-full"
								onClick={onClose}
							>
								Book a table
							</LinkButton>
						</div>
					</motion.div>
				</>
			)}
		</AnimatePresence>
	);
}
