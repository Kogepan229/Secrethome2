"use client";
import Hls from "hls.js";
import { useEffect, useRef } from "react";

export function VideoPlayer({ src }: { src: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (Hls.isSupported() && videoRef.current) {
      const hls = new Hls();
      hls.loadSource(src);
      hls.attachMedia(videoRef.current);
    }
  }, [src]);

  // biome-ignore lint/a11y/useMediaCaption: <explanation>
  return <video ref={videoRef} controls />;
}
