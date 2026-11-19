// Norsund phonology: tokenizing, syllables, IPA, English-friendly respelling, phonotactic checks.
// Rules implemented: grammar/01-phonology.yaml PHON-02..PHON-11 and grammar/02-orthography.yaml.
import { grammar, hasData, onData } from './data.js';
import { findEntry } from './lexicon.js';
import { analyze } from './morphology.js';

const VOWEL_LETTERS = ['a', 'e', 'i', 'o', 'u', 'y'];
const DIPHTHONGS = ['ei', 'ay', 'au', 'ou', 'ey'];
const LONG_VOWELS = ['aa', 'ee', 'ii', 'oo', 'uu', 'yy'];
const CONSONANT_DIGRAPHS = ['th', 'kj', 'gj', 'ng'];
export const NORSUND_LETTERS = new Set('abdefghijklmnoprstuvwy'.split(''));
const VOICELESS = new Set(['p', 't', 'k', 'kj', 'f', 'th', 's', 'h']);

const CONS_IPA = { p: 'p', b: 'b', t: 't', d: 'd', kj: 'c', gj: 'ɟ', k: 'k', g: 'g', f: 'f', v: 'v', th: 'θ', s: 's', h: 'h',
  m: 'm', n: 'n', ng: 'ŋ', l: 'l', r: 'r', j: 'j', w: 'w', c: 'k', q: 'k', x: 'ks', z: 'z' };
const VOWEL_IPA = { a: 'a', e: 'e', i: 'i', o: 'o', u: 'u', y: 'y', 'ə': 'ə',
  aa: 'aː', ee: 'eː', ii: 'iː', oo: 'oː', uu: 'uː', yy: 'yː', ei: 'ej', ay: 'ej', ey: 'ej', au: 'au', ou: 'ou' };

// Elements that never carry stress inside a compound (suffixes and the linking -i-).
const UNSTRESSED_PARTS = new Set(['i', 'a', 'an', 'en', 'in', 'ar', 'ene', 'arne', 's', 't', 'ug', 'ir', 'den', 'nay',
  'ung', 'ungen', 'ling', 'eth', 'nuth', 'ning', 'ande', 'ade', 'er', 'de', 'te', 'n', 'r', 'myr']);

// Fallback copies of the YAML lists, used only when no data has been loaded.
const FALLBACK = {
  onsets: { single: ['p', 'b', 't', 'd', 'kj', 'gj', 'k', 'g', 'f', 'v', 'th', 's', 'h', 'm', 'n', 'l', 'r', 'j', 'w'],
    double: ['pr', 'br', 'tr', 'dr', 'kr', 'gr', 'fr', 'vr', 'thr', 'pl', 'bl', 'kl', 'gl', 'fl', 'sl', 'fj', 'thj', 'hj', 'sj',
      'bj', 'mj', 'nj', 'vj', 'pj', 'lj', 'sk', 'st', 'sp', 'sm', 'sn', 'sv', 'sw', 'skj', 'tw', 'dw', 'kw', 'thw', 'hw', 'kv', 'gv', 'tv', 'dv'],
    triple: ['str', 'spr', 'skr', 'stj', 'skj', 'grj', 'brj', 'frj', 'trj', 'skv'] },
  codas: { single: ['p', 'b', 't', 'd', 'k', 'g', 'f', 'v', 'th', 's', 'm', 'n', 'ng', 'l', 'r'],
    double: ['rk', 'rg', 'rd', 'rt', 'rn', 'rm', 'rl', 'rf', 'rv', 'rs', 'rth', 'rp', 'lk', 'lg', 'ld', 'lt', 'lm', 'ln', 'lf', 'lv',
      'ls', 'lth', 'lp', 'nd', 'nt', 'nk', 'ns', 'nth', 'ngs', 'mp', 'mb', 'ms', 'st', 'sk', 'sp', 'ft', 'kt', 'ks', 'ps', 'pt', 'ts', 'ds', 'gd'],
    triple: ['rst', 'rsk', 'rnd', 'rks', 'nds', 'lds', 'lsk', 'mst', 'nst', 'rts'],
    geminates: ['bb', 'dd', 'ff', 'gg', 'kk', 'll', 'mm', 'nn', 'pp', 'rr', 'ss', 'tt'] },
};

