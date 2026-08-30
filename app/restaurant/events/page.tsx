import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Lead } from "@/components/ui/typography";

export const metadata: Metadata = {
	title: "Private events \u00b7 Off the Hook",
};

/* Route stub (Phase 3). Full screen builds in Phase 5 against Doc 09 /restaurant/events. */
export default function Page() {
	return (
		<Section>
			<Container width="narrow">
				<h1>Private events</h1>
				<Lead className="mt-4">
					Book the whole restaurant. Every event supports the training
					programme.
				</Lead>
			</Container>
		</Section>
	);
}
