# Καιρός — Image Brief

Everything the landing page still needs, with generation prompts.

Five images are outstanding, plus one to check. Three are new (the Collection
shots on the pricing cards); two are replacements for photographs that show a
product feature we no longer sell.

**Drop finished files into `public/images/` using the exact filenames below and
they appear with no code change.** The pricing cards already reference
`images/package-*.png` and collapse their frames silently while the files are
absent, so the page is publishable at any point during this work.

---

## Why the replacements are needed

The Legacy journal originally had a **natural green agate centrepiece** set into
the cover. That was removed from the product — a clean leather cover with brass
corners is more consistent to manufacture, and it ages better.

Every mention of it has been stripped from the copy. Two photographs still show
the stone, so they now contradict text that describes full-grain leather and
brass. That is the only reason they need redoing; nothing else about them is
wrong.

---

## Brand reference

Give this to the image tool as context before any individual prompt.

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

**The three journals**

| Collection | Cover |
|---|---|
| Essential | Olive vegan leather, soft-touch, hardcover |
| Legacy | Dark green full-grain leather, antique brass corner protectors |
| Insight | Premium brown leather, exclusive edition |

All three: integrated NFC medallion in the cover, lay-flat binding, 200 GSM
acid-free archival paper, ribbon bookmark.

**House style for every image**

Near-black background (`#050507`–`#0f0f12`), single soft directional key light
from upper left, deep but not crushed shadows, one warm brass highlight
somewhere in frame. Matte surfaces. No harsh speculars, no glossy plastic
sheen, no lens flare. Shallow depth of field with the product's front edge
sharp. Colour grade cool-neutral with warm accents — never orange-and-teal.

**Never include, in any image**

- Any stone, gem, agate, crystal or polished mineral inset
- Visible logos or brand marks other than a small debossed Καιρός on the cover
- Text, words, numbers, watermarks or UI overlays
- Hands, faces or people
- Cluttered desk props — coffee cups, plants, laptops, phones (unless the
  prompt asks for one)
- Warm domestic wood-and-linen "lifestyle blogger" staging
- Anything that reads as stock photography

---

## Technical specs

| File | Aspect | Generate at | Where it appears |
|---|---|---|---|
| `package-essential.png` | 4:3 | **1600 × 1200** | Essential pricing card |
| `package-legacy.png` | 4:3 | **1600 × 1200** | Legacy pricing card |
| `package-insight.png` | 4:3 | **1600 × 1200** | Insight pricing card |
| `journals-lineup.jpg` | 3:2 | **1536 × 1024** | Journals section + Product schema for Essential and Insight |
| `journal-legacy-detail.jpg` | 1:1 | **1254 × 1254** | Journals section + Product schema for Legacy |
| `journal-lifestyle.jpg` | 16:9 | **1678 × 937** | Hero, and the OG/Twitter share card |

The three package shots are cropped `object-fit: cover` into a 4:3 frame about
330px wide on desktop. **Keep the product centred with generous margin** — the
crop trims edges on narrow screens.

Match the existing dimensions exactly for the three replacements. They are
declared as `width`/`height` in the HTML to reserve layout space; a different
ratio causes the page to jump as the image loads.

---

## 1. `package-essential.png` — the Essential Collection

**Contains:** Essential journal · premium hardcover or vegan leather cover ·
integrated NFC · lay-flat binding · premium archival paper · satin ribbon
bookmark · premium gift box · the app, all 50 journeys · 3 months Premium.

**The idea:** the honest starting point. Uncomplicated, well made, nothing
performative. This card sits first and must not look poor beside the other
two — it should look *restrained*, which is a different thing.

