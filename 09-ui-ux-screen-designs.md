# Off the Hook CIC — UI/UX Screen Designs

**Document 9 of the pack. Screen content authority.** Per Doc 10's tie-break rule, this document wins on what each screen contains. It is built on Doc 04 (wireframes), constrained by Doc 12 (reconciliation decisions), and it deliberately elevates a handful of Doc 04 patterns that would have read as generic. Every elevation is flagged inline as **Taste pass** with the reason, so nothing changes silently.

Counts, so the definition of done is real: **25 public screen templates covering 31 routes** (the six legal pages share one template), **14 admin surfaces**, **3 error screens**. Doc 10's "35 screens" figure is superseded by these numbers.

How to read a screen spec: purpose, first read (the deliberate hierarchy: what the eye lands on first, second, third), layout and sections, states, motion (referencing Doc 05 sequence IDs only, never new timings), and a sign-off checklist. Anything not specified here inherits the pattern language in section 1.

Positioning sentence for every screen: **this should feel like a well-run neighbourhood restaurant with an editorial magazine behind it, not a charity template and not a SaaS landing page.** Reference gravity: St. JOHN's typographic restraint, Toklas's warmth, Rapha Journal's editorial cadence, Migrateful's community-with-craft. When in doubt, remove.

---

## 0. The taste pass, summarised

Doc 04's bones are good. Five patterns in it would have shipped as recognisable template moves, and this document replaces them. Listed here once so the build never resurrects them.

1. **The faded partner logo strip in the home hero is cut until three real partners exist.** A "trusted by" row with no trust is the single most recognisable slop tell on the web. Doc 04 already conditioned it; this doc makes the condition hard. Until then, the space stays empty. Empty is credible. (Slop tell: faded logo row.)
2. **Icon-tile three-card rows become typographic.** Doc 04 has two of them (events "What you get", support "What your support does"). Icons decorating one-line claims read as generated filler. Replaced with numbered editorial rows set in Fraunces, no icons. Doc 08 already limits icons to four per section and bans decorative icons; this closes the loophole. (Slop tell: abstract icon + one-liner card grid.)
3. **The forest CTA band loses its card chrome.** Three boxed tiles on a green band is the "three feature cards" pattern wearing a brand colour. Replaced with three text-led columns separated by 1px hairlines in cream at 24% opacity, each column an H3 plus one line plus a text link. Same content, editorial delivery. (Slop tell: centred card trio.)
4. **Tooltips become disclosures.** Doc 04 and Doc 07 put impact metric sources in tooltips. Tooltips do not exist on touch, and funders read on phones in meetings. Source notes become a tap-to-open disclosure line under each metric, present in the DOM, screen-reader visible.
5. **Nothing on the site is centred except where the brand book explicitly centres it** (impact strip H2, booking CTA block, business card reverse). Every hero is left-aligned. The centred hero stack plus subhead plus two CTAs is the default template posture, and this site never adopts it.

Everything else in Doc 04 carries forward, tightened.

---

## 1. Pattern language (read once, applies everywhere)

### 1.1 Type in use

- Display and H1: Fraunces 500, SOFT 30, tracking -0.01em, `--lh-tight` on display, `--lh-heading` elsewhere. Sentence case, always.
- Headlines never exceed two lines on desktop. Break lines by sense, not by width: use `text-wrap: balance` and a manual soft break where balance fails.
- Body: Inter 400 at `--fs-body`, measure capped at `68ch`. Lead paragraphs Inter 400 at `--fs-lead`, maximum three lines.
- Eyebrows: Inter `--fs-tiny`, weight 500, uppercase, +0.08em tracking, `--forest-600`. Two to five words. An eyebrow is a scent, not a sentence.
- Numerals in any metric: Fraunces, tabular-nums, `--ink-900`. The number is the hero; the label sits under it in Inter `--fs-small`, `--ink-700`.
- Emphasis in Inter is weight 500, never italic. Italic belongs to Fraunces pull quotes only.

