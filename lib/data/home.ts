import { and, asc, desc, eq } from "drizzle-orm";
import { db } from "@/db/client";
import { impact_metrics, journey_steps, stories } from "@/db/schema";

/*
  Home page reads. Published rows only, granted consent only (Doc 06 §3).
  Every function degrades to empty on a missing DB so sections can hide
  per the Doc 04 empty-state library instead of crashing the page.
*/

export async function getHomeMetrics() {
	if (!db) return [];
	try {
		return await db
			.select()
			.from(impact_metrics)
			.where(eq(impact_metrics.is_published, true))
			.orderBy(desc(impact_metrics.year), asc(impact_metrics.order));
	} catch {
		return [];
	}
}

export async function getGrantedStories(limit = 6) {
	if (!db) return [];
	try {
		return await db
			.select()
			.from(stories)
			.where(
				and(
					eq(stories.is_published, true),
					eq(stories.consent_status, "granted"),
				),
			)
			.orderBy(desc(stories.published_at))
			.limit(limit);
	} catch {
		return [];
	}
}

export async function getJourneySteps() {
	if (!db) return [];
	try {
		return await db
			.select()
			.from(journey_steps)
			.where(eq(journey_steps.is_published, true))
			.orderBy(asc(journey_steps.order));
	} catch {
		return [];
	}
}
