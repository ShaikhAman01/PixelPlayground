"use client";

import { useEffect, useRef } from "react";
import manifest from "@/data/sceneManifest.json";
import { useTheme } from "@/components/providers/ThemeProvider";
import { SteamCanvas } from "./SteamCanvas";

/**
 * The home-page painting, rebuilt as a living scene.
 *
 * scripts/build-scene-assets.py splits the artwork into a base image plus sprites
 * and writes their positions (in the painting's 1024x1536 pixel space) to
 * src/data/sceneManifest.json.
 *
 * Layout needs no JavaScript: the "stage" element reproduces `background-size:
 * cover` with min-width/min-height + aspect-ratio, and every sprite sits inside
 * it at percentage coordinates, so the whole scene is in the server HTML and
 * stays glued to the artwork at any viewport. Day and night are two separate
 * paintings with two sprite sets, switched by `.dark`, never a filter.
 *
 * Only things that travel across the artwork are cut out of the base. Stars are
 * drawn on top of themselves and just brighten, and the drifting clouds are new
 * sprites, so the sky never shows a hole where something used to be.
 *
 * Motion is CSS transform/opacity everywhere except the steam canvas.
 */
const IMG_W = manifest.image.w;
const IMG_H = manifest.image.h;
const THEMES = ["light", "dark"] as const;
const themed = (t: "light" | "dark") => (t === "light" ? "dark:hidden" : "hidden dark:block");


const PETALS = [
  { src: 0, dx: 8, dur: 46, delay: -12, sway: 26, fall: 170, spin: 3.1 },
  { src: 0, dx: 40, dur: 58, delay: -33, sway: -34, fall: 160, spin: 4.2 },
  { src: 0, dx: 22, dur: 41, delay: -5, sway: 18, fall: 175, spin: 2.6 },
  { src: 1, dx: 4, dur: 52, delay: -21, sway: 30, fall: 165, spin: 3.7 },
  { src: 0, dx: 55, dur: 64, delay: -44, sway: -22, fall: 168, spin: 2.9 },
  { src: 1, dx: 14, dur: 49, delay: -27, sway: 24, fall: 172, spin: 3.4 }
];

const FIREFLIES = [
  { x: 40, y: 430, dur: 14, delay: -3 },
  { x: 118, y: 452, dur: 17, delay: -9 },
  { x: 950, y: 436, dur: 15, delay: -6 },
  { x: 984, y: 468, dur: 19, delay: -13 }
];


// Painting pixels -> percentages of the stage
const X = (v: number) => `${(v / IMG_W) * 100}%`;
const Y = (v: number) => `${(v / IMG_H) * 100}%`;
const box = (x: number, y: number, w: number, h: number) => ({ left: X(x), top: Y(y), width: X(w), height: Y(h) });
// v painting pixels as a length; --u is one painting pixel, set on the stage below
const u = (v: number) => `calc(var(--u, 1.4px) * ${v})`;
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
        <img key={t} src={`/scene/${t}/${file}`} alt="" draggable={false} className={`${className ?? ""} ${themed(t)}`} style={style} />
      ))}
    </>
  );
}

