import { CozyFooter } from "../ambient/CozyFooter";

import { FloatingClouds } from "../ambient/FloatingClouds";

import { Sparkles } from "../ambient/Sparkles";

import { FloatingMascot } from "../ambient/FloatingMascot";

export const AmbientBackground =
  () => {
    return (
      <div className="absolute inset-0 overflow-hidden">

              {/* <FloatingMascot /> */}
              
        {/* SKY */}
        <div className="sky-bg absolute inset-0 bg-gradient-to-b from-[#f7f1ff] via-[#fdf9f7] to-[#f8f5ff] transition-all duration-500 dark:from-[#090514] dark:via-[#0d0c22] dark:to-[#110e2e]" />

        {/* SUNSET GLOW */}
        <div className="sunset-glow absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,220,180,0.35),transparent_40%)] transition-all duration-500 dark:bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.15),transparent_45%)]" />

        {/* MOUNTAIN LAYER */}
        <div className="mountain-layer absolute bottom-0 h-[35%] w-full bg-gradient-to-t from-violet-200/40 to-transparent transition-all duration-500 dark:from-violet-950/20" />

        {/* WATER LAYER */}
        <div className="water-layer absolute bottom-0 h-[25%] w-full bg-gradient-to-t from-sky-100/40 to-transparent backdrop-blur-sm transition-all duration-500 dark:from-sky-950/25" />

        {/* CLOUDS */}
        <FloatingClouds />

        {/* FOOTER */}
        <CozyFooter />
      </div>
    );
  };