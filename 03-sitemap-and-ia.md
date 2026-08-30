# Off the Hook CIC — Sitemap and Information Architecture

**Document 3 of 7.** Full page tree, URL structure, navigation logic, breadcrumb rules, and per-persona entry and exit paths. This document assumes the personas, scope, and stack locked in Doc 1, and the visual language and tone locked in Doc 2 (forest, cream, brown).

---

## 1. Principles

Six rules that govern every navigation decision on the site.

1. **One purpose per page.** Every page answers exactly one question a specific persona is asking. If a page needs two answers, split it.
2. **Two-click rule.** Any primary action (Book, Refer, Talk to us, Support us) is reachable in at most two clicks from any page.
3. **Editorial over exhaustive.** The nav shows the six pages that matter, not every page that exists. Long-tail pages live in the footer.
4. **Audience-led secondary nav.** Under `/partners`, the sub-pages are named for the audience (funders, referrals, employers, education), not the mechanism.
5. **Restaurant is a first-class citizen.** It carries the mission and the money. It sits in the primary nav next to About, not tucked away.
6. **No mystery meat.** Every label in the nav is a plain noun or plain verb. No "Discover", no "Journey" as a nav label (the section is called Journey inside `/join`, but a nav label would be too abstract).

## 2. Primary navigation

Six items in the header, in this order:

1. **The restaurant** (`/restaurant`)
2. **The academy** (`/journey`) — the label people click, the URL that matches the mission
3. **Our impact** (`/impact`)
4. **For partners** (`/partners`) — dropdown to funders, referrals, employers, education
5. **About** (`/about`)
6. **Support us** (`/support`) — primary CTA styled as a button, forest solid

A secondary button in the top-right on desktop: **Book a table** (`/restaurant/book`), forest solid.

On mobile, the header collapses to a logo left, hamburger right. The mobile menu opens as a full-height sheet from the right with the same six items and a **Book a table** button pinned at the bottom of the sheet.

### Header behaviour
- Sticky. Reduces height from 88px to 64px on scroll past 120px. Logo shrinks proportionally.
- Backdrop shifts from transparent (over hero) to `--cream-50` with a 1px `--cream-200` bottom border once sticky.
- Never hides on scroll. Users need it to book at any moment.

## 3. Footer navigation

Four columns on desktop, stacked on mobile. Not a dump of every URL. Only what belongs.

**Column 1 — Off the Hook**
- About us (`/about`)
- The team (`/about/team`)
- News and updates (`/news`)
- Contact (`/contact`)

**Column 2 — Eat with us**
- The restaurant (`/restaurant`)
- Menu (`/restaurant/menu`)
- Private events (`/restaurant/events`)
- Book a table (`/restaurant/book`)

**Column 3 — Get involved**
- Refer someone (`/partners/referrals`)
- Fund the work (`/partners/funders`)
- Hire a graduate (`/partners/employers`)
- Volunteer (`/support/volunteer`)
- Donate (`/support/donate`)

**Column 4 — The small print**
- Privacy (`/legal/privacy`)
- Cookies (`/legal/cookies`)
- Safeguarding (`/legal/safeguarding`)
- Accessibility (`/legal/accessibility`)
- CIC declaration (`/legal/cic-declaration`)
- Modern Slavery statement (`/legal/modern-slavery`) — required once trading

Below the columns, a slim strip:
- CIC registration number (once trading)
- Registered office
- Copyright notice
- Two icon links: Instagram, LinkedIn (no icon soup, just those two at launch)

## 4. Full page tree

```
/
├── /about
│   └── /about/team
├── /restaurant
│   ├── /restaurant/menu
│   ├── /restaurant/events
│   └── /restaurant/book
├── /journey                    (the academy: how training works)
├── /impact
├── /stories
│   └── /stories/[slug]
├── /partners
│   ├── /partners/funders
│   ├── /partners/referrals
│   ├── /partners/employers
│   └── /partners/education
├── /join                        (for prospective trainees)
├── /support
│   ├── /support/donate
│   └── /support/volunteer
├── /contact
├── /news
│   └── /news/[slug]
├── /legal
│   ├── /legal/privacy
│   ├── /legal/cookies
│   ├── /legal/safeguarding
│   ├── /legal/accessibility
│   ├── /legal/cic-declaration
│   └── /legal/modern-slavery
├── /brand                       (unlinked from main nav, for press/partners)
├── /design                      (unlinked, living style guide for internal use)
└── /admin                       (auth-gated CMS)
    ├── /admin/pages
    ├── /admin/stories
    ├── /admin/impact
    ├── /admin/menu
    ├── /admin/events
    ├── /admin/partners
    ├── /admin/enquiries
    ├── /admin/referrals         (safeguarding role only)
    ├── /admin/bookings
    ├── /admin/subscribers
    ├── /admin/users
    └── /admin/settings
```

## 5. Per-persona entry and exit paths

The site is designed so each primary persona can enter, get what they need, and act, without ever needing to touch a page that was not written for them.

