# Off the Hook CIC — Build Brief for Claude

**Owner:** Abbey (Abiodun Amusa)
**Editor / builder in Claude:** you (Claude Code, or Claude in Cursor / VS Code)
**Purpose of this document:** the single source of truth for building the Off the Hook CIC website from the design pack. Everything you need to stay on-brief, avoid drift, and ship fast lives in these pages. Read this first, every time.

---

## 0. Read this before you write a single line

You are not designing this project. The design is done. Nine documents in this folder define the product, the brand, the screens, and the build. Your job is to translate those documents into code without inventing anything they do not sanction.

Before any session of work, do the following four things in order. Do not skip.

1. Read `10-build-brief-for-claude.md` (this file) end to end.
2. Read `07-build-handoff-notes.md` in full. It is your engineering contract.
3. Read the section of `09-ui-ux-screen-designs.md` that covers the screen you are about to build.
4. Confirm the current phase against Section 6 of this brief, and state which task from the phase you are on.

If you cannot do all four, stop and ask.

---

## 1. The nine documents and how to use them

The pack lives in `/off-the-hook/` at the repo root. Treat these as read-only reference. If you disagree with something, raise it as a question in the PR description, do not silently override it.

| # | File | When to open it |
|---|------|-----------------|
| 1 | `01-master-prd.md` | Understanding scope, personas, success metrics. Read once at the start of the project, then only when a stakeholder asks "what is this for". |
| 2 | `02-art-direction-and-brand.md` | Before touching any visual element for the first time. Palette, tone, references, do-not-do list. |
| 3 | `03-sitemap-and-ia.md` | Setting up routing and navigation. Read before creating any new route. |
| 4 | `04-page-wireframes.md` | Structuring a page you have not built before. Wireframes describe layout intent, not pixel positions. |
| 5 | `05-motion-blueprint.md` | Any time you add motion, transition, or interaction. If a component moves, this file governs how. |
| 6 | `06-content-and-cms-model.md` | Setting up Supabase tables, migrations, seed data, or CMS fields. Read before any schema change. |
| 7 | `07-build-handoff-notes.md` | The engineering bible. Read in full at project start. Refer back at every phase boundary. |
| 8 | `08-brand-book.md` | Logo, colour tokens, type, photography, applications. Read once at start, refer back before any brand-facing surface (nav, footer, share cards, favicons, emails). |
| 9 | `09-ui-ux-screen-designs.md` | Screen-by-screen text mockups for all 35 screens. This is the ground truth for what each screen contains. Read the relevant section immediately before building that screen. |

Rule: if two documents disagree, `07-build-handoff-notes.md` wins on engineering choices, `09-ui-ux-screen-designs.md` wins on screen content, `08-brand-book.md` wins on brand surface, and `05-motion-blueprint.md` wins on motion. If those four disagree with each other, stop and ask.

---

## 2. The stack, locked

Do not substitute any of the below without explicit approval. The stack is chosen for speed, cost, and my familiarity, and every doc assumes it.

**Framework and language**
- Next.js 15 (App Router, Server Components by default)
- React 19
- TypeScript strict mode
- Node 20+

**Styling and UI**
- Tailwind CSS v4 with `@theme` CSS-first tokens
- shadcn/ui (copy in, do not depend on a registry)
- Radix primitives (through shadcn)
- Lucide icons
- Framer Motion for motion
- next-themes for light/dark

**Data and backend**
- Supabase: Postgres, Auth, Storage, Edge Functions
- Row Level Security on every table
- `SECURITY DEFINER` RPCs for any privileged write
- Drizzle ORM for typed queries, Zod for validation
- TanStack Query for client-side data hydration when needed

**Fonts (self-hosted, not from Google CDN)**
- Fraunces Variable (OFL) — display, weight 500, SOFT 30
- Inter Variable (OFL) — text
- Installed via `@fontsource-variable/fraunces` and `@fontsource-variable/inter`

**Tooling**
- Biome instead of ESLint + Prettier
- Vitest for unit tests
- Playwright for e2e
- pnpm as the package manager
- GitHub for version control

**Hosting and services**
- Vercel for hosting
- Resend for transactional email
- Sentry for error tracking
- PostHog EU for product analytics
- Cloudflare Turnstile on forms

Anything not on this list is not in the stack. If you need something outside it, ask first.

---

## 3. The palette, locked

You may not introduce new colours. Use only these CSS custom properties, defined in `app/globals.css` per Doc 7.

