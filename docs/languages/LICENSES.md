# Licences for the languages of the Drunken Dragon Universe

These licences were chosen for Norsund 1.0 on 2026-11-19 by the lore lead. The lore records themselves follow the repository's own terms.

| What | Where | Licence |
|---|---|---|
| Grammars, dictionaries, texts and script definitions | `records/languages/**` | [Creative Commons Attribution 4.0 (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/) |
| Guides and documentation | `docs/languages/**` | CC BY 4.0 |
| Fonts (Lysrit, Runar) | `assets/fonts/**` | [SIL Open Font License 1.1](https://openfontlicense.org) |
| Reference audio | `assets/audio/**` | CC BY 4.0 (generated with eSpeak NG, whose GPL licence does not cover its output) |
| Tools and code | `tools/**` | [MIT](https://opensource.org/license/mit) |

## Why these licences

No court has decided whether a constructed language can be copyrighted. The court in *Paramount v. Axanar* (2016) said it did not need to reach the question, and the Language Creation Society argues that a language itself is free for anyone to use, while specific dictionaries, texts and dialogue are protected works. An open licence removes the doubt for everyone building on Norsund: fans, writers, game makers and the derived products that want to become official.

- **CC BY 4.0** lets anyone use, adapt and publish Norsund material, including commercially, as long as they credit "The Drunken Dragon Universe lore contributors".
- **SIL OFL** is the standard licence for free fonts. It allows embedding the fonts in games and art.
- **MIT** keeps the tools easy to reuse.

## What "official Norsund" means

Using Norsund is free. Calling a product's Norsund **official** means it passes `node tools/cli.mjs validate` against a named version of the language (for example "Norsund 1.0") and follows the process in `docs/languages/norsund/contributing-words.md`. The Drunken Dragon name and any official badge are protected by the franchise's trademarks, not by these licences.

## Contributor agreement

By opening a pull request that adds or changes language material, you agree that your contribution is released under the licence of the folder it goes into.
