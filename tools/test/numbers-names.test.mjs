import test from 'node:test';
import assert from 'node:assert/strict';
import './helpers.mjs';
import { toNorsund, ordinal, parseNorsund } from '../norsund/numbers.js';
import { demonym, generatePlaceName, generatePersonName, checkName } from '../norsund/names.js';

test('numbers', () => {
  assert.equal(toNorsund(523208), 'thammhaun dovtamm thrim mork, dovhaun ath');
  assert.equal(toNorsund(7), 'sev');
  assert.equal(toNorsund(7, { dialect: 'starisund' }), 'stev');
  assert.equal(toNorsund(11), 'tammyn');
  assert.equal(toNorsund(17), 'tammsev');
  assert.equal(toNorsund(27), 'dovtamm sev');
  assert.equal(toNorsund(70), 'sevtamm');
  assert.equal(toNorsund(100), 'haun');
  assert.equal(toNorsund(523), 'thammhaun dovtamm thrim');
  assert.equal(ordinal(1), 'ura');
  assert.equal(ordinal(3), 'thrimde');
  assert.equal(ordinal(7, { dialect: 'starisund' }), 'stevde');
  assert.equal(ordinal(20), 'dovtamde');
  assert.equal(parseNorsund('langhaun'), 120);
  for (const n of [0, 1, 9, 10, 11, 19, 20, 99, 100, 101, 120, 999, 1000, 1001, 2026, 523208, 999999]) assert.equal(parseNorsund(toNorsund(n)), n, String(n));
});

test('demonyms follow WF-03', () => {
  const cases = { Thiolden: 'Thiolnay', Auristar: 'Aurinay', Oudeheim: 'Oudenay', Midelmar: 'Midelnay', Farheim: 'Farnay' };
  for (const [p, d] of Object.entries(cases)) assert.equal(demonym(p), d, p);
});

test('generated names are valid and repeatable', () => {
  for (let i = 0; i < 25; i++) {
    const p = generatePlaceName({ seed: `t${i}` });
    assert.ok(checkName(p.name).ok, p.name);
    assert.equal(generatePlaceName({ seed: `t${i}` }).name, p.name);
    const person = generatePersonName({ seed: `p${i}` });
    assert.ok(checkName(person.given).ok, person.given);
  }
  assert.equal(generatePlaceName({ generic: 'skyl', modifiers: ['nor'], allowExisting: true }).name, 'Norskyl');
});
