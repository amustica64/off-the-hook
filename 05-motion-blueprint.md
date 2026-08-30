# Off the Hook CIC — Motion Blueprint

**Document 5 of 7.** Every animation on the site, named and specified: what moves, when, how far, on which curve, for how long, and what happens under reduced-motion. Uses Framer Motion 11 (or Motion One where noted) on top of Tailwind v4 and the tokens locked in Doc 2.

Reading order:
- Section 1 sets the philosophy and the two curves everything uses.
- Section 2 lists the motion tokens.
- Section 3 covers global patterns (page load, scroll enters, hover).
- Sections 4-10 spec named sequences (H1, M1, J1, S1, and so on) referenced from Doc 4.
- Section 11 covers reduced motion.
- Section 12 covers performance rules.
- Section 13 covers accessibility.

---

## 1. Motion philosophy

Six rules. Break one only with a reason.

1. **Motion has meaning.** If the movement does not aid comprehension or the tone, cut it.
2. **Two curves.** One curve for enters, one for exits. Everything else is a variation of these.
3. **Short and considered.** Anything longer than 800ms must earn it.
4. **Distance is small.** 8-16px of translation is enough. Anything longer looks theatrical.
5. **Never on essential content.** Copy, prices, forms, and errors do not depend on motion to appear. If JS fails, the page is still readable.
6. **Reduced motion is a first-class mode**, not an afterthought. Every animation collapses to an opacity fade or nothing under 100ms.

The curves:
- **Enter.** `cubic-bezier(0.2, 0.7, 0.2, 1)`. Slight overshoot on the front end, gentle settle.
- **Exit.** `cubic-bezier(0.4, 0, 0.2, 1)`. Even and quick, no drag.

> **Superseded for the phase 7 motion pass.** Doc 17 section 2 sets the enter curve at `[0.16, 1, 0.3, 1]`, a circ-out with no overshoot. Doc 17 wins as the later build spec, and `motionTokens.ease.enter` in `lib/motion.ts` carries it. The curve above stays authoritative for the components shipped in phases 2 to 6, which still import `easeEnter`, until those are migrated and visually checked. Two further Doc 5 deviations are resolved the same way and flagged in `components/motion/journey-line.tsx`: the journey rail is vertical at all breakpoints rather than horizontal on desktop (J1), and node entry scales from 0.96 rather than 0.7 (J1), per Doc 17's anti-slop guardrail.

## 2. Motion tokens

Committed as CSS custom properties in `app/globals.css` and referenced by every animation. Named to be readable in code review.

```
--dur-instant: 100ms
--dur-fast: 200ms
--dur-med: 400ms
--dur-slow: 800ms

--ease-enter: cubic-bezier(0.2, 0.7, 0.2, 1)
--ease-exit: cubic-bezier(0.4, 0, 0.2, 1)
--ease-linear: linear

--motion-lift: 8px           /* small rise on enter */
--motion-lift-lg: 16px       /* rare, hero only */
--motion-shift: 4px          /* subtle button hover */

--stagger-tight: 40ms
--stagger-med: 80ms
--stagger-slow: 120ms
```

Framer Motion consumers read these via `getComputedStyle` at mount, or import a small `motion.ts` helper that mirrors the same values in TypeScript. See Doc 7 section 8 for the helper.

## 3. Global patterns

### 3.1 Page load
- HTML streams from the server. First paint has no motion.
- Once the page is idle, a `PageEnter` wrapper animates its children with a stagger. Children are opted in per page via a class.
- Default sequence: opacity 0 to 1 over `--dur-med`, translateY `--motion-lift` to 0 on `--ease-enter`, stagger `--stagger-med`.
- Runs once per navigation. Not on scroll back to top.

### 3.2 Scroll enters (in-view)
- Any section marked `data-enter="rise"` uses IntersectionObserver at 15% threshold to fade + rise `--motion-lift` on `--ease-enter` over `--dur-med`.
- Sections marked `data-enter="fade"` fade only, same duration.
- Threshold once. No re-triggering on scroll back.

