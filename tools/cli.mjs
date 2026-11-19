#!/usr/bin/env node
// norsund — command-line tools for Norsund. Run `node cli.mjs help` from tools/.
import { loadNorsund, loadFiles, REPO_ROOT } from './norsund/node.js';
import { validateFiles, formatReport } from './norsund/validate.js';
import { ipa, respell, validateForm, syllabify } from './norsund/phonology.js';
import { paradigm, analyze } from './norsund/morphology.js';
import { findEntries, lookupEnglish, search } from './norsund/lexicon.js';
import { gloss, englishToNorsund } from './norsund/translate.js';
import { generatePlaceName, generatePersonName, demonym, checkName } from './norsund/names.js';
import { toNorsund, ordinal, parseNorsund } from './norsund/numbers.js';
import { evolve, paths } from './norsund/soundchange.js';

const HELP = `norsund — tools for Norsund, the common tongue of Thiolden

Usage: node cli.mjs <command> [arguments] [options]

Dictionary
  lookup <word>               Norsund word -> entry (also finds inflected forms)
  en <english words>          English -> Norsund words
  search <text>               search lemmas and glosses
  inflect <lemma>             all forms (paradigm) of a word
  analyze <form>              break an inflected form into lemma + endings

Translation
  gloss "<norsund sentence>"  interlinear gloss (Leipzig style)
  translate "<english>"       English -> Norsund (rule-based; shows notes and unknown words)
  packet "<norsund line>"     writer/actor packet: line, IPA, respelling, gloss, Starisund accent

Sounds and names
  ipa <word> [--dialect D]    IPA (D = common, starisund, kullmyr, nurmyr, old)
  respell <word>              English-friendly pronunciation (THYOL-den)
  check <word>                does a new word follow Norsund's sound rules?
  name [place|person] [--count N] [--seed S] [--generic G] [--modifiers a,b]
  demonym <place>             Thiolden -> Thiolnay
  number <n> [--ordinal] [--dialect starisund]   or: number "dovtamm sev"
  evolve <proto-form> [--path norsund|old_norsund|starisund|kullmyr|kedre]

Scripts
  render lysrit|runes "<text>" [--out file.svg]   SVG in Lysrit or runes
  runes "<text>"               transliterate into runic characters

Repository
  validate [--verbose]        check every language record (exit code 1 on errors)
  build                       write tools/web/data/norsund.json and the generated dictionary docs

Options: --json prints machine-readable output where available.
`;

function parseArgs(argv) {
  const args = [];
  const opts = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith('--')) {
      const key = a.slice(2);
      const next = argv[i + 1];
      if (next !== undefined && !next.startsWith('--') && !['json', 'verbose', 'ordinal', 'plural-you', 'polite'].includes(key)) { opts[key] = next; i++; } else opts[key] = true;
    } else args.push(a);
  }
  return { args, opts };
}

function out(obj, opts, text) {
  if (opts.json) console.log(JSON.stringify(obj, null, 2));
  else console.log(text);
}

