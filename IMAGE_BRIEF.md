# Καιρός — Image Brief

Everything the landing page still needs, with generation prompts.

> **The product line is two journals, three collections.** Essential is a plain
> mint-green journal. Legacy is the dark green journal with the agate. Insight
> ships *that same Legacy journal* with the ritual kit around it. There is no
> third journal design, and no brown edition — if you have renders showing one,
> they are out of date.

---

## Start here: photographs you already have

Three of the seven slots need no generation at all.

| File | What it is |
|---|---|
| `origin-app-v1.png` | The first build of the app — black text on a white screen, no styling |
| `origin-journal-prototype.png` | The first prototype journal — a plain notebook with an NFC chip in the cover |
| `journal-legacy-detail.jpg` | **Check the original.** The agate is back in the product, so the close-up that was wrong this morning is right again |

**The two origin photographs are the most valuable images on this page**, and it
isn't close. The story section claims someone with no software background built
this from nothing. Every visitor has read that claim somewhere else and
discounted it. A screenshot of black text on a white screen, and a photo of a
chip pushed into a notebook, are not a claim — they are the receipt.

They should look bad. Do not clean them up, re-render them or retouch them. The
worse they look, the further the distance to the current product reads.

Both are 4:3 and both collapse silently while absent, so the section reads fine
until they land.

---

## Brand reference

Paste this as context before any individual prompt.

| | |
|---|---|
| **Name** | Καιρός (Kairos) — Greek for *the opportune moment*, the right time rather than the passing of time |
| **Product** | A real leather journal with an NFC chip in the cover. Tap it with a phone, write by hand, and the app reads the page back to you |
| **Made in** | Austria |
| **Feeling** | Quiet, unhurried, considered. A thing you keep, not a gadget |

**Palette**

| Role | Hex |
|---|---|
| Brand green | `#558B6E` |
| Antique brass / gold | `#C9A961` |
| Page background | `#050507` |
| Card background | `#0f0f12` |
| Off-white text | `#F5F5F0` |

**The two journals**

| | Cover |
|---|---|
| **Essential** | Soft mint-green vegan leather, matte, plain — no stone, no brass corners |
| **Legacy** | Dark green full-grain leather, natural agate centrepiece, antique brass corner protectors |

Insight ships the Legacy journal. Both journals: circular brushed brass NFC
medallion inset in the cover, lay-flat binding, 200 GSM acid-free archival
paper, ribbon bookmark.

**The agate matters.** It is a polished slice of natural green agate, banded and
translucent at the edges, roughly four centimetres across, set flush into the
centre of the Legacy cover. It is *not* a faceted gem or a cut jewel. Every
slice is different, which is the point and worth showing.

**House style**

Near-black background (`#050507`–`#0f0f12`), single soft directional key from
upper left, deep but never crushed shadows, one warm brass highlight in frame.
Matte surfaces. No harsh speculars, no glossy plastic sheen, no lens flare.
Shallow depth of field with the front edge sharp. Cool-neutral grade with warm
accents — never orange-and-teal.

**Never include, in any image**

- A third journal, or any brown journal
- A stone of any kind on the **Essential** journal — that cover is completely plain
- Faceted, cut or jewel-like stones anywhere — the agate is an organic polished slice
- Text, words, numbers, watermarks, UI overlays, or logos beyond a small debossed Καιρός
- Hands, faces or people
- Cluttered desk props — coffee, plants, laptops, phones (unless the prompt asks)
- Warm domestic wood-and-linen "lifestyle blogger" staging
- Anything that reads as stock photography

---

## Technical specs

| File | Aspect | Generate at | Where it appears |
|---|---|---|---|
| `package-essential.png` | 4:3 | **1600 × 1200** | Essential pricing card |
| `package-legacy.png` | 4:3 | **1600 × 1200** | Legacy pricing card |
| `package-insight.png` | 4:3 | **1600 × 1200** | Insight pricing card |
| `origin-app-v1.png` | 4:3 | as-is | Story section |
| `origin-journal-prototype.png` | 4:3 | as-is | Story section |
| `journals-lineup.jpg` | 3:2 | **1536 × 1024** | Journals section + schema for Essential and Insight |
| `journal-legacy-detail.jpg` | 1:1 | **1254 × 1254** | Journals section + schema for Legacy |
| `journal-lifestyle.jpg` | 16:9 | **1678 × 937** | Hero, and the OG/Twitter share card |

