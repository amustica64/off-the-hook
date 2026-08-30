import { LinkButton } from "@/components/ui/button";

/* 404 per Doc 03 §11. The empty-plate illustration follows with the artwork pass. */
export default function NotFound() {
	return (
		<div className="flex min-h-[60dvh] flex-col items-center justify-center px-6 text-center">
			<h1>That page is not on the menu.</h1>
			<p className="mt-3 max-w-md text-text-secondary">
				The link may be old, or the page may have moved. The kitchen is still
				open.
			</p>
			<div className="mt-6 flex gap-3">
				<LinkButton href="/">Back to the start</LinkButton>
				<LinkButton href="/contact" variant="secondary">
					Talk to us
				</LinkButton>
			</div>
		</div>
	);
}
