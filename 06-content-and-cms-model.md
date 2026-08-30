# Off the Hook CIC — Content & CMS Model

**Document 6 of 7.** Every editable piece of content on the site, the exact Supabase schema behind it, the RLS policies that gate it, the RPCs for writes, the storage buckets for media, and the admin UI shape to manage it.

The content model is opinionated: strict typing, no free-form CMS pages, minimum viable admin. Everything that changes has a table. Everything that never changes lives in code.

Reading order:
- Sections 1-2 cover the ORM/typing setup and the shared column conventions.
- Section 3 lists every content type with its schema, admin UI, and RLS.
- Section 4 covers Storage buckets and image conventions.
- Section 5 covers RPC gates.
- Section 6 covers seed data.
- Section 7 covers migration strategy.

---

## 1. Stack choices for the content layer

- **Database.** Supabase Postgres 15.
- **ORM.** Drizzle. Schemas live in `db/schema/*.ts`. Migrations via `drizzle-kit generate` committed to `db/migrations/`.
- **Runtime validation.** Zod schemas colocated with Drizzle tables, one Zod schema per table for insert and select.
- **Data access.** Server Components read directly with `createServerClient` (from `@supabase/ssr`). Writes always go through **SECURITY DEFINER RPCs**, never direct `insert`. This mirrors the elmsync pattern.
- **Types.** `supabase gen types typescript` on every schema change; the generated file is committed and referenced from `lib/db-types.ts`.
- **Auth.** Supabase Auth with email + magic link. Admin invites only; no public sign-up.
- **Row access.** RLS on. Every table has explicit policies. `service_role` never runs in the browser.

## 2. Shared column conventions

Every table has these columns unless a strict reason to omit:

| Column | Type | Purpose |
|---|---|---|
| `id` | `uuid` default `gen_random_uuid()` primary key | Stable ID |
| `created_at` | `timestamptz` default `now()` | Audit |
| `updated_at` | `timestamptz` default `now()` | Trigger keeps this fresh on `update` |
| `created_by` | `uuid` references `auth.users(id)` on delete set null | Audit |
| `updated_by` | `uuid` references `auth.users(id)` on delete set null | Audit |
| `deleted_at` | `timestamptz` nullable | Soft delete for editorial content |
| `is_published` | `bool` default `false` | Content only becomes public when true |
| `published_at` | `timestamptz` nullable | For sort order and scheduled publish |
| `slug` | `text` unique nullable | Only for content that has a URL |
| `order` | `int` nullable | Manual reorder in admin |

An `updated_at` trigger fires on every `update` to keep the column fresh:

```sql
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  new.updated_by = auth.uid();
  return new;
end $$;
```

## 3. Content types

### 3.1 `pages` (marketing pages)

**What this holds.** The five marketing pages that need editable copy at section granularity: `home`, `restaurant`, `academy`, `impact`, `about`. Legal pages (`privacy`, `cookies`, `terms`, `safeguarding`) live in MDX in the repo; they change rarely and legal review requires diffs.

**Why editable at section level, not free-form.** Anne needs to change the tagline, the hero paragraph, the CTA labels, and the pull quotes without a developer. She does not need to insert new sections or reorder them.

**Schema.**

```ts
// db/schema/pages.ts
import { pgTable, uuid, text, jsonb, boolean, timestamptz } from 'drizzle-orm/pg-core';

export const pages = pgTable('pages', {
  id: uuid('id').defaultRandom().primaryKey(),
  slug: text('slug').notNull().unique(),        // 'home', 'restaurant', 'academy', 'impact', 'about'
  title: text('title').notNull(),                // for admin list only
  sections: jsonb('sections').notNull(),         // typed via Zod per page
  is_published: boolean('is_published').default(false).notNull(),
  published_at: timestamptz('published_at'),
  // ...shared columns
});
```

`sections` is a `jsonb` blob validated by a discriminated-union Zod schema, one variant per page. The variant is chosen by `slug`. Example:

```ts
const HomeSections = z.object({
  hero: z.object({
    eyebrow: z.string().max(60),
    headline: z.string().max(120),
    lead: z.string().max(320),
    primary_cta_label: z.string().max(30),
    primary_cta_href: z.string().url().or(z.string().startsWith('/')),
    secondary_cta_label: z.string().max(30),
    secondary_cta_href: z.string().url().or(z.string().startsWith('/')),
    image_id: z.string().uuid(),                // references media
  }),
  what_we_do: z.object({
    heading: z.string().max(80),
    cards: z.array(z.object({
      title: z.string().max(40),
      body: z.string().max(240),
      link_label: z.string().max(30),
      link_href: z.string(),
    })).length(3),
  }),
  featured_story_id: z.string().uuid().nullable(),
  impact_year: z.number().int().gte(2024).lte(2100),
  // ...one entry per section in Doc 4
});
```

