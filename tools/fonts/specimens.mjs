// Regenerate the writing-system specimen images in docs/languages/norsund/img/.
//   node tools/fonts/specimens.mjs
// Uses tools/norsund/scripts.js, so the images always match the renderer.
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  LYSRIT, RUNAR, renderLysrit, renderLysritGlyph, renderRunes, renderRune, transliterateRunes,
} from '../norsund/scripts.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const OUT = join(ROOT, 'docs', 'languages', 'norsund', 'img');
mkdirSync(OUT, { recursive: true });

const C = { bg: '#f1f2f5', ink: '#121733', muted: '#545d7c', line: '#d3d8e5', accent: '#0a7584', violet: '#8a33a8', night: '#0b1024', nightInk: '#e7e5e0' };
const FONT = "font-family:'Gentium Book Plus','Charis SIL',Georgia,serif";
const UI = "font-family:'Instrument Sans','Helvetica Neue',Arial,sans-serif";

const inner = (svg) => svg.replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '');
const dims = (svg) => { const m = svg.match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/); return [Number(m[1]), Number(m[2])]; };
/** Place an SVG string at (x, y) scaled by s. */
function place(svg, x, y, s = 1) {
  const [w, h] = dims(svg);
  return `<svg x="${x}" y="${y}" width="${w * s}" height="${h * s}" viewBox="0 0 ${w} ${h}">${inner(svg)}</svg>`;
}
const text = (x, y, t, { size = 12, fill = C.muted, anchor = 'middle', style = UI, weight = 400 } = {}) =>
  `<text x="${x}" y="${y}" style="${style};font-size:${size}px;fill:${fill};font-weight:${weight}" text-anchor="${anchor}">${t}</text>`;
