> **SUPERSEDED. Historical reference only. Do not build from this document.**
>
> Marked on Abbey's instruction, 31 August 2026. Gemini is out of the picture,
> so this is no longer a live handoff to anyone. Where it describes the state of
> the build it is a snapshot, not a specification, and parts of it are already
> out of date: the reference implementation it hands over has since had its
> whole hero image set retired (Doc 18 revised, Doc 20 open item 3) and the
> `enc_key` defect described in section 7 as working has been found and fixed.
>
> Two things in it remain useful and are cited elsewhere rather than acted on
> from here: section 6, the list of traps already hit, and section 7's direction
> that the encryption key belongs in Supabase Vault, which is now built.
>
> The live documents are 01 to 12, plus 14 to 20 for motion and imagery.

---

# Off the Hook CIC — Build handoff for the Gemini coding agent

**Document 13. Owner: Abbey (Abiodun Amusa). Prepared as the handoff from the reference build to the Gemini coding agent that will complete the site.**

Purpose: give a coding agent everything it needs to finish this website without rediscovering the decisions, the schema, or the traps. Read this first, then the design pack, then the reference codebase.

The short version: the design is settled, the backend is built and proven, thirteen public screens exist as a working reference, and the motion-rich final build is yours to complete. Nothing here is tied to any personal account. When you deploy, you point it at the CIC's own infrastructure.

---

## 1. What you are inheriting

Three things, in order of value.

1. **A reconciled design.** The original nine-document pack contradicted itself in six serious places. Those are resolved. The single source of truth is now Docs 01 to 09 plus Doc 11 (validation) and Doc 12 (the decisions ledger, which overrides any doc it names). Do not go back to the raw pack for IA, schema, roles, or tokens. Use Doc 12.

2. **A proven backend.** The full Supabase schema, Row Level Security, SECURITY DEFINER RPCs, encryption, audit logging and seed are written and tested. A twelve-assertion security proof (`tests/rls/rls-proof.sql`) passes. This is motion-agnostic and you should inherit it as-is. Rebuilding it is wasted effort and risks the safeguarding model.

3. **A reference implementation.** Thirteen public screens built in the locked stack, with the design system, tokens, and restrained motion working. Treat this as the clearest possible design spec: runnable, unambiguous, and correct on the brand. You may extend it or read it for intent and rebuild. Either way it removes all guesswork about what "editorial" and "restrained" mean in practice.

---

## 2. The one decision still open: motion

The pack (Doc 05) specifies deliberately restrained, editorial motion: 200 / 400 / 800ms, two easing curves, "if motion does not aid comprehension, cut it," reduced-motion honoured throughout. The reference build follows that faithfully.

Abbey wants a heavier, motion-forward, interactive site. That is a legitimate direction but it departs from the pack's stated restraint, and it pulls against the brand book's hard rule that the brand must not read as slick or high-gloss (Doc 02 §2 anti-traits, Doc 08). So this is a live decision for you and Abbey to settle before you build the motion pass, not something to assume.

Whichever way it goes:
- Motion is Framer Motion (`framer-motion`), already installed and used. Motion tokens live in `lib/motion.ts` and mirror the CSS tokens in `app/globals.css`.
- Every motion must honour `prefers-reduced-motion`. The reference components show the pattern (`useReducedMotion`, an opacity-only fallback).
- If you go motion-forward, update Doc 05 to match so the pack stays truthful, and keep the reduced-motion path on everything.
- The reference already has: hero stagger (Doc 05 H1), impact count-ups (M1), the journey rail draw and cross-fade (J1), scroll reveals, and the mobile drawer slide (C4). Use these as the floor, not the ceiling.

---

## 3. The stack, locked (do not substitute)

Next.js 15 (App Router, Server Components by default), React 19, TypeScript strict. Tailwind v4 CSS-first `@theme`. Framer Motion. next-themes on `data-theme`. Fraunces + Inter self-hosted via Fontsource. Drizzle ORM + Zod. Supabase (Postgres, Auth, Storage, RLS, SECURITY DEFINER RPCs). Biome (not ESLint/Prettier). Vitest + Playwright. pnpm.

