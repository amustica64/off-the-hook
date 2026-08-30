# Off the Hook CIC — Master PRD

**Document 1 of 7 in the Off the Hook design and build handoff pack.**
Owner: Abiodun Amusa (build lead) for Anne Kiragu (founder).
Version: 1.0. Draft date: 22 July 2026.
Stack target: Next.js 15 (App Router) on Vercel, Supabase (Postgres, Auth, Storage, Edge Functions), GitHub for source and CI. No Figma. Design system lives in code.

---

## 1. Executive summary

Off the Hook is a hospitality-led social enterprise in England, registered as a Community Interest Company, that trains people leaving prison into paid restaurant work and nationally recognised qualifications. The website is not a brochure. It is the public face of a training academy, a working restaurant, and a partnership platform, and it has to hold three jobs at once: convince funders the model is credible, help referral partners send people in, and give the public a reason to book a table or an event.

This PRD covers the marketing site and the first slice of the platform layer: a public site with editorial storytelling, a small booking and enquiry surface, a partners area, an impact page backed by real data, and an admin CMS Anne can run herself. Everything is designed to ship in phases without rebuilding.

## 2. Problem statement

England has around 88,000 people in prison, one of the highest imprisonment rates in Western Europe, and roughly 63% of people on short sentences reoffend within a year of release. Employment is the single biggest lever against that number, and hospitality is one of the few sectors that will hire on skill rather than record if the training is credible. The Clink Charity has proved the model works: about 5,000 people trained since 2009 and around 2,600 City and Guilds qualifications delivered.

Anne has the plan, the lived experience, and now the CIC registration. What she does not have is a public presence that matches the ambition of the plan. The current prototype was rejected because the logo was weak, motion was minimal, and there was no proper UX specification. She needs a site that reads as a serious hospitality brand with a social mission, not a template charity page, and she needs it to be built once, updated by her, and grown in phases without a rebuild.

## 3. Goals and success metrics

| Goal | Metric | Target (first 12 months live) | How it will be measured |
|---|---|---|---|
| Attract funders and commissioners | Qualified funder or commissioner enquiries via the site | 25 in year one | Contact form category, CRM tag |
| Enable referrals from partners | Referral form submissions from probation, prison education, charities | 60 in year one | Referral form, Supabase table |
| Build a paying restaurant and events audience | Table and event booking requests | 400 booking requests in year one | Booking form, Stripe metadata |
| Prove impact publicly | Live impact page updated at least quarterly | 4 updates minimum, no more than 90 days between updates | CMS `updated_at` on impact metrics |
| Editable by Anne without a developer | Percentage of content changes made by Anne herself | 80% of content edits after month two | Admin activity log |
| Search-visible for the right terms | Ranks in top 10 UK results for phrases such as "prison leaver hospitality training London", "restaurant apprenticeship for ex-offenders", "social enterprise catering commissioner" | Top 10 for at least six target phrases by month nine | Google Search Console |
| Fast and accessible | Lighthouse mobile scores | Performance 90+, Accessibility 95+, Best Practices 100, SEO 100 | Lighthouse CI in GitHub Actions |

## 4. Audiences and personas

Four primary personas, one secondary. Everything on the site should serve at least one of these people. If a section serves none of them, cut it.

### Persona 1 — Commissioner or funder (primary)
Name-shape: Sarah, mid-40s, senior programme lead at a local authority or a grant-making foundation such as National Lottery Community Fund, Bromley Trust, or a Ministry of Justice contract manager.
Goals: find social enterprises that reduce reoffending in a measurable way, with a credible operating team and a clear route to sustainability.
Frustrations: charity websites that talk about mission but hide the numbers, no evidence of outcomes, no obvious way to start a conversation.
What she needs from the site: impact data with dates, the model explained end to end, a founder story with weight, one clear route to a meeting.
Tech savviness: high. Will read on desktop, probably at work.

### Persona 2 — Referral partner (primary)
Name-shape: Mark, prison education lead or probation officer, or a case worker at a resettlement charity such as St Giles Trust or Bounce Back.
Goals: refer suitable candidates into a programme that will actually take them, with a clear intake process and honest expectations.
Frustrations: unclear eligibility, no response to referrals, programmes that quietly select only the easiest cases.
What he needs from the site: a plain-English page for referral partners, a simple referral form that captures the right information, response time commitments, safeguarding named lead.
Tech savviness: medium. Likely on a work-issued laptop, sometimes on mobile.

