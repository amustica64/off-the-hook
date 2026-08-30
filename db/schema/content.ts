import { sql } from "drizzle-orm";
import {
	boolean,
	integer,
	jsonb,
	numeric,
	pgTable,
	text,
	uniqueIndex,
	uuid,
} from "drizzle-orm/pg-core";
import { audit, editorial, orderable, sluggable } from "./shared";

/* Content tables per Doc 06 §3.1-3.4, §3.7. */

export const pages = pgTable("pages", {
	id: uuid("id").default(sql`gen_random_uuid()`).primaryKey(),
	...sluggable(), // 'home' | 'restaurant' | 'academy' | 'impact' | 'about'
	title: text("title").notNull(),
	sections: jsonb("sections").notNull(),
	sections_draft: jsonb("sections_draft"),
	...editorial(),
});

export const journey_steps = pgTable("journey_steps", {
	id: uuid("id").default(sql`gen_random_uuid()`).primaryKey(),
	order: integer("order").notNull().unique(), // 1..7, fixed set
	title: text("title").notNull(),
	subtitle: text("subtitle"),
	body: text("body").notNull(),
	icon_key: text("icon_key").notNull(),
	outcome_summary: text("outcome_summary"),
	is_published: boolean("is_published").default(true).notNull(),
	...audit(),
});

export const impact_metrics = pgTable(
	"impact_metrics",
	{
		id: uuid("id").default(sql`gen_random_uuid()`).primaryKey(),
		metric_key: text("metric_key").notNull(),
		year: integer("year").notNull(),
		value: numeric("value").notNull(),
		unit: text("unit"),
		source_note: text("source_note"),
		...orderable(),
		is_published: boolean("is_published").default(false).notNull(),
		...audit(),
	},
	(t) => [uniqueIndex("impact_metric_year_idx").on(t.metric_key, t.year)],
);

export const stories = pgTable("stories", {
	id: uuid("id").default(sql`gen_random_uuid()`).primaryKey(),
	...sluggable(),
	title: text("title").notNull(),
	strapline: text("strapline"),
	author_name: text("author_name"),
	author_role: text("author_role"),
	cover_image_id: uuid("cover_image_id"),
	category: text("category").notNull(), // 'trainee' | 'alumni' | 'kitchen-notes' | 'community'
	body_mdx: text("body_mdx").notNull(),
	body_mdx_draft: text("body_mdx_draft"),
	pull_quote: text("pull_quote"),
	reading_time_minutes: integer("reading_time_minutes"),
	featured: boolean("featured").default(false).notNull(), // one at a time, enforced by RPC
	consent_status: text("consent_status").default("pending").notNull(), // 'pending' | 'granted' | 'withdrawn' (Doc 01 FR-06)
	...editorial(),
});

export const partners = pgTable("partners", {
	id: uuid("id").default(sql`gen_random_uuid()`).primaryKey(),
	name: text("name").notNull(),
	category: text("category").notNull(), // 'funder' | 'referral' | 'employer' | 'supporter'
	logo_image_id: uuid("logo_image_id"),
	website_url: text("website_url"),
	short_note: text("short_note"),
	...orderable(),
	is_published: boolean("is_published").default(true).notNull(),
	...audit(),
});
