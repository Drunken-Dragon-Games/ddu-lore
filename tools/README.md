# Norsund tools

The engine and command-line tools for **Norsund**, the common tongue of Thiolden. They read the language records in
`records/languages/` and let you look words up, inflect them, translate, gloss, pronounce, name places and people,
trace sound changes, render the scripts, and check new words before you submit them.

The same engine runs in Node (this CLI) and in the browser workbench (`tools/web/`), so every tool gives the same answer.

## Install

You need Node.js 20 or newer.

```sh
cd tools
npm install
node cli.mjs help
```

## Commands

Run every command from `tools/`. Add `--json` for machine-readable output.

### Dictionary

| Command | Example | What you get |
|---|---|---|
| `lookup <word>` | `node cli.mjs lookup kjolder` | the entry, plus every inflected form it could be (`kjolda` "guard" + `-er`) |
| `en <english words>` | `node cli.mjs en wall blade` | Norsund words for English words, best match first |
| `search <text>` | `node cli.mjs search star` | lemmas and glosses containing the text |
| `inflect <lemma>` | `node cli.mjs inflect wandra` | the full paradigm (all forms) |
| `analyze <form>` | `node cli.mjs analyze Vilkyrenes` | `Vilkyr-ene-s` = `free.sword-DEF.PL.AN-GEN` |

### Translation

| Command | Example |
|---|---|
| `gloss "<norsund>"` | `node cli.mjs gloss "I nimin kjolder Tyr murin."` |
| `translate "<english>"` | `node cli.mjs translate "At night, Tyr guards the wall."` |
| `translate ... --dialect starisund --plural-you` | Auristar speech: living stars, polite plural *dyn* |
| `packet "<norsund line>"` | `node cli.mjs packet "Fjol starin lyser run ne."` |

`gloss` returns a Leipzig-style interlinear gloss and a rough English reading. `translate` is a rule-based
translator for simple sentences (tenses, modals, negation, questions, possessives, adjectives, numbers, prepositions,
one subordinate or relative clause, and evidential frames such as "I saw that ..." → `, sa`). It lists English words
it could not find, so you know what to add to the dictionary or rephrase. Check its output with `gloss` before you use it in canon.

`packet` prints what a voice actor or writer needs for one line: an English-friendly respelling, IPA, the Auristar
(Starisund) pronunciation, the morphemes and the gloss.

### Sounds, names and numbers

| Command | Example | Output |
|---|---|---|
| `ipa <word> [--dialect D]` | `node cli.mjs ipa Thiolden --dialect starisund` | `[ˈsjol.dəŋ]` |
| `respell <word>` | `node cli.mjs respell Auristar` | `OW-ree-star` |
| `check <word>` | `node cli.mjs check Norskyl` | whether a new word follows the sound rules |
| `name place [--count N] [--seed S] [--generic G] [--modifiers a,b]` | `node cli.mjs name place --generic skyl --count 5` | place names with meaning and demonym |
| `name person [--count N]` | `node cli.mjs name person` | given name + parent-name (+ byname) |
| `demonym <place>` | `node cli.mjs demonym Oudeheim` | `Oudenay` |
| `number <n> [--ordinal] [--dialect starisund]` | `node cli.mjs number 523208` | `thammhaun dovtamm thrim mork, dovhaun ath` |
| `number "<words>"` | `node cli.mjs number "dovtamm sev"` | `27` |
| `evolve <proto> [--path P]` | `node cli.mjs evolve telu` | each sound change from Proto-Valian *telu to `thiol` |

Dialects for `ipa`: `common`, `starisund` (Auristar), `kullmyr`, `nurmyr`, `old`. Paths for `evolve`: `norsund`,
`old_norsund`, `starisund`, `kullmyr`, `kedre`.

### Scripts

| Command | Example |
|---|---|
| `render lysrit "<text>" [--out file.svg]` | `node cli.mjs render lysrit "Auristar" --out auristar.svg` |
| `render runes "<text>" [--out file.svg]` | `node cli.mjs render runes "Thiolden" --out thiolden.svg` |
| `runes "<text>"` | `node cli.mjs runes "kjold"` |

Script rendering lives in `norsund/scripts.js` (see `records/languages/scripts/`).

### Repository

| Command | What it does |
|---|---|
| `validate [--verbose]` | checks every file in `records/languages/`; exit code 1 if there are errors |
| `build` (or `node build.mjs`) | writes `tools/web/data/norsund.json`, `docs/languages/norsund/dictionary.md` and `docs/languages/norsund/english-index.md` |

