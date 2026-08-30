# Off the Hook — motion build spec (locked)

Planning type: product build. This is the plan a coding agent picks up cold and builds, no prototype needed. It turns the motion direction in Doc 14 into exact tokens, Framer Motion primitives, behaviour, and a risk ordered build list. Written with the craft bench: planning-superpowers and fable-5 for the discipline, creative-craft-foundations and emil-kowalski for the motion craft, motion-dev and motion-weaver for the Motion API, design-impeccable and taste-maker for the quality gate, photography-masters and creative-production-director for how image and brand sit inside it.

Doc 14 owns the why. This document owns the how, and it is the one that gets built.

## 1. Frame

Goal: the whole site feels drawn by one hand, the line reels a reader through the story, and it reads as a posh, deliberate brand rather than a template. The hero is the first proof of that.

Knowns: Next.js 15 App Router, React 19, Framer Motion (Motion, motion.dev), self hosted Fraunces and Inter, the cream and forest tokens, the eight pack hero images in `public/heroes`. The hero behaviour is already validated with Abbey: scroll driven, not snap, one transition taking about a screen of scroll to complete.

Constraints: transform, opacity, clip-path and filter only, never layout properties. Reduced motion is first class, not a bolt on. Server Components by default, the heavy scroll pieces are the only client islands. No new colours, fonts or libraries.

Assumption, stated so it is recoverable: pacing and warp are locked at the validated defaults below (about one screen per transition, medium blur). Abbey can move either with a one line change, the numbers live in one token file for exactly that reason.

## 2. Motion tokens, the single source

All motion reads from one file, `lib/motion/tokens.ts`. No magic numbers in components.

```ts
export const motionTokens = {
  duration: {            // seconds, for Framer Motion
    micro: 0.16,         // hover, tap, small state
    ui: 0.20,            // buttons, toggles
    transition: 0.24,    // page and route cross fade
    reveal: 0.56,        // section headings and hero copy
    signature: 1.0,      // the intro logo draw, the one set piece per view
  },
  ease: {
    enter: [0.16, 1, 0.3, 1],   // circ-out, confident settle, for anything appearing
    exit:  [0.4, 0, 1, 1],      // ease-in, for anything leaving
    standard: [0.4, 0, 0.2, 1], // position changes where both ends matter
    // scroll linked motion is LINEAR only, driven by scroll position, never eased
  },
  travel: { min: 8, max: 16 },  // px, reveals move a short distance and decelerate long
  stagger: 0.056,               // 56ms between staggered children
  hero: {
    holdVH: 90,     // a chapter holds for ~0.9 of a screen of scroll
    transVH: 115,   // a transition takes ~1.15 screens of scroll to complete
    blurMaxPx: 14,  // peak warp blur at mid transition
    outScaleTo: 1.14,   // outgoing image scales up as it blurs away
    inScaleFrom: 1.12,  // incoming image settles down from this
    kenburns: [1.02, 1.07], // moving hold drift across a chapter
  },
} as const
```

Rationale (emil, craft-foundations): posh is a timing decision. Reveals sit at 560ms because this is not a productivity app, micro-interactions stay at 160ms because contrast of speed is the tell of care. Nothing moves linearly except the scroll line. Travel is deliberately tiny, 8 to 16px, with a long deceleration, because tight to loose spacing is what reads expensive and a big travel on a short ease is what reads cheap.

## 3. The hero, locked

The behaviour Abbey signed off. Scroll drives everything, nothing autoplays, one focal point at a time.

Structure: a `position: fixed` stage holding the chapters, plus a tall spacer that gives the page its scroll length. Scroll position, not a timer, sets the state.

Per chapter, two bands measured from `motionTokens.hero`:
- Hold band (~0.9 screen): the image holds and drifts by a scroll driven ken burns from 1.02 to 1.07 scale, so it is alive but still. The copy is fully in.
- Transition band (~1.15 screens) to the next chapter, scrubbed by scroll progress `tf` from 0 to 1:
  - Outgoing image: scale 1.0 to 1.14, blur 0 to 14px, opacity 1 to 0. This is the warp, the refined answer to the reel's zoom blur.
  - Incoming image: revealed by `clip-path: inset(0 (100 - 100*tf)% 0 0)`, blur 14 to 0px, scale 1.12 to 1.0, opacity 1. It draws in from the left.
  - The line: a 2px hairline of cream light with a forest glow sits at the wipe edge, `left: tf*100%`. This is the brand device doing the job the reference gives to an ink brush.
  - Copy panels: one at a time, the outgoing panel and incoming panel swap at `tf` 0.5 with a 220ms fade, so two headlines are never on screen together.
  - Headline reveal: on a chapter becoming dominant, its words rise 16 to 0px with opacity, 56ms apart, on the enter ease. Body never animates.

Framer Motion mapping (motion-dev):
- `useScroll({ target: sectionRef, offset: ["start start", "end end"] })` gives `scrollYProgress`.
- `useTransform` derives, per chapter, the hold drift and the transition `tf`, then feeds `clipPath`, `filter`, `scale`, `opacity` and the sweep `left` as motion values. Keep the per frame callbacks allocation free.
- `willChange` is set to `transform, filter, clip-path` only while a chapter is transitioning, and removed after.
- The hero is a single client component, `components/motion/Hero.tsx`, loaded with `next/dynamic`. Everything around it stays server rendered.

Reduced motion (`useReducedMotion`): no blur, no scale, no clip. Chapters cross fade under 150ms as you reach them, the line shows drawn rather than drawing, all copy is simply present. The hero is just as composed standing still.

Accessibility: the buttons are real links in the DOM from first paint, focus order is correct, scroll is native and never hijacked, the chapter dots are real buttons, arrow keys optionally page between chapters. Overlay text sits on a solid ink panel at 60 percent, never a gradient scrim, and passes 4.5:1.