### 1.2 Space and rhythm

- Section padding: `pad-y-16` (128px desktop, 64 to 80px mobile) for major sections, `pad-y-12` for strips. Never vary by feel; vary by tier.
- The grid is 12 columns, but the layout is asymmetric on purpose: content blocks favour 7/5 and 8/3 splits over 6/6. Symmetric splits read as template; the 7/5 hero is a deliberate signature.
- Background alternation carries section rhythm: cream-50, cream-100, cream-50, forest band. Never two washes of the same value adjacent.
- White space is content. If a section feels thin, cut copy before adding decoration.

### 1.3 Surfaces and borders

- Cards: `--cream-100` fill, 1px `--cream-200` border, `--r-md` radius, `--shadow-sm` only. Shadow steps to `--shadow-md` on hover for interactive cards only. No card ever floats on a big shadow.
- Hairline rules (1px `--cream-200`) are the workhorse separator. Prefer a rule to a box: a bordered box says "component", a rule says "editorial".
- Images: `--r-lg` radius on editorial images, square corners on full-bleed heroes. Never both treatments in one section.

### 1.4 Buttons and links

- Primary: solid `--forest-600`, cream-50 text, 44px minimum height, `--r-sm` radius. Hover to `--forest-700` per Doc 05, no scale, no shadow bloom.
- Secondary: 1px `--forest-600` border, forest text, transparent fill.
- Ghost: text plus underline offset. Tertiary actions only.
- Button labels: verb first, two to four words. "Book a table", "Refer someone", "See the impact". Never "Learn more" alone when a specific verb exists; "Learn more" is permitted only on the partners hub cards where the destination is the explanation.
- One primary button per viewport-height of page. If two sections both scream, one of them is wrong.

### 1.5 Forms (all forms on the site)

- Labels above fields, Inter 500 `--fs-small`, `--ink-700`. Never placeholder-as-label.
- Inputs: 48px height, 16px minimum font size (prevents iOS zoom), `--cream-50` fill, 1px `--cream-200` border, focus per Doc 05 F1.
- Required fields are unmarked; optional fields say "(optional)" in the label. On this site most fields are required, so mark the exception.
- Errors: specific, inline, `--status-danger`, per the Doc 02 micro-copy patterns. Error text names the problem and the fix.
- Every public form: honeypot, rate limit via RPC, GDPR consent row where personal data is stored, success state inline per Doc 05 F2 with the SLA stated in the confirmation.
- Maximum form length is a screen and a half on a 375px phone. If a form exceeds it, cut fields, not font size.

### 1.6 Imagery discipline

- Every image slot in this document names its subject from the Doc 08 shot list. Until real photography exists, the slot renders as a solid `--cream-100` panel with an eyebrow label naming what will live there ("The pass, mid-service"). Doc 08's rule stands: no stock, and the Doc 02 interim allowance is capped at five stock images site-wide, none containing faces.
- No image carries text baked into it. No image is a screenshot of the site itself.

### 1.7 Accessibility floor (every screen)

- One h1 per page. Heading levels never skip.
- Focus order follows visual order. Skip link first tab stop.
- All interactive targets 44px minimum on touch.
- Motion per Doc 05 section 11 under reduced motion, no exceptions.
- Contrast per the Doc 08 table; olive and copper never as body text.

---

## 2. Global chrome

### Header
As Doc 04, with these locks: nav labels are exactly the six from Doc 03 section 2, "The academy" pointing at `/journey` per Doc 12. Sticky shrink per Doc 05 H2. The Book a table button is secondary style in the header (the page hero owns the primary); Support us is the solid forest button. Mobile sheet per Doc 05 C4, Book a table pinned at the sheet foot as a full-width primary.

**Taste pass:** the header never gains a background blur. Backdrop is flat cream with a hairline, per Doc 03. Glassmorphism is on the slop list.

