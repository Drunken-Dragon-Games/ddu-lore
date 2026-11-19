# Naming guide

This guide is for lore contributors who need a name for a village, river, guild, person or monster, and want it to fit Norsund without asking a linguist. The rules come from [grammar/11-naming.yaml](../../../records/languages/norsund/grammar/11-naming.yaml) and [09-word-formation.yaml](../../../records/languages/norsund/grammar/09-word-formation.yaml).

## The short version

1. **Pick a generic** that says what the place is (*heim* "town", *mar* "peak", *ylv* "river").
2. **Put one or two describing words before it** (*nor* "north", *kull* "ember").
3. **Write it as one word**, stressed on the first syllable: *Kullsvel*.
4. **Check it:** `node tools/cli.mjs check Kullsvel`.
5. **Make its people:** first part + *-nay* (*Kullnay*).

## Place names (NAME-01)

A place name is **modifier(s) + one generic**, written as one word. Use the linking *-i-* when the first part owns the place: *Stari* + *fjol* + *den* = *Starifjolden* "the stars' under-land". Keep everyday names to three syllables or fewer; four is the limit.

### Generics: what the place is

| Generic | Meaning | Example |
|---|---|---|
| heim | home, settlement, town | Oudeheim |
| den | land, realm, region | Thiolden |
| mar | peak, mountain | Midelmar |
| vir | forest, deepwood | Ilinvirden |
| fjol | cavern, the deep | Starifjolden |
| kjold | guard-post, fort | Norstarkjold |
| mur | wall (Kedre loan) | Kjoldmur |
| raugg | vault, treasury | Starirauggheim |
| kreth | ring of walls | Thrimde Kreth |
| gand | road | Starigand |
| ylv | water, river | Aurylv |
| tjorn | lake, tarn | Nimtjorn |
| skyl | waterfall | Marskyl |
| rie | canal (Kedre loan) | Norrie |
| vang | field, open place | Merkvang |
| kamp | city square (Kedre loan) | Lyskamp |
| haug | barrow, burial mound | Haugden (the tumulus plains) |
| skar | isle, skerry | Farskar |
| spenn | bridge | Aurspenn |
| tur | tower (Kedre loan) | Lystur |
| grind | gate in a wall | Norgrind |
| port | city gate (Kedre loan) | Merkport |
| fald | quarter of a city | Norfald (the North Fold) |
| svel | valley | Kullsvel |
| skard | mountain pass | Kharakskard (the Pass of Kharak) |
| kelda | spring, well | Ilinkelda |
| vad | ford | Nurvad |

### Modifiers: what the place is like

| Word | Meaning | Word | Meaning | Word | Meaning |
|---|---|---|---|---|---|
| nor | north | aur | silver-bright | thiol | brave |
| sul | south | star / stari- | star | vil | free |
| aust | east | lys | light | vim | whisper |
| vesk | west | nim | night | ulf | wolf |
| far | far | nett | night sky | dunk | dark |
| oude | old | ilin | holy | kvit | white |
| midel | middle | nur | green, living | grjot | stone |
| mar | high, great | kull | ember | merk | market |
| ylv | water | run | rune, secret | haug | barrow |

Any adjective or noun in the [dictionary](dictionary.md) works too. Good sources are colours (*ryd* red, *vorn* black, *glov* cyan), beasts (*hjarm* bear, *graun* raven, *haurn* dragon) and materials (*skirn* crystal, *valm* iron).

### Spelling traps

- **Hyphen where letters would merge.** If the parts meet as *n + g*, *t + h*, *k + j* or *g + j*, write a hyphen, or readers will see a digraph: *Grjot-heim*, not *Grjotheim*; *Nim-gand*, not *Nimgand* (ORTH-03).
- **Three identical consonants become two:** *kull* + *land* = *kulland*.
- **Only Norsund letters:** no c, q, x, z, accents or apostrophes (ORTH-01).

## Peoples and demonyms (NAME-02, WF-03)

| You want | Rule | Example |
|---|---|---|
| the people of a place | first part + *-nay* | Thiolden → **Thiolnay**; Auristar → **Aurinay**; Oudeheim → **Oudenay** |
| the lands of a people | people + *-an* | Vilnay → **Vilnayan** |
| a god-blessed tribe | word + *-myr* | Kullmyr "ember-kin", Nurmyr "green-kin" |
| several of them | *-en* | Runmyren, Virnayen |
| an adjective | *-a* | Vilnaya "of the free folk" |