```
--ink-900:   #1F1912
--ink-700:   #3D2F22
--ink-500:   #6B5A45
--cream-50:  #FAF5E9
--cream-100: #F3EBD8
--cream-200: #E7DBBF
--cream-350: #CFC0A0
--forest-600: #3E5E3A   (primary)
--forest-700: #2E4A2C   (hover)
--forest-500: #5B7C56   (dark theme primary)
--forest-100: #DDE7D6   (wash)
--olive-500: #7A8A4A    (education tags)
--copper-500: #9C6A3E   (qualifications)
--night-950: #161210    (dark theme background)
--night-900: #221B14    (dark theme surface)
```

Anti-rules, hard: no pure white, no red or orange except where the copper token allows warm accents, no gradients, no emerald or mint, no purple. If a component wants a colour that is not in this list, you are building it wrong.

---

## 4. Typography, locked

- Display: Fraunces Variable, weight 500, SOFT 30, tracking -0.01em, sentence case
- Text: Inter Variable, weight 400 body / 500 UI, tracking 0
- Fluid clamps (already in Doc 7): display 44→84px, h1 34→56, h2 28→40, body 16→17, measure 68ch

Do not import Google Fonts. Do not use system-ui. Do not add a third face without approval.

---

## 5. Voice, locked

The site copy has been written in the tone of the `human-voice-writer` skill. When you touch any user-facing string, keep the tone. Non-negotiables:

- No em dashes. Ever. Use commas, full stops, colons, or brackets.
- No emoji, icons, or decorative glyphs in copy.
- No jargon: no seamless, robust, leverage, unlock, empower, transformative, innovative, disruptive, world-class, mission-critical.
- No AI tells: no delve, no tapestry, no "in today's fast-paced world", no "it's important to note that".
- UK spelling: organise, colour, realise, behaviour.
- Short sentence, long sentence, short sentence. Vary rhythm.
- Sentence-case headings, not title case.

Every string you write goes through this filter before you commit it.

---

## 6. Phased build plan (11 phases, in order)

Follow phases in order. Do not jump ahead. Each phase has a clear entry gate, a scope, and a definition of done. If a phase cannot close, stop and ask. Do not paper over gaps.

### Phase 1 — Repo and tooling (Day 1, ~2 hours)

**Entry gate:** none. This is the start.

**Scope:**
- `pnpm create next-app@latest` with App Router, TypeScript, Tailwind, no src dir.
- Add Biome, replace ESLint config from Next.
- Install shadcn/ui with the cream/forest tokens from Doc 7.
- Install Framer Motion, next-themes, Lucide, Fontsource Fraunces + Inter, TanStack Query, Zod, Drizzle, Supabase JS.
- Copy the `@theme` block from Doc 7 § 4 verbatim into `app/globals.css`.
- Configure Biome, Vitest, Playwright base configs.
- Set up GitHub repo, protected main, PR template that references this brief.
- Vercel project connected, preview deploys on every PR.

**Done when:** a blank cream page renders at `/` with the tagline "Real work. Real qualifications. Real chances." in Fraunces at the display clamp size, both light and dark themes toggle correctly, and a Playwright smoke test passes on Vercel preview.

### Phase 2 — Design system primitives (Days 2–3)

**Entry gate:** Phase 1 done.

**Scope (from Doc 7 § 6):**
- Layout: `PageShell`, `Section`, `Container`, `Grid`, `Stack`.
- Type: `Display`, `H1`, `H2`, `H3`, `Body`, `Small`, `Kicker`.
- Buttons: `Button` (primary, secondary, ghost), `LinkButton`, `IconButton`.
- Forms: `Field`, `Input`, `Textarea`, `Select`, `Checkbox`, `RadioGroup`, `HelperText`, `ErrorText`.
- Cards: `Card`, `MediaCard`, `QuoteCard`, `StatCard`.
- Utility: `ThemeToggle`, `SkipLink`, `Announce` (aria-live region).

Every primitive:
- lives in `components/ui/`
- ships with a Storybook-style demo route under `/dev/components/[name]` (dev-only, gated by env)
- has a Vitest snapshot for both themes
- passes axe accessibility checks

**Done when:** the `/dev/components/index` page renders every primitive in both themes with no console warnings, and Playwright captures screenshots that match the moodboard and brand book tone.

### Phase 3 — App shell and navigation (Day 4)

**Entry gate:** Phase 2 done.