### 3.3 Hover and press (desktop only)
- **Buttons.** Background darkens from `--forest-600` to `--forest-700` over `--dur-fast` on hover. On press, scale 0.98 over `--dur-fast`. No lift, no shadow bloom.
- **Cards (interactive).** Border colour shifts from `--cream-200` to `--forest-600` over `--dur-fast`. Optional 4px translateY up on `--ease-enter`. Shadow steps from `--shadow-sm` to `--shadow-md`.
- **Text links.** Underline offset shifts from 4px to 2px over `--dur-fast`. No colour change.
- **Icon buttons.** Background wash from transparent to `--cream-100` over `--dur-fast`.

### 3.4 Focus
- Focus ring is instant. No animation. A delayed focus ring is a usability bug.
- The ring is 2px `--forest-600` on light, 2px `--cream-25` on dark, offset 2px.

### 3.5 Route transitions
- No full-page fade at launch. Next.js App Router streams; a full-page fade fights streaming.
- Only the main container fades on route change over `--dur-fast`. Header and footer stay fixed.

## 4. Named sequences

Each sequence has an ID, referenced from Doc 4. Format: purpose, trigger, choreography, timing, curve, reduced-motion equivalent, notes.

### H1 — Home hero enter

**Purpose.** Introduce the eyebrow, headline, lead, and buttons in a considered rhythm so the page feels edited, not dumped.

**Trigger.** Page mount on `/`.

**Choreography.**
1. Eyebrow: opacity 0 to 1, translateY `--motion-lift` to 0.
2. H1 line 1: opacity 0 to 1, translateY `--motion-lift` to 0.
3. H1 line 2: same, 40ms after line 1.
4. Lead paragraph: opacity 0 to 1, translateY `--motion-lift` to 0.
5. Buttons: opacity 0 to 1, staggered `--stagger-tight` between primary and secondary.
6. Hero visual: opacity 0 to 1 over `--dur-slow`, no translation. Slight scale from 1.02 to 1 on `--ease-enter`.
7. `StatCard` overlay on the visual: enters last with opacity fade and 8px lift, `--dur-med`.

**Timing.** Total sequence 900ms. Individual steps 400ms each with 80ms stagger.

**Curve.** `--ease-enter` throughout.

**Reduced motion.** All steps become an opacity fade of 100ms. No translation.

**Notes.** The hero visual should never delay the copy. If the image is still loading at 900ms, it fades in silently when ready.

### H2 — Sticky header shrink

**Purpose.** Shrink the header from 88px to 64px once the user has scrolled past 120px, so it stops competing with the hero.

**Trigger.** Scroll offset crosses 120px.

**Choreography.**
- Header height: 88px to 64px over `--dur-fast`.
- Logo: horizontal lockup to mark-only on mobile, same duration. Scale 1 to 0.9 on desktop.
- Backdrop: `transparent` to `--cream-50` with 1px `--cream-200` border-bottom, cross-fade.

**Curve.** `--ease-exit` for the shrink so it feels quick.

**Reduced motion.** State swap without animation. The header still shrinks and the backdrop still appears.

### J1 — Journey timeline

**Purpose.** Make the seven-step timeline feel like a route being walked, not a slideshow.

**Trigger.** Section enters the viewport at 25% threshold.

**Choreography.**
1. **Rail draw.** A horizontal (desktop) or vertical (mobile) line draws forward. Uses SVG `stroke-dasharray` and `stroke-dashoffset` transitioning from full to 0 over `--dur-slow`. Rail is 1px, `--forest-600`.
2. **Step nodes appear.** Each of the seven step dots fades in and scales from 0.7 to 1 in sequence. Timing: 100ms per step, so the last node lands at 700ms into the sequence.
3. **Icon activation.** As the user scrolls further, the active step's icon shifts from `--ink-500` to `--forest-600` and scales 1 to 1.08 over `--dur-fast`.
4. **Detail panel change.** When a step is selected (hover on desktop, tap on mobile), the `JourneyDetailPanel` cross-fades. Outgoing panel: opacity 1 to 0 over `--dur-fast` on `--ease-exit`. Incoming panel: opacity 0 to 1 over `--dur-med` on `--ease-enter`, with a 4px slide from the right on desktop or bottom on mobile.

