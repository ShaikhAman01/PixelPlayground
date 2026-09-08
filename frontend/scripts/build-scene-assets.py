#!/usr/bin/env python3
"""
Splits the home-page painting into animatable layers.

Input:  public/background/bg-long2.png (day) and bg-long-dark2.png (night)
Output: public/scene/<theme>/base.png     the painting with only the moving parts inpainted out
        public/scene/<theme>/cat.png      the whole cat (ear included) as one solid sprite
        public/scene/<theme>/cat-ear.png  the ear again, drawn on top so it can twitch
        public/scene/<theme>/plant-N.png  leaf/flower clusters of the foreground plants
        public/scene/<theme>/star-N.png   painted sparkles, re-drawn on top to brighten
        public/scene/<theme>/cloud-N.png  hand-built pixel clouds in the painting's cloud palette
        public/scene/<theme>/lake.png     the water plate the canvas ripples
        public/scene/<theme>/steam.png    a 3-frame vertical strip of pixel wisps
        public/scene/manifest.json + src/data/sceneManifest.json

Design rules learned the hard way:
  * Only things that MOVE ACROSS the artwork are cut out of the base. Stars and
    clouds are not: stars are overlaid on top of themselves and just brighten,
    and the drifting clouds are new sprites, so the sky never shows a hole where
    something used to be.
  * Cut-outs are morphologically closed, so a sprite is one solid shape with no
    pinholes that would let the inpainted streaks underneath show through.
  * Holes are filled by interpolating across the gap from both sides, not by
    copying one neighbour, which used to leave visible streaks.

Run from frontend/:  python3 scripts/build-scene-assets.py
"""
import collections
import json
import math
import os
import random
import statistics

from PIL import Image, ImageDraw

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = {"light": "public/background/bg-long2.png", "dark": "public/background/bg-long-dark2.png"}
OUT = os.path.join(ROOT, "public", "scene")
W, H = 1024, 1536
SKY_H = 236

random.seed(7)
for t in ("light", "dark"):
    os.makedirs(os.path.join(OUT, t), exist_ok=True)


# ---------------------------------------------------------------- helpers ---
def l1(a, b):
    return abs(a[0] - b[0]) + abs(a[1] - b[1]) + abs(a[2] - b[2])


def lum(c):
    return 0.299 * c[0] + 0.587 * c[1] + 0.114 * c[2]


def hsv(c):
    r, g, b = [v / 255 for v in c]
    mx, mn = max(r, g, b), min(r, g, b)
    d = mx - mn
    if d == 0:
        h = 0
    elif mx == r:
        h = (60 * ((g - b) / d) + 360) % 360
    elif mx == g:
        h = 60 * ((b - r) / d) + 120
    else:
        h = 60 * ((r - g) / d) + 240
    return h, (0 if mx == 0 else d / mx), mx


def components(pred, x0, y0, x1, y1):
    seen = set()
    comps = []
    for y in range(y0, y1):
        for x in range(x0, x1):
            if (x, y) in seen or not pred(x, y):
                continue
            q = collections.deque([(x, y)])
            seen.add((x, y))
            pts = []
            while q:
                cx, cy = q.popleft()
                pts.append((cx, cy))
                for nx, ny in ((cx + 1, cy), (cx - 1, cy), (cx, cy + 1), (cx, cy - 1)):
                    if x0 <= nx < x1 and y0 <= ny < y1 and (nx, ny) not in seen and pred(nx, ny):
                        seen.add((nx, ny))
                        q.append((nx, ny))
            comps.append(pts)
    return comps


def bbox(pts):
    xs = [p[0] for p in pts]
    ys = [p[1] for p in pts]
    return min(xs), min(ys), max(xs) + 1, max(ys) + 1


def disc(r):
    return [(dx, dy) for dx in range(-r, r + 1) for dy in range(-r, r + 1) if dx * dx + dy * dy <= r * r]


def dilate(pts, r=1):
    if r <= 0:
        return set(pts)
    k = disc(r)
    out = set()
    for x, y in pts:
        for dx, dy in k:
            out.add((x + dx, y + dy))
    return out


def erode(pts, r=1):
    if r <= 0:
        return set(pts)
    s = set(pts)
    k = disc(r)
    return {p for p in s if all((p[0] + dx, p[1] + dy) in s for dx, dy in k)}


def close(pts, r=3):
    """Morphological closing: fills pinholes and hairline gaps so a cut-out is solid."""
    return erode(dilate(pts, r), r)


