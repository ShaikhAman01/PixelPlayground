"use client";

import { useState } from "react";
import { Info, X } from "lucide-react";
import { playlist } from "@/store/audio.store";

export const AudioCreditsModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-4 left-4 z-50 pointer-events-auto">
      {/* Icon Trigger Button */}
      <button 
        onClick={() => setIsOpen(true)}
        className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/60 bg-white/70 text-slate-600 shadow-sm backdrop-blur-md hover:scale-105 transition-all"
        aria-label="View Audio Attributions"
      >
        <Info className="h-4 w-4" />
      </button>

      {/* Modal Backdrop Container */}
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-slate-950/20 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-white/80 bg-white/85 p-6 shadow-xl dark:border-white/10 dark:bg-slate-900/90 text-slate-800 dark:text-slate-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-[family:var(--font-pixel)] text-lg font-bold">Audio Track Credits</h3>
              <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
              {playlist.map((track, i) => (
                <div key={i} className="border-b border-slate-200/50 dark:border-slate-800/60 pb-3 last:border-0 last:pb-0">
                  <p className="text-xs font-bold truncate">{track.title}</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Artist:{" "}
                    <a href={track.creditUrl} target="_blank" rel="noopener noreferrer" className="text-violet-500 hover:underline font-medium">
                      {track.artist}
                    </a>
                  </p>
                  <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
                    Licensed via <span className="font-medium">{track.source}</span> under{" "}
                    {track.license ? (
                      <a href={track.license} target="_blank" rel="noopener noreferrer" className="underline hover:text-slate-500">
                        {track.license}
                      </a>
                    ) : (
                      <span>{track.license}</span>
                    )}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};