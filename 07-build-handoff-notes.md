# Off the Hook CIC — Build Handoff Notes

**Document 7 of 7.** The final document in the pack. This turns everything in Docs 1-6 into concrete build instructions you can execute in VS Code without opening any of the earlier documents mid-build.

Reading order:
- Section 1 — one-time project setup.
- Section 2 — folder layout.
- Section 3 — design tokens as CSS variables (paste into `globals.css`).
- Section 4 — Tailwind v4 `@theme` config.
- Section 5 — Fonts.
- Section 6 — Component inventory with props and states.
- Section 7 — Environment variables.
- Section 8 — Motion helper.
- Section 9 — Supabase project setup.
- Section 10 — Auth, roles, and middleware.
- Section 11 — Testing gates.
- Section 12 — Analytics and observability.
- Section 13 — Deployment.
- Section 14 — Acceptance criteria per page.
- Section 15 — Order of build.
- Section 16 — Sign-off checklist.

---

## 1. Project setup

```bash
# Node 20+ required. pnpm preferred.
pnpm create next-app@latest off-the-hook \
  --typescript --tailwind --eslint --app --src-dir=false \
  --import-alias "@/*"

cd off-the-hook

# Core deps
pnpm add \
  @supabase/supabase-js @supabase/ssr \
  drizzle-orm postgres drizzle-zod zod \
  framer-motion \
  @tanstack/react-query \
  lucide-react \
  next-themes \
  clsx tailwind-merge \
  @fontsource-variable/fraunces @fontsource-variable/inter \
  react-hook-form @hookform/resolvers \
  resend \
  posthog-js \
  @sentry/nextjs \
  react-hot-toast

pnpm add -D \
  drizzle-kit \
  @types/node \
  vitest @vitest/ui @testing-library/react @testing-library/jest-dom jsdom \
  @playwright/test \
  @biomejs/biome \
  supabase

# Replace ESLint with Biome
pnpm remove eslint eslint-config-next
rm -f .eslintrc*
pnpm biome init
```

Remove Prettier if the create-next-app template added it. Biome handles both format and lint.

## 2. Folder layout

```
off-the-hook/
├── app/                            # App Router
│   ├── (marketing)/                # Public site route group
│   │   ├── page.tsx                # Home
│   │   ├── restaurant/
│   │   │   ├── page.tsx
│   │   │   ├── menu/page.tsx
│   │   │   └── book/page.tsx
│   │   ├── academy/
│   │   │   ├── page.tsx
│   │   │   ├── programme/page.tsx
│   │   │   └── apply/page.tsx
│   │   ├── impact/page.tsx
│   │   ├── stories/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/page.tsx
│   │   ├── partners/
│   │   │   ├── page.tsx
│   │   │   ├── refer/page.tsx
│   │   │   ├── employ/page.tsx
│   │   │   └── fund/page.tsx
│   │   ├── about/
│   │   │   ├── page.tsx
│   │   │   ├── team/page.tsx
│   │   │   └── governance/page.tsx
│   │   ├── support/
│   │   │   ├── page.tsx
│   │   │   ├── donate/page.tsx
│   │   │   ├── hire-the-space/page.tsx
│   │   │   └── volunteer/page.tsx
│   │   ├── contact/page.tsx
│   │   ├── press/page.tsx
│   │   ├── events/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/page.tsx
│   │   ├── privacy/page.tsx
│   │   ├── cookies/page.tsx
│   │   ├── terms/page.tsx
│   │   ├── safeguarding/page.tsx
│   │   └── accessibility/page.tsx
│   ├── admin/                       # Auth-gated
│   │   ├── layout.tsx
│   │   ├── page.tsx                 # Dashboard
│   │   ├── pages/
│   │   ├── journey/
│   │   ├── impact/
│   │   ├── stories/
│   │   ├── menu/
│   │   ├── events/
│   │   ├── partners/
│   │   ├── bookings/
│   │   ├── enquiries/
│   │   ├── referrals/
│   │   ├── subscribers/
│   │   ├── users/
│   │   └── audit/
│   ├── api/
│   │   ├── revalidate/route.ts
│   │   ├── gdpr/
│   │   │   ├── export/route.ts
│   │   │   └── erase/route.ts
│   │   └── og/route.tsx             # Open Graph image generation
│   ├── layout.tsx                   # Root layout, fonts, providers
│   ├── globals.css                  # Tokens, base styles
│   ├── not-found.tsx
│   └── error.tsx
├── components/
│   ├── ui/                          # shadcn-copied primitives
│   ├── site/                        # Site-specific components (Header, Footer, Hero, etc.)
│   ├── admin/                       # Admin components
│   └── motion/                      # Motion helpers (see Doc 5 section 15)
├── content/                         # MDX for legal pages
│   ├── privacy.mdx
│   ├── cookies.mdx
│   ├── terms.mdx
│   ├── safeguarding.mdx
│   └── accessibility.mdx
├── db/
│   ├── schema/                      # Drizzle schema files
│   ├── migrations/                  # Committed migrations
│   ├── client.ts                    # Drizzle client for server usage
│   ├── seed.ts
│   └── types.ts                     # Generated Supabase types
├── lib/
│   ├── supabase/
│   │   ├── server.ts
│   │   ├── client.ts
│   │   └── middleware.ts
│   ├── auth.ts                      # Role helpers, jwt claims
│   ├── validation/                  # Zod schemas grouped by domain
│   ├── motion.ts                    # Motion tokens for TS
│   ├── impact-metrics.ts            # Metric definitions
│   ├── analytics.ts                 # PostHog wrapper
│   ├── email.ts                     # Resend wrapper
│   └── utils.ts
├── public/
│   ├── fonts/                       # Self-hosted Fraunces + Inter
│   ├── favicons/
│   └── og/                          # Static OG fallbacks
├── tests/
│   ├── unit/
│   └── e2e/
├── biome.json
├── drizzle.config.ts
├── next.config.mjs
├── tsconfig.json
├── package.json
└── .env.local
```

