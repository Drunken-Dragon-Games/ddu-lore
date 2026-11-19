#!/usr/bin/env node
// Production art sheets for Lysrit and the runes: one per medium in the Drunken Dragon visual brief
// (carved white stone with Starifjolden-crystal inlay, stained-glass domes, techwear HUD, rune-carving on wood and slate).
//   node tools/fonts/art_sheets.mjs   ->  docs/languages/norsund/img/art-*.svg
// The glyph geometry always comes from tools/norsund/scripts.js, so the sheets stay true to the script records;
// only the treatment (stroke weight, terminals, colour, inlay, glow) changes per medium, following the
// rules in docs/languages/norsund/writing-systems.md ("Production art direction").
import fs from 'node:fs';
import path from 'node:path';
import { REPO_ROOT } from '../norsund/node.js';
import { renderLysrit, renderRunes, LYSRIT } from '../norsund/index.js';

const OUT = path.join(REPO_ROOT, 'docs', 'languages', 'norsund', 'img');
// Palette from the visual brief: deep navy/indigo, cyan, mint, magenta-purple, lilac, off-white stone, dark slate
const C = { navy: '#0f1430', indigo: '#1b2150', cyan: '#3fd0e0', mint: '#7fe0bd', magenta: '#b347c9', lilac: '#b9a7e8',
  stone: '#ece9e1', stoneShade: '#c9c4b8', groove: '#6d685d', slate: '#2b3040', lead: '#151827', wood: '#6b4a2f', woodLight: '#e8d2b0' };

const inner = (svg) => svg.replace(/^<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '').replace(/<title>[\s\S]*?<\/title>/, '');
const size = (svg) => { const m = svg.match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/); return { w: Number(m[1]), h: Number(m[2]) }; };
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');

// Restyle the renderer's markup: hide the guide dots, set stroke weights and caps, recolour stars and voiced centres.
function treat(svg, { stroke, width, cap = 'round', dots = false, star, centre, sacred }) {
  let s = inner(svg);
  if (!dots) s = s.replace(/<circle[^>]*opacity:0\.32[^>]*\/>/g, '');
  s = s.replace(/stroke-width:[\d.]+/g, `stroke-width:${width}`).replace(/stroke-linecap:\w+/g, `stroke-linecap:${cap}`)
    .replace(/stroke:currentColor/g, `stroke:${stroke}`);
  if (star) s = s.replace(/fill:var\(--lysrit-star[^)]*\)/g, `fill:${star}`);
  if (centre) s = s.replace(/fill:var\(--lysrit-voiced[^)]*\)/g, `fill:${centre}`);
  if (sacred) s = s.replace(/fill:var\(--lysrit-sacred[^)]*\)/g, `fill:${sacred}`);
  return s.replace(/fill:currentColor/g, `fill:${stroke}`);
}

