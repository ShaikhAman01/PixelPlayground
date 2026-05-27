export const FloatingBlobs =
  () => {
    return (
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        {/* Blob 1 */}
        <div className="absolute left-[-120px] top-[-80px] h-[320px] w-[320px] rounded-full bg-violet-300/40 blur-3xl" />

        {/* Blob 2 */}
        <div className="absolute bottom-[-120px] right-[-80px] h-[280px] w-[280px] rounded-full bg-sky-300/40 blur-3xl" />

        {/* Blob 3 */}
        <div className="absolute left-[40%] top-[20%] h-[180px] w-[180px] rounded-full bg-pink-200/30 blur-3xl" />
      </div>
    );
  };