`node tools/cli.mjs demonym Norskyl` prints *Nornay*.

## Personal names (NAME-03)

A full name is **given name + parent-name + optional byname**.

- **Parent-name:** a parent's name + *-ung* "child of". It is the same for every gender and can come from either parent: *Astrid Alkreggung*, "Astrid, Alkregg's child".
- **Given names.** Old Farheim names (Astrid, Haakon, Ulf) are inherited and their meaning is often lost. New names usually join one or two name parts: *Vim* + *tyr* = *Vimtyr* "whisper-edge".
- **Good name parts:** *tyr* edge, *kyr* blade, *ulf* wolf, *lys* light, *star* star, *aur* silver, *thiol* brave, *vil* free, *kjold* ward, *hask* axe, *haurn* dragon, *graun* raven, *nur* green, *nim* night.

## Bynames (NAME-04)

A byname follows the name and takes the definite *-in*:

- *Eify Dunkstarin*, "Eify the Darkstar";
- *Dethiol Dauthnuthin*, "Dethiol the Deathless".

In English prose, give the byname in English the first time and keep Norsund in dialogue: "Vimtyr, the Whispering Axe".

## Houses (NAME-05)

A noble house of Auristar takes its founder's name + *-ungen* "the children of". Members put the house name after the parent-name. The founders of the seven Wandering Houses have no canon names yet; naming them is a lore decision, not a language one.

## Titles (NAME-06)

| Title | Meaning | Use |
|---|---|---|
| Lys | a Light | a member of the Seven Lights, with an ordinal: *Lys Thrimde*, the Third Light |
| Kyr | Blade | a sworn mercenary rank: *Kyr Thor'Vale* |
| drott | ruler | the rulers of Auristar |
| vard | warden | keepers of places and things: *Kjoldmurvard*, Protector of the Kjoldmur |
| sodalvard | guild master | |
| Sundwander | bard | plural *Sundwanderen* |
| Vilkyr | free sword | plural *Vilkyren* |

Address a titled person with the Starisund vocative *-a*: *Lysa!* "O Light!", *Kyra!* "O Blade!".

## Names from other peoples (NAME-07)

Kedre names (*Rechtar*, *Vaire*, *Luxis*), dwarven names (*Karhak'Modan*) and other races' names keep their own rules ([languages.yaml](../../../records/languages/languages.yaml)). Norsund speakers often make their own versions: Luxis is *Lysmar* in Norsund.

## Writing names in English lore (NAME-08)

- Keep established Norsund names in English prose: *Thiolden*, *the Kjoldmur*, *the Vilkyren*.
- Translate titles and bynames in narration the first time, and keep Norsund in dialogue, inscriptions and songs.
- Never give a Norsund name an English plural. Write *the Vilkyren*, not *the Vilkyrs*.

## Renamed canon names (NAME-09)

Four canon names collided with other works or real places. They were renamed in the lore records on 2026-11-19.

| Old name | New name | Why |
|---|---|---|
| Valinor | **Valnor** ("north Valia": *Val* + *nor*) | Valinor is Tolkien's Undying Lands |
| Worgenkin | **Ulfkin** ("wolf-kin") | worgen are a Warcraft race |
| Exeter | **Exaire** (Kedre) | a real English city |
| Arbury | **Arbaire** (Kedre) | a real English place |

## The name generator

```
node tools/cli.mjs name place --count 5                 # five random place names with meanings
node tools/cli.mjs name place --generic skyl --modifiers nor
node tools/cli.mjs name person --count 5                # given name + parent-name
node tools/cli.mjs name place --seed ash                # same seed, same names
node tools/cli.mjs demonym Norskyl                      # Nornay
node tools/cli.mjs check Kullsvel                       # does it follow the sound rules?
```

The generator only builds from dictionary parts, so every name it gives has a meaning. Read the meaning before you use it: a random combination can be odd (*Marhask* "above-axe"). Pick the one that tells a story. The [Norsund Workbench](../../../tools/web/) has the same tools in a browser.
