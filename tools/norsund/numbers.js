// Norsund numbers (grammar/10-numbers.yaml): toNorsund(523208) -> 'thammhaun dovtamm thrim mork, dovhaun ath'
import { grammar, hasData } from './data.js';

const DEFAULT_CARD = { 1: 'yn', 2: 'dov', 3: 'thrim', 4: 'ves', 5: 'thamm', 6: 'sesk', 7: 'sev', 8: 'ath', 9: 'nyv', 10: 'tamm', 100: 'haun', 1000: 'mork' };
const DEFAULT_ORD = { 1: 'ura', 2: 'dovde', 3: 'thrimde', 4: 'veste', 5: 'thamde', 6: 'seskte', 7: 'sevde', 8: 'atte', 9: 'nyvde', 10: 'tamde' };

function tables() {
  const m = (hasData() ? grammar('numbers').morphology : null) || {};
  return {
    card: { ...DEFAULT_CARD, ...(m.cardinals || {}) },
    ord: { ...DEFAULT_ORD, ...(m.ordinals || {}) },
    starisund: { 7: 'stev', ...(m.starisund || {}) },
    long: (m.long_hundred && m.long_hundred.form) || 'langhaun',
  };
}

function unit(n, t, dialect) {
  if (dialect === 'starisund' && t.starisund[n]) return t.starisund[n];
  return t.card[n];
}

function under100(n, t, d) {
  if (n <= 10) return unit(n, t, d);
  if (n < 20) return t.card[10] + unit(n - 10, t, d);
  const tens = Math.floor(n / 10);
  const u = n % 10;
  return unit(tens, t, d) + t.card[10] + (u ? ` ${unit(u, t, d)}` : '');
}

function under1000(n, t, d) {
  const h = Math.floor(n / 100);
  const r = n % 100;
  const parts = [];
  if (h) parts.push(h === 1 ? t.card[100] : unit(h, t, d) + t.card[100]);
  if (r) parts.push(under100(r, t, d));
  return parts.join(' ');
}

export function toNorsund(n, opts = {}) {
  const num = Number(n);
  if (!Number.isInteger(num) || num < 0) throw new Error(`Only whole numbers from 0 are supported (got ${n})`);
  if (num >= 1000000) throw new Error('Norsund numbers here go up to 999,999 (no word for a million is defined yet).');
  const t = tables();
  const d = opts.dialect;
  if (num === 0) return 'nen';
  if (num < 1000) return under1000(num, t, d);
  const th = Math.floor(num / 1000);
  const r = num % 1000;
  const tpart = th === 1 ? t.card[1000] : `${under1000(th, t, d)} ${t.card[1000]}`;
  return r ? `${tpart}, ${under1000(r, t, d)}` : tpart;
}

export function ordinal(n, opts = {}) {
  const t = tables();
  if (opts.dialect === 'starisund' && n === 7) return 'stevde';
  if (t.ord[n]) return t.ord[n];
  const words = toNorsund(n, opts).replace(/,/g, '').split(' ');
  let last = words.pop();
  if (/(.)\1$/.test(last)) last = last.slice(0, -1);
  const suffix = /(s|k|t|f|th|p)$/.test(last) ? 'te' : 'de';
  return [...words, last + suffix].join(' ');
}

// parseNorsund('dovtamm sev') -> 27
export function parseNorsund(text) {
  const t = tables();
  const rev = {};
  for (const [k, v] of Object.entries(t.card)) if (Number(k) < 100) rev[v] = Number(k);
  rev.stev = 7;
  const val = (w) => {
    if (w === 'nen') return 0;
    if (w === t.long) return 120;
    if (rev[w] !== undefined) return rev[w];
    if (w === t.card[100]) return 100;
    if (w.endsWith(t.card[100])) {
      const p = w.slice(0, -t.card[100].length);
      if (rev[p] !== undefined) return rev[p] * 100;
    }
    if (w.endsWith(t.card[10]) && rev[w.slice(0, -t.card[10].length)] !== undefined) return rev[w.slice(0, -t.card[10].length)] * 10;
    if (w.startsWith(t.card[10]) && rev[w.slice(t.card[10].length)] !== undefined) return 10 + rev[w.slice(t.card[10].length)];
    throw new Error(`"${w}" is not a Norsund number word`);
  };
  let total = 0;
  let current = 0;
  for (const w of String(text).toLowerCase().replace(/,/g, ' ').split(/\s+/).filter(Boolean)) {
    if (w === t.card[1000]) { total += (current || 1) * 1000; current = 0; } else current += val(w);
  }
  return total + current;
}
