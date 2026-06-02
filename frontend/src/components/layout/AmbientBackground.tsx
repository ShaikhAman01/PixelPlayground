import { CozyFooter } from "../ambient/CozyFooter";
import { FloatingClouds } from "../ambient/FloatingClouds";

export const AmbientBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden select-none pointer-events-none">
      {/* 1. SKY GRADIENT */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#D2E0FB] via-[#F9F3CC] to-[#F6F1F3] dark:from-[#090514] dark:via-[#0d0c22] dark:to-[#110e2e] transition-all duration-500" />

      {/* 2. SUNSET RADIAL GLOW */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(255,200,180,0.4),transparent_60%)] dark:bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.15),transparent_45%)] transition-all duration-500" />

      {/* 3. DISTANT MOUNTAINS / LAYER */}
      <div className="absolute bottom-[15%] h-[30%] w-full bg-gradient-to-t from-[#E8A0BF]/30 via-[#C0DBEA]/20 to-transparent dark:from-violet-950/10 transition-all duration-500" />

      {/* 4. DYNAMIC CLOUDS SIMULATION */}
      <FloatingClouds />

      {/* 5. WATER / HORIZON BLUR BLEND */}
      <div className="absolute bottom-0 h-[22%] w-full bg-gradient-to-t from-[#B9F3FC]/30 to-transparent dark:from-sky-950/15 backdrop-blur-[2px] transition-all duration-500" />

      {/* 6. IMMERSIVE FOREGROUND PIXEL DECK */}
      <div className="absolute bottom-0 left-0 right-0 h-[10%] bg-gradient-to-b from-[#E5D1FA]/40 to-[#FFF2CC]/30 dark:from-slate-900/20 dark:to-transparent border-t-4 border-white/40 dark:border-white/5 backdrop-blur-sm transition-all duration-500">
        <div className="relative w-full h-full max-w-[1400px] mx-auto px-8">
          <div className="absolute -top-12 left-12 animate-bounce [animation-duration:4s]">
            <span className="text-3xl filter drop-shadow-md">☕</span>
          </div>
          <div className="absolute -top-10 right-16 hover:scale-110 transition-transform duration-300 pointer-events-auto cursor-pointer">
            <span className="text-4xl filter drop-shadow-md">🐱</span>
          </div>
        </div>
      </div>

      {/* 7. REUSABLE CUSTOM FOOTER */}
      <CozyFooter />
    </div>
  );
};