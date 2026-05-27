"use client";

import { Copy } from "lucide-react";

import { GlassPanel } from "../ui/GlassPanel";

import { SectionTitle } from "../ui/SectionTitle";

import { toast } from "sonner";

interface Props {
  roomId: string;
}

export const LeftSidebar = ({
  roomId,
}: Props) => {
  const copyRoomCode =
    async () => {
      await navigator.clipboard.writeText(
        roomId
      );
      toast.success(
  "room code copied ✨"
);
    };

  return (
    <GlassPanel className="p-6">
      {/* ROOM */}
      <div>
        <SectionTitle>
          Room
        </SectionTitle>

        <div className="space-y-4">
          <div>
            <h2 className="font-[family:var(--font-pixel)] text-4xl text-slate-700">
              {roomId}
            </h2>

            <p className="mt-2 text-sm text-slate-400">
              Share this code with friends
            </p>
          </div>

          <button
            onClick={
              copyRoomCode
            }
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-violet-400 px-4 py-4 font-medium text-white shadow-lg shadow-violet-200 transition hover:scale-[1.02] hover:bg-violet-500"
          >
            <Copy className="h-4 w-4" />

            Copy Code
          </button>
        </div>
      </div>

      {/* Divider */}
      <div className="my-8 h-px bg-slate-200" />

      {/* GAME */}
      <div>
        <SectionTitle>
          Game
        </SectionTitle>

        <div className="rounded-2xl border border-slate-200 bg-white/70 p-4">
          <p className="font-medium text-slate-700">
            Tic Tac Toe
          </p>

          <p className="mt-1 text-sm text-slate-400">
            cozy classic multiplayer
          </p>
        </div>
      </div>

      {/* Divider */}
      <div className="my-8 h-px bg-slate-200" />

      {/* SETTINGS */}
      <div>
        <SectionTitle>
          Settings
        </SectionTitle>

        <div className="space-y-4">
          {[
            "Music",
            "SFX",
            "Cozy Mode",
          ].map((item) => (
            <div
              key={item}
              className="flex items-center justify-between rounded-2xl bg-white/50 px-4 py-3"
            >
              <span className="text-slate-600">
                {item}
              </span>

              <div className="h-6 w-11 rounded-full bg-violet-400 p-1">
                <div className="h-4 w-4 rounded-full bg-white" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cozy Footer */}
      <div className="mt-10 flex items-center justify-between rounded-2xl bg-pink-50 p-4">
        <div>
          <p className="text-sm text-slate-500">
            tiny cozy vibes ✨
          </p>
        </div>

        <div className="text-3xl">
          🐱
        </div>
      </div>
    </GlassPanel>
  );
};