let SETS = null;
let OVERRIDE = null;
onData(() => { SETS = null; });

// Use the onset/coda lists of a phonology document directly (the validator does this, so it checks
// records against the YAML on disk even when no engine data is loaded).
export function useInventory(phonologyDoc) {
  OVERRIDE = phonologyDoc || null;
  SETS = null;
}

function sets() {
  if (SETS) return SETS;
  const ph = OVERRIDE || (hasData() ? grammar('phonology') : {});
  const on = ph.onsets || FALLBACK.onsets;
  const co = ph.codas || FALLBACK.codas;
  SETS = {
    onsets: new Set([...(on.single || []), ...(on.double || []), ...(on.triple || [])]),
    codas: new Set([...(co.single || []), ...(co.double || []), ...(co.triple || [])]),
    geminates: new Set(co.geminates || []),
  };
  return SETS;
}

// ---------- Tokenizing ----------

// tokenize('Thiolden') -> [{g:'th',type:'C'},{g:'i',type:'V'},{g:'o',type:'V'},...]
// type: C consonant, V vowel, B boundary (hyphen), X other character (apostrophe, digit...)
export function tokenize(word) {
  const w = String(word).toLowerCase();
  const out = [];
  let i = 0;
  while (i < w.length) {
    const ch = w[i];
    const two = w.slice(i, i + 2);
    if (ch === '-' || ch === ' ') { out.push({ g: ch, type: 'B', start: i }); i++; continue; }
    if (CONSONANT_DIGRAPHS.includes(two)) { out.push({ g: two, type: 'C', start: i }); i += 2; continue; }
    if (LONG_VOWELS.includes(two)) { out.push({ g: two, type: 'V', long: true, start: i }); i += 2; continue; }
    if (DIPHTHONGS.includes(two)) { out.push({ g: two, type: 'V', diph: true, start: i }); i += 2; continue; }
    if (VOWEL_LETTERS.includes(ch)) { out.push({ g: ch, type: 'V', start: i }); i++; continue; }
    if (/[a-z]/.test(ch)) {
      const foreign = !NORSUND_LETTERS.has(ch);
      if (w[i + 1] === ch && !foreign) { out.push({ g: ch, type: 'C', gem: true, start: i }); i += 2; continue; }
      out.push({ g: ch, type: 'C', start: i, foreign }); i++; continue;
    }
    out.push({ g: ch, type: 'X', start: i }); i++;
  }
  return out;
}

// PHON-05: an unstressed i (or u) right before a full back or low vowel is a glide [j] ([w]):
// thiol = [θjol]. Before e (rie = [ˈri.ə]) the two vowels stay in separate syllables.
const GLIDE_BEFORE = new Set(['a', 'o', 'u', 'aa', 'oo', 'uu', 'au', 'ou']);
function markGlides(tokens) {
  return tokens.map((t, k) => {
    const next = tokens[k + 1];
    if (t.type === 'V' && (t.g === 'i' || t.g === 'u') && next && next.type === 'V' && GLIDE_BEFORE.has(next.g) && next.g !== t.g) {
      const prev = tokens[k - 1];
      if (k > 0 && prev && prev.type === 'V') return t; // keep hiatus after a vowel
      return { ...t, type: 'C', glide: true, key: t.g === 'i' ? 'j' : 'w' };
    }
    return t;
  });
}

function onsetKey(tokens) {
  return tokens.map((t) => t.key || t.g).join('');
}

function isLegalOnset(tokens) {
  if (tokens.length === 0) return true;
  if (tokens.some((t) => t.gem)) return false;
  return sets().onsets.has(onsetKey(tokens));
}

