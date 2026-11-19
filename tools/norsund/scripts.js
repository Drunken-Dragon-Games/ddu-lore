// Norsund writing systems: Lysrit (Auristar's sacred and civic star script) and the runes (runar).
// Browser-safe ES module with no dependencies.
//
// The glyph data here must match records/languages/scripts/lysrit.yaml and runar.yaml.
// tools/fonts/build_fonts.py checks that they agree before it builds the fonts.
//
// Exports are prefixed (lysrit*, runar*, renderRunes, transliterateRunes) because
// tools/norsund/index.js re-exports this module next to the rest of the engine.

// ---------------------------------------------------------------------------
// Lysrit
// ---------------------------------------------------------------------------

/** Geometry and glyph tables for Lysrit. Node k sits at angle -90 + k*360/7 degrees (k = 0 is the top point). */
export const LYSRIT = {
  cell: { width: 40, height: 44, centre: [20, 22], radius: 15, wordGap: 14, punctWidth: 14, sacredWidth: 26 },
  // Consonants: straight strokes between rim nodes. Base bar by place:
  // labial 6-1 (top bar), coronal 5-2 (middle bar), dorsal 4-3 (bottom bar); h is the ray 0-centre.
  // voiced: true lights the centre.
  consonants: {
    p:  { place: 'labial',  manner: 'stop',      voiced: false, strokes: [[6, 1]] },
    b:  { place: 'labial',  manner: 'stop',      voiced: true,  strokes: [[6, 1]] },
    f:  { place: 'labial',  manner: 'fricative', voiced: false, strokes: [[6, 1], [1, 2]] },
    v:  { place: 'labial',  manner: 'fricative', voiced: true,  strokes: [[6, 1], [1, 2]] },
    m:  { place: 'labial',  manner: 'nasal',     voiced: false, strokes: [[6, 1], [6, 5]] },
    w:  { place: 'labial',  manner: 'glide',     voiced: false, strokes: [[6, 1], [6, 5], [1, 2]] },
    t:  { place: 'coronal', manner: 'stop',      voiced: false, strokes: [[5, 2]] },
    d:  { place: 'coronal', manner: 'stop',      voiced: true,  strokes: [[5, 2]] },
    th: { place: 'coronal', manner: 'fricative', voiced: false, strokes: [[5, 2], [2, 3]] },
    s:  { place: 'coronal', manner: 'sibilant',  voiced: false, strokes: [[5, 2], [2, 1]] },
    n:  { place: 'coronal', manner: 'nasal',     voiced: false, strokes: [[5, 2], [5, 4]] },
    l:  { place: 'coronal', manner: 'lateral',   voiced: false, strokes: [[5, 2], [5, 6]] },
    r:  { place: 'coronal', manner: 'rhotic',    voiced: false, strokes: [[5, 2], [5, 4], [2, 3]] },
    k:  { place: 'dorsal',  manner: 'stop',      voiced: false, strokes: [[4, 3]] },
    g:  { place: 'dorsal',  manner: 'stop',      voiced: true,  strokes: [[4, 3]] },
    kj: { place: 'dorsal',  manner: 'palatal stop', voiced: false, strokes: [[4, 3], [3, 2]] },
    gj: { place: 'dorsal',  manner: 'palatal stop', voiced: true,  strokes: [[4, 3], [3, 2]] },
    ng: { place: 'dorsal',  manner: 'nasal',     voiced: false, strokes: [[4, 3], [4, 5]] },
    j:  { place: 'dorsal',  manner: 'glide',     voiced: false, strokes: [[4, 3], [3, 2], [4, 5]] },
    h:  { place: 'glottal', manner: 'fricative', voiced: false, strokes: [[0, 'C']] },
  },
  // Vowels are stars placed on a rim node, laid out like a vowel chart
  // (front on the right, back on the left, low at the bottom). ə is the unstressed final e.
  vowels: { y: 0, i: 1, e: 2, a: 3, 'ə': 4, o: 5, u: 6 },
  diphthongs: { ei: ['e', 'i'], ay: ['e', 'i'], au: ['a', 'u'], ou: ['o', 'u'] },
  digraphs: ['th', 'kj', 'gj', 'ng'],
  foreign: { c: 'k', q: 'k', x: 'ks', z: 's' },
  // Numerals: every number cell carries a bar over the top. 1-7 trace the rim clockwise from the top point;
  // 7 is the closed heptagon ("the full count"); 8 lights the centre; 9 adds the ray to the top point;
  // 0 is a hollow centre (nuth, the void). The long hundred (120) is the heptagon with the emblem star inside.
  digits: {
    0: { strokes: [], ring: true },
    1: { strokes: [[0, 1]] },
    2: { strokes: [[0, 1], [1, 2]] },
    3: { strokes: [[0, 1], [1, 2], [2, 3]] },
    4: { strokes: [[0, 1], [1, 2], [2, 3], [3, 4]] },
    5: { strokes: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5]] },
    6: { strokes: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6]] },
    7: { strokes: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 0]] },
    8: { strokes: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 0]], dot: true },
    9: { strokes: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 0], ['C', 0]], dot: true },
  },
  longHundred: {
    strokes: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 0]],
    fineStrokes: [[0, 3], [3, 6], [6, 2], [2, 5], [5, 1], [1, 4], [4, 0]],
  },
  // Narrow punctuation cells (14 units wide).
  punctuation: {
    '·': { name: 'word divider', diamond: true },
    ',': { name: 'comma', lines: [[[7, 24], [7, 34]]] },
    '.': { name: 'full stop', lines: [[[4.5, 18], [4.5, 34]], [[9.5, 18], [9.5, 34]]] },
    '?': { name: 'question', lines: [[[7, 20], [7, 34]]], star: [7, 12] },
    '!': { name: 'exclamation', lines: [[[7, 12], [7, 28]]], dot: [7, 33] },
  },
  // Optional evidential sigils that may close a sentence instead of the written particle.
  sigils: {
    sa:    { name: 'sa (I saw it)', ring: true, stars: ['C'] },
    sund:  { name: 'sund (so it is sung)', stars: [5, 'C', 2] },
    stari: { name: 'stari (so the stars say)', stars: [0, 1, 2, 3, 4, 5, 6] },
  },
  // Names that take the violet seven-pointed sacred mark when sacred: 'auto'.
  sacredNames: ['auristar', 'ur', 'nett', 'myr', 'heid', 'lysmar', 'naum', 'fyren', 'firen', 'stevlysen', 'sevlysen', 'norstar', 'stardul'],
};

