// Copied from tools/norsund/morphology.js by tools/build.mjs. Edit the original, then run node build.mjs.
// Norsund inflection and analysis, driven by the morphology tables in grammar/03..06 and 09.
import { grammar, entries, hasData, onData } from './data.js';
import { findEntries, findEntry, glossLabel } from './lexicon.js';
import { syllableCount, validateForm } from './phonology.js';

let ANALYZER = null;
onData(() => { ANALYZER = null; });

// Lemmas that are animate in Starisund (NOUN-01, NOUN-09).
export const STARISUND_ANIMATE = new Set(['star', 'Auristar', 'Norstar']);

const VOWELS = /[aeiouy]$/;

function isEStem(word) {
  return /e$/.test(word) && syllableCount(word) >= 2;
}
function endsInVowel(word) {
  return VOWELS.test(word.toLowerCase());
}

function nounTables() {
  return (hasData() ? grammar('nouns').morphology : null) || {
    animate: { plural: 'en', definite: 'in', definite_plural: 'ene' },
    inanimate: { plural: 'ar', definite: 'in', definite_plural: 'arne' },
    genitive: { after_consonant: 'i', after_vowel: 's' },
    umlaut_plurals: [],
  };
}

// Adds a suffix that begins with a vowel, following NOUN-02/04 stem rules.
function addSuffix(stem, suffix) {
  const s = stem;
  if (isEStem(s) && /^[ea]/.test(suffix)) return s + suffix.slice(1); // rie + ar = rier, rie + in = rien
  if (/a$/.test(s) && /^a/.test(suffix)) return s + suffix.slice(1); // kelda + ar = keldar (avoids a long aa)
  if (endsInVowel(s) && suffix === 'in') return s + 'n'; // nay + in = nayn
  return s + suffix;
}

export function genitive(form) {
  const g = nounTables().genitive || { after_consonant: 'i', after_vowel: 's' };
  return form + (endsInVowel(form) ? g.after_vowel : g.after_consonant);
}

export function isAnimate(entry, dialect = 'common') {
  if (!entry) return false;
  if (dialect === 'starisund' && STARISUND_ANIMATE.has(entry.lemma)) return true;
  if (dialect === 'kullmyr' && entry.lemma === 'run') return true;
  return entry.class === 'animate';
}

// nounForms(entry) -> {sg, pl, def, defpl, ...} with the boundaries kept for glossing
export function nounForms(entry, dialect = 'common') {
  const lemma = entry.lemma;
  const anim = isAnimate(entry, dialect);
  const t = nounTables();
  const set = anim ? t.animate : t.inanimate;
  const f = entry.forms || {};
  const uml = (t.umlaut_plurals || []).find((u) => u.singular === lemma);
  const plural = f.plural || (uml && uml.plural) || null;
  const pl = plural || addSuffix(lemma, set.plural);
  const def = f.definite || addSuffix(lemma, set.definite);
  const defpl = f.definite_plural || (plural ? plural + (anim ? 'ene' : 'arne') : addSuffix(lemma, set.definite_plural));
  return {
    animate: anim,
    irregularPlural: Boolean(plural),
    sg: lemma, pl, def, defpl,
    gen: genitive(lemma), plgen: genitive(pl), defgen: genitive(def), defplgen: genitive(defpl),
  };
}

// ---------- Verbs ----------

function verbTables() {
  const m = (hasData() ? grammar('verbs').morphology : null) || {};
  return {
    weak: m.weak || { infinitive: 'a', present: 'er', past: 'ade', participle: 'ad', present_participle: 'ande', verbal_noun: 'ning', agent: 'ir' },
    strong: m.strong || [],
    irregular: m.irregular || [],
    strongPart: m.strong_participle || 'en',
  };
}

export function verbStem(lemma) {
  return /a$/.test(lemma) ? lemma.slice(0, -1) : lemma;
}

export function verbForms(entry) {
  const lemma = entry.lemma;
  const kind = entry.class || 'weak';
  const t = verbTables();
  const w = t.weak;
  if (kind === 'auxiliary') {
    return { kind, inf: lemma, prs: lemma, pst: lemma, ptcp: null, prsptcp: null, imp: null, vn: null, agt: null, invariable: true };
  }
  const stem = verbStem(lemma);
  const table = [...t.strong, ...t.irregular].find((v) => v.infinitive === lemma) || {};
  const f = { ...table, ...(entry.forms || {}) };
  const vowelStem = endsInVowel(stem);
  const weak = {
    prs: vowelStem ? stem + 'r' : stem + w.present,
    pst: vowelStem ? stem + 'de' : stem + w.past,
    ptcp: vowelStem ? stem + 'd' : stem + w.participle,
  };
  return {
    kind,
    stem,
    inf: lemma,
    prs: f.present || weak.prs,
    pst: f.past || weak.pst,
    ptcp: f.participle || (kind === 'strong' || kind === 'irregular' ? stem + t.strongPart : weak.ptcp),
    prsptcp: stem + w.present_participle,
    // 06-verbs imperative_epenthesis: wandra > wandre! when the bare stem ends in an illegal cluster
    imp: f.imperative || (validateForm(stem).ok ? stem : stem + 'e'),
    vn: validateForm(stem + w.verbal_noun).ok ? stem + w.verbal_noun : `${stem}e${w.verbal_noun}`,
    agt: stem + w.agent,
    strongPast: Boolean(f.past) || kind === 'strong' || kind === 'irregular',
  };
}