### Persona 3 — Diner or event booker (primary)
Name-shape: Priya, 30s, London-based, books restaurants and small events for herself and for a small marketing team.
Goals: eat well, book easily, feel that her money is going somewhere meaningful.
Frustrations: social enterprise restaurants that feel like a duty visit rather than a good meal.
What she needs from the site: menu, location, prices, a booking form that works on her phone in under two minutes, images that make her actually want to come.
Tech savviness: high, mobile-first.

### Persona 4 — Trainee or applicant (primary)
Name-shape: Danny, 20s to 40s, referred by probation or self-referring after hearing about the programme from someone inside or through a resettlement charity.
Goals: get a real job, a real qualification, and not be treated as a case number.
Frustrations: complicated forms, jargon, being asked about his record before being told what the programme actually is.
What he needs from the site: a page that explains the journey in his language, phone-first, with a short interest form and a phone number he can call.
Tech savviness: variable. Often mobile-only, sometimes on a shared library or hostel computer.

### Persona 5 — Employer partner (secondary)
Name-shape: Ella, head of people at a hospitality group with 3 to 30 sites, considering hiring graduates from the programme.
Goals: reliable recruitment pipeline, evidence graduates stay in role, a low-friction way to sign up.
What she needs from the site: employer partners page, a pledge or expression-of-interest form, retention data once it exists.

## 5. Scope

### In scope for the first release
- Public marketing site with all pages listed in section 8.
- Interactive Journey timeline explaining referral to employment.
- Impact dashboard with animated numeric tiles and year filters.
- Stories carousel with real names and images once available, and a considered placeholder system until then.
- Contact forms segmented by audience (funder, referral partner, employer, diner, general).
- Referral form with safeguarding-appropriate fields and secure storage.
- Booking enquiry form for table reservations and private events.
- Newsletter sign-up.
- Full CMS covering pages, stories, impact metrics, menu items, events, partners, and settings.
- Admin dashboard for Anne with role-based access.
- Analytics, error tracking, and a simple weekly email digest of activity.
- Legal pages (privacy, cookies, safeguarding statement, accessibility statement, CIC declaration).
- Search-engine essentials: sitemap, structured data, Open Graph images, canonical URLs.
- Dark mode with an editorial not-a-toggle-gimmick feel.

### In scope for phase two (documented, not built at launch)
- Online table booking with real availability and Stripe deposits.
- Ticketed events with waitlists.
- Donations flow with GiftAid claim data.
- Trainee portal with course progress, timetable, safeguarding contacts, wellbeing check-ins.
- Employer partner pledge tracking.
- Impact PDF export.

### Explicitly out of scope
- Full point-of-sale for the restaurant. That is a separate system.
- Full HR or rota system for staff.
- Payroll and finance. Handled elsewhere.
- Any feature that stores criminal-record detail on the public site.

## 6. User stories and acceptance criteria

Format: as a persona I want an action so that I get an outcome. Priority uses MoSCoW.

### Public marketing

1. **Must** — As a **commissioner**, I want to understand the operating model in under two minutes so that I can judge whether to book a meeting.
   Given I land on the home page from a Google search, when I scroll from the hero to the Journey section, then I see a seven-step timeline (Prison, Referral, Induction, Training, Service, Qualification, Employment) with a one-sentence description for each step and a visible route to "Talk to us".

2. **Must** — As a **funder**, I want up-to-date impact data on the site so that I do not have to email for it.
   Given I visit `/impact`, when the page loads, then I see the impact tiles with the numbers, the source, and a last-updated date within the last 90 days.

3. **Must** — As a **referral partner**, I want a page written for me so that I know exactly how referrals work.
   Given I visit `/partners/referrals`, when the page loads, then I see eligibility criteria, the intake process, the safeguarding named contact, average response time, and a referral form.

4. **Must** — As a **diner**, I want to make a booking enquiry from my phone in under two minutes so that I actually complete it.
   Given I am on `/restaurant` on a phone, when I tap "Book a table", then a short form loads without a page jump, and on submit I see a confirmation and receive an email within 30 seconds.

5. **Must** — As a **trainee**, I want a page written in plain English so that I understand what I am applying to.
   Given I visit `/join`, when the page loads, then I see a short intro at reading age 12, a Journey timeline, and an interest form asking only what is needed for a first conversation.

6. **Should** — As a **visitor**, I want the site to feel serious and warm rather than corporate or churchy, so that the mission reads as credible.
   Given I compare Off the Hook to peer sites (Clink, Bounce Back, generic charities), when I read the home page, then the tone reads as editorial and confident, not as pity or hype.

