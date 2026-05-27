interface Props {
  currentTurn: string;
}

export const TurnIndicator = ({
  currentTurn,
}: Props) => {
  return (
    <div className="mb-8 inline-flex items-center gap-4 rounded-full border border-white/60 bg-white/70 px-6 py-4 shadow-lg backdrop-blur-xl">
      {/* Glow Dot */}
      <div
        className={`h-3 w-3 rounded-full ${
          currentTurn === "X"
            ? "bg-pink-400"
            : "bg-sky-400"
        }`}
      />

      <p className="font-medium text-slate-700">
        {currentTurn}'s turn
      </p>
    </div>
  );
};