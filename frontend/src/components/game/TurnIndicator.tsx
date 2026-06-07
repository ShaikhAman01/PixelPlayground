interface Props {
  currentTurn: string;
}

export const TurnIndicator = ({ currentTurn }: Props) => {
  return (
    <div className="shell-title-panel mb-8 inline-flex items-center gap-4 rounded-full border border-white/60 bg-white/70 px-6 py-4 shadow-lg backdrop-blur-xl transition-all duration-300 dark:border-white/10 dark:bg-slate-900/60 dark:shadow-[0_10px_30px_rgba(0,0,0,0.3)]">
      <div
        className={`h-3 w-3 rounded-full ${
          currentTurn === "X"
            ? "bg-pink-400 dark:bg-pink-500"
            : "bg-sky-400 dark:bg-sky-500"
        }`}
      />

      <p className="text-title font-medium text-slate-700 transition-colors duration-300 dark:text-slate-200">
        {currentTurn}&apos;s turn
      </p>
    </div>
  );
};