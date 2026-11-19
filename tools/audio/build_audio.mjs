#!/usr/bin/env node
// Builds the Norsund reference audio in assets/audio/norsund/ with eSpeak NG (GPL-3.0 program; the audio it
// produces is ours and is released CC BY 4.0 with the rest of the language).
//
//   brew install espeak-ng        # or: apt-get install espeak-ng
//   node tools/audio/build_audio.mjs [--only names|phrases|texts] [--check]
//
// Every item is spoken from the engine's IPA, not from spelling, so the audio follows grammar/01 exactly:
// stress, th [θ]/[ð], kj [c], gj [ɟ], y [y], tapped r between vowels, trilled r elsewhere, long consonants.
// For each item the script asks eSpeak to echo the phonemes it will speak (--ipa) and fails if any sound
// was dropped or changed, so files are verified without anyone having to listen to them.
// Output: normal speed, slow, and (for names) syllable by syllable, as the actors' protocol in
// docs/languages/norsund/writers-and-actors-kit.md asks. WAV files are converted to AAC (.m4a) with
// afconvert on macOS or ffmpeg elsewhere; if neither exists, WAV files are kept.
import { execFileSync, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import yaml from 'js-yaml';
import { loadNorsund, REPO_ROOT } from '../norsund/node.js';
import * as N from '../norsund/index.js';

const OUT = path.join(REPO_ROOT, 'assets', 'audio', 'norsund');
const VOICE = 'nb'; // Norwegian voice: it has every Norsund phoneme (y, θ, ð, c, ɟ, ŋ, trilled and tapped r)
const SPEED = { normal: 145, slow: 95, syllables: 110 };

const NAMES = ['Norsund', 'Thiolden', 'Thiolnay', 'Auristar', 'Aurinay', 'Starisund', 'Vilkyr', 'Vilkyren', 'Vilnay', 'Vilnayan',
  'Nimkjold', 'Kjoldmur', 'Norstarkjold', 'Starifjolden', 'Starirauggheim', 'Midelmar', 'Oudeheim', 'Marheim', 'Farheim',
  'Sundwanderen', 'Lysmar', 'Lysrit', 'runar', 'Kullmyr', 'Nurmyr', 'Runmyren', 'Ilinvirden', 'Virnayen', 'Tyr', 'Vimtyr',
  'Dethiol', 'Stevlysen', 'Stardul', 'Valnor', 'Ulfkin', 'Kedre'];

const IPA_TO_ESPEAK = { θ: 'T', ð: 'D', ŋ: 'N', ə: '@', ɟ: 'J', c: 'c', 'ˈ': "'", 'ˌ': ',', 'ː': ':' };
const VOWELS = new Set(['a', 'e', 'i', 'o', 'u', 'y', 'ə']);

function have(cmd) { return spawnSync('which', [cmd]).status === 0; }

// '[ˈau.ri.star]' -> "'au*istaR"; long consonants are doubled, r is tapped between vowels and trilled elsewhere
export function ipaToEspeak(ipa) {
  const s = ipa.replace(/[[\]]/g, '').replace(/\./g, '');
  let out = '';
  const chars = [...s];
  for (let k = 0; k < chars.length; k++) {
    const ch = chars[k];
    const prev = chars[k - 1];
    if (ch === 'ː') { out += prev && !VOWELS.has(prev) ? IPA_TO_ESPEAK[prev] || prev : ':'; continue; }
    if (ch === 'r' || ch === 'ɾ') {
      const before = [...chars.slice(0, k)].reverse().find((x) => !'ˈˌ'.includes(x));
      const after = chars.slice(k + 1).find((x) => !'ˈˌ'.includes(x));
      out += before && after && VOWELS.has(before) && VOWELS.has(after) ? '*' : 'R';
      continue;
    }
    out += IPA_TO_ESPEAK[ch] ?? ch;
  }
  return out;
}

// What eSpeak should echo back for a phoneme string (its --ipa output, normalized)
function expectedEcho(esp) {
  return esp.replace(/'/g, 'ˈ').replace(/,/g, 'ˌ').replace(/T/g, 'θ').replace(/D/g, 'ð').replace(/N/g, 'ŋ').replace(/@/g, 'ə')
    .replace(/J/g, 'ɟ').replace(/\*/g, 'ɾ').replace(/R/g, 'r').replace(/:/g, 'ː');
}
const strip = (x) => x.replace(/[ˈˌ\s_]/g, '').replace(/ɹ/g, 'r').replace(/ʋ/g, 'v').replace(/ɡ/g, 'g');

function espeakEcho(phonemes) {
  return execFileSync('espeak-ng', ['-v', VOICE, '-q', '--ipa', phonemes], { encoding: 'utf8' }).trim();
}

function speak(phonemeText, speed, wavPath) {
  execFileSync('espeak-ng', ['-v', VOICE, '-s', String(speed), '-g', '6', '-w', wavPath, phonemeText]);
}

function encode(wav, base) {
  if (have('afconvert')) { execFileSync('afconvert', ['-f', 'm4af', '-d', 'aac', '-b', '32000', wav, `${base}.m4a`]); fs.rmSync(wav); return `${base}.m4a`; }
  if (have('ffmpeg')) { execFileSync('ffmpeg', ['-loglevel', 'error', '-y', '-i', wav, '-c:a', 'aac', '-b:a', '32k', `${base}.m4a`]); fs.rmSync(wav); return `${base}.m4a`; }
  fs.renameSync(wav, `${base}.wav`); return `${base}.wav`;
}

function wavSeconds(wav) {
  const b = fs.readFileSync(wav);
  const rate = b.readUInt32LE(24); const bytesPerSec = b.readUInt32LE(28);
  return rate ? (b.length - 44) / bytesPerSec : 0;
}

// A sentence -> words -> engine IPA -> eSpeak phonemes; punctuation becomes a pause
function sentenceToPhonemes(text, dialect) {
  const chunks = [];
  for (const raw of text.split(/\s+/)) {
    const word = raw.replace(/[.,!?;:"“”()«»]/g, '');
    if (!word) continue;
    const ipa = N.ipa(word.replace(/['’]/g, ''), { dialect });
    chunks.push({ word, ipa, esp: ipaToEspeak(ipa), pause: /[.,!?;:]$/.test(raw) });
  }
  return chunks;
}

function slug(s) { return s.toLowerCase().normalize('NFD').replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '-').slice(0, 48); }

function build({ only, checkOnly }) {
  if (!have('espeak-ng')) { console.error('espeak-ng is not installed. Install it (brew install espeak-ng) and run again.'); return 2; }
  loadNorsund();
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'norsund-audio-'));
  const manifest = { generated: new Date().toISOString().slice(0, 10), engine: 'eSpeak NG', voice: VOICE, speeds_wpm: SPEED,
    licence: 'CC BY 4.0 (The Drunken Dragon Universe lore contributors)',
    note: 'Synthetic reference audio generated from the engine IPA. Human recordings following docs/languages/norsund/writers-and-actors-kit.md may replace these files; keep the same names.',
    items: [] };
  const errors = [];

  const items = [];
  if (!only || only === 'names') for (const n of NAMES) items.push({ group: 'names', id: slug(n), text: n, syllables: true });
  if (!only || only === 'phrases' || only === 'texts') {
    for (const file of ['01-samples.yaml', '04-phrasebook.yaml']) {
      if (only === 'phrases' && file !== '04-phrasebook.yaml') continue;
      if (only === 'texts' && file !== '01-samples.yaml') continue;
      const doc = yaml.load(fs.readFileSync(path.join(REPO_ROOT, 'records/languages/norsund/texts', file), 'utf8'));
      const group = file.startsWith('04') ? 'phrases' : 'texts';
      for (const t of doc.texts) t.lines.forEach((l, i) => items.push({ group, id: `${t.id}-${i + 1}`, text: l.text, translation: l.translation,
        dialect: /starisund|auristar/i.test(`${t.register || ''} ${t.title || ''}`) ? 'starisund' : 'common' }));
    }
  }

  for (const it of items) {
    const chunks = sentenceToPhonemes(it.text, it.dialect || 'common');
    if (!chunks.length) continue;
    const ipa = chunks.map((c) => c.ipa).join(' ');
    // verify each word: what eSpeak will say must match the engine IPA segment for segment
    for (const c of chunks) {
      const echo = espeakEcho(`[[${c.esp}]]`);
      if (strip(echo) !== strip(expectedEcho(c.esp))) errors.push(`${it.id}: "${c.word}" ipa ${c.ipa} -> espeak said ${echo}`);
    }
    if (checkOnly) continue;
    const dir = path.join(OUT, it.group);
    fs.mkdirSync(dir, { recursive: true });
    const rec = { id: it.id, group: it.group, text: it.text, ipa: `[${ipa}]`, respelling: N.respell(it.text.replace(/[.,!?;:"“”()]/g, '')),
      translation: it.translation, dialect: it.dialect || 'common', files: {}, seconds: {} };
    const variants = { normal: chunks.map((c) => `[[${c.esp}]]${c.pause ? ',' : ''}`).join(' '),
      slow: chunks.map((c) => `[[${c.esp}]],`).join(' ') };
    if (it.syllables) {
      const sylls = N.syllabify(it.text);
      variants.syllables = sylls.map((s) => `[[${ipaToEspeak(N.ipa(s)).replace(/['ˌ,]/g, '')}]],`).join(' ');
    }
    for (const [speed, text] of Object.entries(variants)) {
      const wav = path.join(tmp, `${it.id}-${speed}.wav`);
      speak(text, SPEED[speed], wav);
      const secs = wavSeconds(wav);
      const syl = Math.max(1, chunks.reduce((n, c) => n + N.syllableCount(c.word), 0));
      if (speed === 'normal' && (secs / syl < 0.08 || secs / syl > 0.9)) errors.push(`${it.id}: ${secs.toFixed(2)} s for ${syl} syllables looks wrong`);
      const file = encode(wav, path.join(dir, `${it.id}-${speed}`));
      rec.files[speed] = path.relative(OUT, file);
      rec.seconds[speed] = Number(secs.toFixed(2));
    }
    manifest.items.push(rec);
  }
  fs.rmSync(tmp, { recursive: true, force: true });
  if (errors.length) { console.error(`${errors.length} problem(s):\n  ${errors.join('\n  ')}`); return 1; }
  if (checkOnly) { console.log(`Checked ${items.length} items: eSpeak will speak every phoneme as the engine wrote it.`); return 0; }
  fs.writeFileSync(path.join(OUT, 'manifest.json'), `${JSON.stringify(manifest, null, 1)}\n`);
  const n = manifest.items.reduce((k, r) => k + Object.keys(r.files).length, 0);
  console.log(`Wrote ${n} audio files for ${manifest.items.length} items to ${path.relative(REPO_ROOT, OUT)}/ (manifest.json lists them).`);
  return 0;
}

const argv = process.argv.slice(2);
const only = argv.includes('--only') ? argv[argv.indexOf('--only') + 1] : null;
process.exitCode = build({ only, checkOnly: argv.includes('--check') });
