// Copied from tools/norsund/soundchange.js by tools/build.mjs. Edit the original, then run node build.mjs.
// Sound-change applier for grammar/13-history.yaml (Proto-Valian > Proto-Norsund > Old Norsund > Norsund, and > Kedre).
//
// Rule notation (env, unless): space-separated items.
//   _        the changing segment(s)
//   #        word edge
//   V C F L N  categories from the `categories` block (any key works)
//   [a b]    a set of segments
//   x?  x+  x*   optional / one or more / zero or more (works on categories, sets and single segments)
// Rules apply simultaneously: every match is found on the input to the rule, then all are replaced.
import { grammar, hasData } from './data.js';

export function historyData(override) {
  return override || (hasData() ? grammar('history') : {});
}

export function makeTokenizer(segments = []) {
  const segs = [...segments].sort((a, b) => b.length - a.length);
  return (word) => {
    const w = String(word).replace(/^\*/, '').toLowerCase();
    const out = [];
    let i = 0;
    while (i < w.length) {
      const hit = segs.find((s) => w.startsWith(s, i));
      if (hit) { out.push(hit); i += hit.length; } else if (w[i] === ' ' || w[i] === '-') { i++; } else { out.push(w[i]); i++; }
    }
    return out;
  };
}

// Parses "_ L? C u" into {left:[...], right:[...]}
export function parseEnv(env, categories = {}) {
  const items = String(env || '_').match(/\[[^\]]*\][?+*]?|\S+/g) || ['_'];
  const parsed = items.map((raw) => {
    if (raw === '_') return { type: 'target' };
    if (raw === '#') return { type: 'edge' };
    let base = raw;
    let q = '';
    if (raw.length > 1 && /[?+*]$/.test(raw)) { q = raw.slice(-1); base = raw.slice(0, -1); }
    if (base.startsWith('[')) return { type: 'set', values: base.slice(1, -1).trim().split(/\s+/), q };
    if (Object.prototype.hasOwnProperty.call(categories, base)) return { type: 'cat', values: categories[base], q, name: base };
    return { type: 'lit', values: [base], q };
  });
  const t = parsed.findIndex((p) => p.type === 'target');
  if (t < 0) throw new Error(`Rule environment "${env}" has no "_"`);
  return { left: parsed.slice(0, t), right: parsed.slice(t + 1) };
}

// Match a list of items against tokens starting at position p and moving in direction dir.
function matchItems(items, tokens, p, dir) {
  const go = (k, pos) => {
    if (k === items.length) return true;
    const it = items[k];
    if (it.type === 'edge') return (dir > 0 ? pos === tokens.length : pos === -1) && go(k + 1, pos);
    const ok = (q) => q >= 0 && q < tokens.length && it.values.includes(tokens[q]);
    if (!it.q) return ok(pos) && go(k + 1, pos + dir);
    if (it.q === '?') return (ok(pos) && go(k + 1, pos + dir)) || go(k + 1, pos);
    let n = 0;
    while (ok(pos + n * dir)) n++;
    const min = it.q === '+' ? 1 : 0;
    for (let c = n; c >= min; c--) if (go(k + 1, pos + c * dir)) return true;
    return false;
  };
  return go(0, p);
}

function envMatches(env, tokens, start, len) {
  return matchItems([...env.left].reverse(), tokens, start - 1, -1) && matchItems(env.right, tokens, start + len, 1);
}

function splitSeq(s) {
  return String(s).trim() === '' ? [] : String(s).trim().split(/\s+/);
}

// Applies one rule to a token list; returns the new token list.
export function applyRule(rule, tokens, categories = {}) {
  const env = parseEnv(rule.env, categories);
  const unless = rule.unless ? parseEnv(rule.unless, categories) : null;
  const froms = (rule.from || []).map(splitSeq);
  const tos = (rule.to || []).map((x) => splitSeq(x === null ? '' : x));
  const out = [];
  let i = 0;
  while (i < tokens.length) {
    let done = false;
    for (let k = 0; k < froms.length; k++) {
      const f = froms[k];
      if (!f.length) continue;
      if (!f.every((seg, j) => tokens[i + j] === seg)) continue;
      if (!envMatches(env, tokens, i, f.length)) continue;
      if (unless && envMatches(unless, tokens, i, f.length)) continue;
      out.push(...(tos[k] !== undefined ? tos[k] : tos[tos.length - 1] || []));
      i += f.length;
      done = true;
      break;
    }
    if (!done) { out.push(tokens[i]); i++; }
  }
  return out;
}

export function romanize(tokens, path = 'norsund') {
  let s = '';
  tokens.forEach((t, i) => {
    if (t === 'j' && tokens[i - 1] === 'th') { s += 'i'; return; }
    if (t === 'ei' && i === tokens.length - 1 && path !== 'kedre') { s += 'ay'; return; }
    if (path === 'kedre' && t === 'k' && tokens[i + 1] === 's') { s += 'x'; return; }
    if (path === 'kedre' && t === 's' && tokens[i - 1] === 'k') return;
    s += t;
  });
  return s;
}

// evolve('*telu') -> {result:'thiol', steps:[{stage, rule, before, after}], ...}
export function evolve(form, pathName = 'norsund', data) {
  const h = historyData(data);
  const categories = h.categories || {};
  const tokenizer = makeTokenizer(h.segments || []);
  const path = (h.paths || {})[pathName];
  if (!path) throw new Error(`Unknown path "${pathName}". Paths: ${Object.keys(h.paths || {}).join(', ')}`);
  let tokens = tokenizer(form);
  const steps = [];
  for (const stageId of path) {
    const stage = (h.stages || []).find((s) => s.id === stageId);
    if (!stage) throw new Error(`Unknown stage "${stageId}"`);
    for (const rule of stage.rules || []) {
      const next = applyRule(rule, tokens, categories);
      if (next.join(' ') !== tokens.join(' ')) {
        steps.push({ stage: stage.id, rule: rule.id, name: rule.name, before: tokens.join(' '), after: next.join(' ') });
      }
      tokens = next;
    }
  }
  return { input: form, path: pathName, tokens, steps, result: romanize(tokens, pathName === 'kedre' ? 'kedre' : 'norsund') };
}

export function paths(data) {
  return Object.keys(historyData(data).paths || {});
}
