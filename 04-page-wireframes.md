# Off the Hook CIC — Page Wireframes

**Document 4 of 7.** Section-by-section wireframes for every page in the tree. Written in structured text so the build can implement directly against them without a Figma round trip. Every page follows the same template: purpose, above-the-fold, sections in order, responsive rules, empty and error states, motion notes (pointer to Doc 5), analytics events, SEO essentials.

Rules for reading:
- Coordinates are in the 12-column grid from Doc 2. `col-span-8 start-3` means "8 columns wide starting at column 3".
- Section heights use the `--space-*` scale from Doc 2. `pad-y-16` means 128px top and bottom padding on desktop, 64-80px on mobile.
- Component names in `CamelCase` map to entries in the Component Inventory in Doc 7.

---

## Global chrome (present on every page)

### Header
- Container: full-width, sticky, height 88px on desktop, 64px once scrolled past 120px, 64px on mobile.
- Left: `Logo` (horizontal lockup on desktop, mark only on mobile once scrolled past 120px).
- Centre-right on desktop: primary nav in this order: The restaurant, The academy, Our impact, For partners (dropdown), About.
- Right: `Button` (secondary, ghost) "Book a table", `Button` (primary, solid forest) "Support us".
- Mobile: hamburger opens right-side full-height sheet with the six items stacked, Book a table pinned at the bottom.
- Backdrop: transparent when over hero, `--cream-50` with 1px `--cream-200` bottom border when sticky.

### Footer
- Container: full-width, `--cream-100` background.
- Top row on desktop: four columns (Off the Hook, Eat with us, Get involved, The small print) as specified in Doc 3.
- Middle row: newsletter sign-up (`NewsletterForm`), one-line pitch, email input, `Button` "Sign up".
- Bottom strip: logo mark left, CIC number and registered office middle, Instagram + LinkedIn icons right, copyright.
- Mobile: columns stack, newsletter sits between the last column and the bottom strip.

### Cookies banner
- Bottom-left dock, 320px wide on desktop, full width minus 16px margin on mobile.
- Copy: two lines. "We use a few cookies to keep the site working and to see what's read. You choose which."
- Buttons: `Accept all`, `Only essential`, `Choose` (opens preferences).
- Never blocks the primary CTA visually.

---

## `/` Home

### Purpose
Route each persona to their page inside 15 seconds. Prove the mission is credible. Never explain everything.

### Above-the-fold (hero)
- Layout desktop: 12-col grid, hero content `col-span-7 start-1`, hero visual `col-span-5 start-8`.
- Layout mobile: single column, visual below copy.
- Background: `--cream-50` with a soft radial cream-100 wash top-right at low opacity.
- Left column:
  - Eyebrow: small caps, `--forest-600`, 12px letter-spacing 0.14em. Copy: "Hospitality-led social enterprise".
  - H1 display, `--fs-display`, `--ink-900`, max 2 lines. Copy: "Real work. Real qualifications. Real chances."
  - Lead paragraph, `--fs-lead`, `--ink-700`, max 62ch, 3 lines. Copy: "Off the Hook trains people leaving prison into paid restaurant work and nationally recognised qualifications. Referrals from probation and prison education. Service in a working kitchen. Employment on the other side."
  - Two buttons in a row: `Button primary` "Book a table" (→ `/restaurant/book`), `Button secondary` "See the impact" (→ `/impact`).
  - Trust strip below buttons: small logo row for partner organisations (once we have three) at 40% opacity, in `--ink-500`.
- Right column visual:
  - Large image (16:11 crop), warm kitchen shot, real hands preferred. `--radius-lg` corners.
  - Small overlaid `StatCard` bottom-left of the image: one big number, one line. Example: "68% of trainees into work within 6 months" with source label.
- Motion: hero copy fades and rises 12px on load (see Doc 5, sequence H1).

### Section 1 — The model in one screen
- Full-width, `pad-y-16`, `--cream-50` background.
- H2 left-aligned in `col-span-6 start-1`. Copy: "How the programme works."
- Right column `col-span-5 start-8` holds a small paragraph explaining the model in 2 sentences.
- Below the H2, the `JourneyTimeline` component (compact variant, seven steps, horizontal on desktop, vertical on mobile). See `/journey` for the full timeline.
- CTA below: `Button secondary` "See the full journey" → `/journey`.