function codaKey(tokens) {
  return tokens.map((t) => (t.gem ? t.g + t.g : t.key || t.g)).join('');
}

function isLegalCoda(tokens) {
  if (tokens.length === 0) return true;
  const s = sets();
  const key = codaKey(tokens);
  if (s.codas.has(key) || s.geminates.has(key)) return true;
  // geminate followed by s or t (kulls, thammt) is tolerated
  if (tokens.length === 2 && tokens[0].gem && ['s', 't'].includes(tokens[1].g)) return true;
  return false;
}

// ---------- Syllables ----------

// Returns [{onset:[], nucleus:token, coda:[], tokens:[]}] using the maximal-onset principle.
export function syllabifyTokens(tokens) {
  const toks = tokens.filter((t) => t.type === 'C' || t.type === 'V');
  const nuclei = [];
  toks.forEach((t, k) => { if (t.type === 'V') nuclei.push(k); });
  if (nuclei.length === 0) return toks.length ? [{ onset: toks, nucleus: null, coda: [], tokens: toks }] : [];
  const syl = nuclei.map((n) => ({ onset: [], nucleus: toks[n], coda: [] }));
  syl[0].onset = toks.slice(0, nuclei[0]);
  for (let s = 0; s < nuclei.length - 1; s++) {
    const run = toks.slice(nuclei[s] + 1, nuclei[s + 1]);
    let split = run.length; // index where onset starts
    for (let start = 0; start <= run.length; start++) {
      const onset = run.slice(start);
      if (onset.length <= 3 && isLegalOnset(onset)) { split = start; break; }
    }
    syl[s].coda = run.slice(0, split);
    syl[s + 1].onset = run.slice(split);
  }
  syl[syl.length - 1].coda = toks.slice(nuclei[nuclei.length - 1] + 1);
  for (const s of syl) s.tokens = [...s.onset, s.nucleus, ...s.coda];
  return syl;
}

export function syllabify(word) {
  // a hyphen is a compound boundary (ORTH-03): syllables never cross it
  if (String(word).includes('-')) return String(word).split('-').filter(Boolean).flatMap((p) => syllabify(p));
  return syllabifyTokens(markGlides(tokenize(word))).map((s) => s.tokens.map((t) => (t.gem ? t.g + t.g : t.g)).join(''));
}

export function syllableCount(word) {
  if (String(word).includes('-')) return String(word).split('-').filter(Boolean).reduce((n, p) => n + syllableCount(p), 0);
  return syllabifyTokens(markGlides(tokenize(word))).filter((s) => s.nucleus).length;
}

// ---------- Compound alignment ----------

// Split a word into its parts (from the dictionary `parts` field). Parts may be lemmas (kjala) whose
// surface form drops a final -a or -e (kjalheim), so each part is matched loosely.
export function alignParts(word, parts) {
  if (!parts || !parts.length) return null;
  const w = word.toLowerCase();
  let pos = 0;
  const out = [];
  for (let k = 0; k < parts.length; k++) {
    const p = String(parts[k]).toLowerCase().replace(/[^a-z]/g, '');
    if (!p) continue;
    const cands = [p, p.replace(/[ae]$/, ''), p.replace(/a$/, 'i')];
    const isLast = k === parts.length - 1;
    let hit = null;
    for (const c of cands) {
      if (c && w.startsWith(c, pos)) { hit = c; break; }
    }
    if (!hit) {
      if (isLast && pos < w.length) hit = w.slice(pos);
      else return null;
    }
    out.push({ text: w.slice(pos, pos + hit.length), part: p });
    pos += hit.length;
  }
  if (pos < w.length) {
    if (!out.length) return null;
    out[out.length - 1].text += w.slice(pos);
  }
  return out;
}

