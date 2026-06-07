"use client";

import { useEffect, useState, useCallback } from "react";

interface Options {
  autoStart?: boolean;
}

export const useTimer = (options?: Options) => {
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(options?.autoStart ?? false);

  // TIMER LOOP
  useEffect(() => {
    if (!running) return;

    const interval = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [running]);

  // FIXED: Memoized with useCallback
  const start = useCallback(() => {
    setRunning(true);
  }, []);

  // FIXED: Memoized with useCallback
  const pause = useCallback(() => {
    setRunning(false);
  }, []);

  // FIXED: Memoized with useCallback
  const reset = useCallback(() => {
    setSeconds(0);
  }, []);

// FORMAT TIME
const formattedTime = `${Math.floor(seconds / 60).toString().padStart(2, "0")}:${(seconds % 60).toString().padStart(2, "0")}`;  
  return {
    seconds,
    formattedTime,
    running,
    start,
    pause,
    reset,
  };
};