// ---------- Adjectives ----------

function adjTables() {
  const m = (hasData() ? grammar('adjectives-adverbs').morphology : null) || {};
  return {
    comparative: m.comparative || 'ar',
    superlative: m.superlative || 'ast',
    adverb: m.adverb || 't',
    irregular: m.irregular_comparison || [],
    irregularAdverbs: m.irregular_adverbs || [],
  };
}

export function adjForms(entry) {
  const base = entry.lemma;
  const t = adjTables();
  const irr = t.irregular.find((x) => x.base === base) || {};
  const iadv = t.irregularAdverbs.find((x) => x.base === base) || {};
  const f = { ...irr, ...(entry.forms || {}) };
  const aEnd = /a$/.test(base);
  return {
    base,
    cmpr: f.comparative || (aEnd ? base + 'r' : base + t.comparative),
    supl: f.superlative || (aEnd ? base + 'st' : base + t.superlative),
    // 04-adjectives adverb_epenthesis: -et where -t would make an illegal ending (lang > langet)
    adv: f.adverb || iadv.adverb || (validateForm(base + t.adverb).ok ? base + t.adverb : `${base}e${t.adverb}`),
    nomDef: addSuffix(base, 'in'),
    nomPl: addSuffix(base, 'en'),
    nomDefPl: addSuffix(base, 'ene'),
    irregular: Boolean(irr.base),
  };
}

// ---------- Inflect one form with gloss segmentation ----------

function seg(stem, suffix) {
  return suffix ? `${stem}-${suffix}` : stem;
}

function suffixOf(form, stem) {
  return form.startsWith(stem) ? form.slice(stem.length) : null;
}

// inflectNoun(entry, {number:'pl', definite:true, genitive:false}) -> {form, morphemes, gloss}
export function inflectNoun(entry, opts = {}) {
  const dialect = opts.dialect || 'common';
  const nf = nounForms(entry, dialect);
  const label = glossLabel(entry);
  const an = nf.animate ? 'AN' : 'IN';
  const pl = opts.number === 'pl';
  const def = Boolean(opts.definite);
  let form;
  let tag = '';
  if (pl && def) { form = nf.defpl; tag = `DEF.PL.${an}`; } else if (pl) { form = nf.pl; tag = `PL.${an}`; } else if (def) { form = nf.def; tag = 'DEF'; } else form = nf.sg;
  let morphemes;
  let gloss;
  if (pl && nf.irregularPlural) {
    morphemes = def && form.startsWith(nf.pl) ? `${nf.pl}-${form.slice(nf.pl.length)}` : form;
    gloss = def ? `${label}.PL-DEF.PL.${an}` : `${label}.PL`;
  } else if (tag && form.startsWith(entry.lemma) && form.length > entry.lemma.length) {
    morphemes = seg(entry.lemma, suffixOf(form, entry.lemma));
    gloss = `${label}-${tag}`;
  } else if (tag) {
    morphemes = form;
    gloss = `${label}.${tag}`;
  } else {
    morphemes = form;
    gloss = label;
  }
  let tags = tag;
  if (opts.genitive) {
    const g = genitive(form);
    morphemes += `-${g.slice(form.length)}`;
    gloss += '-GEN';
    tags = tags ? `${tags}-GEN` : 'GEN';
    form = g;
  }
  return { form, morphemes, gloss, tags, entry };
}

const VERB_TAG = { inf: 'INF', prs: 'PRS', pst: 'PST', ptcp: 'PTCP', prsptcp: 'PRS.PTCP', imp: 'IMP', vn: 'VN', agt: 'AGT' };