**Curve.** Rail uses `linear` for a clean draw. Nodes and panel use `--ease-enter` / `--ease-exit`.

**Reduced motion.** Rail draws instantly as a single line. Nodes fade in over 100ms in parallel. Panel change becomes an instant swap.

**Notes.** The rail must respect the browser's zoom. Use viewBox-based coordinates, not fixed pixels.

### M1 — Metric count-up

**Purpose.** Give impact numbers a small moment so the reader registers them.

**Trigger.** Tile enters the viewport at 40% threshold.

**Choreography.**
- Number counts from 0 to target over `--dur-slow`, easing with `--ease-enter`.
- If the number is a percentage, the "%" sign fades in over the final 200ms.
- The tile itself fades and rises `--motion-lift` on `--ease-enter` over `--dur-med` in parallel.

**Curve.** `--ease-enter` on the count so it decelerates near the target rather than crashing.

**Reduced motion.** Number renders directly at the target value. No count-up. Tile still fades in over 100ms.

**Notes.** Font must be `tabular-nums` on the numeral, otherwise the character width jitters while the digits change. Locale-aware separators (1,234 for UK). Never round to a "nice" number that misrepresents the source.

### M2 — Metric year filter change

**Purpose.** Communicate that the numbers on the impact page changed because the year filter changed.

**Trigger.** User selects a different year chip.

**Choreography.**
- All metric tiles cross-fade over `--dur-med`. Old numbers: opacity 1 to 0 with a 4px translateY down. New numbers: opacity 0 to 1 with a 4px translateY from up.
- Year chip active state animates immediately (see U1 below).

**Curve.** `--ease-exit` for the outgoing, `--ease-enter` for the incoming.

**Reduced motion.** Instant swap. No cross-fade.

### S1 — Story carousel

**Purpose.** Give the carousel a physical feel, not a hard snap.

**Trigger.** User advances the carousel by arrow, keyboard, or swipe.

**Choreography.**
- Track translates by the width of one card plus gap.
- Duration `--dur-med`, curve `--ease-enter`.
- Cards fade in the incoming direction from 0.6 opacity to 1 over the same duration.
- On mobile swipe, apply momentum with a max travel of one card. Elastic bounce if the user overshoots at either end, 8px, 200ms.

**Curve.** `--ease-enter`.

**Reduced motion.** Track transitions with opacity only, no translate. Cards do not fade.

### S2 — Story card open (transition to `/stories/[slug]`)

**Purpose.** Feel like the card the user tapped becomes the article they are reading, without a heavy shared-element route transition.

**Trigger.** Tap on a `StoryCard`.

**Choreography (light version).**
- Card slightly presses on tap (scale 0.98, `--dur-fast`).
- Navigation happens. New page uses PageEnter sequence.

**Reduced motion.** Press state omitted.

**Notes.** Full shared-element route transitions are deferred. They fight Next.js streaming and add complexity that does not repay itself here.

### U1 — Chip and tab active state

**Purpose.** Show the active filter or tab clearly.

**Trigger.** User selects a chip or tab.

**Choreography.**
- Background of the newly active chip cross-fades from transparent to `--forest-100` over `--dur-fast`.
- The active underline (if used) slides from the previously active chip to the new one over `--dur-med` on `--ease-enter`. This uses `layoutId` in Framer Motion so the underline shares identity.
- Text weight of the active chip shifts from 400 to 500 instantly (no animated weight; that jitters).

**Reduced motion.** Underline swap is instant. Background still cross-fades over 100ms.

### F1 — Form field focus and validation

**Purpose.** Guide the user through the form without hype.

