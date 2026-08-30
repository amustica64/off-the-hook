import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";

export const metadata: Metadata = { title: "Cookies \u00b7 Off the Hook" };

/* Route stub (Phase 3). Full screen builds in Phase 5 against Doc 09 /legal/cookies. */
export default function Page() {
	return (
		<Section>
			<Container width="narrow">
				<h1>Cookies</h1>
			</Container>
		</Section>
	);
}
