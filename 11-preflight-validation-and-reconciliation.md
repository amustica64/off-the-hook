# Off the Hook CIC — Pre-flight validation and reconciliation

**Document 11 (validation gate). Owner: Abbey (Abiodun Amusa). Prepared before Phase 1.**
Purpose: pressure-test the whole design pack across strategy, information architecture, data model, brand, typography, motion, accessibility, security and delivery, so nothing gets built on a contradiction. Read this before the session-opening ritual in Doc 10.

Lenses applied: senior BA and product design, taste and design craft, UI and UX, motion, engineering and security, and disciplined reasoning (frame, decompose, decide, check).

---

## 1. Headline verdict

The design work itself is strong. The palette, the voice, the motion blueprint, the safeguarding data model and the accessibility discipline are genuinely good, and most of it is not template output. You could ship a beautiful, credible site from this material.

But the pack is not yet a single source of truth, which is the one thing Doc 10 promises it is. It contains two overlapping generations of documents that contradict each other on routes, database tables, roles, phases and a few brand tokens. If a builder starts from Doc 10 alone (as the ritual instructs), they will build routes and a schema that break several "Must" requirements defined in Docs 1 and 6.

So the honest position is: do not lay a brick yet. Spend half a day reconciling the pack into one canonical set, then build. The fixes are mostly decisions, not redesigns.

Severity key: **P0** must be resolved before Phase 1. **P1** should be resolved before the surface it touches is built. **P2** is polish and housekeeping.

---

## 2. Root cause: the pack is two generations stitched together

Docs 01 to 07 each label themselves "Document X of 7" and cross-reference each other cleanly. They form one coherent pack (call it the detailed pack).

Doc 08 labels itself "Document 8 of 9" and points forward to a "Doc 9 (UI/UX Screen Designs)". Doc 10 (the build brief) then treats a nine-document world as canon and adds its own IA, schema and phase plan. Doc 09 does not exist in the project, and Doc 10 is really the tenth file.

The result: Doc 10 is the document the ritual tells the builder to obey first, yet on IA and data model it disagrees with Docs 03 and 06, which are the detailed authorities. Worse, Doc 10's own tie-break rule ("07 wins on engineering, 09 on screens, 08 on brand, 05 on motion") never names Docs 01, 03 or 06, so when Doc 10 and Doc 03 disagree there is no rule to settle it, and the named screen authority (09) is missing. The anti-drift system has a hole in the middle.

Everything below flows from this.

---

## 3. P0 blockers (resolve before Phase 1)

| ID | Finding | Why it blocks | Recommended resolution |
|---|---|---|---|
| P0-1 | Two contradictory sources of truth (Doc 10 vs Docs 01/03/06) | The "no drift" guarantee is already broken by the pack itself | Pick one canonical set, fold the other's good ideas in, retire the loser. See section 7. |
| P0-2 | Database table lists in Doc 10 and Doc 06 are wholesale different | Following Doc 10's list drops tables that Must requirements depend on | Adopt Doc 06 as the schema authority. Add only the genuinely new tables Doc 10 introduces, by decision. |
| P0-3 | Three different route maps for the same site | Nav, redirects and page files will contradict each other | Adopt Doc 03 as the IA authority. Decide /journey vs /academy explicitly. |
| P0-4 | Doc 09 (screen designs) is referenced everywhere but absent | Phase 5 says "read the Doc 9 section before each screen", which cannot be done | Either produce Doc 09 from Doc 04 plus Doc 09 content, or re-anchor Phase 5 to Doc 04 wireframes. |
| P0-5 | Booking form dropped and Stripe donations added at launch (Doc 10) contradicts PRD scope | "Book a table" is a Must; live payments are explicitly phase two | Keep the booking enquiry form at launch. Defer Stripe. Donations are expression of interest only at launch. |
| P0-6 | Role list differs across docs: 2 vs 4 vs 5 roles | RLS policies and middleware are written against a specific role set | Adopt the five roles in Doc 06 and Doc 07. Reconcile Doc 01 and Doc 10 to match. |