> A product photograph of a single olive-green vegan leather hardcover journal,
> photographed at a three-quarter angle from slightly above, standing at a
> gentle lean against its own closed presentation box. The journal is A5,
> roughly 21 by 15 centimetres, with a soft matte finish that absorbs light
> rather than reflecting it, subtly grained like fine bookcloth. A slim satin
> ribbon bookmark in warm cream emerges from the lower page block and falls
> naturally across the surface below. A small circular medallion of brushed
> antique brass, about two centimetres across, is inset flush into the lower
> right of the front cover — the only metal in the frame, catching a single
> restrained highlight. The presentation box behind is matte charcoal with a
> soft-touch finish, its lid slightly offset to show depth without spilling
> contents. Background is a seamless near-black surface, hex 050507, fading
> upward into deeper shadow so the product separates by edge light alone. A
> single soft directional key light from the upper left rakes across the cover
> to reveal the leather grain, with a very subtle cool fill from the right
> preventing the shadow side from going fully black. The composition is
> centred with generous negative space on all four sides. Shallow depth of
> field, front cover edge critically sharp, box softening gently behind.
> Colour grade is cool and neutral with warmth only in the brass and the
> ribbon. Photographed as if for a premium stationery catalogue: calm,
> uncluttered, expensive-looking without ornament. 4:3 aspect ratio.
> Photorealistic, high detail, studio product photography.
>
> Do not include: any stone, gem, agate or crystal; any text, lettering,
> numbers or logos; hands or people; open pages; pens; plants; coffee; wooden
> desks; warm domestic styling; glossy plastic reflections; lens flare.

---

## 2. `package-legacy.png` — the Legacy Collection

**Contains:** Legacy journal · full-grain leather cover · antique brass corner
protectors · integrated NFC · premium archival paper · lay-flat binding ·
premium Kairos metal pen, dip-pen inspired · three premium black ink
cartridges · luxury ribbon bookmark · premium presentation gift box · welcome
card · the app, all 50 journeys · 12 months Premium.

**The idea:** the flagship, and the card marked *Most Popular*. This is the one
that has to look like an heirloom — an object that will be visibly older and
better in ten years. **No stone.** The character comes from leather, brass and
the pen.

> A product photograph of a dark forest-green full-grain leather journal lying
> at a slight angle on a seamless near-black surface, with a slim metal pen
> resting diagonally across its lower third. The leather is genuinely
> full-grain: visible natural pore structure, subtle tonal variation across the
> surface, matte with a faint waxy sheen only where the light rakes across it,
> the kind of finish that will patina rather than peel. Four antique brass
> corner protectors, warm and slightly darkened with age, are fitted precisely
> to the cover's corners, each catching a small controlled highlight. A
> circular brushed brass NFC medallion, about two centimetres across, is inset
> flush into the lower right of the cover. A deep burgundy ribbon bookmark
> escapes the page block and curls once on the surface. The pen is a slim
> cylindrical instrument in matte gunmetal with an antique brass collar and
> nib section, dip-pen inspired in silhouette — spare, architectural, no
> branding, no clip ornament. Beside it, angled and partly in shadow, sits a
> matte charcoal presentation box with its lid ajar. Background is seamless
> near-black, hex 050507. Lighting is a single soft directional key from the
> upper left at a low angle, deliberately raking to maximise the leather grain
> and to make the brass glow warm against the cool green, with a subtle cool
> rim light along the far edge separating the journal from the darkness.
> Shadows are deep and soft, never crushed to pure black. Shallow depth of
> field with the front cover corner and the pen's brass collar critically
> sharp. Composition centred with generous margin. The mood is heirloom, quiet
> luxury, an object made to be kept for decades. 4:3 aspect ratio.
> Photorealistic, extremely high detail, studio product photography.
>
> Do not include: any stone, gem, agate, crystal or polished mineral inset of
> any kind anywhere on the cover — the cover is plain leather with brass
> corners only; any text, lettering, numbers or logos; hands or people; open
> pages; plants; coffee; wooden desks; warm domestic styling; glossy plastic
> reflections; lens flare.

---

## 3. `package-insight.png` — the Insight Collection

**Contains:** everything in Legacy, plus the exclusive Insight journal · Kairos
Mood Cards, 52-card deck · brass meditation bell · Kairos incense holder ·
premium incense sticks · beeswax candle · brass bookmark · premium cotton
storage pouch · luxury keepsake box · Premium for the life of the service ·
early access.

**The idea:** the complete ritual, laid out. This is the only image of the three
that should feel like a *collection* rather than a product. The risk is
clutter — it must read as arranged, not piled.

