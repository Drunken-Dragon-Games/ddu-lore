# Old Norsund

Old Norsund is the language the first settlers carried to Thiolden from the island of Farheim around **450 b.v.e.** It was the everyday speech of Marheim and the first Vilnayan villages. Around **100 a.v.e.**, about the time Auristar finished the First Ring of the Kjoldmur, everyday speech had changed enough to be called Norsund.

Old Norsund did not die. It became the language of **oaths, law, temple liturgy, rune-craft and sagas**. A Vilkyr still swears in Old Norsund, the laws on the Kjoldmur are carved in it, and the oldest invocations in Auristar's temples use it. To a Norsund speaker it sounds the way Chaucer sounds to an English reader: hard, but partly readable.

The source files are in `records/languages/old-norsund/`:

- `grammar.yaml`: the grammar sketch
- `dictionary.yaml`: about 150 words, each with its Norsund descendant
- `texts.yaml`: the Vilkyr oath, the Kjoldmur law, a settlers' rune slate and a temple invocation, glossed word by word

## How it looks

Old Norsund uses the same letters as Norsund. Lore writers should use the same plain spelling (`thiol`, `vetha`, double vowels for long ones like `tiir`). Scholars quoting it may use the older letters:

| Plain spelling | Scholarly spelling | Meaning |
|---|---|---|
| thiol | þjol | brave |
| vetha | veða | to swear |
| dauth | dauð | death |
| tiir | tír | glory |

Use þ for *th* at the start of a word and ð for *th* between vowels or at the end after a vowel. An acute accent marks a long vowel.

## What changed on the way to Norsund

Most Old Norsund words survive almost unchanged. The differences are in the endings and the grammar.

| | Old Norsund | Norsund |
|---|---|---|
| free swords | Vilkyr**in** | Vilkyr**en** |
| (he) guards | kjold**ur** | kjold**er** |
| bound (participle) | voth**in** | voth**en** |
| folk | ne**g**i | na**y** |
| wanderer | **hw**ander | **w**ander |
| the blade | kyr **hin** | kyr**in** |
| that, who (relative) | ys | ke (from Kedre) |
| may he guard | kjold**i** | **ma** kjolda |
| will guard | **halur** kjolda | **hal** kjolda |

Three sound changes explain most of the list:

1. **Weak endings lost their colour.** Unstressed *i* and *u* in a final closed syllable became the neutral *e* [ə]: *-in* became *-en* and *-ur* became *-er*.
2. **g between vowels melted into j.** *negi* became *nay*.
3. **Initial hw became w.** *hwander* became *wander*.

## Grammar at a glance

**Four cases.** Nouns are nominative (subject), accusative (object), genitive (owner) or dative (after any preposition, and for the receiver). Animate nouns mark the object with **-a**. That is why an oath can put the monster first without confusion:

> **Skryma** thiarkur em. *"The monster I hunt."*

| | animate (Vilkyr) | inanimate (kyr) |
|---|---|---|
| nominative | Vilkyr | kyr |
| accusative | Vilkyr**a** | kyr |
| genitive | Vilkyr**i** | kyr**i** |
| dative | Vilkyr**e** | kyr**e** |
| plural nom./acc. | Vilkyr**in** | kyr**ar** |
| plural genitive | Vilkyr**ini** | kyr**ari** |
| plural dative | Vilkyr**um** | kyr**um** |

**"The" is a separate word.** *kyr hin* means "the blade". Norsund later fused it onto the noun as *kyrin*.

**Verbs agree in number.** *kjoldur* "(one) guards", *kjoldum* "(several) guard". Norsund kept only the first form.

**Main clauses are verb-second; subordinate clauses are verb-last.** In *sof em vath brestur* ("if I the oath break"), the verb comes last.

**Wishes and curses** use the optative ending **-i**: *Myr kjoldi heim* "May Myr guard the home", *Biti kyr emi om* "May my blade bite me".

**No evidentials.** Old Norsund has no *sa*, *sund* or *stari*. Oaths name the gods as witnesses instead: *Sajir es Myr* "Myr is witness".

## Sample: the Vilkyr oath

> Vil kyr, vothin sund.
> Em vethur a kyre eth a thamme.
> Ter Thioldene, ter heime eth nege, kjoldur em.
> Skryma thiarkur em, eth em ne skrinkur.
> Kyr emi bitur thasa ys vond es.
> Sajir es Myr, sajir es Heid.
> Sof em vath brestur, biti kyr emi om.
> Sva vethur em.

*Free blade, bound word.
I swear on blade and on hand.
For Thiolden, for home and folk, I keep watch.
The monster I hunt, and I do not flee.
My blade bites the one who is evil.
Myr is witness, Heid is witness.
If I break the oath, may my blade bite me.
Thus I swear.*

The full glossed version is in `records/languages/old-norsund/texts.yaml`.

## Gods and old names

Old Norsund calls the two great gods **Myr** (the Kin-maker, from *myr* "kin") and **Heid** (the Clear Sky, from *heid* "clear sky, honour"). Auristar's temples later named them **Ur** and **Nett**. The old rite still uses the old names:

> Myr, ur ys emin lidum; Heid, ve ys emin ganum.
> *Myr, from whom we come; Heid, to whom we go.*

## Runes

Old Norsund was carved in runes on wood, bone and slate. The rune-row does not mark long vowels or double consonants, so a carving can often be read more than one way. Rune-carvers guard that ambiguity jealously. Rune *magic* is a separate act: charging a carved rune with aether (*lada*) makes it glow. Auristar forbids rune magic but not runic writing. See `records/languages/scripts/` for the rune-row.

## For writers

- Use Old Norsund for oaths, laws, carved inscriptions, liturgy and the voices of very old beings.
- Use plain spelling in prose and save þ and ð for in-world scholars quoting texts.
- Keep it short. A single line of Old Norsund followed by its meaning carries more weight than a paragraph.
- Never add evidentials to Old Norsund lines. Their absence is part of what makes the old voice sound old.