### P0-2 in detail (this is the dangerous one)

Doc 06 (with full DDL, RLS and RPCs) defines: pages, journey_steps, impact_metrics, stories, menu_items (with a section field), events, partners, bookings, enquiries, referrals, subscribers, users, audit_log, plus a rate_limits helper.

Doc 10 Phase 4 lists instead: stories, menu_items, menu_sections, academy_cohorts, academy_lessons, impact_metrics, partners, employers, enquiries, referrals, donations, press, pages_meta, redirects.

If a builder follows Doc 10 literally they would drop:
- `bookings`, which breaks user story 4 (Must, book a table) and the restaurant acceptance criteria in Doc 07.
- `journey_steps`, which breaks FR-07 (Must) and the entire Journey timeline, one of the signature features.
- `subscribers`, which breaks the newsletter double opt-in flow.
- `users`, which breaks the whole role model.
- `audit_log`, which breaks FR-16 (Must) and the safeguarding read-logging that the sensitive data model relies on.

Recommendation: Doc 06 wins on schema. Then make a conscious decision on Doc 10's additions: `menu_sections` (probably unnecessary, Doc 06 already models sections as a field), `academy_cohorts` and `academy_lessons` (new, decide if the academy needs its own content types at launch), `press` and `pages_meta` and `redirects` (redirects belong in middleware, meta already lives on pages, press can be enquiries plus a static page). `employers` and `donations` should stay as `enquiries` types until phase two.

### P0-3 in detail (routes)

The clash that matters most: the academy page. Doc 03 (IA authority) and Doc 01 put it at `/journey`, with prospective trainees at `/join`, and treat `/menu`, `/donate`, `/hire` as vanity redirects to the real nested pages. Doc 07 and Doc 10 put the academy at `/academy` with `/academy/apply`, drop `/journey` and `/join` entirely, and treat `/menu`, `/donate`, `/hire` as real top-level pages.

These cannot both be true. The nav in Doc 03 literally lists "The academy" pointing at `/journey`; Docs 07 and 10 have no `/journey` route at all. Pick one URL scheme and make every doc match it. My steer: `/journey` reads warmer and matches the mission language, but `/academy` is clearer for a cold funder. This is a brand call for you, not a technical one.

### P0-5 in detail (booking and donations)

Doc 01 is explicit: "Payment provider not required at launch," donations are expression of interest at launch, Stripe comes in phase two. Doc 10 Phase 6 wires Stripe Checkout for donations at launch and lists no booking form at all. That inverts the PRD twice. The restaurant is described in Doc 01 as carrying "the mission and the money", and "book a table" is the primary restaurant conversion. Keep it. Park Stripe.

---

## 4. P1 findings (resolve before the surface is built)

**P1-1. Pure white ships in the tokens, against the hard rule.** Doc 02 and Doc 08 both state "never use pure white". Doc 07 defines `--bg-elev: #FFFFFF` with the note "cards on cream", and the `@theme` block exposes it as `--color-bg-elev`. That is a concrete violation baked into the token file. Fix: set `--bg-elev` to a near-white cream (for example `#FFFDF8`) or reuse `--cream-50`, and keep `--surface` (cream-100) as the standard card. Otherwise the first card you build breaks the palette.

