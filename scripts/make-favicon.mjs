// scripts/make-favicon.mjs
// Rebuilds public/favicon.ico from the stone mark.
//
// The previous file packed NINE sizes up to 256x256 and weighed 239 KB, of
// which the 64px-and-larger entries were 222 KB. Browsers only ever pick 16,
// 32 or 48 for a favicon; large app icons are the PWA manifest's job and
// public/icons/ already covers those. Every visitor was downloading a quarter
// of a megabyte to render a 16px square.
//
// ICO is a thin container and modern browsers accept PNG payloads inside it,
// so this just resizes and concatenates — no extra dependency.
import sharp from 'sharp';
import fs from 'node:fs';

const SRC = 'public/images/kairos-logo.png';
const OUT = 'public/favicon.ico';
const SIZES = [16, 32, 48];

const pngs = await Promise.all(
  SIZES.map(s => sharp(SRC).resize(s, s, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
                           .png({ compressionLevel: 9, palette: true })
                           .toBuffer())
);

const header = Buffer.alloc(6);
header.writeUInt16LE(0, 0);            // reserved
header.writeUInt16LE(1, 2);            // type: 1 = icon
header.writeUInt16LE(SIZES.length, 4);

const dir = Buffer.alloc(16 * SIZES.length);
let offset = header.length + dir.length;
SIZES.forEach((s, i) => {
  const o = i * 16;
  dir[o] = s === 256 ? 0 : s;          // width  (0 means 256)
  dir[o + 1] = s === 256 ? 0 : s;      // height
  dir[o + 2] = 0;                      // palette size
  dir[o + 3] = 0;                      // reserved
  dir.writeUInt16LE(1, o + 4);         // colour planes
  dir.writeUInt16LE(32, o + 6);        // bits per pixel
  dir.writeUInt32LE(pngs[i].length, o + 8);
  dir.writeUInt32LE(offset, o + 12);
  offset += pngs[i].length;
});

fs.writeFileSync(OUT, Buffer.concat([header, dir, ...pngs]));
const before = 239 * 1024;
const after = fs.statSync(OUT).size;
console.log(`favicon.ico  ${SIZES.join('/')}px  ${(after / 1024).toFixed(1)} KB  (was ${(before / 1024).toFixed(0)} KB, ${(100 - after / before * 100).toFixed(0)}% smaller)`);
