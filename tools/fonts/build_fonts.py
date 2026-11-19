#!/usr/bin/env python3
"""Build the Lysrit and Runar fonts from the script records.

    python tools/fonts/build_fonts.py            # build into assets/fonts/
    python tools/fonts/build_fonts.py --test     # also shape sample words (needs uharfbuzz)

Inputs:  records/languages/scripts/lysrit.yaml and runar.yaml (the record of truth).
Checks:  that tools/norsund/scripts.js carries the same glyph tables (skipped if node is missing).
Outputs: assets/fonts/Lysrit-Regular.otf, Runar-Regular.otf (long-branch), Runar-Twig.otf (short-twig).
Needs:   pip install fonttools pyyaml   (uharfbuzz only for --test)

The fonts only use the OpenType features kern/liga, so they work in Unity TextMesh Pro.
Licensed under the SIL Open Font License 1.1 (assets/fonts/OFL.txt).
"""
import argparse
import json
import math
import shutil
import subprocess
import sys
from pathlib import Path

import yaml
from fontTools.fontBuilder import FontBuilder
from fontTools.pens.t2CharStringPen import T2CharStringPen

ROOT = Path(__file__).resolve().parents[2]
SCRIPTS = ROOT / "records" / "languages" / "scripts"
COPYRIGHT = "Copyright 2026 The Drunken Dragon Universe lore contributors"
LICENSE = "This Font Software is licensed under the SIL Open Font License, Version 1.1."
LICENSE_URL = "https://openfontlicense.org"
VERSION = "Version 1.000"

# ---------------------------------------------------------------------------
# Outline helpers. All coordinates are font units, y up. Every contour is drawn
# counter-clockwise so overlapping strokes fill under the nonzero rule.
# ---------------------------------------------------------------------------
K = 0.5522847498


def area(pts):
    return sum(pts[i][0] * pts[(i + 1) % len(pts)][1] - pts[(i + 1) % len(pts)][0] * pts[i][1] for i in range(len(pts))) / 2


def poly(pen, pts):
    pts = [(round(x, 1), round(y, 1)) for x, y in pts]
    if area(pts) < 0:
        pts = pts[::-1]
    pen.moveTo(pts[0])
    for p in pts[1:]:
        pen.lineTo(p)
    pen.closePath()


def circle(pen, cx, cy, r, ccw=True):
    k = K * r
    pen.moveTo((cx + r, cy))
    if ccw:
        pen.curveTo((cx + r, cy + k), (cx + k, cy + r), (cx, cy + r))
        pen.curveTo((cx - k, cy + r), (cx - r, cy + k), (cx - r, cy))
        pen.curveTo((cx - r, cy - k), (cx - k, cy - r), (cx, cy - r))
        pen.curveTo((cx + k, cy - r), (cx + r, cy - k), (cx + r, cy))
    else:
        pen.curveTo((cx + r, cy - k), (cx + k, cy - r), (cx, cy - r))
        pen.curveTo((cx - k, cy - r), (cx - r, cy - k), (cx - r, cy))
        pen.curveTo((cx - r, cy + k), (cx - k, cy + r), (cx, cy + r))
        pen.curveTo((cx + k, cy + r), (cx + r, cy + k), (cx + r, cy))
    pen.closePath()


def ring(pen, cx, cy, r_out, r_in):
    circle(pen, cx, cy, r_out, True)
    circle(pen, cx, cy, r_in, False)


def stadium(pen, p, q, w):
    """A stroke from p to q with round caps, half-width w/2."""
    (x1, y1), (x2, y2) = p, q
    dx, dy = x2 - x1, y2 - y1
    length = math.hypot(dx, dy)
    h = w / 2
    if length < 1e-6:
        circle(pen, x1, y1, h)
        return
    ux, uy = dx / length, dy / length
    nx, ny = -uy, ux  # left normal; with this order the outline runs counter-clockwise
    k = K * h
    a = (x1 + nx * h, y1 + ny * h)
    b = (x2 + nx * h, y2 + ny * h)
    c = (x2 - nx * h, y2 - ny * h)
    d = (x1 - nx * h, y1 - ny * h)
    # Outline: d -> c (right side forward), cap around q, b -> a (left side back), cap around p.
    pen.moveTo(d)
    pen.lineTo(c)
    pen.curveTo((c[0] + ux * k, c[1] + uy * k), (x2 + ux * h - nx * k, y2 + uy * h - ny * k), (x2 + ux * h, y2 + uy * h))
    pen.curveTo((x2 + ux * h + nx * k, y2 + uy * h + ny * k), (b[0] + ux * k, b[1] + uy * k), b)
    pen.lineTo(a)
    pen.curveTo((a[0] - ux * k, a[1] - uy * k), (x1 - ux * h + nx * k, y1 - uy * h + ny * k), (x1 - ux * h, y1 - uy * h))
    pen.curveTo((x1 - ux * h - nx * k, y1 - uy * h - ny * k), (d[0] - ux * k, d[1] - uy * k), d)
    pen.closePath()


