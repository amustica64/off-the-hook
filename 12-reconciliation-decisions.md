# Off the Hook CIC — Reconciliation decisions

**Document 12 (decisions ledger). Owner: Abbey (Abiodun Amusa). Follows Doc 11 (pre-flight validation).**
Purpose: turn the validation findings into locked calls so the pack has one source of truth. This ledger overrides any doc it names. Read it straight after Doc 10, and before any build session.

Two calls made by Abbey on 4 August 2026:
1. When docs clash on routes or tables, the detailed pack (Docs 01 to 07) wins.
2. The training programme lives at `/journey`, prospective trainees at `/join`.

Everything below applies those two calls to every P0 and P1 in Doc 11.

---

## 1. The authority order, locked

From now on the pack has one hierarchy. Higher wins.

1. **Docs 01 to 07** are the canonical spine. They are detailed, self-consistent, and now the source of truth for scope, IA, wireframes, motion and data.
2. **Doc 08 (brand book)** is valid for brand surfaces (logo, photography, applications), but where its tokens disagree with Doc 02 or Doc 07, Docs 02 and 07 win.
3. **Doc 10 (build brief)** keeps its process only: the session ritual, the anti-drift rules, the plan-then-code habit, the small-PR discipline, the modern build tricks. Its IA, its table list, its role list, its phase scope and its motion timings are superseded by the docs below and must not be followed as written.
4. **Doc 09** does not exist. Until it does, Doc 04 (wireframes) is the screen authority. See section 8.

If two canonical docs still clash after this ledger, stop and ask. Do not invent.

---

## 2. Routes, locked (resolves P0-3)

The IA is Doc 03. The academy is `/journey`, trainees are `/join`. Every `/academy` route in Docs 07 and 10 is struck.

Canonical public tree (from Doc 03):

```
/                         home
/about  /about/team
/restaurant  /restaurant/menu  /restaurant/events  /restaurant/book
/journey                  the academy: how training works
/impact
/stories  /stories/[slug]
/partners  /partners/funders  /partners/referrals  /partners/employers  /partners/education
/join                     for prospective trainees
/support  /support/donate  /support/volunteer
/contact
/news  /news/[slug]
/legal/privacy  /legal/cookies  /legal/safeguarding  /legal/accessibility  /legal/cic-declaration  /legal/modern-slavery
/brand                    unlinked, press and partners
/design                   unlinked, living style guide
/admin/*                  auth-gated
```

Vanity redirects (middleware, not pages, from Doc 03 section 15): `/book`, `/menu`, `/refer`, `/fund`, `/hire`, `/donate`, `/volunteer`, `/train`. These are 308 redirects to the real nested pages. They are never top-level pages, which is where Doc 10 had them wrong.

Primary nav, six items (Doc 03 section 2): The restaurant, The academy (to `/journey`), Our impact, For partners (dropdown), About, Support us. Plus a Book a table button.

---

## 3. Database schema, locked (resolves P0-2)

The schema is Doc 06 in full. These tables are canonical:

`pages`, `journey_steps`, `impact_metrics`, `stories`, `menu_items` (section is a field, no separate table), `events`, `partners`, `bookings`, `enquiries`, `referrals`, `subscribers`, `users`, `audit_log`, plus the `rate_limits` helper.

Doc 10's extra tables are handled as follows:
- `menu_sections`: not created. Section stays a field on `menu_items`, as Doc 06 defines.
- `academy_cohorts`, `academy_lessons`: not created at launch. The academy is content on `/journey` driven by `journey_steps`. If real cohort or lesson management is needed, it is a phase-two decision with its own tables.
- `employers`: not a table. Employer enquiries use `enquiries` with `type='employer'`.
- `donations`: not a table at launch. Donations are expression of interest via `enquiries`. A real donations table arrives with Stripe in phase two.
- `press`: not a table. Press is a static page plus `enquiries` with `type='press'`.
- `pages_meta`: not a table. Meta lives on `pages` and in per-route metadata.
- `redirects`: not a table. Redirects live in middleware and `next.config`.

Nothing that a Must requirement depends on gets dropped: `bookings`, `journey_steps`, `subscribers`, `users` and `audit_log` all stay.

---

## 4. Roles, locked (resolves P0-6)

Five roles, from Docs 06 and 07: `admin`, `editor`, `manager`, `safeguarding`, `kitchen`.

- Doc 01's `viewer` role is dropped. It appears in no RLS policy.
- Doc 10's two-role model (admin, editor only) is superseded.
- RLS and middleware read `auth.jwt() ->> 'role'`. Referrals are `safeguarding` and `admin` only. Bookings are `manager` and `admin`. Editors get content, not bookings or referrals.

---

## 5. Booking and payments, locked (resolves P0-5)

