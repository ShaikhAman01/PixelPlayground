"use client";

import { useEffect, useRef } from "react";
import manifest from "@/data/gameSceneManifest.json";
import { useTheme } from "@/components/providers/ThemeProvider";
import { SteamCanvas } from "./SteamCanvas";

/**
 * The game-page painting, rebuilt as a living scene.
 *
 * Same idea as LivingScene, trimmed for a page you are trying to concentrate on:
 * the cat breathes, its ear twitches, the potted plant leans, the lantern
 * flickers, the mug steams and the occasional petal comes down. No lake and no
 * clouds. Water movement reads as almost nothing even on the home page, and a
 * drifting sky behind a game board is just something pulling at the eye.
 *
 * scripts/build-game-scene-assets.py cuts the layers and writes their positions
 * in the painting's 1672x941 pixel space to src/data/gameSceneManifest.json.
 *
 * Layout needs no JavaScript: the stage reproduces `background-size: cover;
 * background-position: center` with min-width/min-height + aspect-ratio, so the
 * whole scene is in the server HTML and stays glued to the artwork at any
 * viewport.
 */
const IMG_W = manifest.image.w;
const IMG_H = manifest.image.h;
const THEMES = ["light", "dark"] as const;
const themed = (t: "light" | "dark") => (t === "light" ? "dark:hidden" : "hidden dark:block");

// Petals let go of the blossoms and drift to the boards. Long, out-of-step
// durations so two never fall together.
const PETALS = [
  { src: 0, dx: 6, dur: 47, delay: -11, sway: -30, fall: 300, spin: 3.2 },
  { src: 1, dx: 18, dur: 61, delay: -34, sway: 24, fall: 285, spin: 4.1 },
  { src: 2, dx: -8, dur: 53, delay: -22, sway: -20, fall: 268, spin: 2.7 },
  { src: 3, dx: 12, dur: 44, delay: -6, sway: 28, fall: 292, spin: 3.6 },
  { src: 4, dx: 4, dur: 66, delay: -47, sway: 22, fall: 246, spin: 3.0 },
  { src: 5, dx: 14, dur: 57, delay: -29, sway: -26, fall: 186, spin: 4.4 },
  { src: 6, dx: -6, dur: 50, delay: -16, sway: 18, fall: 258, spin: 2.9 }
];

// Painting pixels -> percentages of the stage
const X = (v: number) => `${(v / IMG_W) * 100}%`;
const Y = (v: number) => `${(v / IMG_H) * 100}%`;
const box = (x: number, y: number, w: number, h: number) => ({ left: X(x), top: Y(y), width: X(w), height: Y(h) });
// v painting pixels as a length; --u is one painting pixel, set on the stage below
const u = (v: number) => `calc(var(--u, 1.08px) * ${v})`;
const origin = (part: { x: number; y: number; w: number; h: number }, px: number, py: number) =>
  `${((px - part.x) / part.w) * 100}% ${((py - part.y) / part.h) * 100}%`;

// Positions and sizes are percentages and need no script; --u only feeds the few
// motion amplitudes that have to be expressed as a length.
function useStageUnit(ref: React.RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const apply = () => el.style.setProperty("--u", `${el.getBoundingClientRect().width / IMG_W}px`);
    apply();
    const ro = new ResizeObserver(apply);
    ro.observe(el);
    return () => ro.disconnect();
  }, [ref]);
}

function Sprite({ file, className, style }: { file: string; className?: string; style?: React.CSSProperties }) {
  return (
    <>
      {THEMES.map((t) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img key={t} src={`/scene-game/${t}/${file}`} alt="" draggable={false} className={`${className ?? ""} ${themed(t)}`} style={style} />
      ))}
    </>
  );
}

