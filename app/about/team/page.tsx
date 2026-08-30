import { redirect } from "next/navigation";

/* Renders only once the team exceeds six (Doc 09 §3.3). Until then, /about. */
export default function TeamPage() {
	redirect("/about");
}
