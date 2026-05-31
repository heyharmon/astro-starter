---
description: Autonomously build a prospect's daycare website by personalizing the maplewood-base demo to their brand + data, deploy it to its own Vercel project, and write a machine-readable result file. Runs unattended — no human gates.
---

# Build Prospect Site

You are building a **real prospect's daycare/preschool website** for Small Seats Studio by
**transforming** the `maplewood-base` demo into an elevated, personalized site for one prospect.

This runs **fully autonomously and headlessly** (`claude -p`). Never pause for human approval. Never
ask a question. If something blocks you, recover or write a `failed` result file and stop. Your final
job is always to leave a result file behind.

## ⚡ Speed mandate — DO EVERYTHING YOURSELF (read this first)

A pilot build of this command took **5.5 hours** because it delegated each step to the `design` /
`content` / `images` / `seo` / `deploy` sub-agents via the **Task** tool. Sub-agent delegation under
nested headless `claude -p` has severe latency — a dozen hops compound into hours.

**This command is a single, flat agent.** You — the root agent — perform every step directly with
`Read` / `Edit` / `Write` / `Bash`. The transformation logic below is the same in spirit as what the
specialists used to do; only *who executes it* changed (you, in-process, no hops).

- **NEVER use the `Task` tool.** Do not spawn `design`, `content`, `images`, `seo`, or `deploy`.
- **NO per-build image sourcing.** Do not search/download Unsplash. Keep maplewood-base's existing
  placeholders (see Step 4). Real photos come later, after a prospect engages.
- **NO screenshot self-eval loop.** Do not start a browser, screenshot, or grade. Gate on
  `npm run healthcheck` green **+** a live HTTP 200 that contains the prospect's name (Step 8 does
  this). A human eyeballs final quality.
- **Fewer, fatter passes.** Batch all `src/data/*.json` content edits together; batch tokens + fonts
  together. Do purely mechanical swaps deterministically from the brief; reserve model judgment for
  copy voice and the color palette.

Target wall-clock: **~15–30 minutes**, not hours.

Each step says concrete, model-light operations so this still works if invoked with a smaller model
(e.g. `--model sonnet`). Don't rely on Opus-level reasoning for any single step.

## Input

`$ARGUMENTS` is the path to a **brief JSON file** (e.g. `.briefs/sunshine-preschool-austin-tx.json`).
Read it first. Shape:

```jsonc
{
  "id": "sunshine-preschool-austin-tx",       // slug → git branch name + Vercel project suffix
  "name": "Sunshine Preschool",
  "location": { "city": "Austin", "state": "TX", "metro": "Austin, TX" },
  "google": { "rating": 4.7, "reviews": 142, "mapsUrl": "..." },
  "website": { "url": "https://...", "exists": true, "issues": [...], "qualityNotes": "..." },
  "contact": { "name": null, "role": null, "email": "...", "phone": "...", "formUrl": "...", "facebookUrl": "..." },
  "brand": {
    "colors": ["warm yellow", "#2e7d32"],
    "aesthetic": ["warm", "playful", "dated"],
    "modernity": "outdated",
    "tone": "nurturing & faith-based",
    "vibe": "...",
    "logo": "...",
    "imagery": "real | stock | none",
    "suggestedDirection": "FREE-FORM prose — the single most important steer for this build.",
    "sources": ["https://...", "https://facebook.com/..."]
  }
}
```

## Honesty rules (NON-NEGOTIABLE — this site is shown to the real owner)

The `maplewood-base` content is full of invented specifics. You MUST NOT carry fabricated facts onto a
real prospect's site. Concretely:

- **Use real facts we have:** the prospect's real `name`, `location.city`/`state`, and — for social
  proof — their real `google.rating` + `google.reviews` (e.g. "Rated 4.7 ★ by 142 families on
  Google"). These are true and from our data.
- **Never fabricate prospect-specific facts.** No invented staff names, no named parent testimonials
  presented as real, no specific tuition dollar figures, no specific phone/address unless it's in the
  brief's `contact`. Replace Maplewood's invented people/quotes/prices with either (a) the real
  aggregate Google rating line, or (b) clearly generic, non-attributed copy, or (c) remove the
  section. When in doubt, leave it out — a thinner honest site beats a richer fabricated one.
- **Contact details:** only use `contact.phone` / address / email actually in the brief. If absent,
  use a neutral CTA ("Get in touch to book a tour") wired to the form/email we do have, and do not
  invent a phone number or street address.
- **Tuition/ratios:** we do not know the prospect's real rates or ratios. Drop specific tuition dollar
  amounts and invented ratios; keep enrollment copy general ("transparent monthly tuition — ask us for
  current rates"). Do not present placeholder numbers as if real.
- **Images:** never let a stock face stand in for the real named owner/staff. Keep the founder/team
  gradient placeholders.

## Voice

Match Small Seats' voice and the prospect's own `brand.tone`: warm, plain-English, reassuring,
anti-corporate. Sound like a real person who gets small childcare programs — never like a marketer.

---

# Procedure (flat — you do each step yourself, in order)

## Step 0 — Brief + branch

1. `Read` the brief at `$ARGUMENTS`. Let **`SLUG = brief.id`**. Keep the parsed brief in mind for
   every later step.
2. Verify the working tree is clean:
   ```bash
   git status --porcelain
   ```
   If it is NOT clean → write a `failed` result (see **Failure handling**, reason "working tree not
   clean") and stop.
3. Fork a fresh branch from the committed baseline:
   ```bash
   git checkout maplewood-base
   git branch -D "<SLUG>" 2>/dev/null || true   # clean rebuild if it already exists
   git checkout -b "<SLUG>"
   ```
   This is a **transformation** of `maplewood-base` (already styled, full 5-page sitemap). Change
   tokens, content, and labels to fit the prospect — do **not** rebuild structure or components.

## Step 1 — Mechanical swaps (deterministic, no judgment)

Do these as direct string edits from brief values. They are pure rebrand plumbing.

**`src/data/site-meta.json`** — set:
- `name` → `brief.name`
- `shortName` → a natural short form (drop "Preschool/Daycare/Early Learning" suffix, e.g.
  "Austin Thrive Preschool" → "Austin Thrive")
- `tagline` → a short brand line in the prospect's voice (judgment, one line)
- `description` → one honest sentence: what they are + city (≤155 chars)
- `url` → `https://<prospect-domain>` if known from the brief, else `https://austinthrivepreschool.com`-style
  best guess from the name; otherwise keep a plausible `.com`. (Not load-bearing — canonical only.)
- `footerBlurb` → one warm line
- `licenseNote` → honest, e.g. "Licensed in-home preschool · {city}, {state}" (don't claim ages/ratios
  you don't know)
- `copyright` → `© <year> <brief.name>.`
- `social.facebook` → `brief.contact.facebookUrl` if present, else `""`; `social.instagram` → `""`
  unless known
- `formspreeId` → leave `"YOUR_FORM_ID"` (real form wired later)

**`src/data/footer.json`** — rename the `"Maplewood"` section heading to `shortName`. Trim the
Programs link list to the stages this prospect plausibly serves (e.g. drop "Infants" for an in-home
preschool). Keep hrefs.

**`src/data/nav.json`** — keep structure. Optionally simplify `"Enrollment & Tuition"` → `"Enrollment"`
(we drop hard tuition numbers, so this reads more honestly).

**`src/components/ContactForm.jsx`** — if `brief.contact.phone` exists, localize the placeholder area
code only:
```bash
AC=$(node -e 'const p=process.argv[1]||"";const m=p.match(/\((\d{3})\)/);process.stdout.write(m?m[1]:"")' "<brief.contact.phone>")
[ -n "$AC" ] && sed -i '' "s/(555) 000-0000/($AC) 000-0000/" src/components/ContactForm.jsx || true
```

**Brand strings in `src/pages/styleguide.astro`** (internal `noindex` page, but swap for consistency):
replace the three visible "Maplewood" strings (the `<title>`, the `<h1>`, and the `CtaBand heading`)
with the prospect's name. The leading comment line is cosmetic — leave it.

## Step 2 — Design pass: palette + fonts (one fat pass)

Map `brand.colors` + `brand.aesthetic` + `brand.modernity` + `brand.suggestedDirection` onto the
**13 semantic color tokens** and a **font pairing**. Keep every token NAME and the component system —
change values only.

**a. Choose the palette.** Pick concrete hex values for these tokens. Honor the brief's colors and
direction (e.g. "leafy green + cream + terracotta + natural wood"). Contrast is load-bearing — verify
with the snippet below before saving:

| token | role | constraint |
|-------|------|------------|
| `--color-bg` | page background | the brand's lightest tint (cream/off-white); keep it light |
| `--color-surface` | cards / raised | a touch darker than bg |
| `--color-surface-2` | sunk / alt panel | darker than surface |
| `--color-ink` | primary text | **≥ 7:1 on bg** (near-black; aim 12+, may be temperature-tinted) |
| `--color-ink-soft` | secondary text | **≥ 4.5:1 on bg** (WCAG AA for body text) |
| `--color-primary` | brand / primary actions | the main brand color; readable as a button bg with white text |
| `--color-primary-d` | darker primary (footer, hovers) | a darkened `primary` |
| `--color-accent` | label / emphasis text | **≥ 4.5:1 on bg** for body text; **≥ 3:1** OK if used only as large/bold labels (a secondary warm pop) |
| `--color-accent-2` | decorative + on-dark pop | no hard constraint |
| `--color-line` | hairlines / borders | a subtle bg-toned tint |
| `--color-error` | inline errors | keep red-ish (`#b3261e`) |
| `--color-blue`, `--color-green` | legacy aliases | set both = `--color-primary` |

Contrast check (run before saving; raise/darken any failing token):
```bash
node -e '
const hex=h=>{h=h.replace("#","");return[0,2,4].map(i=>parseInt(h.slice(i,i+2),16))};
const L=c=>{const s=c/255;return s<=.03928?s/12.92:((s+.055)/1.055)**2.4};
const lum=h=>{const[r,g,b]=hex(h);return .2126*L(r)+.7152*L(g)+.0722*L(b)};
const ratio=(a,b)=>{const x=lum(a),y=lum(b);return((Math.max(x,y)+.05)/(Math.min(x,y)+.05)).toFixed(2)};
const bg="#fbf8f1";  // <-- your --color-bg
console.log("ink   ",ratio("#2a2a23",bg),"(need ≥7, aim 12+)");
console.log("inksoft",ratio("#6a6457",bg),"(need ≥4.5)");
console.log("accent",ratio("#b15c33",bg),"(need ≥4.5 body / ≥3 large-bold)");
'
```
(For reference, the pilot's values above score ink 13.62, ink-soft 5.54, accent 4.45 — all pass; the
accent reads 4.45 because it's used only as large/bold eyebrow labels.)

**b. Choose fonts.** A Google Fonts display + body pairing that fits the aesthetic. Safe pairings:
- warm / earthy / homey / wholesome → **Fraunces** (display) + **Nunito Sans** (body)
- modern / clean / minimal → **Manrope** or **Inter** (both)
- classic / trusted / established → **Lora** (display) + **Source Sans 3** (body)
- playful / friendly → **Baloo 2** or **Quicksand** (display) + **Nunito Sans** (body)

**c. Apply in three places (must stay in sync):**

1. **`src/styles/global.css`** — in the `@theme` block, set `--font-display`, `--font-body`, and all
   13 `--color-*` tokens to your chosen values.
2. **`src/data/design-tokens.json`** — mirror the exact same values in `colors.tokens.*` and
   `typography.fonts.{display,body}`. (Machine-readable snapshot — keep it identical to global.css.)
3. **`src/components/Head.astro`** — replace the fonts comment block with the live Google Fonts links
   for your chosen families, e.g.:
   ```html
   <link rel="preconnect" href="https://fonts.googleapis.com" />
   <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
   <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=Nunito+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
   ```

**Worked example (the pilot, Austin Thrive):** `--font-display:"Fraunces"…serif`,
`--font-body:"Nunito Sans"…sans-serif`; `bg #fbf8f1`, `surface #f4eee1`, `surface-2 #eae1cf`,
`ink #2a2a23`, `ink-soft #6a6457`, `primary #477f34`, `primary-d #2e5a2c`, `accent #b15c33`,
`accent-2 #c9a878`, `line #e6dcc8`, `error #b3261e`, `blue/green #477f34`.

## Step 3 — Content + SEO rewrite: `src/data/site-content.json` (one fat pass)

This file holds **all** page copy + the per-page SEO `pages.*.title`/`description`. It is the biggest
change and the only step that needs real writing judgment. **Edit section by section. Preserve every
key and the structure exactly — change string VALUES only. Never delete a structural key.**

Apply the **Honesty rules** to each section:

- **`hero`** — headline/lead/eyebrow/CTAs in the prospect's voice + city. Update `image.label` to an
  honest alt phrase (a real photo is NOT added — see Step 4). Keep `badge`; if its number was a made-up
  stat, swap to the real Google rating (e.g. `value:"5.0★"`, `label:"52 Google reviews"`) or a safe
  generic ("Now enrolling").
- **`stats`** (4 cells) — replace invented numbers (ratios, "15 years", "120 families") with true ones
  from the brief (Google rating, # reviews) or safe non-numeric value props. Don't invent.
- **`founder`** — if `brief.contact.name` is the owner: use it as `name`, `brief.contact.role` (or
  "Founder & Director") as `title`, rewrite `quote`/`body` warmly in first person, update `image.label`
  to the real name. Keep the "90% of brain develops before five" educational stat (it's a general fact,
  not a prospect claim). If no owner name in the brief → make it non-attributed ("Our founder") and
  generic.
- **`approach`** — rewrite copy; update `images[].label`s to honest alts. No `src`.
- **`programsPreview`** + **`programs`** (array) — reframe to the stages the prospect plausibly serves
  (toddler / preschool / pre-K for a small in-home program; keep infants only if implied). Use stage
  language, not exact ages you can't verify. Update each `image.label`. No `src`.
- **`features`** — generic value props; fine as-is with light voice edits.
- **`schedule`** — a generic warm daily rhythm is fine (don't assert exact hours you don't know).
  Update `image.label`.
- **`testimonials`** — **DELETE the three fabricated named quotes.** Replace with the real aggregate
  rating + non-attributed warmth. Pilot pattern:
  - `rating.text` → "Rated {rating} ★ by {reviews} {city} families on Google"
  - `items[0]` → quote stating the real aggregate, `name:"{City} families on Google"`,
    `detail:"{rating} ★ · {reviews} reviews"`
  - `items[1]`, `items[2]` → generic, clearly non-attributed ("A local parent" / "{Brand} family")
    describing the warmth families report — no invented names or child details.
- **`enrollmentCta`**, **`cta`** — warm closing CTAs, "Book a tour".
- **`contact`** — use ONLY brief values: `phone`/`phoneHref` ← `brief.contact.phone` (or drop if
  absent); `email`/`emailHref` ← `brief.contact.email` (or drop); `address` → `["{city}, {state}",
  "Address shared when you book a tour"]` (NEVER invent a street); `hours` → generic ("Get in touch to",
  "book a tour") unless real hours are known.
- **`pages.programs` / `pages.about` / `pages.enrollment` / `pages.contact`** — these hold both SEO
  meta and page copy:
  - **SEO:** `title` (rendered as "Title | {name}" — keep rendered title ≤ 60 chars) and `description`
    (≤ 155 chars, unique per page, name + city + "preschool/daycare").
  - **`pages.about.story`** — rewrite the two/three paragraphs to the prospect; update `story.image.label`.
  - **`pages.about.values`** — generic promises; fine with light edits.
  - **`pages.about.team.members`** — **keep ONLY the real founder** (from `brief.contact`); DELETE the
    other fabricated educators. If no owner name → reduce to one non-named generic entry or drop names.
    Update the surviving `image.label` (no `src`). (A single-member team renders fine in the existing
    grid.)
  - **`pages.enrollment.tuition`** — **drop all dollar figures.** Set every tier `price:"Ask us"`,
    `cadence:"for current rates"`; rewrite `note`/`included` to "ask us for current rates". Reframe
    tier `name`/`age` to stages. Rewrite `faq` answers honestly (no asserted hours/ratios/ages).
  - **`pages.contact.info`** — mirror the honest `contact` values; `form.ageOptions` → stage labels.

## Step 4 — Images: keep placeholders (NO sourcing)

Do **not** search or download images. Keep maplewood-base's existing placeholders exactly. You only
updated their `label`s in Step 3 (honest alt text). Do **not** add any `src` fields — maplewood-base's
components render the gradient placeholder when there's no `src`, which is the intended first-pass look.
Founder/team stay as gradient placeholders (never a stock face on a real named person). Real photo
sourcing happens later, after the prospect engages.

## Step 5 — Write honest build notes

Write `.briefs/<SLUG>.notes.md` — one honest paragraph (the deploy script puts this in the result
file's `notes`). State plainly: what palette/fonts you chose, which honest facts you used (real
name/city, real Google rating, real phone/email if present), what you intentionally dropped for honesty
(fabricated staff/quotes/tuition/address), how programs were framed, that images are placeholders
(no photos sourced this pass), and that screenshot self-eval was skipped (verified by green
healthcheck + live HTTP 200 with the prospect's name). Be specific and truthful — a real business
owner reads this.

## Step 6 — Healthcheck (gate)

```bash
npm run healthcheck
```
This builds the site + validates JSON. **Fix any failure** (bad JSON, missing key, build error) and
re-run until green. If it cannot be made to pass, write a `failed` result (**Failure handling**) and stop.

## Step 7 — Commit on the prospect branch

```bash
git add -A
git commit -m "build(<SLUG>): personalized prospect site from maplewood-base

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

## Step 8 — Deploy (baked script — writes the result file)

Run the committed deploy script. It deploys to `smallseats-<SLUG>`, disables Deployment Protection,
discovers + verifies the public production alias, and **writes `.briefs/<SLUG>.result.json`** (built or
failed) using your `notes.md`:

```bash
bash scripts/deploy-prospect.sh "<SLUG>"
```

Read its stdout. Confirm it printed `PUBLIC_URL=` with an `https://….vercel.app` that returned HTTP
200. The result file is now written — you are done. Do **not** re-improvise deploy steps; if the
script reports `failed`, that failed result file is the correct, honest outcome.

---

# Failure handling (pre-deploy fatal errors only)

If you must abort BEFORE Step 8 (dirty tree, unfixable healthcheck, etc.), write the result file
yourself so the run is self-terminating, then stop:

```bash
SLUG="<SLUG>"; REASON="<one honest sentence on exactly where it broke>"
SLUG="$SLUG" REASON="$REASON" node -e '
const fs=require("fs");const E=process.env;
const cp=require("child_process");
let sha="";try{sha=cp.execSync("git rev-parse --short HEAD").toString().trim()}catch(e){}
const d=new Date().toISOString().slice(0,10);
fs.mkdirSync(".briefs",{recursive:true});
fs.writeFileSync(`.briefs/${E.SLUG}.result.json`, JSON.stringify({
  id:E.SLUG, branch:E.SLUG, vercelProject:`smallseats-${E.SLUG}`,
  previewUrl:"", buildStatus:"failed", builtAt:d, commit:sha, notes:E.REASON
},null,2)+"\n");
'
```

(Step 8's script handles deploy-time failures itself — only use this for earlier aborts.)

# Output contract (the smallseats brain depends on this — do not change field names)

`.briefs/<SLUG>.result.json` must always exist when this command ends, with EXACT fields:
`id`, `branch`, `vercelProject`, `previewUrl`, `buildStatus` (`"built"` | `"failed"`),
`builtAt` (YYYY-MM-DD), `commit` (short SHA), `notes`. On success, `previewUrl` is a PUBLIC, loading
URL. Branch == Vercel-suffix == `SLUG` == `brief.id`. `.briefs/` is gitignored.

# Definition of done

- Branch `<SLUG>` exists, forked from `maplewood-base`, with a clean committed build.
- `npm run healthcheck` passed.
- Dedicated Vercel project `smallseats-<SLUG>` has a live, **publicly loading** production URL.
- `.briefs/<SLUG>.result.json` exists with `buildStatus` and (on success) a working `previewUrl`.
- You used **zero** `Task` delegations, sourced **zero** images, and ran **zero** screenshot evals.

$ARGUMENTS