### Footer
Four columns per Doc 03 section 3, newsletter row per Doc 04, bottom strip with the two social icons only. Footer background `--cream-100`, links `--ink-700`, hover to `--forest-600` underline. The CIC number line renders "CIC no. pending" until the number is issued, then the number. Nothing in the footer is bold.

### Cookies banner
Per Doc 04 and Doc 05 C1. Bottom-left dock. Three equal-weight text buttons, none styled primary: consent UI must not nudge. Copy as written in Doc 04.

---

## 3. Public screens

### 3.1 `/` Home

**Purpose.** Route each persona to their page inside fifteen seconds. Prove credibility without explaining everything.

**First read.** 1) The tagline in Fraunces display. 2) The kitchen image. 3) "Book a table". The eyebrow and lead are deliberately quiet. Cover test: hide the page, flash it for two seconds; if the first thing read is not "Real work. Real qualifications. Real chances." the hero is miscalibrated.

**Hero.** 7/5 asymmetric split per Doc 04. Left: eyebrow "Hospitality-led social enterprise", H1 tagline on two lines ("Real work. Real qualifications." / "Real chances."), lead paragraph exactly as Doc 04 writes it, then primary "Book a table" and secondary "See the impact". Right: 16:11 image, hero shot 2 from the Doc 08 shot list (plate finished at the pass, arm in frame, movement allowed). StatCard overlaid bottom-left of the image only when a real dated metric exists; it renders the number in Fraunces tabular, label and source date in Inter tiny. No trust strip (taste pass item 1). Motion: Doc 05 H1.

**Section 1, the model.** As Doc 04: H2 "How the programme works." left in 6 columns, two-sentence explainer right in 5. Compact JourneyTimeline beneath, rail draw per Doc 05 J1. CTA secondary "See the full journey".

**Section 2, impact strip.** Cream-100 band. H2 centred (the one sanctioned centring): "The numbers so far." Four MetricTiles per Doc 04, count-up per Doc 05 M1. Each tile: Fraunces number, Inter label, updated date in `--fs-tiny` `--ink-500`. Ghost CTA "See all impact data". Empty state per Doc 04: the strip renders the editorial fallback line, never zeros.

**Section 3, stories.** H2 left "The people this is for.", one-line subheading right. StoryCarousel per Doc 04 and Doc 05 S1: three cards visible desktop, 1.1 on mobile, snap points, keyboard arrows, visible focus. Cards are 4:5 image, name or alias in Fraunces `--fs-h3`, role, before-line and now-line in Inter, 1px border, no shadow at rest. If fewer than three granted stories exist, the section hides entirely.

**Section 4, restaurant teaser.** 6/5 split, image left (hero shot 4: full room mid-service), text right. H2 "Come and eat with us.", one short paragraph, primary "Book a table", ghost "See the menu". This is the page's second and last primary button.

**Section 5, partners band.** Forest-600 full-width band, cream-25 text. H2 centred: "Fund it. Refer to it. Hire from it." Below, three text-led columns separated by cream hairlines at 24% opacity (taste pass item 3): each column an H3 in Fraunces ("Fund the work" / "Refer someone" / "Hire a graduate"), one line of Inter, and an underlined text link in cream ("Talk to us" / "See how" / "Partner with us"). No boxes, no icons. Beneath the columns, the single warm line for trainees with `/join` linked. Motion: Doc 05 CT1.

**Section 6, founder note.** Narrow column. 96px circular portrait of Anne (hero shot 5), two first-person paragraphs, ghost link to `/about`. The portrait is the only circular crop on the site; circles are reserved for people.

**Section 7, news teaser.** Cream-100. H2 left, ghost "All news" right, three ArticleCards. Hidden when no posts.

**Section 8, sign-up strip.** One-line H3, one line of Inter, inline NewsletterForm. Success per Doc 05 N1.

