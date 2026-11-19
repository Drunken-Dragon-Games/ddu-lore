# Old Norsund

Old Norsund is the language the first settlers carried to Thiolden from the island of Farheim around **450 b.v.e.** It was the everyday speech of Marheim and the first Vilnayan villages. Around **100 a.v.e.**, about the time Auristar finished the First Ring of the Kjoldmur, everyday speech had changed enough to be called Norsund.

Old Norsund did not die. It became the language of **oaths, law, temple liturgy, rune-craft and sagas**:

- A Vilkyr still swears in Old Norsund.
- The laws on the Kjoldmur are carved in it.
- The Sundwanderen recite the Saga of the Wanderers in it.
- The oldest invocations in Auristar's temples use it.

To a Norsund speaker it sounds the way Chaucer sounds to an English reader: hard, but partly readable.

The source files are in [`records/languages/old-norsund/`](../../records/languages/old-norsund/):

| File | What it holds |
|---|---|
| `grammar.yaml` | the complete grammar: 43 rules and 5 paradigm tables |
| `dictionary.yaml` | 353 entries, each with its Norsund descendant (or marked as lost) |
| `texts.yaml` | 8 glossed texts: the Vilkyr oath, the Kjoldmur law, a settlers' slate, a temple invocation, a memorial stone, the Saga of the Wanderers' landfall, a law of the Marheim moot, and a ward incantation |
| `old-norsund.yaml` | the facts in brief |

## Sounds and spelling

Old Norsund uses the same sounds and letters as Norsund ([pronunciation guide](norsund/pronunciation-guide.md)), with four differences:

| Old Norsund has | Example | Norsund |
|---|---|---|
| full vowels in endings | Vilkyr**in**, kjold**ur** | Vilkyr**en**, kjold**er** |
| g between vowels | ne**g**i | na**y** |
| hw at the start of a word | **hw**ander | **w**ander |
| long vowels after the first syllable | il**ii**n | il**i**n |

Stress is always on the first syllable. Lore writers use the plain spelling. Scholars quoting it may use the older letters:

| Plain spelling | Scholarly spelling | Meaning |
|---|---|---|
| thiol | þjol | brave |
| vetha | veða | to swear |
| dauth | dauð | death |
| tiir | tír | glory |

Use þ for *th* at the start of a word and ð for *th* between vowels or at the end after a vowel. An acute accent marks a long vowel.

## Nouns: four cases

A noun is **nominative** (subject), **accusative** (object), **genitive** (owner) or **dative** (after any preposition, and for the receiver). Animate nouns mark the object with **-a**, so a sentence can put the object first without confusion:

> **Skryma** thiarkur em. *"The monster I hunt."*

| | animate (Vilkyr) | animate plural | inanimate (kyr) | inanimate plural |
|---|---|---|---|---|
| nominative | Vilkyr | Vilkyr**in** | kyr | kyr**ar** |
| accusative | Vilkyr**a** | Vilkyr**in** | kyr | kyr**ar** |
| genitive | Vilkyr**i** | Vilkyr**ini** | kyr**i** | kyr**ari** |
| dative | Vilkyr**e** | Vilkyr**um** | kyr**e** | kyr**um** |

Vowel stems add **-s** in the genitive (*negi*, *negis*). The six umlaut nouns change the vowel in every plural case (*lud* "person", *lyd*, *lydi*, *lydum*; *gat* "goat", *get*).

**"The" is a separate word after the noun:** *kyr hin* "the blade", *kyrar hine* "the blades". Norsund fused it into *kyrin*, *kyrarne*.

**Adjectives agree** with their noun: *thiola Vilkyra* "the brave free sword" (object). Comparison works as in Norsund (*thiolar*, *thiolast*; *hel*, *batar*, *bast*).

## Verbs

Verbs agree with a singular or a plural subject. Norsund later kept only the singular form.

