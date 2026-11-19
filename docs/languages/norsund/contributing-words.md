# Contributing words and rules

Norsund belongs to the Drunken Dragon community. This page explains how a new word or grammar rule becomes canon, and how the language stays consistent while many people add to it. The process combines what works for other living conlangs:

- a small frozen core plus controlled growth, as with Esperanto's *Fundamento* and Academy;
- word tiers, as in Toki Pona's Linku survey;
- one steward who reviews before release, as Okrand and Frommer do for Klingon and Na'vi;
- batch releases, as with the Klingon Language Institute's new-word lists.

## Roles

| Role | Who | Does what |
|---|---|---|
| **Contributor** | anyone | proposes words, rules, texts and fixes by pull request |
| **Language Steward** | appointed by the lore lead (Vledic) | reviews every language PR for fit; suggests better forms; prepares batch releases; answers translation requests |
| **Voters** | contributors with voting power, as in the main [README](../../../README.md) | ratify batches like any other lore change; a change to the **core** tier needs a supermajority (two-thirds) |

The steward advises; the vote decides. Votes settle meaning and taste. Rules that a machine can check (letters, syllables, duplicates, glosses) are enforced automatically before anyone votes.

## Tiers and status

Every dictionary entry has a **tier** and a **status** ([README](../../../README.md#fictional-language-dictionary-records-lang-dictionaryv1)).

| Tier | Meaning | How it changes |
|---|---|---|
| **core** | the Swadesh-level basics, grammar words, canon roots and anything the grammar depends on | only by supermajority, and only in a new major version |
| **common** | the rest of the ratified vocabulary | by normal vote, in a batch |
| **sandbox** | proposed or informal words (slang, cant, one-off coinages) | anyone may add by PR; products may use them if they label them "sandbox" |

| Status | Meaning |
|---|---|
| **proposed** | in a PR or the sandbox, not yet voted |
| **ratified** | accepted by vote (all of Norsund 1.0, approved by the lore lead on 2026-11-19) |

## Proposing a word: step by step

1. **Look first.**
   - `node tools/cli.mjs en <english>` finds existing words.
   - `node tools/cli.mjs search <text>` searches everything.
   - Many ideas already have a word, or can be built from one (see [reference-grammar.md §10](reference-grammar.md#10-building-words)).
2. **Build before you invent.**
   - Try a compound: *fyrheim* "kitchen".
   - Try an affix: *-ir* agent, *-ning* action, *-eth* quality, *-ug* "full of", *-nuth* "without".
   - Try a kenning, for verse.
3. **If you need a new root**, invent it, don't borrow it:
   - It must follow Norsund's sound rules: run `node tools/cli.mjs check <word>`.
   - It must not be a real word in English, Norwegian, Swedish, Danish, Icelandic, German, Dutch, Spanish, Portuguese, French or Italian, especially not a common word, a slur, a brand or another franchise's name.
   - It must not sit too close to an existing Norsund word with a different meaning; `search` will show near neighbours.
   - It must sound like it belongs: short, stress on the first syllable, Norse-feeling clusters.
4. **Add the entry** to the right file in [`records/languages/norsund/dictionary/`](../../../records/languages/norsund/dictionary/), by meaning field (03 people … 14 actions). Use the template below.
5. **Run the checks** from the `tools/` folder:

   ```
   cd tools
   npm ci            # once
   npm test
   node cli.mjs validate
   node build.mjs    # regenerates dictionary.md, english-index.md and the workbench data
   ```

6. **Open a pull request** using the PR text below.

### Entry template

```yaml
- lemma: skirn                 # the word
  pos: noun                    # noun verb adj adv pron det prep conj part num interj affix name
  class: inanimate             # nouns: animate|inanimate; verbs: weak (all new verbs)
  gloss: [crystal]             # English meanings, most important first
  etymology: "new root"        # or how it was built: "skirn + lys", "Kedre krista"
  layer: native                # native | kedre | kedre-learned | old-norsund | foreign
  epoch: modern                # proto | old | contact | modern: when it entered the language
  tier: common                 # core | common | sandbox
  status: proposed
  notes: "the Starifjolden crystals; see records/thiolden/auristar/auristar.yaml"
  derived:
  - {lemma: skirnug, pos: adj, gloss: [crystalline]}
```

### Pull request text

```markdown
## Norsund: <short title>

**What:** <new words / rule change / fix>
**Why:** <the story, game or art that needs it; link to lore records>
**Entries:** <lemma — gloss, one per line>
**Built from existing roots?** <yes: how / no: why a new root>
**Checked against real languages:** <yes / notes>

- [ ] `npm test` passes
- [ ] `node cli.mjs validate` reports 0 errors
- [ ] `node build.mjs` run and generated files committed
- [ ] No real-language copies, slurs, brands or other franchises' names
```

## What the automatic checks catch

[`.github/workflows/norsund.yml`](../../../.github/workflows/norsund.yml) runs on every PR that touches `records/languages/` or `tools/`. It catches:

- **Broken files:** YAML that doesn't parse, missing headers, unknown document types.
- **Bad entries:** missing `lemma`, `pos` or `gloss`; unknown values for `pos`, `class`, `layer`, `epoch`, `register`, `tier` or `status`.
- **Duplicates:** the same lemma and part of speech defined twice.
- **Sound-rule breaks:** illegal letters, word-initial *ng*, clusters that aren't allowed. For cant and sandbox words these are warnings only.
- **Text records** whose morphemes and glosses don't line up.
- **Grammar regressions:** the engine tests replay all 31 sound-change cognates and the grammar's example paradigms.
- **Stale generated files:** a warning if the generated dictionary docs or workbench data weren't rebuilt.

## Batches and versions

- **Batches.** Ratified words are released in batches, not one at a time, so products can target a stable version. The steward collects accepted PRs and proposes a batch, for example monthly. The vote ratifies the batch.
- **Versions** follow semantic versioning:

  | Change | Version | Example |
  |---|---|---|
  | a core word, sound rule or grammar rule changes in a way that breaks existing text | **major** | 2.0.0 |
  | new words, new rules, new texts | **minor** | 1.1.0 |
  | typo, gloss or documentation fixes | **patch** | 1.0.1 |

- **Every release** gets an entry in [CHANGELOG.md](CHANGELOG.md) and updates the `version` field in the files it touches.
- **"Official Norsund"** in a product means: it passes the validator against a named version ("Norsund 1.0"). See [LICENSES.md](../LICENSES.md).

## When a product ships a mistake

Mistakes happen: a misspelt line in a game, a wrong plural in a published story. Norsund never silently erases a shipped form. Instead the steward records it, as Marc Okrand did for on-screen Klingon:

- **If it can be explained** by the grammar (a dialect, a register, an old form), document it as a **variant** in the entry's `notes` or `forms` (for example `forms: {variant: kjolde}`), with the product that used it.
- **If it can't**, add it to the **sandbox** tier with a note ("attested in <product>, <date>; not standard").
- The standard form stays the standard. New products should use it.

## Changing the grammar

Grammar rules live in [`grammar/`](../../../records/languages/norsund/grammar/) and have stable IDs (NOUN-02, VERB-10, …). To change one:

1. Open a PR that edits the rule and explains the reason.
2. Update every example and text that the change affects.
3. Run the tests. Several rules are executable: the noun and verb tables, the sound changes and the stress rule.
4. A change to a **core** rule (anything in 01 to 08) needs a supermajority and a major version.

## Licence

By contributing language material you agree to release it under [CC BY 4.0](../LICENSES.md) (code under MIT, fonts under SIL OFL).
