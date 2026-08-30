# Start here: a plain-English brief for the Gemini build

**One page. Read this before anything else. It tells you what this project is, what is already done, and what you are being asked to finish.**

---

## What this is

Off the Hook is a real restaurant run as a Community Interest Company. It trains people leaving prison into paid hospitality work with proper, nationally recognised qualifications. The website has to do three jobs at once: sell the restaurant, tell the training story with honesty and warmth, and take referrals safely. The domain is offthehookcic.co.uk.

The brand is plain, warm, and grown-up. Cream and forest green, no gloss, no gimmicks. It should read like it was made by people who cared, not by a marketing team chasing trends.

## What has already been done for you

Three things are settled and you should not redo them.

First, the design is reconciled. The original brief came as nine documents that contradicted each other in six real places. Those fights are resolved and written down. The rulebook is Doc 12 (the decisions ledger). When Doc 12 names a decision, it wins. Do not go back to the raw pack to re-argue routing, database shape, user roles, or colours.

Second, the backend is built and proven. The full database, its security, its encryption for sensitive referral data, and its audit trail are written and tested. A twelve-point security proof passes. This part does not care about motion or visuals, so inherit it as it stands. Rebuilding it risks the safeguarding model, which is the one thing on this site that absolutely cannot be got wrong.

Third, there is a working reference site. Thirteen public pages are built in the exact stack you will use, with the colours, type, and gentle motion all working. Treat it as a design spec you can run. It removes every argument about what the brand should feel like, because you can just look at it.

## What you are being asked to do

Finish the site. In plain terms that means: build the pages that are still placeholders, build the admin area so the client can edit her own content and swap her own photos without a developer, wire up the analytics and legal bits, and then do the motion pass.

## The one thing to agree with Abbey before you start

There is a genuine fork on motion. The written brief asks for restrained, editorial motion, gentle and purposeful. Abbey has said she wants something more alive and interactive. Both are reasonable, but they pull in different directions, and the brand book warns hard against anything that reads as slick or over-produced. So settle this with Abbey first, in words, before you build the motion. Do not guess. Whatever you both choose, every animation must still turn itself off for people who ask their device to reduce motion.

## The hard boundary on accounts

This is the CIC's project, not Abbey's personal one. Nothing has been connected to any personal Supabase, Vercel, or Netlify account, and nothing should be. When it is time to go live, the CIC sets up its own accounts under its own domain and you point the site at those. The app reads everything from environment variables, so there is nothing hard-coded to unpick.

## How to change photos and words later

This is the question Abbey cares about most, so here is the answer in plain terms. Photos live as ordinary files with plain names. Swap a file for one of the same name and it updates everywhere. Words that change often, like the menu, the impact numbers, and the stories, live in the database. The admin area, which is the most important thing left to build, is the tool that lets Anne edit all of that and upload new pictures herself, with no developer in the loop.

## Where to look

Read the full handoff in Doc 13. Read Doc 12 for every locked decision. Then open the reference codebase, run it, and read the session logs in the `logs` folder, which record every decision and every trap already hit, in order. Eight specific traps are mapped in Doc 13 section 6. They cost time once. They should cost you none.

That is the whole brief. The foundation holds. Build on it.
