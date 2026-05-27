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
        <div className="absolute inset-0 bg-gradient-to-b from-[#efe8ff] via-[#fdf7f4] to-[#f5f2ff]" />


        {/* SUNSET GLOW */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,220,180,0.35),transparent_40%)]" />

        {/* MOUNTAIN LAYER */}
        <div className="absolute bottom-0 h-[35%] w-full bg-gradient-to-t from-violet-200/40 to-transparent" />

        {/* WATER LAYER */}
        <div className="absolute bottom-0 h-[25%] w-full bg-gradient-to-t from-sky-100/40 to-transparent backdrop-blur-sm" />

        {/* CLOUDS */}
        <FloatingClouds />

        {/* SPARKLES */}
        <Sparkles />

        {/* FOOTER */}
        <CozyFooter />
      </div>
    );
  };