export function LivingScene() {
  const stageRef = useRef<HTMLDivElement>(null);
  useStageUnit(stageRef);
  const { theme } = useTheme();

  const cat = manifest.cat;
  const steam = manifest.steam;

  return (
    <div aria-hidden className="scene absolute inset-0 overflow-hidden pointer-events-none">
      <div ref={stageRef} className="scene-stage">
        {/* ---------- GROUND: the painting, the water, and everything resting on it ---------- */}
        <div className="scene-layer">
          <div className="scene-base" />

          {/* Atmospheric haze over the far shore, barely there */}
          <div className="sc-haze absolute" style={box(0, 222, IMG_W, 130)} />

          {/* Lanterns are lit at night only. Both the flame and its halo are soft
              radials, so nothing shows an edge when they flicker. */}
          {manifest.lanterns.map((l, i) => (
            <div key={`lantern-${i}`} className="hidden dark:block">
              <div className="sc-lantern-halo absolute" style={{ ...box(l.flame.x - l.halo, l.flame.y - l.halo, l.halo * 2, l.halo * 2), animationDelay: `${i * 2.4}s` }} />
              <div className="sc-lantern-flame absolute" style={{ ...box(l.flame.x - l.r, l.flame.y - l.r, l.r * 2, l.r * 2), animationDelay: `${i * 2.4}s` }} />
            </div>
          ))}

          {/* Plants: each leaf/flower cluster bends from its own stem base */}
          {manifest.plants.map((p, i) => {
            const o = origin(p, p.ax, p.ay);
            return (
              <div
                key={`plant-${p.id}`}
                className="sc-gust absolute"
                style={{ ...box(p.x, p.y, p.w, p.h), transformOrigin: o, animationDuration: `${23 + ((i * 5) % 7)}s`, animationDelay: `${-((i * 6.3) % 23)}s` }}
              >
                <Sprite file={`plant-${p.id}.png`} className="sc-sway block w-full h-full" style={{ transformOrigin: o, animationDuration: `${5.5 + ((i * 1.3) % 3)}s`, animationDelay: `${-((i * 2.1) % 6)}s` }} />
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
          <div className="absolute" style={box(cat["cat-ear"].x + 12, cat["cat-ear"].y - 16, 40, 30)}>
            {[0, 1.3, 2.6].map((delay, i) => (
              <span
                key={`zzz-${i}`}
                className="sc-zzz pixel-font absolute bottom-0 left-0 text-white/90 dark:text-violet-100/90"
                style={{ fontSize: u(9), lineHeight: 1, textShadow: `0 0 ${u(3)} rgba(255,255,255,0.6)`, animationDelay: `${delay}s` }}
              >
                z
              </span>
            ))}
          </div>

          {/* Night only: a few fireflies low among the plants */}
          {FIREFLIES.map((f, i) => (
            <span
              key={`fly-${i}`}
              className="sc-firefly absolute rounded-full hidden dark:block"
              style={{ ...box(f.x, f.y, 2.2, 2.2), animationDuration: `${f.dur}s`, animationDelay: `${f.delay}s`, boxShadow: `0 0 ${u(3)} ${u(1)} rgba(255,200,110,0.55)` }}
            />
          ))}
        </div>

        {/* ---------- SKY: painted stars brighten in place, built clouds drift ---------- */}
        <div className="scene-layer">
          {THEMES.map((t) =>
            manifest.stars[t].map((s) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={`star-${t}-${s.id}`}
                src={`/scene/${t}/star-${s.id}.png`}
                alt=""
                draggable={false}
                className={`${s.id % 4 === 1 ? "sc-star-flash" : "sc-star"} absolute ${themed(t)}`}
                style={{ ...box(s.x, s.y, s.w, s.h), animationDuration: `${3.2 + ((s.id * 1.7) % 4.5)}s`, animationDelay: `${-((s.id * 1.31) % 6)}s` }}
              />
            ))
          )}
          {manifest.clouds.map((c) => (
            <Sprite
              key={`cloud-${c.id}`}
              file={`cloud-${c.id}.png`}
              className="sc-cloud absolute"
              style={{
                ...box(-c.w, c.y, c.w, c.h),
                ["--run" as string]: u(IMG_W + c.w),
                ["--op-light" as string]: c.light,
                ["--op-dark" as string]: c.dark,
                animationDuration: `${c.dur}s`,
                animationDelay: `${-c.phase * c.dur}s`
              }}
            />
          ))}
        </div>

        {/* ---------- PETALS: an occasional petal lets go of the flowers and drifts down ---------- */}
        <div className="scene-layer">
          {PETALS.map((p, i) => {
            const srcPt = manifest.petalSources[p.src];
            return (
              <span
                key={`petal-${i}`}
                className="sc-petal absolute"
                style={{ ...box(srcPt.x + p.dx, srcPt.y, 4, 4), ["--sway" as string]: u(p.sway), ["--fall" as string]: u(p.fall), animationDuration: `${p.dur}s`, animationDelay: `${p.delay}s` }}
              >
                <span className="sc-petal-spin block w-full h-full" style={{ backgroundImage: `url(/scene/light/petal-${i % 3}.png)`, animationDuration: `${p.spin}s` }} />
              </span>
            );
          })}
        </div>
      </div>

      {/* ---------- A faint pool of light behind the glass card (page space, not painting space) ---------- */}
      <div className="sc-hero-light absolute left-1/2 top-[380px] w-[760px] h-[420px] rounded-full" />
    </div>
  );
}
