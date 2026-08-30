"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function ThemeToggle({ inline = false }: { inline?: boolean }) {
	const { theme, setTheme } = useTheme();
	const [mounted, setMounted] = useState(false);

	useEffect(() => setMounted(true), []);
	if (!mounted) return <span className="inline-block h-11 w-11" aria-hidden />; // reserve space, no hydration mismatch

	const dark = theme === "dark";
	return (
		<button
			type="button"
			aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
			onClick={() => setTheme(dark ? "light" : "dark")}
			className={cn(
				"inline-flex h-11 w-11 items-center justify-center rounded-[var(--r-sm)] text-text-secondary transition-colors duration-[var(--dur-fast)] hover:bg-surface",
				!inline && "fixed top-6 right-6 border border-divider",
			)}
		>
			{dark ? <Sun size={20} aria-hidden /> : <Moon size={20} aria-hidden />}
		</button>
	);
}
