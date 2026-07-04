"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/auth.store";

/** Silently establishes a guest session on first visit. Renders nothing. */
export const SessionBootstrap = () => {
  const ensureSession = useAuthStore((s) => s.ensureSession);

  useEffect(() => {
    void ensureSession();
  }, [ensureSession]);

  return null;
};
