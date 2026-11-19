// Shared setup: load the YAML records once for every test file.
import { loadNorsund, loadFiles, REPO_ROOT } from '../norsund/node.js';

export const data = loadNorsund();
export { loadFiles, REPO_ROOT };

export const strip = (s) => String(s).replace(/^[[/]|[\]/]$/g, '');