**RLS.**

```sql
alter table pages enable row level security;

-- Anyone can read published pages
create policy "read published pages" on pages
  for select using (is_published = true and deleted_at is null);

-- Editors and admins can read all pages
create policy "editors read all pages" on pages
  for select using (auth.jwt() ->> 'role' in ('editor', 'admin'));

-- Direct writes are blocked; all writes go through RPCs
create policy "no direct writes" on pages
  for all using (false);
```

**Admin UI.**
- `/admin/pages` lists the five rows. No "new page" action.
- Clicking a row opens a form with one accordion section per section of the page. Field types match the Zod schema.
- Save with `saveDraft`. Publish with `publishPage`. Both are RPCs.
- Every text field shows a live character counter against the Zod max.

### 3.2 `journey_steps`

**What.** The seven-step journey. Each row is a step.

**Schema.**

```ts
export const journey_steps = pgTable('journey_steps', {
  id: uuid('id').defaultRandom().primaryKey(),
  order: int('order').notNull().unique(),        // 1..7
  title: text('title').notNull(),                // e.g. "Referral"
  subtitle: text('subtitle'),                    // e.g. "Someone opens a door"
  body: text('body').notNull(),                  // 150-300 words
  icon_key: text('icon_key').notNull(),          // maps to a static SVG in code
  outcome_summary: text('outcome_summary'),      // single sentence for detail panel
  is_published: boolean('is_published').default(true).notNull(),
  // ...shared columns
});
```

**RLS.** Read all where `is_published`. Editor/admin read all. No direct writes.

**Admin UI.** Fixed list of seven rows. No add, no delete. Reorder is disabled (order is meaningful). Icon key is a select from a predefined enum.

### 3.3 `impact_metrics`

**What.** The numeric impact figures per year, per metric.

**Schema.**

```ts
export const impact_metrics = pgTable('impact_metrics', {
  id: uuid('id').defaultRandom().primaryKey(),
  metric_key: text('metric_key').notNull(),      // 'meals_served', 'people_trained', etc.
  year: int('year').notNull(),
  value: numeric('value').notNull(),
  unit: text('unit'),                            // '%', 'GBP', null for count
  source_note: text('source_note'),              // free text, appears in tooltip
  order: int('order'),
  is_published: boolean('is_published').default(false).notNull(),
  // shared columns
});
```

Unique index on `(metric_key, year)`.

**Definitions live in code** (`lib/impact-metrics.ts`):

```ts
export const METRIC_DEFINITIONS = {
  meals_served: { label: 'Meals served', format: 'count' },
  people_trained: { label: 'People trained', format: 'count' },
  qualifications_awarded: { label: 'Qualifications awarded', format: 'count' },
  employment_rate: { label: 'In work after 6 months', format: 'percent' },
  wages_paid: { label: 'Wages paid', format: 'gbp' },
  reoffending_rate: { label: 'Reoffending vs national average', format: 'percent-delta' },
} as const;
```

**Admin UI.** Table view grouped by year with an "Add year" action. Each metric is one row with inline edit. Save individually. Publish requires all six metrics filled for that year.

### 3.4 `stories`

**What.** Trainee stories, alumni updates, kitchen notes, and community pieces. Longform.

**Schema.**

```ts
export const stories = pgTable('stories', {
  id: uuid('id').defaultRandom().primaryKey(),
  slug: text('slug').notNull().unique(),
  title: text('title').notNull(),
  strapline: text('strapline'),                  // 1-2 sentences on the card
  author_name: text('author_name'),              // e.g. "Anne Kiragu" or a first name only
  author_role: text('author_role'),              // e.g. "Chef Patron"
  cover_image_id: uuid('cover_image_id'),
  category: text('category').notNull(),          // 'trainee' | 'alumni' | 'kitchen-notes' | 'community'
  body_mdx: text('body_mdx').notNull(),          // MDX with a restricted component set
  pull_quote: text('pull_quote'),
  reading_time_minutes: int('reading_time_minutes'),
  is_published: boolean('is_published').default(false).notNull(),
  published_at: timestamptz('published_at'),
  featured: boolean('featured').default(false).notNull(),  // one at a time
  // shared columns
});
```

