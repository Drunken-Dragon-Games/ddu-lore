# Norsund changelog

Versions follow the rules in [contributing-words.md](contributing-words.md#batches-and-versions):

- **major:** breaking changes to the core;
- **minor:** new words, rules and texts;
- **patch:** fixes.

## 1.0.0 (2026-11-19)

The first complete version of Norsund, the common tongue of Thiolden. The lore lead (Vledic) approved it the same day, after the v0.1 proposal, and asked for all three phases to be built.

### What's in it

| Part | Where | Size |
|---|---|---|
| Grammar | [`records/languages/norsund/grammar/`](../../../records/languages/norsund/grammar/) | 14 files, 126 rules with IDs; machine-readable tables for sounds, endings, verbs and sound changes |
| Dictionary | [`records/languages/norsund/dictionary/`](../../../records/languages/norsund/dictionary/) | 16 files, 2,059 entries (1,170 headwords and 889 derived words); 873 core, 1,175 common, 11 sandbox |
| Texts | [`records/languages/norsund/texts/`](../../../records/languages/norsund/texts/) | 30 glossed texts, 223 lines: samples, the Babel text, "The North Wind and the Sun", eight texts of Thiolden, a 136-phrase phrasebook |
| Old Norsund | [`records/languages/old-norsund/`](../../../records/languages/old-norsund/) | complete grammar (43 rules, 5 paradigm tables), 353 dictionary entries, 8 texts (48 lines) |
| Kedre | [`records/languages/kedre/`](../../../records/languages/kedre/) | complete grammar (34 rules, 6 paradigm tables), 384 dictionary entries, 6 texts (31 lines) |
| Scripts | [`records/languages/scripts/`](../../../records/languages/scripts/) | the rune row (*runar*, 24 staves, screened against hate symbols) and Lysrit, Auristar's star script |
| Fonts | [`assets/fonts/`](../../../assets/fonts/) | Lysrit, Runar and Runar Twig (SIL OFL) |
| Tools | [`tools/`](../../../tools/) | engine, CLI, validator, tests, CI, browser workbench |
| Docs | [`docs/languages/`](../../) | reference grammar, pronunciation guide, naming guide, phrasebook, writers and actors kit, course, dialects, contribution process, generated dictionary and English index |

**The three phases of the v0.1 roadmap are complete:**

1. **Name kit:** sounds, spelling, naming rules and generics, pronunciation guide, all canon names decoded.
2. **Speakable:** full grammar, more than 2,000 words, test texts, Old Norsund and Kedre, runes and Lysrit.
3. **Production:** fonts, the writer and actor kit, validator and CI, the workbench, and dialect rules that the engine can run.

### Decisions (D1–D10 from the v0.1 proposal)

| | Question | Decision |
|---|---|---|
| D1 | The concept image shared on 2026-11-19 | **Decided by the lore lead: 1.0 stands as built.** The image never reached the build, and it does not need to be merged in. |
| D2 | How to say *Auristar* | **OW-ree-star.** *au* is always as in "cow". |
| D3 | Myr & Heid vs Ur & Nett | **One pair:** Myr and Heid are the Wandering Houses' old names for Ur (the Source) and Nett (the Firmament). |
| D4 | Are stars alive in the grammar? | **Yes in Starisund** (*staren*, *sel*); objects elsewhere (*starar*, *at*). |
| D5 | Runes in Auristar | **Plain, non-glowing rune writing is allowed;** only rune magic (charged, glowing runes) is forbidden. Lysrit is the sacred and civic script beside them. |
| D6 | Is *aur* native or Kedre? | **Native.** Auristar is a fully Norsund name. |
| D7 | Spelling drift in the records | **Standard spellings applied to the lore records:** Midelmar, Haakon, Volggan, Vairean, Rechtar (files renamed: vairean-empire.yaml, volggan.yaml). |
| D8 | Names that collide with other works | **Renamed in the lore records:** Valinor → Valnor, Worgenkin → Ulfkin, Exeter → Exaire, Arbury → Arbaire. |
| D9 | Licence and stewardship | **CC BY 4.0** for language material, **SIL OFL** for fonts, **MIT** for tools. A **Language Steward** appointed by the lore lead reviews before the vote. |
| D10 | Are Kedre and Norsund related? | **Yes:** both descend from Proto-Valian, so *lys* and *Luxis* are cognates. |

### Fixes made while building 1.0

The validator, the engine tests and the people building the dictionary found these problems in the first draft of the specification. All are fixed in the records.

**Sounds and spelling**

- The onset lists gained *kv, gv, tv, dv, tj, dj* and *grj, brj, frj, trj, skv*, so *grjot*, *kvit* and *tjorn* are legal.
- ORTH-09: the glide after *th* is spelled *i* (*thiol*, *thiarka*).
- *thurh* "through" became *thurg* and *hush* became *hyss*, because *h* can't end a syllable.
- *hver* "each" became *sver*, because *hv* is not an onset.
- *thyrngrjot* is written *thyrn-grjot* (ORTH-03).
- PHON-02 now says a compound has one secondary stress.

**Grammar**

- The command of *saja* "see" is *se*, because *saj* would end in *j*.
- A command whose stem ends in an illegal cluster adds -e (*wandre!*).
- The adverb *-t* becomes *-et* where *-t* would make an illegal ending (*langet*).
- Stems in *-a* drop the *a* of *-ar* (*kelda* → *keldar*).
- NOUN-T1 genitives follow NOUN-05 (*nayni*, *rieni*).
- WF-07 documents the two *-a* suffixes.

**Sound history**

- The cognates *\*geldhu*, *\*sundhu* and *\*kwandhru* take breathy *dh*. Grimm's second shift would otherwise turn their *d* into *t*.
- Kedre's breathy stops became three rules: *f* at the start of a word, *b*/*d* elsewhere, and *gh* → *h*.
- *ilin* "holy" comes from Old Norsund *iliin* (long vowel), with a new rule that shortens unstressed long vowels. It no longer reduces to *ilen*.
- A rule merges the umlaut diphthong *ey* into *ei*.
- ORTH-07 cites Old Norsund *þjol*.
- Kedre occupation loans also lose *v* between vowels (*rivia* → *rie*).

**Dictionary**

- Duplicate coinages between the dictionary files were resolved:
  - The *roth* family was dropped in favour of *rath* (*ratha* "advise", *rathlag* "council").
  - The Trial of Mountain and Star is ***Marstartholn***.
  - *klemb* is a gong, *dyng* a bell.
  - *vrask* is a demon of the wild lands, *gyrm* a void-spirit.
  - *svip* is a ghost, *glaum* a wraith-light.
  - *thrav* is belief, *trod* religious devotion.
  - *kraftir* is a mage, *galmir* a spellsinger.
  - *sodal* is a guild, *brodlag* a fellowship order.
  - *lauk* is a healing herb, *grust* a wild herb.
  - *sjald* is a chair, *sjot* a stool.
  - *velk* means welcome, *vels* greeting.
  - *lyka* is to perform, *dyska* to play a game.
- Glosses such as *no* and *on* are quoted, because some YAML readers turn them into true/false.
- Added the rune names *plog* "plough", *gjal* "echo" and *esk* "ash tree".
- [`15-additions.yaml`](../../../records/languages/norsund/dictionary/15-additions.yaml) adds words the texts needed:
  - *thyn* "name";
  - *snika*, *snikir* "steal, thief";
  - *sjon*, *sjona* "pardon, forgive";
  - the tavern names *Jalkvyrski Sjen* and *Kjalad Haurn*;
  - the canon characters.

### Finished before release

- **Reference audio.** 404 recordings for 184 items in `assets/audio/norsund/`: 36 canon names (normal, slow, syllable by syllable), the 136-phrase phrasebook and the sample texts (normal and slow). They are generated from the engine's IPA with eSpeak NG and verified phoneme by phoneme. Each file is also measured acoustically: it contains speech, doesn't clip, matches its listed duration, and has one sound burst per syllable in the syllable takes. CI checks that every new text can be voiced.
- **Design pass on the scripts.** The Lysrit and rune shapes are final. Production art direction covers carved stone with crystal inlay, stained glass, techwear and game UI, wood and slate, and embroidery. It sets stroke weights, minimum sizes, colours and glow rules, with an art release checklist and four reference art sheets (`docs/languages/norsund/img/art-*.svg`).
- **Hate-symbol screening.** All rune forms and Lysrit letters were screened against the ADL entries. The structural rules (one stave, strokes on one side, no crossings, no duplicates or mirror pairs) are now tests that run in CI.
- **Lore records cleaned up.** The standard spellings and the four renames are applied across `records/`; `varian-empire.yaml` became `vairean-empire.yaml` and `vloggan.yaml` became `volggan.yaml`. The index import and the timeline's "Vairean Imperial System for Dates" reference now resolve. Five lore files that never parsed as YAML (`auristar.yaml` and the story collections `dvwl.yaml`, `marv.yaml`, `nurseflamtam.yaml` and `enkian.yaml`) were repaired. A line-by-line comparison against `canon`, with indentation stripped, shows that each file has the same number of lines as before and that the only text changes are the renames above (Exeter → Exaire in `dvwl.yaml`; Vlogan → Volggan in `marv.yaml`; Varian, Arbury and Exeter in `auristar.yaml`) and one quoted line in `auristar.yaml`. `nurseflamtam.yaml` and `enkian.yaml` changed only in indentation.
- **Old Norsund and Kedre completed** to the same topic coverage as Norsund: sounds and spelling, full paradigms, numbers, question words, word formation, naming, registers, and how each relates to Norsund, each with a dictionary of more than 350 entries and new texts. Examples include an Old Norsund rune-stone memorial and saga landfall, and Kedre siege orders, alchemy notes and a hymn to Luxis.
- **D1 decided** by the lore lead: 1.0 stands without the concept image (see the table above).

### Tool fixes made before release

- The analyzer reads the Starisund vocative *-a* on titles: *Lysa* is *Lys-a* "light-VOC", *Kyra* is *Kyr-a*.
- `check` validates hyphenated compounds part by part, never splits a syllable across a hyphen, and says when a hyphen is unnecessary under ORTH-03. It still cannot guess where an unhyphenated compound joins, so writers add the hyphen for n+g, t+h, k+j and g+j joins.
- The name generator glosses parts from the naming tables (*Sundaur* is now "song silver-bright", not an evidential).
- Gloss labels keep short multi-word meanings whole (*dauthirene* = risen.corpse-DEF.PL.AN).
- `respell` writes n before k or g as "ng" (*strenk* = STRENGK).
- English "saw" in a verb slot is the past of "see" (*Em sa ulfin*), not the verb "to saw".

### Known limits of the tools (1.0)

- The English → Norsund translator is rule-based and handles simple sentences. Check its output with `gloss`, and ask the Language Steward for anything long.
