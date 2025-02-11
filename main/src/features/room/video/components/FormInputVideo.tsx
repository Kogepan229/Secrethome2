"use client";
import { type FieldMetadata, getInputProps } from "@conform-to/react";
import { type ChangeEvent, useRef, useState } from "react";

import { ErrorMessage } from "@/components/form/FormErrorMessage";
import * as formCss from "@/components/form/form.css";
import * as css from "./FormInputVideo.css";

export function FormInputVideo({ videoField, thumbnailField }: { videoField: FieldMetadata; thumbnailField: FieldMetadata }) {
  const [thumbnailSrc, setThumbnailSrc] = useState<string | undefined>(undefined);
  const videoRef = useRef<HTMLVideoElement>(null);
  const inputThumbnailRef = useRef<HTMLInputElement>(null);

  function handleOnChangeVideo(e: ChangeEvent<HTMLInputElement>) {
    if (!videoRef.current) return;

    if (e.target.files === undefined || e.target.files?.length !== 1) {
      videoRef.current.removeAttribute("src");
    } else {
      videoRef.current.setAttribute("src", URL.createObjectURL(e.target.files[0]));
    }

    videoRef.current.load();
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
      <div className={formCss.wrapper}>
        <label className={formCss.label}>
          {"動画ファイル"}
          <input
            {...getInputProps(videoField, { type: "file" })}
            accept="video/*"
            className={css.input_video}
            onChange={handleOnChangeVideo}
          />
        </label>
        <ErrorMessage message={videoField.errors} />
        {/* biome-ignore lint/a11y/useMediaCaption: <explanation> */}
        <video controls playsInline ref={videoRef} className={css.video} />
      </div>
      <button onClick={loadThumbnailFromVideo} type="button">
        bu
      </button>
      <div className={formCss.wrapper}>
        <label className={formCss.label}>
          {"サムネイル"}
          <input
            {...getInputProps(thumbnailField, { type: "file" })}
            accept="image/*"
            className={css.input_thumbnail}
            onChange={handleOnChangeThumbnail}
            ref={inputThumbnailRef}
          />
        </label>
        <ErrorMessage message={thumbnailField.errors} />
        {thumbnailField.value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={thumbnailSrc} alt="thumbnail" className={css.thumbnail} />
        ) : null}
      </div>
    </>
  );
}