function chunksFor(word, parts) {
  const aligned = alignParts(word, parts);
  if (!aligned) return [word.toLowerCase()];
  const chunks = [];
  for (const el of aligned) {
    const stressable = !UNSTRESSED_PARTS.has(el.part) && el.text.length > 0;
    if (stressable || chunks.length === 0) chunks.push(el.text);
    else chunks[chunks.length - 1] += el.text;
  }
  return chunks;
}

// ---------- IPA ----------

function lexInfo(word) {
  if (!hasData()) return {};
  const e = findEntry(word);
  if (e) return { parts: e.parts, layer: e.layer };
  // An inflected compound (Sundwanderen) borrows the parts of its lemma (Sundwander) plus the ending.
  for (const r of analyze(word)) {
    const le = r.entry;
    if (le && le.parts && le.parts.length && r.form.toLowerCase().startsWith(le.lemma.toLowerCase())) {
      const rest = r.form.slice(le.lemma.length);
      return { parts: rest ? [...le.parts, rest] : le.parts, layer: le.layer };
    }
    if (le && le.layer) return { layer: le.layer };
  }
  return {};
}

// Builds the syllable list for a word with stress and reduction marks.
export function analyzeSyllables(word, opts = {}) {
  const info = { ...lexInfo(word), ...opts };
  const learned = info.layer === 'kedre-learned';
  const dialect = opts.dialect || 'common';
  const chunks = learned ? [word.toLowerCase()] : chunksFor(word, info.parts);
  const all = [];
  const chunkStarts = [];
  for (const ch of chunks) {
    let toks = tokenize(ch).filter((t) => t.type !== 'X' && t.type !== 'B');
    if (!learned) toks = markGlides(toks);
    const syl = syllabifyTokens(toks);
    chunkStarts.push(all.length);
    syl.forEach((s, k) => { s.chunkEnd = k === syl.length - 1; s.chunkStart = k === 0 && chunkStarts.length > 1; all.push(s); });
  }
  const n = all.filter((s) => s.nucleus).length;
  all.forEach((s) => { s.stress = 0; });
  if (n >= 2) {
    if (learned) {
      all[all.length - 2].stress = 1;
    } else {
      all[0].stress = 1;
      // PHON-02 (as shown in its examples): secondary stress on the second stressable element,
      // when it does not start right at the second syllable.
      if (chunkStarts.length > 1 && chunkStarts[1] >= 2) all[chunkStarts[1]].stress = 2;
    }
  }
  // PHON-06: e in an unstressed final syllable (of each element) is [ə].
  if (!learned && dialect !== 'old' && n >= 2) {
    all.forEach((s, k) => {
      // a one-syllable root inside a compound (aft|kreth) keeps its full vowel
      if (s.chunkEnd && !s.chunkStart && !s.stress && s.nucleus && s.nucleus.g === 'e') s.reduced = true;
      // the definite plural ending -ene reduces both vowels
      if (k === all.length - 2 && all.length >= 3 && !s.stress && s.nucleus && s.nucleus.g === 'e'
        && all[k + 1].nucleus && all[k + 1].nucleus.g === 'e' && /ene$/.test(word.toLowerCase())) s.reduced = true;
    });
  }
  return all;
}

function consonantIpa(t, prev, next, opts) {
  if (t.glide) return t.key;
  let sym = CONS_IPA[t.g] || t.g;
  if (t.g === 'th') {
    const prevV = prev && prev.type === 'V';
    const nextV = !next || next.type === 'V';
    sym = prevV && nextV ? 'ð' : 'θ';
  }
  if (t.g === 'n' && next && (next.g === 'k' || next.g === 'g')) sym = 'ŋ';
  if (t.g === 'r' && opts.narrow && prev && prev.type === 'V' && next && next.type === 'V') sym = 'ɾ';
  if (t.gem) sym += 'ː';
  return sym;
}

