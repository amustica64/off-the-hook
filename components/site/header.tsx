"use client";

import { Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { LinkButton } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { cn } from "@/lib/utils";
import { Logo } from "./logo";
import { MobileMenu } from "./mobile-menu";
import { primaryNav } from "./nav-data";

const SCROLL_THRESHOLD = 120; // px, per Doc 05 H2
const HOVER_DELAY = 150; // ms, per Doc 05 §7

export function Header() {
	const [scrolled, setScrolled] = useState(false);
	const [menuOpen, setMenuOpen] = useState(false);
	const [dropdownOpen, setDropdownOpen] = useState(false);
	const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
	const pathname = usePathname();

	useEffect(() => {
		const onScroll = () => setScrolled(window.scrollY > SCROLL_THRESHOLD);
		onScroll();
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	}, []);

	// Close the dropdown on route change and on Escape (Doc 03 §16).
	useEffect(() => setDropdownOpen(false), [pathname]);
	useEffect(() => {
		if (!dropdownOpen) return;
		const onKey = (e: KeyboardEvent) =>
			e.key === "Escape" && setDropdownOpen(false);
		document.addEventListener("keydown", onKey);
		return () => document.removeEventListener("keydown", onKey);
	}, [dropdownOpen]);

	const openWithDelay = () => {
		hoverTimer.current = setTimeout(() => setDropdownOpen(true), HOVER_DELAY);
	};
	const cancelHover = () => {
		if (hoverTimer.current) clearTimeout(hoverTimer.current);
	};

	const isActive = (href: string) =>
		href === "/" ? pathname === "/" : pathname.startsWith(href);

	return (
		<header
			className={cn(
				"sticky top-0 z-40 transition-[height,background-color] duration-[var(--dur-fast)]",
				scrolled
					? "h-16 border-b border-divider bg-bg"
					: "h-16 bg-transparent md:h-[88px]",
			)}
		>
			<div className="mx-auto flex h-full w-full max-w-[var(--content-max)] items-center gap-6 px-4 md:px-6">
				<Logo
					className={cn(
						"origin-left transition-transform duration-[var(--dur-fast)]",
						scrolled && "md:scale-90",
					)}
				/>

				<nav aria-label="Primary" className="ml-auto hidden lg:block">
					<ul className="flex items-center gap-6">
						{primaryNav.map((item) =>
							item.children ? (
								<li
									key={item.href}
									className="relative"
									onMouseEnter={openWithDelay}
									onMouseLeave={() => {
										cancelHover();
										setDropdownOpen(false);
									}}
								>
									<button
										type="button"
										aria-expanded={dropdownOpen}
										aria-haspopup="true"
										onClick={() => setDropdownOpen((v) => !v)}
										className={cn(
											"relative py-2 text-[length:var(--fs-body)] text-text transition-colors duration-[var(--dur-fast)]",
											isActive(item.href) &&
												"after:absolute after:inset-x-0 after:-bottom-0.5 after:h-0.5 after:bg-accent",
										)}
									>
										{item.label}
									</button>
									{dropdownOpen && (
										<ul className="absolute left-0 top-full w-72 rounded-[var(--r-md)] border border-divider bg-bg-elev p-2 shadow-[var(--shadow-md)]">
											{item.children.map((c) => (
												<li key={c.href}>
													<Link
														href={c.href}
														className="block rounded-[var(--r-sm)] px-3 py-2.5 transition-colors duration-[var(--dur-fast)] hover:bg-surface"
													>
														<span className="block text-text">{c.label}</span>
														<span className="block text-[length:var(--fs-small)] text-text-muted">
															{c.note}
														</span>
													</Link>
												</li>
											))}
										</ul>
									)}
								</li>
							) : (
								<li key={item.href}>
									<Link
										href={item.href}
										aria-current={isActive(item.href) ? "page" : undefined}
										className={cn(
											"relative py-2 text-[length:var(--fs-body)] text-text",
											isActive(item.href) &&
												"after:absolute after:inset-x-0 after:-bottom-0.5 after:h-0.5 after:bg-accent",
										)}
									>
										{item.label}
									</Link>
								</li>
							),
						)}
					</ul>
				</nav>

				<div className="ml-auto flex items-center gap-3 lg:ml-0">
					<LinkButton
						href="/restaurant/book"
						variant="secondary"
						size="sm"
						className="hidden md:inline-flex"
					>
						Book a table
					</LinkButton>
					<LinkButton
						href="/support"
						size="sm"
						className="hidden lg:inline-flex"
					>
						Support us
					</LinkButton>
					<ThemeToggle inline />
					<button
						type="button"
						aria-label="Open menu"
						aria-expanded={menuOpen}
						onClick={() => setMenuOpen(true)}
						className="inline-flex h-11 w-11 items-center justify-center rounded-[var(--r-sm)] text-text lg:hidden"
					>
						<Menu size={22} aria-hidden />
					</button>
				</div>
			</div>

			<MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
		</header>
	);
}
