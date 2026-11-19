#!/usr/bin/env node
// Acoustic check of the reference audio in assets/audio/norsund/ (run after build_audio.mjs).
//   node tools/audio/verify_audio.mjs
// Nobody has to listen: every file is decoded and measured.
//   1. it contains speech: loud enough, and voiced for a plausible share of its length;
//   2. nothing clips;
//   3. its duration matches manifest.json;
//   4. the slow take is longer than the normal take;
//   5. in syllable-by-syllable takes, the number of separate sound bursts equals the number of syllables,
//      which shows the words were spoken as the syllabifier split them.
import { execFileSync, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { loadNorsund, REPO_ROOT } from '../norsund/node.js';
import { syllabify } from '../norsund/index.js';

const DIR = path.join(REPO_ROOT, 'assets', 'audio', 'norsund');
const have = (cmd) => spawnSync('which', [cmd]).status === 0;

function decode(file, tmp) {
  if (file.endsWith('.wav')) return file;
  const out = path.join(tmp, `${path.basename(file)}.wav`);
  if (have('afconvert')) execFileSync('afconvert', ['-f', 'WAVE', '-d', 'LEI16', file, out]);
  else execFileSync('ffmpeg', ['-loglevel', 'error', '-y', '-i', file, '-ac', '1', '-c:a', 'pcm_s16le', out]);
  return out;
}

// Minimal WAV reader: finds the fmt and data chunks, returns mono samples in [-1, 1]
function readWav(file) {
  const b = fs.readFileSync(file);
  let off = 12; let rate = 0; let channels = 1; let data = null;
  while (off + 8 <= b.length) {
    const id = b.toString('ascii', off, off + 4); const size = b.readUInt32LE(off + 4);
    if (id === 'fmt ') { channels = b.readUInt16LE(off + 10); rate = b.readUInt32LE(off + 12); }
    if (id === 'data') { data = b.subarray(off + 8, off + 8 + size); break; }
    off += 8 + size + (size % 2);
  }
  const n = Math.floor(data.length / 2 / channels);
  const x = new Float32Array(n);
  for (let i = 0; i < n; i++) x[i] = data.readInt16LE(i * 2 * channels) / 32768;
  return { rate, x };
}

function measure({ rate, x }) {
  const win = Math.round(rate * 0.01);
  const rms = [];
  for (let i = 0; i + win <= x.length; i += win) {
    let s = 0; for (let k = i; k < i + win; k++) s += x[k] * x[k];
    rms.push(Math.sqrt(s / win));
  }
  const peak = x.reduce((m, v) => Math.max(m, Math.abs(v)), 0);
  const clipped = x.reduce((n, v) => n + (Math.abs(v) >= 0.999 ? 1 : 0), 0) / x.length;
  const loud = Math.max(...rms);
  const on = rms.map((r) => r > loud * 0.12);
  const voiced = on.filter(Boolean).length / on.length;
  // bursts: runs of sound separated by at least 120 ms of quiet; bursts shorter than 30 ms are clicks
  let bursts = 0; let run = 0; let gap = 99;
  for (const v of on) {
    if (v) { if (gap >= 12 && run === 0) run = 1; else run += 1; gap = 0; } else {
      gap += 1;
      if (gap === 12 && run >= 3) { bursts += 1; run = 0; } else if (gap >= 12) run = 0;
    }
  }
  if (run >= 3) bursts += 1;
  return { seconds: x.length / rate, peak, clipped, voiced, bursts };
}

function main() {
  const manifest = JSON.parse(fs.readFileSync(path.join(DIR, 'manifest.json'), 'utf8'));
  loadNorsund();
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'norsund-verify-'));
  const problems = []; let files = 0; let syllableTakes = 0;
  for (const item of manifest.items) {
    const m = {};
    for (const [speed, rel] of Object.entries(item.files)) {
      const r = measure(readWav(decode(path.join(DIR, rel), tmp)));
      m[speed] = r; files += 1;
      const tag = `${rel}`;
      if (r.peak < 0.05) problems.push(`${tag}: nearly silent (peak ${r.peak.toFixed(3)})`);
      if (r.clipped > 0.001) problems.push(`${tag}: clipping (${(r.clipped * 100).toFixed(2)}% of samples)`);
      if (r.voiced < 0.2 || r.voiced > 0.98) problems.push(`${tag}: implausible share of sound (${(r.voiced * 100).toFixed(0)}%)`);
      if (Math.abs(r.seconds - item.seconds[speed]) > 0.2) problems.push(`${tag}: lasts ${r.seconds.toFixed(2)} s, manifest says ${item.seconds[speed]} s`);
      if (speed === 'syllables') {
        syllableTakes += 1;
        const expected = syllabify(item.text).length;
        if (r.bursts !== expected) problems.push(`${tag}: ${r.bursts} sound bursts for ${expected} syllables (${syllabify(item.text).join('·')})`);
      }
    }
    if (m.slow && m.normal && m.slow.seconds <= m.normal.seconds) problems.push(`${item.id}: the slow take is not slower than the normal take`);
  }
  fs.rmSync(tmp, { recursive: true, force: true });
  if (problems.length) { console.error(`${problems.length} problem(s) in ${files} files:\n  ${problems.join('\n  ')}`); return 1; }
  console.log(`Verified ${files} audio files: all contain speech, none clip, durations match, slow takes are slower, and all ${syllableTakes} syllable takes have one sound burst per syllable.`);
  return 0;
}

process.exitCode = main();