**Scope (from Doc 3 and Doc 9 § App shell):**
- Root layout with header, footer, skip link, theme toggle.
- Header: logo (use Logo Direction B monogram + wordmark, from `/public/brand/`), primary nav, mobile drawer.
- Footer: sitemap, contact, legal links, CIC number placeholder, socials.
- 404 and 500 pages per Doc 9 cross-cutting states.
- Middleware for locale (default `en-GB`, no other locales yet, but scaffold for it).

**Done when:** every route stub renders inside the shell, keyboard navigation works, the mobile drawer opens and closes with the motion spec from Doc 5.

### Phase 4 — Supabase schema and RLS (Days 5–6)

**Entry gate:** Phase 3 done.

**Scope (from Doc 6 in full):**
- Create Supabase project, link to repo.
- Write Drizzle schema for every table in Doc 6 § 3: `pages`, `journey_steps`, `impact_metrics`, `stories`, `menu_items`, `events`, `partners`, `bookings`, `enquiries`, `referrals`, `subscribers`, `users`, `audit_log`, plus `rate_limits` from Doc 6 § 5.1.
- Migrations committed and applied to Supabase.
- RLS policies on every table (Doc 6 lists the read/write shape per table).
- `SECURITY DEFINER` RPCs for privileged writes, named exactly as Doc 6 § 5 names them. The public gates are `submit_booking`, `submit_enquiry`, `subscribe_newsletter`, `confirm_subscription` and `unsubscribe`; the safeguarding intake is `create_referral`, not `submit_referral`.

> **Corrected 31 August 2026.** This phase previously listed `menu_sections`, `academy_cohorts`, `academy_lessons`, `employers`, `donations`, `press`, `pages_meta` and `redirects`, none of which exist in Doc 6 § 3 or in the build, and omitted eight tables that do. It also named `submit_referral` and `record_donation`. Doc 6 is the authority on schema under § 1 of this brief, so this section was the stale side. `record_donation` is removed rather than renamed: see Phase 6.
- Seed script that populates a realistic dev dataset (no lorem ipsum, use the copy from Doc 9).

**Done when:** `pnpm db:migrate` and `pnpm db:seed` succeed on a fresh Supabase project, RLS blocks anonymous writes, and a Playwright test confirms an anon user can read stories but not insert one.

### Phase 5 — Public pages, static first (Days 7–10)

**Entry gate:** Phase 4 done.

Build in this order, one per session. Read the matching section of Doc 9 before each screen.

1. Home (`/`)
2. About (`/about`)
3. Restaurant (`/restaurant`)
4. Menu (`/menu`)
5. Academy (`/academy`)
6. Impact (`/impact`)
7. Stories index (`/stories`) and story detail (`/stories/[slug]`)
8. Partners (`/partners`)
9. Support (`/support`)
10. Donate (`/donate`)
11. Hire (`/hire`)
12. Contact (`/contact`)
13. Press (`/press`)
14. Legal pages (`/privacy`, `/terms`, `/accessibility`, `/cookies`)

**For every page:**
- Server Component by default. Client components only where interaction demands it.
- Pull content from Supabase where the CMS model allows, hard-code the rest.
- Use the hero visual from `/public/heroes/` matching the page.
- Meta tags, Open Graph card, JSON-LD structured data per Doc 7 § 12.
- Lighthouse score target: 95+ on Performance, 100 on Accessibility, Best Practices, SEO.

**Done when:** every public route in Doc 3 exists, renders with real content, and passes Lighthouse in preview.

### Phase 6 — Forms and submissions (Days 11–12)

**Entry gate:** Phase 5 done.

**Scope:**
- Referral form (referral partners) → `submit_referral` RPC → email via Resend.
- Enquiry form (general contact) → `submit_enquiry` RPC → email.
- Employer enquiry (hire) → `submit_enquiry` with `type='employer'`.
- Donation intent form → an expression of interest stored in `enquiries` with `type='donation'`. No Stripe, no webhook, no `record_donation` RPC and no `donations` table.

> **Corrected 31 August 2026.** This line previously specified Stripe Checkout, a webhook and a `record_donation` RPC. Doc 12 rules Stripe out of the launch in favour of an expression of interest, and Doc 9 § 3.18 builds the donate page that way, with a GiftAid tick that records intent only and a bank details fallback in the confirmation. There is no `donations` table in Doc 6 § 3 and none should be created. Stripe returns as a phase two decision, not a launch requirement.
- Newsletter signup → Resend audience.
- Every form:
  - Zod schema shared client/server
  - Server action with progressive enhancement
  - Cloudflare Turnstile on public forms
  - Success and error states per Doc 9 cross-cutting states
  - Confirmation email templated per Doc 8 email applications

