"use client";

import { useState } from "react";
import { X, Music, SlidersHorizontal, Info } from "lucide-react";
import { playlist } from "@/store/audio.store";

export const AudioCreditsModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"music" | "ambient">("music");

  const ambientCredits = [
    {
      name: "Rain",
      html: `Sound Effect by <a href="https://pixabay.com/users/dragon-studio-38165424/?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=444802" target="_blank" rel="noopener noreferrer" class="text-violet-500 hover:underline">DRAGON-STUDIO</a> from <a href="https://pixabay.com/sound-effects//?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=444802" target="_blank" rel="noopener noreferrer" class="text-violet-500 hover:underline">Pixabay</a>`
    },
    {
      name: "Wind",
      html: `Sound Effect by <a href="https://pixabay.com/users/soundreality-31074404/?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=457954" target="_blank" rel="noopener noreferrer" class="text-violet-500 hover:underline">Jurij</a> from <a href="https://pixabay.com//?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=457954" target="_blank" rel="noopener noreferrer" class="text-violet-500 hover:underline">Pixabay</a>`
    },
    {
      name: "Fireplace",
      html: `Sound Effect by <a href="https://pixabay.com/users/soundreality-31074404/?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=499636" target="_blank" rel="noopener noreferrer" class="text-violet-500 hover:underline">Jurij</a> from <a href="https://pixabay.com//?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=499636" target="_blank" rel="noopener noreferrer" class="text-violet-500 hover:underline">Pixabay</a>`
    },
    {
      name: "Café",
      html: `Sound Effect by <a href="https://pixabay.com/users/freesound_community-46691455/?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=32940" target="_blank" rel="noopener noreferrer" class="text-violet-500 hover:underline">freesound_community</a> from <a href="https://pixabay.com//?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=32940" target="_blank" rel="noopener noreferrer" class="text-violet-500 hover:underline">Pixabay</a>`
    },
    {
      name: "Birds",
      html: `Sound Effect by <a href="https://pixabay.com/users/freesound_community-46691455/?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=19624" target="_blank" rel="noopener noreferrer" class="text-violet-500 hover:underline">freesound_community</a> from <a href="https://pixabay.com//?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=19624" target="_blank" rel="noopener noreferrer" class="text-violet-500 hover:underline">Pixabay</a>`
    },
    {
      name: "Waves",
      html: `Sound Effect by <a href="https://pixabay.com/users/freesound_community-46691455/?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=53479" target="_blank" rel="noopener noreferrer" class="text-violet-500 hover:underline">freesound_community</a> from <a href="https://pixabay.com/sound-effects//?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=53479" target="_blank" rel="noopener noreferrer" class="text-violet-500 hover:underline">Pixabay</a>`
    }
  ];

  return (
    <>
      {/* Structural Header Button Trigger: Blends natively into default dark/light navigation lines */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 bg-white/50 text-slate-600 shadow-sm transition-all hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950/40 dark:text-slate-400 dark:hover:bg-slate-900/60 cursor-pointer flex-shrink-0"
        title="Audio Credits"
        aria-label="View Audio Attributions"
      >
        <Info className="h-4 w-4" />
      </button>

      {/* Screen Backdrop Overlay */}
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-slate-950/40 backdrop-blur-sm px-4 z-[100]">
          <div className="w-full max-w-md rounded-2xl border border-white/80 bg-white/85 p-5 sm:p-6 shadow-xl dark:border-white/10 dark:bg-slate-900/90 text-slate-800 dark:text-slate-100 backdrop-blur-2xl">
            
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-sans text-base font-black uppercase tracking-wide">Audio Attributions</h3>
              <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-1 bg-slate-950/5 dark:bg-white/[0.04] border border-slate-950/5 dark:border-white/[0.04] rounded-xl p-0.5 mb-4">
              <button
                onClick={() => setActiveTab("music")}
                className={`flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold uppercase tracking-wide transition-all cursor-pointer ${
                  activeTab === "music"
                    ? "bg-white dark:bg-white/10 text-slate-950 dark:text-white shadow-sm"
                    : "text-slate-500 dark:text-zinc-400 hover:text-slate-800 dark:hover:text-zinc-200"
                }`}
              >
                <Music className="w-3.5 h-3.5" />
                <span>Music</span>
              </button>
              <button
                onClick={() => setActiveTab("ambient")}
                className={`flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold uppercase tracking-wide transition-all cursor-pointer ${
                  activeTab === "ambient"
                    ? "bg-white dark:bg-white/10 text-slate-950 dark:text-white shadow-sm"
                    : "text-slate-500 dark:text-zinc-400 hover:text-slate-800 dark:hover:text-zinc-200"
                }`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Ambient</span>
              </button>
            </div>

            <div className="space-y-4 max-h-[280px] overflow-y-auto pr-1" style={{ scrollbarWidth: "thin" }}>
              {activeTab === "music" ? (
                playlist.map((track, i) => (
                  <div key={i} className="border-b border-slate-200/50 dark:border-slate-800/60 pb-3 last:border-0 last:pb-0">
                    <p className="text-xs font-bold truncate uppercase tracking-wide text-slate-900 dark:text-zinc-100">{track.title}</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      Artist:{" "}
                      <a href={track.creditUrl} target="_blank" rel="noopener noreferrer" className="text-violet-500 hover:underline font-medium">
                        {track.artist}
                      </a>
                    </p>
                    <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
                      Licensed via <span className="font-medium">{track.source ?? "Radio Hub"}</span>
                      {track.license && (
                        <>
                          {" "}under{" "}
                          <a href={track.license} target="_blank" rel="noopener noreferrer" className="underline hover:text-slate-500">
                            License
                          </a>
                        </>
                      )}
                    </p>
                  </div>
                ))
              ) : (
                ambientCredits.map((effect, i) => (
                  <div key={i} className="border-b border-slate-200/50 dark:border-slate-800/60 pb-3 last:border-0 last:pb-0">
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-900 dark:text-zinc-100 mb-1">
                      {effect.name} Element
                    </p>
                    <p 
                      className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed font-sans"
                      dangerouslySetInnerHTML={{ __html: effect.html }}
                    />
                  </div>
                ))
              )}
            </div>

          </div>
        </div>
      )}
    </>
  );
};