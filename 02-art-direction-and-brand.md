# Off the Hook CIC — Art Direction and Brand Credentials

**Document 2 of 7.** Sets the visual and verbal system for the site, the CMS, and any collateral. Every downstream document (IA, wireframes, motion, tokens) references this file.

---

## 1. Brand positioning in one paragraph

Off the Hook is a working restaurant and a serious training academy that turns prison leavers into paid hospitality professionals. The brand should read like a modern independent restaurant with an editorial magazine behind it, not like a charity, not like a startup. Warm, grounded, confident. It respects the weight of the mission without leaning on pity, and it respects the craft of hospitality without pretending to be fine dining. The visual language is closer to a well-run neighbourhood restaurant with a story than to a social-sector logo lockup.

## 2. Brand personality

Six traits, in priority order. If two traits conflict on a design decision, the higher one wins.

1. **Grounded.** Real, not glossy. Real hands, real kitchens, real service.
2. **Warm.** Human at every touchpoint. Never institutional.
3. **Confident.** The plan is credible. The tone is not defensive.
4. **Editorial.** Considered typography, long-form storytelling, considered white space.
5. **Purposeful.** Everything on the page earns its place. No decoration for decoration's sake.
6. **Hopeful.** The story ends in work, qualifications, and stability. Not in the past.

Anti-traits (things the brand is not):
- Not clinical, not corporate, not startup-slick.
- Not sentimental, not pitying, not preachy.
- Not "gritty street" aesthetic. That does the mission a disservice.
- Not high-gloss fine dining. Wrong signal for the audience.
- Not "charity beige". Warmth is not the same as beige.

## 3. Brand story and naming

The name **Off the Hook** is doing two jobs at once: it references the hospitality craft (fish off the hook, service off the hook, "you're off the hook"), and it signals a second chance without saying "second chance". The site should let that double meaning do the work quietly, never explaining the pun.

Suggested tagline options, in order of preference:

1. **Real work. Real qualifications. Real chances.** (Three-beat, editorial.)
2. **Hospitality that rebuilds lives.** (Direct, for funder-facing headers.)
3. **A kitchen that turns records into references.** (Sharper, for press.)

Use tagline 1 as the site-wide default. Reserve 2 for funder and commissioner materials. Use 3 sparingly, for press and social.

## 4. Verbal identity

### Voice
British, warm, editorial. Same voice across the site, the admin, and the newsletter. Confident sentences. Room for a short one. Room for a longer, considered one. Never hype, never jargon, never charity-speak.

### Do
- Use plain English. If a plain word will do, use it.
- Name specifics: places, roles, numbers, dates.
- Speak to one person at a time (you, not "our stakeholders").
- Give the reader a next action on every page.
- Use present tense for what the programme does now. Past tense only for outcomes.

### Don't
- No em dashes anywhere.
- No hype adjectives: seamless, robust, revolutionary, game-changing, world-class, empowering, transformative, cutting-edge, innovative (as filler), powerful (as filler).
- No charity clichés: "changing lives", "making a difference", "giving back", "beneficiaries", "unlocking potential".
- No corporate filler: leverage, stakeholder, synergy, ecosystem, best-in-class.
- No AI tells: delve, tapestry, testament to, navigate the landscape, in today's fast-paced world.
- No emoji, no decorative glyphs in body copy.

### Sentence rhythm
Mix short and long. A three-word sentence next to a longer, considered one lands. Read every paragraph aloud in your head before shipping.

### Micro-copy patterns
- Buttons: verb first, plain. "Book a table", "Refer someone", "Talk to us", "See the impact".
- Empty states: warm, not clever. "Nothing here yet. Come back after the first service."
- Errors: specific, not generic. "This email address does not look right. Check the spelling and try again."
- Success: brief, human. "Thanks. We reply within two working days."

### Reading level
Aim for reading age 12 across public pages, reading age 10 on the `/join` page. Use hemingwayapp.com or Readable as a check.

## 5. Logo direction

The previous logo attempt was rejected as too generic. This section is a direction, not a final artwork. A logo pass is a separate task, but everything downstream should be built to accept the following system.

