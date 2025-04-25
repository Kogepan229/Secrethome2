"use client";
import { createHash } from "node:crypto";
import { createId } from "@paralleldrive/cuid2";
import axios, { type AxiosResponse } from "axios";
import { type MouseEvent, useRef } from "react";

const CHUNK_SIZE = 1024 * 1024 * 2;
const POOL_SIZE = 5;

async function calcHash(file: File) {
  const hash = createHash("sha256");

  const reader = file.stream().getReader();
  while (true) {
    const value = await reader.read();
    if (!value.value || value.done) {
      break;
    }
    hash.update(value.value);
  }
  // console.log("hash", hash.digest("hex"));
  return hash.digest("hex");
}

export default function TestUploadVideoPage() {
  const inputRef = useRef<null | HTMLInputElement>(null);

  async function handleSubmit(e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault();

    if (!inputRef.current) return;
    const files = inputRef.current.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const contentID = createId();

    const startData = new FormData();
    startData.append("id", contentID);
    console.log(String(Math.ceil(file.size / CHUNK_SIZE)));
    startData.append("totalChunk", String(Math.ceil(file.size / CHUNK_SIZE)));
    startData.append("fileHash", await calcHash(file));
    const res = await axios.post("http://localhost:20080/video/upload/start", startData);
    if (res.status !== 200) {
      return;
    }

    const pool: Promise<AxiosResponse>[] = [];
    let errorOccurred = false;
    let start = 0;
    let chunkIndex = 0;

    while (start < file.size && !errorOccurred) {
      const end = Math.min(start + CHUNK_SIZE, file.size);
      const chunk = file.slice(start, end);
      const chunkData = new FormData();
      chunkData.append("id", contentID);
      chunkData.append("index", String(chunkIndex));
      chunkData.append("chunk", chunk);

      start += CHUNK_SIZE;
      chunkIndex++;

      const task = axios({ method: "post", url: "http://localhost:20080/video/upload/chunk", data: chunkData });

      task
        .then((res) => {
          const index = pool.findIndex((t) => t === task);
          pool.splice(index);
        })
        .catch((err) => {
          errorOccurred = true;
          console.error(err);
        });

      pool.push(task);

      if (pool.length === POOL_SIZE) {
        await Promise.race(pool);
      }
    }
  }

  return (
    <form>
      <input type="file" accept="video/mp4" ref={inputRef} />
      <button type="button" onClick={handleSubmit}>
        submit
      </button>
    </form>
  );
}