def sprite_from(img, pts, alpha_fn=None, ring=0):
    """Cut pts out of img. With ring=1 the one-pixel anti-aliased edge travels with
    the sprite at partial alpha, so no halo is left behind on the base."""
    core = set(pts)
    allpts = dilate(core, ring) if ring else core
    x0, y0, x1, y1 = bbox(allpts)
    sp = Image.new("RGBA", (x1 - x0, y1 - y0), (0, 0, 0, 0))
    src = img.load()
    dst = sp.load()
    for x, y in allpts:
        if 0 <= x < W and 0 <= y < H:
            a = 255 if alpha_fn is None else alpha_fn(x, y)
            if (x, y) not in core:
                a = min(a, 170)
            if a > 0:
                dst[x - x0, y - y0] = src[x, y] + (a,)
    return sp, x0, y0


def fill_interp(px, pts):
    """Inpaint by interpolating across each masked run from the pixels on both
    sides of it. Smoother and less streaky than copying one neighbour."""
    rows = collections.defaultdict(list)
    for x, y in pts:
        if 0 <= x < W and 0 <= y < H:
            rows[y].append(x)
    for y, xs in rows.items():
        xs.sort()
        run = [xs[0]]
        for x in xs[1:]:
            if x == run[-1] + 1:
                run.append(x)
            else:
                _fill_run(px, y, run)
                run = [x]
        _fill_run(px, y, run)


def _fill_run(px, y, run):
    a, b = run[0] - 1, run[-1] + 1
    ca = px[a, y] if a >= 0 else None
    cb = px[b, y] if b < W else None
    if ca is None and cb is None:
        return
    if ca is None:
        ca = cb
    if cb is None:
        cb = ca
    n = len(run) + 1
    for i, x in enumerate(run, start=1):
        t = i / n
        n_ = random.randint(-2, 2)
        px[x, y] = tuple(max(0, min(255, round(ca[c] + (cb[c] - ca[c]) * t) + n_)) for c in range(3))


# ---------------------------------------------------------------- sources ---
day = Image.open(os.path.join(ROOT, SRC["light"])).convert("RGB")
night = Image.open(os.path.join(ROOT, SRC["dark"])).convert("RGB")
THEMES = (("light", day), ("dark", night))
dp = day.load()

manifest = {
    "image": {"w": W, "h": H},
    "clouds": [],
    "stars": {"light": [], "dark": []},
    "plants": [],
    "cat": {},
    "lake": {},
    "steam": {},
    "lanterns": [],
    "petalSources": [],
}


def row_sky_of(img):
    p = img.load()
    return [tuple(int(statistics.median(p[x, y][i] for x in range(380, 644))) for i in range(3)) for y in range(SKY_H)]


row_sky = {"light": row_sky_of(day), "dark": row_sky_of(night)}

# ------------------------------------------------------- 1. star overlays ---
# Stars stay painted in the base; these sprites are drawn on top of themselves and
# fade in, so a "twinkle" is the painted star getting brighter. No holes anywhere.
STAR_MAX_Y = 190          # below this the sky meets the mountains; sparkles there stay static
for theme, img in THEMES:
    p = img.load()
    rs = row_sky[theme]
    thr = 205 if theme == "light" else 120
    max_n = 90 if theme == "light" else 600

    def is_star(x, y, p=p, rs=rs, thr=thr):
        c = p[x, y]
        return lum(c) > thr and lum(c) - lum(rs[y]) > 45

    k = 0
    for pts in components(is_star, 0, 0, W, SKY_H):
        if not (4 <= len(pts) <= max_n):
            continue
        d = dilate(pts, 2)
        x0, y0, x1, y1 = bbox(d)
        if x1 - x0 > 44 or y1 - y0 > 44:
            continue                                   # the moon
        if y1 > STAR_MAX_Y:
            continue                                   # sparkles sitting on the mountains

        def alpha(x, y, p=p, rs=rs):
            return max(0, min(255, int((lum(p[x, y]) - lum(rs[y])) * 255 / 60)))

        sp, sx, sy = sprite_from(img, d, alpha)
        sp.save(os.path.join(OUT, theme, f"star-{k}.png"), optimize=True)
        manifest["stars"][theme].append({"id": k, "x": sx, "y": sy, "w": sp.width, "h": sp.height})
        k += 1