**Sign-off.** Two-second cover test passes on the tagline. No trust strip present pre-partners. Exactly two primary buttons on the page. Impact tiles show dates. Carousel keyboard-operable. Lighthouse Accessibility 100.

### 3.2 `/about`

**First read.** 1) H1. 2) Anne's portrait. 3) the prose. This page is reading, not scanning: it is the one page allowed to be quiet all the way down.

Sections per Doc 04 with these locks: hero half-height, narrow, H1 "A CIC built around the kitchen we would want to work in." Anne's story runs 500 to 700 words in the 720px prose column with the 4:5 portrait breaking the column edge by one grid column (editorial overhang, the page's one layout event). "Why hospitality" two-col. CIC declaration section in plain English with the link to `/legal/cic-declaration`. Team grid of PersonCards (4:5 photo, name in Fraunces h3, role, 60 to 80 word bio). Forest band with two columns (fund, refer), same hairline treatment as home.

**Sign-off.** Prose measure ≤68ch. Portrait overhang renders correctly at all breakpoints. No pull quote used unless it is a real quote from a named person.

### 3.3 `/about/team`

Per Doc 04. Slim hero, filter chips per role group (chips per Doc 05 U1), PersonCard grid. Renders only once the team exceeds six; until then the route 308-redirects to `/about`.

### 3.4 `/restaurant`

**Purpose.** Diner to booking intent in under ninety seconds.

**First read.** 1) The room, full-bleed. 2) "Off the Hook, the restaurant." 3) "Book a table".

**Hero.** Full-width image (hero shot 1, exterior at dusk, or shot 4 interior), 16:9 desktop, 4:5 mobile, square corners (full-bleed rule). A scrim gradient is banned (no gradients); instead the overlay text sits on a solid `--ink-900` at 65% opacity panel, bottom-left, with H1 and lead inside, primary "Book a table" and secondary "See the menu". Ken-burns per Doc 05 R1, never on faces.

**Sections.** Atmosphere strip of three 4:5 images with one-line captions in `--ink-500` (shots 7, 12, 3 from the detail list). Menu teaser per Doc 04: philosophy paragraph left, four live items right, each name plus one line plus price in tabular nums, hairline rules between items. Location and hours two-col with the static map image and "Get directions" external link. Private events teaser, one image, H2, two lines, secondary CTA. Forest band, single column: "Book a table."

**Empty states** per Doc 04 (next menu date, hidden location until address set).

**Sign-off.** Overlay text passes 4.5:1 on the ink panel. Ken-burns off under reduced motion. Menu prices tabular. `Restaurant` structured data present.

### 3.5 `/restaurant/menu`

Per Doc 04 with the craft locks: two-col list desktop, single mobile. Item name Inter 500, description Inter 400 `--ink-700`, price right-aligned tabular, **no dot leaders** (the hairline rule between items does the work; dot leaders belong to the printed A5 card in Doc 08, not the web). Dietary tags as text ("V", "VG", "GF") in `--olive-500` at `--fs-tiny`, tag use only, never body. Allergen line in `--ink-500` under each item. Sticky category mini-headers on scroll (sanctioned sticky, Doc 05 section 8). Filter chips per Doc 05 U1. Print stylesheet per Doc 04. Booking CTA block centred (sanctioned centring), H3 plus one primary button.

**Sign-off.** Prints to one clean page. Sticky headers do not trap keyboard focus. Empty category hides.

### 3.6 `/restaurant/events`

Per Doc 04, with taste pass item 2 applied: "What you get" is not three icon tiles. It is three numbered editorial rows, the numeral in Fraunces `--fs-h2` `--forest-600`, title and two lines of Inter beside it, hairline between rows. Recent events grid of EventCards (photo, title, one-line write-up). EventEnquiryForm per pattern 1.5: name, email, phone, date preference, party size, message, consent. Inline success with two-working-day SLA.

### 3.7 `/restaurant/book`