def square_stroke(pen, p, q, w):
    """A cut stroke from p to q with square ends (runes)."""
    (x1, y1), (x2, y2) = p, q
    dx, dy = x2 - x1, y2 - y1
    length = math.hypot(dx, dy)
    h = w / 2
    ux, uy = dx / length, dy / length
    nx, ny = -uy, ux
    s = (x1 - ux * h, y1 - uy * h)
    e = (x2 + ux * h, y2 + uy * h)
    poly(pen, [(s[0] - nx * h, s[1] - ny * h), (e[0] - nx * h, e[1] - ny * h), (e[0] + nx * h, e[1] + ny * h), (s[0] + nx * h, s[1] + ny * h)])


def sparkle(pen, cx, cy, s):
    """Four-pointed star with concave sides (quadratic curves through the centre), counter-clockwise."""
    pen.moveTo((cx, cy + s))
    pen.qCurveTo((cx, cy), (cx - s, cy))
    pen.qCurveTo((cx, cy), (cx, cy - s))
    pen.qCurveTo((cx, cy), (cx + s, cy))
    pen.qCurveTo((cx, cy), (cx, cy + s))
    pen.closePath()


def diamond(pen, cx, cy, r):
    poly(pen, [(cx, cy + r), (cx - r, cy), (cx, cy - r), (cx + r, cy)])


# ---------------------------------------------------------------------------
# Lysrit
# ---------------------------------------------------------------------------
S = 20      # font units per Lysrit cell unit
BASE = 40   # cell y that sits on the baseline


def lx(x):
    return x * S


def ly(y):
    return (BASE - y) * S


class Lysrit:
    def __init__(self, data):
        self.d = data
        g = data["grid"]
        self.cx, self.cy = g["centre"]
        self.r = g["radius"]
        self.cons = {c["letter"]: c for c in data["consonants"]}
        self.vowel_node = {v["letter"]: v["node"] for v in data["vowels"]}
        self.digits = {d["digit"]: d for d in data["numerals"]["digits"]}
        self.lh = data["numerals"]["long_hundred"]

    def node(self, k):
        if k == "C":
            return (lx(self.cx), ly(self.cy))
        a = math.radians(-90 + k * 360 / 7)
        return (lx(self.cx + self.r * math.cos(a)), ly(self.cy + self.r * math.sin(a)))

    def grid(self, pen):
        for k in ["C", 0, 1, 2, 3, 4, 5, 6]:
            x, y = self.node(k)
            diamond(pen, x, y, 1.4 * S)

    def stroke(self, pen, a, b, w=2.1):
        stadium(pen, self.node(a), self.node(b), w * S)

    def cell(self, pen, cons=None, gem=False, vowels=()):
        self.grid(pen)
        if cons:
            spec = self.cons[cons]
            for a, b in spec["strokes"]:
                self.stroke(pen, a, b)
            if spec["voiced"]:
                circle(pen, lx(self.cx), ly(self.cy), 2.7 * S)
            if gem:
                stadium(pen, (lx(self.cx - 6), ly(41.5)), (lx(self.cx + 6), ly(41.5)), 1.6 * S)
        for v, long_ in vowels:
            x, y = self.node(self.vowel_node[v])
            sparkle(pen, x, y, 4.4 * S)
            if long_:
                ring(pen, x, y, 6.8 * S, 5.6 * S)

    def number(self, pen, spec, fine=()):
        self.grid(pen)
        stadium(pen, (lx(0), ly(2.6)), (lx(40), ly(2.6)), 1.6 * S)  # full width so neighbours join
        for a, b in spec.get("strokes", []):
            self.stroke(pen, a, b)
        for a, b in fine:
            self.stroke(pen, a, b, 1.3)
        if spec.get("centre_ring"):
            ring(pen, lx(self.cx), ly(self.cy), 5.0 * S, 3.4 * S)
        if spec.get("centre_dot"):
            circle(pen, lx(self.cx), ly(self.cy), 2.7 * S)

    def sigil(self, pen, ring_=False, stars=()):
        self.grid(pen)
        if ring_:
            ring(pen, lx(self.cx), ly(self.cy), 7.8 * S, 6.2 * S)
        for k in stars:
            x, y = self.node(k)
            sparkle(pen, x, y, (4.4 if k == "C" else 3.6) * S)

    def sacred(self, pen):
        pts = []
        for k in range(14):
            r = 3.8 if k % 2 else 9
            a = math.radians(-90 + k * 180 / 7)
            pts.append((lx(11 + r * math.cos(a)), ly(self.cy + r * math.sin(a))))
        poly(pen, pts)


