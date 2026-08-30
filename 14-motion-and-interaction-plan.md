# Off the Hook — motion direction

Validated and redesigned with the full motion stack: School of Motion craft foundations, Emil Kowalski's web-motion eye, taste-maker, the creative director, design-impeccable, and Motion (motion.dev) for implementation. This supersedes the earlier draft. Read it before building any animation.

## What we learned from the reference, and what we reject

The Seoul Bites reel Abbey shared is the right ambition and the wrong execution. What it gets right, and what we keep: the site feels alive and choreographed, it has a signature reveal device, the food moves with the scroll, and the scroll itself tells a story. That is the level of interactivity Off the Hook wants.

What we reject, all of it: the ink splatter on every surface, the falling petals, the red-and-black garishness, the busy maximalism where six things move at once, and the template-seller finish. It reads energetic but cheap, and it is an AI mockup, the text is gibberish. Off the Hook is a posh, proper brand. It cannot borrow that surface for a second.

The single move that turns that reference from cheap to refined is this: they use an ink brush as their signature device. We use our own line. Everything below follows from that.

## The idea: the line is the whole motion language

Off the Hook's logo is already a motion. A line draws in from the left and coils into the O. That is not a logo animation, it is the brand's DNA, and it becomes the one device the entire site is built on. The line draws you in, reels you through the story, and ties off at the end. It is literally off the hook, as motion. No other restaurant has it, which is exactly why it reads as a proper brand rather than a template.

The line does three jobs, and never more:
- It reveals. A hairline draws across to open a section, where the reference would swipe an ink brush.
- It connects. It threads down the page between moments, the visual rhyme that makes the whole site feel drawn by one hand.
- It measures. On the journey page it becomes the scroll itself, reeling you from step to step.

Everything else, the type, the food, the cards, stays still and lets the line and the light carry the movement.

## The craft rules (School of Motion, applied)

Posh is a timing decision before it is a visual one.

- Easing is meaning. Nothing moves linearly except the scroll-linked line. Reveals use a single confident ease-out (cubic-bezier .16, 1, .3, 1, a gentle circ-out) so things accelerate and settle like real objects. Exits ease in. No bounce anywhere except a whisper of settle on the signature draw.
- Spacing is the animation. The distance travelled is small, 8 to 16px, and the deceleration is long. Tight-to-loose spacing is what reads expensive. A big travel with a short ease is what reads cheap.
- Timing breathes. This brand is not a productivity app, so reveals sit at 500 to 600ms, the signature draw at 900ms to 1.2s, micro-interactions at 160ms. Posh brands take a beat. They do not snap.
- One focal point per view. This is where the reference fails hardest. In any viewport, one thing leads and the rest stay quiet. The eye is led, never scattered.
- A moving hold. The hero image drifts by a pixel or two even at rest, so nothing ever feels dead. Stillness, not frozenness.
- Contrast of speed is the tell of care. Fast, crisp micro-interactions set against slow, deliberate reveals. That contrast is what a trained eye reads as considered.

## Scene by scene

1. The intro, once per session. The line draws in and coils into the O, the wordmark settles up underneath, the header lifts into place. About 1.1s, one ease-out with a hair of settle. This is our reveal moment, the refined answer to the brush swipe. It plays once, never on every route.

2. The hero, editorial. The headline sets a few words at a time, a slow considered stagger, not a bouncy one. The hero photograph reveals behind a thin line that travels across and opens it with a clip-path wipe, so the line appears to draw the image into being. Then a slow parallax and the moving hold. One image, one headline, one button. Nothing else moves.

3. Section transitions. As each section arrives, a hairline draws across above its heading, then the heading and its one lead element fade and rise. Body copy never animates, only the anchors of a section. The line is the curtain, the content is the act.

4. Impact. The numbers count up from zero as they enter, over about a second, and a short line draws to underline each figure as it lands, tying the count to the mark.

5. The journey, the centrepiece. A single continuous line draws down the page, linked directly to scroll position, and each training step arrives as the line reaches it. You are quite literally reeled through the story of a person's route from referral to paid work. This is where the whole interactivity budget goes, because it is the one moment that is unique, memorable, and on-message. Everything else earns its restraint so this can be the set-piece.

6. Menu and stories. The line rests here so the eye can read. A restrained hover, cards lift two or three pixels with a softening shadow, images reveal once. No line, no drama, this is where people make decisions.

7. Footer. The line completes and ties off, a small knot of a gesture that closes the page the way the intro opened it.

## Emil's guardrails, non-negotiable

- Every motion has one job. If you cannot name it, cut it.
- Interruptible always. CSS transitions or Motion springs that honour interruption, never keyframes that restart. A user scrolling fast must not fight the animation.
- Never animate from scale 0. Start from 0.96 and pair with opacity.
- Transform and opacity only. Line draws use stroke-dashoffset or pathLength, reveals use clip-path. Never animate width, height, top, left, margin.
- Reduced motion is first-class, not a fallback. See below.

## Implementation, Motion (motion.dev)

- Line draws: `motion.path` with `pathLength`, `initial={{ pathLength: 0 }}` to `1`, custom ease. For the journey, drive `pathLength` from scroll with `useScroll({ target, offset: ["start end", "end start"] })` into `useTransform`.
- Reveals: `whileInView` with `viewport={{ once: true, amount: 0.3 }}`, `staggerChildren` for the few, the custom cubic-bezier as `ease`.
- Parallax and moving hold: `useScroll` plus `useTransform` on `y`, with `style={{ willChange: "transform" }}`, kept tiny.
- Count-ups: animate a `useMotionValue`, render through `useMotionValueEvent`, keep the callback allocation-free.
- Page transitions: `AnimatePresence` on the route, a 240ms cross-fade, header and footer persistent.
- Next.js: the heavy scroll pieces are client components (`"use client"` or `motion/react-client`), loaded with `next/dynamic` so the rest stays server-rendered. Motion runs transform, opacity and clip-path on the browser's own pipeline, so this stays cheap.
- Performance: `willChange` only while animating and removed after, no DOM reads in per-frame callbacks, test on a mid-tier Android before shipping the journey line.

## Accessibility, and the posh degrade

A proper brand degrades with grace. Under `prefers-reduced-motion` (via `useReducedMotion`): the logo shows finished, no draw. Reveals become a sub-150ms opacity fade with no travel. The journey line shows fully drawn, steps simply present. Count-ups show the final number. Nothing meaningful is ever carried by motion alone, and the site is just as elegant standing still. Focus order stays correct through the drawer and any overlay, and motion never blocks a click.

## Where the budget goes

Spend it on three things: the intro draw, the hero line-wipe, and the journey line. Those three are the show. Everything else, the section reveals, the hovers, the counts, stays deliberately quiet so those three land. The reference moved everything and impressed no one who matters. We move three things, beautifully, and it reads as a proper brand.

## Then, the images

The imagery is designed after this, on purpose, so every hero and section leaves room for the line to draw and the reveal to breathe. Photography direction picks up from here, warm, editorial, real, shot to sit inside this motion rather than fight it.
