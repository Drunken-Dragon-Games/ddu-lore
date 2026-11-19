# Dialects and registers

Big cities change their speech fastest; isolated places keep old forms. So Auristar, the largest city in Thiolden, speaks the most innovative Norsund, and Farheim and the countryside speak the most conservative. Source: [grammar/12-registers-dialects.yaml](../../../records/languages/norsund/grammar/12-registers-dialects.yaml).

## At a glance

| Feature | Common Norsund | Starisund (Auristar) | Farheim | Kullmyr | Nurmyr |
|---|---|---|---|---|---|
| "stars" | *starar* (objects) | *staren* (living beings) | *starar* | *starar* | *starar* |
| "seven" | *sev* | *stev* | *sev* | *sev* | *sev* |
| *th* | [θ] / [ð] | [s] | [θ] / [ð] | [θ] / [ð] | [θ] / [ð] |
| final *n* | [n] | [ŋ] | [n] | [n] | [n] |
| double consonants | long | short | long | long | long |
| *y* | [y] | [y] | [y] | [i] | [y] |
| initial *h* | kept | kept | kept | kept | dropped |
| polite "you" | none (*dy* for all) | plural *dyn* | none | none | none |
| favourite evidential | *sund* | *stari* | *sund* | *sa* | *sund* |

## Common Norsund

The speech of the Vilnayan towns and the shared second language of Thiolden's races. It is the standard this documentation teaches. Stars are objects, seven is *sev*, and *dy* "you" is used with everyone. In this bard-carried culture, people love the evidential *sund* "so it is sung".

## Starisund, the star-tongue of Auristar

| Feature | Example |
|---|---|
| Stars, constellations and the Auristar are **animate** | *staren*, and a star is *sel* (NOUN-09) |
| Seven is *stev*, reshaped by *star* | the Seven Lights are *Stevlysen* |
| **Venetian-style accent** in speech only (PHON-10): *th* → [s], final *n* → [ŋ], double consonants short | *Thiolden* sounds like "SYOL-deng" |
| **Polite plural** *dyn / dun / dyni* to one person of rank (PRON-02) | |
| **Vocative** *-a* on titles (NOUN-08) | *Lysa!* "O Light!" |
| More **Kedre loans** for trade, law, building and canals | *merk* market, *kamp* square, *port* city gate, *tur* tower, *rie* canal |
| **Favourite evidential** *stari* "it is fated"; market sellers use it as a joke | *Ves aurlingar, stari.* "Four silver pennies, as the stars decree." |

## Farheim island speech

The settlers' island keeps the oldest forms. Some animate plurals still end in Old Norsund *-in* (*Vilkyrin* "free swords"), and old songs keep the present ending *-ur* (*kjoldur* "guards"). Mainlanders find it solemn and old-fashioned.

## Kullmyr speech

The shamanistic Kullmyr say *i* for *y*. Their Fire god *Fyren* is **Firen** in their mouths, which is the spelling canon uses. They also treat runes as living, so they say *runen*, not *runar*.

## Nurmyr speech

The forest Nurmyr of Ilinvirden drop an initial *h*: *eim* for *heim* "home", *est* for *hest* "horse". Other Thiolnay find it rustic and gentle.

## The Thieves' cant

The Thieves Guild of Auristar and the black market use **backslang**: a word's letters are reversed when it's legal Norsund. These words are in the dictionary under register *cant* and tier *sandbox*.

| Cant | From | Meaning |
|---|---|---|
| krem | merk | market |
| ryk | kyr | blade, knife |
| drav | vard | city guard |
| ryf | fyr | cook |
| min | nim | night; a job done by night |
| gad | dag | day, daylight |

## Registers (styles)

| Register | Used for | Marks |
|---|---|---|
| **Old Norsund** | oaths, law formulas, temple liturgy, rune-craft, sagas | four cases, no evidentials, verb-last subordinate clauses; see [old-norsund.md](../old-norsund.md) |
| **Learned** | the Starlight Library, alchemy, medicine, imperial law | whole Kedre loans with Kedre stress: *alkimia*, *medikina*, *kupola* |
| **Bardic verse** (*sundlag*) | Sundwanderen songs, praise, epitaphs | kennings, heiti, alliteration; see [reference-grammar.md §15](reference-grammar.md#15-poetry) |
| **Carved** | inscriptions, mottos, banners | present *es* dropped, short clauses: *Vil kyrin, vothen sundin.* |

## The Kedre layer

Kedre words entered Norsund in three waves (records: [kedre.yaml](../../../records/languages/kedre/kedre.yaml), [docs/languages/kedre.md](../kedre.md)):

| Wave | When | Treatment | Examples |
|---|---|---|---|
| early | before 37 a.v.e. | fully native-looking | (indistinguishable) |
| occupation | 37–51 a.v.e. and Doir Vaire's rule | final vowel dropped, double consonants simplified, *v* between vowels lost, first-syllable stress | *mur* < murra, *rie* < rivia, *merk* < merkadu, *port* < porta, *tur* < turra, *ke* < ke |
| learned | after 100 a.v.e. | kept whole, Kedre stress | *alkimia*, *medikina*, *kupola* |

When one root is borrowed twice, you get a **doublet** (REG-02): *tur* "tower" and *turra* "fortress-tower".

## Shibboleths (REG-01)

| You hear | It marks |
|---|---|
| *Thiolden* as "SYOL-deng" | someone raised in Auristar |
| *staren* | a temple-goer, or anyone from Auristar |
| *starar* in a temple | a villager or a foreigner |
| *eim* for *heim* | a Nurmyr |
| *Firen* for *Fyren* | the Kullmyr |
| *dy* to a Light | a country person, or a deliberate insult |
| *krem*, *drav*, *min* | someone who knows the Thieves Guild |

## Using dialects in stories and games

- Give each character one or two dialect features, not all of them. The easiest to hear are the Auristar *th* → *s* and the *staren*/*starar* difference.
- `node tools/cli.mjs ipa <word> --dialect starisund` (or `kullmyr`, `nurmyr`, `old`) shows the pronunciation in each dialect.
- The [writers and actors kit](writers-and-actors-kit.md) has per-dialect voice notes.
