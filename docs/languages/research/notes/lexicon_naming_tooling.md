# Lexicon Construction, Naming Conventions, and Dictionary Tooling for a Fantasy Common Tongue ("Norsund")

Research date: 2026-11-19. Scope: how conlangers build a lexicon and naming system for a fantasy culture, and how they document and tool it. The use case is Norsund, a Norse-flavored common tongue with many contributors. Source quality varies: primary sources include zompist.com, the Leipzig Glossing Rules, SIL, GitHub READMEs and Fiat Lingua. Wikipedia and press pieces are secondary. Weak or aggregator sources are flagged where they're used.

---

## 1. Starter word lists, list sizes, and how many roots make a language "usable"

### Takeaway
The standard seed lists are small: Swadesh 100 and 207, and Leipzig–Jakarta 100. Rosenfelder's Fantasy Frequency Wordlist has 1,500 items, ranked by frequency in fantasy and SF fiction. Franchise languages shipped at about 1,000 words (Na'vi, 2009) and about 1,700 words (Dothraki, before shooting), then grew to roughly 2,600 to 4,000 over the following years. Experts consistently prefer a modest set of productive roots plus derivation over a large set of unrelated roots.

### Cited Findings
**Seed lists**
- Morris Swadesh started in 1950 with a 215-meaning list. In 1952 he published a 215-meaning list, proposed removing 16 meanings and adding one (200). In 1955 he called for drastic pruning, arguing "quality is at least as important as quantity." His final 100-word list was published posthumously in 1971/72 — [Wikipedia: Swadesh list](https://en.wikipedia.org/wiki/Swadesh_list)
- The "207" list was adapted from the 1952 version and is now the most widely used. Hundreds of versions are on Wiktionary and PanLex — [Wikipedia: Swadesh list](https://en.wikipedia.org/wiki/Swadesh_list)
- Swadesh lists were built for lexicostatistics and glottochronology, and Swadesh chose the items by intuition. Later lists, Dolgopolsky (1964) and Leipzig–Jakarta (2009), use systematic cross-linguistic data — [Wikipedia: Swadesh list](https://en.wikipedia.org/wiki/Swadesh_list)
- The Leipzig–Jakarta list (2009) has 100 items. It comes from the World Loanword Database (WOLD) and the Loanword Typology Project: experts on 41 languages supplied words for a uniform concept list and rated the evidence for borrowing. The 100 concepts most widespread and most resistant to borrowing were kept. Source: Haspelmath & Tadmor, *Loanwords in the World's Languages* (2009) — [Wikipedia: Leipzig–Jakarta list](https://en.wikipedia.org/wiki/Leipzig%E2%80%93Jakarta_list)
- Only 62 Leipzig–Jakarta items overlap with Swadesh-100. The top-ranked items are fire (1), nose (2), to go (3) and water (4). About a quarter are body parts. Haspelmath & Tadmor conclude that "rope is the most basic of human tools and tying is the most basic technology" — [Wikipedia: Leipzig–Jakarta list](https://en.wikipedia.org/wiki/Leipzig%E2%80%93Jakarta_list)
- PolyGlot can import and export Swadesh lists directly — [PolyGlot GitHub](https://github.com/DraqueT/PolyGlot)

**Rosenfelder's Lexipedia and the "basic 1,500"**
- *The Conlanger's Lexipedia* (Yonagu Books) contains a "Fantasy Frequency Wordlist": a 1,500-item ordered list of common roots from a 1.1-million-word corpus of fantasy and science fiction, "designed for prioritizing vocabulary work." It also has more than 3,000 etymologies (English, Indo-European, Mandarin, Quechua and others), a "Divergences from English" section, real-world reference lists (mammal orders, military ranks, noble titles, guilds, chemical substances), and chapters on categorization, etymology, derivation and metaphor — [zompist.com: Lexipedia](https://www.zompist.com/lexipedia.html)
- Rosenfelder on which roots are most productive in etymology glosses: "The prizewinner is *stand*," which underlies at least forty derivations — [zompist.com: Lexipedia](https://www.zompist.com/lexipedia.html)
- Retail listings give different editions: 2013 CreateSpace (424 pp.) and 2017 Yonagu (420 pp.) — [search-result retail listings, e.g. worldofbooks](https://www.worldofbooks.com/products/books-the-conlanger-s-lexipedia-by-mark-rosenfelder) (secondary)

**Rosenfelder (LCK) on size and generation**
- The LCK treats Ogden & Richards' Basic English (850 words) as a cautionary "cheat". It shrinks the vocabulary by leaning on idioms such as "make good" for "succeed", which still have to be learned as units — [zompist.com: Language Construction Kit](https://zompist.com/kitlong.html)
- LCK advice on generating roots: don't write a hundred words at once, because you'll run out of ideas or make them sound alike. "Resist the temptation to give a meaning for every possible syllable" and leave room for future coinages. Mix word lengths but avoid many long roots; build long words by compounding or affixing short ones. Real phoneme frequencies are uneven ("English uses many more t's than f's, more f's than z's") — [zompist.com: LCK](https://zompist.com/kitlong.html)
- The LCK recommends a derivation system "to multiply roots" — [zompist.com: LCK](https://zompist.com/kitlong.html)

**Franchise vocabulary sizes** (figures conflict; see notes)
- Dothraki: Peterson delivered "over 1700 words to HBO before the initial shooting." By September 2011 the language had 3,163 words, not all public — [Wikipedia: Dothraki language](https://en.wikipedia.org/wiki/Dothraki_language)
- Dothraki is reported at about 4,000 official words in later coverage — [CBS News](https://www.cbsnews.com/amp/baltimore/news/the-game-of-thrones-language-that-1-2m-people-are-learning). A search snippet attributes a similar "only 4,000 words" figure and a goal of 10,000 to Peterson — [University of Rochester newscenter](https://www.rochester.edu/newscenter/david-peterson-create-a-new-language/) (snippet only, not fully verified)
- Nautilus (Jennifer Ouellette, 3 June 2013) gives Dothraki about 10,000 words, Na'vi about 2,000 and Klingon about 10,000, against roughly 40,000–50,000 for "most languages" — [Nautilus](https://lede-v2.nautil.us/14-words-for-horse-the-linguistics-of-game-of-thrones-234392). **Conflict:** these figures are much higher than Wikipedia's 3,163 (2011) for Dothraki and CBS's ~4,000. The 10,000 figure looks like a goal or a loose count.
- Na'vi had about 1,000 words at the film's release (18 Dec 2009) and "currently has over 2,600 words" (dictionary accessed June 2020). The community Lexical Expansion Project, working with Frommer, grew the lexicon by more than 50% — [Wikipedia: Naʼvi language](https://en.wikipedia.org/wiki/Na%CA%BCvi_language)
- Na'vi vocabulary was first built as the script needed words. Later additions came from the video game, which needed words not yet invented, and from song lyrics — [Wikipedia: Naʼvi language](https://en.wikipedia.org/wiki/Na%CA%BCvi_language)
- Vulgarlang's paid tier generates a 4,000-word vocabulary; the demo outputs 200 words — [Vulgarlang](https://www.vulgarlang.com/)

**Roots versus derived words**
- Peterson describes building "word-nets" around single roots. In Irathient (*Defiance*), words from "breeze" to "storm" to "goodbye" to "wow" to "destiny" are "all tied together by a single root" — [Book Riot interview, 31 Oct 2015](https://bookriot.com/letter-letter-word-word-interview-david-j-peterson/)
- Frommer's Na'vi covers concepts with compounds and phrases instead of new roots. For example *eltu lefngap* ("metallic brain") means "computer" — [Wikipedia: Naʼvi language](https://en.wikipedia.org/wiki/Na%CA%BCvi_language)

### Inferences
- A workable phased target for Norsund: (1) Swadesh-207 merged with Leipzig–Jakarta 100 as the core of about 250 concepts, (2) Rosenfelder's 1,500-item fantasy frequency list as the priority queue, (3) about 1,000–1,700 entries as the threshold for "franchise usable", following Na'vi at release and Dothraki before shooting. Count headwords including derivations, but track root count separately.
- The likely ratio is a few hundred productive roots generating several times as many derived entries. Rosenfelder's "stand → 40+ derivations" and Peterson's root families support this, but no source gave a numeric root-to-derivation ratio.
- Headline word counts for franchise languages aren't comparable across sources. Some count roots, some count dictionary entries, and some count unpublished words.

### Gaps
- I found no reliable count for the original *Klingon Dictionary* (1985/1992). Wikipedia's Klingon article doesn't give one.
- I couldn't access the lexicon chapter of Peterson's *The Art of Language Invention* (2015), so his recommended lexicon size and root-versus-derivation guidance are unverified. The book's publisher page describes it but not the chapter contents.
- The claim that Martin's books had only 56 Dothraki words, 24 of them proper names, showed up in search summaries without a source I could pin down. Treat it as unverified.
- I found no primary-source statement of a "usable" root count from Rosenfelder, Peterson or Frommer.
- The Lexipedia's 1,500-item list isn't public online. It's only in the book.

---

## 2. Making vocabulary reflect culture and environment (avoiding 1:1 English mapping)

### Takeaway
Every source makes the same point: a culture's lexicon is densest where its concerns are, and basic English words such as "turn", "hundred", "cousin" and "hello" should be split, merged or re-metaphorized rather than relexed. There are well-documented real-world templates for kinship, counting, calendars, colour and the senses. Old Norse supplies a culture-specific number base, the long hundred of 120.

### Cited Findings
**General principles**
- LCK techniques for avoiding relexed English: translate idioms literally or invent your own. Study bilingual dictionaries to see the range of meanings each foreign word covers. Give words two English glosses and divide senses between words (e.g., split male "man" from human "man"). Use etymologies to find alternative derivations. Design whole word classes your own way, such as motion verbs (Russian and Hua are cited). Read Lakoff & Johnson's *Metaphors We Live By* and build your own metaphors. For fantasy languages, identify culturally important concepts, which "often have many synonyms" — [zompist.com: LCK](https://zompist.com/kitlong.html)
- Rosenfelder: "every word is a conlanging opportunity". Vocabulary should reflect the culture rather than becoming "yet another complicated cipher of English" — [zompist.com: Lexipedia](https://www.zompist.com/lexipedia.html)
- Paul Frommer: "If something is important to a culture, there will be an efficient way of talking about that thing in the language" — quoted in [Nautilus, 2013](https://lede-v2.nautil.us/14-words-for-horse-the-linguistics-of-game-of-thrones-234392)
- Peterson: "The most challenging terms to come up with are usually the most basic," e.g. "turn" or "twist". "These are words in English that have dozens of senses, and they never line up with words in other languages easily… It's extremely hard to come up with a naturalistic word-net for concepts like these." He also says: "It's fun to come up with cultural concepts that are idiomatic" — [Book Riot, 2015](https://bookriot.com/letter-letter-word-word-interview-david-j-peterson/)

**Franchise examples**
- Dothraki has 14 words for horse but none for toilet or cell phone — [Nautilus, 2013](https://lede-v2.nautil.us/14-words-for-horse-the-linguistics-of-game-of-thrones-234392)
- Klingon has many words for warfare and weaponry, several verbs for "to fight" at different intensities, and a wide range of curses, because cursing is treated as a fine art. The nearest word to "hello" is *nuqneH*, literally "What do you want?" — [Wikipedia: Klingon language](https://en.wikipedia.org/wiki/Klingon_language)
- Na'vi culture words include *tireaioang* "spirit animal", *fpeio* "ceremonial challenge", *ikran* "banshee", *kllpxìltu* "territory" and *uniltìrantokx* "avatar" (literally dream-walk-body) — [Wikipedia: Naʼvi language](https://en.wikipedia.org/wiki/Na%CA%BCvi_language)
- Dothraki vocabulary had two practical constraints: it had to match the books' existing usage, and actors had to be able to pronounce and learn it — [Wikipedia: Dothraki language](https://en.wikipedia.org/wiki/Dothraki_language)

**Semantic-field templates (real-world)**
- Kinship: there are six classic systems (Murdock, after Morgan). Hawaiian is the most classificatory, distinguishing only sex and generation. Sudanese is the most descriptive, naming every cousin type separately. Inuit/Eskimo, the English pattern, separates siblings from cousins but lumps all cousins together. Iroquois groups parallel cousins with siblings and calls the mother's sister "mother". Crow and Omaha are Iroquois-like with matrilineal and patrilineal skews, sharing terms across generations. Dravidian is a debated seventh type — [Wikipedia: Kinship terminology](https://en.wikipedia.org/wiki/Kinship_terminology)
- In Omaha kinship one term covers your mother, your maternal aunt, and the son of your maternal uncle — [zompist.com: Lexipedia](https://www.zompist.com/lexipedia.html)
- Time: the Balinese run concurrent 2-, 3-, 5- and 7-day cycles, producing a 210-day cycle — [zompist.com: Lexipedia](https://www.zompist.com/lexipedia.html)
- Other Lexipedia examples: four primary colours, not three ("print/screen triads only fool the eye"); about fourteen human senses by some counts; Japanese *asobi* covering fun and relaxation generally as the opposite of work; in Montréal, "south" from the city actually means east; John Wilkins devoted category V of his classification to God and XL to Ecclesiastical Relations — [zompist.com: Lexipedia](https://www.zompist.com/lexipedia.html)
- The Lexipedia's reference sections include military ranks, noble titles and **guilds** — [zompist.com: Lexipedia](https://www.zompist.com/lexipedia.html)
- Numbers, the Norse-specific case: Old Norse counted large numbers "in twelves of tens". *Hundrað ok átta tigir* = 200, *tvau hundrað* = 240, *þúsund* = 1,200. The plain word for 100 was *tíu tigir* ("ten tens"). Once the decimal hundred spread, Old Norse distinguished *hundrað tolf-rœtt* ("duodecimal hundred", 120) from *hundrað ti-rætt* ("decimal hundred"). The long thousand = 10 long hundreds = 1,200 — [Wikipedia: Long hundred](https://en.wikipedia.org/wiki/Long_hundred)
- Vulgarlang lets users set a language's number base — [Vulgarlang](https://www.vulgarlang.com/)
- FLEx's "Rapid Word Collection" builds a semantically categorized glossary that can grow into a full dictionary, which makes it a domain-by-domain elicitation method — [SIL FieldWorks](https://software.sil.org/fieldworks/)

### Inferences
- For Norsund, the most defensible Norse-flavored culture choices from these sources are:
  - Long-hundred counting (120), with an explicit "decimal hundred" term for trade with outsiders, which suits a multi-race common tongue.
  - An Iroquois- or Omaha-type kinship split if clans matter.
  - Dense fields where the setting puts its stakes: monsters and hunting (guild ranks, quarry types, wound and poison words), canals and water craft, crystal and cave terms, stars and sky (the star cult).
- Dothraki's horse words, Klingon's fight verbs and Na'vi's ritual vocabulary suggest density in a few fields matters more than coverage in many.
- Basic polysemous words should be designed early as root families, so contributors don't each map "turn" or "break" to English independently. Peterson's word-net approach covers this: one star root could yield fate, guidance, the holy, navigation and "good luck".
- A "do not relex" checklist for contributors can be lifted from the LCK: split English senses, invent idioms, give at least two glosses, and check a bilingual dictionary of a real language.

### Gaps
- I didn't retrieve Berlin & Kay's basic colour-term hierarchy or any primary source on colour-term evolution. The Lexipedia's colour claim concerns primaries, not term inventories.
- I found no primary-source material on taboo and euphemism design in conlangs (e.g., Old Norse noa-names for dangerous animals), nor on Old Norse calendar vocabulary (seasons, months). Neither has a citation here.
- I found no Artifexian or Biblaridion video transcripts on culture-driven semantics with citable claims.
- The Peterson *Art of Language Invention* passages on culture and vocabulary weren't accessible.

---

## 3. Word formation: derivation, compounding, kennings, and a reusable morpheme bank

### Takeaway
Conlangers multiply roots through derivational affixes (agent, place, tool, collective, diminutive, augmentative, causative, negative), compounds, reduplication and periphrasis. Old Norse kennings add a fully documented poetic layer with a clear grammar: a base-word plus a determinant, optionally nested. Contributors can apply both systems by rule.

### Cited Findings
**Derivation categories and methods**
- The LCK lists derivational categories to build: process/state, associated person, place, collection, tool, characteristic adjective, causative, diminutive, augmentative, inhabitant and negative. Methods are affixes, compounds ("book-place" = library) and reduplication (Malay *balik-balik*) — [zompist.com: LCK](https://zompist.com/kitlong.html)
- The LCK recommends building names with derivational processes "even if you want nothing more than a naming language" — [zompist.com: LCK](https://zompist.com/kitlong.html)
- Sound symbolism (LCK): front vowels (i, e) may suggest smallness or high pitch, and back or low vowels (a, u, o) largeness. There are exceptions, such as English "small" and "big". Voiced consonants in Orkish names sound harsher to English speakers than unvoiced versions — [zompist.com: LCK](https://zompist.com/kitlong.html)
- Na'vi derivation examples: the agentive suffix *-yu* (*ngop* "create" → *ngopyu* "creator"); the diminutive *-tsyìp* (*palulukantsyìp* "little thanator" = cat); the prefix *le-* turning nouns into adjectives; nominalization by prefix and infix (*rol* "sing" → *tìrusol* "singing"); a few loans (*kunsìp* "gunship") — [Wikipedia: Naʼvi language](https://en.wikipedia.org/wiki/Na%CA%BCvi_language)
- Peterson's Dothraki "Schrutean compound" uses object incorporation and comes from a joke phrase on *The Office* — [Wikipedia: Dothraki language](https://en.wikipedia.org/wiki/Dothraki_language)
- Vulgarlang auto-generates "derived words built from affixes" and compounds — [Vulgarlang](https://www.vulgarlang.com/)

**Kennings and heiti**
- A kenning is a "figuratively phrased compound term" (Old English *hron rade* "whale's road" = sea), strongly associated with Old Norse–Icelandic and Old English alliterative verse — [Wikipedia: Kenning](https://en.wikipedia.org/wiki/Kenning)
- A *heiti* is a single poetic synonym, e.g. *fákr* or *marr* for "horse" against prose *hestr*. Heiti can serve as parts of kennings — [Wikipedia: Kenning](https://en.wikipedia.org/wiki/Kenning)
- Structure: base-word (*stofnorð*) plus determinant (*kenniorð*). The determinant can be a genitive, as in *báru fákr* "wave's horse" = ship, or a compound element, as in *gjálfr-marr* "sea-steed" = ship. Another example: *íss rauðra randa* "icicle of red shields" = sword. Old Norse's free word order allowed kenning parts to be separated — [Wikipedia: Kenning](https://en.wikipedia.org/wiki/Kenning)
- Nesting: *tvíkent* ("doubly determined") is a kenning inside a kenning, e.g. *grennir gunn-más* "feeder of war-gull" = warrior. *Rekit* ("extended") has more than three elements; seven-element kennings are recorded. Snorri accepts five as a licence and calls longer ones out of proportion. He criticized mixed metaphor (*nykrat*) — [Wikipedia: Kenning](https://en.wikipedia.org/wiki/Kenning)
- Typology: Old English kennings are all two-element, while Old Norse allows nesting. Some kennings are mythological (*Ymis haus* "Ymir's skull" = sky) and some are merely descriptive (*grand viðar* "bane of wood" = fire). Scholars disagree whether descriptive epithets count — [Wikipedia: Kenning](https://en.wikipedia.org/wiki/Kenning)

**Making a morpheme bank others can use**
- The Troy Press naming-language method (2022) keeps a small "in-play" morpheme list and a separate, larger, non-overlapping "prep list" sorted by length, with a selection formula that favours shorter morphemes. It builds a "multiplication table" of morpheme combinations and reads every entry aloud. Morphemes that yield comical names are dropped; the author removed "-bal". Roots come from a proto-language through regular sound change. The page has no byline but links Jeffrey Henning's *Langmaker* book — [Troy Press](https://troypress.com/a-naming-language-for-use-by-players)
- A 2026 Fiat Lingua essay describes a fantasy author coding her own naming-language builder. It defines allowed sounds and their frequencies, onset and coda length probabilities, and filters for disallowed sequences, then generates whole words or "morphemes that followed prefix/affix/suffix rules". Her stated goal was for "readers to be able to intuitively differentiate between people of different areas by name" — [Madeline James, "How an Unlikely Conlanger Created a Language", Fiat Lingua FL-000110-00, 1 May 2026](https://fiatlingua.org/wp-content/uploads/2026/05/fl-000110.pdf)
- PolyGlot provides "automated checking of the lexicon against defined patterns", which can enforce phonotactics on contributed words — [PolyGlot GitHub](https://github.com/DraqueT/PolyGlot)

### Inferences
- A Norsund morpheme bank should give each entry: the bound or free form, allomorphs or sandhi rules, meaning, slot (prefix, suffix, compound head or modifier), productivity (open, restricted or fossil), and two or three canonical example derivations.
- Kennings fit the bards: a documented rule (base-word plus genitive determinant, at most two levels in common speech and up to five in formal verse, following Snorri's licence) plus a canonical heiti list gives contributors a constrained, testable way to coin poetic vocabulary.
- Running Troy Press's multiplication-table read-aloud test on every new morpheme is a cheap QA gate for a decentralized team.
- Zero-derivation (conversion) and semantic drift weren't documented in the sources I retrieved. Treat them as design choices to specify explicitly: which POS can convert to which, and whether drifted senses are recorded in etymology fields.

### Gaps
- No retrieved source covers zero-derivation or semantic drift specifically in conlang practice.
- I couldn't verify common popular kenning examples ("sword-sleep", "battle-sweat"); the Wikipedia article doesn't list them.
- I found no primary source for Artifexian's or Biblaridion's derivation or compounding videos.
- No retrieved source gives a standard schema for a "morpheme bank" in conlanging.

---

## 4. Naming systems: personal names, bynames, toponyms, and retroactive etymology

### Takeaway
Viking-Age naming combined a given name from a thin stock with a patronymic (-son, with grandfather chains) and a byname or nickname that often did most of the identifying work. Norse toponyms are built from a small set of generic elements (-by, -thorp, -toft, -holm, -thwaite, -vík/-wick, -ness) attached to personal names or descriptors. Tolkien and Peterson both show that existing invented names can be back-fitted: treat them as fixed data and design roots and sound changes that produce them.

### Cited Findings
**Old Norse personal names**
- Viking-Age Scandinavians typically had one given name, a patronymic and a nickname. Example: *Ragnarr Sigurðsson* ("son of Sigurd"), extendable to *Ragnarr Sigurðsson, Randvéssonar* with the grandfather's name. With a nickname: *Ragnarr loðbrók Sigurðsson*. The system is still used in Iceland — [Keith Ruiter, Univ. of Aberdeen / The Conversation, 26 Feb 2016](https://www.abdn.ac.uk/news/8745/)
- The stock of given names was very limited, so nicknames were essential for identification. Sagas often refer to characters by first name plus nickname. A nickname could replace a given name entirely: *Þorgrímr Þorgrímsson* became "Snorri", a nickname for his stormy temperament (citing Diana Whaley) — [Ruiter, Aberdeen](https://www.abdn.ac.uk/news/8745/)
- Ruiter's byname categories:
  - Unflattering: Ulf the Squint-Eyed, Eirik Ale-Lover, Eystein Foul-Fart.
  - Heroic or anecdotal: *loðbrók* "shaggy trousers", *hárfagri* "Finehair".
  - Physical: Walking Hrolf, too large for a horse; Thorsteinn Dromund, slow as a warship.
  - Dress or foreign influence: Bare-legged Magnus, Olaf Sandal.
  
  [Ruiter, Aberdeen](https://www.abdn.ac.uk/news/8745/)
- The standard comprehensive work on Old Norse-Icelandic bynames is E. H. Lind's dictionary (1920–21). *Landnámabók* is a key source of names. See Paul Peterson, "Old Norse Nicknames: Origins and Terminology" (*Names*, 2018) — [ans-names.pitt.edu](https://ans-names.pitt.edu/ans/article/download/2182/2181/4473) (seen via search summary; the full text wasn't read)

**Norse toponyms (elements)**
- Danelaw Old Norse place-name elements:
  - **-by**: farmstead, often grown into a village, town or city. Very common, with "many hundreds" in Lincolnshire.
  - **-thorpe**: secondary or overflow settlement, mostly still tiny.
  - **-toft**: a single small farmstead.
  - **-holme/-holm**: reclaimed land in marsh, an "island" in wet terrain.
  - **-kirk**: church.
  - **-thwaite**: a small secondary farmstead split from a main farm, concentrated where Norwegian settlement was heavier.
  - **-wick** (ON *vík*): creek or bay.
  - **-ness**: promontory or headland, often a navigation marker.
  
  Hybrids exist: *Grimston* is the Norse personal name *Grim* plus English *-ton*, beside wholly Norse *Grimsby* — [viking.no: Place-names in the Danelaw](https://www.viking.no/the-viking-world/the-vikings-and-the-law/danelaw/place-names-in-the-danelaw-2/)
- *-thwaite* < ON *þveit*: a clearing, meadow or paddock — [Wikipedia: Thwaite](https://en.wikipedia.org/wiki/Thwaite_(placename_element))

**How naming languages are built**
- A naming language is a phonology plus compounding rules, enough to generate character and town names without a full grammar. This description comes from a Fiat Lingua essay seen in search results; the exact article wasn't identified — [Fiat Lingua (search summary)](https://fiatlingua.org/2016/11)
- Rosenfelder notes that even a naming language needs ways to form constructions like "of NAME" or "NAME place" — [zompist.com: kitwrite (search summary)](https://www.zompist.com/kitwrite.html)
- Romanization changes the feel of names. Verdurian *Ďarcaln* versus *Dhârkalen* is the same name in two transliteration styles. Tolkien's *Celeborn* is commonly mispronounced because of its spelling — [zompist.com: LCK](https://zompist.com/kitlong.html)
- Troy Press player-facing rules: names should be pronounceable, distinct from each other, free of English "false friends", and short. The author's names averaged 8.2 letters against 5.6 for common US names, which the author treats as a lesson. Major NPCs get distinct initial sounds. Personal-name endings (e.g. -a, -r, -n) signal gender conventions, and place names get a distinctive final sound. Introduce one name at a time — [Troy Press, 2022](https://troypress.com/a-naming-language-for-use-by-players)
- Fantasy writers often start by borrowing names from a real language, which brings appropriation concerns and doesn't scale beyond personal names. That is one motivation for a naming language — [James, Fiat Lingua 2026](https://fiatlingua.org/wp-content/uploads/2026/05/fl-000110.pdf)

**Retroactive etymology (back-fitting existing names)**
- Tolkien's *The Etymologies* (1930s) is a list of Proto-Elvish roots. With Elvish he "worked both backward and forward, to create 'fitting names' with appropriate meanings, and to devise suitable etymologies for them in Quenya and Sindarin." It explains many personal and place names not explained elsewhere, but it reflects an earlier stage of the languages and "cannot safely be used to draw conclusions about… 'mature Sindarin'" — [Wikipedia: The Etymologies](https://en.wikipedia.org/wiki/The_Etymologies_(Tolkien))
- When Tolkien reorganized his languages, many long-established names originally held to be Ilkorin (e.g. *Esgalduin*, *Beleg*) survived in the narrative and were reinterpreted as Sindarin. Helge Fauskanger suggests Tolkien made "Noldorin" more like Ilkorin to produce Sindarin partly to keep the Beleriand names "more or less unchanged" — [Fauskanger, Ardalambion: Ilkorin](https://www.uib.no/People/hnohf/ilkorin.htm)
- Peterson built Dothraki to fit the words and phrases already in Martin's novels — [Wikipedia: Dothraki language](https://en.wikipedia.org/wiki/Dothraki_language)
- For High Valyrian, the books offered only a few words and sentences, including *valar morghulis* and *valar dohaeris* — [BuzzFeed News](https://www.buzzfeednews.com/article/michaelblackmon/game-of-thrones-language-creator). Peterson made these two phrases the basis of the verb conjugation system. He treated *dracarys* as an independent word and coined a different word for "dragon" — [EPFL Graph Search (mirror of Wikipedia "Valyrian languages")](https://graphsearch.epfl.ch/concept/42677733) (aggregator; matches Wikipedia's account)
- Peterson also made High Valyrian appear to change over time so it would seem natural — [Litro Magazine](https://www.litromagazine.com/?p=64270) (secondary)

### Inferences
- A Norsund personal-name template supported by these sources: `GivenName (small curated stock, compounded from themed elements) + Patronymic (father's name + "son of" morpheme, optionally a grandfather chain for formal or legal registers) + Byname (from a byname morpheme bank: physical, deed, dress, origin, insult)`. Guilds and bards would plausibly confer and use bynames heavily, as the sagas do.
- Matronymics, clan names and titles aren't covered by the sources above. They can be added as parallel slots, but that's a design choice, not documented Norse practice.
- Toponym template: `Specific (personal name, feature, or descriptor) + Generic element`. Norsund needs its own native generic elements, analogous to -by (farm), -thorp (offshoot hamlet), -holm (marsh island), -vík (bay), -ness (headland) and -thwaite (clearing). It should add setting-specific generics for canals, crystal caverns, star shrines and monster lairs. A deliberate hybrid layer, like Grimston, could mark contact between races.
- For back-fitting existing names, the Tolkien and Peterson method is: (1) freeze the canon names as data; (2) segment them into candidate morphemes; (3) assign meanings consistent with the lore; (4) derive phonology and sound changes so they surface as written; (5) treat leftovers as loans, archaisms or independent words, as Peterson did with *dracarys*; (6) record each name's analysis and confidence in the dictionary.

### Gaps
- I didn't retrieve primary-source material on Old Norse matronymics, the Icelandic *-dóttir* forms, theophoric name elements (Þór-, Frey-), or demonym formation. A search snippet claimed god-name elements were common, but only from a low-quality site, so I excluded it.
- -heim, -fjord, -dal and other Scandinavian-homeland elements (as opposed to Danelaw ones) weren't covered by any source I retrieved.
- I found no specific Artifexian or Biblaridion naming-language video with verifiable content. A 2026 Fiat Lingua author lists both channels as influences, but that's not a citation of their methods.
- I couldn't fetch Rosenfelder's exact naming-language passage on zompist kitwrite; it's cited from a search summary.

---

## 5. Dictionary entry fields, glossing, versioning, tools and machine-readable formats

### Takeaway
Interlinear examples should follow the Leipzig Glossing Rules. For tools, conlangers mostly use PolyGlot (free, MIT, desktop lexicon and grammar), Vulgarlang (paid generator), Lexurgy (GPL sound-change applier), FLEx (free, LGPL, professional lexicography with multi-user and LIFT XML interchange), or plain JSON/YAML in git. Lexique Pro is dead. Versioning is a governance problem as much as a technical one: Klingon and Na'vi both keep a canon authority and a public change log.

### Cited Findings
**Interlinear glossing**
- The Leipzig Glossing Rules have ten rules plus an abbreviation appendix:
  - Glosses are left-aligned word by word.
  - Morphemes are separated by hyphens, with equal hyphen counts in the example and the gloss; clitics use `=`.
  - Grammatical categories go in capital-letter abbreviations.
  - One-to-many correspondences are joined with periods.
  - Person and number are fused (1PL).
  - Non-overt elements go in [ ] or Ø; inherent categories in ( ).
  - Infixes go in < >; reduplication uses `~`.
  
  The standard format is three lines (text, gloss, quoted translation). Last changed 31 May 2015; future updates belong to the Committee of Editors of Linguistics Journals — [Leipzig Glossing Rules, MPI-EVA](https://www.eva.mpg.de/lingua/resources/glossing-rules.php)
- Conlangers use this format in practice. The 2026 Fiat Lingua essay glosses spells as text / IPA / Leipzig-style gloss (`Imva-VOC 1.IN-IMP-3rdD …`) / free translation — [James, Fiat Lingua 2026](https://fiatlingua.org/wp-content/uploads/2026/05/fl-000110.pdf)

**Tools**

*PolyGlot*
- Cross-platform conlang toolkit, MIT licence. Features:
  - lexicon storage and auto-generated conjugations and declensions
  - automated checking of the lexicon against defined patterns
  - built-in Zompist word generator
  - quiz generation and a statistics report
  - IPA conversion
  - import/export of Swadesh lists, PDF, Excel, CSV and spellcheck dictionaries
- Tested on Windows 11, macOS (Apple Silicon) and Linux, and on Flathub. Repo stats at fetch time: 2,043 commits, 159 open issues, 520 stars. Support via Discord.

[PolyGlot GitHub](https://github.com/DraqueT/PolyGlot)

*Lexurgy*
- Sound-change applier that "allows the user to simulate historical changes in spoken languages" by applying rules to word lists. Available as a CLI (Java 8+) and a web app, with a newer app in a separate repo (lexurgy-app). Written in Kotlin with ANTLR; GPL-3.0 — [Lexurgy GitHub](https://github.com/def-gthill/lexurgy)

*Vulgarlang*
- Web generator for fantasy writers and role players. It covers phonemes, syllable structure, spelling and romanization, derived and compound words, a grammar editor, noun genders, number bases and sound-change notation. The demo produces 200 words and the paid version a 4,000-word vocabulary. Stress patterns and sci-fi vocabulary require the full or pro version, and in the demo only 1 in 10 custom words display. The home page doesn't state export formats or prices — [Vulgarlang](https://www.vulgarlang.com/)

*FieldWorks Language Explorer (FLEx)*
- SIL's dictionary software, free and open source (LGPL). Features:
  - shared lexicon with built-in multi-user collaboration
  - Rapid Word Collection by semantic domains
  - interlinear text analysis
  - morphological parser for prefixes, suffixes and infixes
  - grammar sketching
  - WYSIWYG dictionary view, plus print and electronic publishing
  - data exchange with ELAN
- The news list shows FieldWorks 9.3.13 dated 18 Nov 2026, while the "Current Version" download link points to 9.3.10. The page is internally inconsistent.

[SIL FieldWorks](https://software.sil.org/fieldworks/)

*LIFT (Lexicon Interchange FormaT)*
- SIL's schema-restricted XML interchange format, built to convert easily to and from FLEx. Users find it less deeply nested than FLEx's XML export — [LIFT standard](https://code.google.com/p/lift-standard). Caveat: LIFT 0.13's standard fields don't hold all of FLEx's complex range data, so round trips can lose detail — [LIFT Google Group](https://groups.google.com/g/LexiconInterchangeFormat/c/YbXwvSiugQc)

*Lexique Pro*
- SIL no longer supports it. The last version is 3.6 (2012), it runs only on Windows, and SIL points users to Webonary for publishing. Language Forge is a more regularly updated, macOS-compatible alternative — [UBC Arts Knowledge Base: Lexique Pro](https://knowledgebase.arts.ubc.ca/lexique-pro/) (via search summary; the page itself returned a JS bot check)

*Zompist Gen, Awkwords, SCA²*
- The LCK recommends Rosenfelder's "gen" program for generating words to a phonology — [zompist.com: LCK](https://zompist.com/kitlong.html). Awkwords is an online pattern-based random word generator at akana.conlang.org; a Perl port exists — [MetaCPAN: Lingua::Awkwords](https://metacpan.org/pod/Lingua::Awkwords). Frathwiki lists it alongside "SCA² – Zompist's SCA, Version 2" (sound-change applier) and Gen — [Frathwiki: Software tools for conlanging](https://www.frathwiki.com/Software_tools_for_conlanging) (via search summary). A 2011 comment reported the Awkwords site down at one point, so check its current availability.

*Custom code*
- Some conlangers write their own generators: phoneme inventories with frequencies, onset and coda probabilities, validation filters, and morpheme generators by affix type — [James, Fiat Lingua 2026](https://fiatlingua.org/wp-content/uploads/2026/05/fl-000110.pdf)

**Machine-readable formats and versioning**
- No standard conlang lexicon schema surfaced. Common patterns found:
  - Perplexicon: a single JSON lexicon with `poses` (parts of speech) and `terms` arrays, exportable to HTML and other formats — [GitHub: Perplexicon](https://github.com/CodeTriangle/Perplexicon)
  - Vocabulum: JSON data, with git suggested for multi-person collaboration — [ecosyste.ms: Vocabulum](https://awesome.ecosyste.ms/projects/github.com%2Fkodedninja%2Fvocabulum)
  - dico: one YAML file per word with fields such as language, word, type and synonyms, tracked in git — [GitHub: dico](https://github.com/akaoj/dico)
  - Lexiconga: a browser builder saving `.dict` files, less suited to git diffs — [Lexiconga](https://cybre.tech/Alamantus/Lexiconga/src/original)
- PolyGlot round-trips CSV and Excel, so a spreadsheet can serve as an interchange layer — [PolyGlot GitHub](https://github.com/DraqueT/PolyGlot)

**Canon governance (how established conlang communities version vocabulary)**
- Klingon: only words and grammar introduced by Marc Okrand are treated as canonical by the KLI and most Klingonists. The KLI kept a new-words list until 2005, after which Lieven Litaer followed up on it until the KLI site was renewed in 2015. As the speaker base grew, "it has become unclear how much neologism is acceptable" — [Wikipedia: Klingon language](https://en.wikipedia.org/wiki/Klingon_language)
- Na'vi: Frommer's blog Na'viteri posts new lexicon entries and grammar clarifications and has been the main source of growth outside his studio contract (tagged "citation needed"). The community Lexical Expansion Project worked with Frommer and grew the lexicon by more than 50%. Several community dictionaries track canon: Reykunyu, Dict-Na'vi.com, fwew.app, LearnNavi.org — [Wikipedia: Naʼvi language](https://en.wikipedia.org/wiki/Na%CA%BCvi_language)
- Esperanto: the Akademio de Esperanto (merged form, 1948) stewards the language "keeping it consistent with the Fundamento de Esperanto". It has 45 members on nine-year terms, with a third elected every three years; the latest elections were February 2025 — [Wikipedia: Akademio de Esperanto](https://en.wikipedia.org/wiki/Akademio_de_Esperanto)
- Tolkien's own corpus shows the cost of unversioned change: *The Etymologies* reflects an earlier stage and can't be safely mixed with "mature" Sindarin or Quenya — [Wikipedia: The Etymologies](https://en.wikipedia.org/wiki/The_Etymologies_(Tolkien))

### Inferences
- Recommended Norsund entry schema, synthesized from the tool features above plus the needs of a multi-contributor setting. No single source prescribes it:
  - `id`, `headword`, `ipa`, `pos`, `glosses[]` (at least two, per LCK), `definition`
  - `semantic_domain` (FLEx Rapid Word Collection-style)
  - `root_id` / `morphemes[]` with a derivation formula, `etymology`
  - `register` (common, formal, bardic/kenning, taboo, slang), `regional_or_racial_variants[]`
  - `example` as a Leipzig-glossed triple
  - `canon_status` (proposed, accepted, deprecated, superseded_by)
  - `contributor`, `date_added`, `version_introduced`, `notes`
- Store the lexicon as one YAML/JSON file per entry or per root in git, following dico, Vocabulum and Perplexicon. That gives diffable history, pull-request review and per-entry blame for a decentralized team. CSV export can feed PolyGlot, and the data can also be emitted as LIFT if FLEx is ever needed.
- Governance models: Klingon and Na'vi show the value of a single canon authority plus a public "new words" log. The Na'vi LEP shows a community proposal pipeline can work if one person or council approves. The Esperanto Akademio is a model for a council stewarding against a fixed foundational core ("Fundamento" ≈ a frozen Norsund core lexicon and grammar). The open Klingon question about acceptable neologism is the failure mode to avoid: Norsund should publish explicit coinage rules (approved morphemes, derivation patterns, kenning grammar, naming templates) so that contributor coinages are "rule-canon" even before formal approval.
- Tool fit for Norsund:
  - PolyGlot: a free, offline single-editor workbench.
  - Vulgarlang: fast bootstrapping, but its paid, generated vocabulary needs heavy curation for culture.
  - Lexurgy: if Norsund gets a proto-language or sister dialects across races, sound changes can be versioned as rule files.
  - FLEx: overkill unless rigorous parsing and multi-user editing are needed.
  - Lexique Pro: avoid, since it's unsupported.

### Gaps
- ConWorkShop's site returned HTTP 403, so its features, pricing and export options are unverified here.
- I couldn't retrieve the r/conlangs wiki resources page (SSL and fetch blocks), or linguifex's "Guide:Conlanging tools" (bot protection).
- Lexurgy's `.lsc` format, romanizer and deromanizer features, and current release date aren't confirmed by the README fetch. See the external docs linked from the repo.
- PolyGlot's native file format and latest release date weren't visible on the GitHub page at fetch time.
- No source reviewed defines a community-standard JSON/YAML schema for conlang dictionaries, or a semantic-versioning convention for lexicons.
- I found no reliable figure for ConWorkShop's or Vulgarlang's user counts or pricing.