Package shots are cropped `object-fit: cover` into a 4:3 frame about 330px wide
on desktop. **Keep the product centred with generous margin** — the crop trims
edges on narrow screens.

Match the existing dimensions exactly for the three replacements. They are
declared as `width`/`height` in the HTML to reserve layout space; a different
ratio makes the page jump as the image loads.

---

## 1. `package-essential.png`

**Contains:** Essential journal · soft mint-green vegan leather · NFC ·
lay-flat binding · premium archival paper · satin ribbon bookmark · premium
gift box · the app, all 50 journeys · 3 months Premium.

**The idea:** the honest starting point. This card sits first and must not look
*poor* beside the other two — it should look **restrained**, which is a
different thing. Its plainness is the product decision, not a compromise.

> A product photograph of a single soft mint-green vegan leather hardcover
> journal, photographed at a three-quarter angle from slightly above, standing
> at a gentle lean against its own closed presentation box. The green is pale,
> cool and desaturated, like sea glass or weathered eucalyptus — soft and matte,
> absorbing light rather than reflecting it, with a fine subtle grain like good
> bookcloth. The cover is completely plain: no stone, no metal corners, no
> ornament of any kind. A slim satin ribbon bookmark in warm cream emerges from
> the lower page block and falls naturally across the surface below. A small
> circular medallion of brushed antique brass, about two centimetres across, is
> inset flush into the lower right of the front cover — the only metal in the
> frame, catching one restrained highlight. The presentation box behind is
> matte charcoal with a soft-touch finish, lid slightly offset to show depth.
> Background is seamless near-black, hex 050507, fading upward into deeper
> shadow so the pale green separates cleanly. Single soft directional key from
> the upper left rakes across the cover to reveal texture, with a subtle cool
> fill from the right keeping the shadow side from going fully black. Centred
> with generous negative space on all four sides. Shallow depth of field, front
> cover edge critically sharp, box softening behind. Calm, uncluttered,
> quietly expensive. 4:3 aspect ratio. Photorealistic, high detail, studio
> product photography.
>
> Do not include: any stone, gem, agate or crystal — this cover is entirely
> plain; brass corner protectors; text, lettering, numbers or logos; hands or
> people; open pages; pens; plants; coffee; wooden desks; warm domestic
> styling; glossy plastic reflections; lens flare.

---

## 2. `package-legacy.png`

**Contains:** Legacy journal · dark green full-grain leather · natural agate
centrepiece · antique brass corner protectors · NFC · premium archival paper ·
lay-flat binding · Kairos metal pen · three ink cartridges · luxury ribbon
bookmark · presentation gift box · welcome card · the app, all 50 journeys ·
12 months Premium.

**The idea:** the flagship, marked *Most Popular*. The stone is the signature —
it is what makes this photograph memorable and what justifies the jump from €49.
Show it clearly.

> A product photograph of a dark forest-green full-grain leather journal lying
> at a slight angle on a seamless near-black surface, with a slim metal pen
> resting diagonally across its lower third. Set flush into the centre of the
> cover is a polished slice of natural green agate, roughly four centimetres
> across: concentric bands of deep green, pale sage and translucent white run
> through it, the surface glassy and cool, the thinner edges glowing faintly
> where light passes through. It sits in a precise recessed bezel where stone
> meets leather. The leather is genuinely full-grain — visible pore structure,
> natural tonal variation, matte with a faint waxy sheen only where light rakes
> across it. Four antique brass corner protectors, warm and slightly darkened
> with age, are fitted precisely to the corners. A circular brushed brass NFC
> medallion is inset into the lower right. A deep burgundy ribbon escapes the
> page block and curls once on the surface. The pen is a slim cylinder in matte
> gunmetal with an antique brass collar, dip-pen inspired in silhouette — spare,
> architectural, unbranded. Beside it, angled and partly in shadow, a matte
> charcoal presentation box with its lid ajar. Background seamless near-black,
> hex 050507. Single soft directional key from the upper left at a low angle,
> raking to maximise leather grain and make the brass glow warm against the cool
> green, plus one small dedicated light picking out the agate's internal banding
> and translucency. A cool rim light along the far edge separates the journal
> from the dark. Shadows deep and soft, never pure black. Shallow depth of
> field, the stone and the pen's brass collar critically sharp. Centred,
> generous margin. Heirloom, quiet luxury, made to be kept for decades. 4:3
> aspect ratio. Photorealistic, extremely high detail, studio product
> photography.
>
> Do not include: a faceted or gem-cut stone — this is an organic polished agate
> slice with visible banding, not a jewel; text, lettering, numbers or logos;
> hands or people; open pages; plants; coffee; wooden desks; warm domestic
> styling; glossy plastic reflections; lens flare.