### Section 2 — Impact strip
- Full-width, `pad-y-16`, `--cream-100` background.
- H2 centered, `--fs-h2`. Copy: "The numbers so far."
- Four `MetricTile` components in a row on desktop (3 columns on tablet, 2 columns on mobile with a fifth appearing as a link).
  - Tile 1: "Trained" — number, "people through the programme" label, updated date.
  - Tile 2: "Qualified" — number, "nationally recognised qualifications" label.
  - Tile 3: "Into work" — percentage, "6-month retention" label.
  - Tile 4: "Meals served" — number, "at services and pop-ups" label.
- Each tile animates its number from 0 to target on scroll into view (see Doc 5, sequence M1).
- CTA below: `Button ghost` "See all impact data" → `/impact`.

### Section 3 — Stories carousel
- Full-width, `pad-y-16`, `--cream-50` background.
- H2 left, subheading right. Copy: "The people this is for."
- `StoryCarousel` component: horizontal scroll on desktop with 3 visible cards, snap points, keyboard arrows, hidden scrollbar. Mobile: horizontal swipe with 1.1 cards visible.
- Each `StoryCard`: 4:5 image, name or alias, role, before-line, now-line. Tap opens `/stories/[slug]`.
- CTA: `Button ghost` "All stories" → `/stories`.

### Section 4 — Restaurant teaser
- Two-column split on desktop, single column on mobile.
- Left `col-span-6`: image of the pass or a warm service moment.
- Right `col-span-5 start-8`: H2 "Come and eat with us.", short paragraph, `Button primary` "Book a table" → `/restaurant/book`, `Button ghost` "See the menu" → `/restaurant/menu`.
- Background: `--cream-50`.

### Section 5 — For partners CTA band
- Full-width, `pad-y-14`, `--forest-600` background with `--cream-25` text.
- H2 centered. Copy: "Fund it. Refer to it. Hire from it."
- Three tiles in a row on desktop, stacked on mobile:
  - Tile "Fund the work" — one line, `Button` (cream on forest) "Talk to us" → `/partners/funders`.
  - Tile "Refer someone" — one line, `Button` (cream on forest) "See how" → `/partners/referrals`.
  - Tile "Hire a graduate" — one line, `Button` (cream on forest) "Partner with us" → `/partners/employers`.
- Below the tiles, a single warm line for trainees: "Been referred to us? Start at /join." with `/join` as a link.

### Section 6 — Founder note
- Container narrow (`col-span-8 start-3`), `pad-y-16`, `--cream-50` background.
- Small portrait of Anne (top-left of the block, circular crop 96px on desktop).
- Two paragraphs in Anne's voice, first-person, editorial. Ends with a link to `/about`.
- Below: `Button ghost` "Read the full story" → `/about`.

### Section 7 — News teaser
- Full-width, `pad-y-16`, `--cream-100` background.
- H2 left, `Button ghost` "All news" right, → `/news`.
- Three latest posts as `ArticleCard` on desktop, one on mobile.

### Section 8 — Sign-up strip
- `pad-y-12`, `--cream-50`.
- One-line H3, one-line paragraph, `NewsletterForm` inline.

### Empty and error states
- If impact metrics table has no rows, the impact strip renders a fallback: "First figures publish after the pilot phase." No broken zeros.
- If stories table has no `granted` rows, the stories section is hidden.
- If news has no posts, the news teaser is hidden. No "no posts yet" copy on the home page.

### Motion (see Doc 5)
- H1 sequence: eyebrow, headline, lead, buttons stagger in.
- Impact tiles count up on viewport enter.
- Journey timeline progressive line-draw on scroll.
- Story cards fade + rise 8px on enter.
- CTA band: forest background lifts 4px into view.

### Analytics
- `page_view` (home).
- `cta_click` on every button.
- `carousel_advance` on story navigation.
- `impact_tile_view` on first view of each tile.

### SEO
- Title: "Off the Hook · A hospitality-led training academy for prison leavers".
- Description: 155 chars, mentions restaurant, training, apprenticeships, London.
- OG image: hero visual, 1200×630, dark cream background with forest tagline overlay.

