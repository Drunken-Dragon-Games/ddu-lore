# Norsund Workbench

A hosted copy of the workbench is published at https://claude.ai/artifact/CA2a7yRiUdNU4zfVPDGknV (private to its owner until shared). Republish it after `node build.mjs` by publishing `artifact.html` with `app.js`, `data/norsund.json` and `norsund/*.js` as supporting files.

A browser app for working with Norsund: look words up, translate, write in Lysrit and runes, forge names, explore sounds and sound history, convert numbers, and read every glossed text and grammar rule. It runs on the same engine (`tools/norsund/`) and data (`tools/web/data/norsund.json`) as the command-line tools, so the two never disagree.

## Run it

The app uses ES modules and fetches its data, so open it through a local web server, not as a file:

```sh
cd tools
node build.mjs                      # refresh data, engine copy and artifact.html (after any records/ change)
npx serve web                       # or: python3 -m http.server -d web 8000
```

Then open the printed address (for example http://localhost:3000 or http://localhost:8000). Each section has its own address: `#dictionary`, `#translate`, `#write`, `#names`, `#sounds`, `#numbers`, `#texts`, `#grammar`.

## Sections

| Section | What it does |
|---|---|
| Dictionary | Search by Norsund word, inflected form (*kjoldade*, *Vilkyrene*) or English meaning; browse by letter in Norsund alphabetical order; filter by meaning field and part of speech. An entry shows IPA (common and Auristar), an English-friendly respelling, every inflected form with IPA, etymology, compound parts, derived words, canon attestations, and the word in Lysrit and runes. |
| Translate | English → Norsund with an interlinear gloss and notes (dialect and polite-you options), and Norsund → word-by-word Leipzig gloss with a rough reading. |
| Write | Text in Lysrit and runes, with the sacred mark, long-branch or short-twig runes, charged (glowing) runes, size, and copy-as-SVG in light or dark colours. Includes the full Lysrit letter sheet and the rune row. |
| Names | Place-name forge (pick a generic and up to three modifiers), person names with parent-names, and a checker for any proposed name (sound rules, syllables, IPA, demonym, clashes with the dictionary). |
| Sounds | Pronunciation of a word in every dialect, the phonotactic checker, and a sound-change lab that shows each rule turning a Proto-Valian root into Old Norsund, Norsund, Starisund, Kullmyr and Kedre, plus the 31 cognate sets. |
| Numbers | Number ↔ Norsund words, ordinals, the Starisund seven, and a reference table. |
| Texts | Every `lang-text/v1` corpus in the repo with interlinear glosses. |
| Grammar | Every rule, example and table from `records/languages/norsund/grammar/`, plus the machine-readable data the tools use. |

## How the folder is built

| Path | Made by | Notes |
|---|---|---|
| `index.html` | hand | The page: markup and styles. Edit this one. |
| `app.js` | hand | All UI logic. Imports the engine from `./norsund/index.js`. |
| `data/norsund.json` | `node build.mjs` | All language data, compiled from the YAML records. |
| `norsund/*.js` | `node build.mjs` | A copy of the browser-safe engine modules from `tools/norsund/` (everything except `node.js`). |
| `artifact.html` | `node build.mjs` | `index.html` without the `<!doctype>`, `<html>`, `<head>` and `<body>` wrappers, for publishing as a claude.ai Artifact. |

The engine copy in `norsund/` is committed, not ignored, so the folder works as-is on any static host (GitHub Pages, a Discord bot's web view, an Artifact) without a build step. Never edit the copy: edit `tools/norsund/` and run `node build.mjs`. A CI step that runs the build and then `git diff --exit-code tools/web` would catch a forgotten rebuild.

## Publishing as an Artifact

Publish `artifact.html` as the page, with these supporting files at the same relative paths: `app.js`, `data/norsund.json` and every `norsund/*.js`.

## Design

The page follows the franchise palette: deep night-sky indigo, cyan stars, mint, violet for the sacred mark, and cool off-white stone. The typefaces are Big Shoulders Display for headings, Instrument Sans for text, Gentium Book Plus for every Norsund form and IPA, and JetBrains Mono for paths. It follows the system light or dark theme (there is a theme button in the header), works down to phone width, and respects reduced-motion settings. Lysrit and rune drawings inherit the page colours, and the "copy SVG" buttons export fixed light or dark colours so the drawings work anywhere.

## Limits

- English → Norsund handles simple clauses (tenses, modals, negation, questions, possessives, comparison, a few prepositions). Long or idiomatic English needs a person. Unknown English words are listed so you can look for a synonym or propose a word.
- Glosses pick the likeliest reading for each word's position; words with several readings are flagged.
- The Lysrit drawings mark an unstressed final *e* as ə automatically. The Lysrit font cannot, so type ə when using the font.
