# Norsund pronunciation guide

One page for actors, narrators, streamers and anyone reading Norsund aloud. The format follows David J. Peterson's High Valyrian guide: each letter gets an English sound it is **like** and a sound it is **never like**. Rules: [grammar/01-phonology.yaml](../../../records/languages/norsund/grammar/01-phonology.yaml). For any word, `node tools/cli.mjs respell <word>` gives the easy spelling and `node tools/cli.mjs ipa <word>` the exact one. To hear the canon names and the phrasebook, play the reference audio in [assets/audio/norsund/](../../../assets/audio/norsund/README.md).

## The one stress rule

**Stress the first syllable of every word.** In a compound, give the second part a lighter stress: STAR-ee-**rowg**-haym. Only learned Kedre loans (*alkimia*, *medikina*) break this rule: they stress the second-to-last syllable, al-ki-MEE-a.

## Vowels

| Letter | Like | Never like | Example |
|---|---|---|---|
| a | f**a**ther | c**a**t, l**a**te | *star* STAR |
| e | b**e**d; in an unstressed last syllable, the *a* in sofa | m**e** | *kjoldade*, *Vilkyren* VIL-kü-ren |
| i | mach**i**ne | **i**ce, s**i**t | *nim* NIM |
| o | m**o**re (short and pure) | h**o**t, g**o** | *kjold* KYOLD |
| u | r**u**le | c**u**p, p**u**t | *sund* SOOND |
| y | French *t**u***, German *ü*: say "ee" with rounded lips | **y**es, m**y** | *kyr* KÜR |
| aa ee ii oo uu yy | the same vowel, held longer | two syllables | *Haakon* HAH-kon |
| ei, ay | d**ay** | **eye** | *heim* HAYM, *nay* NAY |
| au | c**ow** | c**augh**t | *Auristar* OW-ree-star |
| ou | g**o** | **ou**t | *Oudeheim* OH-deh-haym |

## Consonants

| Letter | Like | Never like | Example |
|---|---|---|---|
| b d f k l m n p t v | as in English | | |
| g | **g**o | **g**em | *gand* GAND |
| s | **s**un | ro**s**e (z) | *sund* SOOND |
| h | **h**at; only before a vowel | silent | *heim* HAYM |
| j | **y**es | **j**am | *Starifjolden* STAR-ee-fyol-den |
| kj | the "k-y" in **c**ute, said as one sound | **k**id, **ch**in | *Kjoldmur* KYOLD-moor |
| gj | the "g-y" in ar**g**ue | **j**et | *gjal* GYAL |
| th | **th**in at the start of a word; **th**is between vowels | **t**ea, **f**in | *thiol* THYOL, *vetha* VEH-thah |
| ng | si**ng** (never a separate g); *n* before *k* or *g* sounds the same | fin**g**er | *strenk* STRENK, said [streŋk] |
| r | a tap or roll, as in Spanish *pe**r**o* | the English r glide | *rie* REE-eh |
| w | **w**et | **v**et | *Sundwanderen* SOOND-wan-der-en |
| ll, kk, gg … | held longer, as in Italian *be**ll**o* | a single short sound | *kull* KOOL (long l) |

**Easier readings.** It's fine to read *y* as "ee" with rounded lips, *kj* as "ky", and *r* as a light tap. It's never fine to read *j* as in "jam", *g* as in "gem", *s* as "z", or *a* as in "cat".

## The Auristar accent (Starisund)

People from Auristar make three changes in speech (PHON-10):

1. ***th* becomes *s*.** *Thiolden* sounds like "SYOL-den".
2. **A final *n* becomes *ng*.** *staren* sounds like "STAR-eng".
3. **Double consonants are short.** *kull* is not held.

| Word | Common Norsund | Auristar |
|---|---|---|
| Thiolden | [ˈθjol.dən] | [ˈsjol.dəŋ] |
| Vilkyren | [ˈvil.ky.rən] | [ˈvil.ky.rəŋ] |
| Dethiol | [ˈde.θjol] | [ˈde.sjol] |
| Kullmyr | [ˈkulː.myr] | [ˈkul.myr] |

Use the accent for characters raised in Auristar (Tyr, Astrid, the Lights, city guards). Use common Norsund for Vilnayan townsfolk, Vilkyren and travellers.

## Canon names

Respellings come from `node tools/cli.mjs respell`; IPA from `node tools/cli.mjs ipa`.

| Name | Say it | IPA |
|---|---|---|
| Thiolden | THYOL-den | [ˈθjol.dən] |
| Thiolnay | THYOL-nay | [ˈθjol.nej] |
| Auristar | OW-ree-star | [ˈau.riˌstar] |
| Aurinay | OW-ree-nay | [ˈau.ri.nej] |
| Norsund | NOR-soond | [ˈnor.sund] |
| Starisund | STAR-ee-soond | [ˈsta.riˌsund] |
| Vilkyr | VIL-kür | [ˈvil.kyr] |
| Vilkyren | VIL-kü-ren | [ˈvil.ky.rən] |
| Vilnay | VIL-nay | [ˈvil.nej] |
| Vilnayan | VIL-nay-an | [ˈvil.nej.an] |
| Nimkjold | NIM-kyold | [ˈnim.cold] |
| Kjoldmur | KYOLD-moor | [ˈcold.mur] |
| Norstarkjold | NOR-star-kyold | [ˈnor.star.cold] |
| Sundwanderen | SOOND-wan-der-en | [ˈsund.wan.de.rən] |
| Starifjolden | STAR-ee-fyol-den | [ˈsta.riˌfjol.dən] |
| Starirauggheim | STAR-ee-rowg-haym | [ˈsta.riˌraugː.hejm] |
| Midelmar | MEE-del-mar | [ˈmi.dəlˌmar] |
| Oudeheim | OH-deh-haym | [ˈou.dəˌhejm] |
| Marheim | MAR-haym | [ˈmar.hejm] |
| Farheim | FAR-haym | [ˈfar.hejm] |
| Lysmar | LÜS-mar | [ˈlys.mar] |
| Nurmyr | NOOR-mür | [ˈnur.myr] |
| Kullmyr | KOOL-mür | [ˈkulː.myr] |
| Runmyren | ROON-mü-ren | [ˈrun.my.rən] |
| Ilinvirden | EE-lin-vir-den | [ˈi.linˌvir.dən] |
| Virnayen | VIR-nay-en | [ˈvir.nej.ən] |
| Tyr | TÜR | [tyr] |
| Vimtyr | VIM-tür | [ˈvim.tyr] |
| Dethiol | DEH-thyol | [ˈde.θjol] |
| Fyren / Firen | FÜ-ren / FEE-ren | [ˈfy.rən] / [ˈfi.rən] |
| Ur | OOR | [ur] |
| Nett | NET | [netː] |
| Myr | MÜR | [myr] |
| Heid | HAYD | [hejd] |
| Stevlysen | STEV-lü-sen | [ˈstev.ly.sən] |
| Lysrit | LÜS-rit | [ˈlys.rit] |
| Stardul | STAR-dool | [ˈstar.dul] |
| Haakon | HAH-kon | [ˈhaː.kon] |
| Astrid | AH-strid | [ˈa.strid] |

## Recording

When you record a line for the franchise, record it three times:

1. at normal speed;
2. slowly;
3. syllable by syllable.

`node tools/cli.mjs packet "<line>"` prints the respelling, IPA, Auristar accent and gloss for any line. The full protocol is in [writers-and-actors-kit.md](writers-and-actors-kit.md).