`npm test` runs the engine tests. GitHub Actions (`.github/workflows/norsund.yml`) runs the tests, the validator and
the build on every pull request that touches `records/languages/` or `tools/`.

## For contributors: checking a new word

1. Try to build the word from existing roots first (`node cli.mjs search <meaning>`, grammar/09-word-formation.yaml).
2. Check the form: `node cli.mjs check skyrnvang`. It must use only Norsund letters and allowed beginnings and endings.
3. Add the entry to the right file in `records/languages/norsund/dictionary/` (schema in the repository README).
4. Run `node cli.mjs validate`. It reports, with file and entry path:
   - missing or invalid fields (`pos`, `class`, `layer`, `register`, `tier`, `status`),
   - verbs that don't end in `-a`,
   - forms that break the sound rules (native and Old Norsund words only; Kedre loans and foreign names are skipped),
   - a lemma already defined with the same part of speech and class in any dictionary file,
   - text records whose morpheme and gloss lines have different numbers of words.
5. Run `node build.mjs` so the generated dictionary and the workbench data include your word, then open a pull request.

## How the engine is organised

```
tools/
  cli.mjs              command-line interface
  build.mjs            YAML -> web/data/norsund.json + generated dictionary docs
  norsund/
    index.js           public API (re-exports everything below)
    data.js            holds the loaded data; flattenDictionary() (file defaults, derived sub-entries)
    node.js            Node-only: reads the YAML with js-yaml and calls setData()
    phonology.js       tokenize, syllabify, ipa, respell, validateForm (grammar/01, 02)
    morphology.js      noun/verb/adjective/pronoun forms, paradigm(), analyze() (grammar/03-06, 09)
    lexicon.js         lookups by lemma and by English gloss, Norsund alphabetical order, search
    translate.js       gloss() and englishToNorsund()
    names.js           place and person name generator, demonym(), checkName() (grammar/11, WF-03)
    numbers.js         numbers and ordinals both ways (grammar/10)
    soundchange.js     the sound-change applier for grammar/13-history.yaml
    validate.js        record validator used by the CLI and CI
    scripts.js         Lysrit and rune rendering
  test/                node:test suites
  web/                 browser workbench; web/data/norsund.json is generated
```

Every rule table is read from the YAML, so editing a grammar file changes the tools without code changes. Only
`node.js` touches the file system. In the browser:

```js
import { setData, englishToNorsund } from './norsund/index.js';
setData(await (await fetch('data/norsund.json')).json());
englishToNorsund('Tyr guards the wall.').norsund; // 'Tyr kjolder murin.'
```

### Rule notation for sound changes

`grammar/13-history.yaml` uses a small notation that `soundchange.js` reads: `env` is a space-separated pattern where
`_` is the changing segment, `#` a word edge, `V C F L N` the categories, `[a b]` a set, and `?`, `+`, `*` mean optional,
one or more, zero or more. `unless` blocks a rule where its pattern matches. All matches in a word change at once.

## Spec issues found during the build

The tests and validator found these problems in the language records on 2026-11-19. All of them are fixed in `records/`:

1. Three cognates needed breathy *dh (*geldhu, *sundhu, *kwandhru), because Grimm's second shift turns plain *d into t.
2. Kedre's breathy stops now become f only at the start of a word and b/d elsewhere; gh becomes h.
3. *ilin* comes from Old Norsund *iliin* (long vowel), which the final-syllable reduction did not touch; a later rule shortens unstressed long vowels.
4. NOUN-T1 genitives are *nayni* and *rieni*, following NOUN-05.
5. PHON-02 now says a compound takes one secondary stress, as its examples show.
6. The onsets *tj* (tjorn) and others were added; *hver* "each" became *sver*; *thyrn-grjot* takes the hyphen ORTH-03 requires.
7. Stems in -a drop the a of a following -ar (kelda > keldar).

## Reference audio

`node audio/build_audio.mjs` (or `npm run audio`) regenerates the pronunciation recordings in `assets/audio/norsund/` from the engine's IPA with eSpeak NG (`brew install espeak-ng` or `apt-get install espeak-ng`). Before writing each file it checks that eSpeak will speak every phoneme exactly as the engine wrote it. `npm run audio:verify` decodes every file and checks speech, clipping, durations and one sound burst per syllable in the syllable takes. `npm run audio:check` runs only the phoneme check; CI runs it on every language pull request, so a new phrase that can't be voiced fails the build.
