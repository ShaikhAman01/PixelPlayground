export const Logo = () => {
  return (
    <div className="flex items-center gap-3">
      {/* Pixel */}
      <div className="grid grid-cols-2 gap-0.5">
        <div className="h-3 w-3 rounded-sm bg-violet-400" />
        <div className="h-3 w-3 rounded-sm bg-cyan-400" />
        <div className="h-3 w-3 rounded-sm bg-pink-400" />
        <div className="h-3 w-3 rounded-sm bg-emerald-400" />
      </div>

      <h1 className="font-[family:var(--font-pixel)] text-2xl">
        PixelPlayground
      </h1>
    </div>
  );
};