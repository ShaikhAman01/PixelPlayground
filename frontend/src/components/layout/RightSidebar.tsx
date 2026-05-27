"use client";

import { useGameStore } from "@/store/game.store";

import { PlayerCard } from "../game/PlayerCard";

import { GlassPanel } from "../ui/GlassPanel";

import { SectionTitle } from "../ui/SectionTitle";

export const RightSidebar =
  () => {
    const {
      players,
      currentTurn,
    } = useGameStore();

    return (
      <GlassPanel className="p-6">
        {/* PLAYERS */}
        <div>
          <SectionTitle>
            Players
          </SectionTitle>

          <div className="space-y-4">
            {players.map(
              (player) => (
                <PlayerCard
                  key={
                    player.id
                  }
                  username={
                    player.username
                  }
                  symbol={
                    player.symbol
                  }
                  active={
                    currentTurn ===
                    player.symbol
                  }
                />
              )
            )}
          </div>
        </div>

        {/* Divider */}
        <div className="my-8 h-px bg-slate-200" />

        {/* SCORE */}
        <div>
          <SectionTitle>
            Score
          </SectionTitle>

          <div className="grid grid-cols-2 gap-4">
            {players.map(
              (player) => (
                <div
                  key={
                    player.id
                  }
                  className="rounded-3xl bg-white/60 p-5 text-center"
                >
                  <div className="font-[family:var(--font-pixel)] text-4xl text-slate-700">
                    0
                  </div>

                  <p className="mt-2 text-sm text-slate-400">
                    {
                      player.username
                    }
                  </p>
                </div>
              )
            )}
          </div>
        </div>

        {/* Divider */}
        <div className="my-8 h-px bg-slate-200" />

        {/* INFO */}
        <div>
          <SectionTitle>
            Game Info
          </SectionTitle>

          <div className="rounded-3xl bg-white/60 p-5">
            <p className="text-slate-600">
              First to 3 wins.
            </p>

            <p className="mt-2 text-sm text-slate-400">
              have fun & be kind ✨
            </p>
          </div>
        </div>
      </GlassPanel>
    );
  };