# ----------------------------------------------------- 2. drifting clouds ---
# Built, not cut: the painted clouds stay where they are (distant clouds barely
# move anyway) and these few drift across, so nothing leaves a silhouette behind.
def cloud_depth_ramp(img, steps=26):
    """The painting's own top-to-bottom cloud gradient.

    Every painted cloud pixel is bucketed by how far it sits down its own cloud
    (0 = sunlit crown, 1 = shaded base) and the buckets are averaged. The result
    is the exact lighting the artist used, so a new cloud shaded along this ramp
    belongs to the same sky instead of looking like a separate pixel-art sticker."""
    p = img.load()
    rs = row_sky_of(img)
    thr = 40 if img is day else 26
    mask = [[False] * W for _ in range(SKY_H)]
    for y in range(SKY_H):
        for x in range(W):
            if l1(p[x, y], rs[y]) > thr:
                mask[y][x] = True
    # Each vertical run is one cloud's thickness at that column. Colours are
    # recorded together with their brightness RELATIVE to their own run: clouds
    # high in the sky and clouds near the horizon differ in overall brightness,
    # and averaging them raw flattens the shading to nothing.
    cols_b = [[] for _ in range(steps)]
    devs_b = [[] for _ in range(steps)]
    for x in range(W):
        col = [y for y in range(SKY_H) if mask[y][x]]
        if len(col) < 6:
            continue
        run = [col[0]]
        runs = []
        for y in col[1:]:
            if y == run[-1] + 1:
                run.append(y)
            else:
                runs.append(run)
                run = [y]
        runs.append(run)
        for r in runs:
            if len(r) < 5:
                continue
            mean_l = sum(lum(p[x, y]) for y in r) / len(r)
            for i, y in enumerate(r):
                b = min(steps - 1, int(i / (len(r) - 1) * steps))
                cols_b[b].append(p[x, y])
                devs_b[b].append(lum(p[x, y]) - mean_l)

    base = [tuple(int(statistics.median(c[i] for c in b)) for i in range(3)) if b else None for b in cols_b]
    dev = [statistics.median(d) if d else 0.0 for d in devs_b]
    filled = [c for c in base if c]
    mid = sum(lum(c) for c in filled) / len(filled)
    GAIN = 2.6                                # restores the within-cloud contrast
    # ...but a cloud never goes far darker than the sky it sits in, so clamp the
    # shaded end; without this the night clouds bottom out near black.
    lo_l, hi_l = mid * 0.74, mid * 1.42
    ramp = []
    last = filled[0]
    for c, dv in zip(base, dev):
        c = c or last
        last = c
        cur = max(1.0, lum(c))
        target = min(hi_l, max(lo_l, mid + dv * GAIN))
        k = target / cur
        ramp.append(tuple(max(0, min(255, int(round(v * k)))) for v in c))
    return ramp


# Silhouettes: a mass of overlapping lobes, the way the painted cumulus is built.
CLOUD_SHAPES = [
    # (w, h, [(cx, cy, r), ...]) in painting pixels
    (74, 30, [(20, 19, 10.0), (32, 13, 12.5), (48, 15, 11.0), (60, 19, 8.5), (26, 22, 8.0),
              (40, 22, 9.0), (53, 22, 7.5), (13, 22, 6.5), (66, 22, 5.5), (37, 10, 7.0)]),
    (52, 21, [(14, 13, 7.0), (24, 9, 8.8), (35, 11, 7.6), (44, 14, 6.0), (19, 15, 5.6),
              (30, 15, 6.2), (39, 16, 4.8), (9, 16, 4.4)]),
    (96, 38, [(24, 26, 12.5), (42, 17, 15.5), (63, 20, 13.0), (80, 25, 10.0), (33, 29, 9.5),
              (52, 29, 10.5), (71, 29, 8.5), (14, 29, 7.5), (88, 29, 6.0), (47, 12, 8.5)]),
    (64, 24, [(17, 16, 8.4), (28, 11, 10.2), (41, 13, 8.8), (52, 16, 6.8), (23, 18, 6.4),
              (35, 18, 7.2), (46, 18, 5.8), (11, 18, 5.0)]),
]


