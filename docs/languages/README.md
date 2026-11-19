# Languages of the Drunken Dragon Universe

This folder holds the readable guides to the languages of Valia. The language records themselves (grammar, dictionary, texts and scripts, in YAML) are in [`records/languages/`](../../records/languages/), next to the rest of the lore. The tools that check and use them are in [`tools/`](../../tools/).

Two published pages (private to their owner until shared): the **Norsund overview** at https://claude.ai/artifact/567B2qUyWBWA8wHfJRoWDw (source: [norsund/overview-page.html](norsund/overview-page.html)) and the **Norsund Workbench** at https://claude.ai/artifact/CA2a7yRiUdNU4zfVPDGknV (source: [tools/web/](../../tools/web/README.md)). The research behind the design is in [research/](research/conlang-craft-report.md). Reference audio is in [assets/audio/norsund/](../../assets/audio/norsund/README.md) and production art sheets for the scripts are in [norsund/img/](norsund/writing-systems.md#production-art-direction).

## The languages

| Language | Who speaks it | Status | Guide |
|---|---|---|---|
| **Norsund** | the common tongue of Thiolden | complete, version 1.0 | [norsund/](norsund/README.md) |
| **Old Norsund** | the settlers of 450 b.v.e.; still used for oaths, law, liturgy and runes | sketch | [old-norsund.md](old-norsund.md) |
| **Kedre** | the Vairean Empire | sketch | [kedre.md](kedre.md) |
| Other tongues | dwarves of Karhak'Modan, the Ik'nal'tar, Ath'alan elves, Merfolk, Vulkin, Dragonkin | scope notes only | [records/languages/languages.yaml](../../records/languages/languages.yaml) |

```
Proto-Valian
├── Proto-Norsund (Farheim)
│   └── Old Norsund (settlers, rune slates)
│       └── Norsund
│           ├── common Norsund (Vilnayan towns)
│           ├── Starisund (Auristar)
│           └── Farheim, Kullmyr and Nurmyr speech; Thieves' cant
└── Kedre (Keras, the Vairean Empire)
```

## Who should read what

| You are… | Start with |
|---|---|
| a **fan** who wants to read and say things | [Learn Norsund in 10 lessons](norsund/learn-norsund.md), [phrasebook](norsund/phrasebook.md) |
| a **lore writer** | [naming guide](norsund/naming-guide.md), [writers and actors kit](norsund/writers-and-actors-kit.md), [dialects](norsund/dialects.md) |
| an **artist or designer** | [writing systems](norsund/writing-systems.md) (runes and Lysrit, fonts, hate-symbol screening) |
| a **voice actor** or narrator | [pronunciation guide](norsund/pronunciation-guide.md), the actor packet in the [kit](norsund/writers-and-actors-kit.md#the-actor-packet) |
| a **game developer** | [tools/README.md](../../tools/README.md), the [workbench](../../tools/web/README.md), the fonts in [assets/fonts](../../assets/fonts/) |
| a **contributor** adding words | [contributing words](norsund/contributing-words.md), the [README schemas](../../README.md#fictional-language-records) |
| a **conlanger** curious about the design | [reference grammar](norsund/reference-grammar.md), [research report](research/conlang-craft-report.md) |

## Also here

- [LICENSES.md](LICENSES.md): the language is CC BY 4.0, fonts SIL OFL, tools MIT.
- [research/](research/): the research behind the design. It covers how languages like Dothraki, High Valyrian, Klingon and Na'vi were built and governed, with sources.