---

## `/about` About

### Purpose
Give commissioners, funders, and journalists the founder story and the operating shape of the CIC.

### Hero
- Half-height (52vh desktop, 36vh mobile), `--cream-50`, single column narrow (`col-span-8 start-3`).
- Eyebrow "About Off the Hook". H1 "A CIC built around the kitchen we would want to work in."
- Lead paragraph, 3 lines.

### Section 1 — Anne's story
- Narrow container (720px prose width).
- H2 "Anne Kiragu, founder." One large portrait (4:5 aspect). Editorial prose block, 500-700 words.

### Section 2 — Why hospitality
- Two-column split. Left: H2 "Why hospitality." Right: 3 short paragraphs.
- Below: a `Callout` in `--forest-100` background with `--forest-700` text: a single quote from a peer organisation or a sector reference.

### Section 3 — The CIC declaration in plain English
- Narrow. H2 "What being a CIC means." 3 short paragraphs. Ends with a link "Read the full CIC declaration" → `/legal/cic-declaration`.

### Section 4 — The team
- Full-width grid of `PersonCard` for each team member. Photo 4:5, name, role, short bio (60-80 words).
- CTA "Meet the full team" if the grid grows past 6 → `/about/team`.

### Section 5 — CTA band
- Same forest band as home section 5, but with two tiles: "Fund the work" and "Refer someone".

### Empty and error states
- If team table has no rows, section is hidden.
- Story quote in section 2 is hard-coded at launch, moves to CMS in phase two.

---

## `/about/team` The team

### Purpose
Full team directory. Only rendered when the team grows past 6.

### Sections
- Slim hero: H1 "The team." Lead paragraph, 2 lines.
- Grid of `PersonCard` for all team members, filtered by role tag: Directors, Kitchen, Front of house, Trainers, Advisors.
- Filter chips at the top of the grid.

---

## `/restaurant` The restaurant

### Purpose
Convert a diner into a booking in under 90 seconds. Also route event bookers to `/restaurant/events`.

### Hero
- Full-width hero image (16:9 desktop, 4:5 mobile). Warm service moment.
- Overlay text bottom-left: H1 "Off the Hook, the restaurant." Lead: "A working kitchen with a story on every plate."
- Two buttons: `Button primary` "Book a table", `Button secondary` "See the menu".

### Section 1 — Atmosphere strip
- Three images in a row (4:5 aspect) with a one-line caption each. Kitchen, pass, dining room.

### Section 2 — The menu (teaser)
- Left col: H2 "This week's menu." Small paragraph on menu philosophy (seasonal, tight, honest).
- Right col: `MenuStrip` component showing 4 items pulled from `menu_items` where `status=published` and available window includes today. Each item: name, one-line description, price.
- CTA `Button secondary` "See the full menu" → `/restaurant/menu`.

### Section 3 — Location and hours
- Two-column split. Left: address, opening hours, contact number, transport notes. Right: an embedded static map image (no live map at launch to keep the tracker count low). Below: "Get directions" opens Google Maps in a new tab.

### Section 4 — Private events teaser
- Editorial block with one image. H2 "Private events." Two-line paragraph. `Button secondary` "Host an event" → `/restaurant/events`.

### Section 5 — CTA band
- Forest band. One tile: "Book a table" primary CTA.

### Empty and error states
- If no menu items are available today, the MenuStrip shows a fallback: "The next menu goes live on [date]." Date is pulled from the next future `available_from`.
- If no address is set in settings, the location section is hidden.

### Motion
- Hero image slow ken-burns at 4% scale, 20s cycle, disabled under reduced motion.
- Menu strip items fade in with 40ms stagger.

### Analytics
- `menu_view`, `book_intent_click` (fires on Book a table button before navigation).

### SEO
- `Restaurant` structured data: name, address, openingHours, priceRange, hasMenu, telephone, servesCuisine.

---

## `/restaurant/menu` Menu

### Purpose
Show the full current menu. Editable from the CMS. Print-friendly.

### Hero
- Slim. H1 "The menu."
- Filter chips: All, Starters, Mains, Desserts, Sides, Sundays. Reflect the categories in Doc 1.

