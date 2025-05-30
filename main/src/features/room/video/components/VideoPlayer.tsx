"use client";
import Hls from "hls.js";
import { type ChangeEvent, type MouseEventHandler, type ReactNode, memo, useEffect, useRef, useState } from "react";

function ControlButton({
  children,
  onClick,
  small = false,
}: { children: ReactNode; onClick: MouseEventHandler<HTMLButtonElement>; small?: boolean }) {
  return (
    <button type="button" onClick={onClick} className={`${small ? "p-2.5" : "p-1.5"} w-12 h-12 cursor-pointer`}>
      <svg role="graphics-symbol" width="24" height="24" viewBox="0 0 24 24" fill="white" className={`${small ? "w-7 h-7" : "w-9 h-9"}`}>
        {children}
      </svg>
    </button>
  );
}

const TimeDisplay = memo(function TimeDisplay({ currentTime, maxTime }: { currentTime: number; maxTime: number }) {
  let diaplayTime = "";
  if (Number.isNaN(currentTime) || Number.isNaN(maxTime)) {
    diaplayTime = "00:00 / 00:00";
  } else {
    let nowS = Math.round(currentTime);
    let nowM = Math.floor(nowS / 60);
    nowS %= 60;
    const nowH = Math.floor(nowM / 60);
    nowM %= 60;

    let maxS = Math.round(maxTime);
    let maxM = Math.floor(maxS / 60);
    maxS %= 60;
    const maxH = Math.floor(maxM / 60);
    maxM %= 60;

    diaplayTime += nowH ? `${nowH}:` : "";
    diaplayTime += `${(`00${nowM}`).slice(-2)}:`;
    diaplayTime += `00${nowS}`.slice(-2);
    diaplayTime += " / ";
    diaplayTime += maxH ? `${maxH}:` : "";
    diaplayTime += `${(`00${maxM}`).slice(-2)}:`;
    diaplayTime += `00${maxS}`.slice(-2);
  }

  return (
    <div className="h-12 leading-12 px-[5px] text-sm text-white">
      <span>{diaplayTime}</span>
    </div>
  );
});

