// Translation helpers.
//   gloss('Tyr kjolder murin i nimin.')        Norsund -> interlinear gloss (Leipzig style)
//   englishToNorsund('Tyr guards the wall.')   English -> Norsund, rule-based, with notes and unknown words
// The English side is a deliberately small grammar: simple clauses, one subordinate clause, the tenses,
// modals, negation, questions, possessives, adjectives, numbers, prepositions and evidential hints.
import { analyze, inflectNoun, inflectVerb, inflectAdj, inflectPronoun, isFinite, STARISUND_ANIMATE } from './morphology.js';
import { lookupEnglish, findEntry, findEntries, glossLabel } from './lexicon.js';
import { toNorsund as numberWords } from './numbers.js';

// ======================= Norsund -> gloss =======================

const EVIDENTIALS = new Set(['sa', 'sund', 'stari']);

function wordTokens(sentence) {
  return String(sentence).match(/[\p{L}'’-]+|[.,!?;:]/gu) || [];
}

function pickReading(readings, ctx) {
  if (!readings.length) return null;
  const lowerOnly = (rs) => rs.filter((r) => r.form === ctx.word || r.form.toLowerCase() === ctx.word.toLowerCase());
  let rs = lowerOnly(readings);
  if (ctx.evidentialSlot) {
    const ev = rs.find((r) => r.pos === 'part' && EVIDENTIALS.has(r.lemma));
    if (ev) return ev;
  }
  rs = rs.filter((r) => !(r.pos === 'part' && EVIDENTIALS.has(r.lemma) && !ctx.evidentialSlot && rs.length > 1));
  const exact = rs.filter((r) => r.form === ctx.word);
  if (exact.length && /^[A-Z]/.test(ctx.word)) rs = exact;
  const finite = rs.filter(isFinite);
  const nonFinite = rs.filter((r) => !isFinite(r));
  if (ctx.wantFinite && finite.length) return finite[0];
  if (!ctx.wantFinite && nonFinite.length) {
    const prefer = nonFinite.find((r) => r.pos !== 'interj' && r.pos !== 'name' && !r.compound)
      || nonFinite.find((r) => r.pos !== 'interj' && !r.compound) || nonFinite[0];
    return prefer;
  }
  return rs[0] || readings[0];
}

// gloss('Tyr kjolder murin.') -> {tokens:[{form, morphemes, gloss, lemma, pos}], morphemes, gloss, translationGuess}
export function gloss(sentence) {
  const toks = wordTokens(sentence);
  const question = /\?\s*$/.test(sentence);
  const out = [];
  let clauseIndex = 0;
  let clauseHasFinite = false;
  let clauseNo = 0;
  let prevPos = null;
  const lastWord = [...toks].reverse().find((t) => !/^[.,!?;:]$/.test(t));
  toks.forEach((t, i) => {
    if (/^[.,!?;:]$/.test(t)) {
      clauseIndex = 0; clauseHasFinite = false; clauseNo++; prevPos = null;
      if (out.length) out[out.length - 1].punct = (out[out.length - 1].punct || '') + t;
      return;
    }
    const readings = analyze(t);
    const evidentialSlot = EVIDENTIALS.has(t.toLowerCase()) && toks[i - 1] === ',' && t === lastWord;
    const isSubordinator = readings.some((r) => r.pos === 'conj' && ['ke', 'sof', 'kuna', 'thon', 'medan'].includes(r.lemma));
    const afterNounSlot = ['prep', 'det', 'adj', 'num'].includes(prevPos) || prevPos === 'pron-poss';
    let wantFinite = false;
    if (!clauseHasFinite && readings.some(isFinite) && !afterNounSlot) {
      if (clauseIndex >= 1) wantFinite = true;
      else if (question || clauseNo > 0) wantFinite = !readings.some((r) => r.pos === 'pron' || r.pos === 'name');
    }
    const r = pickReading(readings, { word: t, wantFinite, evidentialSlot, sentenceStart: i === 0 });
    if (r && isFinite(r)) clauseHasFinite = true;
    if (isSubordinator) { clauseHasFinite = false; clauseIndex = 0; }
    prevPos = r ? (r.pos === 'pron' && r.tags === 'POSS' ? 'pron-poss' : r.pos) : null;
    out.push(r
      ? { form: t, morphemes: preserveCase(t, r.morphemes), gloss: r.gloss, lemma: r.lemma, pos: r.pos, tags: r.tags, alternatives: readings.length }
      : { form: t, morphemes: t, gloss: '?', lemma: null, pos: null, alternatives: 0 });
    if (!isSubordinator) clauseIndex++;
  });
  return {
    sentence,
    tokens: out,
    morphemes: out.map((t) => t.morphemes).join(' '),
    gloss: out.map((t) => t.gloss).join(' '),
    translationGuess: guessEnglish(out),
  };
}

function preserveCase(form, morphemes) {
  if (/^[A-Z]/.test(form) && morphemes) return morphemes.charAt(0).toUpperCase() + morphemes.slice(1);
  return morphemes;
}

const PRON_EN = { '1SG': 'I', '1SG.OBJ': 'me', '1SG.POSS': 'my', '2SG': 'you', '2SG.OBJ': 'you', '2SG.POSS': 'your',
  '3SG.AN': 'she/he', '3SG.AN.OBJ': 'her/him', '3SG.AN.POSS': 'her/his', '3SG.IN': 'it', '3SG.IN.OBJ': 'it', '3SG.IN.POSS': 'its',
  '1PL': 'we', '1PL.OBJ': 'us', '1PL.POSS': 'our', '2PL': 'you', '2PL.OBJ': 'you', '2PL.POSS': 'your',
  '3PL.AN': 'they', '3PL.AN.OBJ': 'them', '3PL.AN.POSS': 'their', '3PL.IN': 'they', '3PL.IN.OBJ': 'them', '3PL.IN.POSS': 'their',
  REFL: 'oneself', RECP: 'each other', NEG: 'not', OPT: 'may', FUT: 'will', COND: 'would', REL: 'that',
  'EVID.SEEN': '(I saw it)', 'EVID.SUNG': '(so it is sung)', 'EVID.FATED': '(so the stars say)' };

function guessEnglish(tokens) {
  const words = tokens.map((t) => {
    if (!t.lemma) return `<${t.form}>`;
    if (PRON_EN[t.gloss]) return PRON_EN[t.gloss];
    const parts = String(t.gloss).split(/[-]/);
    let base = parts[0].replace(/\./g, ' ');
    const tags = parts.slice(1).join('-') + (String(t.gloss).includes('.PST') ? '-PST' : '') + (String(t.gloss).includes('.PL') ? '-PL' : '');
    base = base.replace(/ (PST|PRS|IMP|PTCP|PL|INF|CMPR|SUPL)$/, '');
    if (/DEF/.test(tags)) base = `the ${base}`;
    if (/PL/.test(tags)) base += 's';
    if (/GEN/.test(tags)) base += "'s";
    if (/PST/.test(tags)) base += ' (past)';
    if (/INF/.test(tags)) base = `to ${base}`;
    if (/CMPR/.test(tags)) base = `more ${base}`;
    if (/SUPL/.test(tags)) base = `most ${base}`;
    if (/ADV/.test(tags)) base += 'ly';
    return base;
  });
  return words.join(' ');
}

// ======================= English -> Norsund =======================

const IRREG_VERB = {
  saw: ['see', 'past'], seen: ['see', 'ptcp'], came: ['come', 'past'], fell: ['fall', 'past'], fallen: ['fall', 'ptcp'],
  went: ['go', 'past'], gone: ['go', 'ptcp'], gave: ['give', 'past'], given: ['give', 'ptcp'], took: ['take', 'past'],
  taken: ['take', 'ptcp'], said: ['say', 'past'], bound: ['bind', 'past'], broke: ['break', 'past'], broken: ['break', 'ptcp'],
  rode: ['ride', 'past'], ridden: ['ride', 'ptcp'], bit: ['bite', 'past'], bitten: ['bite', 'ptcp'], had: ['have', 'past'],
  did: ['do', 'past'], done: ['do', 'ptcp'], knew: ['know', 'past'], known: ['know', 'ptcp'], made: ['make', 'past'],
  sang: ['sing', 'past'], sung: ['sing', 'ptcp'], ran: ['run', 'past'], ate: ['eat', 'past'], eaten: ['eat', 'ptcp'],
  drank: ['drink', 'past'], drunk: ['drink', 'ptcp'], swore: ['swear', 'past'], sworn: ['swear', 'ptcp'], fought: ['fight', 'past'],
  found: ['find', 'past'], held: ['hold', 'past'], kept: ['keep', 'past'], left: ['leave', 'past'], lost: ['lose', 'past'],
  met: ['meet', 'past'], sat: ['sit', 'past'], slept: ['sleep', 'past'], spoke: ['speak', 'past'], spoken: ['speak', 'ptcp'],
  stood: ['stand', 'past'], struck: ['strike', 'past'], taught: ['teach', 'past'], thought: ['think', 'past'], told: ['tell', 'past'],
  understood: ['understand', 'past'], won: ['win', 'past'], wrote: ['write', 'past'], written: ['write', 'ptcp'],
  built: ['build', 'past'], brought: ['bring', 'past'], bought: ['buy', 'past'], caught: ['catch', 'past'], felt: ['feel', 'past'],
  flew: ['fly', 'past'], flown: ['fly', 'ptcp'], forgot: ['forget', 'past'], forgotten: ['forget', 'ptcp'], grew: ['grow', 'past'],
  grown: ['grow', 'ptcp'], heard: ['hear', 'past'], hid: ['hide', 'past'], hidden: ['hide', 'ptcp'], led: ['lead', 'past'],
  rose: ['rise', 'past'], risen: ['rise', 'ptcp'], shone: ['shine', 'past'], shot: ['shoot', 'past'], sought: ['seek', 'past'],
  sold: ['sell', 'past'], sent: ['send', 'past'], stole: ['steal', 'past'], stolen: ['steal', 'ptcp'], swam: ['swim', 'past'],
  threw: ['throw', 'past'], thrown: ['throw', 'ptcp'], woke: ['wake', 'past'], wore: ['wear', 'past'], wept: ['weep', 'past'],
  began: ['begin', 'past'], begun: ['begin', 'ptcp'], became: ['become', 'past'], blew: ['blow', 'past'], chose: ['choose', 'past'],
  drew: ['draw', 'past'], drove: ['drive', 'past'], froze: ['freeze', 'past'], hung: ['hang', 'past'], lay: ['lie', 'past'],
  rang: ['ring', 'past'], shook: ['shake', 'past'], sank: ['sink', 'past'], tore: ['tear', 'past'], crept: ['creep', 'past'],
  fed: ['feed', 'past'], fled: ['flee', 'past'], got: ['get', 'past'], meant: ['mean', 'past'], paid: ['pay', 'past'],
  slew: ['slay', 'past'], slain: ['slay', 'ptcp'], spent: ['spend', 'past'], swept: ['sweep', 'past'], wove: ['weave', 'past'],
  dug: ['dig', 'past'], bled: ['bleed', 'past'], bore: ['bear', 'past'], born: ['bear', 'ptcp'], lit: ['light', 'past'],
  burnt: ['burn', 'past'], dwelt: ['dwell', 'past'], knelt: ['kneel', 'past'], wrung: ['wring', 'past'], struck2: ['strike', 'ptcp'],
};
const IRREG_PLURAL = { people: 'person', men: 'man', women: 'woman', children: 'child', teeth: 'tooth', feet: 'foot', geese: 'goose',
  mice: 'mouse', wolves: 'wolf', knives: 'knife', lives: 'life', leaves: 'leaf', elves: 'elf', dwarves: 'dwarf', thieves: 'thief',
  halves: 'half', shelves: 'shelf', loaves: 'loaf', staves: 'staff', oxen: 'ox', hooves: 'hoof', scarves: 'scarf' };
const IRREG_ADJ = { better: ['good', 'cmpr'], best: ['good', 'supl'], worse: ['bad', 'cmpr'], worst: ['bad', 'supl'],
  more: ['much', 'cmpr'], most: ['much', 'supl'], less: ['little', 'cmpr'], least: ['little', 'supl'], well: ['good', 'ly'] };

function baseCandidates(w) {
  // Irregular readings come first: in a verb slot "saw" is the past of "see", not the verb "to saw".
  // Roles that don't allow the irregular feature (a noun can't be 'past') fall through to the literal word.
  const c = [];
  if (IRREG_VERB[w]) c.push({ base: IRREG_VERB[w][0], feat: IRREG_VERB[w][1] });
  if (IRREG_PLURAL[w]) c.push({ base: IRREG_PLURAL[w], feat: 'pl' });
  if (IRREG_ADJ[w]) c.push({ base: IRREG_ADJ[w][0], feat: IRREG_ADJ[w][1] });
  c.push({ base: w, feat: 'base' });
  const push = (base, feat) => { if (base.length >= 2) c.push({ base, feat }); };
  if (/ies$/.test(w)) push(w.slice(0, -3) + 'y', 's');
  if (/(ches|shes|sses|xes|zes|oes)$/.test(w)) push(w.slice(0, -2), 's');
  if (/s$/.test(w) && !/ss$/.test(w)) push(w.slice(0, -1), 's');
  if (/ied$/.test(w)) push(w.slice(0, -3) + 'y', 'ed');
  if (/ed$/.test(w)) { push(w.slice(0, -2), 'ed'); push(w.slice(0, -1), 'ed'); if (/(.)\1ed$/.test(w)) push(w.slice(0, -3), 'ed'); }
  if (/ing$/.test(w)) { const s = w.slice(0, -3); push(s, 'ing'); push(s + 'e', 'ing'); if (/(.)\1$/.test(s)) push(s.slice(0, -1), 'ing'); }
  if (/ier$/.test(w)) push(w.slice(0, -3) + 'y', 'cmpr');
  if (/er$/.test(w)) { push(w.slice(0, -2), 'cmpr'); push(w.slice(0, -1), 'cmpr'); if (/(.)\1er$/.test(w)) push(w.slice(0, -3), 'cmpr'); }
  if (/iest$/.test(w)) push(w.slice(0, -4) + 'y', 'supl');
  if (/est$/.test(w)) { push(w.slice(0, -3), 'supl'); push(w.slice(0, -2), 'supl'); if (/(.)\1est$/.test(w)) push(w.slice(0, -4), 'supl'); }
  if (/ily$/.test(w)) push(w.slice(0, -3) + 'y', 'ly');
  if (/ly$/.test(w)) push(w.slice(0, -2), 'ly');
  return c;
}

const FEATS = {
  noun: ['base', 's', 'pl'],
  verb: ['base', 's', 'ed', 'ing', 'past', 'ptcp'],
  adj: ['base', 'cmpr', 'supl'],
  adv: ['ly', 'base'],
};

// Finds a Norsund entry for an English word in a role: {entry, feat, base}
function lex(w, role) {
  for (const cand of baseCandidates(w)) {
    if (!FEATS[role].includes(cand.feat)) continue;
    if (role === 'adv' && cand.feat === 'ly') {
      const a = lookupEnglish(cand.base, { pos: 'adj' })[0];
      if (a) return { entry: a, feat: 'ly', base: cand.base };
      continue;
    }
    const e = lookupEnglish(cand.base, { pos: role === 'noun' ? ['noun'] : role })[0];
    if (e) return { entry: e, feat: cand.feat, base: cand.base };
  }
  return null;
}

const PRON = {
  i: { lemma: 'em', case: 'subject' }, me: { lemma: 'em', case: 'object' }, my: { lemma: 'em', case: 'possessive' }, mine: { lemma: 'em', case: 'possessive' },
  you: { lemma: 'dy', case: 'either' }, your: { lemma: 'dy', case: 'possessive' }, yours: { lemma: 'dy', case: 'possessive' },
  he: { lemma: 'sel', case: 'subject' }, him: { lemma: 'sel', case: 'object' }, his: { lemma: 'sel', case: 'possessive' },
  she: { lemma: 'sel', case: 'subject' }, her: { lemma: 'sel', case: 'object-or-possessive' }, hers: { lemma: 'sel', case: 'possessive' },
  it: { lemma: 'at', case: 'either' }, its: { lemma: 'at', case: 'possessive' },
  we: { lemma: 'emen', case: 'subject' }, us: { lemma: 'emen', case: 'object' }, our: { lemma: 'emen', case: 'possessive' }, ours: { lemma: 'emen', case: 'possessive' },
  they: { lemma: 'selen', case: 'subject' }, them: { lemma: 'selen', case: 'object' }, their: { lemma: 'selen', case: 'possessive' }, theirs: { lemma: 'selen', case: 'possessive' },
};
const REFLEXIVE = new Set(['myself', 'yourself', 'himself', 'herself', 'itself', 'ourselves', 'yourselves', 'themselves', 'oneself']);
const DETS = { the: 'def', a: 'indef', an: 'indef', this: 'hes', these: 'hes', that: 'thas', those: 'thas', every: 'al', all: 'al',
  each: 'hver', some: 'nok', no: 'no', many: 'myk', much: 'myk', few: 'lit', other: 'annar', another: 'annar' };
const NUMS = { one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10, eleven: 11, twelve: 12,
  twenty: 20, thirty: 30, hundred: 100, thousand: 1000 };
const WH = { who: 'kum', what: 'kut', where: 'kur', when: 'kuna', why: 'kuvi', how: 'kuso', which: 'kul', whom: 'kum' };
const BE = new Set(['am', 'is', 'are', 'was', 'were', 'be', 'been', 'being']);
const BE_PAST = new Set(['was', 'were']);
const DO = new Set(['do', 'does', 'did']);
const HAVE = new Set(['have', 'has', 'had']);
const MODALS = { will: 'FUT', shall: 'FUT', would: 'COND', can: 'orka', could: 'orka:past', must: 'noda', should: 'noda', may: 'lofa', might: 'lofa:past' };
const PREPS = { in: 'i', at: 'a', on: 'a', to: 've', toward: 've', towards: 've', from: 'ur', by: 'ur', under: 'fjol', beneath: 'fjol',
  below: 'fjol', underneath: 'fjol', above: 'mar', over: 'mar', with: 'hjo', beside: 'hjo', for: 'ter', through: 'thurh', around: 'ymb',
  about: 'ymb', among: 'mid', amid: 'mid', before: 'for', after: 'aft', behind: 'aft', outside: 'ute', without: 'ute', into: 'inn',
  against: 'mot', until: 'til', across: 'ova', beyond: 'ova', of: 'GEN', than: 'thon', inside: 'i', upon: 'a' };
const ADVS = { here: 'hir', there: 'thal', now: 'yt', then: 'thana', thus: 'sva', so: 'sva', also: 'ok', too: 'ok', still: 'enn',
  yet: 'enn', soon: 'snar', very: 'ful', again: 'aftar', today: 'idag', tonight: 'inim', always: 'alkuna', never: 'nekuna',
  sometimes: 'ynkuna', everywhere: 'alkur', nowhere: 'nekur', somewhere: 'ynkur', long: 'lang' };
const PRONOUN_WORDS = { everyone: 'alkum', everybody: 'alkum', everything: 'alkut', nothing: 'nekut', nobody: 'nekum', someone: 'ynkum',
  somebody: 'ynkum', something: 'ynkut' };
const FRONT_ADVS = new Set(['then', 'now', 'today', 'tonight', 'here', 'there', 'always', 'never', 'sometimes', 'soon', 'thus', 'so']);
const TIME_NOUNS = new Set(['night', 'day', 'dawn', 'dusk', 'morning', 'evening', 'winter', 'summer', 'spring', 'autumn', 'noon']);
const SAY_VERBS = new Set(['know', 'say', 'think', 'see', 'hear', 'believe', 'swear', 'tell', 'feel', 'fear', 'hope', 'remember', 'forget',
  'show', 'learn', 'understand', 'dream', 'promise', 'sing', 'write', 'find', 'read']);
const SUBORDINATORS = { if: 'sof', because: 'ter ke', when: 'kuna', while: 'medan', before: 'for ke', after: 'aft ke' };
const CONJ = { and: 'eth', but: 'ava', or: 'vo' };

function etok(sentence) {
  const raw = String(sentence).replace(/[“”]/g, '"').replace(/’/g, "'").match(/[A-Za-z]+(?:'[A-Za-z]+)?|\d+|[.,!?;:]/g) || [];
  const out = [];
  raw.forEach((r, i) => {
    const low = r.toLowerCase();
    const push = (w, orig = w) => out.push({ w, orig, cap: /^[A-Z]/.test(orig), first: out.length === 0, punct: /^[.,!?;:]$/.test(w) });
    const m = low.match(/^([a-z]+)'([a-z]+)$/);
    if (m) {
      const [, a, b] = m;
      if (low === "can't") { push('can'); push('not'); return; }
      if (low === "won't") { push('will'); push('not'); return; }
      if (b === 't' && a.endsWith('n')) { push(a.slice(0, -1)); push('not'); return; }
      if (b === 's' && ['it', 'he', 'she', 'that', 'there', 'what', 'who', 'where', 'here', 'how'].includes(a)) { push(a, r.split("'")[0]); push('is'); return; }
      if (b === 's') { push(a, r.split("'")[0]); push("'s"); return; }
      if (b === 'm') { push(a, r.split("'")[0]); push('am'); return; }
      if (b === 're') { push(a, r.split("'")[0]); push('are'); return; }
      if (b === 'll') { push(a, r.split("'")[0]); push('will'); return; }
      if (b === 've') { push(a, r.split("'")[0]); push('have'); return; }
      if (b === 'd') { push(a, r.split("'")[0]); push('would'); return; }
    }
    if (low === 'cannot') { push('can', r.slice(0, 3)); push('not'); return; }
    if (low.endsWith("s'")) { push(low.slice(0, -1), r.slice(0, -1)); push("'s"); return; }
    push(low, r);
    void i;
  });
  return out;
}

function W(form, morphemes, glossStr) {
  return { form, morphemes: morphemes || form, gloss: glossStr || form };
}

function closed(lemma, pos) {
  const e = findEntry(lemma, pos) || findEntry(lemma);
  return e;
}

function closedWord(lemma, pos) {
  const e = closed(lemma, pos);
  return W(lemma, lemma, e ? glossLabel(e) : lemma);
}

class Ctx {
  constructor(opts) {
    this.opts = opts;
    this.notes = [];
    this.unknown = [];
  }
  unk(w) { if (!this.unknown.includes(w)) this.unknown.push(w); return W(`<${w}>`, `<${w}>`, '?'); }
  note(n) { if (!this.notes.includes(n)) this.notes.push(n); }
}

// ---------- English parsing ----------

function isNameToken(t, i) {
  if (!t.cap) return false;
  if (findEntries(t.orig, 'name').length || findEntries(t.orig).some((e) => /^[A-Z]/.test(e.lemma))) return true;
  if (i === 0 || t.first) return false;
  return true;
}

function startsNP(toks, i) {
  const t = toks[i];
  if (!t || t.punct) return false;
  if (DETS[t.w] || PRON[t.w] || REFLEXIVE.has(t.w) || NUMS[t.w] || /^\d+$/.test(t.w) || PRONOUN_WORDS[t.w]) return true;
  if (isNameToken(t, i)) return true;
  if (t.w === 'each' && toks[i + 1] && toks[i + 1].w === 'other') return true;
  return Boolean(lex(t.w, 'noun') || lex(t.w, 'adj'));
}

// Multi-word English glosses ("free sword", "night guard") matched as one noun.
function phraseNoun(toks, k) {
  for (const len of [3, 2]) {
    const seq = toks.slice(k, k + len);
    if (seq.length < len || seq.some((t) => t.punct)) continue;
    const words = seq.map((t) => t.w);
    const last = words[len - 1];
    for (const cand of baseCandidates(last)) {
      if (!['base', 's', 'pl'].includes(cand.feat)) continue;
      const phrase = [...words.slice(0, -1), cand.base].join(' ');
      const hit = lookupEnglish(phrase, { pos: 'noun' })[0];
      if (hit) return { hit: { entry: hit, feat: cand.feat, base: phrase }, plural: cand.feat !== 'base', end: k + len };
    }
  }
  return null;
}

// Reads a noun phrase starting at i. Returns {np, end}.
function readNP(toks, i, ctx) {
  const np = { det: null, possPron: null, possessor: null, num: null, quant: null, adjs: [], head: null, plural: false, neg: false, words: [] };
  let k = i;
  const t0 = toks[k];
  if (!t0) return { np: null, end: i };
  if (t0.w === 'each' && toks[k + 1] && toks[k + 1].w === 'other') return { np: { pronoun: 'sjosjo', reflexive: true }, end: k + 2 };
  if (REFLEXIVE.has(t0.w)) return { np: { pronoun: 'sjo', reflexive: true }, end: k + 1 };
  if (PRONOUN_WORDS[t0.w]) return { np: { closedPron: PRONOUN_WORDS[t0.w] }, end: k + 1 };
  if (PRON[t0.w] && PRON[t0.w].case !== 'possessive' && !(t0.w === 'her' && toks[k + 1] && lex(toks[k + 1].w, 'noun'))) {
    return { np: { pronoun: PRON[t0.w].lemma, pronCase: PRON[t0.w].case, english: t0.w }, end: k + 1 };
  }
  for (; k < toks.length; k++) {
    const t = toks[k];
    if (!t || t.punct) break;
    if (np.head) break;
    if (DETS[t.w] && !np.det && !np.possPron && !np.adjs.length) {
      const d = DETS[t.w];
      if (d === 'no') np.neg = true;
      else if (['al', 'hver', 'nok', 'myk', 'lit', 'annar'].includes(d)) np.quant = d;
      else np.det = d;
      if (['these', 'those'].includes(t.w)) np.plural = true;
      continue;
    }
    if (PRON[t.w] && (PRON[t.w].case === 'possessive' || PRON[t.w].case === 'object-or-possessive') && !np.adjs.length) { np.possPron = PRON[t.w].lemma; continue; }
    if (NUMS[t.w] || /^\d+$/.test(t.w)) { np.num = NUMS[t.w] || Number(t.w); if (np.num > 1) np.plural = true; continue; }
    if (isNameToken(t, k)) {
      np.head = { name: t.orig };
      continue;
    }
    const phrase = phraseNoun(toks, k);
    if (phrase) {
      np.head = { noun: phrase.hit };
      if (phrase.plural) np.plural = true;
      k = phrase.end - 1;
      continue;
    }
    const next = toks[k + 1];
    const nounHit = lex(t.w, 'noun');
    const adjHit = lex(t.w, 'adj');
    const nextContinues = next && !next.punct && (lex(next.w, 'noun') || lex(next.w, 'adj') || isNameToken(next, k + 1)) && !PREPS[next.w] && !BE.has(next.w) && !DO.has(next.w) && !HAVE.has(next.w) && !MODALS[next.w];
    if (adjHit && (nextContinues || !nounHit)) {
      if (!nextContinues && !np.det && !np.possPron && !np.num && !np.quant) break; // a bare adjective is not a noun phrase
      np.adjs.push(adjHit);
      continue;
    }
    if (nounHit) {
      np.head = { noun: nounHit };
      if (nounHit.feat === 's' || nounHit.feat === 'pl') np.plural = true;
      continue;
    }
    break;
  }
  if (!np.head && !np.adjs.length && !np.det && !np.possPron && !np.num && !np.quant) {
    // unknown open-class word used as a noun
    const t = toks[i];
    if (t && !t.punct && !PREPS[t.w] && !BE.has(t.w) && !DO.has(t.w) && !HAVE.has(t.w) && !MODALS[t.w] && !CONJ[t.w]) {
      return { np: { unknown: t.w }, end: i + 1 };
    }
    return { np: null, end: i };
  }
  if (!np.head && (np.det || np.possPron || np.num || np.quant) && toks[k] && !toks[k].punct && !PREPS[toks[k].w] && !BE.has(toks[k].w)) {
    np.head = { unknown: toks[k].w };
    k++;
  }
  // possessive 's: the NP so far owns the next NP
  if (toks[k] && toks[k].w === "'s") {
    const owned = readNP(toks, k + 1, ctx);
    if (owned.np) {
      owned.np.possessor = np;
      return { np: owned.np, end: owned.end };
    }
  }
  // of-genitive: "the edge of the blade" -> the blade's edge
  if (toks[k] && toks[k].w === 'of' && startsNP(toks, k + 1)) {
    const owner = readNP(toks, k + 1, ctx);
    if (owner.np) {
      np.possessor = owner.np;
      return { np, end: owner.end };
    }
  }
  return { np, end: k };
}

function verbLex(t) {
  if (!t || t.punct) return null;
  if (BE.has(t.w) || DO.has(t.w) || MODALS[t.w]) return null;
  return lex(t.w, 'verb');
}

function parseClause(toks, ctx, mode = 'main') {
  const c = { subject: null, aux: [], neg: false, verb: null, objects: [], predicate: null, comparison: null, agent: null,
    adjuncts: [], wh: null, whRole: null, existential: false, optative: false, imperative: false, front: null, toInf: false };
  let i = 0;
  const n = toks.length;
  if (mode === 'main' && toks[0] && toks[0].w === 'may' && startsNP(toks, 1)) { c.optative = true; i = 1; }
  if (toks[i] && toks[i].w === 'there' && toks[i + 1] && BE.has(toks[i + 1].w)) { c.existential = true; c.aux.push(toks[i + 1].w); i += 2; }
  if (mode === 'main' && toks[i] && WH[toks[i].w]) {
    c.wh = toks[i].w === 'how' && toks[i + 1] && ['many', 'much'].includes(toks[i + 1].w) ? 'kumik' : WH[toks[i].w];
    i += c.wh === 'kumik' ? 2 : 1;
  }
  if (mode === 'main' && !c.wh && !c.optative && toks[i] && FRONT_ADVS.has(toks[i].w) && !(toks[i].w === 'there' && BE.has((toks[i + 1] || {}).w)) && toks.length > i + 2) {
    c.front = { adv: ADVS[toks[i].w] };
    i++;
  }
  // imperative: begins with a verb (or don't + verb) and no subject
  if (mode === 'main' && !c.wh && !c.optative && !c.front) {
    let j = i;
    if (toks[j] && toks[j].w === 'do' && toks[j + 1] && toks[j + 1].w === 'not') { j += 2; c.neg = true; }
    if (toks[j] && !toks[j].punct && !toks[j].cap && verbLex(toks[j]) && !PRON[toks[j].w] && !DETS[toks[j].w] && (j > i || !lex(toks[j].w, 'noun') || ctx.forceImperative)) {
      c.imperative = true;
      c.verb = verbLex(toks[j]);
      i = j + 1;
    } else if (j > i) { c.neg = false; }
  }
  while (i < n) {
    const t = toks[i];
    if (t.punct) { i++; continue; }
    if (t.w === 'not' || t.w === 'never') { if (t.w === 'never') c.adjuncts.push({ adv: 'nekuna' }); else c.neg = true; i++; continue; }
    if (!c.verb && !c.predicate && (BE.has(t.w) || DO.has(t.w) || MODALS[t.w] || (HAVE.has(t.w) && toks[i + 1] && (verbLex(toks[i + 1]) || toks[i + 1].w === 'not' || (toks[i + 1].w && startsNP(toks, i + 1) && !c.subject && mode === 'main' && /\?/.test(ctx.punct)))))) {
      c.aux.push(t.w);
      i++;
      continue;
    }
    if (t.w === 'to' && toks[i + 1] && verbLex(toks[i + 1]) && c.verb) { c.toInf = true; c.verb2 = verbLex(toks[i + 1]); i += 2; continue; }
    if (t.w === 'than' && startsNP(toks, i + 1)) { const r = readNP(toks, i + 1, ctx); c.comparison = r.np; i = r.end; continue; }
    if (t.w === 'as' && toks[i + 1] && lex(toks[i + 1].w, 'adj') && toks[i + 2] && toks[i + 2].w === 'as') {
      const r = readNP(toks, i + 3, ctx);
      c.predicate = { adj: lex(toks[i + 1].w, 'adj'), equative: r.np };
      i = r.end;
      continue;
    }
    if (PREPS[t.w] && t.w !== 'of') {
      const r = readNP(toks, i + 1, ctx);
      if (r.np) {
        const isAgent = t.w === 'by' && c.verb && ['ed', 'ptcp', 'past'].includes(c.verb.feat) && c.aux.some((a) => BE.has(a));
        if (isAgent) c.agent = r.np;
        else c.adjuncts.push({ prep: PREPS[t.w], np: r.np, english: t.w });
        i = r.end;
        continue;
      }
    }
    if (ADVS[t.w] && !startsNP(toks, i)) { c.adjuncts.push({ adv: ADVS[t.w] }); i++; continue; }
    const lyAdv = /ly$/.test(t.w) ? lex(t.w, 'adv') : null;
    if (lyAdv && lyAdv.feat === 'ly' && !lex(t.w, 'adj')) { c.adjuncts.push({ advFromAdj: lyAdv }); i++; continue; }
    const needSubject = !c.subject && !c.imperative && !(c.wh && (c.verb || !c.aux.length) && !startsNP(toks, i));
    // subject first (statements) or after the auxiliary (questions)
    if (!c.subject && !c.verb && !c.imperative && startsNP(toks, i) && !(c.wh && !c.aux.length && verbLex(t) && !PRON[t.w])) {
      const r = readNP(toks, i, ctx);
      if (r.np) { c.subject = r.np; i = r.end; continue; }
    }
    void needSubject;
    if (!c.verb) {
      const v = verbLex(t);
      const copulaPred = c.aux.some((a) => BE.has(a)) && !v;
      if (v && !(c.aux.some((a) => BE.has(a)) && lex(t.w, 'adj') && !['ing', 'ed', 'ptcp'].includes(v.feat))) {
        c.verb = v;
        i++;
        continue;
      }
      if (copulaPred || c.aux.some((a) => BE.has(a))) {
        const a = lex(t.w, 'adj');
        if (a && !startsNP(toks, i + 1)) { c.predicate = { adj: a }; i++; continue; }
        if (startsNP(toks, i)) { const r = readNP(toks, i, ctx); if (r.np) { c.predicate = { np: r.np }; i = r.end; continue; } }
      }
    }
    if (c.verb && !c.objects.length && t.w === 'that' && SAY_VERBS.has(c.verb.base)) break;
    if (startsNP(toks, i)) {
      const r = readNP(toks, i, ctx);
      if (r.np) {
        if (c.verb || c.imperative) c.objects.push(r.np);
        else if (c.aux.some((a) => BE.has(a)) && !c.predicate) c.predicate = { np: r.np };
        else if (!c.subject) c.subject = r.np;
        else c.objects.push(r.np);
        i = r.end;
        continue;
      }
    }
    if (CONJ[t.w]) { c.adjuncts.push({ conj: CONJ[t.w] }); i++; continue; }
    c.adjuncts.push({ unknown: t.w });
    i++;
  }
  return c;
}

// ---------- Norsund generation ----------

function dialectFor(ctx) { return ctx.opts.dialect || 'common'; }

function renderNP(np, role, ctx) {
  if (!np) return [];
  const out = [];
  if (np.unknown) return [ctx.unk(np.unknown)];
  if (np.closedPron) return [closedWord(np.closedPron, 'pron')];
  if (np.pronoun) {
    let lemma = np.pronoun;
    if (np.reflexive) return [closedWord(lemma, 'pron')];
    if (lemma === 'dy' && (ctx.opts.pluralYou || ctx.opts.politeYou)) lemma = 'dyn';
    const e = findEntry(lemma, 'pron');
    if (!e) return [ctx.unk(np.english || lemma)];
    const which = role === 'possessive' ? 'possessive' : role === 'subject' ? 'subject' : 'object';
    const r = inflectPronoun(e, which);
    if (np.english === 'they' || np.english === 'them' || np.english === 'their') ctx.note('English "they" was taken as living beings (selen); use atar for things.');
    if (np.english === 'he' || np.english === 'she' || np.english === 'him' || np.english === 'her') ctx.note('Norsund sel covers he, she and singular they (no gender).');
    return [W(r.form, r.morphemes, r.gloss)];
  }
  if (np.possessor) out.push(...renderNP(np.possessor, 'possessive', ctx));
  if (np.possPron) {
    let lemma = np.possPron;
    if (lemma === 'dy' && (ctx.opts.pluralYou || ctx.opts.politeYou)) lemma = 'dyn';
    const e = findEntry(lemma, 'pron');
    const r = inflectPronoun(e, 'possessive');
    out.push(W(r.form, r.morphemes, r.gloss));
  }
  if (np.det === 'hes' || np.det === 'thas') out.push(closedWord(np.det, 'det'));
  if (np.quant) out.push(closedWord(np.quant, 'det'));
  if (np.num) {
    const words = numberWords(np.num, { dialect: dialectFor(ctx) }).split(' ');
    for (const w of words) out.push(W(w.replace(',', ''), w.replace(',', ''), String(np.num)));
  }
  for (const a of np.adjs) {
    const which = a.feat === 'cmpr' ? 'cmpr' : a.feat === 'supl' ? 'supl' : 'base';
    const r = inflectAdj(a.entry, which);
    out.push(W(r.form, r.morphemes, r.gloss));
  }
  const possessed = Boolean(np.possessor || np.possPron);
  const definite = !possessed && (np.det === 'def' || np.det === 'hes' || np.det === 'thas' || (np.timeDef));
  const genitive = role === 'possessive';
  if (np.head && np.head.name) {
    const e = findEntries(np.head.name).find((x) => /^[A-Z]/.test(x.lemma)) || null;
    if (e) {
      const r = inflectNoun(e, { number: 'sg', definite: np.det === 'def' && e.pos !== 'name', genitive });
      out.push(W(r.form, r.morphemes, r.gloss));
    } else {
      const form = genitive ? np.head.name + (/[aeiouy]$/i.test(np.head.name) ? 's' : 'i') : np.head.name;
      out.push(W(form, genitive ? `${np.head.name}-${form.slice(np.head.name.length)}` : form, genitive ? `${np.head.name}-GEN` : np.head.name));
    }
  } else if (np.head && np.head.noun) {
    const r = inflectNoun(np.head.noun.entry, { number: np.plural ? 'pl' : 'sg', definite, genitive, dialect: dialectFor(ctx) });
    out.push(W(r.form, r.morphemes, r.gloss));
    if (np.head.noun.entry.lemma === 'star' && np.plural && dialectFor(ctx) !== 'starisund') ctx.note('In Starisund (Auristar) stars are living beings: staren, starene. Use --dialect starisund.');
  } else if (np.head && np.head.unknown) {
    out.push(ctx.unk(np.head.unknown));
  } else if (np.adjs.length && !np.head) {
    // adjective used as a noun: the brave -> thiolene
    const a = out.pop();
    const adjEntry = np.adjs[np.adjs.length - 1].entry;
    const which = np.det === 'def' ? 'nomDefPl' : 'nomPl';
    const r = inflectAdj(adjEntry, which);
    out.push(W(r.form, r.morphemes, r.gloss));
    void a;
  }
  return out;
}

function verbEntryFor(lemma) {
  return findEntry(lemma, 'verb');
}

function vform(entry, which) {
  const r = inflectVerb(entry, which);
  return r ? W(r.form, r.morphemes, r.gloss) : W(entry.lemma);
}

// Works out the finite and non-finite Norsund verb words for a parsed clause.
function verbGroup(c, ctx) {
  const aux = c.aux;
  const past = aux.includes('did') || aux.some((a) => BE_PAST.has(a)) || aux.includes('had') || aux.includes('could') || aux.includes('might')
    || (!aux.length && c.verb && (c.verb.feat === 'past' || c.verb.feat === 'ed'));
  const tense = past ? 'pst' : 'prs';
  const modalWord = aux.find((a) => MODALS[a]);
  const hasBe = aux.some((a) => BE.has(a)) || c.existential;
  const hasHave = aux.some((a) => HAVE.has(a));
  const vesa = verbEntryFor('vesa');
  const finite = [];
  const nonfinite = [];
  let main = c.verb ? c.verb.entry : null;
  let mainFeat = c.verb ? c.verb.feat : null;
  // "want to ride" / "need to ride": the English main verb is a modal in Norsund
  if (c.toInf && c.verb2 && c.verb && ['want', 'need', 'wish'].includes(c.verb.base)) {
    const modal = findEntry(c.verb.base === 'want' || c.verb.base === 'wish' ? 'thursa' : 'noda', 'verb');
    finite.push(vform(modal, past && aux.length === 0 && ['ed', 'past'].includes(c.verb.feat) ? 'pst' : tense));
    nonfinite.push(vform(c.verb2.entry, 'inf'));
    return { finite, nonfinite };
  }
  if (c.imperative) {
    finite.push(vform(main, 'imp'));
    return { finite, nonfinite, imperative: true };
  }
  if (c.optative) {
    finite.push(closedWord('ma', 'part'));
    nonfinite.push(main ? vform(main, 'inf') : vform(vesa, 'inf'));
    return { finite, nonfinite, optative: true };
  }
  let lead = null; // FUT/COND/modal entry
  if (modalWord) {
    const m = MODALS[modalWord];
    if (m === 'FUT') lead = closedWord('hal', 'verb');
    else if (m === 'COND') lead = closedWord('halde', 'verb');
    else {
      const [lemma, t] = m.split(':');
      lead = vform(findEntry(lemma, 'verb'), t === 'past' ? 'pst' : 'prs');
    }
  }
  const passive = hasBe && main && ['ed', 'ptcp'].includes(mainFeat);
  const perfect = hasHave && main && ['ed', 'ptcp', 'past'].includes(mainFeat);
  const progressive = hasBe && main && mainFeat === 'ing';
  if (progressive) ctx.note('English "-ing" was translated with the simple tense; use vesa + -ande (es kjoldande) to stress an action in progress.');
  if (!main && !aux.length && !c.existential && !lead) return { finite, nonfinite, fragment: true };
  if (!main) {
    // copula (or existential)
    if (lead) { finite.push(lead); nonfinite.push(vform(vesa, 'inf')); } else finite.push(vform(vesa, tense));
    return { finite, nonfinite, copula: true };
  }
  if (passive) {
    if (lead) { finite.push(lead); nonfinite.push(vform(vesa, 'inf')); } else finite.push(vform(vesa, tense));
    nonfinite.push(vform(main, 'ptcp'));
    return { finite, nonfinite, passive: true };
  }
  if (perfect) {
    const aga = findEntry('aga', 'verb');
    if (lead) { finite.push(lead); nonfinite.push(vform(aga, 'inf')); } else finite.push(vform(aga, aux.includes('had') ? 'pst' : 'prs'));
    nonfinite.push(vform(main, 'ptcp'));
    return { finite, nonfinite };
  }
  if (lead) { finite.push(lead); nonfinite.push(vform(main, 'inf')); return { finite, nonfinite }; }
  const t2 = progressive ? (aux.some((a) => BE_PAST.has(a)) ? 'pst' : 'prs') : tense;
  finite.push(vform(main, t2));
  return { finite, nonfinite };
}

function renderAdjunct(a, ctx) {
  if (a.adv) return [closedWord(a.adv, 'adv')];
  if (a.conj) return [closedWord(a.conj, 'conj')];
  if (a.unknown) return [ctx.unk(a.unknown)];
  if (a.advFromAdj) { const r = inflectAdj(a.advFromAdj.entry, 'adv'); return [W(r.form, r.morphemes, r.gloss)]; }
  if (a.prep) {
    let prep = a.prep;
    const np = a.np;
    // "at night", "in the night" -> i nimin
    const headNoun = np && np.head && np.head.noun;
    if (headNoun && TIME_NOUNS.has(headNoun.base) && ['at', 'in', 'by', 'on'].includes(a.english) && !np.possessor && !np.possPron) {
      prep = 'i';
      np.timeDef = true;
    }
    return [closedWord(prep, 'prep'), ...renderNP(np, 'object', ctx)];
  }
  return [];
}

function predicateWords(c, ctx) {
  const out = [];
  if (c.predicate) {
    if (c.predicate.adj) {
      const a = c.predicate.adj;
      if (c.predicate.equative) {
        out.push(closedWord('sam', 'det'), W(a.entry.lemma, a.entry.lemma, glossLabel(a.entry)), closedWord('sam', 'det'), ...renderNP(c.predicate.equative, 'subject', ctx));
      } else {
        const r = inflectAdj(a.entry, a.feat === 'cmpr' ? 'cmpr' : a.feat === 'supl' ? 'supl' : 'base');
        out.push(W(r.form, r.morphemes, r.gloss));
      }
    } else if (c.predicate.np) out.push(...renderNP(c.predicate.np, 'subject', ctx));
  }
  if (c.comparison) out.push(closedWord('thon', 'conj'), ...renderNP(c.comparison, 'subject', ctx));
  return out;
}

function hasNegNP(c) {
  return Boolean((c.subject && c.subject.neg) || c.objects.some((o) => o.neg));
}

function whWord(c) {
  return closedWord(c.wh, ['kur', 'kuna', 'kuvi', 'kuso', 'kumik'].includes(c.wh) ? 'adv' : c.wh === 'kul' ? 'det' : 'pron');
}

// Builds the Norsund word list for a clause in the right order.
function generateClause(c, ctx, mode = 'main', opts = {}) {
  const vg = verbGroup(c, ctx);
  const neg = c.neg || hasNegNP(c) ? [closedWord('ne', 'part')] : [];
  const subj = c.subject ? renderNP(c.subject, 'subject', ctx) : [];
  const objs = c.objects.flatMap((o) => renderNP(o, 'object', ctx));
  const pred = predicateWords(c, ctx);
  const agent = c.agent ? [closedWord('ur', 'prep'), ...renderNP(c.agent, 'object', ctx)] : [];
  const adj = c.adjuncts.flatMap((a) => renderAdjunct(a, ctx));
  const rest = [...vg.nonfinite, ...objs, ...pred, ...agent];
  if (mode === 'sub') return [...subj, ...neg, ...vg.finite, ...rest, ...adj];
  if (vg.imperative) return [...neg, ...vg.finite, ...objs, ...pred, ...adj];
  if (vg.optative) return [...vg.finite, ...subj, ...neg, ...rest, ...adj];
  if (c.existential) {
    const firstPP = c.adjuncts.findIndex((a) => a.prep);
    const subjectNP = c.subject ? subj : objs.length ? objs : pred;
    if (firstPP >= 0) {
      const pp = renderAdjunct(c.adjuncts[firstPP], ctx);
      const others = c.adjuncts.filter((_, k) => k !== firstPP).flatMap((a) => renderAdjunct(a, ctx));
      ctx.note('"There is" puts the place first (SYN-08): I murin es run.');
      return [...pp, ...vg.finite, ...subjectNP, ...neg, ...others];
    }
    return [closedWord('at', 'pron'), ...vg.finite, ...subjectNP, ...neg, ...adj];
  }
  if (c.wh) {
    const whSubject = !c.subject;
    if (whSubject) return [whWord(c), ...vg.finite, ...neg, ...rest, ...adj];
    return [whWord(c), ...vg.finite, ...subj, ...neg, ...rest, ...adj];
  }
  if (opts.question) return [...vg.finite, ...subj, ...neg, ...rest, ...adj];
  if (opts.front || c.front) {
    const front = opts.front || [closedWord(c.front.adv, 'adv')];
    return [...front, ...vg.finite, ...subj, ...neg, ...rest, ...adj];
  }
  if (!subj.length && !vg.finite.length) return [...objs, ...pred, ...adj];
  return [...subj, ...vg.finite, ...neg, ...rest, ...adj];
}

// Strips evidential frames from the English and returns the particle to add.
function evidentialFrame(toks) {
  const words = toks.map((t) => t.w);
  const starts = (seq) => seq.every((w, k) => words[k] === w);
  const frames = [
    [['i', 'saw', 'that'], 'sa'], [['i', 'witnessed', 'that'], 'sa'],
    [['they', 'say', 'that'], 'sund'], [['it', 'is', 'said', 'that'], 'sund'], [['the', 'songs', 'say', 'that'], 'sund'], [['they', 'sing', 'that'], 'sund'],
    [['it', 'is', 'foretold', 'that'], 'stari'], [['the', 'stars', 'say', 'that'], 'stari'], [['it', 'is', 'fated', 'that'], 'stari'],
  ];
  for (const [seq, p] of frames) if (starts(seq)) return { toks: toks.slice(seq.length), particle: p };
  const tails = [
    [[',', 'so', 'the', 'stars', 'say'], 'stari'], [[',', 'so', 'it', 'is', 'sung'], 'sund'], [[',', 'so', 'the', 'songs', 'say'], 'sund'],
    [[',', 'i', 'saw', 'it'], 'sa'], [[',', 'it', 'is', 'foretold'], 'stari'],
  ];
  for (const [seq, p] of tails) {
    const tail = words.slice(-seq.length);
    if (seq.every((w, k) => tail[k] === w)) return { toks: toks.slice(0, -seq.length), particle: p };
  }
  return { toks, particle: null };
}

function joinWords(words, punct, capitalize = true) {
  const forms = words.map((w) => w.form);
  let s = forms.join(' ').replace(/\s+,/g, ',');
  if (s && capitalize) s = s.charAt(0).toUpperCase() + s.slice(1);
  return s + (punct || '');
}

// englishToNorsund('Tyr guards the wall.') -> {norsund:'Tyr kjolder murin.', gloss:'Tyr guard-PRS wall-DEF', notes:[], unknown:[]}
// opts: dialect ('common'|'starisund'), pluralYou, politeYou
export function englishToNorsund(sentence, opts = {}) {
  const ctx = new Ctx(opts);
  let toks = etok(sentence);
  const punctMatch = String(sentence).trim().match(/[.!?]$/);
  const punct = punctMatch ? punctMatch[0] : '';
  ctx.punct = punct;
  toks = toks.filter((t, k) => !(t.punct && t.w !== ',' && k === toks.length - 1));
  const ev = evidentialFrame(toks);
  toks = ev.toks;
  if (toks[0]) toks[0].first = true;
  const question = punct === '?';
  let words = [];
  // fronted phrase: "Beneath the star, ..." / "At night, ..."
  let front = null;
  const commaAt = toks.findIndex((t) => t.w === ',');
  if (toks[0] && PREPS[toks[0].w] && toks[0].w !== 'of' && commaAt > 0) {
    const pre = parseClause(toks.slice(0, commaAt), ctx, 'frag');
    front = pre.adjuncts.flatMap((a) => renderAdjunct(a, ctx));
    toks = toks.slice(commaAt + 1);
  }
  // fronted subordinate clause: "If I were brave, I would ride."
  let lead = [];
  if (toks[0] && SUBORDINATORS[toks[0].w] && commaAt > 0 && !front) {
    const sub = parseClause(toks.slice(1, commaAt), ctx, 'sub');
    lead = [closedWord(SUBORDINATORS[toks[0].w], 'conj'), ...generateClause(sub, ctx, 'sub'), W(',', ',', ',')];
    toks = toks.slice(commaAt + 1);
    ctx.note('After a fronted subordinate clause the main clause keeps its normal order, as in VERB-04.');
  }
  // split off one subordinate or complement clause
  let split = -1;
  let subWord = null;
  for (let k = 1; k < toks.length; k++) {
    const t = toks[k];
    if (t.w === 'that' && k > 0) {
      const prev = toks[k - 1];
      const prevVerb = lex(prev.w, 'verb');
      if (prevVerb && SAY_VERBS.has(prevVerb.base)) { split = k; subWord = 'ke'; break; }
      const prevNoun = lex(prev.w, 'noun') || isNameToken(prev, k - 1);
      if (prevNoun && toks[k + 1] && (verbLex(toks[k + 1]) || toks[k + 1].w === 'not' || DO.has(toks[k + 1].w) || BE.has(toks[k + 1].w) || startsNP(toks, k + 1))) { split = k; subWord = 'rel'; break; }
    }
    if ((t.w === 'who' || t.w === 'which') && k > 0 && (lex(toks[k - 1].w, 'noun') || isNameToken(toks[k - 1], k - 1))) { split = k; subWord = 'rel'; break; }
    if (SUBORDINATORS[t.w] && k > 1 && !PREPS[t.w]) { split = k; subWord = SUBORDINATORS[t.w]; break; }
    if ((t.w === 'before' || t.w === 'after') && startsNP(toks, k + 1) && toks.slice(k + 1).some((x) => verbLex(x) || BE.has(x.w))) { split = k; subWord = SUBORDINATORS[t.w]; break; }
  }
  let main;
  let tail = [];
  if (split > 0) {
    const mainToks = toks.slice(0, split);
    const subToks = toks.slice(split + 1);
    main = parseClause(mainToks, ctx, 'main');
    if (subWord === 'rel') {
      const sub = parseClause(subToks, ctx, 'sub');
      tail = [closedWord('ke', 'conj'), ...generateClause(sub, ctx, 'sub')];
    } else {
      const sub = parseClause(subToks, ctx, 'sub');
      tail = [closedWord(subWord, 'conj'), ...generateClause(sub, ctx, 'sub')];
    }
  } else {
    main = parseClause(toks, ctx, 'main');
  }
  words = [...lead, ...generateClause(main, ctx, 'main', { question, front }), ...tail];
  if (ev.particle) {
    words.push(W(',', ',', ','), closedWord(ev.particle, 'part'));
    ctx.note(`Evidential ${ev.particle}: ${{ sa: 'the speaker saw it', sund: 'it is reported or sung', stari: 'it is foretold' }[ev.particle]}.`);
  }
  const glossWords = words.filter((w) => w.form !== ',');
  const norsund = joinWords(words, punct, /^[A-Z]/.test(String(sentence).trim()) || Boolean(punct));
  return {
    english: sentence,
    norsund,
    morphemes: glossWords.map((w) => w.morphemes).join(' '),
    gloss: glossWords.map((w) => w.gloss).join(' '),
    words: glossWords,
    notes: ctx.notes,
    unknown: ctx.unknown,
  };
}

export { baseCandidates as englishBaseCandidates };
