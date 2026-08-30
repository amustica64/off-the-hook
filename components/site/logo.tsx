import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

/*
  Lockup per the pack's logo artwork (public/brand): circular O-and-hook
  monogram badge plus the Fraunces wordmark, "CIC" letterspaced in forest.
  The badge crops circular so it sits cleanly on both themes.
*/
export function Logo({ className }: { className?: string }) {
	return (
		<Link
			href="/"
			className={cn("inline-flex items-center gap-2.5", className)}
		>
			<Image
				src="/brand/mark-badge.png"
				alt=""
				width={30}
				height={30}
				className="rounded-full"
				priority
			/>
			<span className="inline-flex items-baseline gap-2">
				<span
					className="font-serif text-[1.375rem] font-medium lowercase tracking-tight text-text"
					style={{ fontVariationSettings: '"SOFT" 100, "WONK" 0' }}
				>
					off the hook
				</span>
				<span className="text-[length:var(--fs-tiny)] font-medium uppercase tracking-[0.08em] text-accent">
					CIC
				</span>
			</span>
		</Link>
	);
}