**Restricted MDX components** available to editors: `PullQuote`, `Image`, `Callout`, `Divider`. No raw HTML, no arbitrary React. Enforced at render time by an MDX allowlist.

**Anonymity.** Trainee stories may be published under a first name only or "Trainee, 2026". A boolean is not needed; the editor fills `author_name` accordingly.

**RLS.** Read published only. Editors read all. No direct writes.

**Admin UI.** List with filter chips by category, status, featured. Editor is a two-pane: MDX on the left, preview on the right using the same components the site uses. Only one story can be featured at a time; an RPC enforces this.

### 3.5 `menu_items`

**What.** Restaurant menu items grouped by section.

**Schema.**

```ts
export const menu_items = pgTable('menu_items', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),                  // e.g. "Beef shin, mash, greens"
  description: text('description'),              // 1-2 sentences
  price_pence: int('price_pence').notNull(),
  section: text('section').notNull(),            // 'small', 'large', 'sides', 'sweet', 'set-menu'
  order: int('order'),
  allergens: text('allergens').array().notNull().default(sql`'{}'::text[]`), // 14 UK allergens
  is_vegetarian: boolean('is_vegetarian').default(false).notNull(),
  is_vegan: boolean('is_vegan').default(false).notNull(),
  is_available: boolean('is_available').default(true).notNull(),
  is_published: boolean('is_published').default(true).notNull(),
  // shared columns
});
```

**Allergens** are constrained to the UK 14: `celery, gluten, crustaceans, eggs, fish, lupin, milk, molluscs, mustard, tree_nuts, peanuts, sesame, soya, sulphites`. Enforced by Zod, not DB.

**Admin UI.** Grouped list per section with drag-to-reorder and inline availability toggle. Price entered in pounds and pence in the UI, stored as pence in the DB.

### 3.6 `events`

**What.** One-off dinners, workshops, alumni evenings, and takeovers.

**Schema.**

```ts
export const events = pgTable('events', {
  id: uuid('id').defaultRandom().primaryKey(),
  slug: text('slug').notNull().unique(),
  title: text('title').notNull(),
  starts_at: timestamptz('starts_at').notNull(),
  ends_at: timestamptz('ends_at'),
  location: text('location'),
  price_pence: int('price_pence'),               // null = free
  capacity: int('capacity'),
  booked_count: int('booked_count').default(0).notNull(),
  summary: text('summary'),                      // 1-2 sentences
  body_mdx: text('body_mdx'),                    // longer description
  cover_image_id: uuid('cover_image_id'),
  external_ticket_url: text('external_ticket_url'), // if using external booking
  is_published: boolean('is_published').default(false).notNull(),
  // shared columns
});
```

Bookings for events go through `bookings` (see 3.8) or an external ticket URL.

### 3.7 `partners`

**What.** Logos and short descriptions of partners: funders, referral partners, employers, and supporters.

**Schema.**

```ts
export const partners = pgTable('partners', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  category: text('category').notNull(),          // 'funder' | 'referral' | 'employer' | 'supporter'
  logo_image_id: uuid('logo_image_id'),
  website_url: text('website_url'),
  short_note: text('short_note'),
  order: int('order'),
  is_published: boolean('is_published').default(true).notNull(),
  // shared columns
});
```

**Admin UI.** Grouped by category, drag-to-reorder within category. Logo upload with automatic monochrome preview.

### 3.8 `bookings`

**What.** Restaurant table bookings and event bookings.

**Schema.**

```ts
export const bookings = pgTable('bookings', {
  id: uuid('id').defaultRandom().primaryKey(),
  type: text('type').notNull(),                  // 'restaurant' | 'event'
  event_id: uuid('event_id').references(() => events.id, { onDelete: 'set null' }),
  first_name: text('first_name').notNull(),
  last_name: text('last_name').notNull(),
  email: text('email').notNull(),
  phone: text('phone'),
  party_size: int('party_size').notNull(),
  requested_at: timestamptz('requested_at').notNull(), // preferred date/time
  dietary_notes: text('dietary_notes'),
  status: text('status').default('pending').notNull(), // 'pending' | 'confirmed' | 'declined' | 'cancelled' | 'seated' | 'no_show'
  admin_note: text('admin_note'),
  source: text('source'),                        // 'website' | 'phone' | 'walk_in'
  gdpr_consent: boolean('gdpr_consent').default(false).notNull(),
  marketing_consent: boolean('marketing_consent').default(false).notNull(),
  created_at: timestamptz('created_at').defaultNow().notNull(),
  // no soft delete; retained 24 months then hard delete
});
```