export function GameScene() {
  const stageRef = useRef<HTMLDivElement>(null);
  useStageUnit(stageRef);
  const { theme } = useTheme();

  const cat = manifest.cat;
  const steam = manifest.steam;

  return (
    <div aria-hidden className="scene absolute inset-0 overflow-hidden pointer-events-none">
      <div ref={stageRef} className="scene-stage-game">
        <div className="scene-layer">
          <div className="scene-base-game" />

          {/* Lanterns are lit at night only. Both the flame and its halo are soft
              radials, so nothing shows an edge when they flicker. */}
          {manifest.lanterns.map((l, i) => (
            <div key={`lantern-${i}`} className="hidden dark:block">
              <div className="sc-lantern-halo absolute" style={{ ...box(l.flame.x - l.halo, l.flame.y - l.halo, l.halo * 2, l.halo * 2), animationDelay: `${i * 2.4}s` }} />
              <div className="sc-lantern-flame absolute" style={{ ...box(l.flame.x - l.r, l.flame.y - l.r, l.r * 2, l.r * 2), animationDelay: `${i * 2.4}s` }} />
            </div>
          ))}

          {/* Plants: each cluster bends from its own stem base */}
          {manifest.plants.map((p, i) => {
            const o = origin(p, p.ax, p.ay);
            return (
              <div
                key={`plant-${p.id}`}
                className="sc-gust absolute"
                style={{ ...box(p.x, p.y, p.w, p.h), transformOrigin: o, animationDuration: `${27 + ((i * 5) % 7)}s`, animationDelay: `${-((i * 6.3) % 23)}s` }}
              >
                <Sprite file={`plant-${p.id}.png`} className="sc-sway block w-full h-full" style={{ transformOrigin: o, animationDuration: `${6 + ((i * 1.3) % 3)}s`, animationDelay: `${-((i * 2.1) % 6)}s` }} />
              </div>
            );
          })}

          {/* Steam: a particle plume, simulated on its own small canvas */}
          <SteamCanvas w={steam.w} h={steam.h} theme={theme} style={box(steam.x - steam.w / 2, steam.y - steam.h, steam.w, steam.h)} />

          {/* The cat: the whole animal breathes from the paws; the ear is drawn a
              second time on top so its twitch never opens a hole underneath. */}
          <Sprite file="cat.png" className="sc-breathe absolute" style={box(cat.cat.x, cat.cat.y, cat.cat.w, cat.cat.h)} />
          <Sprite
            file="cat-ear.png"
            className="sc-ear absolute"
            style={{ ...box(cat["cat-ear"].x, cat["cat-ear"].y, cat["cat-ear"].w, cat["cat-ear"].h), transformOrigin: origin(cat["cat-ear"], cat.earPivot.x, cat.earPivot.y) }}
          />
          <div className="absolute" style={box(cat["cat-ear"].x + 10, cat["cat-ear"].y - 26, 40, 30)}>
            {[0, 1.3, 2.6].map((delay, i) => (
              <span
                key={`zzz-${i}`}
                className="sc-zzz pixel-font absolute bottom-0 left-0 text-white/90 dark:text-violet-100/90"
                style={{ fontSize: u(11), lineHeight: 1, textShadow: `0 0 ${u(3)} rgba(255,255,255,0.6)`, animationDelay: `${delay}s` }}
              >
                z
              </span>
            ))}
          </div>
        </div>

        {/* ---------- PETALS: an occasional petal lets go and drifts down ---------- */}
        <div className="scene-layer">
          {PETALS.map((p, i) => {
            const srcPt = manifest.petalSources[p.src];
            return (
              <span
                key={`petal-${i}`}
                className="sc-petal absolute"
                style={{ ...box(srcPt.x + p.dx, srcPt.y, 5, 5), ["--sway" as string]: u(p.sway), ["--fall" as string]: u(p.fall), animationDuration: `${p.dur}s`, animationDelay: `${p.delay}s` }}
              >
                <span className="sc-petal-spin block w-full h-full" style={{ backgroundImage: `url(/scene-game/light/petal-${i % 3}.png)`, animationDuration: `${p.spin}s` }} />
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}
