"use client";

import { useEffect } from "react";
import { Button, LinkButton } from "@/components/ui/button";

/* 500 per Doc 03 §11. Sentry capture wires in Phase 9. */
export default function ErrorPage({
	error,
	reset,
}: {
	error: Error;
	reset: () => void;
}) {
	useEffect(() => {
		console.error(error);
	}, [error]);

	return (
		<div className="flex min-h-[60dvh] flex-col items-center justify-center px-6 text-center">
			<h1>Something broke at our end.</h1>
			<p className="mt-3 max-w-md text-text-secondary">
				We have been alerted. Try again in a moment.
			</p>
			<div className="mt-6 flex gap-3">
				<Button onClick={reset}>Try again</Button>
				<LinkButton href="/" variant="secondary">
					Back to the start
				</LinkButton>
			</div>
		</div>
	);
}
