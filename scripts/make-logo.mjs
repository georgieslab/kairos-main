// scripts/make-logo.mjs
// Builds the wordmark logo: the agate stone with KAIROS set beneath it.
//
// The stone alone is the favicon and the app icon — it has to read at 16px, so
// it carries no text. The logo is the same mark plus the name, for places with
// room to show both (site header, loading screen, share cards).
//
// Letterspaced caps in a serif: the physical journals foil "Καιρός" in Greek,
// but the Latin form travels further and matches how the brand is written
// everywhere else on the site. Playfair Display is the display face already
// loaded by the landing page, so the logo and the headings agree.
import sharp from 'sharp';
import fs from 'node:fs';

const SRC = 'public/images/kairos-logo.png';
const OUT = 'public/images/kairos-wordmark.png';

const W = 512;
const STONE = 380;                       // stone leaves breathing room in the frame
const GAP = 34;
const TEXT_BLOCK = 96;
const H = STONE + GAP + TEXT_BLOCK;

const stone = await sharp(SRC).resize(STONE, STONE, { fit: 'contain',
  background: { r: 0, g: 0, b: 0, alpha: 0 } }).toBuffer();

// Text as SVG so it renders at full resolution rather than being rasterised
// small and scaled up. font-weight 600 and the wide tracking match the foil
// stamping on the journal covers.
const text = Buffer.from(`
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${TEXT_BLOCK}">
  <style>
    .wordmark {
      font-family: 'Playfair Display', 'Georgia', 'Times New Roman', serif;
      font-size: 76px;
      font-weight: 600;
      letter-spacing: 14px;
      fill: #C9A961;
    }
  </style>
  <text x="50%" y="70" text-anchor="middle" class="wordmark"
        transform="translate(7,0)">KAIROS</text>
</svg>`);

await sharp({ create: { width: W, height: H, channels: 4,
                        background: { r: 0, g: 0, b: 0, alpha: 0 } } })
  .composite([
    { input: stone, top: 0, left: Math.round((W - STONE) / 2) },
    { input: text,  top: STONE + GAP, left: 0 },
  ])
  .png({ compressionLevel: 9 })
  .toFile(OUT);

// webp alongside, same as the other imagery
await sharp(OUT).webp({ quality: 92 }).toFile(OUT.replace('.png', '.webp'));

for (const f of [OUT, OUT.replace('.png', '.webp')]) {
  const m = await sharp(f).metadata();
  console.log(`${f.split('/').pop().padEnd(24)} ${m.width}x${m.height}  ${(fs.statSync(f).size / 1024).toFixed(1)} KB`);
}