// inflectVerb(entry, 'pst') -> {form:'kjoldade', morphemes:'kjold-ade', gloss:'guard-PST'}
export function inflectVerb(entry, which = 'prs') {
  const vf = verbForms(entry);
  const label = glossLabel(entry);
  if (vf.invariable) return { form: entry.lemma, morphemes: entry.lemma, gloss: label, entry };
  const form = vf[which];
  if (!form) return null;
  const tag = VERB_TAG[which];
  const stem = vf.stem;
  if (which === 'imp') return { form, morphemes: form, gloss: `${label}.IMP`, entry };
  if (form.startsWith(stem) && form.length > stem.length) {
    const s = form.slice(stem.length);
    return { form, morphemes: `${stem}-${s}`, gloss: `${label}-${tag}`, entry };
  }
  if (which === 'ptcp' && /en$/.test(form)) return { form, morphemes: `${form.slice(0, -2)}-en`, gloss: `${label}-PTCP`, entry };
  if (which === 'prs' && /er$/.test(form)) return { form, morphemes: `${form.slice(0, -2)}-er`, gloss: `${label}-PRS`, entry };
  return { form, morphemes: form, gloss: `${label}.${tag}`, entry };
}

const ADJ_TAG = { cmpr: 'CMPR', supl: 'SUPL', adv: 'ADV' };

export function inflectAdj(entry, which = 'base') {
  const af = adjForms(entry);
  const label = glossLabel(entry);
  if (which === 'base') return { form: af.base, morphemes: af.base, gloss: label, entry };
  const form = af[which];
  const tag = ADJ_TAG[which] || ({ nomDef: 'DEF', nomPl: 'PL.AN', nomDefPl: 'DEF.PL.AN' })[which];
  if (form.startsWith(af.base) && !af.irregular) return { form, morphemes: `${af.base}-${form.slice(af.base.length)}`, gloss: `${label}-${tag}`, entry };
  return { form, morphemes: form, gloss: `${label}.${tag}`, entry };
}

export function pronounForms(entry) {
  const f = entry.forms || {};
  return { subject: entry.lemma, object: f.object || entry.lemma, possessive: f.possessive || null };
}

export function inflectPronoun(entry, which = 'subject') {
  const pf = pronounForms(entry);
  const label = glossLabel(entry);
  const form = pf[which] || entry.lemma;
  const g = which === 'object' ? `${label}.OBJ` : which === 'possessive' ? `${label}.POSS` : label;
  return { form, morphemes: form, gloss: g, entry };
}

// ---------- Paradigms ----------

export function paradigm(lemmaOrEntry, opts = {}) {
  const list = typeof lemmaOrEntry === 'string' ? findEntries(lemmaOrEntry) : [lemmaOrEntry];
  return list.map((e) => {
    const rows = [];
    if (e.pos === 'noun' || e.pos === 'name') {
      const nf = nounForms(e, opts.dialect);
      rows.push(['singular', nf.sg], ['plural', nf.pl], ['definite', nf.def], ['definite plural', nf.defpl],
        ['genitive', nf.gen], ['definite genitive', nf.defgen], ['plural genitive', nf.plgen], ['definite plural genitive', nf.defplgen]);
      if (STARISUND_ANIMATE.has(e.lemma) && opts.dialect !== 'starisund') {
        const sf = nounForms(e, 'starisund');
        rows.push(['Starisund plural (animate)', sf.pl], ['Starisund definite plural', sf.defpl]);
      }
    } else if (e.pos === 'verb') {
      const vf = verbForms(e);
      if (vf.invariable) rows.push(['form', e.lemma]);
      else rows.push(['infinitive', vf.inf], ['present', vf.prs], ['past', vf.pst], ['participle', vf.ptcp],
        ['present participle', vf.prsptcp], ['command', vf.imp], ['verbal noun', vf.vn], ['agent noun', vf.agt]);
    } else if (e.pos === 'adj') {
      const af = adjForms(e);
      rows.push(['base', af.base], ['comparative', af.cmpr], ['superlative', af.supl], ['adverb', af.adv],
        ['as a noun (the one)', af.nomDef], ['as a noun (ones)', af.nomPl], ['as a noun (the ones)', af.nomDefPl]);
    } else if (e.pos === 'pron') {
      const pf = pronounForms(e);
      rows.push(['subject', pf.subject], ['object', pf.object]);
      if (pf.possessive) rows.push(['possessive', pf.possessive]);
    } else {
      rows.push(['form', e.lemma]);
    }
    return { entry: e, rows };
  });
}

// ---------- Analysis (generate every form, then look up) ----------

function addReading(map, r) {
  const key = r.form.toLowerCase();
  if (!map.has(key)) map.set(key, []);
  const list = map.get(key);
  if (!list.some((x) => x.entry === r.entry && x.gloss === r.gloss)) list.push(r);
}

