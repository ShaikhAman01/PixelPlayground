import { CozyFooter } from "../ambient/CozyFooter";
import { FloatingClouds } from "../ambient/FloatingClouds";

export const AmbientBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden select-none pointer-events-none">
      {/* 1. SKY GRADIENT (Matches the dreamy lavender-to-peach sunset) */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#D2E0FB] via-[#F9F3CC] to-[#F6F1F3]" />

      {/* 2. SUNSET RADIAL GLOW */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(255,200,180,0.4),transparent_60%)]" />

      {/* 3. DISTANT MOUNTAINS / LAYER (Figma Asset Hook) */}
      {/* Tip: Replace this div with an absolute <img src="/pixel-mountains.png" className="absolute bottom-[20%] w-full object-cover" /> later */}
      <div className="absolute bottom-[15%] h-[30%] w-full bg-gradient-to-t from-[#E8A0BF]/30 via-[#C0DBEA]/20 to-transparent" />

      {/* 4. DYNAMIC CLOUDS SIMULATION */}
      <FloatingClouds />

      {/* 5. WATER / HORIZON BLUR BLEND */}
      <div className="absolute bottom-0 h-[22%] w-full bg-gradient-to-t from-[#B9F3FC]/30 to-transparent backdrop-blur-[2px]" />

      {/* 6. IMMERSIVE FOREGROUND PIXEL DECK (Anchors visual assets perfectly) */}
      <div className="absolute bottom-0 left-0 right-0 h-[10%] bg-gradient-to-b from-[#E5D1FA]/40 to-[#FFF2CC]/30 border-t-4 border-white/40 backdrop-blur-sm">
        <div className="relative w-full h-full max-w-[1400px] mx-auto px-8">
          {/* Asset Hooks: These will securely track along the bottom layer just like the cat/mug in your image */}
          <div className="absolute -top-12 left-12 animate-bounce [animation-duration:4s]">
            {/* Replace this span with a cozy pixel art coffee mug SVG later */}
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