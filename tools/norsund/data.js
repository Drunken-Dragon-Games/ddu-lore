// Shared data holder for the Norsund engine. Browser-safe: no file system access here.
// In Node, call loadNorsund() from ./node.js; in a browser, fetch norsund.json and call setData().

let DATA = null;
const listeners = [];

export function setData(data) {
  DATA = data;
  for (const fn of listeners) fn(data);
  return data;
}

export function hasData() {
  return DATA !== null;
}

export function getData() {
  if (!DATA) throw new Error('Norsund data is not loaded. Call setData(json) or loadNorsund() first.');
  return DATA;
}

// Register a cache-reset callback that runs whenever new data is loaded.
export function onData(fn) {
  listeners.push(fn);
}

// grammar('phonology') returns the parsed records/languages/norsund/grammar/01-phonology.yaml
export function grammar(name) {
  return (getData().grammar || {})[name] || {};
}

export function entries() {
  return (getData().dictionary || {}).entries || [];
}

const INHERITED = ['layer', 'epoch', 'tier', 'status', 'field', 'language'];

// Flattens a lang-dictionary/v1 document: applies file `defaults`, expands `derived` sub-entries
// (which inherit layer, epoch, tier, status and field from their parent) and normalizes gloss to a list.
export function flattenDictionary(doc, file, usedIds = new Map()) {
  const out = [];
  if (!doc || !Array.isArray(doc.entries)) return out;
  const defaults = doc.defaults || {};
  const visit = (raw, parent, path) => {
    if (!raw || typeof raw !== 'object') return;
    const base = { ...defaults, field: doc.field || defaults.field, language: doc.language || 'norsund' };
    if (parent) for (const k of INHERITED) if (parent[k] !== undefined) base[k] = parent[k];
    if (parent && !('pos' in raw)) delete base.pos;
    const e = { ...base, ...raw };
    delete e.derived;
    e.lemma = e.lemma === undefined || e.lemma === null ? '' : String(e.lemma);
    if (typeof e.gloss === 'string') e.gloss = [e.gloss];
    if (!Array.isArray(e.gloss)) e.gloss = e.gloss ? [String(e.gloss)] : [];
    e.gloss = e.gloss.map(String);
    if (e.parts && !Array.isArray(e.parts)) e.parts = [String(e.parts)];
    if (e.attested && !Array.isArray(e.attested)) e.attested = [String(e.attested)];
    e.file = file;
    e.where = path;
    e.parent = parent ? parent.id : null;
    const baseId = `${e.language}:${e.lemma}#${e.pos || '?'}`;
    const n = (usedIds.get(baseId) || 0) + 1;
    usedIds.set(baseId, n);
    e.id = n === 1 ? baseId : `${baseId}${n}`;
    out.push(e);
    (raw.derived || []).forEach((d, i) => visit(d, e, `${path}.derived[${i}]`));
  };
  doc.entries.forEach((raw, i) => visit(raw, null, `entries[${i}]`));
  return out;
}