7. **Should** — As a **partner**, I want an obvious donate route so that I can support without a phone call.
   Given I am on any page, when I look at the header or footer, then I can find a Support or Donate route in one glance. (Live payments in phase two, expression of interest at launch.)

### CMS and admin

8. **Must** — As **Anne**, I want to edit page content without a developer so that I can keep the site current.
   Given I am logged in as an admin, when I open the CMS, then I can edit hero copy, mission copy, and any editable block, save the change, and see it live within 60 seconds with a preview before publishing.

9. **Must** — As **Anne**, I want to add a new Story so that I can share a trainee outcome quickly.
   Given I am in the admin, when I click "New Story", then I can add a name (or alias), role, before-line, now-line, image, quote, and consent flag, and it appears on the Stories page after publishing.

10. **Must** — As **Anne**, I want to update Impact metrics so that the numbers on the site reflect reality.
    Given I am in the admin, when I edit a metric, then the change is versioned, the `updated_at` field is refreshed, and the public tile shows the new figure.

11. **Must** — As **Anne**, I want to manage menu items and events so that the restaurant page stays fresh.
    Given I am in the admin, when I add a menu item, then I can set name, description, price, allergens, dietary tags, and availability window, and the item appears on `/restaurant` within the availability window.

12. **Must** — As **Anne**, I want to see form submissions in one place so that I do not miss enquiries.
    Given a form is submitted, when I open the admin, then I see the submission with audience tag, priority, time, and a one-click reply-by-email link, and I can mark it Open, In Progress, or Closed.

13. **Should** — As **Anne**, I want a weekly email digest so that I get a pulse without logging in every day.
    Given it is Monday 08:00 UK time, when the digest job runs, then Anne receives an email with counts of new bookings, referrals, funder enquiries, story publishes, and top three items to action.

### Safeguarding and data

14. **Must** — As a **safeguarding lead**, I want personal data to be minimised and access-controlled so that we meet UK GDPR and CIC social-mission expectations.
    Given a referral is submitted, when it is saved, then only staff with role `safeguarding` or `admin` can read it, all reads are logged, and no criminal-record detail is collected on the public site.

15. **Must** — As a **subject of a story**, I want to grant and withdraw consent so that my image and quote are only used with my permission.
    Given a story has consent status `pending` or `withdrawn`, when the site renders, then the story is not displayed publicly and the admin shows a warning until consent is `granted`.

16. **Should** — As a **user**, I want to see a clear cookies notice so that I know what is stored.
    Given I visit the site for the first time, when the page loads, then a cookies banner appears with granular categories (essential, analytics, marketing), and my choice is stored for 180 days.

### Performance and access

17. **Must** — As a **visitor on a slow connection**, I want the site to load quickly so that I do not leave.
    Given a 3G connection on a mid-range Android, when I open the home page, then Largest Contentful Paint completes in under 2.5 seconds and the page is interactive in under 3.5 seconds.

18. **Must** — As a **screen-reader user**, I want the site to be usable so that I am not excluded.
    Given I navigate with a screen reader, when I move through the page, then focus order is logical, all interactive elements have accessible names, images have meaningful alt text, and the site meets WCAG 2.2 AA.

## 7. Functional requirements

Numbered so anything can be referenced in tickets. FR = functional requirement.

**FR-01 Content management.** All page content, stories, impact metrics, menu items, events, partners, and settings are editable through an admin UI backed by Supabase tables. Every editable block has draft, preview, and publish states.

**FR-02 Roles and permissions.** Roles: `admin`, `editor`, `safeguarding`, `viewer`. Public content requires `editor` or `admin`. Referral data requires `safeguarding` or `admin`. Enforced by Supabase Row Level Security and SECURITY DEFINER RPCs for writes.

**FR-03 Forms.** Contact, referral, booking, employer, and newsletter forms. Each form has server-side validation via Zod schemas shared with the client, honeypot and rate limiting on the edge, and an audience tag.

**FR-04 Notifications.** New submissions trigger an email to a role-based inbox (funders to Anne and one director, referrals to the safeguarding lead, bookings to a hospitality inbox). Supabase Edge Function fans out to Resend or Postmark.

**FR-05 Impact metrics.** Metrics stored as time-series rows keyed by metric slug, year, value, note, source URL, and `updated_at`. Filter by year on the public page. Version history preserved.

**FR-06 Stories.** Stories carry a `consent_status` field. Only `granted` renders publicly. Withdrawal is a one-click action in admin that immediately unpublishes.

**FR-07 Journey timeline.** Rendered from a `journey_steps` table so Anne can rename, reorder, and add copy. Default seven steps: Prison, Referral, Induction, Training, Service, Qualification, Employment.

