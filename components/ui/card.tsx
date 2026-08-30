import { CountUp } from "@/components/motion/count-up";
import { cn } from "@/lib/utils";

/*
  Cards per Doc 07 §6.5 and Doc 09 §1.3: cream-100 fill, 1px cream-200 border,
  shadow-sm at rest. Interactive cards step border to forest and shadow to md
  on hover (Doc 05 §3.3). No card ever floats on a big shadow.
*/

type CardProps = {
	as?: "div" | "article";
	interactive?: boolean;
	className?: string;
	children: React.ReactNode;
};

export function Card({
	as: Tag = "div",
	interactive = false,
	className,
	children,
}: CardProps) {
	return (
		<Tag
			className={cn(
				"rounded-[var(--r-md)] border border-divider bg-surface p-6 shadow-[var(--shadow-sm)]",
				interactive &&
					"transition-[border-color,box-shadow] duration-[var(--dur-fast)] hover:border-accent hover:shadow-[var(--shadow-md)]",
				className,
			)}
		>
			{children}
		</Tag>
	);
}

/* Small floating card over hero imagery. Renders only with a real dated metric (Doc 09 §3.1). */
export function StatCard({
	value,
	label,
	source,
	className,
}: {
	value: string;
	label: string;
	source: string;
	className?: string;
}) {
	return (
		<div
			className={cn(
				"max-w-xs rounded-[var(--r-md)] bg-bg-elev p-5 shadow-[var(--shadow-md)]",
				className,
			)}
		>
			<p className="font-serif text-[length:var(--fs-h1)] font-medium leading-[var(--lh-tight)] tabular-nums text-text">
				{value}
			</p>
			<p className="mt-1 text-[length:var(--fs-small)] text-text-secondary">
				{label}
			</p>
			<p className="mt-2 text-[length:var(--fs-tiny)] text-text-muted">
				{source}
			</p>
		</div>
	);
}

/*
  Impact metric tile. Static in Phase 2; the M1 count-up lands in Phase 7.
  The source note is a disclosure, not a tooltip (Doc 09 taste pass item 4).
*/
export function MetricTile({
	value,
	label,
	source,
	updated,
	className,
	metricKey,
	numericValue,
}: {
	value: string;
	label: string;
	source?: string;
	updated?: string;
	className?: string;
	/* When both are set, the number counts up on viewport entry (Doc 05 M1). */
	metricKey?: string;
	numericValue?: number;
}) {
	return (
		<div
			className={cn(
				"rounded-[var(--r-md)] border border-divider bg-surface p-6",
				className,
			)}
		>
			<p className="font-serif text-[length:var(--fs-display)] font-medium leading-[var(--lh-tight)] tabular-nums text-text">
				{metricKey !== undefined && numericValue !== undefined ? (
					<CountUp metricKey={metricKey} value={numericValue} />
				) : (
					value
				)}
			</p>
			<p className="mt-2 text-[length:var(--fs-small)] text-text-secondary">
				{label}
			</p>
			{source && (
				<details className="mt-3">
					<summary className="cursor-pointer list-none text-[length:var(--fs-tiny)] text-text-muted underline underline-offset-2">
						Source
					</summary>
					<p className="mt-1 text-[length:var(--fs-tiny)] text-text-muted">
						{source}
					</p>
				</details>
			)}
			{updated && (
				<p className="mt-2 text-[length:var(--fs-tiny)] text-text-muted">
					Updated {updated}
				</p>
			)}
		</div>
	);
}