def build_cloud(shape, ramp, path):
    """Shade each pixel by blending how far down the whole cloud it sits with how
    far down its own lobe it sits, so every bump gets a rounded crown and shaded
    underside the way the painted clouds do. No dithering: the artwork is smooth."""
    w, h, discs = shape
    FEATHER = 2.6
    n = len(ramp)
    img = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    dst = img.load()

    cover = [[0.0] * w for _ in range(h)]
    lobe = [[0.0] * w for _ in range(h)]
    crease = [[0.0] * w for _ in range(h)]
    for y in range(h):
        for x in range(w):
            best = second = 0.0
            wsum = lsum = 0.0
            for cx, cy, r in discs:
                d = math.hypot(x - cx, y - cy)
                if d > r + FEATHER:
                    continue
                cval = min(1.0, (r + FEATHER - d) / FEATHER)
                if cval > best:
                    best, second = cval, best
                elif cval > second:
                    second = cval
                # 0 at this lobe's crown, 1 at its underside
                lt = min(1.0, max(0.0, (y - (cy - r)) / (2 * r)))
                wgt = cval ** 3
                wsum += wgt
                lsum += lt * wgt
            cover[y][x] = best
            lobe[y][x] = lsum / wsum if wsum > 0 else 0.5
            # where two lobes overlap at similar strength the surface folds inward
            crease[y][x] = (second / best) if best > 0.05 else 0.0

    top = [next((y for y in range(h) if cover[y][x] > 0.4), None) for x in range(w)]
    bot = [next((y for y in range(h - 1, -1, -1) if cover[y][x] > 0.4), None) for x in range(w)]

    for y in range(h):
        for x in range(w):
            c = cover[y][x]
            if c <= 0.04 or top[x] is None:
                continue
            thickness = max(3.0, (bot[x] - top[x]) + 1.0)
            glob = min(1.0, max(0.0, (y - top[x]) / thickness))
            t = 0.34 * glob + 0.66 * lobe[y][x]
            t += 0.20 * max(0.0, crease[y][x] - 0.62)      # shaded fold between bubbles
            if y - top[x] <= 1:
                t -= 0.16                                   # sunlit rim along the crown
            t = min(1.0, max(0.0, t))
            col = ramp[max(0, min(n - 1, int(round(t * (n - 1)))))]
            s = min(1.0, c / 0.8)
            a = int(255 * (s * s * (3 - 2 * s)))            # smoothstep rim
            if a > 3:
                dst[x, y] = col + (a,)
    img.save(path, optimize=True)


for theme, img in THEMES:
    ramp = cloud_depth_ramp(img)
    for i, shape in enumerate(CLOUD_SHAPES):
        build_cloud(shape, ramp, os.path.join(OUT, theme, f"cloud-{i}.png"))

CLOUD_LAYOUT = [
    {"id": 0, "y": 44, "w": 74, "h": 30, "dur": 250, "phase": 0.10, "light": 0.78, "dark": 0.8},
    {"id": 1, "y": 100, "w": 52, "h": 21, "dur": 190, "phase": 0.62, "light": 0.62, "dark": 0.68},
    {"id": 2, "y": 140, "w": 96, "h": 38, "dur": 320, "phase": 0.35, "light": 0.5, "dark": 0.58},
    {"id": 3, "y": 74, "w": 64, "h": 24, "dur": 225, "phase": 0.84, "light": 0.55, "dark": 0.6},
]
manifest["clouds"] = CLOUD_LAYOUT

# ----------------------------------------------------------------- 3. cat ---
CAT_POLY = [(786, 408), (803, 406), (812, 420), (822, 416), (846, 411), (852, 407), (860, 414), (880, 416),
            (903, 422), (916, 440), (921, 466), (919, 485), (900, 487), (830, 487), (782, 485), (767, 462),
            (768, 438), (778, 424)]
cat_mask_img = Image.new("L", (W, H), 0)
ImageDraw.Draw(cat_mask_img).polygon(CAT_POLY, fill=255)
cat_poly = cat_mask_img.load()
inside = {(x, y) for y in range(400, 492) for x in range(760, 928) if cat_poly[x, y]}


def is_cat_background(c):
    """Water (saturated lavender), cushion (teal) and deck (dark purple) around the cat."""
    h, s, v = hsv(c)
    if s > 0.3 and 222 <= h <= 264 and v > 0.45:
        return True
    if s > 0.5 and 195 <= h <= 228 and v > 0.25:
        return True
    if s > 0.35 and 280 <= h <= 300 and v < 0.52:
        return True
    return False


