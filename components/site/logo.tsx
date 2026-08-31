import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

/*
  Lockup per the pack's logo artwork (public/brand): the O-and-hook monogram
  plus the Fraunces wordmark, "CIC" letterspaced in forest.

  The monogram is mark-o.png, not mark-badge.png. Doc 08 section 4.4 says the
  logo is never "placed inside a container, box, or badge unless it is the
  reverse variant used on a dark photo", and this lockup sits on cream in both
  the header and the footer. mark-o is the same artwork without the badge.

  The intrinsic 200x230 is passed through and the height is set in CSS, so the
  ratio stays exact. Doc 08 section 4.4 forbids condensing as well as badging,
  and the badge was square (210x210), so its 30x30 box cannot carry over.
*/
export function Logo({ className }: { className?: string }) {
	return (
		<Link
			href="/"
			className={cn("inline-flex items-center gap-2.5", className)}
		>
			<Image
				src="/brand/mark-o.png"
				alt=""
				width={200}
				height={230}
				className="h-[30px] w-auto"
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
