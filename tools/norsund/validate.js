// Validator for the language records (lang-grammar/v1, lang-dictionary/v1, lang-text/v1, lang-script/v1, fact-record/v1).
// Browser-safe: it works on already-parsed documents ({path, doc, error}).
import { flattenDictionary } from './data.js';
import { validateForm, useInventory } from './phonology.js';

export const ENUMS = {
  pos: ['noun', 'verb', 'adj', 'adv', 'pron', 'det', 'prep', 'conj', 'part', 'num', 'interj', 'affix', 'name'],
  nounClass: ['animate', 'inanimate'],
  verbClass: ['weak', 'strong', 'irregular', 'modal', 'auxiliary'],
  layer: ['native', 'kedre', 'kedre-learned', 'old-norsund', 'foreign', 'other', 'proto-valian'],
  epoch: ['proto', 'old', 'contact', 'modern'],
  register: ['common', 'starisund', 'old', 'poetic', 'learned', 'cant', 'sacred', 'kullmyr', 'nurmyr', 'farheim', 'carved', 'slang', 'formal', 'child'],
  tier: ['core', 'common', 'sandbox'],
  status: ['proposed', 'ratified'],
};

const DOC_TYPES = ['fact-record/v1', 'lang-grammar/v1', 'lang-dictionary/v1', 'lang-text/v1', 'lang-script/v1', 'culture/v1', 'bestiary-record/v1'];
const PHONO_LAYERS = new Set(['native', 'old-norsund']);