export function VideoPlayer({ src }: { src: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (Hls.isSupported() && videoRef.current) {
      const hls = new Hls();
      hls.loadSource(src);
      hls.attachMedia(videoRef.current);
    }
  }, [src]);

  const [videoCurrentTime, setVideoCurrentTime] = useState(0);
  const [videoMaxTime, setVideoMaxTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(100);
  const [isMute, setIsMute] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);

  useEffect(() => {
    const volume = Number(localStorage.getItem("volume"));
    setVolume(Number.isNaN(volume) ? 0 : volume);
    setIsMute(localStorage.getItem("mute") === "true");

    videoRef.current?.addEventListener("timeupdate", onVideoTimeUpdate);
    videoRef.current?.addEventListener("loadedmetadata", onVideoLoaded);

    return () => {
      videoRef.current?.removeEventListener("timeupdate", onVideoTimeUpdate);
      videoRef.current?.removeEventListener("loadedmetadata", onVideoLoaded);
    };
  }, []);

  useEffect(() => {
    if (isMute) {
      videoRef.current!.volume = 0;
    } else {
      videoRef.current!.volume = volume / 100;
    }
  }, [volume, isMute]);

  function onVideoLoaded() {
    if (!Number.isNaN(videoRef.current?.duration) && videoRef.current?.duration) {
      setVideoMaxTime(Math.round(videoRef.current?.duration));
    }
    onVideoTimeUpdate();
  }

  function onVideoTimeUpdate() {
    if (videoRef.current?.currentTime !== undefined) {
      setVideoCurrentTime(videoRef.current?.currentTime);
    }
  }

  function onChangeSeekbar(e: ChangeEvent<HTMLInputElement>) {
    const time = Number(e.target.value);
    videoRef.current!.currentTime = time;
    setVideoCurrentTime(time);
  }

  function onChangeVolume(e: ChangeEvent<HTMLInputElement>) {
    const volume = Number(e.target.value);
    if (volume !== 0 && isMute) {
      setIsMute((mute) => {
        localStorage.setItem("mute", String(!mute));
        return !mute;
      });
    }
    setVolume(volume);
    localStorage.setItem("volume", e.target.value);
  }

  function onMouseDownSeekbar() {
    videoRef.current?.pause();
  }

  function onMouseUpSeekbar() {
    if (isPlaying) {
      videoRef.current?.play();
    }
  }

  function onClickPlayStop() {
    setIsPlaying((playing) => {
      if (playing) {
        videoRef.current?.pause();
      } else {
        videoRef.current?.play();
      }
      return !playing;
    });
  }

  function onClickBack() {
    if (videoRef.current!.currentTime - 5 < 0) {
      videoRef.current!.currentTime = 0;
    } else {
      videoRef.current!.currentTime -= 5;
    }
    onVideoTimeUpdate();
  }

  function onClickForward() {
    if (!videoRef.current?.duration) return;
    if (videoRef.current!.currentTime + 5 > videoRef.current?.duration) {
      videoRef.current!.currentTime = videoRef.current?.duration;
    } else {
      videoRef.current!.currentTime += 5;
    }
    onVideoTimeUpdate();
  }

  function onClickMute() {
    if (volume === 0) return;
    setIsMute((mute) => {
      localStorage.setItem("mute", String(!mute));
      return !mute;
    });
  }

  function onClickFullScreen() {
    if (isFullScreen) {
      document.exitFullscreen().then(() => {
        setIsFullScreen(false);
      });
    } else {
      containerRef.current?.requestFullscreen().then(() => {
        setIsFullScreen(true);
      });
    }
  }

  return (
    <div ref={containerRef} className="w-[60%] relative z-10">
      {/* biome-ignore lint/a11y/useMediaCaption: <explanation> */}
      <video ref={videoRef} className="w-full h-full" />
      <div className="flex flex-col absolute w-full h-full top-0 left-0">
        <div className="grow" onClick={onClickPlayStop} />
        <div className="w-[calc(100%-24px)] h-4 mx-3 absolute bottom-12 hover:[&>div]:block hover:[&>div]:h-[5px] hover:[&>div]:bottom-[-1px] hover:cursor-pointer">
          <input
            type="range"
            max={videoMaxTime}
            onChange={onChangeSeekbar}
            onMouseDown={onMouseDownSeekbar}
            onMouseUp={onMouseUpSeekbar}
            className="w-full h-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-transparent"
          />
          <div className="w-full h-[3px] absolute bottom-0 bg-white/20 pointer-events-none select-none" />
          <div
            style={{ width: `${(videoCurrentTime / videoMaxTime) * 100}%` }}
            className="h-[3px] absolute bottom-0 bg-red-500 pointer-events-none select-none"
          />
          <div
            style={{ width: `${(videoCurrentTime / videoMaxTime) * 100}%` }}
            className="hidden h-[3px] absolute !bottom-0 pointer-events-none select-none"
          >
            <div className="w-[13px] h-[13px] absolute -right-1.5 -bottom-[5px] rounded-full bg-red-500 pointer-events-none select-none" />
          </div>
        </div>
        <div className="flex h-12 bg-black/5">
          <div className="flex flex-1 float-left">
            <ControlButton onClick={onClickPlayStop}>
              {isPlaying ? <path d="M14,19H18V5H14M6,19H10V5H6V19Z" /> : <path d="M8 5v14l11-7z" />}
            </ControlButton>
            <ControlButton onClick={onClickBack} small>
              <path d="M12.5 3C17.15 3 21.08 6.03 22.47 10.22L20.1 11C19.05 7.81 16.04 5.5 12.5 5.5C10.54 5.5 8.77 6.22 7.38 7.38L10 10H3V3L5.6 5.6C7.45 4 9.85 3 12.5 3M9 12H15V14H11V16H13C14.11 16 15 16.9 15 18V20C15 21.11 14.11 22 13 22H9V20H13V18H9V12Z" />
            </ControlButton>
            <ControlButton onClick={onClickForward} small>
              <path d="M11.5 3C14.15 3 16.55 4 18.4 5.6L21 3V10H14L16.62 7.38C15.23 6.22 13.46 5.5 11.5 5.5C7.96 5.5 4.95 7.81 3.9 11L1.53 10.22C2.92 6.03 6.85 3 11.5 3M9 12H15V14H11V16H13C14.11 16 15 16.9 15 18V20C15 21.11 14.11 22 13 22H9V20H13V18H9V12Z" />
            </ControlButton>
            <div className="flex hover:[&>div]:block">
              <ControlButton onClick={onClickMute} small>
                {volume !== 0 && !isMute ? (
                  <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                ) : (
                  <path d="M3,9H7L12,4V20L7,15H3V9M16.59,12L14,9.41L15.41,8L18,10.59L20.59,8L22,9.41L19.41,12L22,14.59L20.59,16L18,13.41L15.41,16L14,14.59L16.59,12Z" />
                )}
              </ControlButton>
              <div className="hidden relative">
                <input
                  type="range"
                  max={100}
                  value={isMute ? 0 : volume}
                  onChange={onChangeVolume}
                  className="w-12 h-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
                />
                <div className="absolute w-full h-[3px] top-[22px] bg-white/20" />
                <div className="absolute h-[3px] top-[22px] bg-white" style={{ width: `${isMute ? 0 : volume}%` }} />
              </div>
            </div>
            <TimeDisplay currentTime={videoCurrentTime} maxTime={videoMaxTime} />
          </div>
          <div className="flex float-right">
            <ControlButton onClick={onClickFullScreen}>
              {isFullScreen ? (
                <path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z" />
              ) : (
                <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" />
              )}
            </ControlButton>
          </div>
        </div>
      </div>
    </div>
  );
}