---

## 3. `package-insight.png`

**Contains:** everything in Legacy — including the same agate journal — plus
Kairos Mood Cards, 52-card deck · brass meditation bell · incense holder ·
premium incense sticks · beeswax candle · brass bookmark · cotton storage pouch
· luxury keepsake box · Premium for the life of the service · early access.

**The idea:** the complete ritual, laid out. This is the only one of the three
that should read as a *collection* rather than a product. Crucially, **the
journal at its centre is the Legacy journal** — the picture's argument is
"everything else you also get", which is exactly why the tier costs €100 more.
The risk is clutter: it must look arranged, not piled.

> An overhead flat-lay product photograph of a complete journaling ritual set,
> arranged with deliberate spacing on a seamless near-black surface. At the
> centre, a dark forest-green full-grain leather journal with antique brass
> corner protectors and a polished natural green agate slice set flush into the
> cover, its bands of deep green and translucent white catching the light.
> Arranged around it with clear breathing room, never touching or overlapping:
> a slim matte gunmetal pen with an antique brass collar; a small fanned spread
> of four or five cards from a deck, backs showing an abstract geometric pattern
> in deep green and brass on charcoal, the rest stacked neatly beside them; a
> small domed brass meditation bell with a short wooden striker; a low brass
> incense holder with one slender unlit stick resting in it; a squat cylindrical
> beeswax candle in natural honey tone, unlit; a flat brass bookmark; and a soft
> undyed oatmeal cotton drawstring pouch, relaxed rather than stuffed. A matte
> charcoal keepsake box sits at one edge, lid removed and placed beneath it.
> Everything aligns to a loose grid with generous negative space — curated and
> unhurried, closer to a museum vitrine than a shop display. Background seamless
> near-black, hex 050507. Soft even light from above and slightly left, gentle
> contact shadows grounding each object without drama, brass picking up warm
> highlights, the agate holding a small bright core. Cool-neutral grade, warmth
> confined to brass, beeswax and cotton. Shot from directly overhead, perfectly
> perpendicular, no perspective distortion. 4:3 aspect ratio. Photorealistic,
> extremely high detail, editorial product photography.
>
> Do not include: a different or brown journal — the journal is the same dark
> green agate one from the Legacy collection; text, lettering, numbers, symbols
> or logos on any object including the cards; hands or people; lit flames or
> smoke; plants; coffee; wooden or linen surfaces; overlapping or piled objects;
> more than about ten objects total.

---

## 4. `journals-lineup.jpg` — now two journals, not three

**Currently shows:** three editions side by side. The line has collapsed to two
designs, so this needs reshooting — not to change the stone, but because the
third journal no longer exists.

> A product photograph of two closed journals of identical size standing upright
> side by side, angled very slightly towards the camera, photographed straight
> on at cover height on a seamless near-black surface. On the left, a soft
> mint-green vegan leather journal with a completely plain uninterrupted cover,
> matte and smooth, the green pale and cool like sea glass. On the right, a dark
> forest-green full-grain leather journal with antique brass corner protectors
> on all four corners and a polished natural green agate slice, roughly four
> centimetres across, set flush into the centre of the cover — banded and
> translucent at its edges, catching light from within. Each carries a small
> circular brushed antique brass NFC medallion inset into the lower right. The
> contrast between them is the point: one plain and quiet, one substantial and
> unique. Evenly spaced with a small consistent gap, soft contact shadows.
> Background seamless near-black, hex 050507. Broad soft key from the upper
> left, cool rim light along the right edges separating each journal from the
> background, one small dedicated highlight bringing out the agate's banding.
> Both covers critically sharp. Centred, symmetrical, generous margin. 3:2
> aspect ratio. Photorealistic, extremely high detail, studio product
> photography.
>
> Do not include: a third journal; any stone or metal corners on the mint-green
> journal, which is completely plain; a faceted or gem-cut stone; text,
> lettering, numbers or logos; hands or people; open pages; pens; plants;
> wooden surfaces; warm domestic styling.

---

## 5. `journal-legacy-detail.jpg` — check before generating

The agate is back in the product, so **the original photograph is correct
again.** If the file still exists, use it and skip this. The prompt below is
only for if it has been lost.