function sheet(name, w, h, body, bg) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-label="${esc(name)}">${bg}${body}</svg>\n`;
  fs.writeFileSync(path.join(OUT, `${name}.svg`), svg);
  return svg;
}

const label = (x, y, text, fill, size = 13, weight = 600, family = 'Helvetica, Arial, sans-serif', ls = 1.5) =>
  `<text x="${x}" y="${y}" font-family="${family}" font-size="${size}" font-weight="${weight}" letter-spacing="${ls}" fill="${fill}">${esc(text)}</text>`;

// 1. Carved white stone with crystal inlay (Kjoldmur gate, Starirauggheim lintels)
function carvedStone() {
  const line1 = renderLysrit('Fjol starin lyser run ne', { sacred: false, scale: 2.2 });
  const line2 = renderLysrit('Auristar', { sacred: true, scale: 3.2 });
  const s1 = size(line1); const s2 = size(line2);
  const W = Math.ceil(Math.max(s1.w * 2.2, s2.w * 3.2) + 120); const H = 470;
  const carve = (svg, sc, x, y) => {
    const deep = treat(svg, { stroke: C.groove, width: 3.4, cap: 'square', star: `url(#crystal)`, centre: 'url(#crystal)', sacred: C.magenta });
    const lip = treat(svg, { stroke: '#ffffff', width: 1.2, cap: 'square', star: 'none', centre: 'none', sacred: 'none' });
    return `<g transform="translate(${x + 1.2},${y + 1.4}) scale(${sc})" opacity="0.9">${lip}</g><g transform="translate(${x},${y}) scale(${sc})" filter="url(#inset)">${deep}</g>`;
  };
  const defs = `<defs><radialGradient id="crystal"><stop offset="0" stop-color="#e9fdff"/><stop offset="0.45" stop-color="${C.cyan}"/><stop offset="1" stop-color="${C.indigo}"/></radialGradient>
    <filter id="inset"><feDropShadow dx="-0.6" dy="-0.6" stdDeviation="0.4" flood-color="#000" flood-opacity="0.35"/></filter>
    <linearGradient id="stone" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${C.stone}"/><stop offset="1" stop-color="${C.stoneShade}"/></linearGradient></defs>`;
  const bg = `${defs}<rect width="${W}" height="${H}" fill="url(#stone)"/><rect x="18" y="18" width="${W - 36}" height="${H - 36}" fill="none" stroke="${C.stoneShade}" stroke-width="3"/>`;
  const body = label(48, 62, 'LYSRIT · CARVED WHITE STONE WITH STARIFJOLDEN CRYSTAL INLAY', C.groove)
    + carve(line2, 3.2, 48, 96) + carve(line1, 2.2, 48, 270)
    + label(48, 418, 'Square-cut grooves at 1/12 of the cell height. Vowel stars and voiced centres are drilled and inlaid with crystal. No guide dots on stone.', C.groove, 12, 400, 'Helvetica, Arial, sans-serif', 0)
    + label(48, 440, 'Auristar  ·  Fjol starin lyser run ne, "Beneath the star, no rune shines"', C.groove, 12, 400, 'Georgia, serif', 0);
  return sheet('art-carved-stone', W, H, body, bg);
}

// 2. Stained glass: each cell is a pane in the heptagon grid; strokes are the lead lines
function stainedGlass() {
  const words = ['Lysmar', 'Nett', 'Ur'];
  const panes = [C.indigo, '#26407a', C.magenta, C.lilac, '#1f6f8b', C.mint];
  let x = 48; const y = 92; const sc = 3; let body = ''; let k = 0;
  for (const w of words) {
    const svg = renderLysrit(w, { sacred: true, scale: 1 });
    const { w: vw } = size(svg);
    // panes: one heptagon per 40-unit cell behind the glyphs
    let glass = '';
    const cells = Math.round(vw / 40);
    for (let i = 0; i < cells; i++) {
      const cx = 20 + i * 40 + (vw - cells * 40); const cy = 22;
      const pts = Array.from({ length: 7 }, (_, j) => { const a = (-90 + j * 360 / 7) * Math.PI / 180; return `${(cx + 19 * Math.cos(a)).toFixed(2)},${(cy + 19 * Math.sin(a)).toFixed(2)}`; }).join(' ');
      glass += `<polygon points="${pts}" fill="${panes[(k + i) % panes.length]}" opacity="0.85" stroke="${C.lead}" stroke-width="2.2"/>`;
    }
    k += 2;
    const lead = treat(svg, { stroke: C.lead, width: 4.2, cap: 'round', star: '#fff7c2', centre: '#fff7c2', sacred: C.cyan });
    body += `<g transform="translate(${x},${y}) scale(${sc})">${glass}${lead}</g>`;
    body += label(x, y + 44 * sc + 26, w.toUpperCase(), C.lilac, 13);
    x += vw * sc + 56;
  }
  const W = x + 8; const H = 330;
  const bg = `<rect width="${W}" height="${H}" fill="${C.navy}"/><rect x="14" y="14" width="${W - 28}" height="${H - 28}" fill="none" stroke="${C.lead}" stroke-width="10"/>`;
  return sheet('art-stained-glass', W, H, label(48, 62, 'LYSRIT · STAINED GLASS (DOME PANELS)', C.lilac) + body
    + label(48, H - 30, 'Every heptagon cell is a pane; letter strokes are 1/10-cell lead came; stars are clear jewel glass. The sacred mark is set in cyan.', C.lilac, 12, 400, 'Helvetica, Arial, sans-serif', 0), bg);
}

