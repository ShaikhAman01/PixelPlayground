#!/usr/bin/env python3
"""
Splits the game-page painting into animatable layers.

Input:  assets/background/bg2.webp + bg2@2x.webp   (day)
        assets/background/bg3.webp + bg3@2x.webp   (night)

NOTE: the app now loads these sprites as .webp. After running this script,
re-encode the .png sprites it writes to .webp or the scene will 404.

Output: public/scene-game/<theme>/base.webp     painting with the moving parts inpainted out
        public/scene-game/<theme>/cat.png       the cat as one solid sprite
        public/scene-game/<theme>/cat-ear.png   the ear again, on top, so it can twitch
        public/scene-game/<theme>/plant-N.png   leaf/blossom clusters that sway
        public/scene-game/<theme>/petal-N.png   the drifting petals
        src/data/gameSceneManifest.json

No lake and no clouds here: the water animation reads as barely-there even on the
home page, and behind a game board it would be pure distraction. The lantern glow
and the steam plume have no assets at all, they are drawn at runtime from the
coordinates recorded below.

Coordinates are authored on the 1x painting (1672x941) because that is the space
the manifest and the CSS layout speak. Pixels always come from the 2x upscale.

Run from frontend/:  python3 scripts/build-game-scene-assets.py
"""
import json
import os
import random
import statistics
import sys

from PIL import Image, ImageDraw

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from scene_lib import (  # noqa: E402
    Painting, bbox, close, components, cut_fade, dilate, fill_interp, hsv, kmeans,
    upscale_mask,
)

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
LO = {"light": "assets/background/bg2.webp", "dark": "assets/background/bg3.webp"}
HI = {"light": "assets/background/bg2@2x.webp", "dark": "assets/background/bg3@2x.webp"}
OUT = os.path.join(ROOT, "public", "scene-game")
W, H = 1672, 941
SCALE = 2
WEBP_Q = 94

random.seed(11)
for t in ("light", "dark"):
    d = os.path.join(OUT, t)
    os.makedirs(d, exist_ok=True)
    # Wipe first: a run that emits fewer clusters than the last one would
    # otherwise leave orphaned sprites behind for the page to load.
    for f in os.listdir(d):
        os.remove(os.path.join(d, f))

paint = {}
for t in ("light", "dark"):
    lo = Image.open(os.path.join(ROOT, LO[t])).convert("RGB")
    hi = Image.open(os.path.join(ROOT, HI[t])).convert("RGB")
    if lo.size != (W, H):
        raise SystemExit("%s must be %dx%d, got %s" % (LO[t], W, H, lo.size))
    paint[t] = Painting(lo, hi, SCALE)

THEMES = ("light", "dark")
day = paint["light"]
dp = day.lop          # 1x day pixels: every mask is decided here
dphi = day.hip        # 2x day pixels: edge decisions at output resolution

manifest = {"image": {"w": W, "h": H}, "assetScale": SCALE, "cat": {}, "plants": []}


def in_poly(poly, x0, y0, x1, y1):
    m = Image.new("L", (W, H), 0)
    ImageDraw.Draw(m).polygon(poly, fill=255)
    mp = m.load()
    return {(x, y) for y in range(y0, y1) for x in range(x0, x1) if mp[x, y]}


# ----------------------------------------------------------------- 1. cat ---
# The cat is curled on a round cushion at the right end of the deck. Everything
# around it is either the lavender water, the teal cushion or the purple boards,
# and none of those overlap the cat's own pale fur or its warm patches.
# The left edge stays tight: a sunlit rail runs behind the cat at y 775..805 and
# its warm highlight is the one background colour that reads like pale fur.
CAT_POLY = [(1256, 720), (1306, 714), (1316, 744), (1346, 746), (1354, 718), (1408, 716),
            (1420, 748), (1456, 752), (1492, 776), (1500, 812), (1486, 846), (1400, 854),
            (1300, 852), (1256, 846), (1250, 806), (1252, 752)]


def is_cat_background(c):
    """Water, deck and cushion, told apart from the cat by brightness as well as hue.

    Hue alone is not enough: the cat's brown patch falls in the same lavender band
    as the water once it is in shadow. The water is always near-white bright and
    the boards always dark, so value settles it.
    """
    h, s, v = hsv(c)
    if 236 <= h <= 288 and s > 0.30 and v > 0.80:
        return True                      # the lit water behind the cushion
    if 236 <= h <= 292 and s > 0.35 and v < 0.55:
        return True                      # the deck boards in shadow
    if 190 <= h <= 235 and s > 0.32:
        return True                      # the teal cushion under the cat
    return False