Two additions the reference made that the pack did not name, both flagged for your acceptance:
- `next-mdx-remote` renders story bodies (the pack requires MDX but named no library).
- `server-only` guards the RPC gateway.

Hosting: the pack specifies Vercel, which is the native fit for Next.js. Netlify works but fights a few Next features. Abbey's call; both were available as connectors in the reference session but neither was used, because the infrastructure must be the CIC's own (see §7).

---

## 4. What is done, and what remains

**Public screens built (13), in `app/`:** home (`/`), about (`/about`), restaurant (`/restaurant`), menu (`/restaurant/menu`), the academy timeline (`/journey`), impact (`/impact`), stories index and detail (`/stories`, `/stories/[slug]`), partners hub and all four sub-pages (`/partners`, `/funders`, `/referrals`, `/employers`, `/education`), plus the living style guide (`/design`). The referral and enquiry forms are live and submit end to end.

**Public screens still stubbed (render inside the shell, need their real content per Doc 09):** `/join`, `/support` and `/support/donate` and `/support/volunteer`, `/contact`, `/news` and `/news/[slug]`, `/brand`, `/restaurant/book`, `/restaurant/events`, and the six `/legal/*` pages. Each has a placeholder page in `app/` already.

**Not started:** the nine admin screens (Doc 09 §4, the CMS that lets Anne edit content and images without a developer, this is the answer to "how do we change things"), analytics and observability (PostHog, Sentry, cookie banner), sitemap/robots/RSS, and the launch checklist.

**Content gaps to resolve with Abbey (no doc defines these):** a `team` content model (About team grid), a `news`/articles model, and a `typical-week` model for the journey page. Each is currently hidden behind an honest empty state.

---

## 5. The design system (final, corrected values)

Tokens live in `app/globals.css`. They are Doc 07 §3 amended by Doc 12 §6, plus contrast fixes the reference measured and proved. Use these values, not the raw pack, which is wrong in a few places.

- No pure white anywhere. `--bg-elev` is `#FFFDF8`, not `#FFFFFF`.
- Distinct success colour `--status-success: #3A6B4C`, so success never looks like a primary button.
- Dark theme is not an inverted palette. The pack's dark contrast table is wrong: forest-500 on night-950 measures 3.96:1, not the documented ~4.9:1. So the dark text accent is `--accent: #7C9B74` (passes AA on all night surfaces), while button fills use `--accent-fill: forest-600` with cream text (6.7:1). A measured dark status set exists (danger `#D06A58`, warning `#C99A3F`, success `#5E9271`, info `#6C93A8`).
- Headings: Fraunces 500, SOFT 30, tracking -0.01em, sentence case. Base sizes are in `@layer base` in globals.css.
- Olive and copper are tag and data colours only, never body text.

Base styles sit inside `@layer base` so Tailwind utilities win the cascade. This is load-bearing; do not move them out of the layer.

Primitives are in `components/ui/` and every one is demonstrated in both themes at `/design`, which is your regression surface. Axe (WCAG 2.2 AA) passes there in light and dark.

---

## 6. The traps already hit (do not repeat these)

Each of these cost time in the reference build. They are fixed in the code you are inheriting; if you rebuild, avoid them.

1. **postgres.js `sql.json()` breaks once bundled by Next** (works standalone). The RPC gateway (`lib/rpc.ts`) passes a parameterised JSON string cast `::jsonb` instead. Still injection-safe. Do not revert to `sql.json()`.
2. **Zod v4 changed `z.literal(true, ...)`.** Consent booleans use `z.boolean().refine(v => v === true, ...)`.
3. **Drizzle column builders are stateful.** Shared-column helpers must be factories that return fresh builders per table (`db/schema/shared.ts`), or constraint names leak between tables.
4. **Base CSS must be layered** or it beats Tailwind utilities and axe flags contrast failures. See §5.
5. **lucide-react v1 dropped brand icons** (Instagram, LinkedIn). They are inline SVGs in the footer.
6. **Rate-limit tests share one hashed-IP bucket** locally; `tests/global-setup.ts` clears `rate_limits` before each run so the RPC's throttle does not fail honest test runs.
7. **The scaffolder ships Next 16**; pin to Next 15 per the locked stack.
8. **`next dev` rewrites `AGENTS.md`/`CLAUDE.md`** with a warning block. Commit it with your work rather than fighting it.

