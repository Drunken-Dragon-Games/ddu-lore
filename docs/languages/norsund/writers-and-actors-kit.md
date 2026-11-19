# Writers and actors kit

How to use Norsund in stories, games, art, audio and video without getting it wrong. Pronunciation: [pronunciation-guide.md](pronunciation-guide.md). Ready-made lines: [phrasebook.md](phrasebook.md).

## How much Norsund to show

A little Norsund goes a long way. Readers and players should feel the language, not have to study it.

| Use | How much | Example |
|---|---|---|
| **Names** of places, peoples, gods, titles | always Norsund | *Thiolden, the Kjoldmur, the Vilkyren, Lysmar* |
| **Greetings, toasts, curses, oaths** | Norsund, meaning clear from context | "*Kjal, thiolen!* Astrid raised her tankard." |
| **Dialogue** | short Norsund phrases at key moments; the rest in English | one line per scene, at most |
| **Songs, inscriptions, prophecies, oaths** | Norsund in full, with a translation nearby | the gate inscription, Kilia's song |
| **Narration** | English | |

Rules of thumb:

- **Give the meaning without a footnote.** Let a character repeat it in English, react to it, or let the action show it.
- **Italicise Norsund phrases in prose** (*Starkjold!*), but not names (Thiolden).
- **Keep standard spellings:** Midelmar, Haakon, Volggan, Vairean (ORTH-06).
- **Never give a Norsund word an English plural** (*the Vilkyrs* ✗). Use the Norsund plural or an English phrase: *the Vilkyren*, *the free swords*.

## Subtitles and on-screen text