function fmtEntry(e) {
  const forms = e.forms ? ` forms: ${Object.entries(e.forms).map(([k, v]) => `${k} ${v}`).join(', ')}` : '';
  const cls = e.class ? ` ${e.class}` : '';
  const pron = /['’]/.test(e.lemma) ? '' : ` /${ipa(e.lemma, { parts: e.parts, layer: e.layer })}/  ${respell(e.lemma, { parts: e.parts, layer: e.layer })}`;
  return [
    `${e.lemma}${pron}`,
    `  ${e.pos}${cls} — ${e.gloss.join('; ')}${forms}`,
    e.etymology ? `  from: ${e.etymology}` : null,
    e.parts ? `  parts: ${e.parts.join(' + ')}` : null,
    e.attested ? `  seen in: ${e.attested.join(', ')}` : null,
    e.notes ? `  note: ${e.notes}` : null,
    `  [${[e.layer, e.register, e.tier, e.status].filter(Boolean).join(', ')}] ${e.file}`,
  ].filter(Boolean).join('\n');
}

async function main() {
  const { args, opts } = parseArgs(process.argv.slice(2));
  const cmd = args.shift();
  if (!cmd || cmd === 'help' || opts.help) { console.log(HELP); return 0; }

  if (cmd === 'validate') {
    const report = validateFiles(loadFiles(REPO_ROOT));
    if (opts.json) console.log(JSON.stringify(report, null, 2));
    else console.log(formatReport(report, { verbose: Boolean(opts.verbose) }));
    return report.errors.length ? 1 : 0;
  }
  if (cmd === 'build') {
    const { build } = await import('./build.mjs');
    const { report } = build();
    return report.errors.length ? 1 : 0;
  }

  loadNorsund();
  const text = args.join(' ');
  switch (cmd) {
    case 'lookup': {
      const direct = findEntries(text);
      const readings = analyze(text);
      if (opts.json) { out({ entries: direct, readings }, opts); break; }
      if (direct.length) console.log(direct.map(fmtEntry).join('\n\n'));
      const inflected = readings.filter((r) => r.tags);
      if (inflected.length) console.log(`\n${text} is a form of:\n${inflected.map((r) => `  ${r.lemma} (${r.pos}): ${r.morphemes} = ${r.gloss}`).join('\n')}`);
      if (!direct.length && !readings.length) {
        const s = search(text, 10);
        console.log(s.length ? `No entry "${text}". Did you mean: ${s.map((e) => e.lemma).join(', ')}` : `No entry "${text}".`);
        return 1;
      }
      break;
    }
    case 'en': {
      const res = args.map((w) => ({ english: w, norsund: lookupEnglish(w, { allowNames: true }).slice(0, 6) }));
      out(res, opts, res.map((r) => `${r.english}: ${r.norsund.length ? r.norsund.map((e) => `${e.lemma} (${e.pos}${e.class ? ` ${e.class}` : ''}: ${e.gloss.join(', ')})`).join('; ') : 'no match'}`).join('\n'));
      break;
    }
    case 'search': {
      const res = search(text, Number(opts.limit) || 30);
      out(res, opts, res.map((e) => `${e.lemma.padEnd(18)} ${e.pos.padEnd(6)} ${e.gloss.join(', ')}`).join('\n') || 'Nothing found.');
      break;
    }
    case 'inflect': {
      const p = paradigm(text, { dialect: opts.dialect });
      if (!p.length) { console.log(`No entry "${text}".`); return 1; }
      out(p.map((x) => ({ lemma: x.entry.lemma, pos: x.entry.pos, class: x.entry.class, forms: Object.fromEntries(x.rows) })), opts,
        p.map((x) => `${x.entry.lemma} (${x.entry.pos}${x.entry.class ? `, ${x.entry.class}` : ''}): ${x.entry.gloss.join(', ')}\n${x.rows.map(([k, v]) => `  ${k.padEnd(26)} ${v}`).join('\n')}`).join('\n\n'));
      break;
    }
    case 'analyze': {
      const r = analyze(text);
      out(r.map(({ entry, ...x }) => x), opts, r.length ? r.map((x) => `${x.form}: ${x.lemma} (${x.pos}) ${x.morphemes} = ${x.gloss}`).join('\n') : `Could not analyze "${text}".`);
      break;
    }
    case 'gloss': {
      const g = gloss(text);
      out(g, opts, `${text}\n${g.morphemes}\n${g.gloss}\n≈ ${g.translationGuess}`);
      break;
    }
    case 'translate': {
      const r = englishToNorsund(text, { dialect: opts.dialect, pluralYou: Boolean(opts['plural-you']), politeYou: Boolean(opts.polite) });
      out(r, opts, [`${r.norsund}`, `${r.morphemes}`, `${r.gloss}`,
        ...r.notes.map((n) => `note: ${n}`), r.unknown.length ? `unknown English words: ${r.unknown.join(', ')} (add them to the dictionary or rephrase)` : null].filter(Boolean).join('\n'));
      break;
    }
    case 'packet': {
      const g = gloss(text);
      const words = text.replace(/[.,!?;:]/g, ' ').split(/\s+/).filter(Boolean);
      const packet = {
        line: text,
        ipa: words.map((w) => ipa(w)).join(' '),
        respelling: words.map((w) => respell(w)).join(' '),
        starisund: words.map((w) => ipa(w, { dialect: 'starisund' })).join(' '),
        morphemes: g.morphemes,
        gloss: g.gloss,
        translationGuess: g.translationGuess,
      };
      out(packet, opts, [`LINE        ${packet.line}`, `SAY IT      ${packet.respelling}`, `IPA         [${packet.ipa}]`,
        `AURISTAR    [${packet.starisund}]`, `MORPHEMES   ${packet.morphemes}`, `GLOSS       ${packet.gloss}`, `MEANING ≈   ${packet.translationGuess}`,
        '', 'Stress the first syllable of every word. Record at normal speed, slow, and syllable by syllable.'].join('\n'));
      break;
    }
    case 'ipa': out({ word: text, ipa: ipa(text, { dialect: opts.dialect, narrow: Boolean(opts.narrow) }) }, opts, `[${ipa(text, { dialect: opts.dialect, narrow: Boolean(opts.narrow) })}]`); break;
    case 'respell': out({ word: text, respell: respell(text, { dialect: opts.dialect }) }, opts, respell(text, { dialect: opts.dialect })); break;
    case 'check': {
      const r = checkName(text);
      out(r, opts, [`${text}: ${r.ok ? 'OK' : 'NOT VALID'} (${r.syllables} syllables: ${syllabify(text).join('.')})`, ...r.errors.map((e) => `  error: ${e}`), ...r.warnings.map((w) => `  note: ${w}`)].join('\n'));
      return r.ok ? 0 : 1;
    }
    case 'name': {
      const kind = args[0] === 'person' ? 'person' : 'place';
      const count = Number(opts.count) || 5;
      const res = [];
      for (let i = 0; i < count; i++) {
        const seed = opts.seed !== undefined ? `${opts.seed}-${i}` : `${Date.now()}-${i}-${Math.random()}`;
        res.push(kind === 'person'
          ? generatePersonName({ seed })
          : generatePlaceName({ seed, generic: opts.generic, modifiers: opts.modifiers ? String(opts.modifiers).split(',') : undefined, allowExisting: Boolean(opts.modifiers) }));
      }
      out(res, opts, res.map((r) => (kind === 'person' ? `${r.name}\n  ${r.meaning}` : `${r.name}  "${r.meaning}"  (${r.parts.join(' + ')}; people: ${r.demonym}; say ${respell(r.name)})`)).join('\n'));
      break;
    }
    case 'demonym': out({ place: text, demonym: demonym(text) }, opts, demonym(text)); break;
    case 'number': {
      if (/^\d+$/.test(text)) {
        const v = Number(text);
        const res = opts.ordinal ? ordinal(v, { dialect: opts.dialect }) : toNorsund(v, { dialect: opts.dialect });
        out({ number: v, norsund: res }, opts, res);
      } else {
        const v = parseNorsund(text);
        out({ norsund: text, number: v }, opts, String(v));
      }
      break;
    }
    case 'evolve': {
      const path = opts.path || 'norsund';
      const r = evolve(text, path);
      out(r, opts, [`*${text.replace(/^\*/, '')} (${path})`, ...r.steps.map((s) => `  ${s.rule.padEnd(18)} ${s.before}  >  ${s.after}`), `= ${r.result}`].join('\n'));
      if (!paths().includes(path)) return 1;
      break;
    }
    case 'render': {
      const kind = args.shift();
      const t = args.join(' ');
      const scripts = await import('./norsund/scripts.js');
      const svg = kind === 'runes' ? scripts.renderRunes(t, opts) : scripts.renderLysrit(t, opts);
      if (opts.out) { (await import('node:fs')).writeFileSync(opts.out, svg); console.log(`Wrote ${opts.out}`); } else console.log(svg);
      break;
    }
    case 'runes': {
      const scripts = await import('./norsund/scripts.js');
      console.log(scripts.transliterateRunes(text, opts));
      break;
    }
    default:
      console.log(`Unknown command "${cmd}".\n\n${HELP}`);
      return 1;
  }
  return 0;
}

main().then((code) => { process.exitCode = code; }).catch((e) => { console.error(`error: ${e.message}`); process.exitCode = 1; });