**P1-2. Success and primary action are the same green.** Docs 07 and 08 set `--status-success` equal to `--forest-600` (#3E5E3A), the exact colour of primary buttons and links. A success message will read as a link. Doc 02 had a distinct success green (#3A6B4C). Restore a distinct success token so feedback and actions do not collide.

**P1-3. Status tokens disagree across docs.** Doc 02: danger #A63A2E, warning #B4832A, success #3A6B4C, plus a `--status-info`. Docs 07 and 08: danger #B4432A, warn #B57F2F, success #3E5E3A, no info, and the name is `--status-warn` not `--status-warning`. Pick one set of hexes and one naming convention before the design system phase.

**P1-4. Heading weight and leading contradict.** Doc 02 sets H1 at weight 600 with display line height 1.02. Docs 08 and 10 set display and H1 at weight 500 with line height 1.12. A jump from 1.02 to 1.12 on the hero is visible, and 500 vs 600 changes the whole tone of the type. Lock one. My steer: 500 with SOFT 30 reads more editorial and matches the logo direction, but confirm it.

**P1-5. Token naming drift.** Docs 02 and 08 reference `--cream-25` and `--forest-500-dark` as if they are tokens; Doc 07 hard-codes those hexes inline and exposes `--forest-500` instead. The logo colour table in Doc 08 will not resolve against Doc 07's tokens. Add `--cream-25` and settle on either `--forest-500` or `--forest-500-dark` as the single dark-theme accent name.

**P1-6. Legal and safeguarding route placement is inconsistent, and this one is compliance.** Doc 03 nests legal under `/legal/*` and includes safeguarding, CIC declaration and modern slavery. Doc 07 flattens to `/privacy`, `/terms`, `/safeguarding`, `/accessibility` and drops CIC declaration and modern slavery. Doc 10 uses a `(legal)` group with privacy, terms, accessibility, cookies and drops safeguarding as a page, even though the safeguarding statement is a Must and is referenced from every audience page. Settle the legal IA and reinstate the safeguarding statement, CIC declaration and (once trading) modern slavery statement.

**P1-7. Three phase plans, and the newest one is very aggressive.** Doc 01 plans phases 0 to 6 across roughly 14 weeks. Doc 07 gives an 11-step build order. Doc 10 compresses the same scope (35 screens, 9 admin surfaces, full Supabase, forms, motion, accessibility, launch) into 18 days for a solo builder. That is roughly a five-fold compression of the PRD's own estimate. Either the 18 days is aspirational, or scope has to be cut. Better to plan honestly now than to declare a phase "done" that is not.

**P1-8. Doc 10's motion timings contradict Doc 05.** Doc 10 Phase 7 quotes 240ms page cross-fade, 260ms drawer, 300ms reveals. Doc 05 (which wins on motion by Doc 10's own rule) uses the duration tokens 200 / 400 / 800 and says there is no full page fade, only the main container. Strike the specific millisecond values from Doc 10 and defer to Doc 05's tokens, or the builder will hard-code a third set of numbers.

**P1-9. Accessibility target wording.** Doc 01 asks Lighthouse Accessibility 95+, Docs 07 and 10 ask 100. WCAG 2.2 AA plus a Lighthouse target of 100 is a fine bar; just make the number consistent so a preview does not "fail" a gate that was never agreed.

---

## 5. P2 findings (polish and housekeeping)

**P2-1. Duplicate files in the project.** There are two art-direction files (`02-art-direction-and-brand.md` and `02-art-direction-and-brand (1).md`) and four duplicated policy PDFs (Data Protection, Conflict of Interest, CIC34, Employer MoU). Verify the pairs are identical, then delete the copies so no one reads a stale version.

**P2-2. The "35 screens" number is unverifiable.** Doc 10 says 26 public plus 9 admin. Doc 07's folder implies about 30 public and 14 admin; Doc 03's tree implies about 25 public and 12 admin. None total 35. Once the IA is reconciled, recount and fix the figure so the definition of done is real.

**P2-3. Inter is the safe choice, and slightly at odds with the positioning.** Doc 02 itself notes Inter is on "every SaaS product" and offers Manrope or Söhne as warmer alternatives. Not a blocker, and Inter pairs well with Fraunces, but if you want the site to feel less like software, this is a conscious call worth making now rather than after the design system is built.

**P2-4. Best Practices target wording.** Doc 01 says 100, Doc 07 says 95+, Doc 10 says 95. Align the number.

---

## 6. What is strong, and should not be touched

So the audit does not read as only negative, here is what is genuinely good and should carry through unchanged:

