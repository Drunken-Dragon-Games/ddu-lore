import test from 'node:test';
import assert from 'node:assert/strict';
import { loadFiles, REPO_ROOT } from './helpers.mjs';
import { validateFiles } from '../norsund/validate.js';

// Spec issues the validator catches in the hand-written spec files (reported to the language steward):
// hver (no "hv" onset in 01-phonology; "hw" is listed) and tjorn (no "tj" onset).
const KNOWN = new Set(['hver', 'tjorn']);

test('spec files (grammar, dictionary 00-02) pass the validator apart from known spec issues', () => {
  const files = loadFiles(REPO_ROOT).filter((f) => /norsund\/grammar\//.test(f.path) || /norsund\/dictionary\/0[0-2]-/.test(f.path));
  assert.ok(files.length >= 17);
  const report = validateFiles(files);
  const unexpected = report.errors.filter((e) => !KNOWN.has(e.lemma));
  assert.deepEqual(unexpected.map((e) => `${e.at}: ${e.message}`), []);
});

test('validator catches bad entries', () => {
  const doc = {
    document: 'lang-dictionary/v1', language: 'norsund', version: '1.0.0', entries: [
      { lemma: 'ngar', pos: 'noun', class: 'animate', gloss: ['x'] },
      { lemma: 'kyrz', pos: 'noun', gloss: ['y'] },
      { lemma: 'bad', pos: 'verb', class: 'weak', gloss: ['z'] },
      { lemma: 'ok', pos: 'adv', gloss: ['also'], tier: 'gold' },
      { lemma: 'ok', pos: 'adv', gloss: ['again'] },
    ],
  };
  const r = validateFiles([{ path: 'x.yaml', doc }]);
  const msgs = r.errors.map((e) => e.message).join('\n');
  assert.match(msgs, /cannot start a word/);
  assert.match(msgs, /nouns need class/);
  assert.match(msgs, /letter "z"/);
  assert.match(msgs, /verb infinitives end in -a/);
  assert.match(msgs, /tier "gold"/);
  assert.match(msgs, /duplicate/);
});

test('text records: morphemes and gloss must align', () => {
  const doc = { document: 'lang-text/v1', language: 'norsund', version: '1', texts: [{ id: 't', lines: [{ text: 'Tyr kjolder.', morphemes: 'Tyr kjold-er', gloss: 'Tyr', translation: 'Tyr guards.' }] }] };
  const r = validateFiles([{ path: 't.yaml', doc }]);
  assert.match(r.errors.map((e) => e.message).join('\n'), /morphemes has 2 words but gloss has 1/);
});
