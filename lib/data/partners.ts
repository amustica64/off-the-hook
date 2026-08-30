import { and, asc, eq } from "drizzle-orm";
import { db } from "@/db/client";
import { partners } from "@/db/schema";

export async function getPartners(category?: string) {
	if (!db) return [];
	try {
		const where = category
			? and(eq(partners.is_published, true), eq(partners.category, category))
			: eq(partners.is_published, true);
		return await db
			.select()
			.from(partners)
			.where(where)
			.orderBy(asc(partners.order));
	} catch {
		return [];
	}
}
