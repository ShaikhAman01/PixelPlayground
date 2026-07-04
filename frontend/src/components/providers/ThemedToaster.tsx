"use client";

import { Toaster } from "sonner";
import { CheckCircle2, Info, XCircle } from "lucide-react";
import { useTheme } from "./ThemeProvider";

/**
 * Sonner toaster with a cozy lofi feel: soft warm pill, gentle glow,
 * relaxed typography — a hum, not an alert.
 */
export const ThemedToaster = () => {
  const { theme } = useTheme();

  return (
    <Toaster
      position="bottom-center"
      theme={theme}
      gap={10}
      icons={{
        success: <CheckCircle2 className="h-4 w-4 text-emerald-400/90" />,
        info: <Info className="h-4 w-4 text-sky-400/90" />,
        error: <XCircle className="h-4 w-4 text-rose-400/90" />,
      }}
      toastOptions={{
        unstyled: true,
        duration: 3000,
        classNames: {
          toast: [
            "w-fit max-w-[340px] mx-auto flex items-center gap-2.5 rounded-full px-5 py-3 select-none font-sans backdrop-blur-2xl",
            // light: warm sunset haze
            "border border-amber-200/70 bg-gradient-to-r from-amber-50/95 via-orange-50/95 to-amber-50/95",
            "shadow-[0_10px_36px_rgba(217,119,6,0.14)]",
            // dark: late-night desk glow
            "dark:border-white/[0.08] dark:from-zinc-900/95 dark:via-[#1c1626]/95 dark:to-zinc-900/95",
            "dark:shadow-[0_10px_40px_rgba(167,139,250,0.12)]",
          ].join(" "),
          title:
            "text-xs font-semibold tracking-wide text-stone-700 dark:text-zinc-200 whitespace-nowrap",
          description: "text-[11px] font-medium text-stone-500 dark:text-zinc-400",
          icon: "shrink-0 flex items-center",
        },
      }}
    />
  );
};