> An overhead flat-lay product photograph of a complete journaling ritual set,
> arranged with deliberate spacing on a seamless near-black surface. At the
> centre, a rich chestnut-brown premium leather journal with antique brass
> corner protectors and a circular brushed brass medallion inset into the
> cover. Arranged around it with clear breathing room between every object,
> never touching or overlapping: a slim matte gunmetal pen with an antique
> brass collar; a small fanned spread of four or five cards from a card deck,
> their backs showing an abstract geometric pattern in deep green and brass on
> charcoal, with the rest of the deck stacked neatly beside them; a small domed
> brass meditation bell with a short wooden striker; a low brass incense holder
> with a single slender unlit incense stick resting in it; a squat cylindrical
> beeswax candle in natural honey tone, unlit; a flat brass bookmark; and a
> soft natural cotton drawstring pouch in undyed oatmeal, relaxed rather than
> stuffed. A matte charcoal keepsake box sits at one edge of the frame, lid
> removed and placed beneath it. Everything is aligned to a loose grid with
> generous negative space — the arrangement should read as curated and
> unhurried, closer to a museum vitrine than a shop display. Background is
> seamless near-black, hex 050507. Lighting is soft and even from above and
> slightly left, producing gentle contact shadows directly beneath each object
> that ground them without drama, with the brass items picking up warm
> highlights and the leather holding its deep tone. Colour grade cool-neutral
> with warmth confined to brass, beeswax and cotton. Shot from directly
> overhead, perfectly perpendicular, no perspective distortion. 4:3 aspect
> ratio. Photorealistic, extremely high detail, editorial product photography.
>
> Do not include: any stone, gem, agate or crystal; any text, lettering,
> numbers, symbols or logos on any object including the cards; hands or people;
> lit flames or smoke; plants; coffee; wooden or linen surfaces; warm domestic
> styling; overlapping or piled objects; more than about ten objects total.

---

## 4. `journals-lineup.jpg` — replaces the agate lineup

**Currently shows:** the three editions side by side, Legacy with its agate
centrepiece. Also serves as the schema image for both the Essential and Insight
products, so it needs to represent the range fairly.

**The idea:** one family, three weights. The differences should be legible at a
glance — material and colour — without any one dominating.

> A product photograph of three closed leather journals of identical size
> standing upright side by side in a row, angled very slightly towards the
> camera, photographed straight on at cover height on a seamless near-black
> surface. From left to right: an olive-green soft-touch vegan leather journal
> with a plain uninterrupted cover; a dark forest-green full-grain leather
> journal with antique brass corner protectors on all four corners; and a rich
> chestnut-brown premium leather journal, also with antique brass corners.
> Each carries a small circular brushed antique brass medallion inset flush
> into the lower right of its front cover, identical across all three. The
> three covers show clearly different materials — the first matte and smooth,
> the second and third showing genuine leather grain with natural tonal
> variation — while remaining unmistakably one family. They are evenly spaced
> with a small consistent gap between them, casting soft contact shadows.
> Background is seamless near-black, hex 050507, graduating slightly darker
> towards the upper corners. Lighting is a broad soft key from the upper left
> with a cool rim along the right edges to separate each journal from its
> neighbour and from the background. All three covers are critically sharp
> front-to-back. Composition is centred and symmetrical with generous margin
> above and below. Calm, premium, catalogue-clean. 3:2 aspect ratio.
> Photorealistic, extremely high detail, studio product photography.
>
> Do not include: any stone, gem, agate, crystal or mineral inset on any of the
> three covers — every cover is plain leather, distinguished only by colour,
> material and brass corners; any text, lettering, numbers or logos; hands or
> people; open pages; pens; plants; wooden surfaces; warm domestic styling.

---

## 5. `journal-legacy-detail.jpg` — replaces the agate close-up

**Currently shows:** a close-up of the agate centrepiece, brass corners, NFC
medallion and paper edge. The caption used to be about the stone — *"Every
stone is different, so no two covers are quite the same"* — and has been
rewritten around leather taking on the marks of being carried.

**The idea:** proof of craft at close range. With the stone gone, the leather
itself has to carry the shot — grain, edge finish, stitching, the brass.

