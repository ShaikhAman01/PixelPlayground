"use client";

import { MotionConfig } from "framer-motion";

/** Makes every framer-motion animation respect prefers-reduced-motion. */
export const MotionProvider = ({ children }: { children: React.ReactNode }) => (
  <MotionConfig reducedMotion="user">{children}</MotionConfig>
);