### Persona 1 — Commissioner or funder

**Entry.** Direct link from a foundation report, a Google search for "prison leaver hospitality London", a LinkedIn post by Anne, or a warm intro email.

**Optimal path.**
1. Land on `/` or on `/impact`.
2. Read `/impact` (numbers with dates, sources, model summary).
3. Skim `/journey` (understand the model end to end in 90 seconds).
4. Go to `/partners/funders` (funder-specific tone, what a partnership looks like, existing partners, contact form).
5. Submit the funders form. Success page with a two-working-day SLA and a calendar link if Anne wants to publish one.

**Exit.** Success page or an inbound email response from Anne within two working days.

**Backup path if they land on `/`.** The hero has a secondary CTA "See the impact" and the third section of the home page is the Impact strip that links deep into `/impact`.

### Persona 2 — Referral partner

**Entry.** A resettlement charity's link list, a prison education officer's shared bookmarks, a probation service internal document, or a direct link Anne has shared in a partnership call.

**Optimal path.**
1. Land on `/partners/referrals`.
2. Read eligibility, intake process, safeguarding named lead, response time.
3. Submit the referral form.
4. Success page with a phone number for urgent cases and an acknowledgement email SLA.

**Exit.** Confirmation email within 30 seconds, follow-up from Anne within one working day.

**Backup path.** From `/`, "For partners" dropdown, "Refer someone".

### Persona 3 — Diner or event booker

**Entry.** Google search for "restaurant with a social mission London", a friend's recommendation, an Instagram post, or press coverage.

**Optimal path.**
1. Land on `/restaurant`.
2. See the menu, location, price range, atmosphere images.
3. Tap **Book a table**.
4. Fill the short form on `/restaurant/book`.
5. Success page.

**Exit.** Confirmation email within 30 seconds. Reminder email 24 hours before booking.

**Backup path for events.** From `/restaurant`, secondary CTA "Host a private event" links to `/restaurant/events` with a separate enquiry form.

### Persona 4 — Trainee or applicant

**Entry.** Word of mouth inside prison or a hostel, a probation officer's recommendation, a social post, or a printed card.

**Optimal path.**
1. Land on `/join`.
2. Read a plain-English intro (reading age 10-12).
3. See the Journey timeline explaining what happens week by week.
4. Fill the interest form (name or alias, phone, best time to call).
5. Success page with a phone number and the safeguarding lead's first name.

**Exit.** A phone call from Anne or the training lead within two working days, or an SMS acknowledgement (phase two).

**Backup path.** Prominent "Interested in training with us?" strip at the bottom of `/journey` and `/stories`.

### Persona 5 — Employer partner

**Entry.** LinkedIn, an HR peer's recommendation, or a hospitality-industry press piece.

**Optimal path.**
1. Land on `/partners/employers`.
2. Read what graduates bring, retention data (once it exists), how the pipeline works.
3. Submit the employer form.
4. Success page.

**Exit.** Response from Anne within two working days.

## 6. URL structure rules

- All URLs lower-case, hyphenated, no trailing slash. `/partners/funders` not `/Partners/Funders/`.
- No dates in URLs for evergreen pages. `/impact` not `/impact/2026`.
- Blog posts use a slug only, not a date: `/news/anne-on-radio-4`. Date lives in the article header, not the URL.
- Story pages use a slug that respects consent and privacy: `/stories/john-in-the-kitchen` where "John" is either a real first name (with consent) or an alias.
- Query strings only for filters that are safely bookmarkable: `/impact?year=2027` is fine, but a query string is never used for authentication or state that must persist.
- Trailing slash policy: none. Enforce with a Next.js redirect.
- Legacy URL redirects: reserve now for `/donate` → `/support/donate`, `/refer` → `/partners/referrals`, `/menu` → `/restaurant/menu`, `/book` → `/restaurant/book`. Short URLs are useful on printed cards and social bios.

## 7. Breadcrumbs

Breadcrumbs are used only where they help.

**Show breadcrumbs on:**
- `/restaurant/*` (Restaurant > Menu, Restaurant > Events, Restaurant > Book)
- `/partners/*` (For partners > Funders, etc.)
- `/support/*` (Support us > Donate, Support us > Volunteer)
- `/stories/[slug]` (Stories > "Title of the story")
- `/news/[slug]` (News > "Title of the post")
- `/legal/*` (The small print > Privacy, etc.)
- `/admin/*` (always, for orientation)

**Do not show breadcrumbs on:** the home page, `/about`, `/journey`, `/impact`, `/join`, `/contact`. These are single-purpose top-level pages. Breadcrumbs would be noise.

Breadcrumbs sit under the header, top of the page, in `--ink-500` at 14px. The current page is the last item and is not a link.

## 8. Navigation state and behaviour

**Active page indicator.** The current top-level nav item shows a 2px `--forest-600` underline offset by 6px from the text baseline. Never colour the text itself, that reduces contrast.