**Done when:** every form submits end to end in preview, emails arrive, Supabase rows appear, and Turnstile blocks a script-submitted request.

### Phase 7 — Motion pass (Day 13)

**Entry gate:** Phase 6 done.

**Scope (from Doc 5 in full):**
- Page transitions: 240ms cross-fade, respect `prefers-reduced-motion`.
- Scroll-in reveals on section headings and hero visuals, single fade-and-rise, 300ms, once.
- Nav drawer: slide from right, 260ms, ease-out.
- Button hover: subtle background shift only, no scale.
- Journey timeline: staggered reveal per step, 80ms between steps.
- Any motion that violates the "motion shows mechanism" rule from Doc 5 gets cut.

**Done when:** Doc 5 § motion checklist is 100% ticked, `prefers-reduced-motion` disables every non-essential motion, and Playwright screenshots at reduced-motion match static screenshots.

### Phase 8 — Admin console (Days 14–15)

**Entry gate:** Phase 7 done.

**Scope (from Doc 9 § 4, which specifies fourteen admin surfaces):**

> **Reconciled 31 August 2026. Doc 9 wins, so the number is fourteen, not nine.**
> Section 1 of this brief already makes Doc 9 the authority on screen content
> and inventory, and Doc 9 § 4 is headed "Admin surfaces (14)". The nine below
> were a partial list: they omit the surfaces Doc 6 § 8 also requires, which are
> the sidebar entries for pages, journey, events, bookings, subscribers, users
> and the audit log, and Doc 7 § 2's folder layout lists those same routes under
> `app/admin/`. Three documents agree on the larger set and only this line
> disagreed. The two day estimate below was scoped against nine and needs
> re-estimating against fourteen before Phase 8 is planned.
- Auth gate: Supabase Auth, magic link only, roles `admin` and `editor`.
- `/admin` dashboard
- `/admin/stories` list and edit
- `/admin/menu` list and edit
- `/admin/academy` cohorts and lessons
- `/admin/impact` metrics
- `/admin/partners`
- `/admin/enquiries` inbox
- `/admin/media` uploads to Supabase Storage
- `/admin/settings`

Every admin write goes through a `SECURITY DEFINER` RPC. No direct table writes from the client.

**Done when:** an admin can create a story, publish it, edit menu items, and view enquiries, all from the admin console with no Supabase Studio access needed.

### Phase 9 — Analytics, observability, legal (Day 16)

**Entry gate:** Phase 8 done.

**Scope:**
- PostHog EU wired, cookie banner respects consent per Doc 7 § 12.
- Sentry wired for server and client.
- Robots, sitemap, RSS feed for stories.
- Cookie policy live, privacy policy live, accessibility statement live.
- Rate limiting on form endpoints via Upstash or Vercel middleware.

**Done when:** Sentry captures a test error from a `/dev/test-error` route, PostHog receives a pageview, sitemap validates, and rate limiting rejects a burst above the threshold.

### Phase 10 — Content load (Day 17)

**Entry gate:** Phase 9 done.

**Scope:**
- Load real stories, real menu items, real impact metrics, real partner logos.
- Photography: use the 8 hero visuals from the pack for now, replace with real shoots later.
- Proof pass: every string in the site reviewed against the voice rules in Section 5 of this brief.

**Done when:** the site reads like a real restaurant, not a demo.

### Phase 11 — Launch prep (Day 18)

**Entry gate:** Phase 10 done.

**Scope:**
- Custom domain wired, DNS verified, HTTPS live.
- 301 redirects for any legacy URLs (Doc 6 `redirects` table).
- Manual QA against the sign-off checklist in Doc 7 § 16.
- Manual QA against every screen sign-off checklist in Doc 9.
- Load test with k6, target 200 concurrent readers on the homepage without a p95 above 800ms.

**Done when:** the sign-off checklists in Doc 7 and Doc 9 are 100% ticked, and I say go.

---

## 7. How to work with Claude, without drift

Drift is what happens when a model invents solutions the docs already answered. It shows up as new palettes, new fonts, new libraries, renamed components, or "modernised" code that quietly breaks the design system. Every rule below exists to stop it.

### 7.1 Session opening ritual (do this every session)

Paste this into Claude at the start of every session:

> Read `/off-the-hook/10-build-brief-for-claude.md` in full. Then read `/off-the-hook/07-build-handoff-notes.md`. State the current phase (from Section 6 of the brief), the task within that phase you are about to do, and the exact documents you will consult for it. Do not write any code until I approve the plan.

