# Kedre

Kedre ("the Tongue") is the language of the **Vairean Empire**, spoken in the imperial city of Keras and the old Kingdom of Reinovaire, in Valnor, the north of Valia. It arrived in Thiolden with Rechtar Vaire's conquest (37–51 a.v.e.) and his daughter Doir Vaire's rule over the Vilnayan towns. It left a lasting layer of words in Norsund, much as Norman French did in English.

Kedre is a **distant cousin** of Norsund. Both descend from Proto-Valian, so many basic words correspond: Norsund *thiol* and Kedre *telo* both mean brave, and the Norsund goddess **Lysmar** is the Kedre goddess **Luxis**.

The source files are in `records/languages/kedre/`:

| File | What it holds |
|---|---|
| `grammar.yaml` | the complete grammar: 34 rules and 6 paradigm tables |
| `dictionary.yaml` | 384 entries, including the Swadesh core and the source of every Kedre loan in Norsund |
| `texts.yaml` | 6 glossed texts (31 lines) |
| `kedre.yaml` | the facts about the language for the lore index |

## Sounds and spelling

Kedre looks Latin to a reader on purpose: it is the conquerors' polished, imperial voice. It has its own rules, though.

| | lips | ridge | palate | velum | throat |
|---|---|---|---|---|---|
| stops | p b | t d | | k g | |
| fricatives | f v | s | | | h |
| nasals | m | n | | | |
| liquids | | l r | | | |
| glide | | | j | | |

- **Vowels:** a e i o u, with the diphthongs ai, au and ei. All vowels are short.
- **No th, y, w, kj or gj.** Proto-Valian *w* became *v*; the breathy stops became *f* at the start of a word and *b/d* inside it. That gives *fens* "land" beside Norsund *den*, *fovo* "two" beside *dov* and *geldo* "shield" beside *kjold*.
- **Stress** falls on the second-to-last syllable: KE-ras, ke-RI-a, rei-no-VAI-re.
- **Syllables:**
  - Words end in a vowel or in s, n or r.
  - Clusters are short: a stop plus r or l (*tr*, *pl*); s plus p, t or k; and *kv*.
  - Inside a word, consonants can be doubled (*murra*, *atti*).
- **Spelling:** k is always k; x is ks (*Luxis*); j is the y-sound of "yes" (*jubare*). The old spelling *cht* in *Rechtar* is a rasping [xt]. In English lore, Kedre names keep their Kedre spelling.

## Grammar at a glance

**No gender, no case, no articles.** Plurals change the final vowel:

| singular | plural | example |
|---|---|---|
| -o | -i | *legaro* soldier → *legari* |
| -a | -e | *legia* legion → *legie* |
| -e | -i | *kedre* tongue → *kedri* |
| -i | -ie | *luxi* light → *luxie* |
| -u (camp words) | -ui | *merkadu* market → *merkadui* |
| consonant | -es | *fens* land → *fenses* |

**Head first.** The main word comes first. Adjectives, "this/that", possessives and owners follow it; numbers and *kada* "every" go before it.

| Kedre | Word for word | Meaning | Norsund puts it the other way round |
|---|---|---|---|
| Reinovaire | realm Vaire | the realm of Vaire | — |
| Domo Luxis | house Luxis | the Church of Light | Lysmari heim |
| luxi tue | light your | your light | dys lys |
| legia telo esto | legion brave this | this brave legion | hes thiol kjoldin |

**The dignity suffix -s** marks gods, imperial titles and holy cities: *luxi* "light" → **Luxis** the goddess; *kera* "crown" → **Keras** "the Crowned" city.

**Adjectives** don't change. "More" is *plu* with *ke* "than": *plu telo ke Rechtar* "braver than Rechtar". The superlative takes *supra-*: *supratelo* "bravest". Adverbs end in *-e*: *tele* "bravely".

**Verbs** come in two classes:

| | luxare "bless" | tenire "hold" |
|---|---|---|
| present (I, you, he/she, we, you, they) | luxo, luxi, luxa, luxamo, luxate, luxan | teno, teni, tene, tenimo, tenite, tenen |
| past | luxavo … luxava … luxavan | tenivo … teniva … tenivan |
| subjunctive (wishes; "so that") | luxia, luxian | tenia, tenian |
| imperative | luxa! luxate! | teni! tenite! |
| participles | luxato "blessed", luxante "shining" | tenito, tenente |
| future | vole luxare | vole tenire |
| passive | es luxato "is blessed" | es tenito |

*esere* "to be" is the one irregular verb: *so, ses, es, somo, sete, son*; past *ero … era … eran*; subjunctive *sia*. Every prayer ends **Sik sia**, "so be it".

**Sentences:**
- **Word order:** subject-verb-object, but imperial decrees begin with the verb (*Juba Rechtar Vaire …* "Commands Rechtar Vaire …").
- **Negation:** *no* goes before the verb. The no-words are *nikai* "no one", *nikado* "nothing" and *nikando* "never".
- **Questions:** a yes/no question starts with *ka* (*Ka tene te geldo?* "Do you hold the shield?"). Question words come first: *kai* who, *kado* what, *kaube* where, *kando* when, *perkado* why, *kalo* how.
- **Linking words:** *ed* and, *sed* but, *au* or. *ke* introduces every subordinate clause ("that", "who", "which", "than"), and Norsund borrowed it. *Si* means "if", *perke* "because", *a ke* "so that".

**Numbers** count in tens, with the plural of the base word: *fovo dekre* 20, *trimi kentie* 300, *fovo mile* 2000, *fovo dekre ed sevi* 27. Ordinals: *primo*, then *-esmo* (*sevesmo* "seventh").

| | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 100 | 1000 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Kedre | eno | fovo | trimi | kvaro | tammo | sesi | sevi | atti | nevi | dekra | kenti | mila |
| Norsund | yn | dov | thrim | ves | thamm | sesk | sev | ath | nyv | tamm | haun | mork |

Two, three, five and seven are true cognates: *tammo* "hand, five" is Norsund *thamm*.

**Dates:** *aro N post Keria* "year N after Keria" (a.v.e.) and *aro N ante Keria* (b.v.e.). Year zero is *aro nulo*.

## Names and titles

- **People:** a given name and a house name, in that order: Rechtar Vaire, Doir Vaire, Rundir Voidet. Great houses end in *-aire* "house, domain" (Vaire). Given names are not marked for sex.
- **Titles** go before the name:
  - **keraro**, the Emperor at court; soldiers say **imperaru** "commander".
  - **primaro**, the first priest of the Church of Light (Rechtar took the title in 0 a.v.e.; lore calls it Pope).
  - **reiato**, regent; this was Doir Vaire's title over the Vilnayan towns.
  - **duko**, a general.
  - **alkimiaro supraro**, the head of the Imperial Academy of Alchemy.
- **Places:**
  - Domains end in *-aire*: Reinovaire, Exaire "domain of the springs", Arbaire "domain of the trees".
  - Lands end in *-ia*: Keria "crown-land, the Empire".
  - Holy cities and gods take *-s*: Keras "the Crowned", Luxis.

| Name | Meaning |
|---|---|
| Keras | the Crowned (city) |
| Keria | the crown-land, the Empire |
| Reinovaire | realm of Vaire |
| Vaire | the imperial house |
| Rechtar | ruler (*rektare* "to rule") |
| Luxis | Light, the goddess (Norsund Lysmar) |
| Voidet | "of the emptiness", Rundir Voidet's family name |

## Registers

| Register | Who uses it | How it sounds |
|---|---|---|
| Court decree | Keras, governors, heralds | verb first, the ruler in the third person, closes with year and place |
| Church liturgy | the Domo Luxis (Church of Light) | the goddess addressed first, every wish in the subjunctive, "Sik sia" |
| Learned | the Imperial Academy of Alchemy | participle nouns, numbers, passives (*es mixtato* "is mixed") |
| Camp Kedre | soldiers and traders in Thiolden | keeps old final *-u* (*kividu*, *denaru*, *imperaru*), clipped titles, swears by the Emperor |

## Sample: Rechtar's siege order at Marheim (50 a.v.e.)

> Juba Keraro Rechtar Vaire a legie Vaire:
> Dekra ed trimi ari Marheim stava kontra Keria.
> Oie krepito runa vole rumpire murre Marheim.
> Rundir Voidet, alkimiaro supraro, trahe krepito a murra.
> Kai ke fuje, es traio.
> Aro tammo dekre post Keria, kastra Marheim.

*Emperor Rechtar Vaire commands the legions of Vaire:
For thirteen years Marheim has stood against the Empire.
Today rune powder will break the walls of Marheim.
Rundir Voidet, chief alchemist, brings the powder to the wall.
Whoever flees is a traitor.
Year fifty after Keria, at the camp before Marheim.*

The other texts are the decree of year zero, the blessing of the Vaire bloodline, a page of Rundir Voidet's notes ("But the ash of the dead does not sleep"), a hymn to Luxis and Doir Vaire's proclamation to the Vilnayan towns. All are glossed word by word in `texts.yaml` and in the workbench's Texts tab.

## Kedre words in Norsund

Kedre words entered Norsund in layers (rule KED-REL-01; Norsund `grammar/12-registers-dialects.yaml`).

| Layer | When | What happened | Examples |
|---|---|---|---|
| Occupation | 37–51 a.v.e. and Doir Vaire's rule | final vowel dropped, double consonants simplified, stress moved to the front; mostly heard in camp Kedre | *murra* → **mur** "wall", *merkadu* → **merk** "market", *kampo* → **kamp**, *porta* → **port**, *turra* → **tur**, *rivia* → **rie**, *kividu* → **kivid** "citizen", *denaru* → **denar** "coin", *obsidiu* → **obsid** "siege", *ke* → **ke** |
| Learned | after 100 a.v.e., from books | kept whole, Kedre stress kept | **alkimia**, **medikina**, **kupola**, **serika**, **kolona**, **tribuna** |

Some words were borrowed twice. Norsund has both *tur* "tower" (everyday) and *turra* "fortress-tower" (military treatises).

The traffic went both ways. Kedre borrowed **runa** from Norsund to name the rune magic of Thiolden, while its own *runo* means only "secret", and it calls its homeland by the Norsund name **Valnor**.

## Renamed places

Two place names in the lore were real English towns. On 2026-11-19 they were replaced in the lore records with Kedre names:

- **Exeter → Exaire**, "domain of the springs"
- **Arbury → Arbaire**, "domain of the trees"

## For writers

- **When to use Kedre:** for imperial voices: decrees, priests of the Church of Light, Vairean officers, alchemists, merchants from Keras.
- **Kedre inside Norsund speech:** in Thiolden, a Norsund speaker uses the worn-down loans (*mur*, *port*, *merk*), not full Kedre. A Vairean soldier speaks camp Kedre (*imperaru*), and a court envoy speaks court Kedre (*keraro*).
- **Keep the Kedre habits:** head-first order, verb-first decrees and "Sik sia" at the end of prayers. These three make Kedre sound unlike Norsund at a glance.
