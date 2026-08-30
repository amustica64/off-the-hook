import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Lead } from "@/components/ui/typography";

export const metadata: Metadata = {
	title: "Interested in training with us \u00b7 Off the Hook",
};

/* Route stub (Phase 3). Full screen builds in Phase 5 against Doc 09 /join. */
export default function Page() {
	return (
		<Section>
			<Container width="narrow">
				<h1>Interested in training with us?</h1>
				<Lead className="mt-4">
					This page is for you. Tell us a bit about yourself and we will call
					you back.
				</Lead>
			</Container>
		</Section>
	);
}