| | weak (kjolda "guard") | strong (dola "fall") | to be (vesa) |
|---|---|---|---|
| present, one | kjoldur | dolur | es |
| present, several | kjoldum | dolum | erum |
| past, one | kjoldade | dul | vas |
| past, several | kjoldadum | dulum | varum |
| participle | kjoldad | dolin | vesin |
| command | kjold! | dol! | ves! |
| wish (optative) | kjoldi | doli | si |

The **future** is *halur* + infinitive ("is bound to"), which became the Norsund *hal*. Wishes, blessings and curses use the **optative**: *Myr kjoldi heim* "May Myr guard the home", *Biti kyr emi om* "May my blade bite me". Norsund replaced it with *ma*, worn down from *maga* "to have the power to".

## Word order

- **Main clauses put the verb second.**
- **Subordinate clauses put it last:** *sof em vath brestur*, "if I the oath break".
- ***ne* always comes directly before the verb:** *Em ne skrinkur*, "I do not flee".
- **Relative clauses** use the particle *ys*, which Norsund replaced with the Kedre loan *ke*.
- **No evidentials.** Old Norsund has no *sa*, *sund* or *stari*. Oaths name the gods as witnesses instead: *Sajir es Myr*, "Myr is witness".

## Numbers

Ten was still *dovthamm*, "two hands", and the tens were two words. Markets counted in the **long hundred** of 120.

| 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 20 | 120 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| yn | dov | thrim | ves | thamm | sesk | sev | ath | nyv | dovthamm | dov dovthamm | langhaun |

The Starisund *stev* "seven" did not exist yet.

## Names

- **Person:** given name + parent-name in **-ung** ("child of"), for example *Astrid Alkreggung*.
- **Byname:** the byname comes before the article *hin*: *Tyr thiol hin* "Tyr the brave". It became Norsund *Tyr Thiolin*.
- **House:** the founder's name + **-ungin**, "the children of"; Norsund *-ungen*.
- **Memorial stones** follow a fixed formula: *X ristadum runar hesar aft Y* ("X carved these runes in memory of Y"), then a line of praise, then a blessing. They end with a ban on charging the runes, because rune magic near the dead raises them.

## How to read a rune-stone

1. **Transliterate** each rune with the rune-row in [`records/languages/scripts/runar.yaml`](../../records/languages/scripts/runar.yaml) and the [writing systems guide](norsund/writing-systems.md).
2. **Split words** at the dividers (one or two dots).
3. **Restore length.** Carvers did not write long vowels or double consonants, so *ulf* may also be *ulff*, and *tir* may be *tiir*. Pick the dictionary word that fits.
4. **Find the formula.** Most stones say *X ristade(um) runar hesar aft Y-e*: who carved, in memory of whom (dative), and how they were related.
5. **Check the last line.** If it says *Ne lysi run…* ("let no rune shine"), the stone forbids rune magic. If a stone *glows*, someone has charged it.

## Sample: the landfall

From the Saga of the Wanderers, as the Sundwanderen recite it:

> Hes es frast hwanderini.
> Ur Farheime gonum selin a hjaule, i ves skeium.
> Thrusk skauv skeiar, eth hjaul vas vond.
> A nyvde dage saum selin hjolm.
> Vir hin vas dunk, eth skrymin beidum i vire.
> Ava hwanderin ne skrinkadum.
> Thal mal drott selini: “Hes es den thiolini.”
> Sva agur den hin thyn ati: Thiolden.

*This is the tale of the wanderers.
From Farheim they went out on the sea, in four ships.
Storm drove the ships, and the sea was cruel.
On the ninth day they saw a shore.
The forest was dark, and monsters waited in the forest.
But the wanderers did not flee.
Then their leader said: "This is the land of the brave."
So the land has its name: Thiolden.*

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

All texts are glossed word by word in `texts.yaml` and can be browsed in the workbench's Texts tab.

## The registers