### Section 1 — Menu list
- Two-column list on desktop, single column on mobile.
- Each `MenuItem`: name (`--fs-h3`), description (2-3 lines), price right-aligned, dietary tags below (V, VG, GF), allergen line in `--ink-500`.
- Section headers per category as sticky mini-headers on scroll.
- Print stylesheet: cream background, black text, no images. `Ctrl+P` gives a clean 1-page menu.

### Section 2 — Booking CTA
- Simple centered block. H3 "Book a table." One button.

### Empty state
- If no items in a category, category is hidden.
- If no items at all, page shows "The next menu goes live on [date]." pulled from the next future `available_from`.

---

## `/restaurant/events` Private events

### Purpose
Convert an event booker into an enquiry.

### Hero
- Half-height. H1 "Private events at Off the Hook." Lead: "Book the whole restaurant for a supper club, a launch, or a team night. Every event supports the training programme."

### Section 1 — What you get
- Three-tile row on desktop, stacked on mobile. Each tile: icon (from Lucide), one-line title, 2-line description. Examples: "Set menu for 12-40", "Bar service and non-alcoholic pairings", "A story on every plate".

### Section 2 — Recent events
- Grid of `EventCard`, showing past events with a photo and a one-line write-up. Pulled from `events` where `status=past`.

### Section 3 — Enquire form
- `EventEnquiryForm`: name, email, phone, date preference, party size, message. Server-side validation via shared Zod schema.
- Success: inline success state, not a redirect. Same page, form replaced by confirmation message with a two-working-day SLA.

### Motion
- Tile row: 40ms stagger fade in.

---

## `/restaurant/book` Book a table

### Purpose
Capture a booking enquiry in under 90 seconds. Not a live availability system at launch (phase two).

### Layout
- Narrow (`col-span-6 start-4`). No hero image.
- H1 "Book a table."
- Lead: "Tell us when and how many. We reply within one working day. Full deposit booking with live availability launches soon."
- `BookingForm`:
  - Name (required)
  - Email (required, validated)
  - Phone (required, UK format tolerant)
  - Party size (select 1-8, "9 or more" opens a note field)
  - Preferred date (native date picker)
  - Preferred time (select in 30-min slots between opening hours)
  - Occasion (optional select: none, birthday, anniversary, business, other)
  - Notes (optional textarea, 500 char cap)
  - Honeypot field (hidden)
- Below the form: opening hours summary and phone number.
- Submit: inline success state with confirmation email SLA.

### Error states
- Field errors shown inline in `--status-danger`, always with a specific message not a generic one.
- Server error: form stays populated, banner at the top offers retry.
- Rate-limited: friendly message "You've submitted a few times. Please wait a minute."

### Motion
- Form fades in 200ms on page load. Success state slides in 400ms.

---

## `/journey` The academy (the trainee journey)

### Purpose
Explain the operating model end to end for funders, referral partners, and any curious visitor. Anchor page.

### Hero
- Full-width, `--cream-50`. Container narrow.
- Eyebrow "The academy". H1 "From referral to a real job. Seven steps." Lead: 2 lines.

### Section 1 — The timeline
- Full width, `pad-y-16`.
- `JourneyTimeline` component, full variant. Seven steps: Prison, Referral, Induction, Training, Service, Qualification, Employment.
- On desktop: horizontal layout. A progress rail draws forward as the user scrolls. Each step opens a `JourneyDetailPanel` on click, replacing the panel to its right.
- On mobile: vertical layout. Each step is a card, scrolls into view with a soft rise.
- Each `JourneyDetailPanel` contains:
  - What the trainee experiences (2-3 sentences).
  - What Off the Hook provides (bulleted, 3-5 items).
  - A short quote (`Callout`).
  - A tag row: which partners are involved (probation, colleges, employers).

### Section 2 — Timetable snapshot
- Two-col. Left: H2 "A typical week." Right: a small week grid (Mon-Sun) with the activity per day. Filled from `journey_steps` extra data.

### Section 3 — Qualifications
- H2 "Qualifications we work toward." List of qualification names with awarding bodies (City & Guilds, Highfield, RSPH). Each row: qualification, level, awarding body, notes.