VOWELS = ["y", "i", "e", "a", "schwa", "o", "u"]
VOWEL_CHAR = {"schwa": "ə"}
PAIR_VOWELS = ["y", "i", "e", "a", "o", "u"]
DIPHTHONGS = {("e", "i"): ["e", "i"], ("a", "y"): ["e", "i"], ("a", "u"): ["a", "u"], ("o", "u"): ["o", "u"]}
SINGLE_CONS = ["p", "b", "f", "v", "m", "w", "t", "d", "s", "n", "l", "r", "k", "g", "j", "h"]
DIGRAPHS = {"th": ["t", "h"], "kj": ["k", "j"], "gj": ["g", "j"], "ng": ["n", "g"]}
GEMINATES = ["b", "d", "f", "g", "k", "l", "m", "n", "p", "r", "s", "t"]


def vowel_specs():
    """(spelled letters, glyph key, [(vowel, long)]) for every vowel group a cell can hold."""
    specs = []
    for v in VOWELS:
        specs.append(([v], v, [(VOWEL_CHAR.get(v, v), False)]))
    for a in PAIR_VOWELS:
        for b in PAIR_VOWELS:
            if (a, b) in DIPHTHONGS:
                stars = DIPHTHONGS[(a, b)]
                specs.append(([a, b], "_".join(stars), [(s, False) for s in stars]))
            elif a == b:
                specs.append(([a, b], a + a, [(a, True)]))
            else:
                specs.append(([a, b], f"{a}_{b}", [(a, False), (b, False)]))
    return specs