### Concept
A wordmark-led identity with an optional mark. The wordmark carries the personality. The mark is a quiet secondary asset used only in tight spaces (favicon, app icon, small header on mobile scroll).

### Wordmark
- Two words, stacked or inline, set in a considered display serif with real character (see type section).
- Slight optical adjustment so the terminal of the "k" and the "f" descenders feel connected without being cute.
- Weight: medium to semi-bold. Not thin editorial, not chunky display.
- The word "the" sits smaller and centered between "Off" and "Hook" in the stacked lockup, or a hair smaller in the inline lockup. Never all caps.

### Mark (optional, used sparingly)
Not a fish hook. That reading is too obvious and moves the brand toward "quirky restaurant". Instead, explore two directions and pick one in the artwork pass:

- **Direction A: The seam.** A single curved line that begins as one shape and resolves as another. Read as a stitch, a road, a route. Ties to the journey narrative.
- **Direction B: The set place.** A minimal shape that reads as a place setting seen from above (plate, cutlery abstracted to two marks). Ties to the restaurant.

Both marks should read cleanly at 16px (favicon) and at 400px (footer or press).

### Lockups
Provide four lockups in the final artwork:

1. Horizontal wordmark. Default for headers on desktop.
2. Stacked wordmark. For narrow spaces and social avatars.
3. Wordmark plus mark, horizontal. For press and printed collateral.
4. Mark only. For favicon, PWA icon, and small-screen scrolled header.

### Clear space and minimum size
Clear space equal to the x-height of the wordmark on all sides. Minimum digital size 24px for the mark, 96px width for the horizontal wordmark.

### What to avoid
- No knife-and-fork clichés.
- No hand-drawn "personal touch" scripts.
- No chef-hat imagery.
- No prison bars or breaking-chain visuals. Ever.

## 6. Colour system

Warm, editorial, restaurant-first. The palette pairs **forest green** as the accent with **cream** paper and **brown** ink. Green carries the mission (growth, groundedness, hospitality-with-heritage), cream keeps the surface appetite-friendly and editorial, brown holds the type in one tonal family. Two themes: **Cream Light** (default) and **Deep Brown Dark**. Both share the same forest accent so the brand is recognisable across modes.

### Palette (tokens, not final Pantones)

| Token | Hex | Role |
|---|---|---|
| `--ink-900` | `#1F1912` | Body text on light, headings. Deep espresso brown, warmer than black. |
| `--ink-700` | `#3D2F22` | Secondary text on light. Roasted-coffee brown. |
| `--ink-500` | `#6B5A45` | Tertiary text, captions. Aged-oak brown. |
| `--cream-50` | `#FAF5E9` | Page background on light. Warm cream, not yellow, not beige. |
| `--cream-100` | `#F3EBD8` | Card and section wash on light. |
| `--cream-200` | `#E7DBBF` | Divider and low-emphasis surface on light. |
| `--forest-600` | `#3E5E3A` | Primary accent. Grounded forest green, not eco-mint, not neon. Links, buttons, focus rings. |
| `--forest-700` | `#2E4A2C` | Accent hover and pressed. |
| `--forest-100` | `#DDE7D6` | Accent wash for callouts and highlighted quotes on light. |
| `--olive-500` | `#7A8A4A` | Secondary accent for tags (education, safeguarding). Restrained. |
| `--copper-500` | `#9C6A3E` | Tertiary accent for celebratory data points (qualifications achieved). Restrained. |
| `--night-950` | `#161210` | Page background on dark. Warm near-black brown. |
| `--night-900` | `#221B14` | Card wash on dark. |
| `--night-800` | `#2E241B` | Divider and low-emphasis surface on dark. |
| `--cream-25` | `#F7F1DF` | Body text on dark. |
| `--cream-350` | `#CFC0A0` | Secondary text on dark. |
| `--forest-500-dark` | `#5B7C56` | Forest accent used on dark theme (desaturated for eye comfort). |
| `--status-success` | `#3A6B4C` | Applied to success states only. Not a brand colour. |
| `--status-warning` | `#B4832A` | Applied to warning states only. |
| `--status-danger` | `#A63A2E` | Applied to danger states only. |
| `--status-info` | `#3A5A6B` | Applied to info states only. |

