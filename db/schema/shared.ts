import { boolean, integer, text, timestamp, uuid } from "drizzle-orm/pg-core";

/*
  Shared column conventions per Doc 06 §2, as factories.
  Builders are stateful in Drizzle: sharing one instance across tables leaks
  constraint names between them, so every call returns fresh builders.
*/

export const audit = () => ({
	created_at: timestamp("created_at", { withTimezone: true })
		.defaultNow()
		.notNull(),
	updated_at: timestamp("updated_at", { withTimezone: true })
		.defaultNow()
		.notNull(),
	created_by: uuid("created_by"),
	updated_by: uuid("updated_by"),
});

export const editorial = () => ({
	...audit(),
	deleted_at: timestamp("deleted_at", { withTimezone: true }),
	is_published: boolean("is_published").default(false).notNull(),
	published_at: timestamp("published_at", { withTimezone: true }),
});

export const orderable = () => ({
	order: integer("order"),
});

export const sluggable = () => ({
	slug: text("slug").notNull().unique(),
});