**FR-08 Menus and events.** Menu items are grouped into categories (Starters, Mains, Desserts, Sides, Sundays) with availability windows. Events have date, capacity, price, and status (draft, published, sold out, past).

**FR-09 Partners.** Partners table holds name, logo, category (funder, referral, employer, education, supplier), URL, blurb, and display order. Rendered as a partner strip on the home page and a directory on `/partners`.

**FR-10 Search-engine optimisation.** Every published page has a title, description, Open Graph image, canonical URL, and structured data (`Organization`, `Restaurant`, `Event`, `Article` where relevant). Sitemap generated on build.

**FR-11 Analytics.** Vercel Analytics for traffic, PostHog for product analytics and feature flags, Sentry for errors. All configured through environment variables and turned off in local dev by default.

**FR-12 Cookies and consent.** Consent banner with granular categories. Non-essential trackers do not fire until consent is given.

**FR-13 Accessibility.** WCAG 2.2 AA baseline. Focus rings visible. Reduced-motion media query respected across all Framer Motion animations. Semantic HTML first, ARIA only where semantics cannot cover.

**FR-14 Internationalisation readiness.** Copy strings kept in one place per page. Not multilingual at launch. Structure allows a future English and Yoruba pass without a rebuild.

**FR-15 Dark mode.** Two themes: Warm Light (default) and Deep Warm Dark. Stored in local storage with a system-preference fallback.

**FR-16 Audit log.** All admin writes are recorded (user id, table, row id, action, before, after, timestamp) in an `audit_log` table.

## 8. Sitemap (summary, full IA in Doc 3)

- `/` Home
- `/about` The story and the team
- `/restaurant` Restaurant, menu, private events
- `/impact` Impact and data
- `/journey` The full trainee journey
- `/stories` All stories
- `/partners` Partners overview
  - `/partners/funders`
  - `/partners/referrals`
  - `/partners/employers`
  - `/partners/education`
- `/join` For people who want to train with us
- `/support` Donate, volunteer, corporate support
- `/contact` Central contact hub
- `/news` Blog and updates
- `/legal/privacy`, `/legal/cookies`, `/legal/safeguarding`, `/legal/accessibility`, `/legal/cic-declaration`
- `/admin/*` CMS and dashboards (auth-gated)

## 9. Non-functional requirements

**Performance.** Lighthouse mobile Performance 90+, LCP under 2.5s on 3G, INP under 200ms, CLS under 0.1. Images served via Next.js Image and Supabase Storage transforms. Fonts self-hosted with `font-display: swap`.

**Security.** Supabase Row Level Security on every table. No service-role keys in the browser. All mutating writes through SECURITY DEFINER RPCs with input validation. Content Security Policy headers set. HSTS on. Rate limiting on all public form endpoints. Honeypot on public forms. UK GDPR-aligned data retention policy documented per table.

**Accessibility.** WCAG 2.2 AA. Reduced-motion respected. Colour contrast minimum 4.5:1 for body, 3:1 for large text and UI. Keyboard-only path tested end to end.

**Reliability.** Uptime target 99.9% (Vercel plus Supabase). Weekly logical backup of the Supabase database plus daily point-in-time recovery on the paid tier. Uptime check via a third-party pinger.

**Scalability.** Traffic profile expected under 20k monthly visitors in year one, but design for 100k without changes. Static generation for public pages, Incremental Static Regeneration for content-driven pages, server actions for form submissions.

**Compliance.** UK GDPR, PECR for cookies, CIC reporting requirements, food-hygiene disclosures on the restaurant page where required, safeguarding statement referenced from every audience page.

## 10. Data model overview (full detail in Doc 6)

Core tables in Supabase Postgres:

- `pages` (slug, title, meta, blocks jsonb, status, updated_at)
- `journey_steps` (slug, order, title, subtitle, body, icon_key)
- `impact_metrics` (slug, year, value, unit, note, source_url, updated_at)
- `stories` (slug, name_or_alias, role, before_line, now_line, quote, image_key, consent_status, published_at)
- `menu_items` (slug, category, name, description, price_pence, allergens, dietary_tags, available_from, available_to, status)
- `events` (slug, title, description, starts_at, ends_at, price_pence, capacity, status)
- `partners` (slug, name, logo_key, category, url, blurb, order)
- `enquiries` (id, audience, name, email, phone_optional, message, meta jsonb, status, assigned_to, created_at)
- `referrals` (id, referrer_name, referrer_org, candidate_alias, notes_restricted, status, safeguarding_flag, created_at) — visible only to safeguarding/admin
- `bookings` (id, name, email, phone, party_size, requested_at, notes, status, created_at)
- `subscribers` (email, source, consent_at, unsubscribe_token)
- `users` (id, email, role, name, avatar_key)
- `audit_log` (id, user_id, table_name, row_id, action, before jsonb, after jsonb, at)

