import test from 'node:test';
import assert from 'node:assert/strict';
import { data } from './helpers.mjs';
import { nounForms, verbForms, adjForms, pronounForms, analyze, inflectNoun, genitive } from '../norsund/morphology.js';
import { findEntry } from '../norsund/lexicon.js';

// Spec bug: NOUN-T1 lists the definite genitive of nay and rie as nayns/riens, but NOUN-05 says -i after a consonant,
// so the rule gives nayni/rieni. The engine follows the rule.
const NOUN_T1_GENITIVE_ERRATA = { nayns: 'nayni', riens: 'rieni' };

test('noun paradigms match NOUN-T1', () => {
  const table = data.grammar.nouns.tables.find((t) => t.id === 'NOUN-T1');
  for (const row of table.rows) {
    const [sg, pl, def, defpl, gen] = row.slice(-5);
    const e = findEntry(sg, 'noun') || findEntry(sg);
    assert.ok(e, `entry ${sg}`);
    const f = nounForms(e);
    assert.deepEqual([f.sg, f.pl, f.def, f.defpl], [sg, pl, def, defpl], `row ${sg}`);
    assert.equal(f.defgen, NOUN_T1_GENITIVE_ERRATA[gen] || gen, `genitive of ${def}`);
  }
});

test('noun details', () => {
  const kyr = findEntry('kyr', 'noun');
  assert.equal(inflectNoun(kyr, { number: 'pl', definite: true }).gloss, 'blade-DEF.PL.IN');
  assert.equal(inflectNoun(findEntry('Vilkyr', 'noun'), { number: 'pl', definite: true, genitive: true }).form, 'Vilkyrenes');
  assert.equal(nounForms(findEntry('star', 'noun'), 'starisund').pl, 'staren');
  assert.equal(nounForms(findEntry('star', 'noun')).pl, 'starar');
  assert.equal(nounForms(findEntry('thamm', 'noun')).pl, 'themm');
  assert.equal(genitive('Tyr'), 'Tyri');
  assert.equal(genitive('nay'), 'nays');
});

test('strong and irregular verbs match grammar/06', () => {
  const m = data.grammar.verbs.morphology;
  for (const row of [...m.strong, ...m.irregular]) {
    const e = findEntry(row.infinitive, 'verb');
    assert.ok(e, row.infinitive);
    const f = verbForms(e);
    assert.equal(f.prs, row.present, `${row.infinitive} present`);
    assert.equal(f.pst, row.past, `${row.infinitive} past`);
    assert.equal(f.ptcp, row.participle, `${row.infinitive} participle`);
    if (row.imperative) assert.equal(f.imp, row.imperative, `${row.infinitive} imperative`);
  }
});

test('weak verbs and imperative epenthesis', () => {
  const k = verbForms(findEntry('kjolda', 'verb'));
  assert.deepEqual([k.prs, k.pst, k.ptcp, k.prsptcp, k.imp, k.vn, k.agt], ['kjolder', 'kjoldade', 'kjoldad', 'kjoldande', 'kjold', 'kjoldning', 'kjoldir']);
  assert.equal(verbForms(findEntry('wandra', 'verb')).imp, 'wandre');
  assert.equal(verbForms(findEntry('hal', 'verb')).invariable, true);
});

test('adjectives', () => {
  const m = data.grammar['adjectives-adverbs'].morphology;
  for (const row of m.irregular_comparison) {
    const f = adjForms(findEntry(row.base, 'adj') || findEntry(row.base, 'det'));
    assert.equal(f.cmpr, row.comparative);
    assert.equal(f.supl, row.superlative);
  }
  const t = adjForms(findEntry('thiol', 'adj'));
  assert.deepEqual([t.cmpr, t.supl, t.adv, t.nomDef, t.nomPl, t.nomDefPl], ['thiolar', 'thiolast', 'thiolt', 'thiolin', 'thiolen', 'thiolene']);
  assert.equal(adjForms(findEntry('hel', 'adj')).adv, 'helt');
});

test('pronouns match grammar/05', () => {
  for (const p of data.grammar['pronouns-determiners'].morphology.personal) {
    const f = pronounForms(findEntry(p.subject, 'pron'));
    assert.deepEqual([f.subject, f.object, f.possessive], [p.subject, p.object, p.possessive], p.person);
  }
});

test('analyzer returns every reading', () => {
  const k = analyze('kjolder');
  assert.ok(k.some((r) => r.lemma === 'kjolda' && r.gloss === 'guard-PRS'));
  assert.ok(k.some((r) => r.lemma === 'kjolder' && r.pos === 'noun'));
  assert.ok(analyze('sa').some((r) => r.gloss === 'EVID.SEEN'));
  assert.ok(analyze('sa').some((r) => r.gloss === 'see.PST'));
  assert.equal(analyze('Vilkyrenes')[0].gloss, 'free.sword-DEF.PL.AN-GEN');
  assert.equal(analyze('dul')[0].gloss, 'fall.PST');
  assert.equal(analyze('es')[0].gloss, 'be.PRS');
  assert.ok(analyze('staren').some((r) => r.gloss === 'star-PL.AN'));
});