Do not skip this. It is the single most valuable habit in the whole workflow.

### 7.2 Skills to load, always

At the start of every session, load these skills. If you use Claude Code, put them in `.claude/skills/`. If you use the Claude app, load them via the skill tool.

- `human-voice-writer` — every user-facing string passes through this.
- `senior-ba-product-designer` — for edge cases and interpretation of the docs.

Any other skill loads on demand, matched to the phase.

### 7.3 The plan-then-code rule

For any task longer than a single file change, Claude must produce a plan first, in this shape:

```
Task: [one sentence]
Docs consulted: [list]
Files to touch: [list]
Files to create: [list]
Approach: [3–7 bullets]
Risks: [what could break, and what you assume]
Definition of done: [testable]
```

No code until the plan is approved. This one habit removes 80% of drift.

### 7.4 Ask, do not assume

If a decision is not in the docs, do not invent an answer. Ask. Examples of things to ask about, not decide:

- New copy that is not in Doc 9.
- New route not in Doc 3.
- New table or column not in Doc 6.
- Any library not in Section 2 of this brief.
- Any new colour, font, or motion pattern.
- Any deviation from a doc, even a small one.

The right response to ambiguity is a question, not code.

### 7.5 Small PRs, one screen at a time

- One PR per screen in Phase 5.
- One PR per form in Phase 6.
- One PR per admin surface in Phase 8.
- PR title format: `Phase X · [screen/component]`.
- PR description references the doc sections it implements.
- No PR bigger than 400 lines of diff unless it is a schema migration.

### 7.6 What good looks like at the end of a session

At the end of every session, Claude produces a short close-out note in this shape:

```
Phase: [x]
Task completed: [what]
Files changed: [list]
Docs referenced: [list]
Left for next session: [what is next in the phase]
Open questions: [anything I need to answer]
```

Save it into `/off-the-hook/logs/YYYY-MM-DD-session.md`. Over time this becomes a build journal.

### 7.7 Anti-patterns to reject on sight

If Claude does any of these, stop and reset the session:

- Rewrites a design token to something not in Doc 7.
- Adds a colour, font, or library not in Section 2 or Section 3.
- Uses `<div className="flex flex-col ...">` when the primitive `<Stack>` exists.
- Silently changes copy that lives in Doc 9.
- Skips writing a test that the phase requires.
- Ignores `prefers-reduced-motion`.
- Uses `any` in TypeScript.
- Commits a `.env` value.
- Writes a client component when a server component would do.
- Introduces a state manager beyond React state + TanStack Query.
- Uses an em dash. In code comments, docs, or copy.

---

## 8. Modern build tricks used deliberately

These are the accelerators. Use all of them. None of them replaces the docs.

### 8.1 Server Components first

Default every page and layout to a Server Component. Only reach for `"use client"` when a component genuinely needs state, an effect, or a browser API. This alone cuts bundle size and speeds Lighthouse.

### 8.2 Server actions for forms

No API routes for form submissions. Use Next.js Server Actions bound to `<form action={fn}>`. Progressive enhancement is free, and the Zod schema is shared between client validation and server execution.

### 8.3 Drizzle end to end

Every DB read and write goes through Drizzle. This gives you types across the boundary without a code-gen step. No raw SQL except in migrations.

### 8.4 shadcn copied in, not imported

shadcn components live in `components/ui/`. You own them. When Doc 7 needs a variant shadcn does not ship, you edit the file. No dependency on a component registry.

### 8.5 CSS-first tokens

Tailwind v4 `@theme` block is the single source of colour and type tokens. Do not scatter tokens across component files. If a value is not a token, it is a mistake.

### 8.6 next-themes with `data-theme`

Themes swap by toggling `data-theme="dark"` on `<html>`. Every colour is `var(--...)`. No `dark:` variants sprinkled across components.

### 8.7 Route groups for admin

Admin lives under `app/(admin)/admin/...` in a route group with its own layout. This isolates auth, style, and metadata without polluting the public shell.

### 8.8 Content collections from Supabase, revalidated on write

Public pages read from Supabase with `revalidateTag()` triggered by admin writes. No cron, no rebuild-on-write pain.

### 8.9 Playwright screenshot diffs, per phase

At each phase gate, Playwright takes a full-page screenshot of every route in both themes and diffs against the previous baseline. Any unexpected visual change fails the check. This is your regression net.

### 8.10 Biome for everything

