"use client";

import { ReactNode } from "react";

import { AmbientBackground } from "./AmbientBackground";

import { TopBar } from "./TopBar";

interface Props {
  leftSidebar: ReactNode;

  rightSidebar: ReactNode;

  children: ReactNode;
}

export const GameLayout = ({
  leftSidebar,
  rightSidebar,
  children,
}: Props) => {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f7f4ff]">
      <AmbientBackground />

      <div className="relative z-10 flex min-h-screen flex-col">
        <TopBar />

        <div className="flex flex-1 items-center justify-center px-8 pb-8 pt-4">
<div className="grid w-full max-w-[1500px] gap-8 xl:grid-cols-[280px_1fr_280px]">
                {/* LEFT */}
            <div>{leftSidebar}</div>

            {/* CENTER */}
            <div className="flex items-center justify-center">
              {children}
            </div>

            {/* RIGHT */}
            <div>{rightSidebar}</div>
          </div>
        </div>
      </div>
    </main>
  );
};