| Register | Opening | Features |
|---|---|---|
| Oath | *Em vethur a kyre…* | first person and present tense; gods named as witnesses; a conditional curse in the optative |
| Law | *Hes es lag X-i* | "whoever …, that one …"; verb-last relative clauses; ends *Sva skilum emin* |
| Liturgy | *Em heitur Myra eth Heida* | old god-names; *jov* "give" and the optative; ends *Sva es urlag* "so is fate" |
| Saga | *Hes es frast X-i* | past tense, short clauses, speech quoted with *mal* |
| Rune magic | *Run ristur em, run ladur em* | names the powers *vald* and *sveim*; optative commands; ends *Glod!* "glow!" |

**Rune magic warning.** Charging runes (*lada*) makes them glow. That is rune magic: it raised the dead at Marheim, and the law of the Kjoldmur forbids it in Auristar. Plain runic writing never glows. The ward incantation in `texts.yaml` is there for writers to use in scenes of forbidden or wild magic only.

## Verse

Old Norsund verse uses the *sundlag* ([poetics](../../records/languages/norsund/grammar/14-poetics.yaml)): two half-lines of two stresses each, linked by alliteration. The full endings make the old lines longer and heavier than Norsund ones. Poetic synonyms (*heiti*) such as *jor* "steed", *bran* "blade", *ljom* "radiance", *varg* "wolf" and *dreyr* "blood" replace everyday words.

> Vil kyr · vothin sund *(v alliterates)*

## How Old Norsund became Norsund

The sound changes are the `on-n` stage of [`13-history.yaml`](../../records/languages/norsund/grammar/13-history.yaml). The engine replays the whole history from a Proto-Valian root and shows every step: `node tools/cli.mjs evolve iliinu` gives Old Norsund *iliin* and Norsund *ilin*.

| Change | Old Norsund | Norsund |
|---|---|---|
| reduction of final *i, u* | Vilkyr**in**, kjold**ur**, voth**in** | Vilkyr**en**, kjold**er**, voth**en** |
| g-gliding | ne**g**i | na**y** |
| hw-simplification | **hw**ander | **w**ander |
| unstressed-shortening | il**ii**n | il**i**n |
| ey-merger | **ey** | **ei** |
| the article fused | kyr **hin** | kyr**in** |
| relative particle replaced | **ys** | **ke** (Kedre) |
| optative replaced | kjold**i** | **ma** kjolda |
| future auxiliary worn down | **halur** kjolda | **hal** kjolda |
| tens contracted | dov **dovthamm** | dov**tamm** |

Grammar thinned out at the same time:

- The cases fell away, except the genitive.
- Verbs stopped agreeing with plural subjects.
- Subordinate clauses took subject-verb-object order.
- *ne* moved after the verb in main clauses.

Norsund's evidentials grew from Old Norsund words:
- ***sa*** is the past of *saja*, "saw".
- ***sund*** is "song".
- ***stari*** is "of the stars".

The old law that "a witness who did not see does not swear" (*Sajir ys ne sa, thas ne vethur*) is why an Auristar court still treats testimony without *sa* as hearsay.

Some suffixes look identical in both languages (*-ir*, *-ning*, *-ling*, *-ug*), but Norsund did not inherit them directly. The inherited *-ir* became *-er* (Old *kjoldir* became Norsund *kjolder*), and Norsund later re-borrowed the old shapes from the law and liturgy register.

## For writers

- Use Old Norsund for oaths, laws, carved inscriptions, liturgy, sagas, rune magic and the voices of very old beings.
- Use plain spelling in prose and save þ and ð for in-world scholars quoting texts.
- Keep it short. A single line of Old Norsund followed by its meaning carries more weight than a paragraph.
- Never add evidentials to Old Norsund lines. Their absence is part of what makes the old voice sound old.
- A glowing rune means magic. Draw and describe ordinary runes as plain carving.