### Verified contrast
- `--ink-900` on `--cream-50`: 13.8:1 (AAA body).
- `--ink-700` on `--cream-50`: 9.1:1 (AAA body).
- `--forest-600` on `--cream-50`: 6.9:1 (AAA large, AA body).
- `--cream-25` on `--night-950`: 14.2:1 (AAA body).
- `--forest-500-dark` on `--night-950`: 5.4:1 (AA body).

### Contrast rules
- Body text on background: minimum 4.5:1.
- Large text (24px+ or 18.66px+ bold): minimum 3:1.
- UI components and graphical objects: minimum 3:1.
- Do not put forest text on forest wash for body copy. Only for callouts with a border.

### Colour usage rules
- One accent per screen. Forest is the workhorse. Olive and copper appear only where their meaning applies (education tag, qualification data).
- No gradients on brand surfaces at launch. This appears in the layout rules too. A single soft radial cream wash is allowed behind the hero image if it earns its keep.
- Status colours never used as brand colours.
- Dark mode is not just an inverted palette. It uses `--night-*` for surfaces and swaps `--forest-600` for `--forest-500-dark` (slightly desaturated and lifted) for eye comfort.
- Never combine forest with red or orange accents. The palette is forest, cream, brown, with olive and copper as restrained cousins.
- Never use pure white. Cream is the lightest surface in the system.

## 7. Typography

Two typefaces. One display, one text. Both free, both robust, both editorial in feel.

### Display: **Fraunces**
- Variable serif with real personality. Softens under weight, sharpens at large sizes.
- Use for: H1, H2, editorial pull quotes, hero taglines, section labels at 12-14px small caps.
- Weight defaults: H1 600 (semi-bold), H2 500, H3 500.
- Optical size: use `opsz` to keep large sizes elegant and small sizes readable.
- Licence: Open Font License. Self-host via Fontsource.

Alternative if Fraunces feels too warm for a specific use: **GT Sectra** (paid). Do not mix Fraunces and GT Sectra on the same site.

### Text: **Inter**
- Neutral, highly readable UI sans. Pairs well with Fraunces because Fraunces carries the character.
- Use for: body copy, UI labels, buttons, forms, captions, admin.
- Weight defaults: body 400, emphasis 500, buttons 500, admin table headings 600.
- Licence: OFL. Self-host via Fontsource.

Alternative for a slightly warmer sans: **Manrope** or **Söhne** (paid). Only if we want to distance from every SaaS product that also uses Inter.

### Type scale (fluid)

Base 16px, minor-third scale, fluid between 375px and 1440px viewports.

| Token | Element | Mobile | Desktop | Line height | Tracking |
|---|---|---|---|---|---|
| `--fs-display` | Hero H1 | 44px | 84px | 1.02 | -0.02em |
| `--fs-h1` | Page H1 | 34px | 56px | 1.05 | -0.015em |
| `--fs-h2` | Section H2 | 28px | 40px | 1.1 | -0.01em |
| `--fs-h3` | Card H3 | 22px | 26px | 1.2 | -0.005em |
| `--fs-lead` | Lead paragraph | 18px | 20px | 1.5 | 0 |
| `--fs-body` | Body | 16px | 17px | 1.6 | 0 |
| `--fs-small` | Caption, label | 14px | 14px | 1.5 | 0.01em |
| `--fs-mono` | Data figures | 16px | 20px | 1.2 | 0 |

### Measure and rhythm
- Body copy measure: 62-72 characters. Enforce with `max-width: 68ch` on prose containers.
- Vertical rhythm: 8px baseline. Section paddings in multiples of 8.
- Numerals in impact tiles: tabular-nums on, so counting-up animations do not jitter.

### What to avoid
- No all-caps for long labels. Small caps in Fraunces only.
- No condensed weights.
- No decorative script fonts.
- No underlines on non-links.

## 8. Iconography

- Line icons, 1.5px stroke, rounded joins.
- Set: Lucide (open source, matches Inter well).
- No filled icons in the main UI. Filled only for status pills.
- Icon size scale: 16, 20, 24, 32. Stick to these.
- Custom icons only for the Journey timeline steps. Seven bespoke icons commissioned in the illustration pass (see section 10).

