// Norsund Workbench: browser UI over the Norsund engine (./norsund/index.js) and the built data (./data/norsund.json).
// No framework and no build step: plain ES modules, so it runs from any static server and as a claude.ai Artifact.
import * as N from './norsund/index.js';

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const safe = (fn, fallback = '') => { try { return fn(); } catch { return fallback; } };
const debounce = (fn, ms = 160) => { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); }; };
const fmt = (n) => Number(n).toLocaleString('en-US');

const TABS = ['dictionary', 'translate', 'write', 'names', 'sounds', 'numbers', 'texts', 'grammar'];
const POS_LABEL = { noun: 'noun', verb: 'verb', adj: 'adjective', adv: 'adverb', pron: 'pronoun', det: 'determiner', prep: 'preposition',
  conj: 'conjunction', part: 'particle', num: 'number', interj: 'interjection', affix: 'affix', name: 'name' };
const LAYER_LABEL = { native: 'native', kedre: 'Kedre loan', 'kedre-learned': 'learned Kedre', 'old-norsund': 'Old Norsund', foreign: 'foreign' };
const DIALECTS = [['common', 'Common Norsund'], ['starisund', 'Starisund (Auristar)'], ['kullmyr', 'Kullmyr'], ['nurmyr', 'Nurmyr'], ['old', 'Old Norsund']];

let DATA = null;
const rendered = new Set();

// ---------------------------------------------------------------- helpers

// Small caps for Leipzig category labels (PL.AN, 2SG, EVID.SEEN), plain text otherwise.
function glossHTML(g) {
  return esc(g).replace(/[A-Z]{2,}(?:\.[A-Z]+)*/g, (m) => `<span class="sc">${m}</span>`);
}

// Interlinear block: morpheme line over gloss line, word by word when the token counts match.
function interlinear(morphemes, gloss, opts = {}) {
  const m = String(morphemes || '').trim().split(/\s+/).filter(Boolean);
  const g = String(gloss || '').trim().split(/\s+/).filter(Boolean);
  if (m.length && m.length === g.length) {
    return `<div class="ilg">${m.map((w, i) => `<span><span class="m${/^<.*>$/.test(w) || g[i] === '?' ? ' unk' : ''}">${esc(w)}</span><span class="g">${glossHTML(g[i])}</span></span>`).join('')}</div>`;
  }
  return `<div class="ilg" style="flex-direction:column;gap:2px"><span class="m">${esc(morphemes)}</span><span class="g">${glossHTML(gloss)}</span></div>${opts.note === false ? '' : '<p class="small muted">Gloss and words do not line up one-to-one here.</p>'}`;
}

function bracket(ipaText) {
  return ipaText ? `[${esc(ipaText)}]` : '';
}

function entryLink(e, label) {
  return `<button type="button" class="linkword" data-entry="${esc(e.id)}">${esc(label ?? e.lemma)}</button>`;
}

function wordLink(lemma) {
  const list = safe(() => N.findEntries(lemma), []);
  return list.length ? entryLink(list[0], lemma) : `<span class="lang">${esc(lemma)}</span>`;
}

function badges(e) {
  const b = [];
  if (e.tier === 'core') b.push('<span class="badge core">core</span>');
  if (e.tier === 'sandbox') b.push('<span class="badge sandbox">sandbox</span>');
  if (e.layer && e.layer !== 'native') b.push(`<span class="badge kedre">${esc(LAYER_LABEL[e.layer] || e.layer)}</span>`);
  if (e.register && e.register !== 'common') b.push(`<span class="badge ${esc(e.register)}">${esc(e.register)}</span>`);
  if (e.status === 'proposed') b.push('<span class="badge proposed">proposed</span>');
  return b.join(' ');
}

function posLine(e) {
  let s = POS_LABEL[e.pos] || e.pos || '';
  if (e.class) s += `, ${e.class}`;
  return s;
}

async function copyText(text, statusEl) {
  try {
    await navigator.clipboard.writeText(text);
    if (statusEl) { statusEl.textContent = 'Copied'; setTimeout(() => { statusEl.textContent = ''; }, 1800); }
  } catch {
    const ta = $('#wr-fallback');
    ta.hidden = false; ta.value = text; ta.focus(); ta.select();
    if (statusEl) statusEl.textContent = 'Copy blocked: the SVG is selected below, press Ctrl/Cmd+C.';
  }
}

// ---------------------------------------------------------------- theme

const THEMES = ['system', 'light', 'dark'];
function applyTheme(t) {
  if (t === 'system') delete document.documentElement.dataset.theme;
  else document.documentElement.dataset.theme = t;
  $('#theme-btn').textContent = `Theme: ${t}`;
}
function initTheme() {
  let t = 'system';
  try { t = localStorage.getItem('norsund-theme') || 'system'; } catch { /* storage unavailable */ }
  if (!THEMES.includes(t)) t = 'system';
  if (t !== 'system') applyTheme(t);
  $('#theme-btn').textContent = `Theme: ${t}`;
  $('#theme-btn').addEventListener('click', () => {
    const cur = document.documentElement.dataset.theme || 'system';
    const next = THEMES[(THEMES.indexOf(cur) + 1) % THEMES.length];
    applyTheme(next);
    try { localStorage.setItem('norsund-theme', next); } catch { /* ignore */ }
  });
}

// ---------------------------------------------------------------- routing

function currentTab() {
  const h = location.hash.replace('#', '');
  return TABS.includes(h) ? h : 'dictionary';
}

function showTab(tab) {
  for (const t of TABS) $(`#panel-${t}`).hidden = t !== tab;
  for (const a of $$('.tabs a')) {
    if (a.getAttribute('href') === `#${tab}`) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  }
  if (DATA && !rendered.has(tab)) { rendered.add(tab); INIT[tab](); }
}

