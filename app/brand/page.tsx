import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Lead } from "@/components/ui/typography";

export const metadata: Metadata = {
	title: "Off the Hook brand \u00b7 Off the Hook",
};

/* Route stub (Phase 3). Full screen builds in Phase 5 against Doc 09 /brand. */
export default function Page() {
	return (
		<Section>
			<Container width="narrow">
				<h1>Off the Hook brand</h1>
				<Lead className="mt-4">
					Logo files, colours, type, and voice notes for partners and press.
				</Lead>
			</Container>
		</Section>
	);
}