**RLS.** Public can insert via a dedicated RPC only. Admin/manager can read/update. Trainees never see this table.

**Admin UI.** Kanban by status with day and week views. Confirming a booking triggers an email via Resend/Postmark.

### 3.9 `enquiries`

**What.** All form submissions that are not bookings: general contact, hire the space, partnership enquiries, employer enquiries, press.

**Schema.**

```ts
export const enquiries = pgTable('enquiries', {
  id: uuid('id').defaultRandom().primaryKey(),
  type: text('type').notNull(),                  // 'contact' | 'hire' | 'partnership' | 'employer' | 'press'
  first_name: text('first_name').notNull(),
  last_name: text('last_name').notNull(),
  email: text('email').notNull(),
  organisation: text('organisation'),
  phone: text('phone'),
  message: text('message').notNull(),
  metadata: jsonb('metadata'),                   // form-specific fields (event date, headcount, roles offered, etc.)
  status: text('status').default('new').notNull(),  // 'new' | 'in_progress' | 'closed' | 'spam'
  admin_note: text('admin_note'),
  gdpr_consent: boolean('gdpr_consent').default(false).notNull(),
  source_page: text('source_page'),              // pathname the enquiry came from
  created_at: timestamptz('created_at').defaultNow().notNull(),
});
```

Metadata schema is validated by Zod on submit, one variant per `type`.

### 3.10 `referrals` (safeguarding-scoped)

**What.** Referrals from probation, prison, and third-sector partners for potential trainees.

**Special handling.** This is the most sensitive table on the site. Never public. RLS locked to the `safeguarding` role only.

**Schema.**

```ts
export const referrals = pgTable('referrals', {
  id: uuid('id').defaultRandom().primaryKey(),

  // Referrer
  referrer_name: text('referrer_name').notNull(),
  referrer_organisation: text('referrer_organisation').notNull(),
  referrer_email: text('referrer_email').notNull(),
  referrer_phone: text('referrer_phone'),

  // Candidate
  candidate_first_name: text('candidate_first_name').notNull(),
  candidate_last_name_initial: text('candidate_last_name_initial').notNull(), // one letter, never full name
  release_date: date('release_date'),
  supervision_status: text('supervision_status'),  // 'in_custody' | 'on_licence' | 'community' | 'no_current_sentence'
  offence_category: text('offence_category'),      // enum from safeguarding policy
  risk_assessment_shared: boolean('risk_assessment_shared').default(false).notNull(),
  notes: text('notes'),                            // encrypted at rest (see 5.2)

  status: text('status').default('received').notNull(), // 'received' | 'triage' | 'accepted' | 'waitlist' | 'declined'
  outcome_note: text('outcome_note'),
  assigned_to: uuid('assigned_to').references(() => auth.users.id),

  created_at: timestamptz('created_at').defaultNow().notNull(),
  updated_at: timestamptz('updated_at').defaultNow().notNull(),
});
```

**RLS.**

```sql
alter table referrals enable row level security;

create policy "safeguarding read" on referrals
  for select using (auth.jwt() ->> 'role' = 'safeguarding');

create policy "safeguarding write" on referrals
  for all using (auth.jwt() ->> 'role' = 'safeguarding')
  with check (auth.jwt() ->> 'role' = 'safeguarding');
```

**Encryption at rest.** `notes` is stored encrypted using `pgcrypto`. The encryption key lives in Supabase Vault and is only accessible to a dedicated SECURITY DEFINER function called by safeguarding-role RPCs. UI shows decrypted only when the safeguarding user is authenticated and viewing.

**Audit log.** Every read of a referral row inserts into `audit_log` (see 3.13).

**Retention.** 36 months after final outcome, then hard delete.

### 3.11 `subscribers`

**What.** Newsletter subscribers.

**Schema.**

```ts
export const subscribers = pgTable('subscribers', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: text('email').notNull().unique(),
  status: text('status').default('pending').notNull(), // 'pending' | 'confirmed' | 'unsubscribed'
  confirmed_at: timestamptz('confirmed_at'),
  unsubscribed_at: timestamptz('unsubscribed_at'),
  source: text('source'),                        // pathname
  created_at: timestamptz('created_at').defaultNow().notNull(),
});
```

**Double opt-in required.** Sign-up creates a `pending` row and sends a confirmation email. Confirming updates to `confirmed`. Only `confirmed` receives the newsletter.

