import test from 'node:test';
import assert from 'node:assert/strict';
import { data, strip } from './helpers.mjs';
import { ipa, respell, validateForm, syllabify, tokenize } from '../norsund/phonology.js';

test('IPA examples in grammar/01-phonology.yaml', () => {
  let n = 0;
  for (const rule of data.grammar.phonology.rules) {
    for (const ex of rule.examples || []) {
      if (!ex.ipa) continue;
      const dialect = rule.id === 'PHON-10' ? 'starisund' : 'common';
      assert.equal(ipa(ex.form, { dialect }), strip(ex.ipa), `${rule.id} ${ex.form}`);
      n++;
    }
  }
  assert.ok(n >= 12, `checked ${n} examples`);
});

test('IPA of canon names', () => {
  const cases = {
    Thiolden: 'ˈθjol.dən', Norsund: 'ˈnor.sund', Vilkyren: 'ˈvil.ky.rən', Kjoldmur: 'ˈcold.mur',
    Starirauggheim: 'ˈsta.riˌraugː.hejm', Starifjolden: 'ˈsta.riˌfjol.dən', Oudeheim: 'ˈou.dəˌhejm', Lysmar: 'ˈlys.mar', nay: 'nej', rie: 'ˈri.ə',
  };
  for (const [w, exp] of Object.entries(cases)) assert.equal(ipa(w), exp, w);
  assert.equal(ipa('Thiolden', { dialect: 'starisund' }), 'ˈsjol.dəŋ');
  assert.equal(ipa('kyr', { dialect: 'kullmyr' }), 'kir');
  assert.equal(ipa('heim', { dialect: 'nurmyr' }), 'ejm');
  assert.equal(ipa('vetha'), 'ˈve.ða');
  assert.equal(ipa('dauth'), 'dauð');
});

test('English-friendly respellings', () => {
  const cases = {
    Thiolden: 'THYOL-den', Auristar: 'OW-ree-star', Norsund: 'NOR-soond', Vilkyren: 'VIL-kü-ren', Kjoldmur: 'KYOLD-moor',
    Starirauggheim: 'STAR-ee-rowg-haym', Starifjolden: 'STAR-ee-fyol-den', Midelmar: 'MEE-del-mar', Oudeheim: 'OH-deh-haym', Lysmar: 'LÜS-mar',
  };
  for (const [w, exp] of Object.entries(cases)) assert.equal(respell(w), exp, w);
});

test('tokenizer and syllables', () => {
  assert.deepEqual(tokenize('kjold').map((t) => t.g), ['kj', 'o', 'l', 'd']);
  assert.deepEqual(tokenize('Thiolnay').map((t) => t.g), ['th', 'i', 'o', 'l', 'n', 'ay']);
  assert.deepEqual(syllabify('Vilkyren'), ['vil', 'ky', 'ren']);
  assert.deepEqual(syllabify('kull'), ['kull']);
});

test('phonotactic checker', () => {
  for (const w of ['kjold', 'thiol', 'strenk', 'grjot', 'kvit', 'Starirauggheim', 'Kjoldmur', 'Vilnayan', 'kjolddag']) assert.ok(validateForm(w).ok, w);
  for (const w of ['ngar', 'xelo', "Thor'Vale", 'kj', 'wandr', 'llam']) assert.ok(!validateForm(w).ok, w);
});
