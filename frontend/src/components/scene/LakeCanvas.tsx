"use client";

import { useEffect, useRef } from "react";

/**
 * The lake.
 *
 * The plate is a copy of the painting's own water, drawn back over the identical
 * pixels underneath, so at rest it is invisible and only the movement reads. Each
 * row is displaced by the sum of two slow sine waves with mismatched periods, so
 * the painted reflections wander and never repeat visibly; near rows move more
 * than far ones. On top of that a band over the light reflection brightens and
 * fades, which is the shimmer.
 *
 * Renders at 2x the painting resolution for smooth sub-pixel displacement, ~30fps,
 * only while on screen and the tab is visible, and a single static frame under
 * prefers-reduced-motion.
 */
interface Props {
  src: string;
  w: number;               // plate size in painting pixels
  h: number;
  skipLeftBelow: number;   // from this row down, leave the first `skipLeftX` px alone (the pillow)
  skipLeftX: number;
  reflection: { x: number; w: number };
  style?: React.CSSProperties;
}

const SS = 2; // supersample factor

export function LakeCanvas({ src, w, h, skipLeftBelow, skipLeftX, reflection, style }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.width = w * SS;
    canvas.height = h * SS;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const img = new Image();
    img.src = src;

    // Per-row wave parameters. Amplitudes grow toward the near shore; the two
    // frequencies are deliberately incommensurate so the surface never ticks.
    const rows = Array.from({ length: h }, (_, r) => {
      const d = r / h;
      return {
        a1: 0.7 + 2.1 * d * d,
        a2: 0.35 + 0.9 * d,
        f1: 0.33 + 0.09 * Math.sin(r * 0.41),
        f2: 0.19 + 0.05 * Math.cos(r * 0.23),
        p1: r * 0.33,
        p2: r * 0.11 + 1.7
      };
    });

    let raf = 0;
    let last = 0;
    let active = false;
    let visible = true;

    const draw = (t: number) => {
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";
      ctx.clearRect(0, 0, w * SS, h * SS);
      for (let r = 0; r < h; r++) {
        const p = rows[r];
        const dx = p.a1 * Math.sin(t * p.f1 + p.p1) + p.a2 * Math.sin(t * p.f2 + p.p2);
        const x0 = r >= skipLeftBelow ? skipLeftX : 0;
        ctx.drawImage(img, x0, r, w - x0, 1, (x0 + dx) * SS, r * SS, (w - x0) * SS, SS);
      }
      // Shimmer: patches of the reflection column brighten and fade out of step.
      ctx.globalCompositeOperation = "lighter";
      for (let r = 0; r < h; r += 2) {
        const a = 0.05 + 0.055 * Math.sin(t * 0.7 + r * 0.5) + 0.035 * Math.sin(t * 1.3 + r * 0.19);
        if (a <= 0.006) continue;
        ctx.globalAlpha = a;
        const sx = 1.6 * Math.sin(t * 0.45 + r * 0.31);
        ctx.drawImage(img, reflection.x, r, reflection.w, 2, (reflection.x + sx) * SS, r * SS, reflection.w * SS, 2 * SS);
      }
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";
    };

    const loop = (now: number) => {
      if (!active) return;
      if (now - last > 33) {
        last = now;
        draw(now / 1000);
      }
      raf = requestAnimationFrame(loop);
    };

    const start = () => {
      if (active || reduce || !img.complete) return;
      active = true;
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

    img.onload = () => {
      draw(0);
      sync();
    };
    document.addEventListener("visibilitychange", sync);
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sync();
    });
    io.observe(canvas);

    return () => {
      stop();
      document.removeEventListener("visibilitychange", sync);
      io.disconnect();
    };
  }, [src, w, h, skipLeftBelow, skipLeftX, reflection.x, reflection.w]);

  return <canvas ref={ref} className="absolute" style={style} />;
}