**Choreography.**
- **Focus.** Border colour shifts from `--cream-200` to `--forest-600` over `--dur-fast`. Focus ring appears instantly.
- **Valid.** No animation. Silence is the correct state.
- **Invalid on blur.** Border colour shifts to `--status-danger` over `--dur-fast`. Error text fades in below the field over `--dur-fast` with a 2px lift.
- **Corrected.** Error text fades out over `--dur-fast`. Border returns to `--cream-200` or `--forest-600` if focused.

**Reduced motion.** All colour changes remain (they are functional). Error text appears without translation.

### F2 — Form submit

**Purpose.** Show progress and success without a page reload.

**Choreography.**
- On submit, the submit button label swaps to "Sending" and a small forest spinner appears on the right of the label. Spinner is a 16px SVG circle with a rotating dash, `--dur-slow` per revolution, `linear`.
- On success, the form fades out over `--dur-med` on `--ease-exit`. Success message fades and rises `--motion-lift` on `--ease-enter` over `--dur-med`.
- On error, spinner disappears. Error banner slides down from the top of the form over `--dur-fast`.

**Reduced motion.** Spinner disappears; the button label reads "Sending" as static text. Success message replaces the form without animation. Error banner appears instantly.

### C1 — Cookies banner

**Purpose.** Appear without stealing focus from the primary content.

**Choreography.**
- On first page load with no consent, banner mounts after `--dur-slow` delay. Enters with opacity 0 to 1 and translateY 16px to 0 over `--dur-med` on `--ease-enter`.
- On choice, exits with opacity 1 to 0 and translateY 0 to 16px over `--dur-fast` on `--ease-exit`.

**Reduced motion.** Appears and disappears instantly.

### C2 — Toasts and confirmations

**Purpose.** Confirm actions in the admin without pulling focus.

**Choreography.**
- Toast enters from bottom-right on desktop, top-centre on mobile. TranslateY 16px to 0, opacity 0 to 1, `--dur-med`, `--ease-enter`.
- Auto-dismiss after 4000ms.
- Exit: opacity 1 to 0 and translateY back over `--dur-fast`, `--ease-exit`.

**Reduced motion.** Enters and exits instantly.

### C3 — Modal and drawer

**Purpose.** Focus on a task in the admin.

**Choreography.**
- Overlay: opacity 0 to 0.5 over `--dur-fast`.
- Modal or drawer: translateY 16px to 0 (modal) or translateX 24px to 0 (right drawer), opacity 0 to 1, over `--dur-med` on `--ease-enter`.
- Close: reverse over `--dur-fast` on `--ease-exit`.

**Reduced motion.** Overlay opacity still applies (it is functional). The panel appears without translation.

**Notes.** Focus trap engages on open, releases on close. Escape closes, outside click closes on non-destructive modals only.

### C4 — Mobile menu sheet

**Purpose.** Full-height nav sheet on mobile.

**Choreography.**
- Sheet slides from right, translateX 100% to 0 over `--dur-med` on `--ease-enter`.
- Backdrop fades over `--dur-fast`.
- Nav items inside: 40ms stagger fade + 8px lift on `--ease-enter`.

**Reduced motion.** Sheet appears without slide. Nav items appear without stagger.

### C5 — Skeletons and loading

**Purpose.** Communicate loading without seizure-inducing ripples.

**Choreography.**
- Skeletons are static soft rectangles in `--cream-100` with a barely-perceptible opacity pulse between 0.7 and 1.0 over 1600ms.
- Only used inside the admin, and only when a request is expected to take longer than 400ms.

**Reduced motion.** Static, no pulse.

### N1 — Newsletter form success

**Purpose.** Quiet, confident confirmation.

**Choreography.**
- On success, form contents fade out over `--dur-fast`.
- Success message ("Thanks. Look for the confirmation email.") fades in over `--dur-med` on `--ease-enter` with a 8px lift.

**Reduced motion.** Content swap without animation.

### R1 — Restaurant hero ken-burns

**Purpose.** A slow, restrained sense of life in the kitchen image.

**Trigger.** Hero image visible on `/restaurant`.