cat_inside = in_poly(CAT_POLY, 1230, 705, 1500, 862)
cat_raw = {p for p in cat_inside if not is_cat_background(dp[p])}
# Keep every sizeable piece, not just the biggest. The painted outlines around
# the paws and tail read as background, which cuts the animal into several blobs;
# taking only the largest silently dropped its feet.
blobs = [b for b in components(lambda x, y: (x, y) in cat_raw, 1230, 705, 1500, 862) if len(b) > 60]
if not blobs:
    raise SystemExit("cat segmentation found nothing")
cat_all = close({p for b in blobs for p in b}, 3) & cat_inside

# Anything fully enclosed by the cat is the cat: pale highlights on the muzzle
# read as water otherwise, and punch holes the inpainting shows through.
NB = ((1, 0), (-1, 0), (0, 1), (0, -1))
frontier = [p for p in cat_inside
            if p not in cat_all and any((p[0] + dx, p[1] + dy) not in cat_inside for dx, dy in NB)]
outside = set(frontier)
while frontier:
    x, y = frontier.pop()
    for dx, dy in NB:
        n = (x + dx, y + dy)
        if n in cat_inside and n not in cat_all and n not in outside:
            outside.add(n)
            frontier.append(n)
cat_all |= cat_inside - outside
cat_pts = sorted(cat_all)

# The near ear, drawn a second time on top so it can twitch without opening a
# hole in the head underneath. Where it is sliced off the skull the alpha ramps
# away, so the twitch shows an ear flicking rather than a rectangle turning.
ear_pts = [(x, y) for (x, y) in cat_pts if 1250 <= x <= 1308 and y <= 762]
ear_fade = cut_fade(ear_pts, cat_pts, 13)
if len(cat_pts) < 4000 or len(ear_pts) < 120:
    raise SystemExit("cat segmentation failed: body %d ear %d" % (len(cat_pts), len(ear_pts)))
print("cat px:", len(cat_pts), "ear", len(ear_pts), "bbox", bbox(cat_pts))