def build_lysrit(data, out):
    L = Lysrit(data)
    glyphs = {}      # name -> (advance, draw function)
    cmap = {}
    ligatures = {}   # tuple(component glyph names) -> glyph name

    sigs = {}

    def add(name, adv, fn, sig=None):
        """Register a glyph. sig describes what it draws; the same name may only be reused for the same drawing
        (ei and ay both make the stars e+i), so a clash between different glyphs fails the build."""
        sig = sig if sig is not None else name
        if name in sigs and sigs[name] != sig:
            raise ValueError(f"glyph name collision: {name}")
        sigs[name] = sig
        glyphs.setdefault(name, (adv, fn))

    add(".notdef", 400, lambda p: poly(p, [(40, -60), (360, -60), (360, 740), (40, 740)]))
    add("space", 280, lambda p: None)
    add("hyphen", 280, lambda p: None)
    add("quotesingle", 0, lambda p: None)

    def base(letter):
        if letter in L.cons:
            return f"lys.{letter}"
        return f"lys.vow_{letter}"

    # Base consonant cells and digraph/geminate cells.
    cons_variants = []  # (spelled base glyphs, name stem, cons, gem)
    for c in SINGLE_CONS:
        add(f"lys.{c}", 800, lambda p, c=c: L.cell(p, c), ("cell", c, False, ()))
        cons_variants.append(([f"lys.{c}"], c, c, False))
    for dg, parts in DIGRAPHS.items():
        add(f"lys.{dg}", 800, lambda p, dg=dg: L.cell(p, dg), ("cell", dg, False, ()))
        ligatures[tuple(f"lys.{x}" for x in parts)] = f"lys.{dg}"
        cons_variants.append(([f"lys.{x}" for x in parts], dg, dg, False))
    for c in GEMINATES:
        add(f"lys.{c}2", 800, lambda p, c=c: L.cell(p, c, True), ("cell", c, True, ()))
        ligatures[(f"lys.{c}", f"lys.{c}")] = f"lys.{c}2"
        cons_variants.append(([f"lys.{c}", f"lys.{c}"], f"{c}2", c, True))

    # Standalone vowel cells (single vowels are base glyphs; pairs are ligatures).
    specs = vowel_specs()
    for spelled, key, stars in specs:
        add(f"lys.vow_{key}", 800, lambda p, stars=stars: L.cell(p, None, False, stars), ("cell", None, False, tuple(stars)))
        if len(spelled) > 1:
            ligatures[tuple(f"lys.vow_{v}" for v in spelled)] = f"lys.vow_{key}"

    # Consonant + vowel cells.
    for comps, stem, cons, gem in cons_variants:
        for spelled, key, stars in specs:
            name = f"lys.{stem}_{key}"
            add(name, 800, lambda p, cons=cons, gem=gem, stars=stars: L.cell(p, cons, gem, stars), ("cell", cons, gem, tuple(stars)))
            ligatures[tuple(comps + [f"lys.vow_{v}" for v in spelled])] = name

    # Numbers, long hundred, punctuation, sacred mark, evidential sigils.
    for d, spec in L.digits.items():
        add(f"lys.num{d}", 800, lambda p, spec=spec: L.number(p, spec))
        cmap[ord(str(d))] = f"lys.num{d}"
    add("lys.lh", 800, lambda p: L.number(p, {"strokes": L.lh["strokes"]}, L.lh["fine_strokes"]))
    cmap[0xE210] = "lys.lh"
    add("lys.sacred", 520, L.sacred)
    for cp in (0x2736, ord("*")):
        cmap[cp] = "lys.sacred"
    add("lys.sa", 800, lambda p: L.sigil(p, True, ["C"]))
    add("lys.sund", 800, lambda p: L.sigil(p, False, [5, "C", 2]))
    add("lys.stari", 800, lambda p: L.sigil(p, False, [0, 1, 2, 3, 4, 5, 6]))
    cmap.update({0xE201: "lys.sa", 0xE202: "lys.sund", 0xE203: "lys.stari"})
    add("periodcentered", 280, lambda p: diamond(p, lx(7), ly(L.cy), 2.6 * S))
    add("comma", 280, lambda p: stadium(p, (lx(7), ly(24)), (lx(7), ly(34)), 2.1 * S))
    add("period", 280, lambda p: (stadium(p, (lx(4.5), ly(18)), (lx(4.5), ly(34)), 2.1 * S), stadium(p, (lx(9.5), ly(18)), (lx(9.5), ly(34)), 2.1 * S)))
    add("question", 280, lambda p: (stadium(p, (lx(7), ly(20)), (lx(7), ly(34)), 2.1 * S), sparkle(p, lx(7), ly(12), 3.4 * S)))
    add("exclam", 280, lambda p: (stadium(p, (lx(7), ly(12)), (lx(7), ly(28)), 2.1 * S), circle(p, lx(7), ly(33), 1.8 * S)))
    cmap.update({0x20: "space", ord("-"): "hyphen", ord("'"): "quotesingle", 0x2019: "quotesingle",
                 0xB7: "periodcentered", ord(","): "comma", ord("."): "period", ord("?"): "question", ord("!"): "exclam"})

    # Letters (both cases). c, q, x write as k; z as s.
    for ch in "bdfghjklmnprstvw":
        cmap[ord(ch)] = cmap[ord(ch.upper())] = f"lys.{ch}"
    for ch in "aeiouy":
        cmap[ord(ch)] = cmap[ord(ch.upper())] = f"lys.vow_{ch}"
    for ch, tgt in {"c": "k", "q": "k", "x": "k", "z": "s"}.items():
        cmap[ord(ch)] = cmap[ord(ch.upper())] = f"lys.{tgt}"
    cmap[0x0259] = cmap[0x018F] = "lys.vow_schwa"

    fea = ["languagesystem DFLT dflt;", "languagesystem latn dflt;", "", "feature liga {"]
    for comps, out_name in sorted(ligatures.items(), key=lambda kv: (-len(kv[0]), kv[0])):
        fea.append(f"    sub {' '.join(comps)} by {out_name};")
    fea.append("} liga;")

    path = out / "Lysrit-Regular.otf"
    save_font(path, "Lysrit", "Regular", glyphs, cmap, "\n".join(fea), ascent=860, descent=140)
    return path, len(glyphs), len(ligatures)