### 3.12 `users` (application-level profile of `auth.users`)

**What.** Extends Supabase Auth with role and display metadata.

**Schema.**

```ts
export const users = pgTable('users', {
  id: uuid('id').primaryKey().references(() => auth.users.id, { onDelete: 'cascade' }),
  full_name: text('full_name').notNull(),
  role: text('role').notNull(),                   // 'admin' | 'editor' | 'manager' | 'safeguarding' | 'kitchen'
  is_active: boolean('is_active').default(true).notNull(),
  created_at: timestamptz('created_at').defaultNow().notNull(),
});
```

Role is copied into the JWT via a `custom_access_token_hook` so RLS policies can read `auth.jwt() ->> 'role'` without an extra query.

### 3.13 `audit_log`

**What.** Every write to a sensitive table, every referral read, every publish action.

**Schema.**

```ts
export const audit_log = pgTable('audit_log', {
  id: uuid('id').defaultRandom().primaryKey(),
  actor_id: uuid('actor_id').references(() => auth.users.id, { onDelete: 'set null' }),
  actor_email: text('actor_email'),
  action: text('action').notNull(),               // 'publish_page', 'read_referral', 'update_referral', 'delete_booking'
  entity_type: text('entity_type').notNull(),
  entity_id: uuid('entity_id'),
  before: jsonb('before'),
  after: jsonb('after'),
  ip_hash: text('ip_hash'),                       // SHA-256 of IP, never plain
  user_agent: text('user_agent'),
  created_at: timestamptz('created_at').defaultNow().notNull(),
});
```

Only `admin` and `safeguarding` roles can read this table. No user can update or delete rows.

## 4. Storage

Two Supabase Storage buckets:

### 4.1 `public-media`

Public bucket for site imagery. Anyone can read via signed URLs; only editors and admins can upload.

Structure:

```
public-media/
  hero/
  stories/{story_slug}/
  menu/{menu_item_id}.jpg
  partners/{partner_id}.svg
  events/{event_slug}/
```

Rules:
- Every image is resized on upload via an Edge Function to produce three variants: 480, 960, 1920 wide, all `.webp`.
- Alt text is mandatory. UI blocks save without it.
- SVG upload is restricted to partner logos only.

### 4.2 `private-media`

Private bucket for safeguarding attachments (rare, but the schema supports referrer-supplied documents). Only accessible via short-lived signed URLs, only from the safeguarding role.

## 5. RPC gates

All writes go through SECURITY DEFINER RPCs. Every RPC:
1. Checks the caller's role via `auth.jwt()`.
2. Validates arguments (Postgres constraints and a Zod check on the client too).
3. Inserts or updates.
4. Writes to `audit_log` where relevant.

### 5.1 Public write RPCs (no auth needed)

- `submit_booking(payload jsonb)` — inserts into `bookings` after Zod validation and rate limit check.
- `submit_enquiry(payload jsonb)` — inserts into `enquiries`. Rate limited by IP hash to 5/hour.
- `subscribe_newsletter(email text, source text)` — inserts pending row, sends confirmation email.
- `confirm_subscription(token text)` — marks confirmed.
- `unsubscribe(token text)` — marks unsubscribed.

Rate limiting is enforced via a lightweight table `rate_limits(key text, window_start timestamptz, count int)` cleaned every 24h.

### 5.2 Editor RPCs

- `save_page_draft(slug text, sections jsonb)` — validates against the section schema and updates the draft.
- `publish_page(slug text)` — flips `is_published` and updates `published_at`. Audit log entry.
- `save_story(payload jsonb)` — insert or update; enforces the "only one featured" rule when `featured=true`.
- `publish_story(id uuid)`.
- `save_menu_item(payload jsonb)`.
- `reorder_menu_items(section text, ordered_ids uuid[])`.
- `save_event(payload jsonb)`.
- `publish_event(id uuid)`.
- `save_partner(payload jsonb)`.

### 5.3 Manager RPCs (restaurant operations)

- `update_booking_status(id uuid, status text, admin_note text)`.
- `export_bookings_csv(from date, to date)` — returns a signed URL to a temporary CSV.

### 5.4 Safeguarding RPCs

- `create_referral(payload jsonb)` — encrypts notes.
- `update_referral(id uuid, patch jsonb)`.
- `read_referral(id uuid)` — decrypts notes, logs read.
- `export_referrals(from date, to date)` — logs export, returns signed URL.

### 5.5 Admin RPCs

- `invite_user(email text, role text, full_name text)`.
- `deactivate_user(id uuid)`.
- `restore_deleted(entity_type text, id uuid)`.