for t in THEMES:
    for name, pts in (("cat", cat_pts), ("cat-ear", ear_pts)):
        fade = ear_fade if name == "cat-ear" else None
        sp, sx, sy = paint[t].sprite_from(
            pts, ring=1, keep2=lambda px, py: not is_cat_background(dphi[px, py]),
            alpha_fn=None if fade is None else (lambda x, y: int(255 * fade.get((x, y), 1.0))))
        sp.save(os.path.join(OUT, t, "%s.png" % name), optimize=True)
        manifest["cat"][name] = {"x": sx, "y": sy, "w": sp.width // SCALE, "h": sp.height // SCALE}
manifest["cat"]["earPivot"] = {"x": 1292, "y": 764}


# -------------------------------------------------------------- 2. plants ---
# The foliage sits in shadow against a bright sky, so value separates it from the
# water far more reliably than hue does. The blossoms are the exception: they
# catch the sun, so they are picked up by their warm hue instead.
def is_plant(c):
    h, s, v = hsv(c)
    if 265 <= h <= 302 and s > 0.22 and v > 0.62:
        return True                      # lavender blossoms
    if (h >= 320 or h <= 20) and s > 0.28 and v > 0.62:
        return True                      # pink blossoms
    if 236 <= h <= 264 and s > 0.32:
        return False                     # the lit water behind the plant
    return v < 0.62


# Only the potted plant sways. The foliage on the left grows through the lantern,
# and any cut there either slices the lantern's glass into the sprite or leaves a
# straight edge that shows the moment the leaves move. Petals still fall from the
# left blossoms; that needs a spawn point, not a cut-out.
# The bottom edge stops just above the pot rim, which is the same lavender as the
# blossoms and cannot be told from them by colour.
PLANT_POLYS = [
    ([(1448, 534), (1672, 534), (1672, 734), (1500, 734), (1448, 686)], 3),
]

plant_pts_all = set()
pid = 0
for poly, k in PLANT_POLYS:
    x0, y0, x1, y1 = bbox(poly)
    inside = in_poly(poly, max(0, x0), max(0, y0), min(W, x1), min(H, y1))
    raw = sorted(p for p in inside if is_plant(dp[p]))
    if len(raw) < 400:
        raise SystemExit("plant polygon %s found only %d px" % (poly[0], len(raw)))
    for g in kmeans(raw, k, min_size=40):
        # Water sparkles inside the polygon pass the blossom test. They are
        # specks with nothing attached, so drop anything that is not joined to
        # the body of the cluster.
        gs = set(g)
        g = [p for c in components(lambda x, y: (x, y) in gs, *bbox(g)) if len(c) >= 25 for p in c]
        if len(g) < 200:
            continue
        g = sorted(close(set(g), 2))
        gx0, gy0, gx1, gy1 = bbox(g)
        plant_pts_all |= set(g)
        # sway pivot: the bottom-centre of the cluster, where a stem would be
        ax = (gx0 + gx1) // 2
        ay = gy1 - 1
        for t in THEMES:
            sp, sx, sy = paint[t].sprite_from(
                g, ring=1, keep2=lambda px, py: is_plant(dphi[px, py]))
            sp.save(os.path.join(OUT, t, "plant-%d.png" % pid), optimize=True)
        manifest["plants"].append({"id": pid, "x": sx, "y": sy,
                                   "w": sp.width // SCALE, "h": sp.height // SCALE,
                                   "ax": ax, "ay": ay})
        pid += 1
print("plants:", [(p["w"], p["h"]) for p in manifest["plants"]])


# ------------------------------------------------- 3. lantern, steam, petals ---
# No assets: both are drawn at runtime, so only their geometry is recorded. The
# lantern's flame and halo are soft radials, so nothing shows an edge as it
# flickers.
manifest["lanterns"] = [{"flame": {"x": 131, "y": 688}, "r": 34, "halo": 96}]

# The mug body spans x 390..455 (the handle is further right), so the plume is
# centred on 422 and leaves the drink at y 790.
manifest["steam"] = {"x": 424, "y": 790, "w": 62, "h": 104}

# Petals let go of the blossoms and drift down to the boards. These are the
# clusters they fall from.
manifest["petalSources"] = [{"x": 1570, "y": 567}, {"x": 1630, "y": 620}, {"x": 1623, "y": 663},
                            {"x": 1490, "y": 650}, {"x": 20, "y": 643}, {"x": 66, "y": 716},
                            {"x": 218, "y": 646}]

PETAL_PATTERN = [".XX.", "XXXX", "XXXX", ".XX."]
for i, (col, hi_) in enumerate((((228, 138, 182), (250, 190, 214)),
                                ((251, 173, 176), (255, 214, 214)),
                                ((137, 76, 182), (180, 130, 220)))):
    im = Image.new("RGBA", (4, 4), (0, 0, 0, 0))
    q = im.load()
    for y, row in enumerate(PETAL_PATTERN):
        for x, ch in enumerate(row):
            if ch == "X":
                q[x, y] = (hi_ if (x, y) in ((1, 1), (2, 0)) else col) + (255,)
    for t in THEMES:
        im.save(os.path.join(OUT, t, "petal-%d.png" % i))


# ---------------------------------------------------------------- 4. base ---
# Only what travels across the artwork is cut out.
#
# The painted plume is the exception. It is a hard-edged column and against the
# night sky it reads as chimney smoke rather than steam. Cutting it out is worse:
# its wisps are too fine to inpaint without leaving a patch where the sky had
# texture. So it is faded most of the way back to the sky behind it, leaving a
# hint for the particle plume to move on top of. Steam is the one thing in this
# corner less saturated than the sky, in both paintings, so that is what finds it.
STEAM_BOX = (394, 628, 478, 794)
STEAM_MARGIN = 0.08        # how much less saturated than its row a pixel must be
STEAM_FADE = 0.78          # how far towards the bare sky the painted plume goes


def steam_mask(pnt):
    """The plume, found by how much less saturated it is than the sky beside it.

    A fixed threshold cannot work: the sky brightens towards the sun, so any cut
    that catches the plume low down also swallows a slab of pale sky higher up.
    Comparing each pixel against the median of its own row, sampled wider than
    the plume so sky dominates the median, adapts to both paintings on its own.
    """
    x0, y0, x1, y1 = STEAM_BOX
    out = set()
    for y in range(y0, y1):
        med = statistics.median(hsv(pnt.lop[x, y])[1] for x in range(x0 - 46, x1 + 46))
        for x in range(x0, x1):
            if hsv(pnt.lop[x, y])[1] < med - STEAM_MARGIN:
                out.add((x, y))
    return out


for t in THEMES:
    base = paint[t].base_with_holes([dilate(cat_pts, 1), dilate(plant_pts_all, 1)])
    mask = close(steam_mask(paint[t]), 2)
    print("steam %s: %d px" % (t, len(mask)))
    # Inpaint a copy, then blend it back only where the plume is.
    clean = base.copy()
    fill_interp(clean.load(), sorted(upscale_mask(dilate(mask, 1), SCALE)), W * SCALE)
    bp, cp = base.load(), clean.load()
    for (px, py) in upscale_mask(mask, SCALE):
        a, b = bp[px, py], cp[px, py]
        bp[px, py] = tuple(round(a[i] + (b[i] - a[i]) * STEAM_FADE) for i in range(3))
    base.save(os.path.join(OUT, t, "base.webp"), quality=WEBP_Q, method=6)

out = json.dumps(manifest, indent=2) + "\n"
open(os.path.join(ROOT, "src", "data", "gameSceneManifest.json"), "w").write(out)
open(os.path.join(OUT, "manifest.json"), "w").write(out)
print("wrote", sum(len(os.listdir(os.path.join(OUT, t))) for t in THEMES), "assets")
