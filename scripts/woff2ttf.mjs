// scripts/woff2ttf.mjs
// Minimal WOFF (v1) -> TTF converter.
//
// jsPDF's addFont needs a raw sfnt/TTF; @fontsource ships only WOFF and WOFF2.
// WOFF v1 is simply an sfnt whose tables are individually zlib-deflated, so
// rebuilding a TTF is: read the table directory, inflate each table, and write
// a fresh sfnt header + 4-byte-aligned table data. No dependency needed.
// (WOFF2 is Brotli + a transformed glyf table — that would need a real library.)
import fs from 'node:fs';
import zlib from 'node:zlib';

const src = process.argv[2], dst = process.argv[3];
const woff = fs.readFileSync(src);
if (woff.toString('latin1', 0, 4) !== 'wOFF') throw new Error('not a WOFF v1 file');

const flavor   = woff.readUInt32BE(4);
const numTables = woff.readUInt16BE(12);

const tables = [];
for (let i = 0; i < numTables; i++) {
  const o = 44 + i * 20;
  const tag        = woff.toString('latin1', o, o + 4);
  const offset     = woff.readUInt32BE(o + 4);
  const compLength = woff.readUInt32BE(o + 8);
  const origLength = woff.readUInt32BE(o + 12);
  const checksum   = woff.readUInt32BE(o + 16);
  const raw = woff.subarray(offset, offset + compLength);
  // compLength === origLength means the table was stored uncompressed
  const data = compLength === origLength ? raw : zlib.inflateSync(raw);
  if (data.length !== origLength) throw new Error(`${tag}: inflated ${data.length}, expected ${origLength}`);
  tables.push({ tag, checksum, data });
}
tables.sort((a, b) => (a.tag < b.tag ? -1 : 1));

const pad = n => (n + 3) & ~3;
const entrySelector = Math.floor(Math.log2(numTables));
const searchRange   = 2 ** entrySelector * 16;

const header = Buffer.alloc(12);
header.writeUInt32BE(flavor, 0);
header.writeUInt16BE(numTables, 4);
header.writeUInt16BE(searchRange, 6);
header.writeUInt16BE(entrySelector, 8);
header.writeUInt16BE(numTables * 16 - searchRange, 10);

const dir = Buffer.alloc(numTables * 16);
let offset = 12 + numTables * 16;
tables.forEach((t, i) => {
  dir.write(t.tag, i * 16, 4, 'latin1');
  dir.writeUInt32BE(t.checksum, i * 16 + 4);
  dir.writeUInt32BE(offset, i * 16 + 8);
  dir.writeUInt32BE(t.data.length, i * 16 + 12);
  offset += pad(t.data.length);
});

const body = [];
for (const t of tables) {
  body.push(t.data);
  const padding = pad(t.data.length) - t.data.length;
  if (padding) body.push(Buffer.alloc(padding));
}
fs.writeFileSync(dst, Buffer.concat([header, dir, ...body]));
console.log(`${src.split(/[\/]/).pop()} -> ${dst.split(/[\/]/).pop()}  ${numTables} tables, ${fs.statSync(dst).size} bytes`);