**Choreography.**
- Image scales from 1.00 to 1.04 over 20 seconds, then reverses. Loops indefinitely.
- Curve: `linear` so the movement is imperceptible in short glances.

**Reduced motion.** Static image. No loop.

**Notes.** The parent has `overflow: hidden`. Never apply ken-burns to a photo of a person's face.

### CT1 — CTA band forest wash

**Purpose.** Signal a section change from cream to the forest band, gently.

**Trigger.** Section enters viewport at 20% threshold.

**Choreography.**
- The forest background fades from `--forest-700` to `--forest-600` over `--dur-slow`. Sits at `--forest-600` while in view.
- Tiles inside enter with the standard `data-enter="rise"` pattern.

**Reduced motion.** Background renders at `--forest-600` from the start. Tiles fade in over 100ms.

### CT2 — Button primary hover shimmer

**Purpose.** A small hint on primary CTAs that they are pressable, once, on hover only.

**Choreography.**
- On hover, a 200ms subtle 4% brightness lift on the background from `--forest-600` to a slightly lighter forest, then settle back to `--forest-700` as the standard hover state. Total duration `--dur-fast`.

**Reduced motion.** Instant hover state, no shimmer.

**Notes.** This is the only decorative motion allowed on a button. If in doubt, remove it and keep only the standard hover.

## 5. Icon animation

Custom icons in the Journey timeline may include a small internal animation once. For example, the "Service" icon might have a plate rim that draws in over `--dur-slow` when the section first enters view. Constraints:
- Uses SVG `stroke-dasharray`, not JS.
- Runs once per section entry, never on loop.
- Reduced motion: static.

Lucide icons in the general UI do not animate.

## 6. Data visualisation motion (Impact page and dashboards)

- Bar charts animate from 0 to value on scroll into view, `--dur-slow`, `--ease-enter`, stagger `--stagger-tight` per bar.
- Line charts draw progressively using `stroke-dashoffset`, `--dur-slow`, `linear`.
- Filters change values with a cross-fade (M2).
- Tooltip: opacity 0 to 1 over `--dur-instant`, no translation.

Reduced motion: charts render at final values instantly.

## 7. Navigation drop-downs

- "For partners" dropdown opens on hover (150ms delay) or tap.
- Enter: opacity 0 to 1 and translateY 4px to 0 over `--dur-fast` on `--ease-enter`.
- Exit: reverse on `--ease-exit`.

Reduced motion: instant.

## 8. Scroll rules

- Never use scroll-jacking. Users control the scroll.
- Sticky elements are allowed only for: the header, the year filter on `/impact`, breadcrumbs on legal pages, sticky category headers on `/restaurant/menu`.
- Smooth-scroll to anchors is enabled globally via `html { scroll-behavior: smooth; }` and disabled under reduced motion.

## 9. Parallax

- Hero images may parallax at a maximum offset of 24px over the height of the hero. Any more feels amateurish.
- Implemented with CSS `transform: translateY(calc(var(--scroll) * -0.05))` where `--scroll` is updated on `scroll` via `requestAnimationFrame`.
- Disabled entirely under reduced motion.
- Never on `/restaurant` hero (which uses ken-burns instead) or on any image containing a person's face.

## 10. Micro-interactions

Micro-interactions are the smallest movements. Each is `--dur-fast`, `--ease-enter` unless noted.

- **Booking form date select.** Native picker on mobile, custom dropdown on desktop. Dropdown opens with an 8px translateY.
- **Menu item hover on `/restaurant/menu`.** Price slightly increases in weight from 500 to 600. No colour change.
- **Newsletter input.** On focus, the border shifts to forest. On successful submit, the input clears and a small check mark fades in in `--forest-600` for 1200ms then fades out.
- **Copy link button on articles.** On click, the label swaps from "Copy link" to "Copied" for 1500ms with no motion.
- **Admin row hover.** Background wash from transparent to `--cream-100`.
- **Admin drag handle.** On drag, the row lifts (translateY -2px) and shadow shifts from `--shadow-sm` to `--shadow-md`.
- **Journey step selection.** The active step number scales 1 to 1.08. Non-active steps sit at 1.

