export const AppBackground =
  () => {
    return (
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        {/* Glow 1 */}
        <div className="absolute left-[-10%] top-[-10%] h-[400px] w-[400px] rounded-full bg-violet-500/20 blur-3xl" />

        {/* Glow 2 */}
        <div className="absolute bottom-[-10%] right-[-10%] h-[400px] w-[400px] rounded-full bg-cyan-500/10 blur-3xl" />

        {/* Tiny Stars */}
        <div className="absolute inset-0 opacity-20">
          {Array.from({
            length: 40,
          }).map((_, i) => (
            <div
              key={i}
              className="absolute h-1 w-1 rounded-full bg-white"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }}
            />
          ))}
        </div>
      </div>
    );
  };