### Section 4 — Safeguarding and support
- Two-col. Left: paragraphs on 1:1 check-ins, group wellbeing, safeguarding lead, code of conduct.
- Right: a `Callout` naming the safeguarding lead once set. Link to `/legal/safeguarding` for the full statement.

### Section 5 — CTA band
- Two tiles: "Refer someone" → `/partners/referrals`, "Fund the work" → `/partners/funders`.

### Motion
- Progressive rail draw as user scrolls.
- Step icons brighten as they become active.
- `JourneyDetailPanel` cross-fades on step change (see Doc 5, sequence J1).

### SEO
- Title: "The academy · From referral to a real job".
- Structured data: `EducationalOrganization`.

---

## `/impact` Impact and data

### Purpose
Give funders and commissioners live, dated numbers with sources.

### Hero
- Slim. H1 "Impact." Lead: "Every metric on this page is updated at least every 90 days. Sources shown."

### Section 1 — Filter and headline
- Year filter chips at top (All, 2026, 2027, 2028 as they populate).
- H2 large: primary headline metric for the selected year, e.g. "42 people through the programme so far."

### Section 2 — Metric grid
- `MetricTile` grid: 4 tiles per row on desktop, 2 on tablet, 1 on mobile.
- Metric slugs from Doc 1 data model: `trained`, `qualified`, `into_work_6mo`, `into_work_12mo`, `meals_served`, `events_delivered`, `partners_referring`, `partners_hiring`.
- Each tile: number (tabular-nums), unit or label, note (small), source link, updated_at date.

### Section 3 — Impact stories
- Row of 3 `StoryCard` filtered to those tagged `outcome=employed`.

### Section 4 — Download the report
- Simple block. H3 "Download the full impact report." Button. Phase two: generates a PDF from the metric data. At launch: hidden until first report is uploaded to Supabase Storage.

### Section 5 — CTA band
- One tile: "Fund the next phase" → `/partners/funders`.

### Empty state
- If `impact_metrics` has fewer than 4 rows total, tiles show a subdued state: "Publishing after pilot phase" for those without data.

### Motion
- Numbers count up on scroll (see Doc 5, sequence M1).
- Year filter change: numbers cross-fade over 400ms.

### Analytics
- `impact_year_filter_change` with the selected year.
- `impact_source_click` for each source link.

---

## `/stories` Stories index

### Purpose
Give visitors the human evidence of the programme.

### Hero
- Slim. H1 "Stories from the kitchen." Lead: 2 lines.

### Section 1 — Filter and grid
- Filter chips: All, In training, Employed, Qualified, Long-form.
- Grid of `StoryCard`. 3 columns desktop, 2 tablet, 1 mobile.
- Each card links to `/stories/[slug]`.

### Section 2 — Consent note
- One-line editorial block at the bottom, `--ink-500`. Copy: "Every story is published with explicit consent. Names are used where consent covers publication; otherwise aliases."

### Empty state
- If no `granted` stories exist, page shows a warm editorial fallback: "The first stories will publish after the pilot phase. In the meantime, read the founder note on `/about`."

---

## `/stories/[slug]` Story detail

### Purpose
Long-form reading of one trainee's story.

### Layout
- Narrow (`col-span-8 start-3`).
- Header: eyebrow "Stories". H1 "Story title." Byline: written by, date.
- Hero image 16:9 or 4:5. Alt text meaningful.
- Body: editorial prose with occasional `Callout` and `Quote` components.
- Footer: two-tile block. "Read another story" → random `/stories/[slug]`. "Support the next chapter" → `/support/donate`.

### Structured data
- `Article` with headline, image, datePublished, author.

---

## `/partners` For partners

### Purpose
Hub page that routes to funders, referrals, employers, education.

### Hero
- Slim. H1 "For partners." Lead: 2 lines.

### Section 1 — Four tiles
- Grid of 4 `PartnerRoleCard` on desktop (2×2 on tablet, 1 column on mobile). Each card: icon, H3, one-line description, `Button` "Learn more".
  - Funders → `/partners/funders`.
  - Referrers → `/partners/referrals`.
  - Employers → `/partners/employers`.
  - Educators → `/partners/education`.

