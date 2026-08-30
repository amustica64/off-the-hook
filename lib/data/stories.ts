import { and, desc, eq, ne } from "drizzle-orm";
import { db } from "@/db/client";
import { stories } from "@/db/schema";

/* Public story reads: published and granted consent only, mirroring RLS (Doc 06 §3.4). */

const publicStory = and(
	eq(stories.is_published, true),
	eq(stories.consent_status, "granted"),
);

export const STORY_CATEGORIES = [
	{ key: "trainee", label: "Trainees" },
	{ key: "alumni", label: "Alumni" },
	{ key: "kitchen-notes", label: "Kitchen notes" },
	{ key: "community", label: "Community" },
] as const;

/* Interim covers until the media table lands (Phase 8). */
export const STORY_COVERS: Record<string, string> = {
	"danny-makes-bread": "/heroes/bread-and-menu.webp",
	"michelle-runs-the-pass": "/heroes/training-session.webp",
	"what-the-kitchen-taught-us": "/heroes/plate-beef-shin.webp",
	"the-tuesday-lunch-club": "/heroes/dining-room-morning.webp",
};

export async function getStories(category?: string) {
	if (!db) return [];
	try {
		const where = category
			? and(publicStory, eq(stories.category, category))
			: publicStory;
		return await db
			.select()
			.from(stories)
			.where(where)
			.orderBy(desc(stories.published_at));
	} catch {
		return [];
	}
}

export async function getStory(slug: string) {
	if (!db) return null;
	try {
		const rows = await db
			.select()
			.from(stories)
			.where(and(publicStory, eq(stories.slug, slug)))
			.limit(1);
		return rows[0] ?? null;
	} catch {
		return null;
	}
}

export async function getAnotherStory(excludeSlug: string) {
	if (!db) return null;
	try {
		const rows = await db
			.select({ slug: stories.slug, title: stories.title })
			.from(stories)
			.where(and(publicStory, ne(stories.slug, excludeSlug)))
			.orderBy(desc(stories.published_at))
			.limit(1);
		return rows[0] ?? null;
	} catch {
		return null;
	}
}

export function readingTimeMinutes(text: string): number {
	return Math.max(1, Math.round(text.split(/\s+/).length / 200));
}
