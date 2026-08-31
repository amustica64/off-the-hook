import "server-only";
import { readFile } from "node:fs/promises";
import path from "node:path";

/*
  The six legal routes of Doc 03 §/legal, rendered by one template
  (Doc 09 §3.23, "one template, six routes"). Body copy lives in
  content/legal/<slug>.mdx per Doc 06 §2: legal pages stay in the repo rather
  than the CMS because "they change rarely and legal review requires diffs".

  Structural metadata lives here rather than in MDX frontmatter. There is no
  YAML parser in the dependency tree, and hand-rolling one to read four fields
  is a worse trade than a typed registry that the compiler checks and that
  shows all six documents' status in one place.

  Note on Doc 07 §folder-layout: it lists a terms.mdx. No terms route exists in
  Doc 03 §/legal, Doc 04 §/legal/*, Doc 09 §3.23 or the built footer, all four
  of which agree on these six. Following the four, and flagged rather than
  invented.
*/

export type LegalStatus = "published" | "draft";

export type LegalDoc = {
	slug: string;
	/** H1 and <title>. Sentence case, per Doc 10 §5. */
	title: string;
	/** Meta description. */
	summary: string;
	status: LegalStatus;
	/** ISO date of the last substantive change. Null while unpublished. */
	updated: string | null;
	/**
	 * Facts the CIC must supply before this document can be published.
	 * Never rendered to a visitor: a public list of what an organisation has
	 * not yet decided about safeguarding is not a thing to publish. It is here
	 * so the outstanding work is visible to whoever picks the page up.
	 */
	needs: string[];
	/**
	 * One extra line shown on the unpublished page, for a document whose absence
	 * has a consequence a visitor needs to act on today.
	 */
	draftNote?: string;
};

export const LEGAL_DOCS: readonly LegalDoc[] = [
	{
		slug: "privacy",
		title: "Privacy",
		summary:
			"What Off the Hook collects when you use this site, why, and how to ask us to delete it.",
		status: "draft",
		updated: null,
		needs: [
			"Registered controller name, company number and registered office address.",
			"ICO registration number, or confirmation that the fee-payer exemption applies.",
			"Retention period for each table that holds personal data: bookings, enquiries, referrals.",
			"A named contact for access, correction and erasure requests.",
			"Lawful basis for each purpose, and the Article 9 condition relied on for the encrypted safeguarding notes on a referral.",
			"Confirmation of every processor: Supabase (database and Vault), Vercel (hosting), Cloudflare (Turnstile, once keys are set), and the email provider once one is chosen.",
			"Whether any personal data leaves the UK or EEA, and on what transfer mechanism.",
		],
	},
	{
		slug: "cookies",
		title: "Cookies and storage",
		summary:
			"This site sets no cookies. Here is the little it does keep in your browser, and how to clear it.",
		status: "published",
		updated: "2026-08-31",
		needs: [],
	},
	{
		slug: "safeguarding",
		title: "Safeguarding",
		summary:
			"How Off the Hook keeps people safe, and who to tell if something is wrong.",
		status: "draft",
		updated: null,
		draftNote:
			"If someone is in immediate danger, do not wait for this page. Call 999. If your concern is about a person on our programme, tell us through the referrals page and say that it is urgent.",
		needs: [
			"Name and role of the designated safeguarding lead, and of the deputy. Doc 04 §/partners/referrals item 4 and Doc 09 §3.15 both hold a Callout open for these.",
			"An urgent reporting route that a person actually answers, including the phone number. lib/venue.ts is waiting for it.",
			"The escalation policy, and the probation and local authority contacts it escalates to.",
			"Board approval date and the review cycle.",
		],
	},
	{
		slug: "accessibility",
		title: "Accessibility",
		summary:
			"What we have built into this site, what we know is not finished, and how to tell us it is not working for you.",
		status: "published",
		updated: "2026-08-31",
		needs: [],
	},
	{
		slug: "cic-declaration",
		title: "CIC declaration",
		summary:
			"Off the Hook is a community interest company. This is what that commits us to.",
		status: "draft",
		updated: null,
		needs: [
			"The CIC34 community interest report as filed at Companies House, or the declaration text as filed.",
			"Company number and date of incorporation.",
			"The asset lock wording, and the named asset-locked body any residual assets transfer to.",
		],
	},
	{
		slug: "modern-slavery",
		title: "Modern slavery statement",
		summary:
			"Our statement on modern slavery and human trafficking in our own operations and supply chain.",
		status: "draft",
		updated: null,
		needs: [
			"Confirmation that the section 54 turnover threshold applies. Doc 03 §/legal marks this one 'required once trading'.",
			"Board-approved statement text, and the name of the director who signs it.",
			"The financial year the statement covers.",
		],
	},
] as const;

export function getLegalDoc(slug: string): LegalDoc | undefined {
	return LEGAL_DOCS.find((d) => d.slug === slug);
}

/** Anchor id for a heading. Shared by the rendered h2 and the contents rail so they cannot drift. */
export function headingId(text: string): string {
	return text
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "");
}

export type TocEntry = { id: string; text: string };

/**
 * H2s only, in document order, for the sticky contents rail (Doc 04 §/legal/*).
 * Fenced code is skipped so a `## ` inside a block cannot become a phantom entry.
 */
export function tableOfContents(source: string): TocEntry[] {
	const out: TocEntry[] = [];
	let fenced = false;
	for (const line of source.split("\n")) {
		if (/^\s*(```|~~~)/.test(line)) {
			fenced = !fenced;
			continue;
		}
		if (fenced) continue;
		const m = /^##\s+(.+?)\s*$/.exec(line);
		if (m) out.push({ id: headingId(m[1]), text: m[1] });
	}
	return out;
}

/** Body MDX for a slug. Drafts have no body file and return null. */
export async function readLegalBody(slug: string): Promise<string | null> {
	const file = path.join(process.cwd(), "content", "legal", `${slug}.mdx`);
	try {
		return await readFile(file, "utf8");
	} catch {
		return null;
	}
}
