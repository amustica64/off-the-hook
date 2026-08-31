# Blocking the two safeguarding assets on production

**Written 31 August 2026. Not applied. Applying any of this needs Abbey's
Vercel access.**

Two files are publicly reachable on `offthehookcic.vercel.app` right now and
should not be:

```
/heroes/portrait-anne.webp             200
/heroes/certificate-city-guilds.webp   200
```

The first is a synthetic likeness of a real named woman, captioned as a
photograph of her. The second reproduces City and Guilds' registered marks,
crest and Director-General's signature on a certificate this provider does not
hold.

They were deleted from source on 31 August in `45afed7`, but that commit is in
`github.com/amustica64/off-the-hook`, which nothing deploys. The live site is
built from `github.com/amustica64/offthehookcic`. See
`logs/2026-08-31-session-4.md`.

---

## Which option to use

| | Takes effect | Needs a rebuild | Needs the repo question answered |
|---|---|---|---|
| **A. Firewall rule** | Immediately | No | No |
| **B. Delete at source** | On next deploy | Yes | No |
| **C. `vercel.json` redirect** | On next deploy | Yes | No |

**Use A if it is available on the plan.** It is the only one that is genuinely
independent of a rebuild, and the deployment pipeline is exactly what is
currently in doubt. Then do B as the durable fix.

I cannot check which plan the project is on, so I cannot confirm the Firewall
tab is present. If it is not, go straight to B.

---

## Option A. Vercel Firewall rule, no rebuild

Dashboard: **Project → Firewall → Custom Rules → New Rule**.

- **Name:** `block-retired-safeguarding-assets`
- **Condition:** Request Path — `equals` — `/heroes/portrait-anne.webp`
- **Add OR condition:** Request Path — `equals` — `/heroes/certificate-city-guilds.webp`
- **Action:** `Deny`
- Save, then **Publish** the ruleset. Custom rules apply to production without
  a redeploy.

Use `equals` rather than `contains`. A `contains` match on `heroes` would take
down the whole directory, and while that directory should be empty anyway, a
firewall rule is not the place to make that decision.

Equivalent via the REST API, if you would rather script it. Needs a token with
project scope, and `$TEAM_ID` only if the project sits under a team:

```bash
curl -X PATCH \
  "https://api.vercel.com/v1/security/firewall/config?projectId=$PROJECT_ID&teamId=$TEAM_ID" \
  -H "Authorization: Bearer $VERCEL_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "action": "rules.insert",
    "id": null,
    "value": {
      "name": "block-retired-safeguarding-assets",
      "active": true,
      "conditionGroup": [
        { "conditions": [
            { "type": "path", "op": "eq", "value": "/heroes/portrait-anne.webp" }
        ]},
        { "conditions": [
            { "type": "path", "op": "eq", "value": "/heroes/certificate-city-guilds.webp" }
        ]}
      ],
      "action": { "mitigate": { "action": "deny" } }
    }
  }'
```

Condition groups are OR-ed with each other and AND-ed within, which is why each
path sits in its own group.

**Verify after publishing:**

```bash
for f in /heroes/portrait-anne.webp /heroes/certificate-city-guilds.webp; do
  printf '%s  %s\n' \
    "$(curl -s -o /dev/null -w '%{http_code}' "https://offthehookcic.vercel.app$f?cb=$RANDOM")" "$f"
done
```

Expect `403` on both. Anything still returning `200` means the ruleset was
saved but not published.

---

## Option B. Delete at source. The durable fix.

The files are in the deployed repository, so this removes them properly rather
than hiding them.

```bash
git clone https://github.com/amustica64/offthehookcic.git
cd offthehookcic
git rm public/heroes/portrait-anne.webp \
       public/heroes/certificate-city-guilds.webp
```

The two are not alike here, which matters for how fast this can be done.

**The certificate is referenced by nothing** in that repository. It is an
orphan asset. Deleting it is a one-line change that cannot break the build, so
there is no reason to wait on anything.

**The portrait is referenced twice**, at `app/about/page.tsx:45` and
`app/page.tsx:268`, both as a raw `next/image`. Those two call sites have to
come out in the same commit or the build fails. Confirm before editing:

```bash
grep -rn "portrait-anne\|certificate-city-guilds" --include="*.tsx" --include="*.ts" .
```

`off-the-hook` already solved this in `45afed7`, which retired the whole hero
set and reshaped two call sites that were raw `next/image` rather than
`ImageSlot`. That commit is the reference for what the replacement looks like.

Then commit and push to `main`, which is the branch Vercel builds:

```bash
git commit -m "Remove the synthetic portrait and the fabricated certificate"
git push origin main
```

**If pushing does not trigger a deployment, that is itself the answer to the
pipeline question** and worth reporting: it means the Git integration is
disconnected and the 10 August build is frozen because nothing has been able to
deploy since.

---

## Option C. `vercel.json` redirect, if B cannot be done quickly

A stopgap that stops the files being served without touching the call sites.
`redirects` are evaluated before the filesystem, so they win over a static file
in `public/`. In the root of **offthehookcic**:

```json
{
  "redirects": [
    {
      "source": "/heroes/portrait-anne.webp",
      "destination": "/",
      "permanent": false
    },
    {
      "source": "/heroes/certificate-city-guilds.webp",
      "destination": "/",
      "permanent": false
    }
  ]
}
```

This still needs a deploy, and it returns a 307 to the home page rather than a
404, so any page still referencing the images will show a broken image instead
of a retired one. It buys time. It is not the fix.

---

## What this does not do

None of the three touches Vercel's CDN cache for copies already fetched, and
none reaches anything that has already scraped or archived the files. If either
image has been indexed, removal from origin is the first step and not the last.
Worth checking once the deny is live.