---

## 7. Infrastructure and security (the CIC's own accounts, never personal)

This project is the CIC's, not Abbey's personal project. Nothing was deployed to, or written to, any personal account during the reference build. Everything ran on a local throwaway Postgres. Keep that boundary.

To go live you (or whoever holds the CIC's credentials) create the CIC's own Supabase project and its own Vercel or Netlify account under `offthehookcic.co.uk`, then set environment variables to those. The app reads everything from env; nothing is hard-coded. Template is `.env.example`.

Security posture already built in (deadbolt): RLS on every table with a default-deny stance, all writes through SECURITY DEFINER RPCs, referral notes encrypted at rest via pgcrypto (Supabase Vault in production, a GUC locally), every sensitive read and write audited, fixed-window rate limiting, honeypot on public forms, IP hashed before storage, no PII in logs or analytics. Verified at rest, not just asserted.

Two security items you must finish before launch:
- **Cloudflare Turnstile.** The verification hook is wired in `lib/actions/forms.ts` and no-ops until `TURNSTILE_SECRET` is set. Add the CIC's keys. Until then the honeypot plus the RPC rate limit hold the line.
- **The safeguarding lead's name and the encryption key** move into the real Supabase Vault, not a GUC.

Setup commands, once the CIC's Supabase exists and `DATABASE_URL` points at it:
```
pnpm db:migrate   # applies db/migrations/0000_init.sql then 0001_rls_and_rpcs.sql
pnpm db:seed      # real-voice seed content, no lorem ipsum
pnpm db:proof     # the twelve-assertion RLS security proof; must print ALL RLS PROOFS PASSED
```

---

## 8. Content and image editability (the answer to "how do we change things")

Nothing is baked in. Two mechanisms:
- **Images** live in `public/heroes/` and `public/brand/` with plain filenames. Replace a file with the same name and it updates everywhere. The images in there now are deliberate placeholders for higgsfield generations and Anne's real photos. Anne's portrait stays real; everything else is a slot.
- **Text that changes** (menu, stories, impact numbers, journey steps, pages) lives in the database, not the code. The admin CMS (Doc 09 §4, not yet built) is the tool that lets Anne edit all of it, and upload new images to Supabase Storage, with no developer. Building that admin is the single most important remaining piece for the client's independence.

---

## 9. How to use the reference codebase

The zip is a self-contained Next.js repo minus `node_modules` and build output. To run it:
```
pnpm install
# start a local Postgres, set DATABASE_URL in .env.local
pnpm db:migrate && pnpm db:seed
pnpm dev
```
Read `logs/` for the per-session build journal: every phase, decision, and fix is recorded there in order. Read `app/design/page.tsx` to see every primitive. Read `db/migrations/0001_rls_and_rpcs.sql` for the whole security model in one file.

The build order that worked, and that the reference followed, is in Doc 10 §15 as reconciled by Doc 12: skeleton and tokens, then Supabase, then auth and the admin shell, then content types, then public pages, then forms, then the motion pass, then testing, then analytics, then legal, then deploy. Motion comes late on purpose, once markup is stable.

---

## 10. Definition of done (unchanged from Doc 07 §16 and Doc 11)

All public and admin screens live and matching Doc 09. Lighthouse 95-plus performance and 100 accessibility on every public route. All forms submit end to end and emails arrive. RLS verified by the proof. Sentry, PostHog, cookie banner, sitemap, RSS, robots all live. Turnstile keys in. Custom domain live over HTTPS on the CIC's own accounts. Then Abbey signs off.

That is the whole handoff. The design is settled, the backend is proven, the traps are mapped. Build the motion-rich site on top of a foundation that already holds.
