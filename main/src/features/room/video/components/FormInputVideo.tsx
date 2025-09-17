"use client";
import { type FieldMetadata, getInputProps } from "@conform-to/react";
import Hls from "hls.js";
import { type ChangeEvent, useCallback, useEffect, useRef, useState } from "react";
import { BasicButton } from "@/components/BasicButton";
import { ErrorMessage } from "@/components/form/FormErrorMessage";
import { formStyles } from "@/components/form/formStyles";
import { VideoPlayer } from "./VideoPlayer";

type FormInputVideoProps = {
  videoField: FieldMetadata;
  thumbnailField: FieldMetadata;
  initialVideoUrl?: string;
  initialThumbnailUrl?: string;
};

export function FormInputVideo({ videoField, thumbnailField, initialVideoUrl, initialThumbnailUrl }: FormInputVideoProps) {
  const [thumbnailSrc, setThumbnailSrc] = useState<string | undefined>(undefined);
  const videoRef = useRef<HTMLVideoElement>(null);
  const inputThumbnailRef = useRef<HTMLInputElement>(null);

  const loadInitialVideo = useCallback(() => {
    if (!videoRef.current || !initialVideoUrl) return;

    if (Hls.isSupported()) {
      videoRef.current.removeAttribute("src");
      const hls = new Hls();
      hls.loadSource(initialVideoUrl);
      hls.attachMedia(videoRef.current);
    } else {
      videoRef.current.setAttribute("src", initialVideoUrl);
    }
    videoRef.current.load();
  }, [initialVideoUrl]);

  function handleOnChangeVideo(e: ChangeEvent<HTMLInputElement>) {
    if (!videoRef.current) return;

    if (e.target.files !== undefined && e.target.files?.length === 1) {
      videoRef.current.setAttribute("src", URL.createObjectURL(e.target.files[0]));
    } else if (initialVideoUrl) {
      loadInitialVideo();
      return;
    } else {
      videoRef.current.removeAttribute("src");
    }
    videoRef.current.load();
  }

  function handleOnChangeThumbnail(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files.length !== 0) {
      setThumbnailSrc(URL.createObjectURL(e.target.files[0]));
    } else if (initialThumbnailUrl) {
      setThumbnailSrc(initialThumbnailUrl);
    } else {
      setThumbnailSrc(undefined);
    }
  }

  function loadThumbnailFromVideo(_e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    if (!videoRef.current) return;

    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas.getContext("2d")!.drawImage(videoRef.current, 0, 0, videoRef.current.videoWidth, videoRef.current.videoHeight);
    canvas.toBlob(
      (blob) => {
        if (!inputThumbnailRef.current || !blob) return;

        const dt = new DataTransfer();
        const file = new File([blob], "image.webp", { type: blob.type });
        setThumbnailSrc(URL.createObjectURL(file));

        dt.items.add(file);
        inputThumbnailRef.current.files = dt.files;
      },
      "image/webp",
      1,
    );
  }

  useEffect(() => {
    if (initialVideoUrl) {
      loadInitialVideo();
    }
  }, [initialVideoUrl, loadInitialVideo]);

  useEffect(() => {
    if (initialThumbnailUrl) {
      setThumbnailSrc(initialThumbnailUrl);
    }
  }, [initialThumbnailUrl]);

  return (
    <>
      <div className={formStyles.wrapper()}>
        <span className={formStyles.label()}>動画ファイル</span>
        <input
          {...getInputProps(videoField, { type: "file" })}
          accept="video/*"
          className="block w-full mt-1 file:h-8 cursor-pointer file:rounded-lg file:p-1.5 file:leading-4 file:bg-white file:border file:border-border-primary file:text-black hover:file:bg-hover-gray active:file:bg-active-gray file:cursor-pointer"
          onChange={handleOnChangeVideo}
        />
        <ErrorMessage message={videoField.errors} />
        <div className="mt-1">
          <VideoPlayer videoRef={videoRef} />
        </div>
      </div>
      <div className={formStyles.wrapper()}>
        <span className={formStyles.label()}>サムネイル</span>
        <input
          {...getInputProps(thumbnailField, { type: "file" })}
          accept="image/*"
          className="block w-full mt-1 file:h-8 cursor-pointer file:rounded-lg file:p-1.5 file:leading-4 file:bg-white file:border file:border-border-primary file:text-black hover:file:bg-hover-gray active:file:bg-active-gray file:cursor-pointer"
          onChange={handleOnChangeThumbnail}
          ref={inputThumbnailRef}
        />
        <BasicButton onClick={loadThumbnailFromVideo} className="h-8 mt-1 p-1.5 leading-4">
          動画からセーブ
        </BasicButton>
        <ErrorMessage message={thumbnailField.errors} />
        {thumbnailSrc ? <img src={thumbnailSrc} alt="thumbnail" className="w-full mt-1" /> : null}
      </div>
    </>
  );
}