## 11. Dependencies and assumptions

| Item | Type | Risk | Mitigation |
|---|---|---|---|
| CIC registration complete | Dependency | Low. Already granted. | Number to be displayed in footer. |
| Anne provides real imagery within 12 weeks of launch | Assumption | Medium. Photography may lag. | Curated stock library and a considered placeholder system for launch. |
| Safeguarding lead named and available for referral responses | Dependency | Medium. Anne may be sole lead at launch. | Referral form auto-acknowledges with an SLA and a fallback contact. |
| Email sending domain configured (SPF, DKIM, DMARC) | Dependency | Low | Set up in first sprint. |
| Payment provider not required at launch | Assumption | Low | Stripe wired later, expression-of-interest for donations at launch. |
| Anne able to run the CMS after a 90-minute training call | Assumption | Medium | Screen-recorded walkthroughs and inline help text. |

## 12. Risks

**Reputational.** Public stories about people leaving prison must be handled carefully. Mitigation: strict consent workflow (FR-06), aliases by default, safeguarding review before any story publishes.

**Data.** Referral data is sensitive. Mitigation: RLS by role, no criminal-record detail collected on the public site, audit log on every read of referral records.

**Delivery.** Solo build risk. Mitigation: phased release plan (section 13), everything editable so late content is not a blocker.

**SEO.** New domain, no history. Mitigation: strong content on launch, three months of scheduled `/news` posts before go-live, backlink outreach to Clink Charity partners, MoJ programme directories, and hospitality press.

**Photography.** Weak imagery kills a hospitality site. Mitigation: curated stock at launch, a booked photography day within the first 12 weeks post-launch.

## 13. Phased release plan

| Phase | Scope | Rough duration | Exit criteria |
|---|---|---|---|
| 0. Foundations | Repo, CI, Supabase project, design tokens, base layout, dark mode | 1 week | `/design` route showing full token set and base components, GitHub Actions green |
| 1. Public site v1 | Home, About, Restaurant (menu only, no live booking), Impact, Journey, Stories, Join, Partners, Support (expression of interest), Contact, Legal | 3 weeks | All pages live behind a preview URL, Lighthouse targets met |
| 2. CMS v1 | Admin auth, pages, stories, impact, menu, events, partners, submissions inbox, audit log | 2 weeks | Anne can edit all listed content without a developer |
| 3. Forms and safeguarding | Referral form with RLS, booking enquiry, employer form, newsletter, cookies banner, weekly digest email | 1 week | Referrals only visible to safeguarding role, all forms send email, digest fires |
| 4. Launch prep | SEO, structured data, sitemap, Open Graph images, content pass, accessibility audit | 1 week | External accessibility check passes, all pages have final copy and imagery |
| 5. Public launch | Go-live, PR outreach, indexing | 1 week | Domain live, indexed in Google, first funder enquiry received |
| 6. Phase two | Live booking, ticketed events, donations, trainee portal | 6 to 8 weeks | Booking with deposits live, first donation received, first trainee portal login |

## 14. Open questions

1. Does Anne want the restaurant to launch with a permanent venue or continue as pop-ups for year one? This changes the `/restaurant` layout.
2. Are there existing partner logos we can use at launch, or do we build the partners strip incrementally?
3. Confirm the safeguarding named lead and secondary contact for the referral inbox.
4. Confirm data-retention windows for enquiries (proposal: 24 months) and referrals (proposal: 7 years to match record-keeping expectations of partner probation services, subject to confirmation).
5. Newsletter provider preference (Resend is our default for transactional email; for newsletters we could stay on Resend or use Buttondown).
6. Confirm the target domain and whether email will run on Google Workspace, Fastmail, or Microsoft 365.
7. Confirm CIC directors and whose faces appear on the About page.

## 15. Acceptance for this document

This PRD is accepted when Abiodun signs off on:
- The four primary personas and their needs.
- The scope split between launch and phase two.
- The 18 numbered user stories.
- The functional and non-functional requirements.
- The phased release plan.

Once accepted, Doc 2 (Art Direction and Brand Credentials) is the next lock-in.

---

**Next document:** `02-art-direction-and-brand.md` — brand personality, logo direction, palette, type, image direction, tone of voice, and the "not a template restaurant" rules.
