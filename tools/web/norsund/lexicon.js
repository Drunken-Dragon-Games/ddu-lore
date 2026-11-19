// Copied from tools/norsund/lexicon.js by tools/build.mjs. Edit the original, then run node build.mjs.
// Dictionary lookups: by Norsund lemma, by English gloss, alphabetical order, search.
import { entries, grammar, hasData, onData } from './data.js';

let IDX = null;
onData(() => { IDX = null; });

const DEFAULT_ORDER = ['a', 'b', 'd', 'e', 'f', 'g', 'gj', 'h', 'i', 'j', 'k', 'kj', 'l', 'm', 'n', 'ng', 'o', 'p', 'r', 's', 't', 'th', 'u', 'v', 'w', 'y'];

const STOP = new Set(['a', 'an', 'the', 'of', 'to', 'in', 'on', 'at', 'for', 'as', 'by', 'or', 'and', 'lit', 'one', 'is', 'be', 'its', 'it']);

// "to guard (a gate)" -> "guard"; "the Kjoldmur" -> "kjoldmur"
export function normalizeGloss(g) {
  return String(g)
    .toLowerCase()
    .replace(/\([^)]*\)/g, ' ')
    .replace(/['’]/g, '')
    .replace(/^\s*(to|a|an|the)\s+/, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function registerPenalty(e) {
  const r = e.register || 'common';
  if (r === 'common' || r === 'carved') return 0;
  if (r === 'starisund' || r === 'learned' || r === 'sacred') return 3;
  if (r === 'poetic' || r === 'old') return 6;
  return 9; // cant, kullmyr, nurmyr, farheim
}

function tierPenalty(e) {
  return e.tier === 'core' ? 0 : e.tier === 'sandbox' ? 6 : 1;
}

function build() {
  const byLemma = new Map();
  const byLower = new Map();
  const byId = new Map();
  const english = new Map();
  const add = (map, key, val) => { if (!map.has(key)) map.set(key, []); map.get(key).push(val); };
  for (const e of entries()) {
    add(byLemma, e.lemma, e);
    add(byLower, e.lemma.toLowerCase(), e);
    byId.set(e.id, e);
    (e.gloss || []).forEach((g, gi) => {
      const norm = normalizeGloss(g);
      if (!norm) return;
      add(english, norm, { entry: e, rank: gi });
      norm.split(/[^a-z]+/).filter((w) => w && !STOP.has(w)).forEach((w, wi) => {
        if (w !== norm) add(english, w, { entry: e, rank: 10 + gi + wi });
      });
    });
  }
  IDX = { byLemma, byLower, byId, english };
  return IDX;
}

function idx() {
  return IDX || build();
}

// All entries whose lemma matches (exact case first, then case-insensitive).
export function findEntries(lemma, pos) {
  if (!hasData()) return [];
  const { byLemma, byLower } = idx();
  let list = byLemma.get(lemma) || [];
  if (!list.length) list = byLower.get(String(lemma).toLowerCase()) || [];
  if (pos) {
    const want = Array.isArray(pos) ? pos : [pos];
    list = list.filter((e) => want.includes(e.pos));
  }
  return list;
}

export function findEntry(lemma, pos) {
  return findEntries(lemma, pos)[0] || null;
}

export function entryById(id) {
  return idx().byId.get(id) || null;
}

// lookupEnglish('wall', {pos:'noun'}) -> best Norsund entries first
export function lookupEnglish(word, opts = {}) {
  if (!hasData()) return [];
  const key = normalizeGloss(word);
  let hits = idx().english.get(key) || [];
  if (opts.pos) {
    const want = Array.isArray(opts.pos) ? opts.pos : [opts.pos];
    hits = hits.filter((h) => want.includes(h.entry.pos));
  }
  if (!opts.allowNames) hits = hits.filter((h) => h.entry.pos !== 'name' || opts.pos === 'name');
  const seen = new Set();
  return hits
    .map((h) => ({ ...h, score: h.rank * 2 + registerPenalty(h.entry) + tierPenalty(h.entry) + (h.entry.status === 'proposed' ? 2 : 0) }))
    .sort((a, b) => a.score - b.score || a.entry.lemma.length - b.entry.lemma.length)
    .map((h) => h.entry)
    .filter((e) => (seen.has(e.id) ? false : seen.add(e.id)));
}

// Leipzig-style label for an entry: 'guard', 'free.sword', '1SG', 'EVID.SEEN'
const PRON_LABELS = { em: '1SG', dy: '2SG', sel: '3SG.AN', at: '3SG.IN', emen: '1PL', dyn: '2PL', selen: '3PL.AN', atar: '3PL.IN',
  sjo: 'REFL', sjosjo: 'RECP' };
const PARTICLE_LABELS = { ne: 'NEG', ma: 'OPT', hal: 'FUT', halde: 'COND', ke: 'REL', sa: 'EVID.SEEN', sund: 'EVID.SUNG', stari: 'EVID.FATED' };

export function glossLabel(e) {
  if (!e) return '?';
  if (e.pos === 'pron' && PRON_LABELS[e.lemma]) return PRON_LABELS[e.lemma];
  if ((e.pos === 'part' || e.pos === 'conj' || e.class === 'auxiliary') && PARTICLE_LABELS[e.lemma]) return PARTICLE_LABELS[e.lemma];
  if (e.pos === 'name') return e.lemma;
  // Use the first gloss of at most three words (else the shortest one), joined with dots: "risen.corpse".
  const items = (e.gloss || ['?']).map((x) => normalizeGloss(x).replace(/,.*$/, '').split(/\s+/).filter(Boolean)).filter((w) => w.length);
  if (!items.length) return '?';
  const pick = items.find((w) => w.length <= 3) || items.reduce((a, b) => (b.length < a.length ? b : a));
  return pick.join('.');
}

// ---------- Alphabetical order (grammar/02 alphabet_order: digraphs are letters) ----------

function orderList() {
  const o = hasData() ? grammar('orthography').alphabet_order : null;
  return o && o.length ? o : DEFAULT_ORDER;
}

export function collationKey(word) {
  const order = orderList();
  const rank = new Map(order.map((l, i) => [l, i]));
  const w = String(word).toLowerCase();
  const key = [];
  let i = 0;
  while (i < w.length) {
    const two = w.slice(i, i + 2);
    if (two.length === 2 && rank.has(two)) { key.push(rank.get(two)); i += 2; continue; }
    const ch = w[i];
    if (rank.has(ch)) key.push(rank.get(ch));
    else if (/[a-z]/.test(ch)) key.push(100 + ch.charCodeAt(0));
    i++;
  }
  return key;
}

export function collate(a, b) {
  const ka = collationKey(a);
  const kb = collationKey(b);
  for (let i = 0; i < Math.min(ka.length, kb.length); i++) {
    if (ka[i] !== kb[i]) return ka[i] - kb[i];
  }
  if (ka.length !== kb.length) return ka.length - kb.length;
  return a < b ? -1 : a > b ? 1 : 0;
}

export function sortEntries(list) {
  return [...list].sort((x, y) => collate(x.lemma, y.lemma) || (x.pos < y.pos ? -1 : 1));
}

// First letter of a word in the Norsund alphabet (th, kj, gj, ng count as letters).
export function initialLetter(word) {
  const w = String(word).toLowerCase();
  const two = w.slice(0, 2);
  if (orderList().includes(two)) return two;
  return w[0] || '';
}

// search('kjo') matches lemma prefixes, then English glosses.
export function search(query, limit = 50) {
  if (!hasData()) return [];
  const q = String(query).toLowerCase().trim();
  if (!q) return [];
  const out = [];
  const seen = new Set();
  const push = (e) => { if (!seen.has(e.id)) { seen.add(e.id); out.push(e); } };
  for (const e of entries()) if (e.lemma.toLowerCase() === q) push(e);
  for (const e of lookupEnglish(q, { allowNames: true })) push(e);
  for (const e of entries()) if (e.lemma.toLowerCase().startsWith(q)) push(e);
  for (const e of entries()) if ((e.gloss || []).some((g) => g.toLowerCase().includes(q))) push(e);
  return out.slice(0, limit);
}