const L = LYSRIT.cell;

function lysritNode(k) {
  if (k === 'C') return [L.centre[0], L.centre[1]];
  const a = ((-90 + (k * 360) / 7) * Math.PI) / 180;
  return [L.centre[0] + L.radius * Math.cos(a), L.centre[1] + L.radius * Math.sin(a)];
}
/** Coordinates of node k ('C' or 0-6) inside a 40 x 44 cell. */
export function lysritNodePoint(k) { return lysritNode(k); }

/**
 * Split one word into Lysrit tokens (same rules as the v0.1 renderer):
 * vowel digraphs ei/ay/au/ou become two stars, th kj gj ng are one consonant,
 * a doubled vowel is long, a doubled consonant is a geminate, c q x z are transcribed,
 * and an unstressed e in the last syllable of a longer word becomes ə.
 * Returns { tokens, notes }.
 */
export function lysritTokens(word) {
  const notes = [];
  const w = String(word).toLowerCase().replace(/[’']/g, '');
  const out = [];
  let i = 0;
  while (i < w.length) {
    const two = w.substr(i, 2), ch = w[i];
    if (LYSRIT.diphthongs[two]) {
      out.push({ t: 'v', v: LYSRIT.diphthongs[two][0], dig: 1 });
      out.push({ t: 'v', v: LYSRIT.diphthongs[two][1], dig: 1 });
      i += 2; continue;
    }
    if (LYSRIT.digraphs.includes(two)) { out.push({ t: 'c', v: two }); i += 2; continue; }
    if (LYSRIT.foreign[ch]) {
      notes.push(`"${ch}" is not a Norsund letter, so it is written as "${LYSRIT.foreign[ch]}".`);
      for (const x of LYSRIT.foreign[ch]) out.push({ t: 'c', v: x });
      i++; continue;
    }
    if (Object.prototype.hasOwnProperty.call(LYSRIT.vowels, ch)) {
      if (w[i + 1] === ch) { out.push({ t: 'v', v: ch, long: 1 }); i += 2; }
      else { out.push({ t: 'v', v: ch }); i++; }
      continue;
    }
    if (LYSRIT.consonants[ch]) {
      if (w[i + 1] === ch) { out.push({ t: 'c', v: ch, gem: 1 }); i += 2; }
      else { out.push({ t: 'c', v: ch }); i++; }
      continue;
    }
    i++;
  }
  // Unstressed final-syllable e -> ə (only in words with two or more vowel groups).
  const groups = [];
  let prevV = false;
  out.forEach((tk, idx) => {
    if (tk.t === 'v') { if (!prevV) groups.push([]); groups[groups.length - 1].push(idx); prevV = true; }
    else prevV = false;
  });
  if (groups.length >= 2) {
    const last = groups[groups.length - 1];
    if (last.length === 1 && out[last[0]].v === 'e' && !out[last[0]].long) out[last[0]].v = 'ə';
  }
  return { tokens: out, notes };
}

/** Group a word's tokens into cells: { c: consonant|null, gem, v: [{v, long}] }. Each cell holds up to two vowel stars. */
export function lysritCells(word) {
  const cells = [];
  for (const tk of lysritTokens(word).tokens) {
    if (tk.t === 'c') cells.push({ c: tk.v, gem: !!tk.gem, v: [] });
    else {
      const cur = cells[cells.length - 1];
      if (cur && cur.v.length < 2) cur.v.push({ v: tk.v, long: !!tk.long });
      else cells.push({ c: null, gem: false, v: [{ v: tk.v, long: !!tk.long }] });
    }
  }
  return cells;
}

// --- SVG helpers -----------------------------------------------------------

const PALETTES = {
  auto:  { ink: 'currentColor', star: 'var(--lysrit-star, #1aa3b8)', node: 'currentColor', nodeOpacity: 0.32, sacred: 'var(--lysrit-sacred, #8a33a8)', glow: 'var(--runar-glow, #62d5e3)', bg: null },
  light: { ink: '#121733', star: '#0a7584', node: '#aeb5cc', nodeOpacity: 1, sacred: '#8a33a8', glow: '#18b6c9', bg: '#f1f2f5' },
  dark:  { ink: '#e7e5e0', star: '#8ef0ff', node: '#3b4672', nodeOpacity: 1, sacred: '#cf86e8', glow: '#8ef0ff', bg: '#0b1024' },
};
function palette(theme) { return PALETTES[theme] || PALETTES.auto; }
const f2 = (n) => Number(n.toFixed(2));
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function sparkle(x, y, s) {
  return `M${f2(x)},${f2(y - s)} Q${f2(x)},${f2(y)} ${f2(x + s)},${f2(y)} Q${f2(x)},${f2(y)} ${f2(x)},${f2(y + s)} Q${f2(x)},${f2(y)} ${f2(x - s)},${f2(y)} Q${f2(x)},${f2(y)} ${f2(x)},${f2(y - s)} Z`;
}
function heptagramPoints(cx, cy, ro, ri) {
  const p = [];
  for (let k = 0; k < 14; k++) {
    const r = k % 2 ? ri : ro;
    const a = ((-90 + (k * 180) / 7) * Math.PI) / 180;
    p.push(`${f2(cx + r * Math.cos(a))},${f2(cy + r * Math.sin(a))}`);
  }
  return p.join(' ');
}
const line = (a, b, stroke, w, cap = 'round') =>
  `<line x1="${f2(a[0])}" y1="${f2(a[1])}" x2="${f2(b[0])}" y2="${f2(b[1])}" style="stroke:${stroke};stroke-width:${w};stroke-linecap:${cap};fill:none"/>`;
const circle = (c, r, fill, extra = '') => `<circle cx="${f2(c[0])}" cy="${f2(c[1])}" r="${r}" style="fill:${fill}${extra}"/>`;

function nodeDots(pal) {
  return ['C', 0, 1, 2, 3, 4, 5, 6].map((k) => circle(lysritNode(k), 1.15, pal.node, pal.nodeOpacity < 1 ? `;opacity:${pal.nodeOpacity}` : '')).join('');
}

/** SVG markup (no wrapper) for one Lysrit cell at x offset ox. */
export function lysritCellMarkup(cell, ox = 0, theme = 'auto', opts = {}) {
  const pal = palette(theme);
  let s = `<g transform="translate(${f2(ox)},0)">`;
  if (opts.nodes !== false) s += nodeDots(pal);
  if (cell.c) {
    const spec = LYSRIT.consonants[cell.c];
    for (const [a, b] of spec.strokes) s += line(lysritNode(a), lysritNode(b), pal.ink, 2.1);
    if (spec.voiced) s += circle([L.centre[0], L.centre[1]], 2.7, pal.star);
    if (cell.gem) s += line([L.centre[0] - 6, L.height - 2.5], [L.centre[0] + 6, L.height - 2.5], pal.ink, 1.6);
  }
  for (const v of cell.v) {
    const p = lysritNode(LYSRIT.vowels[v.v]);
    s += `<path d="${sparkle(p[0], p[1], 4.4)}" style="fill:${pal.star}"/>`;
    if (v.long) s += `<circle cx="${f2(p[0])}" cy="${f2(p[1])}" r="6.2" style="stroke:${pal.star};stroke-width:1.2;fill:none"/>`;
  }
  return s + '</g>';
}

function digitMarkup(d, ox, pal, opts) {
  const spec = d === 'lh' ? LYSRIT.longHundred : LYSRIT.digits[d];
  let s = `<g transform="translate(${f2(ox)},0)">`;
  if (opts.nodes !== false) s += nodeDots(pal);
  s += line([0, 2.6], [L.width, 2.6], pal.ink, 1.6, 'butt'); // number bar: spans the cell so neighbours join
  for (const [a, b] of spec.strokes) s += line(lysritNode(a), lysritNode(b), pal.ink, 2.1);
  for (const [a, b] of spec.fineStrokes || []) s += line(lysritNode(a), lysritNode(b), pal.ink, 1.3);
  if (spec.ring) s += `<circle cx="${L.centre[0]}" cy="${L.centre[1]}" r="4.2" style="stroke:${pal.ink};stroke-width:1.6;fill:none"/>`;
  if (spec.dot) s += circle([L.centre[0], L.centre[1]], 2.7, pal.star);
  return s + '</g>';
}

function sigilMarkup(name, ox, pal, opts) {
  const spec = LYSRIT.sigils[name];
  let s = `<g transform="translate(${f2(ox)},0)">`;
  if (opts.nodes !== false) s += nodeDots(pal);
  if (spec.ring) s += `<circle cx="${L.centre[0]}" cy="${L.centre[1]}" r="7" style="stroke:${pal.ink};stroke-width:1.6;fill:none"/>`;
  for (const k of spec.stars) { const p = lysritNode(k); s += `<path d="${sparkle(p[0], p[1], k === 'C' ? 4.4 : 3.6)}" style="fill:${pal.star}"/>`; }
  return s + '</g>';
}

function punctMarkup(ch, ox, pal) {
  const spec = LYSRIT.punctuation[ch];
  let s = `<g transform="translate(${f2(ox)},0)">`;
  if (spec.diamond) s += `<path d="M7,${L.centre[1] - 2.6} L9.6,${L.centre[1]} L7,${L.centre[1] + 2.6} L4.4,${L.centre[1]} Z" style="fill:${pal.ink}"/>`;
  for (const [a, b] of spec.lines || []) s += line(a, b, pal.ink, 2.1);
  if (spec.star) s += `<path d="${sparkle(spec.star[0], spec.star[1], 3.4)}" style="fill:${pal.star}"/>`;
  if (spec.dot) s += circle(spec.dot, 1.8, pal.ink);
  return s + '</g>';
}

function sacredMarkup(ox, pal) {
  return `<polygon points="${heptagramPoints(ox + 11, L.centre[1], 9, 3.8)}" style="fill:${pal.sacred}"/>`;
}

/** Parse free text into Lysrit layout items. Supports {lh}, {sa}, {sund}, {stari} and {sacred} escapes. */
function lysritItems(text) {
  const items = [];
  const re = /\{(lh|sa|sund|stari|sacred)\}|[0-9]+|[·,.?!]|[^\s\-·,.?!{}0-9]+|[\s\-]+/g;
  let m;
  while ((m = re.exec(String(text)))) {
    const tok = m[0];
    if (m[1]) items.push(m[1] === 'lh' ? { type: 'number', digits: ['lh'] } : m[1] === 'sacred' ? { type: 'sacredMark' } : { type: 'sigil', name: m[1] });
    else if (/^[0-9]+$/.test(tok)) items.push({ type: 'number', digits: tok.split('') });
    else if (/^[·,.?!]$/.test(tok)) items.push({ type: 'punct', ch: tok });
    else if (/^[\s\-]+$/.test(tok)) items.push({ type: 'gap' });
    else items.push({ type: 'word', text: tok });
  }
  return items;
}

/**
 * Render text in Lysrit as an SVG string.
 * opts.sacred: false | true (first word) | 'auto' (known holy names) | array of words.
 * opts.theme: 'auto' (currentColor + CSS variables --lysrit-star, --lysrit-sacred) | 'light' | 'dark'.
 * opts.scale: size multiplier (1 = 44 px tall). opts.nodes: draw the faint grid nodes (default true).
 * opts.background: with theme 'light' or 'dark', draw the stone or night background (default true).
 */
export function renderLysrit(text, opts = {}) {
  const { sacred = false, scale = 1, theme = 'auto', nodes = true, title, background = true } = opts;
  const pal = { ...palette(theme) };
  if (!background) pal.bg = null;
  const items = lysritItems(text);
  const sacredSet = Array.isArray(sacred) ? new Set(sacred.map((w) => w.toLowerCase())) : null;
  let firstWord = true, x = 0, body = '', pendingSacred = false, prev = null;
  const notes = [];
  for (const it of items) {
    if (it.type === 'gap') { if (prev && prev !== 'gap') x += L.wordGap; prev = 'gap'; continue; }
    if (it.type === 'sacredMark') { pendingSacred = true; continue; }
    if (it.type === 'word') {
      const lower = it.text.toLowerCase();
      const mark = pendingSacred || (sacred === true && firstWord) || (sacred === 'auto' && LYSRIT.sacredNames.includes(lower)) || (sacredSet && sacredSet.has(lower));
      pendingSacred = false; firstWord = false;
      if (mark) { body += sacredMarkup(x, pal); x += L.sacredWidth; }
      const t = lysritTokens(it.text); notes.push(...t.notes);
      for (const c of lysritCells(it.text)) { body += lysritCellMarkup(c, x, theme, { nodes }); x += L.width; }
    } else if (it.type === 'number') {
      for (const d of it.digits) { body += digitMarkup(d, x, pal, { nodes }); x += L.width; }
    } else if (it.type === 'sigil') {
      body += sigilMarkup(it.name, x, pal, { nodes }); x += L.width;
    } else if (it.type === 'punct') {
      body += punctMarkup(it.ch, x, pal); x += L.punctWidth;
    }
    prev = it.type;
  }
  const width = Math.max(x, 10);
  const pad = pal.bg ? 8 : 0;
  const vw = width + pad * 2, vh = L.height + pad * 2;
  const label = title || String(text);
  const bg = pal.bg ? `<rect x="0" y="0" width="${f2(vw)}" height="${f2(vh)}" rx="6" style="fill:${pal.bg}"/>` : '';
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${f2(vw)} ${f2(vh)}" width="${f2(vw * scale)}" height="${f2(vh * scale)}" role="img" aria-label="${esc(label)}"><title>${esc(label)}</title>${bg}<g transform="translate(${pad},${pad})"${theme === 'auto' ? ' style="color:inherit"' : ''}>${body}</g></svg>`;
}

/** Render a single Lysrit cell spec (for letter sheets). kind: 'cell' | 'digit' | 'sigil' | 'punct' | 'sacred'. */
export function renderLysritGlyph(kind, value, opts = {}) {
  const { scale = 1, theme = 'auto', nodes = true, title = String(value) } = opts;
  const pal = palette(theme);
  let body, w = L.width;
  if (kind === 'cell') body = lysritCellMarkup(value, 0, theme, { nodes });
  else if (kind === 'digit') body = digitMarkup(value, 0, pal, { nodes });
  else if (kind === 'sigil') body = sigilMarkup(value, 0, pal, { nodes });
  else if (kind === 'punct') { body = punctMarkup(value, 0, pal); w = L.punctWidth; }
  else if (kind === 'sacred') { body = sacredMarkup(0, pal); w = L.sacredWidth; }
  else throw new Error(`Unknown Lysrit glyph kind: ${kind}`);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${L.height}" width="${f2(w * scale)}" height="${f2(L.height * scale)}" role="img" aria-label="${esc(title)}"><title>${esc(title)}</title>${body}</svg>`;
}

// ---------------------------------------------------------------------------
// Runes (runar)
// ---------------------------------------------------------------------------
// Coordinates: the stave runs from (0,0) at the top to (0,1) at the bottom; x grows to the right.
// Consonant runes carry their branches on the right of the stave, vowel runes on the left.
// No rune has branches on both sides, so no rune can form an arrow, a Y, an X or a crossed stave.

const q = (n) => Math.round(n * 1000) / 1000;
const D = (r) => [[0, r], [0.5, q(r + 0.3)]];          // branch falling to the right
const U = (r) => [[0, q(r + 0.3)], [0.5, r]];          // branch rising to the right
const B = (r) => [[0, r], [0.42, q(r + 0.15)], [0, q(r + 0.3)]]; // bow (pennant) on the right
const LU = (r) => [[0, q(r + 0.3)], [-0.4, r]];        // branch rising to the left
const LD = (r) => [[0, r], [-0.4, q(r + 0.3)]];        // branch falling to the left
const LB = (r) => [[0, r], [-0.36, q(r + 0.15)], [0, q(r + 0.3)]]; // bow on the left
const HEEL = [[0, 1], [0.22, 1]];                      // voicing heel
const STAVE = [[0, 0], [0, 1]];
const TOP = 0, MID = 0.35, LOW = 0.7;
const PALATAL_DOT = [0.24, 0.55];

/** The rune row (runrad), in traditional order: lips, tongue-tip, back of the mouth, vowels. */
export const RUNAR = {
  height: 1,
  palatalDot: PALATAL_DOT,
  runes: [
    { letter: 'p',  name: 'plog',   gloss: 'plough',        family: 'labial',  lines: [STAVE, B(TOP)] },
    { letter: 'b',  name: 'brod',   gloss: 'sibling',       family: 'labial',  lines: [STAVE, B(TOP), HEEL] },
    { letter: 'f',  name: 'fyr',    gloss: 'fire',          family: 'labial',  lines: [STAVE, B(MID)] },
    { letter: 'v',  name: 'vil',    gloss: 'free',          family: 'labial',  lines: [STAVE, B(MID), HEEL] },
    { letter: 'm',  name: 'mar',    gloss: 'height',        family: 'labial',  lines: [STAVE, B(LOW)] },
    { letter: 'w',  name: 'wander', gloss: 'wanderer',      family: 'labial',  lines: [STAVE, B(MID), B(LOW)] },
    { letter: 't',  name: 'tar',    gloss: 'tear, drop',    family: 'coronal', lines: [STAVE, D(TOP)] },
    { letter: 'd',  name: 'den',    gloss: 'land',          family: 'coronal', lines: [STAVE, D(TOP), HEEL] },
    { letter: 'th', name: 'thiol',  gloss: 'brave',         family: 'coronal', lines: [STAVE, D(MID)] },
    { letter: 's',  name: 'sund',   gloss: 'song, voice',   family: 'coronal', lines: [STAVE, D(MID), D(LOW)] },
    { letter: 'n',  name: 'nim',    gloss: 'night',         family: 'coronal', lines: [STAVE, D(LOW)] },
    { letter: 'l',  name: 'lys',    gloss: 'light',         family: 'coronal', lines: [STAVE, D(TOP), D(MID)] },
    { letter: 'r',  name: 'run',    gloss: 'rune, secret',  family: 'coronal', lines: [STAVE, D(TOP), D(LOW)] },
    { letter: 'k',  name: 'kyr',    gloss: 'blade',         family: 'dorsal',  lines: [STAVE, U(TOP)] },
    { letter: 'g',  name: 'grjot',  gloss: 'stone',         family: 'dorsal',  lines: [STAVE, U(TOP), HEEL] },
    { letter: 'kj', name: 'kjold',  gloss: 'ward',          family: 'dorsal',  lines: [STAVE, U(TOP)], dots: [PALATAL_DOT] },
    { letter: 'gj', name: 'gjal',   gloss: 'echo',          family: 'dorsal',  lines: [STAVE, U(TOP), HEEL], dots: [PALATAL_DOT] },
    { letter: 'h',  name: 'heim',   gloss: 'home',          family: 'dorsal',  lines: [STAVE, U(MID)] },
    { letter: 'ng', name: 'ung',    gloss: 'offspring',     family: 'dorsal',  lines: [STAVE, U(LOW)] },
    { letter: 'j',  name: 'jor',    gloss: 'steed',         family: 'dorsal',  lines: [STAVE, U(MID), U(LOW)] },
    { letter: 'a',  name: 'aur',    gloss: 'silver-bright', family: 'vowel',   lines: [STAVE, LB(LOW)] },
    { letter: 'e',  name: 'esk',    gloss: 'ash tree',      family: 'vowel',   lines: [STAVE, LU(MID)] },
    { letter: 'i',  name: 'ilin',   gloss: 'holy',          family: 'vowel',   lines: [STAVE, LU(TOP)] },
    { letter: 'o',  name: 'oude',   gloss: 'old',           family: 'vowel',   lines: [STAVE, LD(MID)] },
    { letter: 'u',  name: 'ulf',    gloss: 'wolf',          family: 'vowel',   lines: [STAVE, LD(LOW)] },
    { letter: 'y',  name: 'ylv',    gloss: 'water',         family: 'vowel',   lines: [STAVE, LB(TOP)] },
  ],
  digraphs: ['th', 'kj', 'gj', 'ng'],
  foreign: { c: 'k', q: 'k', x: 'ks', z: 's', 'ə': 'e' },
  // Tally numerals, one group per decimal digit: 1-4 short notches; 5 is a "hand", a long stroke slanted
  // across four notches; 6-9 are a hand plus notches; 0 is a short level dash.
  tally: {
    notch: [[0, 0.35], [0, 1]],
    hand: [[-0.15, 0.95], [0.75, 0.4]],
    zero: [[0, 0.65], [0.2, 0.65]],
  },
  punctuation: { divider: '·', sentence: ':' },
};
const RUNE_BY_LETTER = Object.fromEntries(RUNAR.runes.map((r, i) => [r.letter, { ...r, index: i }]));
/** Private Use Area code point of rune i: long-branch U+E100 + i, short-twig U+E140 + i (as in the Runar fonts). */
export const RUNAR_PUA = { long: 0xe100, short: 0xe140 };

/** Short-twig (wood) form: every element is pulled halfway toward where it meets the stave. */
export function runarShortTwig(lines) {
  return lines.map((pl) => {
    const onStave = pl.filter((p) => p[0] === 0);
    if (pl.length === 2 && pl[0][0] === 0 && pl[1][0] === 0) return pl; // the stave itself
    if (!onStave.length) return pl;
    const ax = 0, ay = onStave.reduce((s, p) => s + p[1], 0) / onStave.length;
    return pl.map((p) => [q(ax + 0.5 * (p[0] - ax)), q(ay + 0.5 * (p[1] - ay))]);
  });
}

/** Split text into rune tokens: [{ word: [letters...] }] with punctuation markers. */
export function runarTokens(text) {
  const out = [];
  const words = String(text).toLowerCase().replace(/[’']/g, '').split(/(\s+|[.,:;!?·\-])/).filter((s) => s && s.trim() !== '');
  for (const w of words) {
    if (/^[.!?:;]$/.test(w)) { out.push({ punct: ':' }); continue; }
    if (/^[,·\-]$/.test(w)) { out.push({ punct: '·' }); continue; }
    if (/^[0-9]+$/.test(w)) { out.push({ number: Number(w) }); continue; }
    const letters = [];
    let i = 0;
    while (i < w.length) {
      const two = w.substr(i, 2), ch = w[i];
      if (RUNAR.digraphs.includes(two)) { letters.push(two); i += 2; continue; }
      if (RUNAR.foreign[ch]) { for (const x of RUNAR.foreign[ch]) letters.push(x); i++; continue; }
      if (RUNE_BY_LETTER[ch]) letters.push(ch);
      i++;
    }
    if (letters.length) out.push({ word: letters });
  }
  return out;
}

/**
 * Rune names or code points for a text.
 * format 'names' (default): "kjold-oude-lys-den" per word, words joined by " · ".
 * format 'pua': Private Use Area characters for the Runar fonts (variant 'long' or 'short').
 * format 'letters': the romanization split into runes, e.g. "kj.o.l.d".
 */
export function transliterateRunes(text, opts = {}) {
  const { format = 'names', variant = 'long' } = opts;
  const parts = [];
  for (const tk of runarTokens(text)) {
    if (tk.word) {
      if (format === 'pua') parts.push(tk.word.map((l) => String.fromCodePoint(RUNAR_PUA[variant] + RUNE_BY_LETTER[l].index)).join(''));
      else if (format === 'letters') parts.push(tk.word.join('.'));
      else parts.push(tk.word.map((l) => RUNE_BY_LETTER[l].name).join('-'));
    } else if (tk.number != null) parts.push(String(tk.number));
    else if (tk.punct === ':') parts.push(':');
  }
  return parts.join(format === 'pua' ? '·' : ' · ').replace(/ · :/g, ' :');
}

function runeMarkup(lines, dots, x0, top, H, ink, w, extraStyle = '') {
  let s = '';
  for (const pl of lines) {
    const pts = pl.map((p) => `${f2(x0 + p[0] * H)},${f2(top + p[1] * H)}`).join(' ');
    s += `<polyline points="${pts}" style="stroke:${ink};stroke-width:${w};stroke-linecap:square;stroke-linejoin:miter;fill:none${extraStyle}"/>`;
  }
  for (const d of dots || []) s += `<rect x="${f2(x0 + d[0] * H - w * 0.8)}" y="${f2(top + d[1] * H - w * 0.8)}" width="${f2(w * 1.6)}" height="${f2(w * 1.6)}" style="fill:${ink}"/>`;
  return s;
}

function extent(lines) {
  let lo = 0, hi = 0;
  for (const pl of lines) for (const p of pl) { lo = Math.min(lo, p[0]); hi = Math.max(hi, p[0]); }
  return [lo, hi];
}

/**
 * Render text in runes as an SVG string.
 * opts.variant: 'long' (long-branch, stone; default) | 'short' (short-twig, wood).
 * opts.glow: true draws the runes charged with aether (glowing). Charged runes are rune magic,
 *   forbidden in Auristar; ordinary writing never glows.
 * opts.theme: 'auto' | 'light' | 'dark'. opts.scale: size multiplier (1 = 40 px rune height).
 * opts.dividers: put a dot between words, as on runestones (default true).
 * opts.background: with theme 'light' or 'dark', draw the background (default true).
 */
export function renderRunes(text, opts = {}) {
  const { variant = 'long', glow = false, theme = 'auto', scale = 1, dividers = true, title, background = true } = opts;
  const pal = { ...palette(theme) };
  if (!background) pal.bg = null;
  const H = 40, top = 6, w = variant === 'short' ? 2.2 : 2.6, side = 4;
  const ink = glow ? pal.glow : pal.ink;
  const filterAttr = glow ? ';filter:url(#runar-glow)' : '';
  let x = side, body = '', first = true;
  const sep = () => { body += `<rect x="${f2(x + 2)}" y="${f2(top + H * 0.5 - 1.6)}" width="3.2" height="3.2" style="fill:${pal.ink}"/>`; x += 7.2; };
  for (const tk of runarTokens(text)) {
    if (tk.punct === ':') {
      body += `<rect x="${f2(x + 2)}" y="${f2(top + H * 0.3)}" width="3.2" height="3.2" style="fill:${pal.ink}"/><rect x="${f2(x + 2)}" y="${f2(top + H * 0.62)}" width="3.2" height="3.2" style="fill:${pal.ink}"/>`;
      x += 9; first = true; continue;
    }
    if (tk.punct === '·') { sep(); first = true; continue; }
    if (!first) { if (dividers) sep(); else x += 12; }
    first = false;
    if (tk.number != null) {
      // One tally group per decimal digit, most significant first (as in the Runar fonts).
      for (const ch of String(tk.number)) {
        const n = Number(ch);
        if (n === 0) { body += runeMarkup([RUNAR.tally.zero], [], x + 2, top, H, pal.ink, w); x += 12; continue; }
        if (n >= 5) {
          for (let k = 0; k < 4; k++) body += runeMarkup([RUNAR.tally.notch], [], x + k * 6 + 2, top, H, pal.ink, w);
          body += runeMarkup([RUNAR.tally.hand], [], x + 2, top, H, pal.ink, w);
          x += 26;
        }
        for (let k = 0; k < n % 5; k++) { body += runeMarkup([RUNAR.tally.notch], [], x + 2, top, H, pal.ink, w); x += 6; }
        x += 6;
      }
      continue;
    }
    for (const l of tk.word) {
      const r = RUNE_BY_LETTER[l];
      const lines = variant === 'short' ? runarShortTwig(r.lines) : r.lines;
      const [lo, hi] = extent(lines);
      const x0 = x + side - lo * H;
      body += runeMarkup(lines, r.dots, x0, top, H, ink, w, filterAttr);
      x += (hi - lo) * H + side * 2 + 2;
    }
  }
  const width = Math.max(x + side, 10);
  const pad = pal.bg ? 6 : 0;
  const vw = width + pad * 2, vh = H + top * 2 + pad * 2;
  const label = title || String(text);
  // The filter region is in user space: a vertical stave has a zero-width bounding box and would vanish otherwise.
  const defs = glow ? `<defs><filter id="runar-glow" filterUnits="userSpaceOnUse" x="-20" y="-20" width="${f2(vw + 40)}" height="${f2(vh + 40)}"><feGaussianBlur stdDeviation="2.2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>` : '';
  const bg = pal.bg ? `<rect x="0" y="0" width="${f2(vw)}" height="${f2(vh)}" rx="6" style="fill:${pal.bg}"/>` : '';
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${f2(vw)} ${f2(vh)}" width="${f2(vw * scale)}" height="${f2(vh * scale)}" role="img" aria-label="${esc(label)}"><title>${esc(label)}</title>${defs}${bg}<g transform="translate(${pad},${pad})">${body}</g></svg>`;
}

/** Render one rune by letter (for rune-row sheets). */
export function renderRune(letter, opts = {}) {
  const { variant = 'long', theme = 'auto', scale = 1, glow = false, background = true } = opts;
  const r = RUNE_BY_LETTER[letter];
  if (!r) throw new Error(`No rune for "${letter}"`);
  return renderRunes(letter, { variant, theme, scale, glow, background, dividers: false, title: `${r.letter} · ${r.name}` });
}
