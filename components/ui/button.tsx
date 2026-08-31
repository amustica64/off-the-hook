import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

/*
  Button family per Doc 07 §6.3 and Doc 09 §1.4.
  Hover is a background shift only (Doc 05 §3.3): no scale, no shadow bloom.
*/

type Variant = "primary" | "secondary" | "ghost" | "destructive";
type Size = "sm" | "md" | "lg";

const base =
	"inline-flex items-center justify-center gap-2 rounded-[var(--r-sm)] font-medium " +
	"transition-colors duration-[var(--dur-fast)] disabled:cursor-not-allowed disabled:opacity-50";

const variants: Record<Variant, string> = {
	primary: "bg-accent-fill text-cream-50 hover:bg-accent-fill-hover",
	secondary: "border border-accent text-accent hover:bg-accent-wash",
	ghost: "text-accent hover:bg-accent-wash",
	destructive: "bg-status-danger-fill text-cream-50 hover:opacity-90",
};

const sizes: Record<Size, string> = {
	sm: "h-9 px-3 text-[length:var(--fs-small)]",
	md: "h-11 px-5 text-[length:var(--fs-body)]",
	lg: "h-12 px-6 text-[length:var(--fs-body)]",
};

function Spinner() {
	return (
		// biome-ignore lint/a11y/noSvgWithoutTitle: decorative icon, aria-hidden; a title would announce it to assistive tech
		<svg aria-hidden viewBox="0 0 16 16" className="h-4 w-4 animate-spin">
			<circle
				cx="8"
				cy="8"
				r="6.5"
				fill="none"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeDasharray="28"
				strokeDashoffset="20"
				strokeLinecap="round"
			/>
		</svg>
	);
}

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
	variant?: Variant;
	size?: Size;
	loading?: boolean;
};

export function Button({
	variant = "primary",
	size = "md",
	loading = false,
	disabled,
	className,
	children,
	type = "button",
	...rest
}: ButtonProps) {
	return (
		<button
			type={type}
			disabled={disabled || loading}
			aria-busy={loading || undefined}
			className={cn(base, variants[variant], sizes[size], className)}
			{...rest}
		>
			{loading && <Spinner />}
			{children}
		</button>
	);
}

type LinkButtonProps = React.ComponentProps<typeof Link> & {
	variant?: Variant;
	size?: Size;
};

export function LinkButton({
	variant = "primary",
	size = "md",
	className,
	children,
	...rest
}: LinkButtonProps) {
	return (
		<Link
			className={cn(base, variants[variant], sizes[size], className)}
			{...rest}
		>
			{children}
		</Link>
	);
}

type IconButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
	icon: LucideIcon;
	label: string; // required for a11y, rendered as the accessible name
};

export function IconButton({
	icon: Icon,
	label,
	className,
	type = "button",
	...rest
}: IconButtonProps) {
	return (
		<button
			type={type}
			aria-label={label}
			className={cn(
				"inline-flex h-11 w-11 items-center justify-center rounded-[var(--r-sm)] text-text-secondary",
				"transition-colors duration-[var(--dur-fast)] hover:bg-surface disabled:opacity-50",
				className,
			)}
			{...rest}
		>
			<Icon size={20} aria-hidden />
		</button>
	);
}

export function TextLink({
	className,
	children,
	...rest
}: React.ComponentProps<typeof Link>) {
	return (
		<Link
			className={cn(
				"text-accent underline underline-offset-4 transition-[text-underline-offset] duration-[var(--dur-fast)] hover:underline-offset-2",
				className,
			)}
			{...rest}
		>
			{children}
		</Link>
	);
}