- **Games and video:** subtitle spoken Norsund in English, in italics or between ‹ › marks, so viewers know it was Norsund. Leave short, obvious phrases (*Kjal!*, *Thiol!*) unsubtitled.
- **UI text** (menus, item names, tooltips): English, with Norsund names for places, factions and lore items.
- **Art and set dressing** (signs, banners, carvings): write in [Lysrit or runes](writing-systems.md), using real Norsund. Fans will decode it. The fonts in [`assets/fonts/`](../../../assets/fonts/) type it, and `node tools/cli.mjs render lysrit "<text>" --out file.svg` draws it.
- **Runes in Auristar never glow.** A glowing rune is rune magic, which Auristar forbids. Plain carved runes are fine anywhere.
- **Screen rune art for hate symbols** before release, against the [ADL Hate Symbols database](https://www.adl.org/resources/hate-symbols/search). The rune row was designed to avoid them, but bind-runes and logos made from it still need a person's check.

## Writing in English about Norsund things (NAME-08)

- Keep established Norsund names in English prose.
- Translate a title or byname in narration the first time, then use whichever reads better: "Vimtyr, the Whispering Axe", then "Vimtyr".
- In dialogue, characters use the Norsund title: "*Lysa*, the Kjoldmur is breached."

## Getting a translation

**Do it yourself first.** The tools handle most short lines.

```
node tools/cli.mjs translate "The stars guard the city."
node tools/cli.mjs gloss "Ma staren kjolda dun."
node tools/cli.mjs en tavern            # find a word
node tools/cli.mjs inflect kjolda       # every form of a word
```

The translator is rule-based. It tells you which words it didn't know and adds notes; the second line below is one of those notes.

```
Stararne kjolder burdin.
note: In Starisund (Auristar) stars are living beings: staren, starene. Use --dialect starisund.
```

**Then ask for a review.** Open an issue or pull request titled "Translation request" with the following, and the Language Steward will reply with a checked line and an actor packet:

1. the English line;
2. who says it and to whom;
3. where they're from (Auristar or elsewhere) and the register (everyday, oath, song, inscription);
4. your attempt, if you made one.

**Words that don't exist yet.** Request them (see [contributing-words.md](contributing-words.md)). Until they're ratified, a product may use a *sandbox* word if it is labelled as such in the product's credits or notes.

## The actor packet

Every recorded line gets a four-part packet: the English line, the Norsund line, a phonetic respelling, and audio at three speeds. The CLI prints the first three:

```
$ node tools/cli.mjs packet "Fjol starin lyser run ne."
LINE        Fjol starin lyser run ne.
SAY IT      FYOL STAR-in LÜ-ser ROON NEH
IPA         [fjol ˈsta.rin ˈly.sər run ne]
AURISTAR    [fjol ˈsta.riŋ ˈly.sər ruŋ ne]
MORPHEMES   Fjol star-in lys-er run ne
GLOSS       under star-DEF shine-PRS rune NEG
MEANING ≈   under the star shine rune not
```

The machine "meaning" is word by word. Always pair it with the real translation, here "Beneath the star, no rune shines."

## Audio protocol

1. **Three takes per line:**
   1. normal speed, in character;
   2. slowly and clearly;
   3. syllable by syllable, with a short pause between syllables.
2. **Name the files** `<line-id>_<speed>.wav`: for example `gate-inscription_normal.wav`, `_slow.wav`, `_syllables.wav`.
3. **Use the pronunciation reference** in [assets/audio/norsund/](../../../assets/audio/norsund/README.md): every canon name (normal, slow and syllable by syllable), the whole phrasebook and the sample texts, generated from the IPA and checked phoneme by phoneme. `manifest.json` maps each line to its files. Match the reference before adding character, and replace a synthetic file with your human take under the same name.
4. **Keep accents consistent per character** across a whole production (see below). The pronunciation guide lists the common mistakes: *j* is never "jam", *g* is never "gem", *a* is never "cat".
5. **Stress the first syllable of every word.** This one rule makes Norsund sound right more than any other.

## Voice and style notes by dialect

| Who | Sound | Grammar habits |
|---|---|---|
| **Aurinay** (Tyr, Astrid, the Lights, city guards) | *th* → [s], final *n* → [ng], short double consonants; measured and clear | polite *dyn* to superiors, *Lysa!*, *stari* ("it is fated"), stars are *staren* |
| **Vilnayan townsfolk** | rolled *r*, long double consonants, full *th* | *dy* to everyone, *sund* ("so it is sung"), stars are *starar* |
| **Vilkyren** (monster hunters) | clipped, practical, quiet on the hunt | *sa* ("I saw it") on every report; *Thiol!* as a greeting |
| **Sundwanderen** (bards) | rhythmic, alliterating | open with *Sund!*; kennings; close with *Sva sundade em, sund.* |
| **Kullmyr** | *y* → *i* (*kir* for *kyr*) | treat runes as living (*runen*) |
| **Nurmyr** | drop initial *h* (*eim* for *heim*) | gentle, unhurried |
| **Thieves Guild** | street-fast | backslang cant: *krem* market, *drav* guard, *min* a night job |
| **Old Norsund** (oaths, law, liturgy) | slow, solemn, every vowel full | cases, no evidentials; see [old-norsund.md](../old-norsund.md) |

## Writing tips

- **Put the verb second.** "At night, Tyr guards the wall" is *I nimin kjolder Tyr murin*, not *I nimin Tyr kjolder murin*.
- **Use "the" as an ending:** *murin* "the wall", not a separate word.
- **Use evidentials for flavour.** A hunter who says *sa* saw it; a gossip who says *sund* heard it; a priest who says *stari* knows it from the stars.
- **Don't translate word for word.** Norsund has no "please" (use *ma*), says "how many years do you have" for "how old are you", and calls the tavern cook *fyr* "fire".
- **Check every line** with `gloss`. If a word comes back unknown, look it up with `en`, or request it.

## Before you ship

- [ ] Every Norsund line passes `node tools/cli.mjs gloss` with no unknown words.
- [ ] Names use the standard spellings.
- [ ] Dialect choices are consistent per character.
- [ ] Rune art has been screened for hate symbols, and no rune glows in Auristar.
- [ ] Audio has three takes per line.
- [ ] Credits name the Norsund version used ("Norsund 1.0") and label any sandbox words.