**Purpose.** The most important form on the site. Ninety seconds on a phone.

Narrow column, no hero image, exactly as Doc 04. H1 "Book a table.", the honest lead about live availability coming later. BookingForm fields as Doc 04 lists them, in that order, one column, party-size select with the "9 or more" note field behaviour. Below the form: opening hours summary and the phone number as a tel: link in `--forest-600` at `--fs-h3` size. Errors, server failure and rate-limit states exactly as Doc 04 writes them. Motion: form per Doc 05 F1 and F2 only.

**Sign-off.** Completable in under 90 seconds on a 375px phone with a screen reader. Zero optional fields before the fold. Submission lands in `bookings` via `submit_booking` RPC. Confirmation email arrives inside 30 seconds in preview testing.

### 3.8 `/journey` The academy

**Purpose.** The signature page. A funder understands the operating model in ninety seconds; a referrer trusts the process.

**First read.** 1) H1 "From referral to a real job. Seven steps." 2) The rail with its seven nodes. 3) The active step's detail panel.

**Hero.** Narrow, cream, eyebrow "The academy", H1, two-line lead. No image; the timeline is the visual.

**Section 1, the timeline.** Full JourneyTimeline per Doc 04 and Doc 05 J1. Locks beyond the wireframe: the rail is 1px forest, drawn per J1; step nodes are the seven custom icons from Doc 08 section 8.2, ink at rest, forest when active, 1.08 scale on selection per Doc 05. Desktop: horizontal rail, detail panel below (not beside; a side panel starves the panel's measure). Mobile: vertical rail, each step a full-width card. Keyboard model: the rail is a `radiogroup` analogue, arrow keys move steps, panel content is announced via the Announce region. Each JourneyDetailPanel: "What you experience" (two to three sentences, second person for the trainee register), "What we provide" (three to five short rows, hairline separated, not bulleted dots), one real quote as a Callout when one exists (never a fabricated one), partner tag row in olive tag style.

**Section 2, a typical week.** H2 left, seven-day grid right, activity per day in one line each. Grid cells hairline-ruled, no boxes.

**Section 3, qualifications.** Table rows: qualification, level, awarding body, note. Copper-500 is permitted here on the qualification name only (its sanctioned meaning). Tabular layout, hairlines, no zebra striping.

**Section 4, safeguarding and support.** Two-col per Doc 04, Callout naming the safeguarding lead once confirmed, link to `/legal/safeguarding`.

**Section 5, forest band.** Two columns: refer, fund.

**Sign-off.** J1 rail draws once and never re-triggers. Entire timeline operable by keyboard with visible focus. Reduced motion shows the complete rail instantly. Quotes are real or absent. Icons match Doc 08's seven directions.

### 3.9 `/impact`

**Purpose.** Dated, sourced numbers a commissioner can quote in a meeting.

**First read.** 1) The headline metric in Fraunces display. 2) The year chips. 3) The tile grid.

**Hero.** Slim. H1 "Impact." Lead: the 90-day update promise, exactly as Doc 04.

**Section 1.** Year chips per Doc 05 U1. The headline metric for the selected year set at `--fs-display` in Fraunces tabular ("42" huge, "people through the programme so far" in `--fs-lead` beneath). This is the page's one theatrical moment and it is typography, not decoration.

**Section 2, metric grid.** Tiles per Doc 04, count-up per M1, cross-fade on year change per M2. **Taste pass item 4:** the source note is a disclosure, not a tooltip. Each tile carries a "Source" text button (`--fs-tiny`, underlined) that expands a line naming source and date, in the DOM from render, `aria-expanded` wired. Every tile shows its `updated_at` date. A tile without data renders the subdued "Publishing after pilot phase" state, never a zero and never a spinner.

**Section 3.** Three StoryCards filtered to employed outcomes. **Section 4.** Download block, hidden until the first report file exists. **Section 5.** Forest band, one column: "Fund the next phase."

