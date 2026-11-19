# Norsund fonts

Three fonts type the native scripts of Norsund straight from the ASCII romanization:

| File | Script | Use |
|---|---|---|
| `assets/fonts/Lysrit-Regular.otf` | Lysrit, Auristar's star script | temples, monuments, holy names, UI headers |
| `assets/fonts/Runar-Regular.otf` | runes, long-branch form | stone, monuments, signage |
| `assets/fonts/Runar-Twig.otf` | runes, short-twig form | wood, letters, props, quick notes |

The script rules and glyph tables are in `records/languages/scripts/` (`lysrit.yaml`, `runar.yaml`). The guide for writers and artists is `docs/languages/norsund/writing-systems.md`.

All three fonts are licensed under the SIL Open Font License 1.1 (`assets/fonts/OFL.txt`). Bundle them with a game or app freely; don't sell the font files on their own.

## Typing

Type Norsund in its normal spelling. The fonts' ligatures (the OpenType `liga` feature, on by default) turn letters into the right glyphs.

**Lysrit**

- Each consonant and the vowels after it merge into one cell. `Auristar` gives five cells: `[au] r[i] s t[a] r`.
- `th`, `kj`, `gj` and `ng` become one consonant. Doubled consonants (`ll`, `gg`) become one cell with the geminate bar. Doubled vowels (`aa`) become one long star.
- The font cannot tell which `e` is unstressed. To get the reduced vowel ə, type `ə` (U+0259): `Thioldən`. The SVG renderer in `tools/norsund/scripts.js` does this automatically.
- `*` or `✶` (U+2736) is the violet sacred mark. Type it before a holy name: `*Auristar`.
- Digits `0`–`9` give Lysrit numerals. Adjacent digits share one number bar. U+E210 is the long hundred (120).
- U+E201, U+E202 and U+E203 are the evidential sigils for sa, sund and stari.
- `·` is the word divider; `,` `.` `?` `!` have Lysrit forms.
- `c`, `q` and `x` show as k, and `z` as s. They are not Norsund letters; write `ks` for x.
- A cell holds at most two vowels. A long vowel followed by another vowel starts a new cell in the font; the SVG renderer keeps them together.

**Runar**

- One rune per letter, plus ligatures for `th`, `kj`, `gj` and `ng`.
- Doubled letters are two runes, as in carved inscriptions.
- `·` `,` and `-` are the word-divider dot; `.` `:` `;` `!` and `?` are the two-dot sentence end.
- Digits are merchants' tally groups, one group per digit.
- The Private Use Area maps the rune row in order, from U+E100 (p) to U+E119 (y). Both fonts also accept U+E140–U+E159 for the same runes.

## In engines and on the web

- **CSS:** `@font-face { font-family: Lysrit; src: url(Lysrit-Regular.otf); }` Browsers apply `liga` automatically.
- **Unity TextMesh Pro:** create a Font Asset from the OTF with the character set "Unicode range" covering basic Latin plus U+0259, U+2736 and U+E200–U+E210. TMP supports only the `kern`, `liga`, `mark` and `mkmk` features, and these fonts use only `liga`.
- **Unreal and Godot:** both shape with HarfBuzz, so ligatures work out of the box.
- **Any engine:** `tools/norsund/scripts.js` renders the same glyphs as SVG strings (`renderLysrit`, `renderRunes`). Use them for textures, decals or UI images when a font is inconvenient. They also support the glowing "charged rune" style, which the fonts do not.

## Rebuilding

The fonts are built from the YAML records, so edit the records and rebuild; never edit the OTF files by hand.

```sh
python3 -m venv .venv && . .venv/bin/activate
pip install fonttools pyyaml uharfbuzz   # uharfbuzz is only needed for --test
python tools/fonts/build_fonts.py --test
node tools/fonts/specimens.mjs           # refresh docs/languages/norsund/img/*.svg
```

`build_fonts.py` first checks that `tools/norsund/scripts.js` carries the same glyph tables as the YAML records, and stops if they differ. `--test` then shapes sample words (Auristar, Thiolden, Kjoldmur, Starirauggheim, Thiolnay, "kjold thiol") and checks that the expected glyphs come out.

Lysrit-Regular.otf has 1,442 glyphs and 1,428 ligatures: every consonant (single, digraph or doubled) combined with every vowel group. Runar-Regular.otf and Runar-Twig.otf have 41 glyphs each.

## Before art ships

Every rune, Lysrit mark or logo built from these fonts must be checked by a person against the [ADL Hate Symbols database](https://www.adl.org/resources/hate-symbols/search), especially new composite marks. The rune row was designed to avoid the shapes listed in `records/languages/scripts/runar.yaml` (hate_symbol_screening), but composites can recreate them.