> An extreme close-up macro product photograph of the centre of a dark
> forest-green full-grain leather journal cover, filling the frame, at a shallow
> three-quarter angle. The subject is a polished natural green agate slice set
> flush into the leather: concentric bands of deep green, pale sage and
> translucent white running through the stone, surface glassy and cool, edges
> glowing faintly from within where the slice is thinnest. The leather around it
> shows genuine full-grain texture — individual pores, natural undulation, deep
> bottle green falling to near-black in the recesses — with a precise recessed
> bezel where stone meets leather. At the frame's edge, softly out of focus, an
> antique brass corner protector and the circular brushed brass NFC medallion.
> Background falls away to near-black. A single diffused key from a low angle at
> the upper left rakes across the leather to reveal grain, while a second small
> source picks out the agate's internal banding and translucency. Extremely
> shallow depth of field: the stone's near edge critically sharp, everything
> beyond dissolving. Tactile and material — the kind of photograph that makes
> someone want to run a thumb across it. Square 1:1 aspect ratio.
> Photorealistic, extreme macro detail, studio product photography.
>
> Do not include: a faceted or gem-cut stone — this is an organic polished slice;
> text, lettering, numbers or logos; hands or fingers; plants; wooden surfaces;
> glossy plastic reflections.

---

## 6. `journal-lifestyle.jpg` — probably fine, check anyway

The hero image and the OG/Twitter share card — the most-seen image on the site,
and the one that appears whenever anyone links Kairos anywhere.

Its alt text describes *"the Legacy journal on a writing desk beside a fountain
pen and a phone showing the app's daily reflection prompt"*. With the agate back
in the product, a visible stone here is **correct**, not a problem. Open it and
confirm it shows the dark green journal rather than a brown or plain one; if so,
leave it entirely alone.

> A wide lifestyle product photograph of a dark forest-green full-grain leather
> journal with a polished natural green agate slice set into the cover and
> antique brass corner protectors, lying open on a dark stone writing surface,
> a slim matte gunmetal and brass pen resting in the gutter between the pages.
> The visible pages are cream 200 GSM paper, blank, catching a soft pool of
> light. To the right and slightly behind, a phone lies flat, screen up, showing
> a dark interface with one short line of light text and a soft green accent
> glow — deliberately too small and too softly focused to read. Wide horizontal
> composition, journal occupying the left two thirds and the phone the right
> third, generous empty surface above and below. Background and surface are dark
> slate, nearly black, subtly textured. Soft directional daylight from the upper
> left as if from a window just out of frame, warm on the paper and cool in the
> shadows, one gentle brass highlight on the pen collar and corner protectors,
> and a small bright core in the agate. Shallow depth of field, open pages
> critically sharp, phone softening slightly. Calm, early morning, unhurried —
> paper and screen coexisting rather than competing. 16:9 aspect ratio.
> Photorealistic, high detail, editorial lifestyle photography.
>
> Do not include: readable text on the phone screen or the pages; hands or
> people; coffee cups; plants; laptops; cluttered desk props; warm wooden
> surfaces; lens flare.

---

## After you have the files

**Package shots** go in as `.png` at `public/images/package-*.png`. Nothing else
to do — they appear on the cards immediately.

**The replacements** are referenced as `.jpg` with a `.webp` sibling served
preferentially. **Both must be replaced together**, or browsers that prefer webp
keep serving the old photograph while everyone else sees the new one — the worst
possible half-state. Same base filename, same dimensions.

Ask me to run the conversion and I will produce matched `.jpg` + `.webp` pairs
at the right sizes and compression — `sharp` is installed and `scripts/` has
precedent. Expect generated PNGs to be large; they should end up under 200 KB.

**Keep full-resolution masters in `assets-src/images/`, not `public/images/`.**
Vite copies `public/` into the build verbatim, so masters left there ship to
every visitor. That directory exists for exactly this reason.

---

## Priority

1. **`origin-app-v1.png`** and **`origin-journal-prototype.png`** — you already
   have these, they need no work, and they are the only images here that make an
   argument nothing else on the page can make.
2. **`journals-lineup.jpg`** — currently shows three journals, one of which no
   longer exists. The only image that is actively wrong.
3. **The three package shots** — absent rather than wrong. The cards collapse
   their frames cleanly, so the page reads fine without them.
4. **`journal-legacy-detail.jpg`** and **`journal-lifestyle.jpg`** — check both;
   with the agate back they are most likely already correct.