cat_raw = {p for p in inside if not is_cat_background(dp[p])}
blobs = components(lambda x, y: (x, y) in cat_raw, 760, 400, 928, 492)
blobs.sort(key=len, reverse=True)
cat_all = set(blobs[0])
# Close pinholes: pale highlights on the face used to be read as water, punching
# holes the inpainted streaks showed through.
cat_all = close(cat_all, 3) & inside
NB = ((1, 0), (-1, 0), (0, 1), (0, -1))
q = collections.deque(p for p in inside if p not in cat_all and any((p[0] + dx, p[1] + dy) not in inside for dx, dy in NB))
outside = set(q)
while q:
    x, y = q.popleft()
    for dx, dy in NB:
        n = (x + dx, y + dy)
        if n in inside and n not in cat_all and n not in outside:
            outside.add(n)
            q.append(n)
cat_all |= inside - outside - cat_all
cat_pts = sorted(cat_all)
# The ear is drawn twice: once inside the body sprite, once on top so it can twitch
# without opening a hole underneath.
ear_pts = [(x, y) for (x, y) in cat_pts if 782 <= x <= 804 and y <= 429]
if not cat_pts or not ear_pts:
    raise SystemExit("cat segmentation failed: body %d ear %d" % (len(cat_pts), len(ear_pts)))

for theme, img in THEMES:
    for name, pts in (("cat", cat_pts), ("cat-ear", ear_pts)):
        sp, sx, sy = sprite_from(img, pts, ring=1)
        sp.save(os.path.join(OUT, theme, f"{name}.png"), optimize=True)
        manifest["cat"][name] = {"x": sx, "y": sy, "w": sp.width, "h": sp.height}
manifest["cat"]["earPivot"] = {"x": 797, "y": 429}

# -------------------------------------------------------------- 4. plants ---
def is_foliage(x, y):
    h, s, v = hsv(dp[x, y])
    if 250 <= h <= 285 and s > 0.4 and v > 0.5:            # lavender pot
        return False
    if 212 <= h <= 258 and v > 0.5 and s < 0.75:           # sky / water
        return False
    if s < 0.12 and v > 0.7:                               # pale pot highlight
        return False
    return True


PLANT_POLYS = [
    ([(905, 332), (924, 318), (1023, 316), (1023, 450), (992, 452), (932, 452), (905, 424)], 4),
    ([(0, 296), (26, 300), (34, 330), (34, 432), (30, 472), (0, 474)], 2),
]


def kmeans(pts, k, iters=14):
    cents = [pts[int(i * len(pts) / k)] for i in range(k)]
    groups = []
    for _ in range(iters):
        groups = [[] for _ in range(k)]
        for p in pts:
            j = min(range(k), key=lambda i: (p[0] - cents[i][0]) ** 2 + (p[1] - cents[i][1]) ** 2)
            groups[j].append(p)
        cents = [(sum(p[0] for p in g) / len(g), sum(p[1] for p in g) / len(g)) if g else cents[i] for i, g in enumerate(groups)]
    return [g for g in groups if len(g) > 40]


plant_pts_all = set()
pid = 0
for poly, k in PLANT_POLYS:
    pm = Image.new("L", (W, H), 0)
    ImageDraw.Draw(pm).polygon(poly, fill=255)
    pp = pm.load()
    x0, y0, x1, y1 = bbox(poly)
    raw = {(x, y) for y in range(y0, y1) for x in range(x0, x1) if pp[x, y] and is_foliage(x, y)}
    pts = [p for blob in components(lambda x, y: (x, y) in raw, x0, y0, x1, y1) if len(blob) >= 24 for p in blob]
    for g in kmeans(pts, k):
        g = sorted(close(set(g), 2) & raw)
        plant_pts_all |= set(g)
        ax = sum(p[0] for p in g) / len(g)
        ay = max(p[1] for p in g)
        for theme, img in THEMES:
            sp, sx, sy = sprite_from(img, g, ring=1)
            sp.save(os.path.join(OUT, theme, f"plant-{pid}.png"), optimize=True)
        bx0, by0, bx1, by1 = bbox(dilate(g, 1))
        manifest["plants"].append({"id": pid, "x": bx0, "y": by0, "w": bx1 - bx0, "h": by1 - by0, "ax": round(ax), "ay": ay})
        pid += 1

