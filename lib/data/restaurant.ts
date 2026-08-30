import { and, asc, eq } from "drizzle-orm";
import { db } from "@/db/client";
import { menu_items } from "@/db/schema";

export const MENU_SECTIONS = [
	{ key: "small", label: "Small plates" },
	{ key: "large", label: "Large plates" },
	{ key: "sides", label: "Sides" },
	{ key: "sweet", label: "Sweet" },
	{ key: "set-menu", label: "Sunday set menu" },
] as const;

export function formatPrice(pence: number): string {
	return `£${(pence / 100).toFixed(pence % 100 === 0 ? 0 : 2)}`;
}

export async function getMenu() {
	if (!db) return [];
	try {
		return await db
			.select()
			.from(menu_items)
			.where(
				and(
					eq(menu_items.is_published, true),
					eq(menu_items.is_available, true),
				),
			)
			.orderBy(asc(menu_items.section), asc(menu_items.order));
	} catch {
		return [];
	}
}
