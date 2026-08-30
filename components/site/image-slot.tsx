import Image from "next/image";
import { cn } from "@/lib/utils";

/*
  Image surface per Doc 09 §1.6. With `src`, renders the pack's interim visual
  (replaced by the commissioned shoot); without, a cream panel naming the shot.
  No stock, no imagery outside /public/heroes.
*/
export function ImageSlot({
	label,
	src,
	ratio = "16/11",
	rounded = true,
	sizes = "(max-width: 1024px) 100vw, 40vw",
	className,
}: {
	label: string;
	src?: string;
	ratio?: string;
	rounded?: boolean;
	sizes?: string;
	className?: string;
}) {
	if (src) {
		return (
			<div
				className={cn(
					"relative overflow-hidden",
					rounded && "rounded-[var(--r-lg)]",
					className,
				)}
				style={{ aspectRatio: ratio }}
			>
				<Image
					src={src}
					alt={label}
					fill
					sizes={sizes}
					className="object-cover"
				/>
			</div>
		);
	}
	return (
		<div
			role="img"
			aria-label={`Photograph to come: ${label}`}
			className={cn(
				"flex items-end border border-divider bg-surface p-4",
				rounded && "rounded-[var(--r-lg)]",
				className,
			)}
			style={{ aspectRatio: ratio }}
		>
			<span className="text-[length:var(--fs-tiny)] font-medium uppercase tracking-[0.08em] text-text-muted">
				{label}
			</span>
		</div>
	);
}