## 3. Design tokens

Paste this whole block into `app/globals.css`. It sits above the `@import "tailwindcss";` line so that Tailwind's `@theme` can reference the variables.

```css
:root {
  /* Ink (browns) */
  --ink-900: #1F1912;
  --ink-700: #3D2F22;
  --ink-500: #6B5A45;
  --ink-300: #9C8C74;

  /* Cream (paper) */
  --cream-50:  #FAF5E9;
  --cream-100: #F3EBD8;
  --cream-200: #E7DBBF;
  --cream-350: #CFC0A0;

  /* Forest (primary accent) */
  --forest-100: #DDE7D6;
  --forest-500: #5B7C56;
  --forest-600: #3E5E3A;
  --forest-700: #2E4A2C;

  /* Secondary accents */
  --olive-500: #7A8A4A;
  --copper-500: #9C6A3E;

  /* Status */
  --status-danger:  #B4432A;
  --status-warn:    #B57F2F;
  --status-success: #3E5E3A;

  /* Semantic aliases (light) */
  --bg:              var(--cream-50);
  --bg-elev:         #FFFFFF;      /* used sparingly, cards on cream */
  --surface:         var(--cream-100);
  --divider:         var(--cream-200);
  --text-primary:    var(--ink-900);
  --text-secondary:  var(--ink-700);
  --text-muted:      var(--ink-500);
  --accent:          var(--forest-600);
  --accent-hover:    var(--forest-700);
  --accent-wash:     var(--forest-100);
  --focus-ring:      var(--forest-600);

  /* Typography */
  --font-display: "Fraunces Variable", ui-serif, Georgia, serif;
  --font-sans:    "Inter Variable", ui-sans-serif, system-ui, sans-serif;

  --fs-display: clamp(2.75rem, 4vw + 1rem, 5.25rem);
  --fs-h1:      clamp(2.125rem, 2vw + 1rem, 3.5rem);
  --fs-h2:      clamp(1.75rem, 1.2vw + 1rem, 2.5rem);
  --fs-h3:      clamp(1.375rem, 0.6vw + 1rem, 1.625rem);
  --fs-lead:    clamp(1.125rem, 0.3vw + 1rem, 1.25rem);
  --fs-body:    clamp(1rem, 0.1vw + 0.95rem, 1.0625rem);
  --fs-small:   0.875rem;
  --fs-tiny:    0.75rem;

  --lh-tight:   1.12;
  --lh-heading: 1.2;
  --lh-body:    1.6;

  /* Spacing (8px base) */
  --sp-0:  0;
  --sp-1:  0.25rem;
  --sp-2:  0.5rem;
  --sp-3:  0.75rem;
  --sp-4:  1rem;
  --sp-5:  1.25rem;
  --sp-6:  1.5rem;
  --sp-8:  2rem;
  --sp-10: 2.5rem;
  --sp-12: 3rem;
  --sp-16: 4rem;
  --sp-20: 5rem;
  --sp-24: 6rem;

  /* Radii */
  --r-xs: 4px;
  --r-sm: 6px;
  --r-md: 10px;
  --r-lg: 16px;
  --r-xl: 24px;
  --r-2xl: 32px;

  /* Shadows (soft, no glow) */
  --shadow-sm: 0 1px 2px rgba(31, 25, 18, 0.08);
  --shadow-md: 0 4px 12px rgba(31, 25, 18, 0.10);
  --shadow-lg: 0 12px 32px rgba(31, 25, 18, 0.12);

  /* Motion */
  --dur-instant: 100ms;
  --dur-fast:    200ms;
  --dur-med:     400ms;
  --dur-slow:    800ms;
  --ease-enter:  cubic-bezier(0.2, 0.7, 0.2, 1);
  --ease-exit:   cubic-bezier(0.4, 0, 0.2, 1);

  /* Layout */
  --content-max: 1240px;
  --content-narrow: 720px;
  --measure: 68ch;
}

html[data-theme="dark"] {
  --bg:              #161210;         /* night-950 */
  --bg-elev:         #221B14;         /* night-900 */
  --surface:         #2E241B;         /* night-800 */
  --divider:         #3A2F24;
  --text-primary:    #F7F1DF;         /* cream-25 */
  --text-secondary:  #E7DBBF;         /* cream-200 */
  --text-muted:      #CFC0A0;         /* cream-350 */
  --accent:          #5B7C56;         /* forest-500-dark */
  --accent-hover:    #6E8F66;
  --accent-wash:     rgba(91, 124, 86, 0.18);
  --focus-ring:      #CFC0A0;

  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.4);
  --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.45);
  --shadow-lg: 0 12px 32px rgba(0, 0, 0, 0.5);
}

/* Base styles */
html {
  color-scheme: light dark;
  scroll-behavior: smooth;
}

body {
  background: var(--bg);
  color: var(--text-primary);
  font-family: var(--font-sans);
  font-size: var(--fs-body);
  line-height: var(--lh-body);
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}

h1, h2, h3, .display {
  font-family: var(--font-display);
  color: var(--text-primary);
  line-height: var(--lh-heading);
  font-weight: 500;
  letter-spacing: -0.01em;
}

::selection {
  background: var(--forest-600);
  color: var(--cream-50);
}

*:focus-visible {
  outline: 2px solid var(--focus-ring);
  outline-offset: 2px;
  border-radius: 2px;
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

## 4. Tailwind v4 `@theme`

> **Updated 30 August 2026 from `app/globals.css`.** This section used to lead the build. It now follows it. The block below is transcribed from the live file, which is the source of truth for tokens; if the two ever disagree again, the file wins and this section gets updated, not the other way round. Three things changed against the version this section carried before, and all three are deliberate:
>
> 1. **`@theme inline`, not `@theme`.** Keep `inline`, but for the accurate reason, because the reason previously given here was wrong and was measured on 30 August 2026. `inline` changes what the utility points at, not whether the theme works. With it, `.bg-bg` compiles to `background-color: var(--bg)`. Without it, it compiles to `background-color: var(--color-bg)`, and `--color-bg: var(--bg)` is emitted on `:root`. **Both flip correctly under `html[data-theme="dark"]`**, verified by building the site each way and reading the computed colour of a `.bg-bg` element before and after the toggle: cream-50 to night-950 in both builds. The reason it works either way is that `:root` and `html[data-theme="dark"]` are the same element, so the alias is re-resolved when the attribute changes. Keep `inline` because it removes one level of indirection and because it stays correct if the theme flag ever moves onto a descendant, where the non-inline form would bake the light value. Do not keep it because you believe dark mode breaks without it. It does not.
> 2. **Nine tokens added**, per Doc 12 section 6: `--color-cream-25`, `--color-accent-fill`, `--color-accent-fill-hover`, `--color-accent-wash-text`, and the five `--color-status-*` entries. The status set exists because Doc 02 defines five states and the section previously exposed none of them to Tailwind.
> 3. **`@import "tailwindcss"` sits on line 1**, above the `:root` token block, not below it. Tailwind v4 requires the import first. The old instruction to place it "below the tokens" was wrong and would not compile.

Tailwind v4 uses CSS-first config. In `app/globals.css`, the import leads the file, the `:root` and `html[data-theme="dark"]` token blocks from section 3 follow it, and this block sits below those:

```css
@theme inline {
  --font-sans: var(--font-sans);
  --font-serif: var(--font-display);

  --color-bg: var(--bg);
  --color-bg-elev: var(--bg-elev);
  --color-surface: var(--surface);
  --color-divider: var(--divider);
  --color-text: var(--text-primary);
  --color-text-secondary: var(--text-secondary);
  --color-text-muted: var(--text-muted);
  --color-accent: var(--accent);
  --color-accent-hover: var(--accent-hover);
  --color-accent-wash: var(--accent-wash);
  --color-accent-fill: var(--accent-fill);
  --color-accent-fill-hover: var(--accent-fill-hover);
  --color-accent-wash-text: var(--accent-wash-text);

  --color-ink-900: var(--ink-900);
  --color-ink-700: var(--ink-700);
  --color-ink-500: var(--ink-500);
  --color-cream-25: var(--cream-25);
  --color-cream-50: var(--cream-50);
  --color-cream-100: var(--cream-100);
  --color-cream-200: var(--cream-200);
  --color-forest-100: var(--forest-100);
  --color-forest-500: var(--forest-500);
  --color-forest-600: var(--forest-600);
  --color-forest-700: var(--forest-700);
  --color-olive-500: var(--olive-500);
  --color-copper-500: var(--copper-500);
  --color-status-danger: var(--status-danger);
  --color-status-danger-fill: var(--status-danger-fill);
  --color-status-warning: var(--status-warning);
  --color-status-success: var(--status-success);
  --color-status-info: var(--status-info);

  --radius-md: var(--r-md);
  --radius-lg: var(--r-lg);
  --radius-xl: var(--r-xl);

  --spacing-container: var(--content-max);
  --spacing-narrow: var(--content-narrow);
}
```

Utility mapping in components:
- `bg-bg`, `bg-surface`, `bg-forest-600`.
- `text-text`, `text-text-secondary`, `text-text-muted`.
- `border-divider`.
- `font-serif` for Fraunces, `font-sans` for Inter.
- Custom classes for `.container-x` and `.container-narrow` defined in a small `@layer components` block.

## 5. Fonts

Self-host both fonts via `@fontsource-variable/*`. Import once in `app/layout.tsx`:

```tsx
import "@fontsource-variable/fraunces";
import "@fontsource-variable/inter";
```

Alternatively use `next/font/local` pointing at variable WOFF2 files placed in `public/fonts/`. Prefer the Fontsource approach because it handles subsetting and unicode ranges without configuration.

Fraunces variable axes to enable: `wght 200-900`, `SOFT 0-100`, `WONK 0-1`. Body uses default (SOFT 0, WONK 0). Pull quotes use SOFT 100 for a warmer feel.

## 6. Component inventory

Every component with its purpose, props, states, and location. All named in PascalCase, colocated in `components/site` unless otherwise noted.

### 6.1 Layout

- **`Header`** — sticky top nav. Props: none. States: default, scrolled (H2 in Doc 5), mobile-menu-open. Uses `MobileMenu` on `sm`.
- **`Footer`** — three columns + legal row. Props: none.
- **`MobileMenu`** — right sheet nav. Props: `open: boolean`, `onClose`.
- **`Container`** — max-width wrapper. Props: `width?: 'default' | 'narrow' | 'full'`, `children`.
- **`Section`** — vertical rhythm wrapper. Props: `spacing?: 'sm' | 'md' | 'lg'`, `background?: 'cream' | 'surface' | 'forest'`, `children`.

### 6.2 Type and text

- **`Eyebrow`** — small caps label. Props: `children`.
- **`Display`** — hero title. Props: `children`, `as?: 'h1' | 'h2'`.
- **`Lead`** — larger intro paragraph. Props: `children`.
- **`Prose`** — MDX-rendered body copy container with typographic rules.
- **`PullQuote`** — indented serif quote. Props: `quote`, `attribution?`.
- **`Callout`** — highlighted paragraph card. Props: `tone: 'note' | 'important'`, `children`.

### 6.3 Buttons and links

- **`Button`** — primary CTA. Props: `variant: 'primary' | 'secondary' | 'ghost' | 'destructive'`, `size: 'sm' | 'md' | 'lg'`, `asChild?`, `disabled`, `loading`. States: default, hover, active, focus, disabled, loading.
- **`LinkButton`** — same visuals as `Button` but as an `<a>`.
- **`IconButton`** — square icon-only. Props: `icon: LucideIcon`, `label` (required for a11y).
- **`TextLink`** — inline link with underline offset.

### 6.4 Forms

- **`Field`** — wrapper for `Label`, `Input`, and `HelperText`/`ErrorText`. Props: `label`, `name`, `error?`, `hint?`, `required?`.
- **`Input`** — text input. Full HTML input props.
- **`Textarea`** — same shape as Input.
- **`Select`** — Radix Select styled.
- **`DatePicker`** — Radix-based, native on mobile.
- **`Checkbox`**, **`RadioGroup`**, **`Switch`** — Radix-based.
- **`GdprConsent`** — checkbox row with required consent text and privacy link.
- **`FormError`** — inline error banner.

### 6.5 Cards

- **`Card`** — base card container. Props: `as?: 'div' | 'article' | 'a'`, `variant: 'default' | 'featured'`, `interactive?: boolean`.
- **`StoryCard`** — story preview.
- **`MetricTile`** — impact tile with count-up.
- **`MenuItemCard`** — restaurant menu row.
- **`EventCard`** — event preview.
- **`PartnerLogo`** — partner tile with logo.

### 6.6 Hero and banners

- **`HomeHero`**, **`RestaurantHero`**, **`AcademyHero`**, **`ImpactHero`**, **`AboutHero`** — page-specific heroes composed from `Display`, `Lead`, `Button`, `StatCard`.
- **`StatCard`** — small floating card that sits over hero imagery.
- **`CtaBand`** — forest-background CTA row (CT1 in Doc 5).

### 6.7 Journey timeline

- **`JourneyTimeline`** — horizontal on desktop, vertical on mobile. Props: `steps: JourneyStep[]`, `activeStep?: number`.
- **`JourneyStep`** — node in the rail.
- **`JourneyDetailPanel`** — the panel that changes as steps are selected.

### 6.8 Data and impact

- **`ImpactYearFilter`** — year chips.
- **`ImpactMetricGrid`** — grid of `MetricTile`.
- **`ImpactBarChart`** — small SVG chart. No Chart.js dependency.
- **`ImpactPullQuote`** — variant of `PullQuote` with metric attribution.

### 6.9 Restaurant

- **`RestaurantHero`**.
- **`MenuSection`** — menu section with heading and list of `MenuItemCard`.
- **`AllergensNote`** — standing block that appears above every menu.
- **`BookingForm`** — table booking form. Uses `Field`, `DatePicker`, `Select`, `GdprConsent`.
- **`OpeningHours`** — hours grid.

### 6.10 Academy

- **`ProgrammeTimeline`** — 12-week programme by week.
- **`QualificationBadge`** — small pill listing an accredited qualification.
- **`ApplicationCta`** — routing card to `/academy/apply` and `/partners/refer`.

### 6.11 Story

- **`StoryHero`** — hero for a single story.
- **`StoryBody`** — MDX renderer with allowlist components (`PullQuote`, `Image`, `Callout`, `Divider`).
- **`StoryMeta`** — author, category, date.
- **`ShareRow`** — copy link + share buttons.
- **`RelatedStories`** — three-up list.

### 6.12 Partners and About

- **`PartnersGrid`** — grouped by category.
- **`ReferralForm`**, **`EmployerForm`**, **`FundingForm`** — variant forms all consuming `enquiries` RPC.
- **`TeamGrid`** — team member tiles.
- **`GovernanceSection`** — trustees, policies, filings.

### 6.13 Utility

- **`NewsletterForm`** — inline newsletter capture.
- **`CookiesBanner`** — bottom cookie consent.
- **`Breadcrumbs`** — legal and detail-page breadcrumbs.
- **`ThemeToggle`** — sun/moon icon that flips via `next-themes`.
- **`ScrollToTop`** — small button appearing after 800px scroll.
- **`Skeleton`** — loading placeholder.
- **`Toast`** — via `react-hot-toast` config.

### 6.14 Admin (colocated in `components/admin/`)

- **`AdminSidebar`**, **`AdminTopbar`**, **`AdminBreadcrumbs`**.
- **`RoleGate`** — client-side guard that hides UI by role (server-side already enforced).
- **`SectionForm`** — form for editing a page section.
- **`AutoSaveIndicator`** — shows draft state.
- **`PublishBar`** — sticky bottom bar with Save / Publish / Preview / Discard.
- **`AuditRow`** — audit-log line item.
- **`KanbanBoard`** — bookings by status.
- **`DataTable`** — generic table with search/sort/filter.

State variants every interactive component must implement: default, hover, focus-visible, active, disabled, loading (where applicable), empty, error. Colours reference tokens, never hard-coded hex.

## 7. Environment variables

`.env.local` template:

```
# Public (safe for the browser)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_SITE_URL=https://offthehookcic.org.uk
NEXT_PUBLIC_POSTHOG_KEY=
NEXT_PUBLIC_POSTHOG_HOST=https://eu.posthog.com

# Server only (never NEXT_PUBLIC_)
SUPABASE_SERVICE_ROLE_KEY=
SUPABASE_JWT_SECRET=
DATABASE_URL=postgresql://...
RESEND_API_KEY=
SENTRY_DSN=
REVALIDATE_SECRET=

# Feature flags
ENABLE_ONLINE_BOOKING=true
ENABLE_DONATIONS=false
```

Never commit `.env.local`. Add `.env.example` with the same keys and empty values.

## 8. Motion helper

`lib/motion.ts` mirrors CSS tokens for Framer Motion. Do not duplicate values in components:

```ts
export const dur = {
  instant: 0.1,
  fast: 0.2,
  med: 0.4,
  slow: 0.8,
} as const;

export const easeEnter = [0.2, 0.7, 0.2, 1] as const;
export const easeExit  = [0.4, 0.0, 0.2, 1] as const;

export const lift = {
  sm: 8,
  lg: 16,
} as const;

export const stagger = {
  tight: 0.04,
  med:   0.08,
  slow:  0.12,
} as const;

// Presets
export const riseIn = {
  initial:  { opacity: 0, y: lift.sm },
  animate:  { opacity: 1, y: 0 },
  transition: { duration: dur.med, ease: easeEnter },
} as const;

export const fadeIn = {
  initial:  { opacity: 0 },
  animate:  { opacity: 1 },
  transition: { duration: dur.med, ease: easeEnter },
} as const;
```

Wrap `useReducedMotion` in a helper that returns the correct preset for reduced-motion users.

## 9. Supabase project setup

1. Create the project in the London (Ireland `eu-west-1`) region.
2. Enable extensions: `pgcrypto`, `pg_trgm`, `uuid-ossp`.
3. Create the Storage buckets `public-media` (public) and `private-media` (private).
4. Set the auth config: email + magic link only, disable password sign-in, disable email confirmation for admin invites (they arrive by invitation from `auth.admin.inviteUserByEmail`).
5. Apply the `custom_access_token_hook` to inject `role` into JWTs (see Doc 6 section 3.12).
6. Create the roles in `users`: `admin`, `editor`, `manager`, `safeguarding`, `kitchen`.
7. Run Drizzle migrations. Seed dev data (`db/seed.ts`).

## 10. Auth, roles, and middleware

`middleware.ts` handles:
- Refresh Supabase session cookies on every request via `@supabase/ssr`.
- Redirect `/admin/*` to `/admin/login` if unauthenticated.
- Redirect authenticated users away from `/admin/login`.
- Enforce role at the route level: `/admin/referrals/*` requires `safeguarding`, `/admin/bookings/*` requires `manager` or `admin`, everything else requires at least `editor`.
- Attach `x-role` and `x-user-id` request headers for server components.

`lib/auth.ts` exports:

```ts
export function currentRole(): Role | null;
export function requireRole(...roles: Role[]): void;   // throws to a redirect
export function isEditor(): boolean;
export function isSafeguarding(): boolean;
```

## 11. Testing gates

Three layers:

- **Unit (`vitest`).** Zod schemas, formatting helpers, small pure components. Target: fast, run on every commit. Coverage target: 70% on `lib/` and `db/schema/`.
- **Component (`vitest` + `@testing-library/react`).** Every interactive component: renders, state transitions, keyboard interaction, ARIA labels present.
- **E2E (`playwright`).** One flow per user story in Doc 1. Non-negotiable flows: home renders, journey timeline is navigable by keyboard, restaurant booking form submits, referral form submits (against a Supabase branch DB), impact page loads with metrics, admin login, editor edits a page and publishes, safeguarding user creates a referral.

Playwright config runs on Chromium, Firefox, WebKit; mobile viewport 375x812; desktop 1440x900.

## 12. Analytics and observability

- **PostHog** for product analytics. Auto-capture on. Manual events for `booking_submitted`, `enquiry_submitted`, `story_viewed`, `newsletter_confirmed`, `journey_step_opened`.
- **Sentry** for error tracking. Filter out expected 4xx.
- **Vercel Analytics** for Web Vitals.
- **PostHog Session Replay** disabled by default; enable in admin-only routes.

## 13. Deployment

- **Vercel.**
  - Framework: Next.js. Node 20.
  - Environment variables: production, preview, development.
  - Preview deployments run against a Supabase branch (auto-created on PR).
  - Production deployments run migrations manually via `supabase db push` in CI, gated by a GitHub Actions workflow.
- **Domains.** `offthehookcic.org.uk` primary, `www.offthehookcic.org.uk` 308 to root, `.com` variant 308 to `.org.uk` primary.
- **Security headers** set in `next.config.mjs` middleware: HSTS, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy` disabling geolocation and camera by default, a strict CSP with allowed sources listed.

## 14. Acceptance criteria per page

Each page is considered "done" when all criteria pass.

### Home
- Renders under 1.5s LCP on a mid-range Android on 4G.
- Hero H1 is the tagline exactly: "Real work. Real qualifications. Real chances."
- Journey timeline is reachable by tab; each step is keyboard-selectable.
- Impact strip shows the current year's six metrics, count-up runs once.
- Featured story is a real story or a graceful empty state.
- Every CTA has an accessible name.
- Lighthouse: Performance ≥ 90, Accessibility = 100, Best Practices ≥ 95, SEO ≥ 95.

### Restaurant
- Menu items load from Supabase. Empty menu shows a graceful state.
- Booking form validates, submits, and returns success on the same page.
- Allergens note is visible without scrolling on desktop.
- Opening hours reflect the current week.

### Academy
- 12-week programme grid renders in read order.
- Application CTA routes correctly to `/academy/apply`.

### Impact
- Year filter changes metrics without a full page reload.
- Chart renders without motion under `prefers-reduced-motion: reduce`.
- Every metric has a source note tooltip.

### Stories index and detail
- Category filter works.
- Detail page renders MDX with only allowed components.
- Reading time is calculated on the server and stable.

### Partners and forms
- Referral form saves to `referrals` via RPC, safeguarding role receives an email.
- Employer and funding forms save to `enquiries` with the correct `type`.

### About
- Team grid loads. Governance page lists trustees and policies.

### Support/donate/hire
- Donate page routes to the external provider until Stripe is added.
- Hire form saves to `enquiries` with `type='hire'`.

### Legal
- Privacy, cookies, terms, safeguarding, and accessibility pages render from MDX.
- Cookies banner respects consent choices.

### Admin
- Login works, magic link only.
- Role gates work end to end: editor cannot see referrals, safeguarding cannot see menu.
- Every list has search, sort, filter.
- Every editor form autosaves.
- Preview mode renders drafts.

## 15. Order of build

Sequence the build to unblock content early and de-risk the sensitive parts:

1. **Skeleton.** Next.js project, tokens, Tailwind, fonts, layouts, Header/Footer, theme toggle. No data.
2. **Supabase.** Migrations, RLS, seed data, RPCs.
3. **Auth and middleware.** Login, roles, admin shell.
4. **Content types in admin.** Pages, Journey, Impact, Stories, Menu, Events, Partners.
5. **Public pages.** Home, Restaurant, Academy, Impact, Stories, About, Support, Contact, Press.
6. **Forms and RPCs.** Booking, enquiries, referrals, newsletter.
7. **Motion.** Layer in motion once markup is stable. Never before.
8. **Testing.** Vitest + Playwright coverage.
9. **Analytics and observability.** PostHog, Sentry, Vercel.
10. **Legal and accessibility.** MDX pages, cookies banner, GDPR routes.
11. **Deploy.** Staging, then production. Domain switch last.

## 16. Sign-off checklist

Before shipping v1:

- Lighthouse targets met on Home, Restaurant, Impact.
- All 18 user stories from Doc 1 covered by an E2E test.
- All RLS policies verified by a manual audit against the safeguarding table (attempt a read as `editor`, `manager`, `kitchen`; expect 0 rows).
- All RPCs return an accurate error for unauthorised callers.
- All forms validate server-side with Zod and return field-level errors.
- Every page passes axe-core with zero violations.
- Every page renders correctly at 320px, 375px, 768px, 1024px, 1440px, 1920px.
- Cookies banner respected across all analytics.
- Sentry receives a test error.
- PostHog receives a test event.
- Reduced motion is honoured across every named motion sequence in Doc 5.
- All fonts self-hosted, no external font requests in Network tab.
- Robots and sitemap live at `/robots.txt` and `/sitemap.xml`.
- OG images generated for every page.
- 404 and 500 pages branded.

---

## 17. Email routing (appendix, added post-launch prep)

Off the Hook operates on the `offthehookcic.co.uk` domain. Four addresses, one real inbox, three aliases. All aliases forward to `anne@offthehookcic.co.uk`.

### 17.1 The addresses

| Address | Kind | Purpose |
|---|---|---|
| `anne@offthehookcic.co.uk` | Real mailbox | Founder correspondence, safeguarding lead, funder sign-off, director-level threads. Not a form destination. |
| `hello@offthehookcic.co.uk` | Alias → anne@ | Public front door. Diner enquiries, general public, press (until volume splits). Goes on the site, menu, cards. |
| `referrals@offthehookcic.co.uk` | Alias → anne@ | Safeguarded route. Prison resettlement teams, probation officers, partner charities. Filtered into a restricted folder in Anne's inbox. |
| `partners@offthehookcic.co.uk` | Alias → anne@ | Commercial and institutional door. Employer hire enquiries, funders, commissioners, suppliers, long-form press. |

### 17.2 DNS baseline (do before any mail is sent through Resend)

- MX records pointing to the mailbox provider.
- SPF including Resend: `v=spf1 include:_spf.resend.com include:[mailbox provider] -all`.
- DKIM key from Resend published on the domain.
- DMARC starting at `p=none` for a fortnight of monitoring, then `p=quarantine`, then `p=reject` once reports are clean: `v=DMARC1; p=none; rua=mailto:anne@offthehookcic.co.uk`.
- Verify the domain in Resend before wiring any send path. Unverified domains silently drop mail.

### 17.3 Enquiry type to Reply-To mapping

Every submission through the `enquiries` table carries a `type`. That `type` decides the `Reply-To` on the confirmation email and the destination alias for the internal notification.

| `enquiries.type` | `Reply-To` on confirmation | Internal notification to |
|---|---|---|
| `diner` | hello@offthehookcic.co.uk | hello@ |
| `referral` | referrals@offthehookcic.co.uk | referrals@ |
| `employer` | partners@offthehookcic.co.uk | partners@ |
| `press` | partners@offthehookcic.co.uk | partners@ |
| `donation` | hello@offthehookcic.co.uk | hello@ |
| `general` | hello@offthehookcic.co.uk | hello@ |

Every automated email sends `From: Off the Hook CIC <hello@offthehookcic.co.uk>` regardless of type. Only `Reply-To` varies. This keeps DMARC alignment simple and routes replies where they belong.

### 17.4 Environment variables (add to Section 7)

```
# Resend
RESEND_API_KEY=re_...
RESEND_FROM_ADDRESS=hello@offthehookcic.co.uk
RESEND_FROM_NAME=Off the Hook CIC
RESEND_REPLY_TO_MAP={"diner":"hello@offthehookcic.co.uk","referral":"referrals@offthehookcic.co.uk","employer":"partners@offthehookcic.co.uk","press":"partners@offthehookcic.co.uk","donation":"hello@offthehookcic.co.uk","general":"hello@offthehookcic.co.uk"}

# Inbound (for future; when Anne wants form submissions in a shared tool)
RESEND_INBOUND_DOMAIN=offthehookcic.co.uk
```

### 17.5 The email sender helper

Drop this into `lib/email/send.ts`. Every transactional path (forms, donation receipts, referral confirmations) uses it.

```ts
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const replyToMap = JSON.parse(process.env.RESEND_REPLY_TO_MAP ?? "{}") as Record<string, string>;

export type EnquiryType = "diner" | "referral" | "employer" | "press" | "donation" | "general";

export async function sendTransactional(opts: {
  to: string;
  subject: string;
  html: string;
  type: EnquiryType;
}) {
  const replyTo = replyToMap[opts.type] ?? "hello@offthehookcic.co.uk";
  return resend.emails.send({
    from: `${process.env.RESEND_FROM_NAME} <${process.env.RESEND_FROM_ADDRESS}>`,
    to: opts.to,
    replyTo,
    subject: opts.subject,
    html: opts.html,
    headers: {
      "X-Entity-Ref-ID": crypto.randomUUID(),
    },
  });
}

export async function notifyInternal(opts: {
  subject: string;
  html: string;
  type: EnquiryType;
}) {
  const to = replyToMap[opts.type] ?? "hello@offthehookcic.co.uk";
  return resend.emails.send({
    from: `${process.env.RESEND_FROM_NAME} <${process.env.RESEND_FROM_ADDRESS}>`,
    to,
    subject: opts.subject,
    html: opts.html,
  });
}
```

### 17.6 Where the addresses show up on the site

- **Footer:** `hello@offthehookcic.co.uk` only.
- **Contact page (`/contact`):** all three public aliases, each with a one-line explanation of when to use it.
- **Partners page (`/partners`) and Hire page (`/hire`):** `partners@offthehookcic.co.uk` in the sidebar.
- **Referral partner section on `/academy`:** `referrals@offthehookcic.co.uk` with a note about GDPR handling.
- **Legal pages:** `anne@offthehookcic.co.uk` as the data controller contact in the Privacy Policy only. Nowhere else on the site.
- **Menu, business cards, signage:** `hello@offthehookcic.co.uk` only.

### 17.7 Anne's inbox rules (for her, not the build)

1. Filter `to:referrals@offthehookcic.co.uk` → label `Referrals`, colour forest, mark as important, do not auto-archive.
2. Filter `to:partners@offthehookcic.co.uk` → label `Partners`, colour copper.
3. Filter `to:hello@offthehookcic.co.uk` → label `Public`, colour cream.
4. Referrals folder is locked with a mailbox-level password if the provider allows, or restricted to desktop only. Never open on a shared laptop.
5. No forwarding of referral mail to third parties. If a partner needs to be looped in, reply-all from within the thread.

### 17.8 Future addresses (do not create yet)

- `donations@offthehookcic.co.uk` — split from `hello@` once you pass ten donors a month.
- `bookings@offthehookcic.co.uk` — only if you take on OpenTable or SevenRooms.
- `safeguarding@offthehookcic.co.uk` — when the safeguarding policy names a channel distinct from `referrals@`.

When any of these are added, update this appendix and the `RESEND_REPLY_TO_MAP` in the same PR.

---

**End of pack.** Docs 1-7 together cover PRD, art direction, IA, wireframes, motion, data model, and build handoff. When any document goes out of date during the build, update the document rather than the assumption in your head. The pack should stay the source of truth.
