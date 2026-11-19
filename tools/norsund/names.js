// Name generator and checker, driven by grammar/11-naming.yaml (place_generics, modifiers) and WF-03 (demonyms).
import { grammar, hasData } from './data.js';
import { findEntries, findEntry } from './lexicon.js';
import { validateForm, syllableCount } from './phonology.js';

function hashString(s) {
  let h = 1779033703 ^ String(s).length;
  for (let i = 0; i < String(s).length; i++) {
    h = Math.imul(h ^ String(s).charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return h >>> 0;
}

export function rng(seed) {
  let a = typeof seed === 'number' ? seed >>> 0 : hashString(seed === undefined ? Date.now() : seed);
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const pick = (r, list) => list[Math.floor(r() * list.length)];
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

// ORTH-03: hyphen where two elements would form a digraph; three identical consonants become two.
export function joinElements(elements) {
  let out = '';
  for (const el of elements) {
    const a = out.slice(-1);
    const b = el.charAt(0);
    if (out && ((a === 'n' && b === 'g') || (a === 't' && b === 'h') || (a === 'k' && b === 'j') || (a === 'g' && b === 'j'))) out += '-';
    out += el;
    out = out.replace(/([b-df-hj-np-tv-z])\1\1/g, '$1$1');
  }
  return out;
}

function naming() {
  const n = hasData() ? grammar('naming') : {};
  return { generics: n.place_generics || [], modifiers: n.modifiers || [] };
}

// generatePlaceName({seed:'x', generic:'heim'}) -> {name:'Norheim', parts:['nor','heim'], meaning:'north home', demonym:'Nornay'}
export function generatePlaceName(opts = {}) {
  const r = rng(opts.seed);
  const { generics, modifiers } = naming();
  if (!generics.length || !modifiers.length) throw new Error('Naming data is not loaded.');
  for (let attempt = 0; attempt < 200; attempt++) {
    const g = opts.generic ? generics.find((x) => x.form === opts.generic) || { form: opts.generic, meaning: opts.generic } : pick(r, generics);
    let mods = opts.modifiers
      ? opts.modifiers.map((m) => modifiers.find((x) => x.form === m) || { form: m, meaning: m })
      : [pick(r, modifiers)];
    if (!opts.modifiers && r() < 0.25) mods.push(pick(r, modifiers));
    mods = mods.filter((m, i, a) => a.findIndex((x) => x.form === m.form) === i && m.form !== g.form);
    if (!mods.length) continue;
    const els = mods.map((m, i) => (m.linking && (i === mods.length - 1) && r() < 0.6 ? m.linking : m.form));
    const name = cap(joinElements([...els, g.form]));
    const check = validateForm(name.replace(/-/g, ''));
    const syl = syllableCount(name.replace(/-/g, ''));
    const tooLong = !(opts.generic && opts.modifiers) && (syl > 3 || name.includes('-'));
    if (!check.ok || syl > 4 || tooLong) { if (opts.generic && opts.modifiers) return { name, parts: [...els, g.form], warnings: check.errors }; continue; }
    if (findEntries(name).length && !opts.allowExisting) continue;
    return {
      name,
      parts: [...els, g.form],
      meaning: `${mods.map((m) => String(m.meaning).replace(/\s*\(.*?\)/g, '')).join(' ')} ${String(g.meaning).replace(/\s*\(.*?\)/g, '').split(',')[0]}`.trim(),
      demonym: demonym(name, [...els, g.form]),
      syllables: syl,
    };
  }
  throw new Error('Could not build a valid name with those elements.');
}

const GIVEN_ELEMENTS = ['vim', 'tyr', 'ulf', 'kyr', 'thiol', 'aur', 'lys', 'star', 'nim', 'run', 'kull', 'nur', 'vil', 'hask', 'kjold',
  'dunk', 'kvit', 'skyl', 'haug', 'fyr', 'sund', 'mar', 'tar', 'ljom', 'bran', 'jor', 'heid', 'grjot', 'skar', 'vard', 'ilin'];
const BYNAMES = ['thiol', 'vil', 'aur', 'dunk', 'kvit', 'skarp', 'hel', 'nur', 'ilin', 'starug', 'lysug', 'dauthnuth', 'nethiol', 'marulf'];

function gloss1(lemma) {
  const n = grammar('naming') || {};
  const t = [...(n.modifiers || []), ...(n.place_generics || [])].find((x) => x.form === lemma);
  if (t) return String(t.meaning).replace(/\s*\(.*?\)/g, '').split(',')[0].trim();
  const list = findEntries(lemma).filter((e) => ['noun', 'adj', 'verb', 'name'].includes(e.pos));
  const e = list[0] || findEntry(lemma);
  return e ? String(e.gloss[0]).replace(/\(.*\)/, '').trim() : lemma;
}

function givenName(r) {
  for (let i = 0; i < 100; i++) {
    const a = pick(r, GIVEN_ELEMENTS);
    const b = pick(r, GIVEN_ELEMENTS);
    if (a === b) continue;
    const n = joinElements([a, b]);
    if (!n.includes('-') && validateForm(n).ok && syllableCount(n) <= 3) return { name: cap(n), meaning: `${gloss1(a)}-${gloss1(b)}` };
  }
  return { name: 'Vimtyr', meaning: 'whisper-edge' };
}

// generatePersonName({seed}) -> {name:'Aurlys Kullrunung Thiolin', given, parentName, byname, meaning}
export function generatePersonName(opts = {}) {
  const r = rng(opts.seed);
  const given = givenName(r);
  const parent = givenName(r);
  const parentName = `${parent.name}ung`;
  const withBy = opts.byname !== undefined ? opts.byname : r() < 0.4;
  const by = withBy ? pick(r, BYNAMES) : null;
  const byname = by ? cap(`${by}in`) : null;
  return {
    name: [given.name, parentName, byname].filter(Boolean).join(' '),
    given: given.name,
    parentName,
    byname,
    meaning: `${given.name} "${given.meaning}", child of ${parent.name} "${parent.meaning}"${by ? `, called "the ${gloss1(by)} one"` : ''}`,
  };
}

// WF-03: demonym = first element (+ its linking -i-) + -nay.
export function demonym(place, parts) {
  let p = parts;
  if (!p) {
    const e = findEntries(place).find((x) => x.parts && x.parts.length);
    if (e) p = e.parts;
  }
  let first;
  if (p && p.length > 1) {
    first = String(p[0]);
    if (String(p[1]).toLowerCase() === 'i') first += 'i';
  } else {
    const { generics } = naming();
    const low = place.toLowerCase();
    const heads = [...generics.map((g) => g.form), 'star', 'sund', 'heim', 'den'].sort((a, b) => b.length - a.length);
    const h = heads.find((x) => low.endsWith(x) && low.length > x.length + 1);
    first = h ? place.slice(0, place.length - h.length) : place;
  }
  first = first.replace(/-$/, '');
  return cap(first.toLowerCase()) + 'nay';
}

// checkName('Norskyl') -> {ok, errors, warnings, syllables, existing}
export function checkName(name) {
  const raw = String(name);
  const plain = raw.replace(/-/g, '');
  const parts = raw.split('-').filter(Boolean);
  const res = parts.length > 1 ? parts.map((p) => validateForm(p)).reduce((acc, r) => ({ ok: acc.ok && r.ok,
    errors: [...acc.errors, ...r.errors], warnings: [...acc.warnings, ...r.warnings] }), { ok: true, errors: [], warnings: [] })
    : validateForm(plain);
  const syl = syllableCount(plain);
  const warnings = [...res.warnings];
  // ORTH-03: a hyphen is only needed where two parts would form a digraph (n+g, t+h, k+j, g+j)
  for (let i = 0; i < parts.length - 1; i++) {
    const pair = parts[i].slice(-1).toLowerCase() + parts[i + 1][0].toLowerCase();
    if (!['ng', 'th', 'kj', 'gj'].includes(pair)) warnings.push(`The hyphen between "${parts[i]}" and "${parts[i + 1]}" is not needed; ORTH-03 writes compounds as one word unless the join would read as ${'ng, th, kj or gj'}.`);
  }
  if (syl > 3) warnings.push(`${syl} syllables: everyday names are best at three or fewer (four at most).`);
  const existing = findEntries(name).map((e) => `${e.lemma} (${e.pos}): ${e.gloss.join(', ')}`);
  if (existing.length) warnings.push(`Already in the dictionary: ${existing.join('; ')}`);
  return { ok: res.ok, errors: res.errors, warnings, syllables: syl, existing };
}