### Section 2 — Partner logos
- Full-width logo strip. Pulled from `partners` table where `status=published`. Grouped by category with small category labels.

---

## `/partners/funders` Funders

### Purpose
Convert a commissioner or funder into an intro call.

### Sections
1. **Hero.** H1 "Fund the next chapter." Lead: 2 lines. Two buttons: `Button primary` "Talk to us" (scrolls to form), `Button secondary` "See the impact" (→ `/impact`).
2. **The model.** Two-col. Left: H2 "What we do that funders can measure." Right: 4-5 bullet items.
3. **The impact snapshot.** Three `MetricTile` (headline metrics only). Link to full `/impact`.
4. **What a partnership looks like.** Three tiles: "Grant funding", "Programme sponsorship", "Multi-year impact". Each has a paragraph and a link where relevant.
5. **Existing funders.** Logo grid from partners table where `category=funder`.
6. **Contact form.** `FunderForm`: name, org, role, email, phone (optional), area of interest (multi-select: reoffending, employment, skills, hospitality), stage (multi-select: exploring, active pipeline, ready to fund), message.
7. **Downloads.** One-pager PDF, business plan summary PDF (once available). Buttons only appear when files exist in Storage.

### Motion
- Metric tiles count up.
- Form field focus rings glow forest.

### Analytics
- `funder_form_submit_success` / `_error`.

---

## `/partners/referrals` Referrers

### Purpose
Convert a probation officer or resettlement charity into a referral submission.

### Sections
1. **Hero.** H1 "Refer someone to Off the Hook." Lead: eligibility snapshot in 2 lines.
2. **Eligibility.** Two-col. Left: H2 "Who we can take." Right: bulleted list of criteria (age 18+, released or within 6 weeks of release, motivated, safeguarding-appropriate, geographic constraint).
3. **The intake process.** Numbered list of 5 steps: 1) You submit the form. 2) Safeguarding call within 2 working days. 3) Assessment session. 4) Induction week. 5) Programme start.
4. **Safeguarding named lead.** `Callout` with name and role. Link to `/legal/safeguarding` for full statement.
5. **Response time SLA.** Small strip: "We reply within 2 working days. Urgent cases: call [phone]."
6. **Referral form.** `ReferralForm`: referrer name, referrer org, referrer email, referrer phone, candidate first name or alias (never full name at this stage), release status, release date (approx), best contact method (candidate), any immediate safeguarding notes (restricted textarea), consent-to-share tick from referrer, honeypot.
7. **What happens after.** 3-line editorial paragraph. Reassures the referrer.

### Access controls
- The submitted data is only visible to `safeguarding` and `admin` roles in `/admin/referrals`.
- No indexing of any referral detail in analytics events beyond count.

---

## `/partners/employers` Employers

### Purpose
Convert a head of people or restaurant operator into a hiring partner.

### Sections
1. **Hero.** H1 "Hire from Off the Hook." Lead: 2 lines.
2. **The pipeline in one page.** Two-col. Left: H2 "How the pipeline works." Right: 4 bulleted stages (trainee, qualified, work-ready, into employment).
3. **What graduates bring.** Three tiles: qualifications, experience, values.
4. **Retention data.** Two `MetricTile`: "6-month retention" and "12-month retention". Once we have data, they populate. Empty state: "First cohort retention publishes in Q3 2027."
5. **Existing employer partners.** Logo grid.
6. **Employer form.** `EmployerForm`: name, company, role, email, phone (optional), typical roles hired, sites, message.

---

## `/partners/education` Educators

### Purpose
Convert a college programme lead or awarding body into a training partner.

### Sections
1. **Hero.** H1 "Deliver qualifications with us." Lead: 2 lines.
2. **Qualifications currently offered.** Table: name, level, awarding body, notes.
3. **What partnership looks like.** Editorial two-col.
4. **Educator form.** `EducatorForm`: name, institution, role, email, phone, area of interest, message.

---

## `/join` Interested in training with us

### Purpose
Give a prospective trainee a page written in their language and capture a low-pressure interest submission.

### Layout
- Narrow (`col-span-8 start-3`).
- No hero image (respects a mobile-only, low-data audience).

