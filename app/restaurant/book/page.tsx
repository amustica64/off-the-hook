import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Lead } from "@/components/ui/typography";

export const metadata: Metadata = { title: "Book a table \u00b7 Off the Hook" };

/* Route stub (Phase 3). Full screen builds in Phase 5 against Doc 09 /restaurant/book. */
export default function Page() {
	return (
		<Section>
			<Container width="narrow">
				<h1>Book a table</h1>
				<Lead className="mt-4">
					Tell us when and how many. We reply within one working day.
				</Lead>
			</Container>
		</Section>
	);
}
