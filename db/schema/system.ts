import { sql } from "drizzle-orm";
import {
	integer,
	jsonb,
	pgTable,
	text,
	timestamp,
	uuid,
} from "drizzle-orm/pg-core";

/* System tables per Doc 06 §3.13 and §5.1. */

export const audit_log = pgTable("audit_log", {
	id: uuid("id").default(sql`gen_random_uuid()`).primaryKey(),
	actor_id: uuid("actor_id"),
	actor_email: text("actor_email"),
	action: text("action").notNull(), // 'publish_page', 'read_referral', ...
	entity_type: text("entity_type").notNull(),
	entity_id: uuid("entity_id"),
	before: jsonb("before"),
	after: jsonb("after"),
	ip_hash: text("ip_hash"), // SHA-256, never plain
	user_agent: text("user_agent"),
	created_at: timestamp("created_at", { withTimezone: true })
		.defaultNow()
		.notNull(),
});

export const rate_limits = pgTable("rate_limits", {
	key: text("key").primaryKey(), // e.g. 'enquiry:<ip_hash>'
	window_start: timestamp("window_start", { withTimezone: true })
		.defaultNow()
		.notNull(),
	count: integer("count").default(0).notNull(),
});
