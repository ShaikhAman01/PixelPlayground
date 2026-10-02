import Image from "next/image";

const PAW_COLORS = ["text-violet-400", "text-teal-400", "text-amber-400"];

const Paw = ({ className = "", delay }: { className?: string; delay: number }) => (
  <svg
    viewBox="0 0 11 10"
    shapeRendering="crispEdges"
    fill="currentColor"
    className={`pp-paw ${className}`}
    style={{ animationDelay: `${delay}ms` }}
  >
    <rect x="0" y="3" width="2" height="2" />
    <rect x="3" y="0" width="2" height="3" />
    <rect x="6" y="0" width="2" height="3" />
    <rect x="9" y="3" width="2" height="2" />
    <rect x="3" y="5" width="5" height="5" />
    <rect x="2" y="6" width="7" height="3" />
  </svg>
);

export const PawTrail = ({ size = "h-3 w-3" }: { size?: string }) => (
  <span aria-hidden="true" className="inline-flex items-center gap-1.5">
    {PAW_COLORS.map((color, i) => (
      <Paw key={color} className={`${size} ${color}`} delay={i * 220} />
    ))}
  </span>
);

export const CatCard = ({ label, large = false }: { label: string; large?: boolean }) => (
  <div className="flex flex-col items-center">
    <div className={`pp-cat-peek relative z-10 ${large ? "-mb-[38px]" : "-mb-[26px]"}`}>
      <Image src="/hero/cat.webp" alt="" width={110} height={110} loading="eager" className={`object-contain ${large ? "h-[128px] w-[128px]" : "h-[88px] w-[88px]"}`} />
    </div>
    <div className={`flex flex-col items-center rounded-2xl border border-slate-200/80 bg-white/75 backdrop-blur-md dark:border-white/10 dark:bg-slate-900/75 ${large ? "gap-3.5 px-10 pb-6 pt-9" : "gap-2.5 px-7 pb-4 pt-6"}`}>
      <PawTrail size={large ? "h-5 w-5" : "h-3.5 w-3.5"} />
      <p className={`pixel-font uppercase tracking-widest text-slate-600 dark:text-slate-300 ${large ? "text-sm" : "text-xs"}`}>{label}</p>
    </div>
  </div>
);

export const CatLoader = ({ label = "Loading game" }: { label?: string }) => (
  <div role="status" aria-live="polite" className="flex min-h-[320px] w-full items-center justify-center">
    <CatCard label={label} />
  </div>
);
