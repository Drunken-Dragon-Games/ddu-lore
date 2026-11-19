// Node-only loader: reads the YAML records from the repository and hands them to the engine.
// Browser code should fetch tools/web/data/norsund.json and call setData() instead.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import yaml from 'js-yaml';
import { setData, flattenDictionary } from './data.js';

export const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
export const LANG_DIR = 'records/languages';

function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  const out = [];
  for (const name of fs.readdirSync(dir).sort()) {
    const full = path.join(dir, name);
    const st = fs.statSync(full);
    if (st.isDirectory()) out.push(...walk(full));
    else if (/\.ya?ml$/.test(name)) out.push(full);
  }
  return out;
}

// Every YAML file under records/languages, parsed: [{path, doc, error}]
export function loadFiles(root = REPO_ROOT) {
  return walk(path.join(root, LANG_DIR)).map((full) => {
    const rel = path.relative(root, full).split(path.sep).join('/');
    try {
      return { path: rel, doc: yaml.load(fs.readFileSync(full, 'utf8')) };
    } catch (e) {
      return { path: rel, doc: null, error: e.message.split('\n')[0] };
    }
  });
}

function grammarKey(file) {
  return path.basename(file).replace(/\.ya?ml$/, '').replace(/^\d+-/, '');
}

// Builds the single data object used by the engine and saved as norsund.json.
export function buildData(files) {
  const data = {
    version: '1.0.0',
    language: 'norsund',
    grammar: {},
    dictionary: { files: [], entries: [] },
    texts: [],
    languages: {},
    scripts: [],
    facts: [],
  };
  const usedIds = new Map();
  for (const f of files) {
    const d = f.doc;
    if (!d || typeof d !== 'object') continue;
    const parts = f.path.split('/');
    const lang = parts[2];
    if (d.document === 'lang-grammar/v1' && lang === 'norsund') {
      data.grammar[grammarKey(f.path)] = { ...d, file: f.path };
      if (d.version) data.version = String(d.version);
    } else if (d.document === 'lang-grammar/v1') {
      (data.languages[lang] = data.languages[lang] || { grammar: [], dictionary: [] }).grammar.push({ ...d, file: f.path });
    } else if (d.document === 'lang-dictionary/v1') {
      const flat = flattenDictionary(d, f.path, usedIds);
      if ((d.language || lang) === 'norsund') {
        data.dictionary.entries.push(...flat);
        data.dictionary.files.push({ path: f.path, topic: d.topic, field: d.field, count: flat.length });
      } else {
        (data.languages[lang] = data.languages[lang] || { grammar: [], dictionary: [] }).dictionary.push(...flat);
      }
    } else if (d.document === 'lang-text/v1') {
      data.texts.push({ ...d, file: f.path, language: d.language || lang });
    } else if (d.document === 'lang-script/v1') {
      data.scripts.push({ ...d, file: f.path });
    } else if (d.document === 'fact-record/v1') {
      data.facts.push({ ...d, file: f.path });
    }
  }
  return data;
}

// loadNorsund() reads the repository and makes the engine ready to use. Returns the data object.
export function loadNorsund(root = REPO_ROOT) {
  const files = loadFiles(root);
  const data = buildData(files);
  setData(data);
  return data;
}

export { fs, path, yaml };
