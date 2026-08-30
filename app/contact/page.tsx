import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Lead } from "@/components/ui/typography";

export const metadata: Metadata = { title: "Talk to us \u00b7 Off the Hook" };

/* Route stub (Phase 3). Full screen builds in Phase 5 against Doc 09 /contact. */
export default function Page() {
	return (
		<Section>
			<Container width="narrow">
				<h1>Talk to us</h1>
				<Lead className="mt-4">
					For the fastest reply, use the pages built for you.
				</Lead>
			</Container>
		</Section>
	);
}