# --------------------------------------------------------------- 5. steam ---
# A curling ribbon rather than a stack of blocks: the wisp follows an S-curve
# whose phase advances frame to frame, and thins and fades toward the top, so it
# looks like vapour breaking up instead of a shape sliding upward.
SW, SH, SN = 16, 34, 6
FEATHER = 1.8
strip = Image.new("RGBA", (SW, SH * SN), (0, 0, 0, 0))
sq = strip.load()
for f in range(SN):
    phase = 2 * math.pi * f / SN
    for y in range(SH):
        v = y / (SH - 1)                      # 0 at the rim, 1 at the top
        cx = (SW - 1) / 2 + math.sin(v * 3.4 + phase) * (1.0 + 3.4 * v)
        halfw = 1.9 * (1.0 + 0.5 * v)         # spreads as it rises
        strength = (1.0 - v) ** 1.5           # and thins away
        if v < 0.1:
            strength *= v / 0.1               # eases up off the surface of the drink
        for x in range(SW):
            d = abs(x - cx)
            if d > halfw + FEATHER:
                continue
            edge = 1.0 if d <= halfw else max(0.0, 1.0 - (d - halfw) / FEATHER)
            a = int(205 * strength * edge * edge)
            if a > 4:
                sq[x, f * SH + y] = (255, 255, 255, min(255, a))
for theme in ("light", "dark"):
    strip.save(os.path.join(OUT, theme, "steam.png"))
# The cup body spans x 219..268 in the painting (the handle is further right), so
# the steam column is centred on 244, rising off the drink surface at y 449.
manifest["steam"] = {"x": 244, "y": 449, "spread": 22, "frame": {"w": SW, "h": SH, "n": SN}}

# -------------------------------------------------------------- 6. petals ---
PETAL_PATTERN = [".XX.", "XXXX", "XXXX", ".XX."]
for i, (col, hi) in enumerate((((228, 138, 182), (250, 190, 214)), ((251, 173, 176), (255, 214, 214)), ((137, 76, 182), (180, 130, 220)))):
    im = Image.new("RGBA", (4, 4), (0, 0, 0, 0))
    q2 = im.load()
    for y, row in enumerate(PETAL_PATTERN):
        for x, ch in enumerate(row):
            if ch == "X":
                q2[x, y] = (hi if (x, y) in ((1, 1), (2, 0)) else col) + (255,)
    for theme in ("light", "dark"):
        im.save(os.path.join(OUT, theme, f"petal-{i}.png"))

# ---------------------------------------------------- 7. base + lake plate ---
LAKE = (120, 335, 905, 432)
# Painted sparkles that sit on the mountains rather than in the sky: they read as
# a stray glare rather than a star, so they are erased from the artwork.
ERASE = {"light": [((970, 271), 11)], "dark": []}

for theme, img in THEMES:
    base = img.copy()
    bp = base.load()
    for (cx, cy), r in ERASE[theme]:
        fill_interp(bp, sorted((cx + dx, cy + dy) for dx, dy in disc(r)))
    fill_interp(bp, sorted(dilate(cat_pts, 1)))
    fill_interp(bp, sorted(dilate(plant_pts_all, 1)))
    base.save(os.path.join(OUT, theme, "base.png"), optimize=True)
    # The lake plate is a copy, not a hole: the canvas draws it back over identical
    # pixels, so at rest it is invisible and only the displacement shows.
    img.crop(LAKE).save(os.path.join(OUT, theme, "lake.png"), optimize=True)

manifest["lake"] = {
    "x": LAKE[0], "y": LAKE[1], "w": LAKE[2] - LAKE[0], "h": LAKE[3] - LAKE[1],
    "skipLeftBelow": 402 - LAKE[1], "skipLeftX": 215 - LAKE[0],
    "reflection": {"x": 350, "w": 92},
}
manifest["lanterns"] = [
    {"flame": {"x": 77, "y": 381}, "r": 22, "halo": 88},
    {"flame": {"x": 914, "y": 1424}, "r": 18, "halo": 70},
]
manifest["petalSources"] = [{"x": 945, "y": 335, "w": 60}, {"x": 8, "y": 330, "w": 30}]

for path in (os.path.join(OUT, "manifest.json"), os.path.join(ROOT, "src", "data", "sceneManifest.json")):
    with open(path, "w") as f:
        json.dump(manifest, f, indent=1)

print("stars: light", len(manifest["stars"]["light"]), "dark", len(manifest["stars"]["dark"]))
print("  light star ys:", sorted(s["y"] for s in manifest["stars"]["light"]))
print("cat px:", len(cat_pts), "ear", len(ear_pts), "bbox", bbox(cat_pts))
print("plants:", [(p["w"], p["h"]) for p in manifest["plants"]])
print("clouds: 4 built shapes per theme")