## 6. Seed data

`db/seed.ts` creates:
- 5 rows in `pages` with the copy structure defined in Doc 4.
- 7 rows in `journey_steps` matching Doc 4 section 6.
- 6 rows in `impact_metrics` for the current year.
- 4 rows in `stories`: two trainees, one kitchen note, one community.
- 20 rows in `menu_items` across sections.
- 12 rows in `partners` across categories.
- 3 rows in `events`.
- 1 admin user, 1 editor user, 1 safeguarding user, 1 manager user.
- 6 dummy bookings across statuses (dev environment only).

Seeds are idempotent (upsert on stable slugs / keys). Never runs against `production`.

## 7. Migration strategy

- Every schema change is a Drizzle migration committed to `db/migrations/`.
- Migrations run automatically on Vercel Preview deploys against the Supabase branch database.
- Production migrations require manual approval via Supabase CLI, ideally paired with a rollback SQL file.
- Never edit an existing migration after merge; write a new one.
- Every migration must be tested against a production snapshot in a Supabase branch first for anything touching a table with >1000 rows (won't apply for a while, but the rule is written now so it's not forgotten).

## 8. Admin UI structure

`/admin` is a sidebar layout. Sidebar items scoped by role:

- **Editor sees:** Pages, Journey, Impact, Stories, Menu, Events, Partners.
- **Manager sees:** Bookings, Events (read).
- **Safeguarding sees:** Referrals only.
- **Admin sees:** Everything plus Users, Subscribers, Audit log, Enquiries, Settings.

Every list view has:
- Search (server-side).
- Status filter chips.
- "New" action where allowed.
- Sort by updated_at desc by default.
- Bulk publish/unpublish where relevant.

Every detail view has:
- A form generated from the Zod schema.
- Autosave every 30 seconds to a draft column (`sections_draft`, `body_mdx_draft` where relevant).
- Explicit "Publish" separate from "Save draft".
- "View on site" button that opens the preview URL with a signed token that renders draft state.

## 9. Preview mode

Draft content is invisible to the public. The site supports a preview mode via a signed cookie:
- Editor clicks "Preview" on a page in admin.
- Server issues a short-lived signed JWT cookie.
- Middleware detects the cookie and passes a `preview` flag to server components, which then read the draft column instead of the published one.
- The preview banner sits at the top of the page indicating draft mode, with a one-click exit.

## 10. Localisation

English-only at launch. The schema is structured so future localisation is a `translations` table on strings, not a rewrite:
- Text fields on `pages.sections` are grouped in Zod; a future migration lifts them into a `translations` table keyed by `entity_type`, `entity_id`, `field_path`, `locale`.
- Not building this now; documenting the direction.

## 11. Search

Site search launches with basic filters on `/stories` (category, year) using standard Postgres queries. No global search bar in the header at launch. A `search_index` materialised view can be added later using `pg_trgm` if search demand appears.

## 12. Data retention and GDPR

| Table | Retention | Reason |
|---|---|---|
| `bookings` | 24 months from last update | Restaurant operations |
| `enquiries` | 12 months | Comms hygiene |
| `referrals` | 36 months from outcome | Safeguarding audit |
| `subscribers` | Until unsubscribe + 30 days, then hard delete | GDPR |
| `audit_log` | 24 months | Compliance |
| `stories`, `pages`, `menu_items`, etc. | Indefinite (content) | Editorial |

- **Right of erasure.** A `POST /api/gdpr/erase` route accepts an email and a signed consent, then anonymises `bookings`, `enquiries`, and deletes `subscribers` rows. Log entry kept.
- **Right of access.** A `POST /api/gdpr/export` route emails a JSON export of all rows containing that email.
- **Cookie categories.** Essential, analytics, functional. Marketing category not used at launch.

## 13. Acceptance for this document

Accepted when:
- Every content type on the site has a table listed here.
- Every RPC needed for the admin UI is listed.
- The RLS policy shape is agreed (public-read-published, editor-read-all, safeguarding-scoped, no-direct-write).
- GDPR retention is agreed.

Once accepted, Doc 7 (Build Handoff Notes) is the final lock-in and turns everything above into the concrete files, folders, tokens, and acceptance criteria for the build.

---

**Next document:** `07-build-handoff-notes.md` — the final handoff. Design tokens as CSS variables, Tailwind v4 `@theme` config, component inventory with props and states, environment variables, folder layout, testing gates, and acceptance criteria per page.
