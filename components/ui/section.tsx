import { cn } from "@/lib/utils";

type SectionProps = {
	spacing?: "sm" | "md" | "lg";
	background?: "cream" | "surface" | "forest";
	id?: string;
	className?: string;
	children: React.ReactNode;
};

const spacings = {
	sm: "py-12 md:py-16",
	md: "py-16 md:py-24",
	lg: "py-20 md:py-32",
} as const;

const backgrounds = {
	cream: "bg-bg",
	surface: "bg-surface",
	forest: "bg-forest-600 text-cream-25",
} as const;

export function Section({
	spacing = "md",
	background = "cream",
	id,
	className,
	children,
}: SectionProps) {
	return (
		<section
			id={id}
			className={cn(spacings[spacing], backgrounds[background], className)}
		>
			{children}
		</section>
	);
}