function readingsFor(e) {
  const out = [];
  const push = (r, tags) => { if (r && r.form) out.push({ ...r, lemma: e.lemma, pos: e.pos, class: e.class, tags, id: e.id }); };
  if (e.lemma.includes(' ')) {
    push({ form: e.lemma, morphemes: e.lemma.replace(/ /g, '_'), gloss: glossLabel(e), entry: e }, '');
    return out;
  }
  if (e.pos === 'noun' || e.pos === 'name') {
    const dialects = STARISUND_ANIMATE.has(e.lemma) ? ['common', 'starisund'] : e.lemma === 'run' ? ['common', 'kullmyr'] : ['common'];
    for (const d of dialects) {
      for (const number of ['sg', 'pl']) {
        for (const definite of [false, true]) {
          for (const gen of [false, true]) {
            const r = inflectNoun(e, { number, definite, genitive: gen, dialect: d });
            push(r, r.tags + (d !== 'common' && number === 'pl' ? ` (${d})` : ''));
          }
        }
      }
    }
  } else if (e.pos === 'verb') {
    const vf = verbForms(e);
    if (vf.invariable) push({ form: e.lemma, morphemes: e.lemma, gloss: glossLabel(e), entry: e }, '');
    else for (const k of Object.keys(VERB_TAG)) push(inflectVerb(e, k), VERB_TAG[k]);
  } else if (e.pos === 'adj') {
    const T = { base: '', cmpr: 'CMPR', supl: 'SUPL', adv: 'ADV', nomDef: 'DEF', nomPl: 'PL.AN', nomDefPl: 'DEF.PL.AN' };
    for (const k of Object.keys(T)) push(inflectAdj(e, k), T[k]);
  } else if (e.pos === 'pron') {
    const T = { subject: '', object: 'OBJ', possessive: 'POSS' };
    for (const k of Object.keys(T)) if (pronounForms(e)[k]) push(inflectPronoun(e, k), T[k]);
  } else {
    push({ form: e.lemma, morphemes: e.lemma, gloss: glossLabel(e), entry: e }, '');
    const f = e.forms || {};
    for (const [k, v] of Object.entries(f)) if (typeof v === 'string' && v && !v.includes(' ')) push({ form: v, morphemes: v, gloss: `${glossLabel(e)}.${k.toUpperCase()}`, entry: e }, k);
  }
  return out;
}

function analyzer() {
  if (ANALYZER) return ANALYZER;
  const map = new Map();
  for (const e of entries()) for (const r of readingsFor(e)) addReading(map, r);
  ANALYZER = map;
  return map;
}

// analyze('kjolder') -> [{lemma:'kjolda', pos:'verb', morphemes:'kjold-er', gloss:'guard-PRS', ...},
//                        {lemma:'kjolder', pos:'noun', gloss:'sentry', ...}]
export function analyze(form) {
  const clean = String(form).replace(/[.,!?;:"“”()]/g, '');
  if (!clean) return [];
  const map = analyzer();
  const found = [...(map.get(clean.toLowerCase()) || [])];
  // NOUN-08: Starisund vocative -a on a title or animate noun (Lysa! "O Light!", Kyra!, Fyra!)
  if (/a$/i.test(clean) && clean.length > 2) {
    const stem = clean.slice(0, -1);
    for (const r of map.get(stem.toLowerCase()) || []) {
      if (r.pos !== 'noun' && r.pos !== 'name') continue;
      if (r.tags && r.tags !== '') continue;
      if (!(r.entry && (r.entry.class === 'animate' || /^[A-Z]/.test(r.entry.lemma)))) continue;
      found.push({ ...r, form: clean, tags: 'VOC', morphemes: `${stem}-a`, gloss: `${r.gloss}-VOC`, vocative: true });
    }
    // a capitalized form is most likely the vocative
    if (/^[A-Z]/.test(clean)) found.sort((a, b) => (b.vocative ? 1 : 0) - (a.vocative ? 1 : 0));
  }
  if (found.length) {
    // exact-case readings first (Lys the title before lys "light")
    return [...found].sort((a, b) => (b.form === clean) - (a.form === clean));
  }
  return analyzeCompound(clean, map);
}

function analyzeCompound(word, map) {
  const w = word.toLowerCase();
  const out = [];
  for (let i = 2; i <= w.length - 2; i++) {
    const left = w.slice(0, i);
    const right = w.slice(i);
    const rights = map.get(right);
    if (!rights) continue;
    const lefts = [left, left.replace(/i$/, ''), left + 'a', left + 'e'];
    for (const l of lefts) {
      const le = findEntries(l).filter((e) => e.pos !== 'part');
      if (!le.length) continue;
      for (const r of rights) {
        out.push({ ...r, form: word, lemma: word, compound: true, parts: [l, r.lemma],
          morphemes: `${left}-${r.morphemes}`, gloss: `${glossLabel(le[0])}-${r.gloss}` });
      }
      break;
    }
    if (out.length) break;
  }
  return out;
}

export function isFinite(reading) {
  if (!reading) return false;
  if (reading.pos === 'verb' && (reading.tags === 'PRS' || reading.tags === 'PST')) return true;
  if (reading.pos === 'verb' && reading.class === 'auxiliary') return true;
  return false;
}