// 3. Techwear HUD / game UI: thin strokes, cyan glow, grid dots kept for legibility at small sizes
function hud() {
  const svgA = renderLysrit('Norstarkjold', { sacred: false, scale: 1 });
  const svgB = renderRunes('Vilkyren', { variant: 'long', scale: 1 });
  const a = size(svgA); const b = size(svgB);
  const W = Math.ceil(Math.max(a.w * 2, b.w * 1.6) + 140); const H = 380;
  const defs = `<defs><filter id="glow" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="1.6" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    <pattern id="grid" width="24" height="24" patternUnits="userSpaceOnUse"><path d="M24 0H0V24" fill="none" stroke="#1d2550" stroke-width="1"/></pattern></defs>`;
  const bg = `${defs}<rect width="${W}" height="${H}" fill="${C.navy}"/><rect width="${W}" height="${H}" fill="url(#grid)"/>`;
  const body = label(40, 50, 'LYSRIT + RUNES · TECHWEAR HUD / GAME UI', C.cyan, 13, 600, 'Menlo, monospace')
    + `<g transform="translate(40,80) scale(2)" filter="url(#glow)">${treat(svgA, { stroke: C.cyan, width: 1.6, cap: 'round', dots: true, star: C.mint, centre: C.mint })}</g>`
    + label(40, 196, 'NORSTARKJOLD // GUARD OF THE NORTH STAR', C.lilac, 11, 500, 'Menlo, monospace', 2)
    + `<g transform="translate(40,222) scale(1.6)">${treat(svgB, { stroke: C.lilac, width: 1.8, cap: 'square' })}</g>`
    + label(40, 336, 'VILKYREN // FREE SWORDS · runes stay unlit: a glowing rune is magic', C.lilac, 11, 500, 'Menlo, monospace', 1);
  return sheet('art-hud', W, H, body, bg);
}

// 4. Runes in their two media: short-twig cut into wood, long-branch chiselled into slate
function runesWoodStone() {
  const text = 'Vil kyrin vothen sundin';
  const twig = renderRunes(text, { variant: 'short', scale: 1 });
  const branch = renderRunes(text, { variant: 'long', scale: 1 });
  const t = size(twig); const br = size(branch);
  const W = Math.ceil(Math.max(t.w, br.w) * 1.5 + 100); const H = 420;
  const grain = Array.from({ length: 9 }, (_, i) => `<path d="M0 ${30 + i * 19} C ${W * 0.3} ${22 + i * 19}, ${W * 0.6} ${40 + i * 19}, ${W} ${28 + i * 19}" stroke="#5a3d26" stroke-width="1.4" fill="none" opacity="0.6"/>`).join('');
  const bg = `<rect width="${W}" height="200" fill="${C.wood}"/>${grain}<rect y="200" width="${W}" height="${H - 200}" fill="${C.slate}"/>`;
  const body = label(40, 40, 'RUNAR · SHORT-TWIG, CUT IN WOOD (everyday use)', C.woodLight, 13)
    + `<g transform="translate(40,62) scale(1.5)">${treat(twig, { stroke: C.woodLight, width: 3, cap: 'butt' })}</g>`
    + label(40, 240, 'RUNAR · LONG-BRANCH, CHISELLED IN SLATE (monuments)', '#d9dbe3', 13)
    + `<g transform="translate(40,262) scale(1.5)">${treat(branch, { stroke: '#d9dbe3', width: 3.4, cap: 'square' })}</g>`
    + label(40, 396, 'Vil kyrin, vothen sundin: "Free the blade, bound the word." Plain runes never glow; only rune magic does.', '#d9dbe3', 12, 400, 'Georgia, serif', 0);
  return sheet('art-runes-wood-stone', W, H, body, bg);
}

fs.mkdirSync(OUT, { recursive: true });
const made = [carvedStone(), stainedGlass(), hud(), runesWoodStone()];
console.log(`Wrote ${made.length} art sheets to ${path.relative(REPO_ROOT, OUT)}/art-*.svg (Lysrit has ${Object.keys(LYSRIT.consonants).length} consonants).`);
