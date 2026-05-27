export const RoomBackground =
  () => {
    return (
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        {/* Glow */}
        <div className="absolute left-[-100px] top-[10%] h-[300px] w-[300px] rounded-full bg-violet-200/40 blur-3xl" />

        <div className="absolute bottom-[-120px] right-[-60px] h-[260px] w-[260px] rounded-full bg-sky-200/40 blur-3xl" />

        {/* Floating dots */}
        {Array.from({
          length: 20,
        }).map((_, i) => (
          <div
            key={i}
            className="absolute h-2 w-2 rounded-full bg-white/40"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>
    );
  };