Locked copy, voice checked (no dashes, sentence case, UK spelling):
1. Kicker "Restaurant and academy, London". Headline "Real work. Real qualifications. Real chances." Lead "A working kitchen that trains people leaving prison, then pays them to do it well." Buttons "Book a table", "See the menu".
2. Kicker "This week on the pass". Headline "Every plate carries a story." Lead "Beef shin, mash, greens. Honest food, cooked to the standard our chefs learned in Michelin kitchens." Buttons "See the menu", "Our story".
3. Kicker "Inside the kitchen". Headline "Skill you can see." Lead "Copper on the rail, steam on the pass, a trade learned by doing it beside people who have done it for years." Buttons "The academy", "Meet the team".
4. Kicker "The journey". Headline "From a first shift to a paid trade." Lead "Referral, training, a City and Guilds qualification, then real work. One line drawn from the door to a wage." Buttons "Follow a journey", "Refer someone".

Decision records:
- Scroll scrubbed, not snap. Options: timed snap between chapters, or scroll linked scrubbing. Chose scrubbing because the snap version completed in about half a second and the move was gone before it was seen, Abbey confirmed this directly. Reversal trigger: if a mid tier Android cannot hold the blur at 60fps, drop the blur and keep a scroll linked cross dissolve plus the line, which is cheap.
- Warp intensity medium (14px peak). Options: heavier for drama, lighter for restraint. Chose medium as the posh middle. Reversal trigger: Abbey asks for heavier or lighter, change one token.
- Four chapters. Reversal trigger: content wants three, the engine takes any N.

## 4. The line language, across the site

One device, three jobs: it reveals, it connects, it measures. Each surface below is a small named component so the whole site is drawn by one hand.

- Intro logo draw, once per session. `motion.path` with `pathLength` 0 to 1 over `signature` (1.0s), enter ease with a hair of settle, the wordmark rises underneath. Guarded by `sessionStorage` so it plays once, never on every route. Reduced motion shows it finished.
- Section reveal. A hairline draws above the heading (`pathLength`), then the heading and its one lead element rise 12 to 0px with opacity over `reveal` (560ms), `whileInView` with `viewport={{ once: true, amount: 0.3 }}`, children staggered 56ms. Body copy never animates. The line is the curtain, the content is the act.
- Journey line, the centrepiece. A single `motion.path` down the page, `pathLength` bound to `useScroll` `scrollYProgress` on the journey section, each step arriving `whileInView` as the line reaches it. This is where the interactivity budget goes, everything else earns its restraint so this lands.
- Impact. Count ups animate a `useMotionValue` on enter over about a second, a short line draws to underline each figure as it settles.
- Menu and stories. The line rests. Cards lift 2 to 3px with a softening shadow on hover, images reveal once. No line, this is where people read and decide.
- Footer. The line ties off, a small knot `pathLength` on inView, closing the page the way the intro opened it.
- Page transitions. `AnimatePresence` on the route, a 240ms cross fade, header and footer persistent.

## 5. Performance and guardrails

Performance (motion-dev): animate only transform, opacity, clip-path and filter. Never width, height, top, left or margin. Set `willChange` only during an animation and remove it after. No DOM reads or allocations in per frame callbacks. Test the journey line and the hero blur on a mid tier Android before shipping.

Anti slop (taste-maker, hard): no ingredient explosion or flying garnish, that is the one move from the reference that reads as a cheap AI mockup. No radial ink streaks. One focal point moving per view, never six. Never animate from scale 0, start at 0.96 and pair with opacity. No linear easing except the scroll line. Cream, never pure white. Solid ink panels, never gradient scrims. If a motion cannot name its job, cut it.

## 6. Build list, risk ordered, vertical slices

Each node is a working slice with an observable done criterion. Build in this order, the riskiest thing first so a wrong approach dies cheap.

1. Hero scroll engine, in the real app. Build `components/motion/Hero.tsx` as a dynamically imported client island using the real `public/heroes` images and the tokens above. Done when: it matches the signed off feel on desktop, holds 60fps with the blur on a mid tier Android, the reduced motion cross fade works, buttons are real links, Lighthouse Accessibility is 100.
2. Motion tokens plus `LineDraw` primitive. One `pathLength` based component reused by every line moment, and the intro draw wired with the once per session guard. Done when: the intro draws once then never again in the session, reduced motion shows it finished.
3. `SectionReveal` wrapper. Done when: headings and their one lead element reveal once on scroll, body stays static, reduced motion fades under 150ms.
4. `JourneyLine`, scroll linked. Done when: the line tracks scroll exactly, steps arrive as it reaches them, reduced motion shows it fully drawn with steps present.
5. `CountUp` plus underline draw on the impact figures. Done when: numbers count on enter, a short line underlines each, reduced motion shows the final number.
6. `PageTransition` cross fade plus the footer knot. Done when: routes cross fade at 240ms with header and footer persistent and no layout shift.

## 7. Self check, and what is not in scope

Checked against the brief: every motion has one named job, reduced motion is designed not bolted on, the line is the single device across all six surfaces, and only three moments spend real budget (intro draw, hero, journey line). Copy passes the voice rules.

Not resolved yet, stated honestly rather than hidden:
- The exact hold and transition heights need a short device tune, the token defaults are the starting point.
- The blur cost on low end mobile is the one real risk, the cross dissolve fallback in the hero decision record is the mitigation.
- Final hero photography is still the pack images until the real shoot lands, or until the fresh bread hero is chosen. Swapping images is a data change, not a motion change, so it does not affect this spec.

Once Abbey approves this document, the hero gets built into the site to match, then the same line language rolls out to the other five surfaces in the order above.