## 9. Photography direction

The single fastest way to make this site read as premium hospitality with weight. Weak imagery will undo everything else.

### Principles
- Real hands, real kitchens, real service. No stock chef-hat cliches.
- Warm, natural light. Late-afternoon and early-evening kitchen light preferred.
- Grain is allowed. Over-sharpened HDR is not.
- Motion blur on hands and service is welcome. It suggests a working kitchen.
- Portraits at eye level, not from above. Never patronising angles.

### Colour and grade
- Warm colour temperature (3200-4000K). Slight lift in shadows, deep but not crushed.
- Skin tones honest. No orange, no over-desaturation.
- Consistent grade across the whole set. One LUT, one grade, applied uniformly.

### Composition
- Mid-shots and close-ups outnumber wides two-to-one.
- Rule of thirds where useful. Central composition allowed for portraits.
- Include hands, plates, and process, not only finished dishes.

### Subjects
- Prep: knife work, dough, herbs, mise en place.
- Service: passing plates, table interactions, staff briefings.
- Training moments: a lead chef showing a technique, a small-group session.
- Portraits of Anne, staff, and (with explicit consent) trainees.
- Details: aprons, tickets, the pass, the printer, a stack of clean plates.

### Do not
- No prison-related imagery on the public site. Not bars, not cells, not silhouettes behind fences.
- No stock images of hands in handcuffs, no shadow-figure metaphors.
- No fine-dining plating shots with tweezers.
- No fake diversity casting.

### Interim plan (before real photography exists)
Curated stock set from Death to Stock, Stocksy, and Unsplash Plus, with a written brief:
- Search terms: "restaurant kitchen prep", "London bistro service", "hospitality training", "chef mise en place", "kitchen ticket printer".
- Rule of five: no more than five stock images total on the whole site at launch. Everything else is text-led until real photography lands.

### Booked photography plan
- One-day shoot within the first 12 weeks of launch. Photographer with editorial (not commercial) portfolio.
- Deliverables: 40 hero-grade images, 20 portrait crops, 20 detail shots, all in landscape and 4:5 crops.
- Rights: perpetual, unlimited, all channels.

## 10. Illustration and mark-making

Illustration is used sparingly and only for the Journey timeline and impact page decoration.

- Style: single-line, warm ink, hand feel, kept restrained.
- Seven journey icons: one per step (Prison, Referral, Induction, Training, Service, Qualification, Employment). Not literal. Suggestive. For example, "Induction" might be a small key resting on a plate, "Service" might be a rising line that becomes a plate rim, "Qualification" might be a folded certificate simplified to two strokes.
- Rendered as inline SVG for scale and dark-mode inversion.
- No isometric illustrations. No mascots.

## 11. Layout system

- **Grid.** 12-column on desktop with 24px gutters, 8-column on tablet with 20px gutters, single column on mobile with 16px page padding.
- **Container widths.** Standard 1200px, wide 1440px (used sparingly for hero and impact grid), narrow 720px for prose.
- **Section rhythm.** 96-128px top and bottom padding on desktop, 64-80px on mobile. Consistency is what makes an editorial layout feel considered.
- **White space.** Generous, not empty. If a section feels crowded, cut content, not padding.
- **Card style.** Soft radius (12px), 1px `--cream-200` border, `--cream-100` background on light. Elevation used sparingly and only on hover for interactive cards. Shadow: `0 1px 2px rgba(31,25,18,0.04), 0 8px 24px rgba(31,25,18,0.06)`.
- **Buttons.** Solid forest for primary, ghost with forest border for secondary, text link with underline offset for tertiary. Height 44px minimum on mobile.

## 12. Interaction and motion principles (full choreography in Doc 5)

- Motion has meaning. If it does not aid comprehension or delight in a way that fits the tone, cut it.
- Easings: two, no more. `cubic-bezier(0.2, 0.7, 0.2, 1)` for enters, `cubic-bezier(0.4, 0, 0.2, 1)` for exits. Framer Motion `type: "tween"` with these curves, or Motion One equivalents.
- Durations: 200ms micro, 400ms section reveal, 800ms hero settle. Anything longer must earn it.
- Respect `prefers-reduced-motion`. All non-essential motion collapses to opacity fades under 100ms.
- Hover states on desktop only. No hover state should hide critical information.
- Focus states always visible. Never rely on colour alone.

