"use client";
import { type FieldMetadata, getInputProps } from "@conform-to/react";
import { type ChangeEvent, useRef, useState } from "react";

import { BasicButton } from "@/components/BasicButton";
import { ErrorMessage } from "@/components/form/FormErrorMessage";
import { formStyles } from "@/components/form/formStyles";
import { VideoPlayer } from "./VideoPlayer";

export function FormInputVideo({ videoField, thumbnailField }: { videoField: FieldMetadata; thumbnailField: FieldMetadata }) {
  const [thumbnailSrc, setThumbnailSrc] = useState<string | undefined>(undefined);
  const videoRef = useRef<HTMLVideoElement>(null);
  const inputThumbnailRef = useRef<HTMLInputElement>(null);

  function handleOnChangeVideo(e: ChangeEvent<HTMLInputElement>) {
    if (!videoRef.current) return;

    if (e.target.files !== undefined && e.target.files?.length === 1) {
      videoRef.current.setAttribute("src", URL.createObjectURL(e.target.files[0]));
      videoRef.current.load();
    }
  }

  function handleOnChangeThumbnail(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files.length !== 0) {
      setThumbnailSrc(URL.createObjectURL(e.target.files[0]));
    }
  }

  function loadThumbnailFromVideo(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
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
        {thumbnailField.value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={thumbnailSrc} alt="thumbnail" className="w-full mt-1" />
        ) : null}
      </div>
    </>
  );
}
