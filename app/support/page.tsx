import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Lead } from "@/components/ui/typography";

export const metadata: Metadata = {
	title: "Support the work \u00b7 Off the Hook",
};

/* Route stub (Phase 3). Full screen builds in Phase 5 against Doc 09 /support. */
export default function Page() {
	return (
		<Section>
			<Container width="narrow">
				<h1>Support the work</h1>
				<Lead className="mt-4">Donate, volunteer, or bring your company.</Lead>
			</Container>
		</Section>
	);
}