### Sections
1. **Header.** H1 "Interested in training with us?" Lead in reading-age-10 language: 2 sentences. "This page is for you. If you've been referred, or you want to be referred, tell us a bit about yourself and we'll call you back."
2. **What happens if you get in touch.** Numbered list of 4 short steps: 1) Fill in the short form or call us. 2) We call you back within 2 working days. 3) We meet for a coffee and a chat. 4) If it's a fit, we set up your first day.
3. **What the programme is like.** 4 bullets, each one sentence. "You cook and serve. You learn on the job. You get a qualification. You get paid the London Living Wage."
4. **Interest form.** `JoinForm`: name or alias, phone, best time to call, referral status (referred / self-referring / not sure), notes optional.
5. **Or call us.** Big phone number in `--forest-600`. Small line: "We answer between 10am and 6pm."

### Access rules
- Data goes to the same `enquiries` inbox tagged `audience=trainee` but flagged for the safeguarding lead as the primary responder.

---

## `/support` Support us

### Purpose
Hub for donate, volunteer, corporate support.

### Sections
1. **Hero.** H1 "Support the work." Lead: 3 lines.
2. **Three tiles.** Donate, Volunteer, Corporate support (each links to its own page or opens an inline expression-of-interest form at launch).
3. **What your support does.** Three impact statements with icons.

---

## `/support/donate` Donate

### Purpose
Expression of interest at launch. Live donations in phase two via Stripe.

### At launch
- H1 "Donate to Off the Hook." Lead.
- `DonateInterestForm`: name, email, amount range (select), one-off or recurring, GiftAid tick, message.
- Confirmation with a two-working-day SLA and a bank details fallback if the user wants to give now.

### Phase two
- Amount presets: £10, £25, £50, £100, custom.
- Stripe Elements card form.
- GiftAid declaration checkbox with the mandatory HMRC wording.
- Confirmation page with a downloadable receipt.

---

## `/support/volunteer` Volunteer

### Purpose
Capture volunteer interest.

### Sections
1. **Hero.** H1 "Volunteer with us." Lead: 2 lines.
2. **Where we need help.** Three tiles: kitchen support, mentoring, events.
3. **Volunteer form.** `VolunteerForm`: name, email, phone, area of interest (multi-select), availability (weekday/weekend/evenings), skills, message.

---

## `/contact` Contact

### Purpose
General inbound for anyone who does not fit a specific persona.

### Sections
1. **Hero.** H1 "Talk to us." Lead: 1 line.
2. **Audience router.** Four large `AudienceRouteCard` prompts before the form: "I'm a funder", "I'm a referral partner", "I'm an employer", "I want to book a table". Each links to the audience page. Copy: "For the fastest reply, use the pages built for you."
3. **General form.** `GeneralContactForm`: name, email, subject, message.
4. **Phone and address.** Small block at the bottom.

---

## `/news` News

### Purpose
Blog and updates. Also owns SEO for long-tail queries.

### Sections
1. **Header.** H1 "News and updates." Search input on the right (client-side filter).
2. **Grid of `ArticleCard`.** 3 columns desktop, 2 tablet, 1 mobile.
3. **Pagination or load more.** Load more at 12 per batch.

---

## `/news/[slug]` Article

### Purpose
Long-form article reading.

### Layout
- Narrow prose column.
- Header: eyebrow "News", H1, byline, date.
- Hero image.
- Body prose. `Callout`, `Quote`, `MetricCallout` components inline.
- Footer: next post, previous post links, share buttons for LinkedIn and Copy Link only.

### Structured data
- `Article` with all required fields.

---

## `/legal/*` Legal pages

Shared layout for all legal pages:
- Narrow (`col-span-8 start-3`).
- Slim H1 with the doc title.
- Last-updated date under H1 in `--ink-500`.
- Prose with proper H2s.
- Right rail on desktop only (`col-span-3 start-10`) with a sticky table of contents, jump anchors.

Pages: Privacy, Cookies, Safeguarding, Accessibility, CIC declaration, Modern Slavery.

The Safeguarding page also lists the named safeguarding lead and secondary contact.

---

## `/brand` Brand page (unlinked, for press and partners)