- **The colour system.** Forest, cream and ink, no gradients, no pure white as a rule, warm and differentiated. This is a real point of view, not a default. Keep it.
- **The motion blueprint (Doc 05).** Detailed, restrained, reduced-motion as a first-class mode, mechanism-revealing rather than decorative. This is the best document in the pack.
- **The safeguarding data model (Doc 06).** RLS on every table, SECURITY DEFINER RPCs for writes, encrypted referral notes in Vault, audit logging on every read of a referral. For a site holding data about prison leavers, this is the right level of care.
- **The voice rules.** Consistent across Docs 02, 08 and 10, and aligned to your own preferences: no em dashes, UK spelling, named people, numbers over adjectives, no charity clichés.
- **The photography ethics.** No prison imagery, no handcuffs, no before and after faces, consent first. Correct and unusually thoughtful.
- **The accessibility spine.** Contrast table with real ratios, visible focus rings, reduced motion honoured, WCAG 2.2 AA baseline.

One design smell inside the strong parts: `--olive-500` fails AA as body text (Doc 08 flags this correctly) and `--copper-500` passes at only 4.6:1. Enforce olive and copper as tag and data colours only, never body, and watch copper at small sizes.

---

## 7. Recommended reconciliation path (half a day, before Phase 1)

The frame: the goal is one pack that cannot contradict itself, built on the strongest material already written.

Recommended decision, with the tradeoff stated plainly:

**Make Docs 01 to 07 the canonical spine (they are the detailed, self-consistent authorities), keep Doc 08 as the brand book, fold Doc 10 down into a build runbook that points at them rather than restating them, and either write Doc 09 or replace its role with Doc 04.**

Why this way rather than "Doc 10 wins": Doc 10 is an excellent operating manual (the ritual, the anti-drift rules, the small-PR discipline, the modern build tricks are all worth keeping), but its IA and schema are a thin restatement that has drifted from the detailed docs and would break Must requirements if followed literally. Keep Doc 10's process, drop Doc 10's data.

The reversal trigger: if you actually prefer the `/academy` IA and the academy content types (cohorts and lessons) as first-class launch features, then Doc 10's world is the one to canonise instead, and Docs 01, 03 and 06 get updated to match. Either direction is fine. What is not fine is leaving both in the pack.

Concrete steps once you have chosen a direction:
1. Lock the URL scheme (one decision: `/journey` and `/join`, or `/academy` and `/academy/apply`).
2. Lock the schema to Doc 06, then add or drop Doc 10's extra tables by decision.
3. Lock the five roles from Doc 06 and 07.
4. Fix the token file: kill pure white, restore a distinct success green, settle status hexes and names, add `--cream-25`, settle the heading weight.
5. Settle the legal IA and reinstate the safeguarding, CIC and modern slavery pages.
6. Decide Doc 09: write it, or point Phase 5 at Doc 04.
7. Rewrite Doc 10 Section 6 (phases) and its motion timings to reference Docs 05, 06 and the reconciled IA instead of restating them, and set an honest timeline.

Do those seven and the pack becomes what it claims to be. Then Phase 1 can start clean.

---

## 8. What this document does not cover

Read honestly, here are the boundaries of this validation:
- I read Docs 01, 02, 03, 05, 06, 07, 08 and 10 in full. I did not line-read Doc 04 (wireframes) or the duplicate 02 file; my "Doc 09 missing" finding stands on the project file list, and Doc 04 exists and can stand in for screen structure.
- I did not open the 30-odd governance and policy PDFs. They look like the CIC's operating documents (safeguarding, data protection, risk register, financial model) rather than build inputs, but the safeguarding and data protection PDFs should be cross-checked against the referral data model in Doc 06 before that form goes live.
- Contrast figures quoted are the ones stated in the docs. I have not independently re-computed every pair, though the ones I spot-checked (ink on cream, forest on cream) are in the right range.
- This is a paper validation. Nothing has been built or tested in a browser yet, because that is the point: fix the paper first.