// ---------------------------------------------------------------- dictionary

let dictLetter = 'k';
let currentEntryId = null;

function dictFilters() {
  return { field: $('#dict-field').value, pos: $('#dict-pos').value };
}

function filtered(list) {
  const { field, pos } = dictFilters();
  return list.filter((e) => (!field || e.field === field) && (!pos || e.pos === pos));
}

function initDictionary() {
  const all = N.entries();
  const fields = [...new Set(all.map((e) => e.field).filter(Boolean))].sort();
  $('#dict-field').insertAdjacentHTML('beforeend', fields.map((f) => `<option value="${esc(f)}">${esc(f)}</option>`).join(''));
  const poses = [...new Set(all.map((e) => e.pos).filter(Boolean))].sort();
  $('#dict-pos').insertAdjacentHTML('beforeend', poses.map((p) => `<option value="${esc(p)}">${esc(POS_LABEL[p] || p)}</option>`).join(''));
  const order = (N.grammar('orthography').alphabet_order || []).filter((l) => all.some((e) => N.initialLetter(e.lemma) === l));
  $('#dict-letters').innerHTML = order.map((l) => `<button type="button" data-letter="${esc(l)}" aria-pressed="${l === dictLetter}">${esc(l)}</button>`).join('');
  $('#dict-letters').addEventListener('click', (ev) => {
    const b = ev.target.closest('[data-letter]');
    if (!b) return;
    dictLetter = b.dataset.letter;
    $('#dict-q').value = '';
    $$('#dict-letters button').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
    updateResults();
  });
  $('#dict-q').addEventListener('input', debounce(updateResults, 120));
  $('#dict-field').addEventListener('change', updateResults);
  $('#dict-pos').addEventListener('change', updateResults);
  $('#dict-results').addEventListener('click', (ev) => {
    const b = ev.target.closest('[data-entry]');
    if (b) showEntry(b.dataset.entry, true);
  });
  updateResults();
  showEntry(safe(() => N.findEntry('kjold', 'noun').id, all[0].id));
}

function updateResults() {
  const q = $('#dict-q').value.trim();
  let list;
  let formsHint = '';
  if (q) {
    list = filtered(N.search(q, 400));
    if (!/\s/.test(q)) {
      const readings = safe(() => N.analyze(q), []).filter((r) => r.entry && r.form.toLowerCase() !== r.entry.lemma.toLowerCase());
      const seen = new Set();
      formsHint = readings.filter((r) => (seen.has(r.entry.id + r.tags) ? false : seen.add(r.entry.id + r.tags))).slice(0, 4)
        .map((r) => `<span><span class="lang">${esc(r.form)}</span> = <button type="button" data-entry="${esc(r.entry.id)}">${esc(r.entry.lemma)}</button> + <span class="sc">${esc(r.tags || r.gloss)}</span> <span class="muted">(${esc(r.morphemes)})</span></span>`).join('');
      for (const r of readings) if (!list.some((e) => e.id === r.entry.id)) list.unshift(r.entry);
    }
  } else {
    list = filtered(N.sortEntries(N.entries().filter((e) => N.initialLetter(e.lemma) === dictLetter)));
  }
  $('#dict-forms').innerHTML = formsHint;
  const shown = list.slice(0, 250);
  $('#dict-results').innerHTML = shown.length
    ? shown.map((e) => `<li><button type="button" data-entry="${esc(e.id)}"${e.id === currentEntryId ? ' aria-current="true"' : ''}><span class="w">${esc(e.lemma)}</span><span class="p">${esc(POS_LABEL[e.pos] || e.pos || '')}</span><span class="g">${esc((e.gloss || []).join(', '))}</span></button></li>`).join('')
    : '<li style="padding:10px 12px" class="muted">No words found. Try an English word, or a shorter search.</li>';
  $('#dict-count').textContent = list.length > shown.length ? `Showing ${shown.length} of ${fmt(list.length)}.` : `${fmt(list.length)} ${list.length === 1 ? 'word' : 'words'}.`;
}

$('#dict-forms').addEventListener('click', (ev) => {
  const b = ev.target.closest('[data-entry]');
  if (b) showEntry(b.dataset.entry, true);
});

function paradigmHTML(e) {
  const tables = safe(() => N.paradigm(e), []);
  return tables.filter((t) => t.rows && t.rows.length > 1).map((t) => `<div class="tbl"><table><thead><tr><th>Form</th><th>Norsund</th><th>IPA</th></tr></thead><tbody>${
    t.rows.map(([label, form]) => `<tr><td>${esc(label)}</td><td class="f">${esc(form)}</td><td class="ipa">${form ? bracket(safe(() => N.ipa(String(form).replace(/!$/, '')))) : ''}</td></tr>`).join('')
  }</tbody></table></div>`).join('');
}