### Sections
1. **Header.** H1 "Off the Hook brand." Two lines.
2. **Logo downloads.** Grid of tiles for each lockup with SVG and PNG download links.
3. **Colour palette.** Renders the token colours from Doc 2 with hex values.
4. **Type sample.** Fraunces and Inter samples.
5. **Voice notes.** The verbal identity from Doc 2 section 4 in short.
6. **Photography guidelines.** Short version of Doc 2 section 9.

---

## `/design` Living style guide (unlinked, internal)

### Purpose
Replaces Figma. Renders every design token and component in the app so contributors can see the source of truth in the browser.

### Sections
1. Tokens: colour, type scale, spacing, radii, shadows, motion durations and easings.
2. Buttons: all variants and states.
3. Forms: all inputs and states.
4. Cards: all card types.
5. Callouts and quotes.
6. Journey timeline.
7. Metric tile.
8. Story card and story carousel.
9. Header and footer.
10. Toasts, modals, drawers.

Each component shows itself with its usage code snippet.

---

## `/admin` Admin dashboard (auth-gated)

### Layout
- Sidebar left (240px on desktop, collapsible to 64px icon rail).
- Main content right.
- Top bar with search, user menu, and a "View site" link.

### Sections
- **Overview.** Cards for new enquiries since last visit, new bookings, new referrals (safeguarding role only), new subscribers. Latest activity list.
- **Enquiries.** Tabbed by audience. Each row: audience tag, name, subject, created_at, status. Bulk actions: mark Open, In Progress, Closed. Row click opens a detail drawer with the full submission and a one-click reply-by-email link.
- **Content.** Pages, Stories, News list views. Each list has status filter, search, sort. Row click opens the editor.
- **Data.** Impact metrics table with an inline edit UI per row. Journey steps reorder with drag.
- **Restaurant.** Menu items and Events with the same list-and-edit pattern.
- **Partners.** Partner directory with drag-to-reorder.
- **Subscribers.** Email list with export.
- **Users and roles.** Admin only.
- **Settings.** Site-wide settings: hero copy, contact details, opening hours, safeguarding lead, feature flags.

### Access
- Auth-gated. Middleware checks role on every request. Unauthorised users are redirected to `/admin/sign-in`.

### Motion
- Sidebar collapse animates over 200ms.
- List items enter with a 20ms stagger up to 20 items.

---

## Responsive rules (global)

**Breakpoints.**
- Mobile: 0-767px.
- Tablet: 768-1023px.
- Desktop: 1024-1439px.
- Wide: 1440px+.

**Behaviour patterns.**
- Any two-column split collapses to a single column on tablet or mobile as noted.
- Grids reduce columns by one at each breakpoint down.
- Hover-based interactions collapse to tap on touch.
- Font scale is fluid between mobile and desktop values per Doc 2 section 7.

## Empty-state library

Reusable patterns:
- **Content missing (safe to hide):** hide the section, no fallback needed. Applies to Stories on the home page.
- **Content missing (must acknowledge):** short editorial fallback in `--ink-500`, 2 lines maximum. Applies to Menu when between weeks.
- **Data pending (evidence-critical):** subdued state in the tile itself, not a full section swap. Applies to Impact tiles pre-pilot.
- **Awaiting user action:** friendly line and a specific CTA. Applies to admin lists when empty.

## Error-state library

- **Field validation:** inline, specific, in `--status-danger`.
- **Form submit failure:** banner above the form, form values retained, "try again" button.
- **Page not found:** dedicated 404 layout described in Doc 3 section 11.
- **Permission denied:** dedicated 403 layout described in Doc 3 section 11.

## Acceptance for this document

This document is accepted when Abiodun signs off on:
- The home page section order and CTA choices.
- The Journey page structure.
- The forms specified per audience (referral, funder, employer, educator, join, booking, event, donate, volunteer, general contact).
- The admin dashboard structure.

Once accepted, Doc 5 (Motion Blueprint) is the next lock-in.

---

**Next document:** `05-motion-blueprint.md` — scroll choreography, timeline draw, count-ups, cross-fades, micro-interactions, reduced-motion equivalents, and the exact tokens each animation reads from.