**Sign-off.** No metric renders without a date. Sources readable on touch devices. Numbers never round to friendlier values (Doc 05 M1 note). Year filter change announced to screen readers.

### 3.10 `/stories` and `/stories/[slug]`

Index per Doc 04: slim hero, filter chips, 3/2/1 card grid, consent note line at the foot in `--ink-500` exactly as written. Empty state exactly as written.

Detail: narrow column, eyebrow "Stories", H1, byline, hero image (16:9 or 4:5 as shot), prose with the restricted MDX set (PullQuote, Image, Callout, Divider). Pull quotes per Doc 08 section 6.4: Fraunces italic, hanging indent, attribution in Inter small. Footer two-tile block per Doc 04. Card-to-page transition per Doc 05 S2 (press state then standard PageEnter; no shared-element transition).

**Sign-off.** Only `consent_status = granted` stories ever render. Alias handling per Doc 06. Reading time server-computed. `Article` structured data complete.

### 3.11 `/partners` hub

Per Doc 04: slim hero, four PartnerRoleCards (2x2 tablet, stacked mobile). Cards here may use one Lucide icon each (within the four-icon budget), 24px, ink, top-left, because the four destinations genuinely need fast differentiation. H3, one line, "Learn more" sanctioned here only. Logo strip below from the partners table, monochrome treatment per Doc 06 admin note, grouped with small category labels. Strip hides until at least three logos exist (same discipline as the hero trust strip).

### 3.12 `/partners/funders`

Per Doc 04's seven sections with these locks: hero buttons "Talk to us" (scrolls to form, respecting reduced motion by jumping) and "See the impact". "What we do that funders can measure" right column is four to five rows, hairline separated. Impact snapshot reuses MetricTile, three tiles, dated. Partnership shapes as three numbered editorial rows (same treatment as events, taste pass item 2). Funder logo grid hides below three. FunderForm per pattern 1.5 with the multi-selects Doc 04 lists. Downloads appear only when files exist.

**Register check:** every string on this page passes the funder tone from Doc 08 11.3: confident, evidence-first, no sentiment.

### 3.13 `/partners/referrals`

Per Doc 04's seven sections, unchanged in structure; this page is process clarity, not aesthetics. Locks: eligibility list uses plain rows with hairlines. The intake process is five numbered steps, numerals in Fraunces forest. Safeguarding lead Callout in forest-100 wash with forest-700 text. SLA strip verbatim from Doc 04 with the urgent-case phone number as tel: link. ReferralForm fields exactly as Doc 04, candidate identified by first name or alias only, the restricted notes textarea labelled with who will read it ("Read only by our safeguarding lead"). Consent-to-share tick required. After-submission paragraph as written.

**Sign-off.** Data lands in `referrals` via `create_referral` RPC path for public intake per Doc 06. No referral field appears in analytics beyond a count. The page reads at Doc 02's reading age 12.

### 3.14 `/partners/employers` and 3.15 `/partners/education`

Per Doc 04. Employers: pipeline rows hairline-treated, "What graduates bring" as three numbered rows (not icon tiles), retention MetricTiles with the honest empty state Doc 04 writes. Education: qualifications table shared with `/journey` section 3 (one component, one source). Both forms per pattern 1.5.

### 3.16 `/join`

**Purpose.** The most humane page on the site. Reading age 10. Mobile-only, low-data audience.

**First read.** 1) "Interested in training with us?" 2) The four steps. 3) The phone number.

Narrow, no hero image, per Doc 04. Locks: type sits one step larger than site default (body at `--fs-lead`); short sentences; every step one line. The form asks five things only, as Doc 04 lists. The phone number is set in Fraunces at `--fs-h1` in forest, tel: linked, with the answering hours line beneath. No photography of people on this page (the reader may be in a hostel or library; the page should feel private, not observed).