// ipa('Thiolden') -> 'ˈθjol.dən'; ipa('Thiolden', {dialect:'starisund'}) -> 'ˈsjol.dəŋ'
// opts: dialect common|starisund|kullmyr|nurmyr|old, parts, layer, narrow (tap [ɾ])
export function ipa(word, opts = {}) {
  const w = String(word).trim();
  if (!w) return '';
  if (/\s/.test(w)) return w.split(/\s+/).map((x) => ipa(x, opts)).join(' ');
  const dialect = opts.dialect || 'common';
  const syl = analyzeSyllables(w.replace(/['’]/g, ''), opts);
  const flat = [];
  syl.forEach((s) => s.tokens.forEach((t) => flat.push(t)));
  let idx = 0;
  const parts = syl.map((s) => {
    let out = '';
    for (const t of s.tokens) {
      const prev = flat[idx - 1];
      const next = flat[idx + 1];
      idx++;
      if (t.type === 'V') {
        let v = s.reduced && t === s.nucleus ? 'ə' : VOWEL_IPA[t.g] || t.g;
        if (dialect === 'kullmyr') v = v.replace(/y/g, 'i');
        out += v;
      } else {
        let c = consonantIpa(t, prev, next, opts);
        if (dialect === 'starisund') {
          c = c.replace(/[θð]/g, 's').replace('ː', '');
          if (t.g === 'n' && !next) c = 'ŋ';
        }
        if (dialect === 'nurmyr' && t.g === 'h' && idx === 1) c = '';
        out += c;
      }
    }
    return out;
  });
  let res = '';
  parts.forEach((p, k) => {
    const mark = syl[k].stress === 1 && parts.length > 1 ? 'ˈ' : syl[k].stress === 2 ? 'ˌ' : '';
    if (k === 0) res += mark + p;
    else res += (mark || '.') + p;
  });
  return res;
}

// ---------- English-friendly respelling ----------

const RESPELL_C = { th: 'th', kj: 'ky', gj: 'gy', ng: 'ng', j: 'y', w: 'w', h: 'h' };

function respellVowel(s, t, closed) {
  if (s.reduced) return closed ? 'e' : 'eh';
  switch (t.g) {
    case 'a': return closed ? 'a' : 'ah';
    case 'e': return closed ? 'e' : 'eh';
    case 'i': return closed ? 'i' : 'ee';
    case 'o': return closed ? 'o' : 'oh';
    case 'u': return 'oo';
    case 'y': return 'ü';
    case 'aa': return 'ah';
    case 'ee': return 'ay';
    case 'ii': return 'ee';
    case 'oo': return 'oh';
    case 'uu': return 'oo';
    case 'yy': return 'üü';
    case 'ei': case 'ay': case 'ey': return 'ay';
    case 'au': return 'ow';
    case 'ou': return 'oh';
    default: return t.g;
  }
}

function respellCons(t, next) {
  if (t.glide) return t.key === 'j' ? 'y' : 'w';
  if (RESPELL_C[t.g]) return RESPELL_C[t.g];
  if (t.g === 'g' && next && next.type === 'V' && /^[eiy]/.test(next.g)) return 'gh';
  if (t.g === 'n' && next && (next.g === 'k' || next.g === 'g')) return 'ng'; // PHON-07: strenk = STRENGK
  return t.g;
}

// respell('Auristar') -> 'OW-ree-star'
export function respell(word, opts = {}) {
  const w = String(word).trim();
  if (/\s/.test(w)) return w.split(/\s+/).map((x) => respell(x, opts)).join(' ');
  const syl = analyzeSyllables(w.replace(/['’]/g, ''), opts).map((s) => ({ ...s, onset: [...s.onset], coda: [...s.coda] }));
  // English readers expect "STAR-ee", not "STAH-ree": pull an onset r into an open short a/o/e syllable.
  for (let k = 0; k < syl.length - 1; k++) {
    const s = syl[k];
    const nx = syl[k + 1];
    if (s.coda.length === 0 && s.nucleus && ['a', 'o', 'e'].includes(s.nucleus.g) && !s.reduced
      && nx.onset.length === 1 && nx.onset[0].g === 'r') {
      s.coda.push(nx.onset.shift());
    }
  }
  const pieces = syl.map((s) => {
    const closed = s.coda.length > 0;
    let out = '';
    const seq = [...s.onset, s.nucleus, ...s.coda].filter(Boolean);
    seq.forEach((t, k) => {
      out += t.type === 'V' ? respellVowel(s, t, closed) : respellCons(t, seq[k + 1]);
    });
    if (opts.dialect === 'starisund') out = out.replace(/th/g, 's');
    return s.stress === 1 || syl.length === 1 ? out.toUpperCase() : out;
  });
  return pieces.join('-');
}

// ---------- Phonotactic validation ----------

// validateForm('ngar') -> {ok:false, errors:['"ng" cannot start a word ...']}
export function validateForm(word) {
  const errors = [];
  const warnings = [];
  const w = String(word);
  for (const ch of w) {
    const c = ch.toLowerCase();
    if (c === '-' || c === ' ') continue;
    if (c === "'" || c === '’') { errors.push('apostrophes are not used in Norsund'); continue; }
    if (!NORSUND_LETTERS.has(c)) errors.push(`letter "${ch}" is not used in Norsund`);
  }
  if (errors.length) return { ok: false, errors: [...new Set(errors)], warnings };
  for (const seg of w.toLowerCase().split(/[\s-]+/).filter(Boolean)) {
    const toks = markGlides(tokenize(seg).filter((t) => t.type === 'C' || t.type === 'V'));
    const nuclei = toks.map((t, k) => (t.type === 'V' ? k : -1)).filter((k) => k >= 0);
    if (!nuclei.length) { errors.push(`"${seg}" has no vowel`); continue; }
    const initial = toks.slice(0, nuclei[0]);
    if (initial.length && initial[0].g === 'ng') errors.push(`"ng" cannot start a word (${seg})`);
    else if (initial.length && initial[0].gem) errors.push(`a word cannot start with a double consonant (${seg})`);
    else if (!isLegalOnset(initial)) errors.push(`"${onsetKey(initial)}" is not an allowed beginning (${seg})`);
    const final = toks.slice(nuclei[nuclei.length - 1] + 1);
    if (final.some((t) => t.g === 'kj' || t.g === 'gj') && final.length && ['kj', 'gj'].includes(final[final.length - 1].g)) {
      errors.push(`kj and gj cannot end a word (${seg})`);
    } else if (!isLegalCoda(final)) errors.push(`"${codaKey(final)}" is not an allowed ending (${seg})`);
    for (let s = 0; s < nuclei.length - 1; s++) {
      const run = toks.slice(nuclei[s] + 1, nuclei[s + 1]);
      if (run.length === 0) {
        warnings.push(`two vowels meet without a consonant (${seg})`);
        continue;
      }
      let ok = false;
      // a written double consonant can close one syllable and open the next (kjold|dag, skyrn|nuth)
      const expanded = run.flatMap((t) => (t.gem ? [{ ...t, gem: false }, { ...t, gem: false }] : [t]));
      for (const cand of [run, expanded]) {
        for (let split = 0; split <= cand.length && !ok; split++) {
          if (isLegalCoda(cand.slice(0, split)) && isLegalOnset(cand.slice(split))) ok = true;
        }
      }
      if (!ok) errors.push(`the cluster "${codaKey(run)}" cannot be split into an allowed ending + beginning (${seg})`);
      if (run.some((t) => ['h', 'j', 'w'].includes(t.g) && !t.glide) && run.length >= 1) {
        const k = run.findIndex((t) => ['h', 'j', 'w'].includes(t.g));
        if (k === 0 && run.length > 1 && !isLegalOnset(run)) warnings.push(`h, j and w should not end a syllable (${seg})`);
      }
    }
    if (nuclei.length > 4) warnings.push(`"${seg}" has ${nuclei.length} syllables; everyday names should have four or fewer`);
  }
  return { ok: errors.length === 0, errors, warnings };
}