> An extreme close-up macro product photograph of the corner of a dark
> forest-green full-grain leather journal, filling the frame, shot at a shallow
> three-quarter angle. The leather grain is the subject: individual pores,
> natural undulation, subtle tonal shifts from deep bottle green to almost
> black in the recesses, a faint waxy sheen where the light rakes across it,
> and the soft rounded burnish of an edge that has been handled. An antique
> brass corner protector wraps the cover corner precisely, its surface warm and
> lightly darkened with age, showing fine brushed texture and a single
> controlled highlight along its outer edge. Just visible at the frame's edge,
> the circular brushed brass NFC medallion inset flush into the cover, softly
> out of focus. The page block edge runs along one side, showing the crisp
> cream stack of thick 200 GSM acid-free paper with visible individual sheet
> edges and a deep burgundy ribbon emerging between them. Background falls away
> to seamless near-black, hex 050507. Lighting is a single hard-edged but
> diffused key from a low angle at the upper left, deliberately raking almost
> parallel to the surface to throw the leather grain into relief, with a cool
> fill preventing the shadow side going pure black. Extremely shallow depth of
> field: the brass corner and the leather immediately around it critically
> sharp, everything beyond dissolving into soft bokeh. The mood is tactile,
> material, honest — the photograph should make the viewer want to touch it.
> Square 1:1 aspect ratio. Photorealistic, extreme macro detail, studio product
> photography.
>
> Do not include: any stone, gem, agate, crystal or mineral of any kind — the
> cover is plain full-grain leather and brass only; any text, lettering,
> numbers or logos; hands or fingers; plants; wooden surfaces; warm domestic
> styling; glossy plastic reflections.

---

## 6. `journal-lifestyle.jpg` — check before deciding

**This one may not need redoing.** It is the hero image and the OG/Twitter share
card, so it is the most-seen image on the site and the one that appears when
anyone links Kairos anywhere.

Its alt text describes *"the Legacy journal on a writing desk beside a fountain
pen and a phone showing the app's daily reflection prompt"* — it does not
mention the stone, but it is a Legacy journal, so **open it and look**. If the
agate is visible, it needs replacing and becomes the highest priority of the
six. If not, leave it alone.

> A wide lifestyle product photograph of a dark forest-green full-grain leather
> journal with antique brass corner protectors, lying open on a dark stone
> writing surface with a slim matte gunmetal and brass pen resting in the gutter
> between the pages. The visible pages are cream 200 GSM paper, blank, catching
> a soft pool of light. To the right and slightly behind, a phone lies flat,
> screen facing up, displaying a dark interface with a single short line of
> light text and a soft green accent glow — deliberately too small and too
> softly focused to read. The composition runs wide and horizontal with the
> journal occupying the left two thirds and the phone the right third,
> generous empty surface above and below. Background and surface are dark
> slate, nearly black, with a subtle texture. Lighting is soft directional
> daylight from the upper left, as if from a window just out of frame, warm on
> the paper and cool in the shadows, with one gentle brass highlight on the pen
> collar and the corner protectors. Shallow depth of field with the journal's
> open pages critically sharp and the phone softening slightly. Calm, early
> morning, unhurried. The mood is paper and screen coexisting rather than
> competing. 16:9 aspect ratio. Photorealistic, high detail, editorial
> lifestyle photography.
>
> Do not include: any stone, gem, agate or crystal on the journal cover;
> readable text on the phone screen or the pages; hands or people; coffee cups;
> plants; laptops; cluttered desk props; warm wooden surfaces; lens flare.

---

## After you have the files

**The three package shots** go in as `.png` at `public/images/package-*.png`.
Nothing else to do — they appear on the cards immediately.

**The three replacements** are referenced as `.jpg` with a `.webp` sibling
served preferentially. Both must be replaced together, or browsers that prefer
webp will keep serving the old agate photograph while everyone else sees the
new one. Same base filename, same dimensions.

Ask me to run the conversion and I will produce matched `.jpg` + `.webp` pairs
at the right sizes and compression — `sharp` is already installed, and
`scripts/` has precedent for this. Expect the package PNGs to be large as
generated; they should end up well under 200 KB each.

**Keep the full-resolution originals in `assets-src/images/`, not
`public/images/`.** Vite copies everything in `public/` into the build
verbatim, so masters left there ship to every visitor. That directory already
exists for exactly this reason.

---

## Priority

1. **`journal-lifestyle.jpg`** — only if it shows the stone. It is the hero and
   the share card, so a contradiction there is the most visible one possible.
2. **`journals-lineup.jpg`** and **`journal-legacy-detail.jpg`** — live now,
   actively contradicting the copy beside them.
3. **The three package shots** — currently absent rather than wrong. The cards
   collapse their frames cleanly, so the page reads fine without them; they are
   an upgrade, not a repair.