**Dropdowns.** "For partners" is the only header dropdown. Opens on hover with a 150ms delay to avoid accidental triggers, opens on click on touch devices. Contains the four sub-pages with a one-line description each.

**Focus order.** Logo, primary nav items in visible order, Support us button, Book a table button, then the main content. Skip-to-content link (visually hidden until focused) as the first tab stop.

**Keyboard shortcut.** `/` focuses the search field on `/news` and `/stories`. Otherwise no keyboard shortcuts to keep the surface simple.

## 9. Search

Search is available on `/news` and `/stories` only at launch. Global site search is deferred to phase two — with under 25 pages, a good IA does the job better than a search box.

Search behaviour:
- Case-insensitive, matches title, tags, and body preview.
- Client-side for stories (small dataset), server-side for news posts if the archive grows past 40 posts.
- No auto-suggest at launch. Add later if analytics show demand.

## 10. Home page as a hub

The home page is the only page that touches every persona. Its job is not to explain everything. Its job is to route each persona to their page as fast as possible without making the home page feel like a menu.

**Home page routes explicitly to:**
- `/restaurant` (Book a table primary CTA in the hero)
- `/impact` (Impact strip section)
- `/journey` (Journey timeline section anchor plus "See the full journey" CTA)
- `/partners/funders`, `/partners/referrals`, `/partners/employers` (CTA band near the bottom, three tiles)
- `/join` (a warm one-liner "Been referred to us? Start here" near the CTA band)
- `/support/donate` (footer CTA and header button)

Full home page wireframe lives in Doc 4.

## 11. 404 and error pages

**404.** Warm, on-brand. Cream background, forest illustration of an empty plate, one sentence explaining what happened, two links: home and contact. No stock 404 imagery.

**500.** Same tone as 404 but with a "we've been alerted" line. Sentry captures the error server-side.

**403 (referrals area for wrong role).** Custom message: "You do not have access to this area. If you are a member of the safeguarding team, sign in with your work email."

## 12. Navigation for the admin

The admin sidebar has its own IA, ordered by frequency of use.

1. **Overview** (`/admin`) — a small dashboard showing new enquiries, new bookings, and new referrals since last visit.
2. **Enquiries** — the shared inbox, tabbed by audience (Funders, Referrals, Bookings, Employers, General).
3. **Content**
   - Pages
   - Stories
   - News
4. **Data**
   - Impact metrics
   - Journey steps
5. **Restaurant**
   - Menu
   - Events
6. **Partners**
7. **Subscribers**
8. **Users and roles** (admin only)
9. **Settings**

The sidebar collapses to icons on narrow viewports. Referrals is not shown to editors or viewers, only to `safeguarding` and `admin` roles.

## 13. Meta and social

Every public page sets:
- `<title>` — page-specific, ends in " · Off the Hook".
- `<meta name="description">` — 140-160 characters.
- Open Graph and Twitter card meta with a page-specific 1200×630 image.
- Canonical URL.
- Structured data:
  - `Organization` on `/`, `/about`.
  - `Restaurant` on `/restaurant` and `/restaurant/menu`.
  - `Event` on `/restaurant/events` and each event.
  - `Article` on each news post.
  - `BreadcrumbList` on any page with breadcrumbs.

Sitemap generated on build. `robots.txt` allows all except `/admin/*` and preview paths.

## 14. Analytics events per page

Each page fires a small set of PostHog events. Full list in Doc 6, but the pattern for IA is:

- `page_view` on every page load (default).
- `cta_click` with `page`, `label`, `destination` on any primary or secondary CTA.
- `form_submit_success` and `form_submit_error` on every form.
- `story_open` on any story page load.
- `impact_year_filter_change` on year toggle.

## 15. Redirects and vanity URLs

Registered from day one so print, social, and word-of-mouth work:
- `/book` → `/restaurant/book`
- `/menu` → `/restaurant/menu`
- `/refer` → `/partners/referrals`
- `/fund` → `/partners/funders`
- `/hire` → `/partners/employers`
- `/donate` → `/support/donate`
- `/volunteer` → `/support/volunteer`
- `/train` → `/join`

## 16. Accessibility of navigation

- Header nav is a `<nav aria-label="Primary">` with a `<ul>` of items.
- Dropdown uses `aria-expanded` and closes on `Escape`.
- Mobile menu traps focus while open and returns focus to the hamburger on close.
- Skip link "Skip to main content" is the first tab stop on every page.
- Breadcrumbs use `<nav aria-label="Breadcrumb">` with an ordered list.

## 17. Acceptance for this document

This document is accepted when Abiodun signs off on:
- The primary nav (six items in the given order).
- The full page tree.
- The five persona paths.
- The URL structure rules and vanity redirects.

Once accepted, Doc 4 (Page Wireframes) is the next lock-in.

---

**Next document:** `04-page-wireframes.md` — section-by-section wireframes for every page in the tree, in structured text form the build can implement directly against.