**Taste pass:** the form and the phone number are equal citizens. On mobile the phone block renders directly under the four steps, before the form, because for this audience calling is the lower-friction path.

**Sign-off.** Hemingway or equivalent confirms reading age ≤10. Page weight under 200kb without fonts. Tel link works. Data lands in `enquiries` tagged trainee, safeguarding-flagged per Doc 04.

### 3.17 `/support`, 3.18 `/support/donate`, 3.19 `/support/volunteer`

Support hub per Doc 04 with taste pass item 2: "What your support does" is three numbered editorial statements, no icons. Donate is the launch version only (Doc 12: expression of interest, no Stripe): H1, lead, DonateInterestForm with amount range select, one-off or recurring, GiftAid tick with the exact HMRC wording deferred to phase two (at launch the tick records intent only, labelled honestly), bank-details fallback line in the confirmation. Volunteer per Doc 04.

**Register check on donate:** per Doc 08, the ask is "if you liked what happened here, help another cohort start", never guilt. No exclamation marks anywhere on these pages.

### 3.20 `/contact`

Per Doc 04. The audience router cards sit above the general form; copy verbatim ("For the fastest reply, use the pages built for you."). General form four fields. Phone and address at the foot.

### 3.21 `/news` and 3.22 `/news/[slug]`

Index per Doc 04: H1, client-side search (the `/` shortcut per Doc 03), 3/2/1 ArticleCard grid, load more at 12. Article: narrow prose, eyebrow, H1, byline, date, hero image, restricted component set, next and previous links, share row limited to LinkedIn and Copy Link (copy-link behaviour per Doc 05 micro-interactions). `Article` structured data.

### 3.23 `/legal/*` (one template, six routes)

Per Doc 04: narrow prose, slim H1, last-updated date, sticky right-rail table of contents on desktop (sanctioned sticky). Breadcrumbs per Doc 03. The safeguarding page names the lead and secondary contact. Content from MDX per Doc 06. No decoration of any kind; a legal page that looks designed looks evasive.

### 3.24 `/brand`

Per Doc 04: logo download tiles, palette render with hex values, type samples, voice notes, photography rules in short. This page is assembled from the design system's own components; if it needs custom CSS, the design system is missing something.

### 3.25 `/design`

The living style guide per Doc 04's ten sections, dev-gated per Doc 10. Every component renders in both themes with its usage snippet. This page is the regression net's substrate: Playwright screenshots both themes here at every phase gate per Doc 10 8.9.

---

## 4. Admin surfaces (14)

Admin is a tool, not a brand surface. It uses the same tokens but drops the editorial voice for a working one: denser type (body 14px is permitted here only), tighter spacing, no Fraunces below `--fs-h3`. Reference: Linear's density discipline, not its colour scheme.

Shared chrome per Doc 04: 240px sidebar collapsing to 64px rail, top bar with search, user menu, View site. Sidebar IA and role scoping exactly per Doc 03 section 12 and Doc 06 section 8. Motion: sidebar 200ms, list stagger 20ms capped at 20 rows, toasts per Doc 05 C2, modals and drawers per C3, skeletons per C5 (admin only, static soft pulse).

