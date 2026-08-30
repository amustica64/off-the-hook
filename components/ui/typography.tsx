import { cn } from "@/lib/utils";

/* Type primitives per Doc 07 §6.2 and the Doc 09 §1.1 pattern language. */

export function Eyebrow({
	className,
	children,
}: {
	className?: string;
	children: React.ReactNode;
}) {
	return (
		<p
			className={cn(
				"text-[length:var(--fs-tiny)] font-medium uppercase tracking-[0.08em] text-accent",
				className,
			)}
		>
			{children}
		</p>
	);
}

export function Display({
	as: Tag = "h1",
	className,
	children,
}: {
	as?: "h1" | "h2";
	className?: string;
	children: React.ReactNode;
}) {
	return <Tag className={cn("display", className)}>{children}</Tag>;
}

export function Lead({
	className,
	children,
}: {
	className?: string;
	children: React.ReactNode;
}) {
	return (
		<p
			className={cn(
				"max-w-[var(--measure)] text-[length:var(--fs-lead)] leading-normal text-text-secondary",
				className,
			)}
		>
			{children}
		</p>
	);
}

export function Prose({
	className,
	children,
}: {
	className?: string;
	children: React.ReactNode;
}) {
	return (
		<div
			className={cn(
				"max-w-[var(--measure)] space-y-4 text-text [&_a]:text-accent [&_a]:underline [&_a]:underline-offset-4 [&_h2]:mt-10 [&_h3]:mt-8",
				className,
			)}
		>
			{children}
		</div>
	);
}

/* Fraunces italic, hanging quote, attribution in Inter small. Doc 08 §6.4. */
export function PullQuote({
	quote,
	attribution,
	className,
}: {
	quote: string;
	attribution?: string;
	className?: string;
}) {
	return (
		<figure className={cn("my-8", className)}>
			<blockquote
				className="relative pl-8 font-serif italic text-[length:var(--fs-h3)] leading-[var(--lh-heading)] text-text"
				style={{ fontVariationSettings: '"SOFT" 100, "WONK" 0' }}
			>
				<span aria-hidden className="absolute left-0 top-0">
					&ldquo;
				</span>
				{quote}
				<span aria-hidden>&rdquo;</span>
			</blockquote>
			{attribution && (
				<figcaption className="mt-3 pl-8 text-[length:var(--fs-small)] text-text-muted">
					{attribution}
				</figcaption>
			)}
		</figure>
	);
}

export function Callout({
	tone = "note",
	className,
	children,
}: {
	tone?: "note" | "important";
	className?: string;
	children: React.ReactNode;
}) {
	return (
		<aside
			className={cn(
				"rounded-[var(--r-md)] border p-5 text-[length:var(--fs-body)]",
				tone === "note"
					? "border-divider bg-surface text-text-secondary"
					: "border-accent/30 bg-accent-wash text-accent-wash-text",
				className,
			)}
		>
			{children}
		</aside>
	);
}
