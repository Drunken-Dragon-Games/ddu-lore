# The Drunken Dragon Universe Lore

Welcome to the repository containing the lore of **The Drunken Dragon Universe**, a fictional and decentralized fantasy universe. This universe is part of **The Drunken Dragon Fantasy Franchise**.

## How to Contribute

To contribute to the universe's lore, kindly fork the repository, create a branch from the `canon` main branch, add or modify records in the `./records` directory, and then create a pull request. After that, contributors with voting power can decide if the new records should be added to the universe's canon. This process also applies to alternate timelines and universes kept in branches within the repository.

Contributors to the lore can be given credit through the commit history.

For any product derived from The Drunken Dragon Franchise to become **official**, it must make a pull request with the added lore to this repository as part of the process of becoming official.

This repo allows the creation of alternate timelines by creating branches that follow the same rules as described earlier. The git system also helps in keeping a record of where the timeline branches from, as it maps directly to the commit history.

If GitHub or the process is too daunting for you but you still want to contribute your ideas, reach out to fellow Innkeeper or Lorekeeper in [Drunken Dragon Discord](https://discord.gg/drunkendragon) and they'll assist you to the best of their abilities. We promise not to bite.

## Visual Design

Concept boards, art direction and the tooling to generate more concept art live in [`visual-design/`](visual-design/README.md). They are design exploration, not canon: anything a board adds to the lore is listed there as a proposal and goes through the same review as any other record.

## Git Repository Usage

The use of a Git repository to manage the lore of The Drunken Dragon Universe ensures that the universe remains consistent and coherent. The use of versioning and a hierarchical structure allows for the easy addition of new facts and subtopics while ensuring that the universe remains consistent over time.

## Lore Definition Files

We keep track of the lore through the `Lore Definition Files`. These are YAML files with a header and a recursive list of facts from The Drunken Dragon Universe.

### Base Fact Records

To document the true facts of The Drunken Dragon Universe, we use the following YAML structure:

```yaml
document: fact-records/v1
topic: <topic_to_describe>
contributor: <optional_author_creator_discord_name_goes_here>
context: 
- <context_for_reader>
- <context_for_reader>
facts:
- <related_true_fact>
- <related_true_fact>
subtopics:

- topic: <derived_topic>
  contributor: <optional_author_creator_discord_name_goes_here>
  facts:
    - <related_true_fact>
    - <related_true_fact>
- topic: <derived_topic>
  contributor: <optional_author_creator_discord_name_goes_here>
  facts:
    - <related_true_fact>
    - <related_true_fact>
- import: <file_path_to_fact-record>
- import: <file_path_to_fact-record>
```

* `document`: a header that helps our tools detect the content of the file and allows readers to understand what to expect. We use `fact-record/v1` for recording facts, `lang-grammar/v1` for documenting fictional languages' grammar, and `lang-dictionary/v1` for documenting fictional language dictionaries.

* `topic`: describes what aspect of The Drunken Dragon Universe this record describes.

* `contributor`: optionally describes who contributed to the record in the event that a Pull Request is not used.

* `context`: adds the minimum facts the reader or the machine should know to understand the facts contained in this document.

* `facts`: describes the topic. Each fact can be a short sentence or a detailed paragraph that adds depth and detail to the universe.

* `subtopics` field allows for the creation of a hierarchical and recursive structure for the facts. Subtopics can be created for specific aspects of the main topic, allowing for a more organized and detailed representation of the universe.

* `import` field can be used to include other files with facts or subtopics. This allows for the reuse of common facts and ensures consistency in the universe. The path must point to a valid Lore Record Definition File

#### Example 

```yaml
document: fact-records/v1
topic: The Drunken Dragon Universe
contributor: Vledic#0001
context: 
- Dates use the Varian Imperial System of meassuring years, where year 0 is the founding of the Varian Empire
facts:
- Gods exist and are morally grey.
subtopics:
- topic: The World
  contributor: Vledic#0001
  facts:
  - Valia is a continent in the universe.
- import: ./magic-rules
```

### Fictional Language Records

The languages of the universe live in `records/languages/`. Norsund, the common tongue of Thiolden, is the first fully documented one. Its readable guides are in `docs/languages/`, and the tools that translate, check and render it are in `tools/` (see `tools/README.md`).

```
records/languages/
  languages.yaml              # overview of the languages of Valia (fact-record/v1)
  norsund/
    norsund.yaml              # facts about Norsund and the decisions behind it
    grammar/                  # lang-grammar/v1, one file per topic (01-phonology ... 14-poetics)
    dictionary/               # lang-dictionary/v1, one file per meaning field
    texts/                    # lang-text/v1, translated and glossed texts
  old-norsund/  kedre/        # related languages, same file types
  scripts/                    # lang-script/v1: runes (runar) and Lysrit
```

Every language file has the same header as a fact record (`document`, `topic`, `contributor`, `context`) plus `language` and `version`.

#### Fictional Language Grammar Records (`lang-grammar/v1`)

```yaml
document: lang-grammar/v1
language: norsund
version: 1.0.0
topic: Nouns
contributor: <discord_name>
status: ratified              # proposed | ratified
context:
- <context_for_reader>
morphology:                   # optional machine-readable tables used by tools/
  animate: {plural: en, definite: in, definite_plural: ene}
rules:
- id: NOUN-02                 # stable id, used to cite the rule
  title: Plural
  rule: <plain-English statement of the rule>
  examples:
  - {form: Vilkyr-en, gloss: free.sword-PL.AN, translation: free swords}
tables:                       # optional paradigm tables
- {id: NOUN-T1, title: <title>, columns: [...], rows: [[...]]}
```

Examples are glossed with the [Leipzig Glossing Rules](https://www.eva.mpg.de/lingua/resources/glossing-rules.php): hyphens split morphemes in `form`, and `gloss` has a matching label for each part.

#### Fictional Language Dictionary Records (`lang-dictionary/v1`)

```yaml
document: lang-dictionary/v1
language: norsund
version: 1.0.0
topic: War and hunt
field: war                    # meaning field of this file
contributor: <discord_name>
defaults: {layer: native, tier: common, status: ratified}   # applied to every entry
entries:
- lemma: kjold                # required: dictionary form
  pos: noun                   # required: noun verb adj adv pron det prep conj part num interj affix name
  class: inanimate            # nouns: animate | inanimate; verbs: weak | strong | irregular | modal | auxiliary
  gloss: [ward, guard-post, shield]   # required: English meanings
  forms: {plural: kjoldar}    # only irregular or notable forms
  parts: [nim, kjold]         # compound parts
  etymology: Old Norsund kjold < Proto-Valian *geldu
  layer: native               # native | kedre | kedre-learned | old-norsund | foreign
  epoch: proto                # proto | old | contact | modern: when it entered the language
  register: common            # common | starisund | old | poetic | learned | cant | sacred | kullmyr | nurmyr
  tier: core                  # core (frozen) | common | sandbox (unratified, usable if labelled)
  status: ratified            # proposed | ratified
  attested: [Nimkjold, Kjoldmur]   # canon names or records that use it
  notes: <usage, culture, idioms>
  derived:                    # words built from this one, same fields
  - {lemma: kjolda, pos: verb, class: weak, gloss: [to guard]}
```

#### Fictional Language Text Records (`lang-text/v1`)

```yaml
document: lang-text/v1
language: norsund
version: 1.0.0
topic: Sample texts
contributor: <discord_name>
texts:
- id: gate-inscription
  title: Gate inscription of the Kjoldmur
  register: carved
  source: records/thiolden/auristar/auristar.yaml
  context: <where and why it is said or written>
  lines:
  - text: Fjol starin lyser run ne.
    morphemes: fjol star-in lys-er run ne
    gloss: under star-DEF shine-PRS rune NEG      # one gloss token per morpheme token
    translation: Beneath the star, no rune shines.
```

#### Writing System Records (`lang-script/v1`)

Each script (for example `records/languages/scripts/lysrit.yaml`) lists its type, direction, history and every glyph with its sound value and stroke geometry, so that tools and fonts can draw it.

#### Adding a word

Propose words by pull request and run `node tools/cli.mjs validate` first. The process, tiers and review steps are in `docs/languages/norsund/contributing-words.md`.

### Versioning

To ensure compatibility and consistency, the lore records are versioned. Each record file contains a `document` field, which specifies the version of the record. This allows for the possibility of adding new versions of the same topic or subtopic, while still maintaining the previous versions in case they are needed for reference or backward compatibility.
