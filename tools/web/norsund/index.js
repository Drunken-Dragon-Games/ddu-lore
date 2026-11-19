// Copied from tools/norsund/index.js by tools/build.mjs. Edit the original, then run node build.mjs.
// Norsund engine: one entry point for the CLI and the browser workbench.
// Browser: import { setData } from './index.js'; setData(await (await fetch('data/norsund.json')).json());
// Node:    import { loadNorsund } from './node.js'; loadNorsund();
export { setData, getData, hasData, grammar, entries, flattenDictionary } from './data.js';
export { tokenize, syllabify, syllableCount, ipa, respell, validateForm, alignParts, NORSUND_LETTERS } from './phonology.js';
export {
  nounForms, verbForms, adjForms, pronounForms, inflectNoun, inflectVerb, inflectAdj, inflectPronoun,
  paradigm, analyze, isFinite, genitive, verbStem, STARISUND_ANIMATE,
} from './morphology.js';
export { findEntry, findEntries, entryById, lookupEnglish, glossLabel, normalizeGloss, collate, collationKey, sortEntries, initialLetter, search } from './lexicon.js';
export { gloss, englishToNorsund } from './translate.js';
export { generatePlaceName, generatePersonName, demonym, checkName, joinElements, rng } from './names.js';
export { evolve, applyRule, parseEnv, romanize, paths as soundChangePaths, makeTokenizer } from './soundchange.js';
export { toNorsund as numberToNorsund, ordinal, parseNorsund as parseNumber } from './numbers.js';
export { validateFiles, validateEntry, formatReport, ENUMS } from './validate.js';
export * from './scripts.js';
