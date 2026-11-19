import test from 'node:test';
import assert from 'node:assert/strict';
import { data } from './helpers.mjs';
import { evolve, applyRule, parseEnv } from '../norsund/soundchange.js';

test('all 31 cognates evolve as listed in 13-history', () => {
  const failures = [];
  assert.equal(data.grammar.history.cognates.length, 31);
  for (const c of data.grammar.history.cognates) {
    for (const [pathName, key] of [['norsund', 'norsund'], ['old_norsund', 'old_norsund'], ['kedre', 'kedre']]) {
      const got = evolve(c.pv, pathName).result;
      if (got !== c[key]) failures.push(`${c.pv} ${pathName}: ${got} != ${c[key]}`);
    }
  }
  assert.deepEqual(failures, []);
});

test('ilin keeps its vowel through the long-vowel route', () => {
  assert.equal(evolve('iliinu', 'old_norsund').result, 'iliin');
  assert.equal(evolve('iliinu', 'norsund').result, 'ilin');
});

test('rule notation: optional elements backtrack, sets, edges, unless', () => {
  const cats = { C: ['l', 'r', 't', 'd', 's', 'n'], L: ['l', 'r'] };
  assert.deepEqual(applyRule({ from: ['e'], to: ['j o'], env: '_ L? C u' }, ['th', 'e', 'l', 'u'], cats), ['th', 'j', 'o', 'l', 'u']);
  assert.deepEqual(applyRule({ from: ['j'], to: [''], env: '[kj gj] _' }, ['kj', 'j', 'o'], cats), ['kj', 'o']);
  assert.deepEqual(applyRule({ from: ['t'], to: ['th'], env: '_', unless: 's _' }, ['s', 't', 'a', 't'], cats), ['s', 't', 'a', 'th']);
  assert.deepEqual(parseEnv('# _ F', { F: ['e', 'i'] }).right[0].values, ['e', 'i']);
  assert.equal(evolve('telu').steps.map((s) => s.rule).join(','), 'grimm-1,breaking-u,final-u-loss');
  assert.equal(evolve('naghi').result, 'nay');
  assert.equal(evolve('luksi', 'kedre').result, 'luxi');
  assert.equal(evolve('telu', 'starisund').result, 'sjol'); // speech form [sjol]
});
