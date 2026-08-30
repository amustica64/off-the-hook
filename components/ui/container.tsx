import { cn } from "@/lib/utils";

type ContainerProps = {
	width?: "default" | "narrow" | "full";
	className?: string;
	children: React.ReactNode;
};

const widths = {
	default: "max-w-[var(--content-max)]",
	narrow: "max-w-[var(--content-narrow)]",
	full: "max-w-none",
} as const;

export function Container({
	width = "default",
	className,
	children,
}: ContainerProps) {
	return (
		<div
			className={cn("mx-auto w-full px-4 md:px-6", widths[width], className)}
		>
			{children}
		</div>
	);
}
