"use client";

import { useEffect, useRef } from "react";

/**
 * Steam rising off the drink.
 *
 * Sprite wisps could only ever look like sprites sliding upward, so this is a
 * small particle plume instead. Soft round puffs are born at the rim, rise with
 * buoyancy that eases off as they cool, get carried sideways by a smooth
 * two-frequency drift field that varies with height and time (so the column
 * snakes coherently instead of each puff wobbling on its own), swell as they
 * diffuse, and fade out. They are drawn additively at very low alpha, so dozens
 * of overlapping puffs accumulate into a continuous, always-changing plume.
 *
 * Every size below is a fraction of the plume's own width, not a pixel count.
 * The two paintings are 1024 and 1672 pixels across, so a puff radius fixed in
 * painting pixels comes out proportionally smaller on the wider one, and the
 * plume thins into separate hard strands instead of reading as steam.
 *
 * Roughly 46 to 80 particles on a canvas of a few thousand pixels, 30fps, and
 * only while on screen and the tab is visible.
 */
interface Props {
  w: number;               // region size in painting pixels
  h: number;
  theme: "light" | "dark";
  style?: React.CSSProperties;
}

const SS = 2;              // canvas supersample
// Puffs per painting pixel of column height. Held constant so a taller plume is
// a longer column of the same steam, not the same handful of puffs stretched
// thinner: 46 over the home page's 62px is what this was tuned at.
const DENSITY = 46 / 62;

interface P {
  x0: number;
  age: number;
  life: number;
  seed: number;
  r0: number;
  rMax: number;
  amp: number;
  bright: number;
}

export function SteamCanvas({ w, h, theme, style }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const CW = Math.round(w * SS);
    const CH = Math.round(h * SS);
    canvas.width = CW;
    canvas.height = CH;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Deterministic: the plume looks the same on every load rather than popping differently.
    let s = 1337;
    const rnd = () => ((s = (s * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff);

    const spawn = (p: P, stagger: boolean) => {
      p.x0 = (rnd() - 0.5) * 0.070 * w;            // the column starts tight at the rim
      p.life = 2.6 + rnd() * 2.8;
      p.age = stagger ? rnd() * p.life : 0;
      p.seed = rnd() * Math.PI * 2;
      p.r0 = (0.024 + rnd() * 0.022) * w;
      p.rMax = (0.163 + rnd() * 0.141) * w;
      p.amp = 0.75 + rnd() * 0.6;                  // how much this puff wanders
      p.bright = 0.75 + rnd() * 0.5;
    };

    const n = Math.max(24, Math.min(96, Math.round(h * DENSITY)));
    const ps: P[] = Array.from({ length: n }, () => {
      const p = { x0: 0, age: 0, life: 1, seed: 0, r0: 1, rMax: 8, amp: 1, bright: 1 } as P;
      spawn(p, true);
      return p;
    });

    const cx = w / 2;
    const rim = h;                                  // bottom edge of the region = the drink surface
    const rise = h * 0.98;
    const ALPHA = theme === "dark" ? 0.060 : 0.058;
    // Additive pure white over a deep indigo sky reads as chimney smoke. At night
    // the steam takes the colour of the moonlight it is lit by.
    const TINT = theme === "dark" ? "202,214,255" : "255,255,255";

    const draw = (t: number, dt: number) => {
      ctx.clearRect(0, 0, CW, CH);
      ctx.globalCompositeOperation = "lighter";
      for (const p of ps) {
        p.age += dt;
        if (p.age >= p.life) spawn(p, false);
        const u = p.age / p.life;                   // 0 at the rim, 1 when spent
        const climb = Math.pow(u, 0.88);            // buoyant at first, easing as it cools
        const y = rim - rise * climb;
        const hh = climb;                           // normalised height, for the drift field
        // Two slow frequencies that vary with height: a coherent snaking column.
        const drift =
          (0.035 + 0.135 * hh) * w * Math.sin(hh * 3.1 + t * 0.85 + p.seed) +
          (0.015 + 0.057 * hh) * w * Math.sin(hh * 5.9 - t * 1.35 + p.seed * 2.3);
        const x = cx + p.x0 + drift * p.amp;
        const r = p.r0 + (p.rMax - p.r0) * Math.pow(u, 0.7);
        // fade in off the surface, fade out as it disperses, and thin with height
        const env = Math.pow(Math.sin(Math.PI * Math.min(1, u)), 1.25) * (1 - 0.42 * hh);
        const a = ALPHA * env * p.bright;
        if (a <= 0.0015) continue;

        const g = ctx.createRadialGradient(x * SS, y * SS, 0, x * SS, y * SS, r * SS);
        g.addColorStop(0, `rgba(${TINT},${a})`);
        g.addColorStop(0.45, `rgba(${TINT},${a * 0.5})`);
        g.addColorStop(1, `rgba(${TINT},0)`);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(x * SS, y * SS, r * SS, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalCompositeOperation = "source-over";
    };

    let raf = 0;
    let last = 0;
    let clock = 0;
    let active = false;
    let visible = true;

    const loop = (now: number) => {
      if (!active) return;
      if (now - last > 32) {
        const dt = Math.min(0.1, last ? (now - last) / 1000 : 0.033);
        last = now;
        clock += dt;
        draw(clock, dt);
      }
      raf = requestAnimationFrame(loop);
    };

    const start = () => {
      if (active || reduce) return;
      active = true;
      last = 0;
      raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      active = false;
      cancelAnimationFrame(raf);
    };
    const sync = () => {
      if (visible && !document.hidden) start();
      else stop();
    };

    if (reduce) {
      // one still frame, so the cup is not obviously "off"
      for (let i = 0; i < 40; i++) draw(1.2, 0.05);
    }
    document.addEventListener("visibilitychange", sync);
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      sync();
    });
    io.observe(canvas);

    return () => {
      stop();
      document.removeEventListener("visibilitychange", sync);
      io.disconnect();
    };
  }, [w, h, theme]);

  return <canvas ref={ref} className="absolute" style={style} />;
}