## 11. Reduced motion

Every animation on the site listens to `prefers-reduced-motion: reduce`. Under reduced motion:

- All translations collapse to opacity only.
- Durations shorten to `--dur-instant` (100ms) or become instant swaps.
- Loops (ken-burns, skeleton pulse) become static.
- Rail draws become instant.
- Number count-ups become static values.
- Parallax and scroll-linked motion are disabled.
- Focus rings, error colour changes, and status swaps remain because they are functional, not decorative.

Implementation pattern:

```ts
const prefersReducedMotion = useReducedMotion(); // Framer Motion hook
const enter = prefersReducedMotion
  ? { opacity: 1, transition: { duration: 0.1 } }
  : { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.2, 0.7, 0.2, 1] } };
```

Or with CSS:

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

Use CSS as the guardrail and Framer Motion `useReducedMotion` for anything that needs a different code path (count-ups, staggered lists, ken-burns).

## 12. Performance rules

- Prefer CSS `transform` and `opacity`. Never animate `top`, `left`, `width`, `height`, `margin`, or `padding`.
- Every animated element gets `will-change: transform, opacity` set at mount and removed at end. Never leave it on.
- Framer Motion `layout` animations only on 1-3 elements at a time. Any more and paint costs become visible.
- Animations frame budget: 8ms per frame on a mid-range Android. If a sequence exceeds it, simplify.
- Motion inside carousels is `translate3d(0,0,0)` to promote to a compositor layer.

Measurement pattern in development:
- Enable "Rendering > Paint flashing" in Chrome DevTools.
- Any repeated paint outside the animated bounding box is a bug.

## 13. Accessibility rules for motion

- Any motion that carries meaning (state change, feedback) must also be expressed non-visually. Example: a form submit success animation is paired with an ARIA live region announcing "Message sent".
- Any content that appears due to motion must be present in the DOM before the animation starts. Never gate content on animation-end.
- Focus never depends on motion completion. Focus is set on the target element the moment the interaction begins.
- Marquees, blinking, and any content that flashes more than 3 times per second are banned outright.

## 14. Motion QA checklist

Before shipping any section:

- Motion is `<= --dur-slow`.
- Curves are `--ease-enter` or `--ease-exit`, no third curve.
- Reduced motion path exists and has been tested by toggling the OS setting.
- No `top`/`left`/`width`/`height` in the animation code.
- `will-change` is removed on animation end.
- If the JS bundle for the animation is over 4kb gzipped, look for a smaller pattern.
- The animation runs at 60fps on a mid-range Android.
- The content is readable and interactive before the animation completes.

## 15. Where each sequence lives in code

Recommended file layout for the Next.js app:

```
components/
  motion/
    PageEnter.tsx           // H1, C1, C2 helpers
    Reveal.tsx              // data-enter="rise" / "fade"
    JourneyTimeline.tsx     // J1
    MetricTile.tsx          // M1
    ImpactYearFilter.tsx    // M2, U1
    StoryCarousel.tsx       // S1
    Chips.tsx               // U1
    Toast.tsx               // C2
    Modal.tsx               // C3
    Drawer.tsx              // C3
    MobileMenu.tsx          // C4
    Skeleton.tsx            // C5
    CookiesBanner.tsx       // C1
lib/
  motion.ts                 // token mirror, useReducedMotion helper, curve consts
```

## 16. Acceptance for this document

This document is accepted when Abiodun signs off on:
- The two curves and the token names.
- The named sequences H1, J1, M1, S1, and the CTA band CT1.
- The reduced-motion policy.
- The performance rules.

Once accepted, Doc 6 (Content and CMS Model) is the next lock-in.

---

**Next document:** `06-content-and-cms-model.md` — every editable content type, its exact Supabase table shape, the RLS policies, the RPC gates, and the admin UI patterns for each.