function doc(w, h, body, { bg = C.bg, title }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-label="${title}"><title>${title}</title><rect width="${w}" height="${h}" rx="10" fill="${bg}"/>${body}</svg>\n`;
}
const save = (name, svg) => { writeFileSync(join(OUT, name), svg); console.log('wrote', join('docs/languages/norsund/img', name)); };

// 1. Lysrit letter sheet ------------------------------------------------------
{
  const s = 1.5, cw = 40 * s, ch = 44 * s, colW = 74, pad = 24;
  const rows = [
    ['Vowels: stars on the grid', [['y', { c: null, v: [{ v: 'y' }] }], ['i', { c: null, v: [{ v: 'i' }] }], ['e', { c: null, v: [{ v: 'e' }] }], ['a', { c: null, v: [{ v: 'a' }] }], ['ə', { c: null, v: [{ v: 'ə' }] }], ['o', { c: null, v: [{ v: 'o' }] }], ['u', { c: null, v: [{ v: 'u' }] }]]],
    ['Lips: top bar', ['p', 'b', 'f', 'v', 'm', 'w']],
    ['Tongue tip: middle bar', ['t', 'd', 'th', 's', 'n', 'l', 'r']],
    ['Back of the mouth: bottom bar; h is the ray', ['k', 'g', 'kj', 'gj', 'ng', 'j', 'h']],
    ['Marks', [['aa (long)', { c: null, v: [{ v: 'a', long: true }] }], ['ei / ay', { c: null, v: [{ v: 'e' }, { v: 'i' }] }], ['au', { c: null, v: [{ v: 'a' }, { v: 'u' }] }], ['gg (double)', { c: 'g', gem: true, v: [] }], ['ka (cell)', { c: 'k', v: [{ v: 'a' }] }], ['thio', { c: 'th', v: [{ v: 'i' }, { v: 'o' }] }]]],
  ];
  let y = pad + 34, body = text(pad, pad + 10, 'LYSRIT · letter sheet', { size: 13, anchor: 'start', fill: C.ink, weight: 600 }) +
    text(pad, pad + 26, 'Same place, same base bar. Extra strokes give the manner; a lit centre means voiced.', { size: 12, anchor: 'start' });
  for (const [label, items] of rows) {
    body += text(pad, y + 12, label.toUpperCase(), { size: 10, anchor: 'start', fill: C.muted, weight: 600 });
    y += 18;
    items.forEach((it, i) => {
      const [lab, cell] = Array.isArray(it) ? it : [it, { c: it, v: [] }];
      const g = renderLysritGlyph('cell', cell, { theme: 'light', title: lab });
      const x = pad + i * colW;
      body += `<rect x="${x}" y="${y}" width="${colW - 8}" height="${ch + 22}" rx="6" fill="#ffffff" stroke="${C.line}"/>`;
      body += place(g, x + (colW - 8 - cw) / 2, y + 2, s);
      body += text(x + (colW - 8) / 2, y + ch + 16, lab, { size: 13, style: FONT, fill: C.ink });
    });
    y += ch + 34;
  }
  save('lysrit-letter-sheet.svg', doc(pad * 2 + colW * 7, y + 6, body, { title: 'Lysrit letter sheet' }));
}

// 2. Lysrit numerals, punctuation, sigils ------------------------------------
{
  const s = 1.4, cw = 40 * s, ch = 44 * s, colW = 70, pad = 24;
  let body = text(pad, pad + 10, 'LYSRIT · numbers, punctuation, sigils', { size: 13, anchor: 'start', fill: C.ink, weight: 600 }) +
    text(pad, pad + 26, '1-7 trace the rim from the top point; 7 is the full count. Every number cell has the bar over it.', { size: 12, anchor: 'start' });
  let y = pad + 40;
  const digits = [...'0123456789'].map((d) => [d, 'digit', d]).concat([['120', 'digit', 'lh']]);
  digits.forEach(([lab, kind, val], i) => {
    const x = pad + (i % 6) * colW, yy = y + Math.floor(i / 6) * (ch + 34);
    body += `<rect x="${x}" y="${yy}" width="${colW - 8}" height="${ch + 22}" rx="6" fill="#ffffff" stroke="${C.line}"/>`;
    body += place(renderLysritGlyph(kind, val, { theme: 'light', title: lab }), x + (colW - 8 - cw) / 2, yy + 2, s);
    body += text(x + (colW - 8) / 2, yy + ch + 16, lab, { size: 13, style: FONT, fill: C.ink });
  });
  y += 2 * (ch + 34) + 6;
  const misc = [['sa', 'sigil', 'sa'], ['sund', 'sigil', 'sund'], ['stari', 'sigil', 'stari'], ['sacred', 'sacred', null], ['divider', 'punct', '·'], ['comma', 'punct', ','], ['stop', 'punct', '.'], ['?', 'punct', '?'], ['!', 'punct', '!']];
  misc.forEach(([lab, kind, val], i) => {
    const x = pad + (i % 6) * colW, yy = y + Math.floor(i / 6) * (ch + 34);
    const g = renderLysritGlyph(kind, val, { theme: 'light', title: lab });
    const [gw] = dims(g);
    body += `<rect x="${x}" y="${yy}" width="${colW - 8}" height="${ch + 22}" rx="6" fill="#ffffff" stroke="${C.line}"/>`;
    body += place(g, x + (colW - 8 - gw * s) / 2, yy + 2, s);
    body += text(x + (colW - 8) / 2, yy + ch + 16, lab, { size: 13, style: FONT, fill: C.ink });
  });
  y += 2 * (ch + 34);
  body += place(renderLysrit('523208', { theme: 'light', background: false }), pad, y, 1.1);
  body += text(pad + 290, y + 30, '523,208: the population of Auristar. 120 is the long hundred (langhaun).', { size: 12, anchor: 'start' });
  save('lysrit-numerals.svg', doc(pad * 2 + colW * 6 + 80, y + 70, body, { title: 'Lysrit numbers, punctuation and sigils' }));
}

// 3. The rune row --------------------------------------------------------------
{
  const pad = 24, colW = 62;
  let body = text(pad, pad + 10, 'RUNAR · the rune row (runrad)', { size: 13, anchor: 'start', fill: C.ink, weight: 600 }) +
    text(pad, pad + 26, 'Consonants look forward (strokes on the right); vowels look back (strokes on the left). Long-branch above, short-twig below.', { size: 12, anchor: 'start' });
  const perRow = 13;
  let y = pad + 44;
  for (let row = 0; row < 2; row++) {
    const slice = RUNAR.runes.slice(row * perRow, (row + 1) * perRow);
    slice.forEach((r, i) => {
      const x = pad + i * colW;
      body += `<rect x="${x}" y="${y}" width="${colW - 6}" height="168" rx="6" fill="#ffffff" stroke="${C.line}"/>`;
      const long = renderRune(r.letter, { variant: 'long', theme: 'light', background: false });
      const short = renderRune(r.letter, { variant: 'short', theme: 'light', background: false });
      const [lw] = dims(long), [sw] = dims(short);
      body += place(long, x + (colW - 6 - lw * 1.1) / 2, y + 4, 1.1);
      body += place(short, x + (colW - 6 - sw * 0.9) / 2, y + 74, 0.9);
      body += text(x + (colW - 6) / 2, y + 140, r.letter, { size: 15, style: FONT, fill: C.ink, weight: 700 });
      body += text(x + (colW - 6) / 2, y + 158, r.name, { size: 11, style: FONT });
    });
    y += 186;
  }
  save('runar-row.svg', doc(pad * 2 + colW * perRow, y + 4, body, { title: 'The rune row, long-branch and short-twig' }));
}

// 4. Sample words in both scripts ----------------------------------------------
{
  const pad = 24;
  const words = [['Auristar', true], ['Norsund', false], ['Thiolden', false], ['Kjoldmur', false]];
  let body = text(pad, pad + 10, 'SAMPLE WORDS · Lysrit and runes', { size: 13, anchor: 'start', fill: C.ink, weight: 600 });
  let y = pad + 26, maxW = 0;
  for (const [w, sacred] of words) {
    body += text(pad, y + 34, w, { size: 18, style: FONT, fill: C.ink, anchor: 'start' });
    const lys = renderLysrit(w, { sacred, theme: 'light', background: false });
    const run = renderRunes(w, { theme: 'light', background: false });
    const [lw] = dims(lys), [rw] = dims(run);
    body += place(lys, pad + 130, y, 1.1);
    body += place(run, pad + 150 + lw * 1.1, y + 2, 1.1);
    body += text(pad + 150 + lw * 1.1, y + 78, transliterateRunes(w), { size: 10, anchor: 'start' });
    maxW = Math.max(maxW, pad + 160 + lw * 1.1 + rw * 1.1);
    y += 92;
  }
  save('sample-words.svg', doc(maxW + pad, y + 6, body, { title: 'Auristar, Norsund, Thiolden and Kjoldmur in Lysrit and runes' }));
}

// 5. The Kjoldmur gate inscription ----------------------------------------------
{
  const pad = 24, line = 'Fjol starin lyser run ne.';
  let body = text(pad, pad + 10, 'GATE INSCRIPTION · First Ring of the Kjoldmur', { size: 13, anchor: 'start', fill: C.ink, weight: 600 });
  const lys = renderLysrit('Fjol · starin · lyser · run · ne .', { theme: 'light', background: false });
  const run = renderRunes(line, { theme: 'light', background: false });
  const [lw] = dims(lys), [rw] = dims(run);
  body += text(pad, pad + 40, 'LYSRIT (civic, carved in the white stone)', { size: 10, anchor: 'start', weight: 600 });
  body += place(lys, pad, pad + 46, 1.2);
  body += text(pad, pad + 140, 'RUNES (long-branch, as on the old gate-stone)', { size: 10, anchor: 'start', weight: 600 });
  body += place(run, pad, pad + 146, 1.2);
  body += text(pad, pad + 238, line, { size: 18, style: FONT, fill: C.ink, anchor: 'start' });
  body += text(pad, pad + 260, '"Beneath the star, no rune shines." A shining rune is a charged rune, so the gate forbids rune magic, not rune writing.', { size: 12, anchor: 'start' });
  save('gate-inscription.svg', doc(Math.max(lw, rw) * 1.2 + pad * 2, pad + 278, body, { title: 'Fjol starin lyser run ne, in Lysrit and runes' }));
}

// 6. The glow rule --------------------------------------------------------------
{
  const pad = 24;
  let body = text(pad, pad + 10, 'THE GLOW RULE', { size: 13, anchor: 'start', fill: C.nightInk, weight: 600 });
  const plain = renderRunes('kjold run', { theme: 'dark', background: false });
  const charged = renderRunes('kjold run', { theme: 'dark', glow: true, background: false });
  const [pw] = dims(plain);
  body += place(plain, pad, pad + 24, 1.4);
  body += text(pad, pad + 120, 'Written: plain cut runes. Allowed everywhere, Auristar included.', { size: 12, anchor: 'start', fill: '#98a1c3' });
  body += place(charged, pad, pad + 140, 1.4);
  body += text(pad, pad + 236, 'Charged with aether: the runes glow. This is rune magic, forbidden in Auristar.', { size: 12, anchor: 'start', fill: '#98a1c3' });
  save('rune-glow-rule.svg', doc(Math.max(pw * 1.4, 520) + pad * 2, pad + 252, body, { bg: C.night, title: 'Plain runes versus charged, glowing runes' }));
}
