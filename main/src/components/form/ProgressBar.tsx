"use client";
import type { AxiosProgressEvent } from "axios";
import { useCallback, useMemo, useRef, useState } from "react";

export const useProgressBar = (enabled: boolean) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  const focusProgressBar = useCallback(() => {
    scrollRef.current?.scrollIntoView();
  }, []);

  const onProgress = useCallback((progressEvent: AxiosProgressEvent) => {
    if (!progressEvent.total) return;
    setProgress(Math.round((progressEvent.loaded / progressEvent.total) * 100));
  }, []);

  const progressBar = useMemo(
    () =>
      enabled ? (
        <div ref={scrollRef}>
          <span>{progress}%</span>
          <progress value={progress} max="100" />
        </div>
      ) : null,
    [enabled, progress],
  );

  return {
    focusProgressBar: focusProgressBar,
    progressBar: progressBar,
    onProgress: onProgress,
  };
};
