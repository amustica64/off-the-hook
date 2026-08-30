import { sql } from "drizzle-orm";
import {
	boolean,
	integer,
	pgTable,
	text,
	timestamp,
	uuid,
} from "drizzle-orm/pg-core";
import { audit, editorial, orderable, sluggable } from "./shared";

/* Restaurant tables per Doc 06 §3.5, §3.6, §3.8. */

export const menu_items = pgTable("menu_items", {
	id: uuid("id").default(sql`gen_random_uuid()`).primaryKey(),
	name: text("name").notNull(),
	description: text("description"),
	price_pence: integer("price_pence").notNull(),
	section: text("section").notNull(), // 'small' | 'large' | 'sides' | 'sweet' | 'set-menu'
	...orderable(),
	allergens: text("allergens").array().notNull().default(sql`'{}'::text[]`), // UK 14, validated by Zod
	is_vegetarian: boolean("is_vegetarian").default(false).notNull(),
	is_vegan: boolean("is_vegan").default(false).notNull(),
	is_available: boolean("is_available").default(true).notNull(),
	is_published: boolean("is_published").default(true).notNull(),
	...audit(),
});

export const events = pgTable("events", {
	id: uuid("id").default(sql`gen_random_uuid()`).primaryKey(),
	...sluggable(),
	title: text("title").notNull(),
	starts_at: timestamp("starts_at", { withTimezone: true }).notNull(),
	ends_at: timestamp("ends_at", { withTimezone: true }),
	location: text("location"),
	price_pence: integer("price_pence"), // null = free
	capacity: integer("capacity"),
	booked_count: integer("booked_count").default(0).notNull(),
	summary: text("summary"),
	body_mdx: text("body_mdx"),
	cover_image_id: uuid("cover_image_id"),
	external_ticket_url: text("external_ticket_url"),
	...editorial(),
});

export const bookings = pgTable("bookings", {
	id: uuid("id").default(sql`gen_random_uuid()`).primaryKey(),
	type: text("type").notNull(), // 'restaurant' | 'event'
	event_id: uuid("event_id").references(() => events.id, {
		onDelete: "set null",
	}),
	first_name: text("first_name").notNull(),
	last_name: text("last_name").notNull(),
	email: text("email").notNull(),
	phone: text("phone"),
	party_size: integer("party_size").notNull(),
	requested_at: timestamp("requested_at", { withTimezone: true }).notNull(),
	dietary_notes: text("dietary_notes"),
	status: text("status").default("pending").notNull(), // pending|confirmed|declined|cancelled|seated|no_show
	admin_note: text("admin_note"),
	source: text("source"), // 'website' | 'phone' | 'walk_in'
	gdpr_consent: boolean("gdpr_consent").default(false).notNull(),
	marketing_consent: boolean("marketing_consent").default(false).notNull(),
	created_at: timestamp("created_at", { withTimezone: true })
		.defaultNow()
		.notNull(),
	// No soft delete: retained 24 months then hard delete (Doc 06 §12).
});