function isForeignName(e) {
  if (/['’]/.test(e.lemma)) return true;
  if (e.layer && !PHONO_LAYERS.has(e.layer)) return true;
  // a part written with a capital (Kharak, Val) comes from another language
  if ((e.parts || []).some((p) => /^[A-Z]/.test(String(p)))) return true;
  return false;
}

export function validateEntry(e, report, opts = {}) {
  const at = `${e.file}: ${e.where} (${e.lemma || '?'})`;
  const err = (m) => report.errors.push({ file: e.file, where: e.where, lemma: e.lemma, message: m, at });
  const warn = (m) => report.warnings.push({ file: e.file, where: e.where, lemma: e.lemma, message: m, at });
  if (!e.lemma) err('missing lemma');
  if (!e.pos) err('missing pos');
  else if (!ENUMS.pos.includes(e.pos)) err(`pos "${e.pos}" is not one of ${ENUMS.pos.join(', ')}`);
  if (!e.gloss.length || e.gloss.some((g) => !String(g).trim())) err('missing gloss');
  const isNorsund = (e.language || 'norsund') === 'norsund';
  if (e.class !== undefined && !isNorsund) {
    // other languages (Kedre conjugations such as -are, -ire) define their own classes
  } else if (e.class !== undefined) {
    if (e.pos === 'noun' || e.pos === 'name') { if (!ENUMS.nounClass.includes(e.class)) err(`class "${e.class}" must be animate or inanimate for a ${e.pos}`); } else if (e.pos === 'verb') { if (!ENUMS.verbClass.includes(e.class)) err(`verb class "${e.class}" must be one of ${ENUMS.verbClass.join(', ')}`); } else warn(`class "${e.class}" is ignored for pos ${e.pos}`);
  } else if (e.pos === 'noun' && (e.language || 'norsund') === 'norsund') err('nouns need class: animate or inanimate');
  for (const k of ['layer', 'epoch', 'register', 'tier', 'status']) {
    if (k === 'layer' && /^[a-z-]+-loan$/.test(String(e[k]))) continue;
    if (e[k] !== undefined && e[k] !== null && !ENUMS[k].includes(e[k])) err(`${k} "${e[k]}" is not one of ${ENUMS[k].join(', ')}`);
  }
  if (e.pos === 'verb' && e.class !== 'auxiliary' && e.lemma && !/a$/.test(e.lemma) && (e.language || 'norsund') === 'norsund') err('verb infinitives end in -a');
  if (e.forms !== undefined && (typeof e.forms !== 'object' || Array.isArray(e.forms))) err('forms must be a mapping');
  if (opts.phonotactics !== false && (e.language || 'norsund') === 'norsund' && e.pos !== 'affix' && e.lemma && !isForeignName(e)) {
    for (const word of e.lemma.split(/\s+/)) {
      const r = validateForm(word);
      if (!r.ok) {
        if (e.register === 'cant' || e.tier === 'sandbox') r.errors.forEach((m) => warn(`phonotactics: ${m}`));
        else r.errors.forEach((m) => err(`phonotactics: ${m}`));
      }
    }
  }
}

export function validateFiles(files, opts = {}) {
  const report = { errors: [], warnings: [], counts: { files: files.length, entries: 0, texts: 0, lines: 0, rules: 0 } };
  const fileErr = (file, m) => report.errors.push({ file, where: '', message: m, at: file });
  const fileWarn = (file, m) => report.warnings.push({ file, where: '', message: m, at: file });
  const seen = new Map();
  const ruleIds = new Map();
  const usedIds = new Map();
  const phon = files.find((f) => f.doc && f.doc.document === 'lang-grammar/v1' && f.doc.language === 'norsund' && /phonology/i.test(String(f.doc.topic)));
  if (phon) useInventory(phon.doc);
  for (const f of files) {
    if (f.error) { fileErr(f.path, `YAML could not be parsed: ${f.error}`); continue; }
    const d = f.doc;
    if (!d || typeof d !== 'object') { fileErr(f.path, 'file is empty or not a mapping'); continue; }
    if (!d.document) { fileErr(f.path, 'missing "document" header'); continue; }
    if (!DOC_TYPES.includes(d.document) && !/^[a-z-]+\/v\d+$/.test(d.document)) fileWarn(f.path, `unknown document type "${d.document}"`);
    const isLang = /^lang-/.test(d.document);
    if (isLang && !d.language && d.document !== 'lang-script/v1') fileErr(f.path, 'language records need a "language" field');
    if (isLang && !d.version) fileWarn(f.path, 'no "version" field');
    if (d.document === 'lang-grammar/v1') {
      if (!d.topic) fileErr(f.path, 'grammar records need a "topic"');
      (d.rules || []).forEach((r, i) => {
        report.counts.rules++;
        if (!r || !r.id) { fileErr(f.path, `rules[${i}] has no id`); return; }
        if (!r.rule && !r.title) fileErr(f.path, `rule ${r.id} has no text`);
        const key = `${d.language}:${r.id}`;
        if (ruleIds.has(key)) fileErr(f.path, `rule id ${r.id} is also used in ${ruleIds.get(key)}`);
        else ruleIds.set(key, f.path);
      });
    }
    if (d.document === 'lang-dictionary/v1') {
      if (!Array.isArray(d.entries)) { fileErr(f.path, 'dictionary records need an "entries" list'); continue; }
      const flat = flattenDictionary(d, f.path, usedIds);
      for (const e of flat) {
        report.counts.entries++;
        validateEntry(e, report, opts);
        const key = `${e.language}|${e.lemma}|${e.pos}|${e.class || ''}`;
        if (seen.has(key)) {
          const other = seen.get(key);
          report.errors.push({ file: e.file, where: e.where, lemma: e.lemma, at: `${e.file}: ${e.where} (${e.lemma})`,
            message: `duplicate: "${e.lemma}" (${e.pos}${e.class ? `, ${e.class}` : ''}) is already defined in ${other.file} ${other.where}` });
        } else seen.set(key, e);
      }
    }
    if (d.document === 'lang-text/v1') {
      const texts = Array.isArray(d.texts) ? d.texts : null;
      if (!texts) { fileErr(f.path, 'text records need a "texts" list'); continue; }
      texts.forEach((t, ti) => {
        report.counts.texts++;
        if (!t || !t.id) fileWarn(f.path, `texts[${ti}] has no id`);
        if (!Array.isArray(t && t.lines)) { fileErr(f.path, `texts[${ti}] has no lines`); return; }
        t.lines.forEach((l, li) => {
          report.counts.lines++;
          const where = `texts[${ti}].lines[${li}]`;
          if (!l || !l.text) fileErr(f.path, `${where} has no text`);
          if (!l || !l.translation) fileErr(f.path, `${where} has no translation`);
          if (l && l.morphemes && l.gloss) {
            const m = String(l.morphemes).trim().split(/\s+/).length;
            const g = String(l.gloss).trim().split(/\s+/).length;
            if (m !== g) fileErr(f.path, `${where}: morphemes has ${m} words but gloss has ${g}`);
            const mw = String(l.morphemes).trim().split(/\s+/);
            const gw = String(l.gloss).trim().split(/\s+/);
            mw.forEach((w, k) => {
              if (gw[k] && w.split('-').length !== gw[k].split('-').length) fileWarn(f.path, `${where}: "${w}" and "${gw[k]}" have different numbers of morphemes`);
            });
          } else if (l && !l.gloss) fileWarn(f.path, `${where} has no gloss`);
        });
      });
    }
    if (d.document === 'lang-script/v1' && !d.script) fileErr(f.path, 'script records need a "script" field');
  }
  return report;
}

export function formatReport(report, { verbose = false } = {}) {
  const lines = [];
  for (const e of report.errors) lines.push(`ERROR   ${e.at}: ${e.message}`);
  if (verbose) for (const w of report.warnings) lines.push(`warning ${w.at}: ${w.message}`);
  const c = report.counts;
  lines.push(`${c.files} files, ${c.entries} dictionary entries, ${c.rules} grammar rules, ${c.texts} texts (${c.lines} lines): `
    + `${report.errors.length} errors, ${report.warnings.length} warnings${verbose ? '' : ' (use --verbose to list warnings)'}`);
  return lines.join('\n');
}
