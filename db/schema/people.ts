import { sql } from "drizzle-orm";
import {
	boolean,
	date,
	jsonb,
	pgTable,
	text,
	timestamp,
	uuid,
} from "drizzle-orm/pg-core";

/* People and inbound tables per Doc 06 §3.9-3.12. */

export const enquiries = pgTable("enquiries", {
	id: uuid("id").default(sql`gen_random_uuid()`).primaryKey(),
	type: text("type").notNull(), // 'contact'|'hire'|'partnership'|'employer'|'press'|'trainee'|'funder'|'educator'|'volunteer'|'donation'
	first_name: text("first_name").notNull(),
	last_name: text("last_name").notNull(),
	email: text("email").notNull(),
	organisation: text("organisation"),
	phone: text("phone"),
	message: text("message").notNull(),
	metadata: jsonb("metadata"), // form-specific fields, Zod-validated per type
	status: text("status").default("new").notNull(), // 'new' | 'in_progress' | 'closed' | 'spam'
	admin_note: text("admin_note"),
	gdpr_consent: boolean("gdpr_consent").default(false).notNull(),
	source_page: text("source_page"),
	created_at: timestamp("created_at", { withTimezone: true })
		.defaultNow()
		.notNull(),
});

/* The most sensitive table on the site. RLS locks it to safeguarding and admin. */
export const referrals = pgTable("referrals", {
	id: uuid("id").default(sql`gen_random_uuid()`).primaryKey(),

	referrer_name: text("referrer_name").notNull(),
	referrer_organisation: text("referrer_organisation").notNull(),
	referrer_email: text("referrer_email").notNull(),
	referrer_phone: text("referrer_phone"),

	candidate_first_name: text("candidate_first_name").notNull(),
	candidate_last_name_initial: text("candidate_last_name_initial").notNull(), // one letter, never a full name
	release_date: date("release_date"),
	supervision_status: text("supervision_status"), // 'in_custody'|'on_licence'|'community'|'no_current_sentence'
	risk_assessment_shared: boolean("risk_assessment_shared")
		.default(false)
		.notNull(),
	notes_encrypted: text("notes_encrypted"), // pgcrypto, key via Vault (dev shim: GUC), Doc 06 §3.10

	status: text("status").default("received").notNull(), // received|triage|accepted|waitlist|declined
	outcome_note: text("outcome_note"),
	assigned_to: uuid("assigned_to"),

	created_at: timestamp("created_at", { withTimezone: true })
		.defaultNow()
		.notNull(),
	updated_at: timestamp("updated_at", { withTimezone: true })
		.defaultNow()
		.notNull(),
});

export const subscribers = pgTable("subscribers", {
	id: uuid("id").default(sql`gen_random_uuid()`).primaryKey(),
	email: text("email").notNull().unique(),
	status: text("status").default("pending").notNull(), // 'pending' | 'confirmed' | 'unsubscribed'
	confirmed_at: timestamp("confirmed_at", { withTimezone: true }),
	unsubscribed_at: timestamp("unsubscribed_at", { withTimezone: true }),
	confirm_token: uuid("confirm_token")
		.default(sql`gen_random_uuid()`)
		.notNull(),
	source: text("source"),
	created_at: timestamp("created_at", { withTimezone: true })
		.defaultNow()
		.notNull(),
});

/* Application profile of auth.users; role copied into the JWT by the access token hook. */
export const users = pgTable("users", {
	id: uuid("id").primaryKey(), // references auth.users(id) in Supabase; plain uuid locally
	full_name: text("full_name").notNull(),
	role: text("role").notNull(), // 'admin' | 'editor' | 'manager' | 'safeguarding' | 'kitchen'
	is_active: boolean("is_active").default(true).notNull(),
	created_at: timestamp("created_at", { withTimezone: true })
		.defaultNow()
		.notNull(),
});
