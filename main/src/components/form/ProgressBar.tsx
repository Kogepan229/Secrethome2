"use client";
import type { AxiosProgressEvent } from "axios";
import { useCallback, useMemo, useState } from "react";

const ProgressBar = ({ progress }: { progress: number }) => {
  return (
    <div id="progress_bar">
      <p>{progress}%</p>
      <progress value={progress} max="100" />
    </div>
  );
};

export const useProgressBar = (enabled: boolean) => {
  const [progress, setProgress] = useState(0);

  const focusProgressBar = useCallback(() => {
    window.location.hash = "progress_bar";
  }, []);

  const onProgress = useCallback((progressEvent: AxiosProgressEvent) => {
    if (!progressEvent.total) return;
    setProgress(Math.round((progressEvent.loaded / progressEvent.total) * 100));
  }, []);

  const progressBar = useMemo(() => (enabled ? <ProgressBar progress={progress} /> : null), [enabled, progress]);

  return {
    focusProgressBar: focusProgressBar,
    progressBar: progressBar,
    onProgress: onProgress,
  };
};
