# Off the Hook — signature dish record and new master anchor prompts

Addendum to `claude/19-imagery-session-handoff.md`. Written 18 Aug 2026, following the register change in `18-image-plan-REVISED.md`.

Two deliverables here: the menu record for the signature dish, and the prompt blocks for the two replacement master anchors.

> **Repo note, 31 August 2026.** The parent document,
> `19-imagery-session-handoff.md`, is not in this repository. This addendum is
> what was handed over and it reads standalone. The parent matters only as the
> register of banked keepers, all of which Doc 20 open item 3 retires anyway.
>
> **Section 1 has not been applied to the seed.** The record below says
> "Confirm with Anne before this goes to print or to the seed script", and the
> allergen question is still open (Doc 20 open item 4). `db/seed.sql` still
> carries the old beef shin line. Applying it is a one line change once Anne
> answers.

---

## 1. Menu record

For the `menu_items` seed data in Doc 6. Approved 18 Aug: lamb shoulder or leg skewers, £17.

```ts
{
  name: 'Fire-grilled lamb, suya spice, burnt lime',
  description: 'Lamb rubbed in our own suya blend and cooked hard over open flame until the edges char. The spice runs deep, a little heat, a lot of smoke. Charred lime and a cool herb dressing to cut through the richness.',
  price_pence: 1700,
  section: 'large',
  order: 1,
  allergens: ['peanuts'],
  is_vegetarian: false,
  is_vegan: false,
  is_available: true,
  is_published: true,
}
```

### Notes on the record

**Allergens.** Peanuts is non-negotiable. Traditional suya is groundnut-based, and under Natasha's Law this has to be declared on the card and communicated at the pass. Doc 18 (Food Safety and HACCP) already commits to a printed allergen matrix at the pass, so this dish must appear on it.

**One open item.** If the herb dressing is yoghurt-based, add `'milk'` to the array. If it uses a sesame element, add `'sesame'`. Confirm with Anne before this goes to print or to the seed script.

**Price basis.** £17 holds the £28 average spend per cover in the Year 1 financial model at 68% gross margin. Shoulder or leg takes the suya rub better than rack, holds up to hard char without drying, and costs roughly a third of French-trimmed cutlets. If cutlets go on the menu they run as a separate premium line at £22 with a thinner margin accepted on that line only.

**Voice check.** No em dashes, no jargon, UK spelling, sentence case, short-long-short rhythm. Passes.

> **Superseded detail.** "Skewers" in the approval line above is overtaken by
> Doc 20 standing rule 2: no skewers anywhere in the set. The cut, the price and
> the record are unchanged. The dish name carries no skewer reference, so the
> record itself needs no edit.

---

## 2. Food master anchor prompt

Model `nano_banana_pro`, 2k, aspect 4:5. This becomes the new food master. Every subsequent food frame runs image-to-image against it.

### Prompt

A close overhead-angled photograph of skewered fire-grilled lamb on a warm hand-thrown reactive-glaze ceramic plate, shot from thirty to forty-five degrees above, the honest angle you eat at. The lamb is thickly coated in a deep red-brown spice rub, cooked hard over open flame so the edges are blackened and caught, the surface glossy where the fat has rendered. Charred half limes sit alongside, cut side up, their edges blistered dark. A cool green herb dressing pooled loosely at one side. Real steam rising, a little mess on the plate, generous and confident rather than precise. Warm directional daylight rakes across from one side, soft, roughly four thousand Kelvin, so the texture of the char and the spice crust reads clearly. Deep warm espresso shadows with detail held in them, cream highlights, never pure white. A whisper of film grain. The plate sits on warm oak. Compose loose with clean empty space on the right side of the frame. Warm, editorial, documentary-real, the register of a serious live-fire restaurant, confident and unfussy.

### Negative tail

no text, no letters, no menu, no labels, no writing of any kind, no tapioca pearls, no foam, no smears, no tweezer plating, no negative-space fine-dining composition, no white tablecloth, no fine white porcelain, no plastic sheen, no HDR, no orange-teal grade, no blown-out orange flame glow, no cold or blue light, no heavy vignette, no clutter, no deformed fingers, no hands in frame

> **Do not run this prompt as written.** Doc 20 supersedes it on two counts.
> Standing rule 1: this prompt stacks four blackening cues and the model read
> them as an instruction to carbonise. Standing rule 2: no skewers anywhere.
> Doc 20 carries the corrected direction and the locked anchor job id.

---

## 3. Interior master anchor prompt

Model `nano_banana_pro`, 2k, aspect 3:2. This becomes the new interior master. Every subsequent room and still-life frame runs image-to-image against it.

### Prompt

A photograph of a warm, characterful restaurant dining room in the quiet before service, shot at eye level from a corner so the tables lead the eye into the room. Warm timber and aged plaster walls, simple sturdy wooden tables without cloths, plain unfussy glassware, low ceramic vessels. Lived-in and worn in the right places, not precious. Warm afternoon daylight comes through a window on one side, soft and directional, raking across the tables so the grain and texture read. Deep warm espresso shadows with detail held, cream highlights, never pure white. A whisper of film grain. The room feels like somewhere that cooks over fire: warm, generous, unhurried. Compose loose with clean empty space on one side of the frame. Warm, editorial, documentary-real.

### Negative tail

no text, no letters, no menu, no labels, no signage, no writing of any kind, no white tablecloths, no crystal, no velvet, no gilt, no formal fine-dining styling, no plastic sheen, no HDR, no cold or blue light, no orange-teal grade, no heavy vignette, no clutter, no people, no faces

---

## 4. Order of work

1. Generate the food master. Taste pass on the returned pixels before anything else runs against it.
2. Generate the interior master. Same.
3. Once both are signed off, re-roll every banked keeper in Doc 19 image-to-image against the new anchors. The old keepers are off-register and do not ship.
4. Bring the remaining shot list into the new world: place setting, sides, bread, a second room angle, the hook and line still-life.

## 5. Standing rules

Taste pass runs on the pixels attached back into chat, not on trust. If a frame drifts, pull the anchor harder and reroll that one frame only.

People, hands presented as a real person, and any trainee are a real shoot only. Never generated. The trainee at the grill is now a core frame in the shoot brief, not a supporting one, and needs written consent before the camera lifts.