1. **Sign-in.** Magic link only. One field, one button, the wordmark, nothing else. Error states per pattern 1.5.
2. **Dashboard.** Overview cards (new enquiries, bookings, referrals for safeguarding roles, subscribers) plus latest-activity list. Numbers in tabular Inter 600, not Fraunces; admin numbers inform, they do not perform.
3. **Enquiries.** Tabbed by audience per Doc 04. Row: audience tag (tag colours per meaning: olive education, copper qualifications, forest default), name, subject, time, status. Detail drawer with full submission and reply-by-email link. Bulk status actions.
4. **Pages.** Five fixed rows per Doc 06. Accordion section editor, live character counters against Zod maxima, autosave indicator, PublishBar (Save draft, Publish, Preview, Discard).
5. **Stories.** List with category, status and featured chips. Two-pane MDX editor with live preview using the site's own components. One-featured rule surfaced in UI (setting featured shows which story loses it).
6. **News.** Same pattern as stories.
7. **Impact.** Year-grouped table, inline edit per row, "Add year" action, publish gate requiring all six metrics per Doc 06.
8. **Journey.** Seven fixed rows, no add, no delete, no reorder, per Doc 06. Icon key select from the enum.
9. **Menu.** Section-grouped list, drag-to-reorder (drag handle motion per Doc 05 micro-interactions), inline availability toggle, price entered in pounds, stored in pence.
10. **Events.** List and edit per the shared pattern, status chips including sold out and past.
11. **Partners.** Category-grouped, drag-to-reorder, logo upload with monochrome preview.
12. **Bookings.** Kanban by status per Doc 06 with day and week views; confirming triggers the Resend email. Manager and admin only.
13. **Referrals.** Safeguarding and admin only. List, detail with decrypted notes on view (logged read per Doc 06), status workflow received to declined, export with logged export. The UI states plainly at the top of the list who can see this data.
14. **Subscribers, Users, Settings, Audit.** Per Doc 03 section 12: subscriber list with export, user invites and role management (admin only), settings for contact details, hours, safeguarding lead and feature flags, read-only audit log (admin and safeguarding).

**Admin sign-off.** Role gates verified end to end per Doc 07 section 16 (editor cannot reach referrals, safeguarding cannot reach menu). Every list searches, sorts, filters. Every editor autosaves every 30 seconds. Preview renders drafts via the signed-cookie flow per Doc 06 section 9.

---

## 5. Cross-cutting states

**404.** Per Doc 03: cream, one sentence, links home and to contact. The empty-plate illustration is sanctioned as the site's only illustration beyond the journey icons; single-line, warm ink style per Doc 02 section 10, drawn to the Lucide grid. No cartoon, no mascot.

**500.** Same layout, "we've been alerted" line, Sentry capture.

**403.** The safeguarding-area message verbatim from Doc 03 section 11.

**Empty and error state libraries** per Doc 04 close the set: hide-safely, acknowledge-briefly, subdued-in-place, or friendly-with-CTA. Every screen above names which pattern each of its sections uses; a builder never invents a fifth.

---

## 6. Screen sign-off master checklist

Applied to every public screen before its PR merges, in addition to the per-screen checks above:

1. Two-second cover test lands on the intended first read.
2. Zero slop tells from section 0 present. Explicitly: no centred hero stack, no icon-decorated card trios, no faded logo rows without real partners, no tooltips carrying required information, no gradients, no pure white, no scale-on-hover buttons.
3. Every string passes the Doc 08 voice filter (banned words, register per audience, rhythm rule, UK spelling, sentence case, no em dashes).
4. Every colour resolves to a token; olive and copper appear only in their sanctioned meanings.
5. Motion uses only Doc 05 named sequences and tokens; reduced motion verified by toggling the OS setting.
6. Keyboard path walked end to end; focus visible throughout.
7. Both themes screenshot-diffed on `/design` and on the screen itself.
8. Lighthouse: Performance 90+, Accessibility 100 (per Doc 12 targets).

---

## 7. What this document decides, and what it does not

Decided here: the five taste-pass replacements in section 0, the first-read hierarchy per screen, the numbered-row treatment replacing icon tiles, the disclosure treatment replacing tooltips, the hairline-column treatment of the forest band, the admin density register, and the real screen counts.

Not decided here, and owed to Abbey: the logo direction choice (A or B per Doc 08, C is argued against), the final photography (specs assume the Doc 08 shot list), the safeguarding lead's name, the venue address, and the CIC number. Each has an honest placeholder state specified above, so none of them blocks the build.

If a screen needs something this document does not specify, the order of appeal is: section 1 pattern language, then Doc 04, then Doc 12, then ask. Do not invent.
