import { cn } from "@/lib/utils";

import { ReactNode } from "react";

interface Props {
  children: ReactNode;

  className?: string;
}

export const GlassPanel = ({
  children,
  className,
}: Props) => {
  return (
    <div
      className={cn(
        "rounded-[32px] border border-white/60 bg-white/65 shadow-[0_10px_40px_rgba(0,0,0,0.08)] backdrop-blur-xl",
        className
      )}
    >
      {children}
    </div>
  );
};