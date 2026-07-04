"use client";

import { Toaster } from "sonner";
import { CheckCircle2, Info, XCircle } from "lucide-react";
import { useTheme } from "./ThemeProvider";

/** Sonner toaster restyled to match the cozy arcade cards. */
export const ThemedToaster = () => {
  const { theme } = useTheme();

  return (
    <Toaster
      position="bottom-center"
      theme={theme}
      gap={8}
      icons={{
        success: <CheckCircle2 className="h-4 w-4 text-emerald-500" />,
        info: <Info className="h-4 w-4 text-sky-500" />,
        error: <XCircle className="h-4 w-4 text-rose-500" />,
      }}
      toastOptions={{
        unstyled: true,
        classNames: {
          toast:
            "w-[320px] sm:w-[356px] flex items-center gap-2.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-amber-50/95 dark:bg-zinc-900/95 backdrop-blur-xl px-4 py-3 shadow-lg font-sans select-none",
          title: "text-xs font-bold text-zinc-800 dark:text-zinc-100",
          description: "text-[11px] font-medium text-zinc-500 dark:text-zinc-400",
          icon: "shrink-0 flex items-center",
        },
      }}
    />
  );
};