- The restaurant booking enquiry form stays at `/restaurant/book`, writing to `bookings` via the `submit_booking` RPC. This is a Must and the primary restaurant conversion.
- Stripe is deferred to phase two, per Doc 01. No Stripe Checkout at launch.
- Donations at launch are expression of interest only, through `enquiries`. Doc 10's launch-time Stripe donation flow is struck.

---

## 6. Token fixes, locked (resolves P1-1 to P1-5)

Apply these to `app/globals.css` when the token file is written in Phase 1. They override Doc 07 section 3 where they differ.

- **No pure white.** `--bg-elev` must not be `#FFFFFF`. Set it to `#FFFDF8` (a near-white cream) or reuse `--cream-50`. This honours the hard rule in Docs 02 and 08.
- **Distinct success colour.** `--status-success` is `#3A6B4C` (from Doc 02), not `--forest-600`. Success must not look identical to a primary button or link.
- **One status set, one naming convention.** Use: `--status-danger #A63A2E`, `--status-warning #B4832A`, `--status-success #3A6B4C`, `--status-info #3A5A6B` (Doc 02 values). Name them `--status-warning`, not `--status-warn`. Update Docs 07 and 08 to match.
- **Add the missing token.** Define `--cream-25 #F7F1DF`. The dark theme text and the reverse logo both reference it.
- **One dark accent name.** Use `--forest-500` as the single dark-theme accent token (`#5B7C56`). Retire the `--forest-500-dark` alias; update the Doc 08 logo table to say `--forest-500`.
- **Heading weight, provisional lock:** display and H1 at weight 500 with SOFT 30, per Docs 08 and 10 and the logo direction. Doc 02's H1 at 600 is superseded. Reversal trigger: if the hero feels too light against the photography once real images land, revisit at weight 550 to 600. One line to change.
- **Heading leading, lock:** use Doc 07's `--lh-tight 1.12` and `--lh-heading 1.2`. Doc 02's 1.02 to 1.10 values are superseded.

Olive and copper stay tag and data colours only, never body text (Doc 08 contrast rule). Copper is watched at small sizes.

---

## 7. Legal and motion, locked (resolves P1-6 and P1-8)

**Legal IA.** Nested under `/legal/*` per Doc 03. The launch set is privacy, cookies, safeguarding, accessibility, cic-declaration, and terms. Modern slavery is added the moment the CIC starts trading. The safeguarding statement is reinstated as a page and is linked from every audience page, because it is a Must and a compliance item. Doc 07's flat legal routes and Doc 10's dropped safeguarding page are both superseded.

**Motion.** Doc 05 is the only motion authority. Its duration tokens (200, 400, 800) and two curves govern everything. Doc 10's specific millisecond values (240, 260, 300) are struck. Page changes fade the main container only, over `--dur-fast`, exactly as Doc 05 section 3.5 states. There is no full-page fade at launch.

---

## 8. The missing screen doc (resolves P0-4)

Doc 09 (UI/UX screen designs) is referenced across the pack but is not in the project. Until it exists:

- Phase 5 is re-anchored to Doc 04 (wireframes) for screen structure, plus the relevant page section in Docs 02, 03 and 06 for content and data.
- Doc 10's instruction to read a Doc 09 section before each screen is replaced by: read the Doc 04 wireframe for that page, plus its Doc 06 content model.
- Optional next step: I can generate Doc 09 as proper screen-level specs, one section per screen, built from Doc 04 plus the reconciled IA. That would restore the screen authority the pack assumes. Say the word.

The "35 screens" figure in Doc 10 is not yet trusted. Once the reconciled tree is counted, the definition of done is updated with the real number.

---

## 9. Housekeeping (resolves P2 items)

- Delete the duplicate `02-art-direction-and-brand (1).md` after confirming it matches the canonical file. Same for the four duplicated policy PDFs (Data Protection, Conflict of Interest, CIC34, Employer MoU).
- Align the Lighthouse targets across docs: Accessibility 100, Best Practices 100, Performance 90-plus mobile, SEO 100. WCAG 2.2 AA is the baseline.
- Cross-check the safeguarding and data protection PDFs against the `referrals` data model in Doc 06 before that form goes live.

---

## 10. What happens next

The pack is now internally consistent on paper. Before Phase 1 begins, three small edits should land in the pack itself so a future session reads the reconciled version, not the old one:

1. Update Doc 10 Section 6 (phases) and its motion lines to point at Docs 05 and 06 and the reconciled IA, rather than restating them.
2. Patch Doc 07 tokens with the six fixes in section 6 above.
3. Note at the top of Docs 07 and 10 that Doc 12 (this ledger) overrides them where they differ.

Once those three edits are in, Phase 1 (repo, tooling, tokens, a blank cream page with the tagline in Fraunces) can start clean, exactly as Doc 10 section 10 describes, on a pack that no longer fights itself.

That is the whole reconciliation. Small, boring, done once, so the build never inherits a contradiction.