# ---------------------------------------------------------------------------
# Runar
# ---------------------------------------------------------------------------
H = 700  # stave height in font units


def short_twig(lines):
    out = []
    for pl in lines:
        on = [p for p in pl if p[0] == 0]
        if len(pl) == 2 and pl[0][0] == 0 and pl[1][0] == 0:
            out.append(pl)
            continue
        if not on:
            out.append(pl)
            continue
        ay = sum(p[1] for p in on) / len(on)
        out.append([[0.5 * p[0], ay + 0.5 * (p[1] - ay)] for p in pl])
    return out


def draw_rune(pen, lines, dots, x0, w):
    for pl in lines:
        pts = [(x0 + p[0] * H, (1 - p[1]) * H) for p in pl]
        for a, b in zip(pts, pts[1:]):
            square_stroke(pen, a, b, w)
    for d in dots or []:
        x, y = x0 + d[0] * H, (1 - d[1]) * H
        poly(pen, [(x - w * 0.8, y - w * 0.8), (x + w * 0.8, y - w * 0.8), (x + w * 0.8, y + w * 0.8), (x - w * 0.8, y + w * 0.8)])


def build_runar(data, out, variant):
    w = 72 if variant == "long" else 64
    side = 70
    glyphs, cmap = {}, {}
    stave = [[0, 0], [0, 1]]
    glyphs[".notdef"] = (400, lambda p: poly(p, [(40, 0), (360, 0), (360, 700), (40, 700)]))
    glyphs["space"] = (260, lambda p: None)
    glyphs["quotesingle"] = (0, lambda p: None)
    names = {}
    for i, r in enumerate(data["runes"]):
        lines = [stave] + r["lines"]
        if variant == "short":
            lines = short_twig(lines)
        xs = [p[0] for pl in lines for p in pl]
        lo, hi = min(xs), max(xs)
        x0 = side + w / 2 - lo * H
        adv = round((hi - lo) * H + 2 * side + w)
        gname = "run." + r["letter"]
        glyphs[gname] = (adv, lambda p, lines=lines, dots=r.get("dots"), x0=x0: draw_rune(p, lines, dots, x0, w))
        names[r["letter"]] = gname
        cmap[0xE100 + i] = cmap[0xE140 + i] = gname
    for ch in "abdefghijklmnoprstuvwy":
        cmap[ord(ch)] = cmap[ord(ch.upper())] = names[ch]
    for ch, tgt in {"c": "k", "q": "k", "x": "k", "z": "s"}.items():
        cmap[ord(ch)] = cmap[ord(ch.upper())] = names[tgt]
    cmap[0x0259] = cmap[0x018F] = names["e"]

    def dot(p, y):
        poly(p, [(100, y - 40), (180, y - 40), (180, y + 40), (100, y + 40)])

    glyphs["periodcentered"] = (280, lambda p: dot(p, 350))
    glyphs["colon"] = (280, lambda p: (dot(p, 210), dot(p, 490)))
    for cp in (0xB7, ord(","), ord("-")):
        cmap[cp] = "periodcentered"
    for cp in (ord(":"), ord("."), ord(";"), ord("!"), ord("?")):
        cmap[cp] = "colon"
    cmap.update({0x20: "space", ord("'"): "quotesingle", 0x2019: "quotesingle"})

    notch = data["numerals"]["notch"]
    hand = data["numerals"]["hand"]

    def tally(p, n):
        x = side
        for _ in range(n // 5):
            for k in range(4):
                draw_rune(p, [notch], [], x + k * 120, w)
            draw_rune(p, [hand], [], x + 20, w)
            x += 560
        for _ in range(n % 5):
            draw_rune(p, [notch], [], x, w)
            x += 120

    for n in range(10):
        hands, rest = divmod(n, 5)
        adv = side * 2 + hands * 560 + rest * 120 + (w if n else 200)
        if n == 0:
            glyphs["zero"] = (adv, lambda p: draw_rune(p, [data["numerals"]["zero"]], [], side, w))
        else:
            glyphs[f"tally{n}"] = (adv, lambda p, n=n: tally(p, n))
        cmap[ord(str(n))] = "zero" if n == 0 else f"tally{n}"

    fea = ["languagesystem DFLT dflt;", "languagesystem latn dflt;", "", "feature liga {"]
    for dg in ["th", "kj", "gj", "ng"]:
        fea.append(f"    sub {names[dg[0]]} {names[dg[1]]} by {names[dg]};")
    fea.append("} liga;")
    family, style, fname = ("Runar", "Regular", "Runar-Regular.otf") if variant == "long" else ("Runar Twig", "Regular", "Runar-Twig.otf")
    path = out / fname
    save_font(path, family, style, glyphs, cmap, "\n".join(fea), ascent=780, descent=120)
    return path, len(glyphs)


# ---------------------------------------------------------------------------
# Font assembly
# ---------------------------------------------------------------------------

def save_font(path, family, style, glyphs, cmap, fea, ascent, descent):
    order = [".notdef"] + sorted(n for n in glyphs if n != ".notdef")
    fb = FontBuilder(1000, isTTF=False)
    fb.setupGlyphOrder(order)
    fb.setupCharacterMap(cmap)
    charstrings = {}
    for name in order:
        adv, fn = glyphs[name]
        pen = T2CharStringPen(adv, None)
        fn(pen)
        charstrings[name] = pen.getCharString()
    ps = family.replace(" ", "") + "-" + style
    fb.setupCFF(ps, {"FullName": f"{family} {style}", "FamilyName": family, "Weight": style, "Notice": COPYRIGHT}, charstrings, {})
    metrics = {}
    for name in order:
        b = charstrings[name].calcBounds(None)
        metrics[name] = (glyphs[name][0], round(b[0]) if b else 0)
    fb.setupHorizontalMetrics(metrics)
    fb.setupHorizontalHeader(ascent=ascent, descent=-descent)
    fb.setupNameTable({
        "copyright": COPYRIGHT,
        "familyName": family,
        "styleName": style,
        "uniqueFontIdentifier": f"{ps};{VERSION}",
        "fullName": f"{family} {style}",
        "version": VERSION,
        "psName": ps,
        "licenseDescription": LICENSE,
        "licenseInfoURL": LICENSE_URL,
        "designer": "Drunken Dragon Universe lore contributors",
        "description": f"{family}: a script of the Norsund language, Drunken Dragon Universe.",
    })
    fb.setupOS2(sTypoAscender=ascent, sTypoDescender=-descent, sTypoLineGap=200, usWinAscent=ascent + 60, usWinDescent=descent + 60, fsType=0, achVendID="DDU ")
    fb.setupPost()
    fb.addOpenTypeFeatures(fea)
    fb.save(str(path))


# ---------------------------------------------------------------------------
# Consistency check against tools/norsund/scripts.js
# ---------------------------------------------------------------------------

def check_against_js(lys, run):
    node = shutil.which("node")
    if not node:
        print("note: node not found; skipped the scripts.js consistency check")
        return
    js = ROOT / "tools" / "norsund" / "scripts.js"
    code = f"import * as S from {json.dumps(js.as_uri())}; console.log(JSON.stringify({{L: S.LYSRIT, R: S.RUNAR}}));"
    res = subprocess.run([node, "--input-type=module", "-e", code], capture_output=True, text=True)
    if res.returncode:
        sys.exit(f"could not load scripts.js:\n{res.stderr}")
    data = json.loads(res.stdout)
    problems = []
    for c in lys["consonants"]:
        j = data["L"]["consonants"].get(c["letter"])
        if not j or j["strokes"] != c["strokes"] or j["voiced"] != c["voiced"]:
            problems.append(f"Lysrit consonant {c['letter']}")
    for v in lys["vowels"]:
        if data["L"]["vowels"].get(v["letter"]) != v["node"]:
            problems.append(f"Lysrit vowel {v['letter']}")
    for d in lys["numerals"]["digits"]:
        j = data["L"]["digits"][str(d["digit"])]
        if j["strokes"] != d["strokes"] or bool(j.get("dot")) != bool(d.get("centre_dot")) or bool(j.get("ring")) != bool(d.get("centre_ring")):
            problems.append(f"Lysrit digit {d['digit']}")
    jr = {r["letter"]: r for r in data["R"]["runes"]}
    if [r["letter"] for r in data["R"]["runes"]] != [r["letter"] for r in run["runes"]]:
        problems.append("rune order")
    for r in run["runes"]:
        j = jr.get(r["letter"])
        if not j or j["lines"][1:] != r["lines"] or (j.get("dots") or []) != (r.get("dots") or []) or j["name"] != r["name"]:
            problems.append(f"rune {r['letter']}")
    if problems:
        sys.exit("scripts.js and the YAML records disagree: " + ", ".join(problems))
    print("scripts.js matches lysrit.yaml and runar.yaml")


# ---------------------------------------------------------------------------
# Shaping test
# ---------------------------------------------------------------------------

def shape_test(paths):
    try:
        import uharfbuzz as hb
    except ImportError:
        print("note: uharfbuzz not installed; skipped the shaping test")
        return
    expect = {
        "Auristar": ["lys.vow_a_u", "lys.r_i", "lys.s", "lys.t_a", "lys.r"],
        "Thiolden": ["lys.th_i_o", "lys.l", "lys.d_e", "lys.n"],
        "Kjoldmur": ["lys.kj_o", "lys.l", "lys.d", "lys.m_u", "lys.r"],
        "Starirauggheim": ["lys.s", "lys.t_a", "lys.r_i", "lys.r_a_u", "lys.g2", "lys.h_e_i", "lys.m"],
        "Thiolnay": ["lys.th_i_o", "lys.l", "lys.n_e_i"],
    }
    blob = hb.Blob.from_file_path(str(paths["lysrit"]))
    font = hb.Font(hb.Face(blob))
    ok = True
    for word, want in expect.items():
        buf = hb.Buffer()
        buf.add_str(word)
        buf.guess_segment_properties()
        hb.shape(font, buf, {"liga": True})
        got = [font.glyph_to_string(i.codepoint) for i in buf.glyph_infos]
        status = "ok" if got == want else "MISMATCH"
        ok &= got == want
        print(f"  Lysrit {word:15} {status}: {' '.join(got)}")
    blob = hb.Blob.from_file_path(str(paths["runar"]))
    font = hb.Font(hb.Face(blob))
    buf = hb.Buffer()
    buf.add_str("kjold thiol")
    buf.guess_segment_properties()
    hb.shape(font, buf, {"liga": True})
    got = [font.glyph_to_string(i.codepoint) for i in buf.glyph_infos]
    want = ["run.kj", "run.o", "run.l", "run.d", "space", "run.th", "run.i", "run.o", "run.l"]
    print(f"  Runar  kjold thiol     {'ok' if got == want else 'MISMATCH'}: {' '.join(got)}")
    ok &= got == want
    if not ok:
        sys.exit("shaping test failed")


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--out", default=str(ROOT / "assets" / "fonts"))
    ap.add_argument("--no-check", action="store_true", help="skip the scripts.js consistency check")
    ap.add_argument("--test", action="store_true", help="shape sample words after building (needs uharfbuzz)")
    args = ap.parse_args()
    out = Path(args.out)
    out.mkdir(parents=True, exist_ok=True)
    lys = yaml.safe_load((SCRIPTS / "lysrit.yaml").read_text(encoding="utf-8"))
    run = yaml.safe_load((SCRIPTS / "runar.yaml").read_text(encoding="utf-8"))
    if not args.no_check:
        check_against_js(lys, run)
    lp, ln, lliga = build_lysrit(lys, out)
    print(f"built {lp.relative_to(ROOT) if lp.is_relative_to(ROOT) else lp}: {ln} glyphs, {lliga} ligatures")
    rp, rn = build_runar(run, out, "long")
    print(f"built {rp.name}: {rn} glyphs")
    tp, tn = build_runar(run, out, "short")
    print(f"built {tp.name}: {tn} glyphs")
    if args.test:
        shape_test({"lysrit": lp, "runar": rp})


if __name__ == "__main__":
    main()