One tool for lint and format. Faster than ESLint + Prettier. `pnpm check` runs it in CI. If Biome complains, fix it. Do not disable rules.

---

## 9. Directory layout, canonical

Follow this exactly. Doc 7 § 2 has the same layout, this is a compressed reminder.

```
/
├─ app/
│  ├─ (public)/
│  │  ├─ page.tsx                    # home
│  │  ├─ about/page.tsx
│  │  ├─ restaurant/page.tsx
│  │  ├─ menu/page.tsx
│  │  ├─ academy/page.tsx
│  │  ├─ impact/page.tsx
│  │  ├─ stories/page.tsx
│  │  ├─ stories/[slug]/page.tsx
│  │  ├─ partners/page.tsx
│  │  ├─ support/page.tsx
│  │  ├─ donate/page.tsx
│  │  ├─ hire/page.tsx
│  │  ├─ contact/page.tsx
│  │  ├─ press/page.tsx
│  │  └─ (legal)/{privacy,terms,accessibility,cookies}/page.tsx
│  ├─ (admin)/
│  │  └─ admin/... (nine screens)
│  ├─ layout.tsx
│  ├─ globals.css                    # @theme lives here
│  ├─ not-found.tsx
│  └─ error.tsx
├─ components/
│  ├─ ui/                            # design system primitives
│  ├─ site/                          # public site composites
│  ├─ admin/                         # admin composites
│  └─ motion/                        # framer-motion helpers
├─ lib/
│  ├─ db/                            # drizzle schema, client
│  ├─ supabase/                      # client and server helpers
│  ├─ auth/
│  ├─ email/                         # resend templates
│  ├─ analytics/
│  └─ zod/                           # shared schemas
├─ public/
│  ├─ brand/                         # logos, favicons
│  ├─ heroes/                        # 8 hero visuals
│  ├─ moodboard/
│  └─ fonts/                         # only if not using fontsource
├─ off-the-hook/                     # the design pack (this folder)
├─ tests/
│  ├─ e2e/                           # playwright
│  └─ unit/                          # vitest
├─ .claude/
│  └─ skills/                        # human-voice-writer, senior-ba-product-designer
├─ biome.json
├─ drizzle.config.ts
├─ playwright.config.ts
├─ tsconfig.json
├─ package.json
└─ README.md
```

---

## 10. What to build first, literally

If you have never opened the repo before, do exactly this, in order. It is the fastest way to feel the design is real.

1. `pnpm create next-app@latest off-the-hook --typescript --tailwind --app --no-src-dir --import-alias "@/*"`
2. `cd off-the-hook && git init && gh repo create --private`
3. Copy the whole `/off-the-hook/` folder from the design pack into the repo root.
4. `pnpm add @fontsource-variable/fraunces @fontsource-variable/inter framer-motion next-themes lucide-react zod`
5. Paste Doc 7 § 4 `@theme` block into `app/globals.css`.
6. Import Fraunces and Inter in `app/layout.tsx`.
7. Replace `app/page.tsx` with a single centred `<h1 className="font-display">Real work. Real qualifications. Real chances.</h1>` on `bg-cream-50 text-ink-900`.
8. `pnpm dev`, open `localhost:3000`.
9. If it looks like the moodboard, you are on the right road. If it does not, stop and fix the tokens before writing anything else.
10. Commit as `Phase 1 · repo baseline`. Open PR. Merge.

You are now in Phase 1. Read Section 6 and continue.

---

## 11. Definition of done for the whole project

The site ships when all of the below are true.

- All 26 public screens live, matching Doc 9.
- All 9 admin screens live, matching Doc 9.
- Every sign-off checklist in Doc 7 § 14 is ticked.
- Every sign-off checklist in Doc 9 (per-screen) is ticked.
- Lighthouse 95+ Performance, 100 Accessibility on every public route.
- All forms submit end to end and emails arrive.
- Sentry, PostHog, cookie banner, sitemap, RSS, robots all live.
- Custom domain live over HTTPS.
- k6 load test passes at 200 concurrent readers, p95 under 800ms on the homepage.
- I have reviewed and approved.

Nothing ships until every one of those is green.

---

## 12. If you get stuck

- Re-read the doc that owns the decision.
- If the doc does not answer it, ask me.
- Do not invent.
- Do not "modernise" past the stack in Section 2.
- Do not add libraries.
- Do not touch tokens.
- Do not use em dashes.

Small, careful, boring work compounds into a site that reads like it was made by people who cared. That is the whole brief.
