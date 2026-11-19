# Norsund reference grammar

Version 1.0.0 (2026-11-19). This is the readable form of the grammar records in [`records/languages/norsund/grammar/`](../../../records/languages/norsund/grammar/). Every section cites the rule IDs it explains (for example **NOUN-02**), so you can look up the source or quote a rule in a pull request. If this guide and the records ever disagree, the records win.

Every example here passes the Norsund engine. To check your own sentence, run `node tools/cli.mjs gloss "..."` from the repository root.

**Contents**

1. [How to read the examples](#1-how-to-read-the-examples)
2. [Sounds](#2-sounds)
3. [Spelling](#3-spelling)
4. [Nouns](#4-nouns)
5. [Adjectives and adverbs](#5-adjectives-and-adverbs)
6. [Pronouns and determiners](#6-pronouns-and-determiners)
7. [Verbs](#7-verbs)
8. [Evidentials](#8-evidentials)
9. [Word order and sentences](#9-word-order-and-sentences)
10. [Building words](#10-building-words)
11. [Numbers](#11-numbers)
12. [Names](#12-names)
13. [Registers and dialects](#13-registers-and-dialects)
14. [History](#14-history)
15. [Poetry](#15-poetry)

---

## 1. How to read the examples

Examples are written in three lines, following the [Leipzig Glossing Rules](https://www.eva.mpg.de/lingua/resources/glossing-rules.php):

```
Tyr kjold-ade mur-in.          the Norsund, with hyphens between word parts
Tyr guard-PST wall-DEF         one label for each part
"Tyr guarded the wall."        the translation
```

A dot joins two meanings carried by one part: `dul` = `fall.PST` (the past is shown by the vowel change, not a separate ending).

| Label | Meaning | Label | Meaning |
|---|---|---|---|
| 1SG, 2SG | I, you (one) | 1PL, 2PL | we, you (several) |
| 3SG.AN, 3PL.AN | he/she/they (beings) | 3SG.IN, 3PL.IN | it, they (things) |
| AN, IN | animate, inanimate | DEF | definite ("the") |
| PL | plural | GEN | genitive ("of", "'s") |
| OBJ, POSS | object form, possessive form | REFL, RECP | self, each other |
| PRS, PST | present, past | PTCP | past participle |
| PRS.PTCP | present participle (-ande) | INF | infinitive |
| IMP | command | OPT | wish (*ma*) |
| FUT, COND | will (*hal*), would (*halde*) | NEG | not (*ne*) |
| REL, COMP | relative *ke* ("who, which"), *ke* "that" | VOC | address ("O ...!") |
| CMPR, SUPL | comparative, superlative | ADV | adverb (-t) |
| AGT, VN | agent noun (-ir), verbal noun (-ning) | ORD | ordinal (-de) |
| EVID.SEEN | *sa*: I saw it | EVID.SUNG | *sund*: so it is sung |
| EVID.FATED | *stari*: so the stars say | | |

---

## 2. Sounds

The full pronunciation guide for actors and readers is [pronunciation-guide.md](pronunciation-guide.md). This section gives the rules.

### Inventory (PHON-01)

Norsund has 20 consonants and 6 vowels. Every vowel can be long, written double.

| | Lips | Teeth/ridge | Palate | Velum | Throat |
|---|---|---|---|---|---|
| Stops | p b | t d | kj /c/, gj /ɟ/ | k g | |
| Fricatives | f v | th /θ/, s | | | h |
| Nasals | m | n | | ng /ŋ/ | |
| Liquids | | l r | | | |
| Glides | w | | j | | |

| | Front | Front rounded | Back |
|---|---|---|---|
| High | i | y /y/ | u |
| Mid | e | | o |
| Low | a | | |

- **Long vowels:** aa ee ii oo uu yy (*Haakon* /ˈhaː.kon/).
- **Diphthongs:** ei/ay /ej/, au /au/, ou /ou/.
- **Reduced vowel:** [ə], spelled *e* (PHON-06).

### Stress (PHON-02)

Stress falls on the **first syllable** of every native word. A compound has one secondary stress, on the first syllable of its next element, unless that element starts at the second syllable.

| Word | Pronunciation |
|---|---|
| Thiolden | [ˈθjol.dən] |
| Starirauggheim | [ˈsta.riˌraugː.hejm] |
| alkimia (learned Kedre loan) | [al.kiˈmi.a], stress on the second-to-last syllable |

### Syllables (PHON-03)

A syllable is (C)(C)(C)V(C)(C)(C). Only certain clusters are allowed. The full lists are in [`01-phonology.yaml`](../../../records/languages/norsund/grammar/01-phonology.yaml), and `node tools/cli.mjs check <word>` tests a word against them.

- **Allowed onsets** include single consonants, consonant + *j* (*kj, fj, hj, sj, bj, tj*), consonant + *r/l* (*br, tr, thr, kl, fl*), *s* + stop (*sk, st, sp, str, skr, skj, stj*), *sw, tw, dw, kw, kv*, and *grj* (*grjot* "stone").
- ***ng*** never starts a word.
- ***h, j, w*** never end a syllable.
- ***kj, gj*** never end a word.
- **Double consonants** only follow a vowel.

### Sound rules

| Rule | What happens | Example |
|---|---|---|
| PHON-04 | *th* is [θ] at the start of a word and next to voiceless consonants, [ð] between vowels and after a final vowel | *thiol* [θjol], *vetha* [ˈve.ða] |
| PHON-05 | An unstressed *i* before a vowel is the glide [j]; an unstressed *u* before a vowel is [w] | *Thiolden* [ˈθjol.dən] |
| PHON-06 | *e* in an unstressed final syllable is [ə]; this applies to each compound element and every ending | *Vilkyren* [ˈvil.ky.rən], *Oudeheim* [ˈou.dəˌhejm] |
| PHON-07 | *n* before *k* or *g* is [ŋ] | *strenk* [streŋk] |
| PHON-08 | Double consonants are long | *kull* [kulː] |
| PHON-09 | *r* is a tap between vowels, a trill elsewhere; never the English glide | *starin* [ˈsta.ɾin] |
| PHON-10 | **Starisund accent:** *th* → [s], final *n* → [ŋ], double consonants short | *Thiolden* [ˈsjol.dəŋ] |
| PHON-11 | Easier readings for voice work: *y* as rounded "ee", *kj* as "ky", light tap for *r* | see the pronunciation guide |

---

## 3. Spelling

| Rule | Summary |
|---|---|
| ORTH-01 | Letters: a b d e f g h i j k l m n o p r s t u v w y, plus *th, kj, gj, ng*. No accents, no apostrophes, no c, q, x, z. |
| ORTH-02 | /ej/ is spelled *ei* inside a word and *ay* at the end (*heim*, *nay*). A stem keeps *ay* before endings (*Vilnayan*). |
| ORTH-03 | Compounds are one word. Use a hyphen where two parts would be misread as a digraph (*n-g, t-h, k-j, g-j*): *nim-gand*, *thyrn-grjot*. Three identical consonants become two. |
| ORTH-04 | Capitalize names, gods, peoples, languages, titles used with a name (*Lys Thrimde*) and the first word of a sentence. Ordinary nouns, days and months are lower-case. |
| ORTH-05 | Names from other languages keep their spelling (*Karhak'Modan*, *Kyr Thor'Vale*). Their apostrophe stands for a real sound ([languages.yaml](../../../records/languages/languages.yaml)). |
| ORTH-06 | Standard spellings: **Midelmar**, **Haakon**, **Volggan**, **Vairean**, **Rechtar**. |
| ORTH-07 | Scholars may cite Old Norsund with þ, ð and acute accents (*þjol*). Reconstructed forms are starred (*\*geldhu*). Modern Norsund never uses these letters. |
| ORTH-08 | Latin punctuation. A raised dot (·) separates half-lines in verse. A comma sets off an evidential: *Tyr kjoldade murin, sa.* |
| ORTH-09 | The glide [j] after *th* is written *i*: *thiol*, *thiarka*. After every other consonant it is *j*: *kjold*, *hjalda*. |

**Alphabetical order** (dictionaries): a, b, d, e, f, g, gj, h, i, j, k, kj, l, m, n, ng, o, p, r, s, t, th, u, v, w, y. So *kjold* comes after *kyr*.

---

## 4. Nouns

### Living and non-living (NOUN-01)

Every noun is **animate** (people, gods, spirits, beasts) or **inanimate** (everything else). The class decides the plural. The same root can be both: *kyr* "blade" is inanimate, but *Vilkyr* "free sword (a person)" is animate.

### Endings (NOUN-02, NOUN-04, NOUN-05)

| | Animate | Inanimate |
|---|---|---|
| Plural | -en | -ar |
| "the" (singular) | -in | -in |
| "the" (plural) | -ene | -arne |
| Genitive ("of", "'s") | -i after a consonant, -s after a vowel | same |

- After a vowel, the singular "the" is just **-n** (*nay* → *nayn*).
- A stem ending in unstressed **-e** drops the *e* or *a* of the ending (*rie* → *rier*, *rien*).
- A stem ending in **-a** drops the *a* of *-ar* (*kelda* → *keldar*).

Full paradigms (NOUN-T1):

| | free sword | blade | folk | canal | person | spring |
|---|---|---|---|---|---|---|
| singular | Vilkyr | kyr | nay | rie | lud | kelda |
| plural | Vilkyren | kyrar | nayen | rier | lyd | keldar |
| the | Vilkyrin | kyrin | nayn | rien | ludin | keldan |
| the (plural) | Vilkyrene | kyrarne | nayene | rierne | lydene | keldarne |
| of the | Vilkyrini | kyrini | nayni | rieni | ludini | keldani |

```
Vilkyr-en          kyr-ar            rie-r
free.sword-PL.AN   blade-PL.IN       canal-PL.IN
"free swords"      "blades"          "canals"
```

### Umlaut plurals (NOUN-03)

Six very old animate nouns change their vowel instead of adding -en. They are leftovers of a lost Proto-Norsund plural ending, which also explains why hand, foot and tooth count as animate.

| Singular | Plural | Meaning |
|---|---|---|
| lud | lyd | person, people |
| thamm | themm | hand |
| gat | get | goat |
| fuld | fyld | foot |
| tunn | tynn | tooth |
| brod | bred | sibling |

Their definite plurals add -ene to the changed vowel: *lydene* "the people".

### "The" is an ending (NOUN-04)

There is no word for "a". A bare noun is indefinite; *yn* "one" can mean "a certain".

```
kyr-in       kyr-arne          Vilkyr-ene
blade-DEF    blade-DEF.PL.IN   free.sword-DEF.PL.AN
"the blade"  "the blades"      "the free swords"
```

### Possession (NOUN-05)

The possessor comes first and takes -i (or -s after a vowel). The thing possessed takes no "the"; the possessor already makes it definite.

```
Tyr-i kyr         kyr-in-i tyr          Vilkyr-ene-s grind
Tyr-GEN blade     blade-DEF-GEN edge    free.sword-DEF.PL.AN-GEN gate
"Tyr's blade"     "the blade's edge"    "the free swords' gate"
```

### No other cases (NOUN-06)

Subjects and objects look the same on nouns. Word order (section 9) and pronoun forms show who does what. Old Norsund had four cases; they survive only in set phrases and the oath register ([old-norsund.md](../old-norsund.md)).

### Mass nouns (NOUN-07)

Substances have no plural unless they mean kinds or portions: *ylv* "water", *aul* "ale", *grjot* "stone". *Dov seimkjalar* means "two (servings of) mead".

### Addressing someone (NOUN-08)

In Starisund, a title used to address someone takes **-a**: *Lysa!* "O Light!", *Kyra!* "O Blade!", *Fyra!* "O Fire!" (to a tavern cook). Ordinary names do not change.

### Theology in the grammar (NOUN-09)

In Starisund, stars, constellations and the Auristar are **animate**: *staren* "stars", and a star is *sel* "he/she". Country speech treats them as objects: *starar*, *at* "it". Saying *starar* in an Auristar temple marks you as an outsider.

```
star-en          star-ar
star-PL.AN       star-PL.IN
"stars" (Starisund)   "stars" (common Norsund)
```

---

## 5. Adjectives and adverbs

| Rule | Summary | Example |
|---|---|---|
| ADJ-01 | Adjectives go before the noun and never change. | *aur star-in* "the silver star" |
| ADJ-02 | After *vesa* "be" they stay the same. Mottos and inscriptions drop the present *es*. | *Kyr-in es skarp.* "The blade is sharp." |
| ADJ-03 | Any adjective can be a noun, with animate endings by default. | *thiol-in* "the brave one", *thiol-en* "the brave", *thiol-ene* "the brave ones" |
| ADJ-04 | Comparative -ar, superlative -ast; "than" is *thon*; "as ... as" is *sam ... sam*. | *Tyr es thiol-ar thon Ulf.* "Tyr is braver than Ulf." |
| ADJ-05 | Adverbs add -t, or -et where -t would make an illegal ending. *Ful* means "very". | *thiolt* "bravely", *langet* "at length", *ful aur* "very bright" |
| ADJ-06 | Adjectives from nouns: -a "of", -ug "full of", -nuth "without". | *Vilnaya*, *starug* "starry", *lysnuth* "lightless" |

Four adjectives are irregular in comparison (ADJ-04):

| Base | Comparative | Superlative | Meaning |
|---|---|---|---|
| hel | batar | bast | good |
| vond | verr | verst | bad |
| myk | meir | mest | much, many |
| lit | minn | minst | little, few |

*Hel* also has the irregular adverb *helt* "well". In Auristar, people joke that the superlative *-ast* means "starred".

```
Sel brakk-ade thiol-t.
3SG.AN fight-PST brave-ADV
"She fought bravely."
```

---

## 6. Pronouns and determiners

### Personal pronouns (PRON-01)

Third-person pronouns mark living vs non-living, not sex. *Sel* covers he, she and singular they.

| | Subject | Object | Possessive |
|---|---|---|---|
| I | em | om | emi |
| you (one) | dy | du | dys |
| he/she/they (a being) | sel | sal | seli |
| it | at | at | ati |
| we | emen | omen | emeni |
| you (several; polite) | dyn | dun | dyni |
| they (beings) | selen | salen | seleni |
| they (things) | atar | atar | atari |

The object forms change the vowel (em/om, dy/du, sel/sal). Possessives go before the noun and replace "the". Prepositions take object forms: *hjo omen* "with us", *ymb du* "around you".

```
Em saj-er du.          emi kyr               Kyr-in es emi.
1SG see-PRS 2SG.OBJ    1SG.POSS blade        blade-DEF be.PRS 1SG.POSS
"I see you."           "my blade"            "The blade is mine."
```

### Polite "you" (PRON-02)

In Auristar, you address a Light, a superior or a stranger of rank with the plural *dyn / dun / dyni*. Common Norsund uses *dy* with everyone, which Aurinay find blunt.

```
Lys-a, kjold-er dyn emeni heim?
light-VOC guard-PRS 2PL 1PL.POSS home
"O Light, will you guard our home?"
```

### Self and each other (PRON-03)

*Sjo* "self" serves every person; *sjosjo* means "each other".

```
Tyr saj-er sjo i ylv-in.
Tyr see-PRS REFL in water-DEF
"Tyr sees himself in the water."
```

### This and that (PRON-04)

*Hes* "this, these" and *thas* "that, those" go before a noun that **also** carries "the" (double definiteness): *hes kyrin* "this blade", *thas Vilkyrene* "those free swords".

### Question words (PRON-05)

Question words start with **ku-**. Adding *yn-*, *ne-* or *al-* gives "some-", "no-" and "every-" words.

| | person | thing | place | time | reason | manner | amount |
|---|---|---|---|---|---|---|---|
| question | kum who | kut what | kur where | kuna when | kuvi why | kuso how | kumik how much |
| some- | ynkum | ynkut | ynkur | ynkuna | ynkuvi | ynkuso | ynkumik |
| no- | nekum | nekut | nekur | nekuna "never" | nekuvi | nekuso | nekumik |
| every- | alkum | alkut | alkur | alkuna "always" | alkuvi | alkuso | alkumik |

"Which" is *kul*. *Kuna* is also the conjunction "when".

```
Kum kjold-ade mur-in?       Nekum kjold-er at.
who guard-PST wall-DEF      no.one guard-PRS 3SG.IN
"Who guarded the wall?"     "No one guards it."
```

**Quantifiers:** *al* "all, every", *sver* "each", *myk* "much, many", *lit* "little, few", *nok* "some", *nen* "no, not any", *annar* "other", *sam* "same".

### The dummy subject (PRON-06)

Weather verbs need something before the verb (section 9), so they take *at* "it": *At drifer.* "It's snowing." *At druser.* "It's raining."

---

## 7. Verbs

Verbs never change for person: one present form serves I, you and they. Every dictionary form ends in **-a**, and the stem is the dictionary form minus *-a*.

### Regular verbs (VERB-01)

| Form | Ending | *kjolda* "guard" | *wandra* "roam" |
|---|---|---|---|
| Infinitive | -a | kjolda | wandra |
| Present | -er | kjolder | wandrer |
| Past | -ade | kjoldade | wandrade |
| Participle | -ad | kjoldad | wandrad |
| Present participle | -ande | kjoldande | wandrande |
| Command | (stem) | kjold! | wandre! |
| Verbal noun | -ning | kjoldning | wandrening |
| Agent noun | -ir | kjoldir | wandrir |

When the bare stem would end in a cluster that isn't allowed (*wandr-*), the command adds -e (*wandre!*). All new verbs are regular.

### Strong verbs (VERB-02)

About twenty old, common verbs change their vowel in the past and take -en in the participle. Their present is regular.

| Class | Pattern | Verbs (infinitive – past – participle) |
|---|---|---|
| I | i – ei – i | lida *come* – leid – liden; rida *ride* – reid – riden; skrida *creep* – skreid – skriden; bita *bite* – beit – biten; bida *wait* – beid – biden |
| II | u/y – au – o | skuva *push* – skauv – skoven; drypa *drip* – draup – dropen |
| III | e – a – o | hensa *take* – hans – honsen; mela *say* – mal – molen; vetha *swear* – vath – vothen; bresta *burst* – brast – brosten |
| IV | o – u – o | dola *fall* – dul – dolen |
| V | a – o – a | aga *have* – og – agen; gana *go* – gon – ganen |

```
Auristar dul.            Em leid.
Auristar fall.PST        1SG come.PST
"The Auristar fell."     "I came."
```

### Irregular verbs (VERB-03)

| | Present | Past | Participle | Command |
|---|---|---|---|---|
| vesa "be" | es | vas | vesen | ves |
| saja "see" | sajer | sa | sajen | se |
| jova "give" | jover | jav | joven | jov |

The present *es* is dropped in mottos, inscriptions and verse (the "carved style"): *Vil kyrin, vothen sundin.* "Free the blade, bound the word."

### Tense, aspect and mood

| Meaning | How | Example | Rule |
|---|---|---|---|
| present, habit, near future | -er | *Tyr kjolder murin.* "Tyr guards the wall." | VERB-01 |
| past | -ade, or vowel change | *Tyr kjoldade murin.* | VERB-01, 02 |
| future, firm intention | *hal* + infinitive | *Tyr hal kjolda murin.* "Tyr will guard the wall." | VERB-04 |
| "would" | *halde* + infinitive | *Sof em vas thiol, em halde rida.* "If I were brave, I would ride." | VERB-04 |
| perfect | *aga* + participle | *Tyr ager kjoldad murin.* "Tyr has guarded the wall." | VERB-05 |
| in progress | *vesa* + -ande | *Tyr es kjoldande.* "Tyr is on guard." | VERB-06 |
| passive | *vesa* + participle (+ *ur* "by") | *Murin vas kjoldad ur Tyr.* "The wall was guarded by Tyr." | VERB-07 |
| wish, blessing | *ma* + subject + infinitive | *Ma staren kjolda dun!* "May the stars keep you!" | VERB-08 |
| can, must, want, may | *orka, noda, thursa, lofa* + infinitive | *Em orker ne rida.* "I cannot ride." | VERB-09 |

### Negation (VERB-10)

- **Main clause:** *ne* comes right after the verb, or after the subject when the subject follows the verb.
- **Subordinate clause:** *ne* comes before the verb.
- **Prohibition:** *ne* + command.

```
Tyr kjold-er ne mur-in.            Fjol star-in lys-er run ne.
Tyr guard-PRS NEG wall-DEF         under star-DEF shine-PRS rune NEG
"Tyr does not guard the wall."     "Beneath the star, no rune shines."

... star ke ne vyrn-er             Ne kjal!
... star REL NEG move-PRS          NEG drink.IMP
"... a star that does not move"    "Don't drink!"
```

### Verbs from nouns (VERB-11)

Any noun becomes a regular verb with -a: *sund* "song" → *sunda* "sing", *lys* "light" → *lysa* "shine", *rit* "writing" → *rita* "write".

---

## 8. Evidentials

Norsund speakers mark how they know what they say, with a particle at the end of the sentence, set off by a comma (EVID-01). Each particle grew out of an ordinary word.

| Particle | Meaning | Grew out of |
|---|---|---|
| *sa* | I witnessed it | past of *saja* "see" |
| *sund* | so it is sung; I heard it | *sund* "song" |
| *stari* | so the stars say; it is fated | *star-i* "of the stars" |

```
Tyr kjold-ade mur-in, sa.          "Tyr guarded the wall. (I saw it.)"
Tyr guard-PST wall-DEF EVID.SEEN

Tyr kjold-ade mur-in, sund.        "Tyr guarded the wall. (So the songs say.)"
Tyr guard-PST wall-DEF EVID.SUNG

Tyr hal kjold-a mur-in, stari.     "Tyr will guard the wall. (It is foretold.)"
Tyr FUT guard-INF wall-DEF EVID.FATED
```

- **Where they are required (EVID-02):**
  - Oaths and court testimony take *sa*. In Auristar, testimony without *sa* counts as hearsay (*Saning ute sa es sundmal*).
  - Prophecies and temple decrees end in *stari*.
  - A bard's song opens with *Sund!* and its narrative lines take *sund*.
- **In questions (EVID-03)** the particle asks about the listener's source: *Kum kjoldade murin, sa?* "Who guarded the wall — did you see it yourself?"
- **Preferences (EVID-04):** Starisund speakers favour *stari*, Vilnayan towns *sund*, and Vilkyren reports *sa*. The Old Norsund register has none.

---

## 9. Word order and sentences

### Verb second (SYN-01)

In a main statement the verb is always **second**. The first slot can hold the subject, the object, an adverb or a whole phrase. Whatever goes first, the subject moves after the verb. The basic order is subject, verb, object, then manner, place and time.

```
Tyr kjold-er mur-in i nim-in.          "Tyr guards the wall at night."
Tyr guard-PRS wall-DEF in night-DEF

I nim-in kjold-er Tyr mur-in.          "At night, Tyr guards the wall."
in night-DEF guard-PRS Tyr wall-DEF

Skrimm-in thiark-er em.                "The monster, I hunt."
monster-DEF hunt-PRS 1SG
```

When the object comes first, context and animacy show who does what.

### Questions (SYN-02)

Yes/no questions put the verb first. Questions with a *ku-* word put that word first and the verb second. "Yes" is *hel* ("good, whole") and "no" is *ne*.

```
Kjold-er dy mur-in?          Kur gan-er sel?
guard-PRS 2SG wall-DEF       where go-PRS 3SG.AN
"Do you guard the wall?"     "Where is she going?"
```

### Subordinate clauses (SYN-03)

Subordinate clauses don't use verb-second. The order is subject, then *ne*, then verb. They start with:

| Word | Meaning |
|---|---|
| *ke* | that |
| *sof* | if |
| *kuna* | when |
| *ter ke* | because |
| *for ke* | before |
| *aft ke* | after |
| *thon* | than |
| *medan* | while |

```
Em skyn-er ke Tyr ne kjold-er mur-in.
1SG know-PRS COMP Tyr NEG guard-PRS wall-DEF
"I know that Tyr does not guard the wall."
```

A fronted subordinate clause fills the first slot, so the main verb comes next. In *Kuna lydene wandrade ur austin, hyttade selen slaun* ("When the people wandered from the east, they found a plain"), the verb *hyttade* comes straight after the clause.

### Relative clauses (SYN-04)

The relative clause follows its noun and starts with *ke* (a Kedre loan). For "whose", use *ke* + a possessive pronoun.

```
Vilkyr-in ke kjold-ade mur-in              "the free sword who guarded the wall"
free.sword-DEF REL guard-PST wall-DEF

Vilkyr-in ke seli kyr brast                "the free sword whose blade broke"
free.sword-DEF REL 3SG.AN.POSS blade burst.PST
```

### Noun phrase order (SYN-05)

The order is determiner or possessor, number, adjective, noun, prepositional phrase, relative clause:

- *Tyri dov skarp kyrar* "Tyr's two sharp blades"
- *hes thrim aur staren i nettin* "these three silver stars in the sky"

### Other patterns

| Rule | Pattern | Example |
|---|---|---|
| SYN-06 | *eth* "and", *ava* "but", *vo* "or"; *eth ... eth* "both ... and"; *vo ... vo* "either ... or" | *Ur eth Nett* |
| SYN-07 | Emphasis: *es* + phrase + *ke* + clause | *Es Tyr ke kjolder murin.* "It is Tyr who guards the wall." |
| SYN-08 | "There is": place first, or *at* | *I murin es run.* "There is a rune in the wall." |
| SYN-09 | Prepositions only (see below) | *fjol starin* "beneath the star" |
| SYN-10 | An evidential closes the sentence, after everything else | *..., stari.* |

**Prepositions (SYN-09):**

| Preposition | Meaning | Preposition | Meaning |
|---|---|---|---|
| *i* | in | *ymb* | around, about |
| *a* | on, at | *mid* | among |
| *ve* | to, toward | *for* | before |
| *ur* | out of, from, by | *aft* | after |
| *fjol* | under | *ute* | outside, without |
| *mar* | above | *inn* | into |
| *hjo* | with | *mot* | against |
| *ter* | for | *til* | until |
| *thurg* | through | *ova* | across |

---

## 10. Building words

Most of the vocabulary is built from a few hundred roots. Before coining a new root, try these.

### Compounds (WF-01, WF-02)

The **last part is the head**; earlier parts describe it: *nim-kjold* "night-ward" (the Nimkjold), *kjold-mur* "ward-wall" (the Kjoldmur). When the first part owns the second, a linking **-i-** joins them: *Stari-fjolden* "the stars' under-land", *Aur-i-star*, *Stari-sund* "star-tongue".

### Affixes

| Affix | Makes | Meaning | Example |
|---|---|---|---|
| -ir | person | one who does | *smida* → *smidir* "crafter" |
| -ning | thing | the act or result | *kjolda* → *kjoldning* "watch" |
| -eth | thing | -ness, -dom | *thiol* → *thioleth* "bravery", *vil* → *vileth* "freedom" |
| -ling | noun | small or young one | *ulf* → *ulfling* "wolf cub", *kyr* → *kyrling* "dagger" |
| -heim | place | house of | *kjala* → *kjalheim* "tavern" |
| -vang | place | open place for | *merk* → *merkvang* "market field" |
| -a | adjective | of | *Vilnay* → *Vilnaya* |
| -ug | adjective | full of | *star* → *starug* "starry" |
| -nuth | adjective | without | *lys* → *lysnuth* "lightless" |
| -t | adverb | -ly | *thiol* → *thiolt* "bravely" |
| -nay | people | folk of | *Thiolden* → *Thiolnay* |
| -an | place | lands of a folk | *Vilnay* → *Vilnayan* |
| -den | place | land of | *thiol* → *Thiolden* |
| -myr | people | god-blessed tribe | *kull* → *Kullmyr* |
| -ung | name | child of | *Alkregg* → *Alkreggung* |
| ne- | | un-, not | *nethiol* "cowardly" |
| mar- | | great, arch- | *marulf* "dire wolf", *markjold* "citadel" |
| ur- | | first, ancestral | *urheim* "ancestral home" |
| al- | | all- | *alskyn* "all-knowing" |

### Special rules

| Rule | Summary |
|---|---|
| WF-03 | **Demonyms:** first element + *-nay* (*Auristar* → *Aurinay*, *Oudeheim* → *Oudenay*, *Midelmar* → *Midelnay*). |
| WF-04 | **Old agent nouns:** a few keep the dead suffix *-er* (*wander* "wanderer", *kjolder* "sentry"). New ones use *-ir*. |
| WF-05 | **Kennings:** a two-part image in place of a plain noun (*kyrsund* "blade-song" = battle). See section 15. |
| WF-07 | **The two -a suffixes:** *-a* makes adjectives (*Vilnaya*) and also verbs (*sunda*). The dictionary says which reading a word has. |
| WF-06 | **Coining checklist:** can existing roots do it? Does the new form pass `check`? Is it a real word or slur elsewhere? Mark layer and epoch, then open a pull request ([contributing-words.md](contributing-words.md)). |

---

## 11. Numbers

| | | | | | | | | | | | | |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 yn | 2 dov | 3 thrim | 4 ves | 5 thamm | 6 sesk | 7 sev | 8 ath | 9 nyv | 10 tamm | 100 haun | 1000 mork | 120 langhaun |

- **Teens:** tamm + unit (*tammyn* 11, *tammdov* 12, *tammsev* 17).
- **Tens:** unit + tamm (*dovtamm* 20, *sevtamm* 70).
- **Large numbers** go largest first, with no "and". The population of Auristar, 523,208, is *thammhaun dovtamm thrim mork, dovhaun ath*.
- Try `node tools/cli.mjs number 523208`.

| Rule | Summary |
|---|---|
| NUM-01 | *Thamm* means both "hand" and "five"; *tamm* "ten" is worn down from \**dov-thamm* "two hands". |
| NUM-02 | In Starisund, seven is *stev*, reshaped by *star*. The Seven Lights are *Stevlysen*. |
| NUM-03 | A number takes a plural noun, except *yn*: *dov kyrar* "two blades", *yn Vilkyr* "one free sword". |
| NUM-04 | Ordinals come before the noun (*thrimde kreth* "the third ring") but after a title (*Lys Thrimde* "the Third Light"). |
| NUM-05 | Years use *ar*: *ar dovtamm sev aft Vaire* (27 a.v.e.); Auristar also counts *ar yn aft Stardul* (from the Fall of the Star, 90 a.v.e.). |

**Ordinals:** *ura* 1st, *dovde* 2nd, *thrimde* 3rd, *veste* 4th, *thamde* 5th, *seskte* 6th, *sevde* (Starisund *stevde*) 7th, *atte* 8th, *nyvde* 9th, *tamde* 10th.

The Seven Lights are *Lys Ura, Lys Dovde, Lys Thrimde, Lys Veste, Lys Thamde, Lys Seskte, Lys Stevde*.

**Fractions:** *mid* "half", *thrimdel* "a third", *vesdel* "a quarter".

---

## 12. Names

Naming has its own guide, [naming-guide.md](naming-guide.md). In short:

| Rule | Summary |
|---|---|
| NAME-01 | **Places** are modifier(s) + a generic, written as one word: *Nor* + *skyl* = *Norskyl* "North Falls". |
| NAME-02 | **Peoples** use *-nay* for the folk of a place, *-an* for their lands and *-myr* for a god-blessed tribe. |
| NAME-03 | **People:** given name + parent-name in *-ung*: *Astrid Alkreggung*. |
| NAME-04 | **Bynames** take "the": *Eify Dunkstarin* "Eify the Darkstar". |
| NAME-05 | **Noble houses** are founder + *-ungen*. |
| NAME-06 | **Titles** come first: *Lys*, *Kyr*, *drott*, *vard*. |
| NAME-07 | **Foreign names** keep their own form. |
| NAME-08 | **Translation convention** for English prose. |
| NAME-09 | **Renames applied to the lore records:** *Valinor* → *Valnor*, *Worgenkin* → *Ulfkin*, *Exeter* → *Exaire*, *Arbury* → *Arbaire*. |

---

## 13. Registers and dialects

The full guide is [dialects.md](dialects.md).

- **Spoken varieties:** common Norsund, Starisund (Auristar), Farheim island speech, Kullmyr speech, Nurmyr speech and the Thieves' cant.
- **Four styles:** Old Norsund (oaths, law, liturgy, runes), the learned style (Kedre loans with Kedre stress), bardic verse, and the carved style.
- **REG-01, shibboleths:**
  - *Thiolden* said as [ˈsjol.dəŋ] marks an Aurinay.
  - *staren* vs *starar* marks a temple-goer vs a villager.
  - *eim* for *heim* marks a Nurmyr.
  - *Firen* for *Fyren* marks the Kullmyr.
- **REG-02, doublets:** one Kedre root borrowed twice gives an everyday word and a learned one: *tur* "tower" and *turra* "fortress-tower".

---

## 14. History

Norsund descends from **Proto-Valian** through **Proto-Norsund** (the island of Farheim) and **Old Norsund** (the settlers of 450 b.v.e.). Kedre, the imperial language, comes from Proto-Valian by a separate road, so the two are distant cousins: *lys* and *Luxis* are the same word. [`13-history.yaml`](../../../records/languages/norsund/grammar/13-history.yaml) lists every sound change in order, and the engine replays them. Try `node tools/cli.mjs evolve geldhu`, which gives *kjold*.

The main changes from Proto-Valian to Norsund:

1. **A three-step consonant shift.** *p t k* > *f th h*, except after *s*. *b d g* > *p t k*. Breathy *bh dh gh* > *b d g*.
2. **Palatalization:** *k, g* > *kj, gj* at the start of a word before *e* or *i*.
3. **Breaking:** *e* > *jo* before *u*, and *e* > *ja* before *a*, in the next syllable. This is why *\*telu* became *thiol*.
4. **Umlaut:** back vowels move forward before *i* in the next syllable.
5. **Final vowels are lost:** a final *u* after a consonant, and a final *i* after a single non-velar consonant.
6. **In Norsund itself:**
   - *g* between vowels becomes a glide (*negi* > *nay*).
   - Final-syllable *i* and *u* become [ə] (*Vilkyrin* > *Vilkyren*).
   - Unstressed long vowels shorten.

| Proto-Valian | Old Norsund | Norsund | Kedre | Meaning |
|---|---|---|---|---|
| \*telu | thiol | thiol | telo | brave |
| \*geldhu | kjold | kjold | geldo | ward |
| \*guri | kyr | kyr | guri | blade |
| \*luksi | lys | lys | luxi (Luxis) | light |
| \*naghi | negi | nay | nahi | folk |
| \*iliinu | iliin | ilin | ilino | holy |
| \*kwandhru | hwander | wander | kvandro | wanderer |

- **HIST-01:** *kyr* has *k*, not *kj*, because palatalization was over before umlaut turned its *u* into *y*.
- **HIST-02:** about 575 documented years separate the settlers from Auristar's walls. Old Norsund is hard but partly readable to a modern speaker, as Chaucer is for English speakers.

---

## 15. Poetry

| Rule | Summary |
|---|---|
| POET-01 | The **sundlag** line has two half-lines of two stresses each, split by ·. The first stressed word of the second half must alliterate with a stressed word of the first half. All vowels alliterate together; *sk, st, sp* only with themselves. |
| POET-02 | **Kennings** name a thing by an image. |
| POET-03 | **Heiti** are Old Norsund words used only in verse: *jor* "steed" for *hest*, *bran* "blade" for *kyr*, *ljom* "radiance" for *lys*. |
| POET-04 | Songs open with *Sund!* and close with *Sva sundade em, sund.* Praise of the Lights closes with *stari*. |

Common kennings (POET-02):

| Kenning | Literally | Means |
|---|---|---|
| *kyrsund* | blade-song | battle |
| *starigand* | star-road | a canal of Auristar |
| *nettylv* | sky-water | the water of the Auristar |
| *fyrin kjalheimi* | the fire of the tavern | the cook |
| *kvitburd* | white city | Auristar |
| *graunkjal* | raven's ale | blood |

```
Stevlysen ur ljomin · lyser ymb kvitburdin
"The Seven Lights from the radiance · shine around the white city"
(lyser alliterates with ljomin)
```

The full praise poem and a news-song are in [`texts/03-thiolden-texts.yaml`](../../../records/languages/norsund/texts/03-thiolden-texts.yaml).