## 13. Accessibility rules that override aesthetics

- Colour contrast rules (section 6) are absolute.
- Focus rings visible on every focusable element. 2px outline in `--forest-600` on light, 2px outline in `--cream-25` on dark.
- Line length capped at 72 characters for prose.
- Icon-only buttons carry an `aria-label`.
- All images have descriptive alt text or `role="presentation"` if purely decorative.
- No content shifts on load. Reserve space for images and lazy-loaded blocks.

## 14. Design tokens (naming, full spec in Doc 7)

Tokens are the contract between design and code. Names below match the CSS variables that will live in `app/globals.css` in the Next.js repo.

Groups:
- `--color-*` (all palette entries in section 6).
- `--fs-*` (all type sizes in section 7).
- `--lh-*` and `--tracking-*` (line height and tracking).
- `--space-1` through `--space-16` (4px, 8px, 12px, 16px, 20px, 24px, 32px, 40px, 48px, 64px, 80px, 96px, 128px, 160px, 192px, 240px).
- `--radius-sm` 6px, `--radius-md` 12px, `--radius-lg` 20px, `--radius-full` 999px.
- `--shadow-sm`, `--shadow-md`, `--shadow-lg` per the layout section.
- `--ease-enter`, `--ease-exit` per motion.
- `--dur-fast` 200ms, `--dur-med` 400ms, `--dur-slow` 800ms.

Tokens are surfaced to Tailwind v4 via the CSS-first config (`@theme`) so class names such as `text-ink-700`, `bg-paper-100`, `text-ember-600` map directly. Doc 7 has the full mapping.

## 15. Reference set

Not for copying. For direction.

- **The Clink Charity** for tone-of-mission credibility.
- **St. JOHN restaurant (stjohnrestaurant.com)** for editorial restraint and typographic confidence.
- **Toklas Restaurant (toklaslondon.com)** for warmth without gloss.
- **Migrateful** for community-plus-restaurant positioning.
- **Wildfarmed** for editorial storytelling on a food site.
- **Toast Ale** for cause-plus-craft narrative.
- **Rapha Journal** and **MR PORTER Journal** for editorial layout and long-form reading.
- **Framer restaurant templates** for interaction reference only, not visual reference.

Do not copy any of these. The brand should feel like Off the Hook, not like a mash-up.

## 16. Anti-patterns to reject at design review

- A hero photo that is a plated dish with tweezers on a black slate. Wrong signal.
- A stock image of hands in handcuffs. Instant rejection.
- A "before and after" split image of a person's face. Instant rejection.
- Gradient buttons.
- Purple. Off the Hook is forest green, cream, and brown, not tech purple.
- Orange or red accents. They fight the forest and pull the brand toward fast-food warmth.
- Bright emerald or mint green. This is a grounded forest, not eco-startup green.
- Pure white surfaces. Cream is the lightest surface in the system.
- Any icon of a cheque, a heart, or a rising bar chart as decoration.
- All-caps navigation.
- Skeleton loaders that ripple. Use a static soft placeholder in `--cream-100`.

## 17. Deliverables produced under this document

Once approved, this document produces:

1. A `/design` route in the Next.js app that renders every token, type sample, colour, spacing, component, and state. This is the living style guide and it replaces Figma for handoff.
2. A `/brand` press-and-partners page (not linked in the main nav) with logo files (SVG, PNG at 1x/2x, favicon set), colour references, and tone-of-voice notes for partners who want to co-brand.
3. A `brand.md` in the repo root capturing sections 1-4 for quick reference by future collaborators.

## 18. Acceptance for this document

This document is accepted when Abiodun signs off on:
- The palette (section 6) and typography (section 7).
- The logo direction (section 5), pending the artwork pass.
- The photography direction (section 9).
- The tone-of-voice rules (section 4).

Once accepted, Doc 3 (Sitemap and IA) is the next lock-in.

---

**Next document:** `03-sitemap-and-ia.md` — full page tree, navigation logic, URL structure, breadcrumb rules, and where each user persona enters and exits the site.
