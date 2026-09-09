"""Shared machinery for turning a painting into animatable layers.

Both scenes (the portrait home-page artwork and the landscape game-page
artwork) are cut up the same way, so the segmentation and compositing live
here and each build script only supplies the coordinates and colour tests that
are particular to its painting.

The one rule worth restating: masks are authored on the 1x painting because
that is the space the manifest and the CSS layout speak, but pixels always
come from the 2x upscale. Mixing those up silently doubles a sprite's on-screen
size, which is exactly the bug that made the home-page cat enormous.
"""
import collections
import random

from PIL import Image


# ------------------------------------------------------------ colour ---
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


# ---------------------------------------------------------- geometry ---
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


def kmeans(pts, k, iters=14, min_size=0):
    """Split a blob into k spatial clusters, dropping any that stay tiny.

    Used to break one contiguous mass of foliage into separate leaf clusters, so
    each can sway on its own stem instead of the whole bush moving as one.
    """
    cents = [pts[int(i * len(pts) / k)] for i in range(k)]
    groups = []
    for _ in range(iters):
        groups = [[] for _ in range(k)]
        for p in pts:
            j = min(range(k), key=lambda i: (p[0] - cents[i][0]) ** 2 + (p[1] - cents[i][1]) ** 2)
            groups[j].append(p)
        cents = [(sum(p[0] for p in g) / len(g), sum(p[1] for p in g) / len(g)) if g else cents[i]
                 for i, g in enumerate(groups)]
    return [g for g in groups if len(g) > min_size]


# ------------------------------------------------------------- edges ---
def edge_falloff(core2, steps):
    """Feather the outward edge at output resolution.

    The shape is decided on the 1x painting, but a 1x edge pixel upscaled becomes
    a flat SCALE-wide slab of half-transparent background colour, which at 2x
    reads as a chewed halo and hollows out the painting's dark outlines. Instead
    walk out from the shape one output pixel at a time and fade linearly, so the
    edge is a real sub-pixel feather.
    """
    out = {}
    frontier = core2
    seen = set(core2)
    for n in range(1, steps + 1):
        nxt = set()
        for x, y in frontier:
            for dy in (-1, 0, 1):
                for dx in (-1, 0, 1):
                    p = (x + dx, y + dy)
                    if p not in seen:
                        nxt.add(p)
        for p in nxt:
            seen.add(p)
            out[p] = 1.0 - n / (steps + 1.0)
        frontier = nxt
    return out


def cut_fade(sel, body, steps):
    """Alpha ramp that hides where a sprite was cut out of a larger shape.

    A part that moves on its own (the ear off the head) has two kinds of border:
    the animal's real silhouette, which should stay crisp, and the line where it
    was sliced off the rest of the body, which is not in the painting at all. Left
    at full alpha that slice is a straight edge that swings into view the moment
    the part rotates. Ramp the alpha to nothing across `steps` pixels inward from
    the slice only, and the part fades into the body it came from.

    Returns {point: 0..1} for every point of `sel`.
    """
    sel, body = set(sel), set(body)
    NB = ((1, 0), (-1, 0), (0, 1), (0, -1))
    frontier = [p for p in sel
                if any((p[0] + dx, p[1] + dy) in body and (p[0] + dx, p[1] + dy) not in sel
                       for dx, dy in NB)]
    out = {p: 0.0 for p in frontier}
    d = 0
    while frontier and d < steps:
        d += 1
        nxt = []
        for x, y in frontier:
            for dx, dy in NB:
                n = (x + dx, y + dy)
                if n in sel and n not in out:
                    out[n] = d / float(steps)
                    nxt.append(n)
        frontier = nxt
    return {p: out.get(p, 1.0) for p in sel}


def upscale_mask(pts, scale):
    """A 1x mask -> the equivalent set of output pixels."""
    out = set()
    for x, y in pts:
        for sy in range(scale):
            for sx in range(scale):
                out.add((x * scale + sx, y * scale + sy))
    return out


# --------------------------------------------------------- inpainting ---
def _fill_run(px, y, run, width):
    a, b = run[0] - 1, run[-1] + 1
    ca = px[a, y] if a >= 0 else None
    cb = px[b, y] if b < width else None
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


def fill_interp(px, pts, width):
    """Inpaint by interpolating across each masked run from the pixels on both
    sides of it. Smoother and less streaky than copying one neighbour. Operates
    at whatever resolution `px` is; `pts` must already match it."""
    rows = collections.defaultdict(list)
    for x, y in pts:
        if 0 <= x < width:
            rows[y].append(x)
    for y, xs in rows.items():
        xs.sort()
        run = [xs[0]]
        for x in xs[1:]:
            if x == run[-1] + 1:
                run.append(x)
            else:
                _fill_run(px, y, run, width)
                run = [x]
        _fill_run(px, y, run, width)


# -------------------------------------------------------------- paint ---
class Painting:
    """One theme's artwork, held at both resolutions.

    Everything you ask it for is addressed in 1x painting coordinates; what you
    get back is drawn from the 2x pixels.
    """

    def __init__(self, lo, hi, scale):
        want = (lo.width * scale, lo.height * scale)
        if hi.size != want:
            raise SystemExit("%dx source must be %dx%d, got %s" % (scale, want[0], want[1], hi.size))
        self.lo, self.hi, self.scale = lo, hi, scale
        self.W, self.H = lo.size
        self.lop, self.hip = lo.load(), hi.load()

    def upscale_mask(self, pts):
        return upscale_mask(pts, self.scale)

    def sprite_from(self, pts, alpha_fn=None, ring=0, keep2=None):
        """Cut pts (1x coordinates) out of the painting, emitting at scale.

        With ring=1 the edge travels with the sprite at partial alpha, so no halo
        is left behind on the base. The returned x/y stay in 1x space because the
        manifest is authored there.

        keep2 decides single output pixels in that edge ring. The shape is
        settled on the 1x painting, but upscaling put the artwork's dark outlines
        half in the ring, where a blanket fade hollows them out; asking the same
        colour test that drew the mask, at output resolution, keeps the line and
        drops only the background it sits against.
        """
        scale = self.scale
        core = set(pts)
        allpts = dilate(core, ring) if ring else core
        x0, y0, x1, y1 = bbox(allpts)
        sp = Image.new("RGBA", ((x1 - x0) * scale, (y1 - y0) * scale), (0, 0, 0, 0))
        src, dst = self.hip, sp.load()

        core2 = self.upscale_mask(core)
        fade = edge_falloff(core2, ring * scale) if ring else {}

        for x, y in allpts:
            if not (0 <= x < self.W and 0 <= y < self.H):
                continue
            a0 = 255 if alpha_fn is None else alpha_fn(x, y)
            if a0 <= 0:
                continue
            # one mask pixel covers a scale x scale block of real pixels
            for sy in range(scale):
                for sx in range(scale):
                    px, py = x * scale + sx, y * scale + sy
                    if (px, py) in core2 or (keep2 is not None and keep2(px, py)):
                        a = a0
                    else:
                        a = int(a0 * fade.get((px, py), 0.0))
                    if a > 0:
                        dst[(x - x0) * scale + sx, (y - y0) * scale + sy] = src[px, py] + (a,)
        return sp, x0, y0

    def base_with_holes(self, masks):
        """A copy of the 2x painting with each 1x mask interpolated away."""
        base = self.hi.copy()
        bp = base.load()
        for m in masks:
            fill_interp(bp, sorted(self.upscale_mask(m)), self.W * self.scale)
        return base
