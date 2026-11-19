import test from 'node:test';
import assert from 'node:assert/strict';
import './helpers.mjs';
import { RUNAR, LYSRIT, renderLysrit, renderRunes } from '../norsund/index.js';

// Hate-symbol screening, enforced on every change to the rune row (records/languages/scripts/runar.yaml).
// The extremist-appropriated runes in the ADL Hate Symbols database all need a feature this row forbids:
//   Algiz / "life rune" and its inverted "death rune"  -> branches on both sides of the stave
//   Tiwaz / "Tyr rune" (arrow)                           -> branches on both sides meeting the stave
//   Othala / "odal" (diamond with legs)                  -> a closed shape spanning both sides
//   Hagal (Armanen six-armed), Wolfsangel                -> strokes crossing the stave
//   Sowilo / "sig rune" (single or doubled)              -> no straight vertical stave, zig-zag strokes
// So: every rune is one vertical stave plus strokes on ONE side only, and no stroke crosses the stave.
const side = (pts) => {
  const xs = pts.map(([x]) => x).filter((x) => Math.abs(x) > 1e-9);
  return { left: xs.some((x) => x < 0), right: xs.some((x) => x > 0) };
};

test('every rune is a single vertical stave with strokes on one side only', () => {
  const bad = [];
  for (const r of RUNAR.runes) {
    const [stave, ...branches] = r.lines;
    const staveOk = stave.length === 2 && stave[0][0] === 0 && stave[1][0] === 0 && Math.abs(stave[1][1] - stave[0][1]) >= 0.99;
    if (!staveOk) bad.push(`${r.letter}: first line is not a full vertical stave`);
    const s = side(branches.flat());
    if (s.left && s.right) bad.push(`${r.letter}: strokes on both sides of the stave`);
    for (const line of branches) {
      for (let k = 1; k < line.length; k++) {
        const [a, b] = [line[k - 1][0], line[k][0]];
        if ((a < 0 && b > 0) || (a > 0 && b < 0)) bad.push(`${r.letter}: a stroke crosses the stave`);
      }
    }
  }
  assert.deepEqual(bad, []);
});

test('runes are all different, and none is the mirror image of another', () => {
  const key = (lines, mirror = false) => JSON.stringify(lines.map((l) => l.map(([x, y]) => [Number((mirror ? -x : x).toFixed(3)), Number(y.toFixed(3))])).map((l) => JSON.stringify(l)).sort());
  const seen = new Map();
  for (const r of RUNAR.runes) {
    const k = key(r.lines) + JSON.stringify(r.dots || []);
    assert.ok(!seen.has(k), `${r.letter} looks the same as ${seen.get(k)}`);
    seen.set(k, r.letter);
  }
  const mirrors = [];
  for (const r of RUNAR.runes) {
    const m = key(r.lines, true) + JSON.stringify(r.dots || []);
    if (seen.has(m) && seen.get(m) !== r.letter) mirrors.push(`${r.letter}/${seen.get(m)}`);
  }
  assert.deepEqual(mirrors, [], `mirror-image pairs are hard to read (dyslexia guidance): ${mirrors.join(', ')}`);
});

test('Lysrit letters are all different and render for every Norsund letter', () => {
  const seen = new Map();
  for (const [letter, c] of Object.entries(LYSRIT.consonants)) {
    const k = JSON.stringify((c.edges || c.e || c.strokes || []).map((e) => [...e].map(String).sort()).sort()) + (c.voiced ? 'v' : '');
    assert.ok(!seen.has(k), `${letter} looks the same as ${seen.get(k)}`);
    seen.set(k, letter);
  }
  for (const w of ['Auristar', 'Thiolden', 'Kjoldmur', 'Starirauggheim', 'yy aa ng gj kj th w']) {
    assert.match(renderLysrit(w), /^<svg[\s\S]+<\/svg>$/);
    assert.match(renderRunes(w), /^<svg[\s\S]+<\/svg>$/);
  }
});
