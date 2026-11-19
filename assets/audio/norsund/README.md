# Norsund reference audio

404 synthetic recordings for 184 items, generated from the engine's IPA with eSpeak NG (Norwegian voice, which has every Norsund sound):

| Folder | What | Versions |
|---|---|---|
| `names/` | 36 canon names (Thiolden, Auristar, Kjoldmur, Starirauggheim, Vilkyren…) | normal, slow, syllable by syllable |
| `phrases/` | the 136 phrases of `records/languages/norsund/texts/04-phrasebook.yaml` | normal, slow |
| `texts/` | the sample texts of `texts/01-samples.yaml` (toast, Vilkyr code, gate inscription, prophecy…) | normal, slow |

`manifest.json` lists every item with its text, IPA, English-friendly respelling, translation, dialect, files and durations.

## How they were made and checked

`node tools/audio/build_audio.mjs` (needs `espeak-ng`; on macOS `brew install espeak-ng`) turns each word's IPA into eSpeak phonemes. It follows grammar/01 exactly: first-syllable stress, th as [θ] or [ð], kj [c], gj [ɟ], y [y], r tapped between vowels and trilled elsewhere, and long double consonants. Before writing a file it asks eSpeak to echo the phonemes it will speak and stops if any sound was dropped or changed, so every file is verified without anyone having to listen to it. `--check` runs only that verification; CI runs it on every language pull request.

After generation, `node tools/audio/verify_audio.mjs` decodes and measures every file, so the audio is checked without anyone listening:
- each file contains speech, and none clips;
- each duration matches the manifest;
- every slow take is slower than its normal take;
- in every syllable-by-syllable take, the number of separate sound bursts equals the number of syllables.

Connected takes run their syllables together (for example, 1 burst for *Sundwanderen* against 4 in its syllable take), which shows the check can tell the difference. All 404 files passed on 2026-11-19. `npm run audio` builds and verifies in one go.

Lines tagged Starisund are spoken with the Auristar accent (th as [s], final n as [ŋ]).

## Status and licence

These are **synthetic reference recordings**: exact in sound, flat in delivery. They fix how every name and phrase is pronounced, for writers, voice directors and game builds. Human recordings made with the protocol in `docs/languages/norsund/writers-and-actors-kit.md` can replace any file; keep the same file name and update `manifest.json`.

The audio is released under CC BY 4.0 with the rest of the language (`docs/languages/LICENSES.md`). eSpeak NG itself is GPL-3.0, but the program's licence does not cover the sound it produces.
