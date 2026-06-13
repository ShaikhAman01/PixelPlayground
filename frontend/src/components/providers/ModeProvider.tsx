"use client";

import React, { createContext, useContext, useState } from "react";

type ActiveMode = "play" | "chill";

interface ModeContextType {
  mode: ActiveMode;
  setMode: (mode: ActiveMode) => void;
}

const ModeContext = createContext<ModeContextType | undefined>(undefined);

export const ModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<ActiveMode>("play");

  return (
    <ModeContext.Provider value={{ mode, setMode }}>
      {children}
    </ModeContext.Provider>
  );
};

export const useMode = () => {
  const context = useContext(ModeContext);
  if (!context) {
    throw new Error("useMode must be processed inside a valid ModeProvider scope");
  }
  return context;
};