function showEntry(id, scroll) {
  const e = N.entryById(id);
  if (!e) return;
  currentEntryId = id;
  $$('#dict-results button[data-entry]').forEach((b) => (b.dataset.entry === id ? b.setAttribute('aria-current', 'true') : b.removeAttribute('aria-current')));
  const lemma = e.lemma;
  const clean = lemma.replace(/['’]/g, '');
  const ipaC = safe(() => N.ipa(clean, { parts: e.parts }));
  const ipaS = safe(() => N.ipa(clean, { parts: e.parts, dialect: 'starisund' }));
  const say = safe(() => N.respell(clean, { parts: e.parts }));
  const parent = e.parent ? N.entryById(e.parent) : null;
  const derived = N.entries().filter((x) => x.parent === e.id);
  const homonyms = N.findEntries(lemma).filter((x) => x.id !== e.id);
  const meta = [];
  if (e.notes) meta.push(['Notes', esc(e.notes)]);
  if (e.etymology) meta.push(['Origin', esc(e.etymology)]);
  if (e.parts && e.parts.length) meta.push(['Parts', e.parts.map(wordLink).join(' + ')]);
  if (parent) meta.push(['Built from', entryLink(parent)]);
  if (e.forms) meta.push(['Listed forms', Object.entries(e.forms).map(([k, v]) => `${esc(k)}: <span class="lang">${esc(v)}</span>`).join(' · ')]);
  if (e.attested && e.attested.length) meta.push(['In canon', e.attested.map((a) => (/\//.test(a) ? `<span class="mono">${esc(a)}</span>` : wordLink(a))).join(', ')]);
  if (derived.length) meta.push(['Derived', derived.map((d) => `${entryLink(d)} <span class="muted small">${esc((d.gloss || [])[0] || '')}</span>`).join(' · ')]);
  if (homonyms.length) meta.push(['Also', homonyms.map((h) => `${entryLink(h)} <span class="muted small">(${esc(POS_LABEL[h.pos] || h.pos)}: ${esc((h.gloss || [])[0] || '')})</span>`).join(' · ')]);
  meta.push(['Layer', `${esc(LAYER_LABEL[e.layer] || e.layer || 'native')}${e.epoch ? ` · entered: ${esc(e.epoch)}` : ''}${e.field ? ` · field: ${esc(e.field)}` : ''}`]);
  meta.push(['Source', `<span class="mono">${esc(e.file || '')}</span>`]);
  const lysrit = safe(() => N.renderLysrit(clean, { sacred: 'auto', scale: 1.5 }));
  const runes = safe(() => N.renderRunes(clean, { scale: 0.9 }));
  $('#dict-entry').innerHTML = `
    <div class="entry-head"><h3 class="headword">${esc(lemma)}</h3><span class="muted">${esc(posLine(e))}</span> ${badges(e)}</div>
    <div class="pron">
      ${ipaC ? `<span><b>IPA</b><span class="ipa">${bracket(ipaC)}</span></span>` : ''}
      ${ipaS && ipaS !== ipaC ? `<span><b>Auristar</b><span class="ipa">${bracket(ipaS)}</span></span>` : ''}
      ${say ? `<span><b>Say</b>${esc(say)}</span>` : ''}
    </div>
    <p class="glosses">${esc((e.gloss || []).join('; '))}</p>
    <dl class="meta-list">${meta.map(([k, v]) => `<dt>${esc(k)}</dt><dd>${v}</dd>`).join('')}</dl>
    ${paradigmHTML(e) ? `<h3>Forms</h3>${paradigmHTML(e)}` : ''}
    <h3>Written</h3>
    <div class="scripts-out">
      ${lysrit ? `<div><span class="lbl">Lysrit</span><div class="svgbox">${lysrit}</div></div>` : ''}
      ${runes ? `<div><span class="lbl">Runes</span><div class="svgbox">${runes}</div><p class="small lang muted">${esc(safe(() => N.transliterateRunes(clean)))}</p></div>` : ''}
    </div>`;
  if (scroll && window.matchMedia('(max-width: 820px)').matches) $('#dict-entry').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

document.addEventListener('click', (ev) => {
  const b = ev.target.closest('.linkword[data-entry]');
  if (!b) return;
  if (currentTab() !== 'dictionary') location.hash = '#dictionary';
  showEntry(b.dataset.entry, true);
});

// ---------------------------------------------------------------- translate

const EN_EXAMPLES = [
  'The brave hunters guarded the wall at night.',
  'Tyr will guard the wall.',
  'The star fell from the sky.',
  'Do you guard the wall?',
  'The free swords did not drink ale.',
  'We drink ale in the tavern.',
  'Where is the tavern?',
  'She is braver than Ulf.',
];
const NS_EXAMPLES = [
  'Fjol starin lyser run ne.',
  'Kjal, thiolen! Ma staren kjolda dun.',
  'Vil kyrin, vothen sundin.',
  'Thiark aur star ke ne vyrner.',
  'I nimin kjolder Tyr murin.',
  'Tyr hal kjolda murin, stari.',
];

function initTranslate() {
  $('#tr-en-examples').innerHTML = EN_EXAMPLES.map((x) => `<button type="button" class="chip" data-ex="${esc(x)}">${esc(x)}</button>`).join('');
  $('#tr-ns-examples').innerHTML = NS_EXAMPLES.map((x) => `<button type="button" class="chip lang" data-ex="${esc(x)}">${esc(x)}</button>`).join('');
  $('#tr-en-examples').addEventListener('click', (ev) => { const b = ev.target.closest('[data-ex]'); if (b) { $('#tr-en').value = b.dataset.ex; runEnglish(); } });
  $('#tr-ns-examples').addEventListener('click', (ev) => { const b = ev.target.closest('[data-ex]'); if (b) { $('#tr-ns').value = b.dataset.ex; runNorsund(); } });
  $('#tr-en').addEventListener('input', debounce(runEnglish, 220));
  $('#tr-dialect').addEventListener('change', runEnglish);
  $('#tr-you').addEventListener('change', runEnglish);
  $('#tr-ns').addEventListener('input', debounce(runNorsund, 220));
  runEnglish();
  runNorsund();
}

function sentences(text) {
  return (String(text).match(/[^.!?]+[.!?]*/g) || []).map((s) => s.trim()).filter(Boolean);
}

function runEnglish() {
  const text = $('#tr-en').value;
  const opts = { dialect: $('#tr-dialect').value };
  const you = $('#tr-you').value;
  if (you === 'several') opts.pluralYou = true;
  if (you === 'polite') opts.politeYou = true;
  const parts = sentences(text);
  if (!parts.length) { $('#tr-en-out').innerHTML = '<p class="muted">Type an English sentence.</p>'; return; }
  $('#tr-en-out').innerHTML = parts.map((s) => {
    const r = safe(() => N.englishToNorsund(s, opts), null);
    if (!r) return `<p class="warnline">Could not translate “${esc(s)}”. Try a simpler sentence.</p>`;
    const words = r.words || [];
    const notes = [...(r.notes || [])];
    const unknown = r.unknown || [];
    return `<div style="margin-bottom:14px">
      <div class="out-line">${esc(r.norsund)}</div>
      ${interlinear(words.map((w) => w.morphemes).join(' '), words.map((w) => w.gloss).join(' '), { note: false })}
      ${unknown.length ? `<p class="warnline">No Norsund word yet for: ${unknown.map(esc).join(', ')}. Search the dictionary for a synonym, or propose a word.</p>` : ''}
      ${notes.length ? `<ul class="notes">${notes.map((n) => `<li>${esc(n)}</li>`).join('')}</ul>` : ''}
    </div>`;
  }).join('');
}

function runNorsund() {
  const parts = sentences($('#tr-ns').value);
  if (!parts.length) { $('#tr-ns-out').innerHTML = '<p class="muted">Type a Norsund sentence.</p>'; return; }
  $('#tr-ns-out').innerHTML = parts.map((s) => {
    const r = safe(() => N.gloss(s), null);
    if (!r) return `<p class="warnline">Could not gloss “${esc(s)}”.</p>`;
    const toks = r.tokens || [];
    const amb = toks.filter((t) => t.alternatives > 1).map((t) => t.form);
    const unk = toks.filter((t) => t.gloss === '?' || /^\?/.test(t.gloss)).map((t) => t.form);
    return `<div style="margin-bottom:14px">
      <div class="out-line">${esc(s)}</div>
      ${interlinear(toks.map((t) => t.morphemes).join(' '), toks.map((t) => t.gloss).join(' '), { note: false })}
      ${r.translationGuess ? `<p class="tr">≈ ${esc(r.translationGuess)}</p>` : ''}
      ${amb.length ? `<p class="small muted">More than one reading: ${amb.map((w) => `<span class="lang">${esc(w)}</span>`).join(', ')}. The gloss picks the likeliest one for its position.</p>` : ''}
      ${unk.length ? `<p class="warnline">Not in the dictionary: ${unk.map(esc).join(', ')}</p>` : ''}
    </div>`;
  }).join('');
}

// ---------------------------------------------------------------- write

function sacredOpt() {
  const v = $('#wr-sacred').value;
  return v === 'first' ? true : v === 'none' ? false : 'auto';
}

function writeOpts(theme) {
  const scale = Number($('#wr-scale').value) || 1.4;
  return {
    lysrit: { sacred: sacredOpt(), scale, theme },
    runes: { variant: $('#wr-variant').value, glow: $('#wr-glow').checked, scale: scale * 0.8, theme },
  };
}

function initWrite() {
  const run = () => {
    const text = $('#wr-text').value;
    const o = writeOpts('auto');
    $('#wr-glow-note').hidden = !$('#wr-glow').checked;
    $('#wr-lysrit').innerHTML = text.trim() ? safe(() => N.renderLysrit(text, o.lysrit), '<p class="warnline">Could not draw this text.</p>') : '';
    $('#wr-runes').innerHTML = text.trim() ? safe(() => N.renderRunes(text, o.runes), '<p class="warnline">Could not draw this text.</p>') : '';
    $('#wr-runenames').textContent = safe(() => N.transliterateRunes(text));
    const foreign = [...new Set((text.toLowerCase().match(/[cqxz]/g) || []))];
    $('#wr-lysrit-notes').textContent = foreign.length ? `Not Norsund letters: ${foreign.join(', ')}. They are written with the nearest Norsund sounds (c, q as k; x as ks; z as s).` : 'Each cell holds a consonant and the stars of the vowels after it. An unstressed final e is drawn as ə, which the romanization does not show.';
  };
  ['#wr-text', '#wr-scale'].forEach((s) => $(s).addEventListener('input', debounce(run, 80)));
  ['#wr-sacred', '#wr-variant', '#wr-glow'].forEach((s) => $(s).addEventListener('change', run));
  $('#panel-write').addEventListener('click', (ev) => {
    const b = ev.target.closest('[data-copy]');
    if (!b) return;
    const theme = b.dataset.theme;
    const o = writeOpts(theme);
    const text = $('#wr-text').value;
    const svg = b.dataset.copy === 'lysrit' ? N.renderLysrit(text, o.lysrit) : N.renderRunes(text, o.runes);
    copyText(svg, $(`#wr-copied-${b.dataset.copy}`));
  });
  run();
  renderSheets();
}

function renderSheets() {
  const L = N.LYSRIT;
  const cell = (spec, label, sub) => `<div class="glyphcell">${safe(() => N.renderLysritGlyph('cell', spec, { title: label, scale: 1.2 }))}<span>${esc(label)}</span>${sub ? `<small>${esc(sub)}</small>` : ''}</div>`;
  const groups = {};
  for (const [letter, c] of Object.entries(L.consonants)) (groups[c.place] = groups[c.place] || []).push([letter, c]);
  const placeName = { labial: 'Lips · top bar', coronal: 'Tooth ridge · middle bar', palatal: 'Palate', velar: 'Back of the mouth · bottom bar', dorsal: 'Back of the mouth · bottom bar', glottal: 'Throat' };
  let html = `<div class="lbl" style="margin:6px 0">Vowels · stars on the grid</div><div class="sheet">${
    Object.keys(L.vowels).map((v) => cell({ c: null, gem: false, v: [{ v, long: false }] }, v, v === 'ə' ? 'unstressed e' : '')).join('')
  }${cell({ c: null, gem: false, v: [{ v: 'a', long: true }] }, 'aa', 'long')}</div>`;
  for (const [place, list] of Object.entries(groups)) {
    html += `<div class="lbl" style="margin:12px 0 6px">${esc(placeName[place] || place)}</div><div class="sheet">${
      list.map(([letter, c]) => cell({ c: letter, gem: false, v: [] }, letter, `${c.manner}${c.voiced ? ', voiced' : ''}`)).join('')}</div>`;
  }
  if (L.digits) {
    html += `<div class="lbl" style="margin:12px 0 6px">Digits</div><div class="sheet">${Object.keys(L.digits).map((d) => `<div class="glyphcell">${safe(() => N.renderLysritGlyph('digit', d, { title: d, scale: 1.2 }))}<span>${esc(d)}</span></div>`).join('')}${L.longHundred ? `<div class="glyphcell">${safe(() => N.renderLysritGlyph('digit', 'lh', { title: 'long hundred (120)', scale: 1.2 }))}<span>120</span><small>langhaun</small></div>` : ''}</div>`;
  }
  if (L.sigils) {
    html += `<div class="lbl" style="margin:12px 0 6px">Evidential sigils</div><div class="sheet">${Object.entries(L.sigils).map(([k, s]) => `<div class="glyphcell">${safe(() => N.renderLysritGlyph('sigil', k, { title: s.name || k, scale: 1.2 }))}<span>${esc(k)}</span></div>`).join('')}</div>`;
  }
  $('#wr-lysrit-sheet').innerHTML = html;
  const R = N.RUNAR;
  $('#wr-rune-sheet').innerHTML = `<div class="sheet">${(R.runes || []).map((r) => `<div class="glyphcell">${safe(() => N.renderRune(r.letter, { scale: 0.9 }))}<span>${esc(r.letter)}</span><small class="lang">${esc(r.name)} · ${esc(r.gloss || '')}</small></div>`).join('')}</div>
    <p class="small muted" style="margin-top:10px">Consonant strokes sit right of the stave and vowel strokes left; no rune has strokes on both sides. That rules out arrows, forks and crossed staves, so no hate-symbol rune can be formed. Screen final art against the ADL Hate Symbols database all the same.</p>`;
}

// ---------------------------------------------------------------- names

let seedCounter = Math.floor(Date.now() % 100000);
const selectedMods = [];

function initNames() {
  const naming = N.grammar('naming');
  const generics = naming.place_generics || [];
  const mods = naming.modifiers || [];
  $('#nm-generic').insertAdjacentHTML('beforeend', generics.map((g) => `<option value="${esc(g.form)}">${esc(g.form)} · ${esc(g.meaning)}</option>`).join(''));
  const seenMods = new Set();
  $('#nm-mods').innerHTML = mods.filter((m) => (seenMods.has(m.form) ? false : seenMods.add(m.form)))
    .map((m) => `<button type="button" class="chip lang" data-mod="${esc(m.form)}" aria-pressed="false" title="${esc(m.meaning)}">${esc(m.form)} <span class="muted small">${esc(m.meaning)}</span></button>`).join('');
  $('#nm-mods').addEventListener('click', (ev) => {
    const b = ev.target.closest('[data-mod]');
    if (!b) return;
    const i = selectedMods.indexOf(b.dataset.mod);
    if (i >= 0) selectedMods.splice(i, 1); else if (selectedMods.length < 3) selectedMods.push(b.dataset.mod);
    $$('#nm-mods [data-mod]').forEach((x) => x.setAttribute('aria-pressed', String(selectedMods.includes(x.dataset.mod))));
  });
  $('#nm-clear').addEventListener('click', () => { selectedMods.length = 0; $$('#nm-mods [data-mod]').forEach((x) => x.setAttribute('aria-pressed', 'false')); forgePlaces(); });
  $('#nm-forge').addEventListener('click', forgePlaces);
  $('#nm-people-btn').addEventListener('click', forgePeople);
  $('#nm-check').addEventListener('input', debounce(checkNameUI, 150));
  forgePlaces();
  forgePeople();
  checkNameUI();
}

function placeCard(p) {
  const say = safe(() => N.respell(p.name, { parts: p.parts }));
  return `<div class="name-card"><span class="n">${esc(p.name)}</span><span class="tr">“${esc(p.meaning || '')}”</span>
    <span class="small">${(p.parts || []).map(wordLink).join(' + ')}</span>
    <span class="small muted">People: <span class="lang">${esc(p.demonym || safe(() => N.demonym(p.name, p.parts)))}</span>${say ? ` · say ${esc(say)}` : ''}</span>
    ${p.warnings && p.warnings.length ? `<span class="warnline">${esc(p.warnings.join(' '))}</span>` : ''}
    <div class="svgbox">${safe(() => N.renderLysrit(p.name, { scale: 0.9 }))}</div></div>`;
}

function forgePlaces() {
  const generic = $('#nm-generic').value || undefined;
  const out = [];
  const names = new Set();
  for (let i = 0; i < 12 && out.length < 6; i++) {
    const opts = { seed: seedCounter++ };
    if (generic) opts.generic = generic;
    if (selectedMods.length) opts.modifiers = [...selectedMods];
    const p = safe(() => N.generatePlaceName(opts), null);
    if (p && !names.has(p.name)) { names.add(p.name); out.push(p); }
    if (generic && selectedMods.length) break; // fully specified: only one possible name
  }
  $('#nm-places').innerHTML = out.length ? out.map(placeCard).join('') : '<p class="warnline">No legal name came out of these parts. Try another generic or fewer modifiers.</p>';
}

function forgePeople() {
  const out = [];
  for (let i = 0; i < 6; i++) {
    const p = safe(() => N.generatePersonName({ seed: seedCounter++ }), null);
    if (p) out.push(p);
  }
  $('#nm-people').innerHTML = out.map((p) => `<div class="name-card"><span class="n" style="font-size:1.35rem">${esc(p.name)}</span><span class="small">${esc(p.meaning || '')}</span><span class="small muted">say ${esc(safe(() => N.respell(p.given)))} · ${esc(safe(() => N.respell(p.parentName)))}</span></div>`).join('');
}

function checkNameUI() {
  const name = $('#nm-check').value.trim();
  if (!name) { $('#nm-check-out').innerHTML = ''; return; }
  const r = safe(() => N.checkName(name), null);
  if (!r) { $('#nm-check-out').innerHTML = '<p class="warnline">Could not check this name.</p>'; return; }
  $('#nm-check-out').innerHTML = `
    <p class="${r.ok ? 'okline' : 'warnline'}">${r.ok ? 'Follows Norsund sound rules.' : 'Breaks a sound rule:'} ${r.errors.map(esc).join(' ')}</p>
    ${r.warnings.length ? `<ul class="notes">${r.warnings.map((w) => `<li>${esc(w)}</li>`).join('')}</ul>` : ''}
    <dl class="meta-list">
      <dt>Syllables</dt><dd>${esc(r.syllables)} <span class="muted">(${esc(safe(() => N.syllabify(name).join('·')))})</span></dd>
      <dt>IPA</dt><dd class="ipa">${bracket(safe(() => N.ipa(name)))}</dd>
      <dt>Say</dt><dd>${esc(safe(() => N.respell(name)))}</dd>
      <dt>People</dt><dd class="lang">${esc(safe(() => N.demonym(name)))}</dd>
    </dl>`;
}

// ---------------------------------------------------------------- sounds

function initSounds() {
  const paths = safe(() => N.soundChangePaths(), ['norsund', 'old_norsund', 'starisund', 'kullmyr', 'kedre']);
  const pathLabel = { norsund: 'Norsund', old_norsund: 'Old Norsund', starisund: 'Starisund speech', kullmyr: 'Kullmyr speech', kedre: 'Kedre' };
  $('#snd-path').innerHTML = paths.map((p) => `<option value="${esc(p)}">${esc(pathLabel[p] || p)}</option>`).join('');
  $('#snd-word').addEventListener('input', debounce(runWordSounds, 120));
  $('#snd-pv').addEventListener('input', debounce(runLab, 120));
  $('#snd-path').addEventListener('change', runLab);
  const cog = N.grammar('history').cognates || [];
  $('#snd-cognates').innerHTML = `<table><thead><tr><th>Proto-Valian</th><th>Meaning</th><th>Old Norsund</th><th>Norsund</th><th>Kedre</th></tr></thead><tbody>${
    cog.map((c) => `<tr><td><button type="button" class="linkword" data-pv="${esc(c.pv)}">*${esc(c.pv)}</button></td><td>${esc(c.gloss)}</td><td class="f">${esc(c.old_norsund)}</td><td class="f">${wordLink(c.norsund)}</td><td class="f">${esc(c.kedre)}</td></tr>`).join('')
  }</tbody></table>`;
  $('#snd-cognates').addEventListener('click', (ev) => {
    const b = ev.target.closest('[data-pv]');
    if (!b) return;
    ev.stopPropagation();
    $('#snd-pv').value = b.dataset.pv;
    runLab();
    $('#snd-pv').scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
  runWordSounds();
  runLab();
}

function runWordSounds() {
  const w = $('#snd-word').value.trim();
  if (!w) { $('#snd-out').innerHTML = ''; return; }
  const v = safe(() => N.validateForm(w), { ok: false, errors: ['Could not check this word.'], warnings: [] });
  $('#snd-out').innerHTML = `
    <div class="tbl"><table><thead><tr><th>Dialect</th><th>Pronunciation</th></tr></thead><tbody>
      ${DIALECTS.map(([d, label]) => `<tr><td>${esc(label)}</td><td class="ipa">${bracket(safe(() => N.ipa(w, { dialect: d })))}</td></tr>`).join('')}
      <tr><td>English-friendly</td><td>${esc(safe(() => N.respell(w)))}</td></tr>
      <tr><td>Syllables</td><td class="f">${esc(safe(() => N.syllabify(w).join(' · ')))}</td></tr>
    </tbody></table></div>
    <p class="${v.ok ? 'okline' : 'warnline'}" style="margin-top:10px">${v.ok ? 'Follows the sound rules of grammar/01 (letters, onsets, codas).' : 'Breaks the sound rules:'} ${v.errors.map(esc).join(' ')}</p>
    ${v.warnings && v.warnings.length ? `<ul class="notes">${v.warnings.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>` : ''}`;
}

function runLab() {
  const pv = $('#snd-pv').value.trim().replace(/^\*/, '');
  if (!pv) { $('#snd-results').innerHTML = ''; $('#snd-steps').innerHTML = ''; return; }
  const paths = safe(() => N.soundChangePaths(), []);
  const pathLabel = { norsund: 'Norsund', old_norsund: 'Old Norsund', starisund: 'Starisund speech', kullmyr: 'Kullmyr speech', kedre: 'Kedre' };
  const results = paths.map((p) => [p, safe(() => N.evolve(pv, p), null)]);
  $('#snd-results').innerHTML = `<div class="tbl"><table><tbody>${results.map(([p, r]) => `<tr><td>${esc(pathLabel[p] || p)}</td><td class="f">${r ? esc(r.result) : '<span class="warnline">error</span>'}</td></tr>`).join('')}</tbody></table></div>`;
  const chosen = $('#snd-path').value;
  const r = safe(() => N.evolve(pv, chosen), null);
  if (!r) { $('#snd-steps').innerHTML = '<p class="warnline">This form could not be read. Use Proto-Valian letters: a e i o u, long vowels doubled, bh dh gh for breathy stops.</p>'; return; }
  $('#snd-steps').innerHTML = `<h3>Step by step to ${esc(pathLabel[chosen] || chosen)}</h3>${
    r.steps.length ? `<div class="tbl steps"><table><thead><tr><th>Rule</th><th>Before</th><th></th><th>After</th></tr></thead><tbody>${
      r.steps.map((s) => `<tr><td><span class="mono">${esc(s.rule)}</span><br><span class="small muted">${esc(s.name || '')}</span></td><td class="f">${esc(s.before)}</td><td class="arrow">→</td><td class="f">${esc(s.after)}</td></tr>`).join('')
    }</tbody></table></div>` : '<p class="muted">No rule changes this form on this path.</p>'
  }<p style="margin-top:8px">Result: <span class="lang" style="font-size:1.3rem;font-weight:700">${esc(r.result)}</span></p>`;
}

// ---------------------------------------------------------------- numbers

function initNumbers() {
  $('#num-n').addEventListener('input', debounce(runNumber, 100));
  $('#num-words').addEventListener('input', debounce(runNumberBack, 150));
  const rows = [];
  for (let n = 1; n <= 20; n++) rows.push(n);
  rows.push(27, 30, 70, 100, 120, 523, 1000);
  $('#num-table').innerHTML = `<table><thead><tr><th>#</th><th>Norsund</th><th>Ordinal</th></tr></thead><tbody>${rows.map((n) => {
    const words = n === 120 ? 'langhaun (long hundred)' : safe(() => N.numberToNorsund(n));
    const ord = n <= 20 ? safe(() => N.ordinal(n)) : '';
    return `<tr><td style="font-variant-numeric:tabular-nums">${fmt(n)}</td><td class="f">${esc(words)}${n === 7 ? ' <span class="muted small">(Auristar: stev)</span>' : ''}</td><td class="f">${esc(ord)}${n === 7 ? ' <span class="muted small">(stevde)</span>' : ''}</td></tr>`;
  }).join('')}</tbody></table>`;
  runNumber();
  runNumberBack();
}

function runNumber() {
  const n = Number($('#num-n').value);
  if (!Number.isInteger(n) || n < 0 || n > 999999) { $('#num-out').innerHTML = '<p class="warnline">Enter a whole number from 0 to 999,999.</p>'; return; }
  const common = safe(() => N.numberToNorsund(n), '');
  const stari = safe(() => N.numberToNorsund(n, { dialect: 'starisund' }), '');
  const ord = n > 0 && n <= 1000 ? safe(() => N.ordinal(n), '') : '';
  const ordS = n > 0 && n <= 1000 ? safe(() => N.ordinal(n, { dialect: 'starisund' }), '') : '';
  $('#num-out').innerHTML = `<div class="out-line">${esc(common)}</div>
    <dl class="meta-list">
      ${stari && stari !== common ? `<dt>Auristar</dt><dd class="lang">${esc(stari)}</dd>` : ''}
      ${ord ? `<dt>Ordinal</dt><dd class="lang">${esc(ord)}${ordS && ordS !== ord ? ` · Auristar ${esc(ordS)}` : ''}</dd>` : ''}
      <dt>Say</dt><dd>${esc(safe(() => common.replace(/,/g, '').split(/\s+/).map((w) => N.respell(w)).join(' ')))}</dd>
    </dl>`;
}

function runNumberBack() {
  const t = $('#num-words').value.trim();
  if (!t) { $('#num-back').innerHTML = ''; return; }
  const v = safe(() => N.parseNumber(t), null);
  $('#num-back').innerHTML = v === null || Number.isNaN(v) ? '<p class="warnline">Not a Norsund number I can read.</p>' : `<p class="out-line" style="font-family:var(--body)">${fmt(v)}</p>`;
}

// ---------------------------------------------------------------- texts

function initTexts() {
  const docs = DATA.texts || [];
  const langs = [...new Set(docs.map((d) => d.language))];
  const LNAME = { norsund: 'Norsund', 'old-norsund': 'Old Norsund', kedre: 'Kedre' };
  $('#tx-lang').insertAdjacentHTML('beforeend', langs.map((l) => `<option value="${esc(l)}">${esc(LNAME[l] || l)}</option>`).join(''));
  const run = () => {
    const want = $('#tx-lang').value;
    const list = docs.filter((d) => !want || d.language === want);
    $('#tx-out').innerHTML = list.length ? list.map((d) => (d.texts || []).map((t) => `
      <article class="text-block">
        <h3>${esc(t.title || t.id)}</h3>
        <p class="small muted">${esc(LNAME[d.language] || d.language)}${t.register ? ` · ${esc(t.register)}` : ''}${t.source ? ` · <span class="mono">${esc(t.source)}</span>` : ''}</p>
        ${t.context ? `<p>${esc(t.context)}</p>` : ''}
        ${(t.lines || []).map((l) => `<div class="line"><div class="t">${esc(l.text)}</div>${interlinear(l.morphemes, l.gloss)}<p class="tr">${esc(l.translation || '')}</p></div>`).join('')}
        ${t.notes && t.notes.length ? `<ul class="notes">${(Array.isArray(t.notes) ? t.notes : [t.notes]).map((n) => `<li>${esc(n)}</li>`).join('')}</ul>` : ''}
      </article>`).join('')).join('')
      : '<p class="muted">No texts for this language yet. Texts live in records/languages/*/texts*.yaml.</p>';
  };
  $('#tx-lang').addEventListener('change', run);
  run();
}

// ---------------------------------------------------------------- grammar

const STANDARD_KEYS = new Set(['document', 'language', 'version', 'topic', 'contributor', 'status', 'context', 'rules', 'tables', 'file']);

function initGrammar() {
  const topics = Object.keys(DATA.grammar || {});
  const title = (k) => (DATA.grammar[k].topic || k);
  $('#gr-topics').innerHTML = topics.map((k, i) => `<button type="button" data-topic="${esc(k)}" aria-pressed="${i === 0}">${esc(title(k))}</button>`).join('');
  $('#gr-select').innerHTML = topics.map((k) => `<option value="${esc(k)}">${esc(title(k))}</option>`).join('');
  const show = (k) => {
    $$('#gr-topics [data-topic]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.topic === k)));
    $('#gr-select').value = k;
    renderTopic(k);
  };
  $('#gr-topics').addEventListener('click', (ev) => { const b = ev.target.closest('[data-topic]'); if (b) show(b.dataset.topic); });
  $('#gr-select').addEventListener('change', () => show($('#gr-select').value));
  if (topics.length) show(topics[0]);
}

function exampleHTML(ex) {
  if (typeof ex === 'string') return `<div class="ex lang">${esc(ex)}</div>`;
  const form = String(ex.form || '');
  const words = form.trim().split(/\s+/);
  const g = String(ex.gloss || '').trim().split(/\s+/);
  const body = ex.gloss && words.length === g.length ? interlinear(form, ex.gloss) : `<div class="lang" style="font-size:1.1rem">${esc(form)}</div>${ex.gloss ? `<div class="g small muted lang">${glossHTML(ex.gloss)}</div>` : ''}`;
  return `<div class="ex">${body}${ex.ipa ? `<div class="ipa small">${esc(ex.ipa)}</div>` : ''}${ex.translation ? `<p class="tr small">${esc(ex.translation)}</p>` : ''}</div>`;
}

function renderTopic(k) {
  const d = DATA.grammar[k];
  const rules = d.rules || [];
  const tables = d.tables || [];
  const extra = Object.keys(d).filter((x) => !STANDARD_KEYS.has(x));
  $('#gr-out').innerHTML = `
    <h3 style="margin-top:0;font-family:var(--display);font-weight:800;font-size:1.9rem;text-transform:uppercase">${esc(d.topic || k)}</h3>
    <p class="small muted mono">${esc(d.file || '')}</p>
    ${(d.context || []).length ? `<ul class="notes" style="color:var(--ink)">${d.context.map((c) => `<li>${esc(typeof c === 'string' ? c : JSON.stringify(c))}</li>`).join('')}</ul>` : ''}
    ${rules.map((r) => `<div class="rule"><span class="id">${esc(r.id || '')}</span><h4>${esc(r.title || '')}</h4><p>${esc(r.rule || '')}</p>${(r.examples || []).map(exampleHTML).join('')}</div>`).join('')}
    ${tables.map((t) => `<h3>${esc(t.title || t.id)}</h3><div class="tbl"><table><thead><tr>${(t.columns || []).map((c) => `<th>${esc(c)}</th>`).join('')}</tr></thead><tbody>${(t.rows || []).map((row) => `<tr>${row.map((c) => `<td class="f">${esc(c)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`).join('')}
    ${extra.length ? `<details style="margin-top:16px"><summary>Machine-readable data used by the tools (${extra.map(esc).join(', ')})</summary><pre class="json">${esc(JSON.stringify(Object.fromEntries(extra.map((x) => [x, d[x]])), null, 2))}</pre></details>` : ''}`;
}

// ---------------------------------------------------------------- boot

const INIT = {
  dictionary: initDictionary, translate: initTranslate, write: initWrite, names: initNames,
  sounds: initSounds, numbers: initNumbers, texts: initTexts, grammar: initGrammar,
};

function stats() {
  const g = DATA.grammar || {};
  const rules = Object.values(g).reduce((n, d) => n + ((d.rules || []).length), 0);
  const texts = (DATA.texts || []).reduce((n, d) => n + ((d.texts || []).length), 0);
  $('#stats').innerHTML = `<span>Version <b>${esc(DATA.version || '1.0.0')}</b></span><span><b>${fmt(N.entries().length)}</b> Norsund words</span><span><b>${fmt(rules)}</b> grammar rules</span><span><b>${fmt(texts)}</b> glossed texts</span>`;
}

async function boot() {
  initTheme();
  $('#hero-glyph').innerHTML = safe(() => N.renderLysrit('Norsund', { scale: 1.5, nodes: true }));
  window.addEventListener('hashchange', () => showTab(currentTab()));
  showTab(currentTab());
  try {
    const res = await fetch('./data/norsund.json');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    DATA = N.setData(await res.json());
  } catch (err) {
    $('#stats').innerHTML = `<span class="warnline">Could not load data/norsund.json (${esc(err.message)}). Run <span class="mono">node tools/build.mjs</span> and serve the tools/web folder over http.</span>`;
    $('#dict-entry').innerHTML = '<p class="warnline">The dictionary data did not load.</p>';
    return;
  }
  $('#hero-glyph').innerHTML = safe(() => N.renderLysrit('Norsund', { scale: 1.5 }));
  stats();
  const tab = currentTab();
  rendered.add(tab);
  INIT[tab]();
}

boot();
