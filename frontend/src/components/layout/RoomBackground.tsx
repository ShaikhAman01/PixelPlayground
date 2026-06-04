"use client";

const DOTS = Array.from({ length: 20 }, (_, i) => ({
  top: `${(i * 37) % 100}%`,
  left: `${(i * 61) % 100}%`,
}));

export const RoomBackground = () => {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      <div className="absolute left-[-100px] top-[10%] h-[300px] w-[300px] rounded-full bg-violet-200/40 blur-3xl dark:bg-violet-950/20" />
      <div className="absolute bottom-[-120px] right-[-60px] h-[260px] w-[260px] rounded-full bg-sky-200/40 blur-3xl dark:bg-sky-950/10" />

      {DOTS.map((dot, i) => (
        <div
          key={i}
          className="absolute h-1.5 w-1.5 rounded-full bg-white/40 dark:bg-white/20"
          style={{
            top: dot.top,
            left: dot.left,
          }}
        />
      ))}
    </div>
  );
};