import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export const SectionTitle = ({
  children,
}: Props) => {
  return (
    <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
      {children}
    </h3>
  );
};